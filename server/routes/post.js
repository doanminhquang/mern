const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const mongoose = require("mongoose");

const Post = require("../models/Post");
const User = require("../models/User");
const Post_Detail = require("../models/Post_Detail");
const Student = require("../models/Students");

// @route GET api/posts
// @desc Get posts
// @access Public
router.get("/", async (req, res) => {
  try {
    /*const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("user", ["name", "username", "avatar"]);*/
    const posts = await Post.aggregate([
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
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "cmt",
        },
      },
      {
        $addFields: {
          sumrating: { $sum: "$cmt.rating" },
        },
      },
      {
        $addFields: {
          countrating: { $size: "$cmt" },
        },
      },

      {
        $addFields: {
          avgrating: {
            $round: [
              {
                $cond: [
                  { $eq: ["$countrating", 0] },
                  0,
                  { $divide: ["$sumrating", "$countrating"] },
                ],
              },
              2,
            ],
          },
        },
      },
      { $unset: "sumrating" },
      { $unset: "cmt" },
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
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route GET api/posts/myposts/:id
// @desc Get posts
// @access Private
router.get("/myposts/:id", verifyToken, async (req, res) => {
  try {
    /*const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", ["name", "username", "avatar"]);*/
    var id = mongoose.Types.ObjectId(req.params.id);
    const posts = await Post.aggregate([
      {
        $match: { user: id },
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
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "cmt",
        },
      },
      {
        $addFields: {
          sumrating: { $sum: "$cmt.rating" },
        },
      },
      {
        $addFields: {
          countrating: { $size: "$cmt" },
        },
      },

      {
        $addFields: {
          avgrating: {
            $round: [
              {
                $cond: [
                  { $eq: ["$countrating", 0] },
                  0,
                  { $divide: ["$sumrating", "$countrating"] },
                ],
              },
              2,
            ],
          },
        },
      },
      { $unset: "sumrating" },
      { $unset: "cmt" },
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
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route GET api/posts/myposts/:id
// @desc Get posts
// @access Private
router.get("/myenrolls/:id", verifyToken, async (req, res) => {
  try {
    /*const posts = await Student.find({ user: req.params.id })
      .populate("post")
      .populate("user", ["name", "username", "avatar"])
      .sort({ createdAt: -1 });*/
    var id = mongoose.Types.ObjectId(req.params.id);
    const posts = await Student.aggregate([
      {
        $match: { user: id },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "posts",
          localField: "post",
          foreignField: "_id",
          as: "listpost",
        },
      },
      { $addFields: { post: { $arrayElemAt: ["$listpost", 0] } } },
      { $unset: "listpost" },
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
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "cmt",
        },
      },
      {
        $addFields: {
          sumrating: { $sum: "$cmt.rating" },
        },
      },
      {
        $addFields: {
          countrating: { $size: "$cmt" },
        },
      },

      {
        $addFields: {
          avgrating: {
            $round: [
              {
                $cond: [
                  { $eq: ["$countrating", 0] },
                  0,
                  { $divide: ["$sumrating", "$countrating"] },
                ],
              },
              2,
            ],
          },
        },
      },
      { $unset: "sumrating" },
      { $unset: "cmt" },
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
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route GET api/posts/:id
// @desc Get post by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    /* const post = await Post.findById(req.params.id).populate("user", [
      "name",
      "username",
      "avatar",
    ]);*/
    /*const more = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("user", ["name", "username", "avatar"]);*/
    var id = mongoose.Types.ObjectId(req.params.id);
    const posts = await Post.aggregate([
      {
        $match: { _id: id },
      },
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
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "cmt",
        },
      },
      {
        $addFields: {
          sumrating: { $sum: "$cmt.rating" },
        },
      },
      {
        $addFields: {
          countrating: { $size: "$cmt" },
        },
      },

      {
        $addFields: {
          avgrating: {
            $round: [
              {
                $cond: [
                  { $eq: ["$countrating", 0] },
                  0,
                  { $divide: ["$sumrating", "$countrating"] },
                ],
              },
              2,
            ],
          },
        },
      },
      { $unset: "sumrating" },
      { $unset: "cmt" },
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
    const more = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 4 },
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
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "cmt",
        },
      },
      {
        $addFields: {
          sumrating: { $sum: "$cmt.rating" },
        },
      },
      {
        $addFields: {
          countrating: { $size: "$cmt" },
        },
      },

      {
        $addFields: {
          avgrating: {
            $round: [
              {
                $cond: [
                  { $eq: ["$countrating", 0] },
                  0,
                  { $divide: ["$sumrating", "$countrating"] },
                ],
              },
              2,
            ],
          },
        },
      },
      { $unset: "sumrating" },
      { $unset: "cmt" },
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
    const post = posts[0];
    res.json({ success: true, post, more });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route GET api/posts/hot/
// @desc Get post hot
// @access Public
router.get("/hot/:id", async (req, res) => {
  try {
    const posts_hot = await Student.aggregate([
      { $group: { _id: "$post", students: { $sum: 1 } } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "_id",
          as: "info",
        },
      },
      { $addFields: { name: { $arrayElemAt: ["$info.title", 0] } } },
      { $unset: "info" },
      {
        $lookup: {
          from: "post_details",
          localField: "_id",
          foreignField: "post",
          as: "List_video",
        },
      },
      { $addFields: { videos: { $size: "$List_video" } } },
      { $unset: "List_video" },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "cmt",
        },
      },
      {
        $addFields: {
          sumrating: { $sum: "$cmt.rating" },
        },
      },
      {
        $addFields: {
          countrating: { $size: "$cmt" },
        },
      },
      {
        $addFields: {
          avgrating: {
            $round: [
              {
                $cond: [
                  { $eq: ["$countrating", 0] },
                  0,
                  { $divide: ["$sumrating", "$countrating"] },
                ],
              },
              2,
            ],
          },
        },
      },
      { $unset: "sumrating" },
      { $unset: "cmt" },
      { $sort: { avgrating: -1, countrating: -1, students: -1 } },
      { $limit: parseInt(req.params.id) },
    ]);
    res.json({ success: true, posts_hot });
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
