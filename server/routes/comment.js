const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const mongoose = require("mongoose");

const Comment = require("../models/Comments");

// @route GET api/comments
// @desc Get comments
// @access Private
router.get("", verifyToken, async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("user", ["name", "username", "avatar"])
      .sort({
        createdAt: +1,
      });
    res.json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route GET api/comments/:id
// @desc Get comments by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    /* const comments = await Comment.find({ post: req.params.id })
      .populate("user", ["name", "username", "avatar"])
      .sort({
        createdAt: -1,
      }); */
    var id = mongoose.Types.ObjectId(req.params.id);
    const comments = await Comment.aggregate([
      {
        $match: { post: id },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "info",
        },
      },
      { $addFields: { user: { $arrayElemAt: ["$info", 0] } } },
      { $unset: "info" },
      {
        $project: {
          "user.password": false,
          "user.email": false,
          "user.createdAt": false,
          "user.__v": false,
          "user.type": false,
        },
      },
    ]);
    const ratingdetails = await Comment.aggregate([
      {
        $match: { post: id },
      },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);

    res.json({ success: true, comments, ratingdetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/comments
// @desc Create comments
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { post, cmt, rating } = req.body;
  try {
    // Kiểm tra user đã tồn tại bình luận hay chưa
    const check = await Comment.findOne({ post, user: req.userId });
    if (check)
      return res.status(400).json({
        success: false,
        message: "Bạn đã bình luận không thể bình luận thêm",
      });

    if (post === "")
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng thử lại" });

    if (rating === 0)
      return res
        .status(400)
        .json({ success: false, message: "Cần phải kèm sao > 0" });

    const newComment = new Comment({
      user: req.userId,
      post,
      cmt,
      rating,
    });

    await newComment.save();

    res.json({
      success: true,
      message: "Bình luận thành công!",
      comment: newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route DELETE api/comments
// @desc Delete comment by id
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const commentDeleteCondition = { _id: req.params.id };
    const deleteComment = await Comment.findOneAndDelete(
      commentDeleteCondition
    );

    if (!deleteComment)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy bình luận hoặc người dùng không được ủy quyền",
      });

    res.json({
      success: true,
      student: deleteComment,
      message: "Xóa bình luận thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
