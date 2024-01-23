const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Question = require("../models/Question");
const Video = require("../models/Post_Detail");
const User = require("../models/User");
const fs = require("fs");

function nonAccentVietnamese(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

// @route GET api/questions
// @desc Get questions
// @access Public
router.get("", async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json({ success: true, questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route GET api/questions
// @desc Get questions by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const questions = await Question.find({ post: req.params.id });
    res.json({ success: true, questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/questions
// @desc Create questions
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { title, choice, postid, answer, attachments, base64 } = req.body;
  try {
    const newQuestion = new Question({
      title,
      attachments: base64,
      post: postid,
      choice,
      answer,
    });

    await newQuestion.save();

    res.json({
      success: true,
      message: "Thêm câu hỏi mới thành công!",
      question: newQuestion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route PUT api/videos
// @desc Update video
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { title, choice, post, answer, attachments } = req.body;
  try {
    const questionsUpdateCondition = { _id: req.params.id };

    let updatedQuestion = {
      title,
      attachments,
      post,
      choice,
      answer,
    };

    updatedQuestion = await Question.findOneAndUpdate(
      questionsUpdateCondition,
      updatedQuestion,
      { new: true }
    );

    // Người dùng không được phép cập nhật câu hỏi hoặc không tìm thấy câu hỏi
    if (!updatedQuestion)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy câu hỏi hoặc người dùng không được ủy quyền",
      });

    res.json({
      success: true,
      message: "Sửa câu hỏi mới thành công!",
      question: updatedQuestion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route DELETE api/questions
// @desc Delete question
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const questionDeleteCondition = { _id: req.params.id };
    const dir = await Question.findById(questionDeleteCondition);
    const deletedQuestion = await Question.findOneAndDelete(
      questionDeleteCondition
    );

    if (!deletedQuestion)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy video hoặc người dùng không được ủy quyền",
      });
    // Xóa file tệp đính kèm nếu tồn tại
    if (fs.existsSync(dir.attachments)) {
      fs.unlink(dir.video, function (err) {
        if (err) throw err;
      });
    }

    res.json({ success: true, video: deletedQuestion });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
