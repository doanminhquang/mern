const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Student = require("../models/Students");
const User = require("../models/User");

// @route GET api/students
// @desc Get student
// @access Private
router.get("", verifyToken, async (req, res) => {
  try {
    const students = await Student.find({})
      .populate("user", ["name", "username", "avatar"])
      .sort({
        createdAt: +1,
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
    const newStudent = new Student({
      user: req.userId,
      post: postid,
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
    const studentDeleteCondition = { user: req.params.id };
    const deleteStudent = await Student.findOneAndDelete(
      studentDeleteCondition
    );

    if (!deleteStudent)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy video hoặc người dùng không được ủy quyền",
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
        message: "Không tìm thấy video hoặc người dùng không được ủy quyền",
      });

    res.json({ success: true, student: deleteStudent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
