const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

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

// @route GET api/videos
// @desc Get videos
// @access Public
router.get("", async (req, res) => {
  try {
    const videos = await Video.find({}).sort({
      createdAt: +1,
    });
    res.json({ success: true, videos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route GET api/videos
// @desc Get videos by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const videos = await Video.find({ post: req.params.id }).sort({
      createdAt: +1,
    });
    res.json({ success: true, videos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/videos
// @desc Create video
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { title, video, postid, base64 } = req.body;
  try {
    const randomId =
      new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    const dir = "./filevideo/" + postid;
    let str = nonAccentVietnamese(title);
    str = str.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "");
    const fileName =
      dir + "/" + str + "_" + req.userId + "_" + randomId + ".mp4";
    if (video === "base64") {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      let data = base64.split(",")[1];
      fs.writeFile(fileName, data, "base64", function (err) {
        if (err) console.log(err);
      });
    }
    const newVideo = new Video({
      title,
      video: video !== "base64" ? video : fileName,
      user: req.userId,
      post: postid,
    });

    await newVideo.save();

    res.json({
      success: true,
      message: "Thêm video bài học thành công!",
      video: newVideo,
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
  const { title, video, post, base64 } = req.body;

  try {
    const videoUpdateCondition = { _id: req.params.id };

    const randomId =
      new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    const dir = "./filevideo/" + post;
    let str = nonAccentVietnamese(title);
    str = str.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "");
    const fileName =
      dir + "/" + str + "_" + req.userId + "_" + randomId + ".mp4";
    if (video === "base64") {
      const stockpathvideo = await Video.findById(videoUpdateCondition);
      // xóa video cũ
      if (fs.existsSync(stockpathvideo.video)) {
        fs.unlink(stockpathvideo.video, function (err) {
          if (err) throw err;
        });
      }
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      let data = base64.split(",")[1];
      fs.writeFile(fileName, data, "base64", function (err) {
        if (err) console.log(err);
      });
    }
    let updatedVideo = {
      title,
      video: video !== "base64" ? video : fileName,
      post,
    };

    updatedVideo = await Video.findOneAndUpdate(
      videoUpdateCondition,
      updatedVideo,
      { new: true }
    );

    // Người dùng không được phép cập nhật bài đăng hoặc không tìm thấy bài đăng
    if (!updatedVideo)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy bài đăng hoặc người dùng không được ủy quyền",
      });

    res.json({
      success: true,
      message: "Đã cập nhật!",
      video: updatedVideo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route DELETE api/video
// @desc Delete video
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const videoDeleteCondition = { _id: req.params.id };
    const dir = await Video.findById(videoDeleteCondition);
    const deletedvideo = await Video.findOneAndDelete(videoDeleteCondition);

    if (!deletedvideo)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy video hoặc người dùng không được ủy quyền",
      });
    // Xóa file video nếu tồn tại
    if (fs.existsSync(dir.video)) {
      fs.unlink(dir.video, function (err) {
        if (err) throw err;
      });
    }

    res.json({ success: true, video: deletedvideo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
