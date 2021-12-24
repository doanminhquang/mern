const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Student = require("../models/Students");

// @route GET api/students
// @desc Get student
// @access Private
router.get("", verifyToken, async (req, res) => {
  try {
    const students = await Student.find({})
      .populate("user", ["name", "username", "avatar"])
      .sort({
        createdAt: -1,
      });
    res.json({ success: true, students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route GET api/students
// @desc check reg
// @access Private
router.get("/check/:id", verifyToken, async (req, res) => {
  try {
    const students = await Student.find({
      post: req.params.id,
      user: req.userId,
    });
    res.json({ success: true, students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/students
// @desc Create student
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { postid } = req.body;
  try {
    // Kiểm tra user đã tồn tại hay chưa
    const check = await Student.findOne({ post: postid, user: req.userId });
    if (check)
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký từ trước vui lòng thử lại",
      });

    const newStudent = new Student({
      user: req.userId,
      post: postid,
      index: 0,
    });

    await newStudent.save();

    res.json({
      success: true,
      message: "Đăng ký khóa học thành công!",
      student: newStudent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route DELETE api/students
// @desc Delete student
// @access Private
router.delete("/unreg/:id", verifyToken, async (req, res) => {
  try {
    const studentDeleteCondition = { post: req.params.id, user: req.userId };
    const deleteStudent = await Student.findOneAndDelete(
      studentDeleteCondition
    );

    if (!deleteStudent)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy hoặc người dùng không được ủy quyền",
      });

    res.json({
      success: true,
      student: deleteStudent,
      message: "Hủy đăng ký thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route DELETE api/students
// @desc Delete student
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const studentDeleteCondition = { _id: req.params.id };
    const deleteStudent = await Student.findOneAndDelete(
      studentDeleteCondition
    );

    if (!deleteStudent)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy hoặc người dùng không được ủy quyền",
      });

    res.json({ success: true, student: deleteStudent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route PUT api/students
// @desc Update students index
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { index } = req.body;

  // Validation cơ bản
  if (!index)
    return res
      .status(400)
      .json({ success: false, message: "Chỉ số lưu vết là bắt buộc" });

  const stock = await Student.findById(req.params.id);

  try {
    if (index > stock.index) {
      let updatedStudent = {
        post: stock.post,
        user: req.userId,
        index,
      };
      var studentUpdateCondition = { _id: req.params.id };
      updatedStudent = await Student.findOneAndUpdate(
        studentUpdateCondition,
        updatedStudent,
        { new: true }
      );
      // Người dùng không được phép cập nhật hoặc không tìm thấy
      if (!updatedStudent)
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy hoặc người dùng không được ủy quyền",
        });

      res.json({
        success: true,
        message: "Đã cập nhật tiến độ!",
        post: updatedStudent,
      });
    } else {
      res.json({
        success: true,
        message: "Chưa cần cập nhật!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
