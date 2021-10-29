const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Post = require("../models/Post");
const User = require("../models/User");
const Post_Detail = require("../models/Post_Detail");
const Student = require("../models/Students");

// @route GET api/posts
// @desc Get posts
// @access Public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("user", ["name", "username", "avatar"]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route GET api/posts
// @desc Get post by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", [
      "name",
      "username",
      "avatar",
    ]);
    const more = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("user", ["name", "username", "avatar"]);
    res.json({ success: true, post, more });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { title, description, coursetype, thumbnail } = req.body;

  // Validation cơ bản
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Tiêu đề là bắt buộc" });

  // Validation cơ bản
  if (!thumbnail)
    return res
      .status(400)
      .json({ success: false, message: "Ảnh tiêu đề là bắt buộc" });

  try {
    const newPost = new Post({
      title,
      description,
      user: req.userId,
      coursetype,
      thumbnail: thumbnail,
    });

    await newPost
      .save()
      .then((t) =>
        t.populate("user", ["name", "username", "avatar"]).execPopulate()
      );

    res.json({
      success: true,
      message: "Thêm khóa học thành công!",
      post: newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route PUT api/posts
// @desc Update post
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, coursetype, thumbnail } = req.body;

  // Validation cơ bản
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Tiêu đề là bắt buộc" });

  try {
    let updatedPost = {
      title,
      description: description || "",
      coursetype,
      thumbnail: thumbnail,
    };

    var postUpdateCondition;
    const permission = await User.findById(req.userId).select("type");
    if (permission.type == "admin")
      postUpdateCondition = { _id: req.params.id };
    else postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    ).populate("user", ["name", "username", "avatar"]);

    // Người dùng không được phép cập nhật bài đăng hoặc không tìm thấy bài đăng
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy bài đăng hoặc người dùng không được ủy quyền",
      });

    res.json({
      success: true,
      message: "Đã cập nhật!",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    var postDeleteCondition;
    const permission = await User.findById(req.userId).select("type");
    if (permission.type == "admin")
      postDeleteCondition = { _id: req.params.id };
    else postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

    // Người dùng không được ủy quyền hoặc không tìm thấy bài đăng

    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy bài đăng hoặc người dùng không được ủy quyền",
      });

    // Kiểm tra Video liên quan đã tồn tại hay chưa
    const OnePostDetail = await Post_Detail.findOne({ post: req.params.id });

    if (OnePostDetail) {
      // Bổ xung xóa video liên quan
      if (permission.type == "admin")
        postdetailDeleteCondition = { post: req.params.id };
      else
        postdetailDeleteCondition = { post: req.params.id, user: req.userId };
      const deletedPost_Details = await Post_Detail.deleteMany(
        postdetailDeleteCondition
      );
      if (!deletedPost_Details)
        return res.status(401).json({
          success: false,
          message:
            "Không tìm thấy bài đăng video bổ sung hoặc người dùng không được ủy quyền",
        });
    }

    // Kiểm tra student đã tồn tại hay chưa
    const OneStudent = await Student.findOne({ post: req.params.id });

    if (OneStudent) {
      // Bổ xung xóa student liên quan
      if (permission.type == "admin")
        studentDeleteCondition = { post: req.params.id };
      else studentDeleteCondition = { post: req.params.id, user: req.userId };
      const deletedstudent = await Student.deleteMany(studentDeleteCondition);
      if (!deletedstudent)
        return res.status(401).json({
          success: false,
          message:
            "Không tìm thấy học viên liên quan hoặc người dùng không được ủy quyền",
        });
    }

    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
