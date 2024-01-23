const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const mongoose = require("mongoose");

const Post = require("../models/Post");
const User = require("../models/User");
const Post_Detail = require("../models/Post_Detail");
const Student = require("../models/Students");
const Comment = require("../models/Comments");
const Question = require("../models/Question");
const ObjectID = require("mongodb").ObjectID;

const fs = require("fs");

// @route GET api/posts
// @desc Get posts
// @access Public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "list_students",
          localField: "_id",
          foreignField: "post",
          as: "liststudent",
        },
      },
      {
        $addFields: {
          sumprice: { $sum: "$liststudent.price" },
        },
      },
      { $unset: "liststudent" },
      {
        $lookup: {
          from: "categorys",
          localField: "coursetype",
          foreignField: "_id",
          as: "categorytemp",
        },
      },
      { $addFields: { category: { $arrayElemAt: ["$categorytemp", 0] } } },
      { $unset: "categorytemp" },
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
          "category.__v": false,
          "category._id": false,
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
    var id = mongoose.Types.ObjectId(req.params.id);
    const posts = await Post.aggregate([
      {
        $match: { user: id },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "categorys",
          localField: "coursetype",
          foreignField: "_id",
          as: "categorytemp",
        },
      },
      { $addFields: { category: { $arrayElemAt: ["$categorytemp", 0] } } },
      { $unset: "categorytemp" },
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
          "category.__v": false,
          "category._id": false,
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
          from: "categorys",
          localField: "post.coursetype",
          foreignField: "_id",
          as: "categorytemp",
        },
      },
      { $addFields: { category: { $arrayElemAt: ["$categorytemp", 0] } } },
      { $unset: "categorytemp" },
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
          from: "post_details",
          localField: "post._id",
          foreignField: "post",
          as: "listvideo",
        },
      },
      {
        $addFields: {
          countvideo: { $size: "$listvideo" },
        },
      },
      { $unset: "listvideo" },
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
          "category.__v": false,
          "category._id": false,
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
    var id = mongoose.Types.ObjectId(req.params.id);
    const posts = await Post.aggregate([
      {
        $match: { _id: id },
      },
      {
        $lookup: {
          from: "categorys",
          localField: "coursetype",
          foreignField: "_id",
          as: "categorytemp",
        },
      },
      { $addFields: { category: { $arrayElemAt: ["$categorytemp", 0] } } },
      { $unset: "categorytemp" },
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
          "category.__v": false,
          "category._id": false,
        },
      },
    ]);
    const more = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: "categorys",
          localField: "coursetype",
          foreignField: "_id",
          as: "categorytemp",
        },
      },
      { $addFields: { category: { $arrayElemAt: ["$categorytemp", 0] } } },
      { $unset: "categorytemp" },
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
          "category.__v": false,
          "category._id": false,
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
// @access Private
router.get("/hot/:id", verifyToken, async (req, res) => {
  try {
    const posts_hot = await Student.aggregate([
      { $group: { _id: "$post", students: { $sum: 1 } } },
      {
        $addFields: {
          sumprice: { $sum: "$price" },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "_id",
          as: "info",
        },
      },
      { $addFields: { name: { $arrayElemAt: ["$info.title", 0] } } },
      { $addFields: { idauthor: { $arrayElemAt: ["$info.user", 0] } } },
      {
        $lookup: {
          from: "users",
          localField: "idauthor",
          foreignField: "_id",
          as: "author",
        },
      },
      { $addFields: { authorname: { $arrayElemAt: ["$author.name", 0] } } },
      { $unset: "info" },
      { $unset: "idauthor" },
      { $unset: "author" },
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
  const { title, description, coursetype, thumbnail, price } = req.body;
  // Validation cơ bản
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Tiêu đề là bắt buộc" });

  // Validation cơ bản
  if (!thumbnail)
    return res.status(400).json({ success: false, message: "Ảnh là bắt buộc" });

  // Validation cơ bản
  if (!ObjectID.isValid(coursetype))
    return res
      .status(400)
      .json({ success: false, message: "Thể loại là bắt buộc" });

  // Validation cơ bản
  if (parseInt(price) < 0)
    return res
      .status(400)
      .json({ success: false, message: "Giá là bắt buộc và phải dương" });

  try {
    const newPost = new Post({
      title,
      description,
      user: req.userId,
      coursetype,
      thumbnail: thumbnail,
      price,
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
  const { title, description, coursetype, thumbnail, price } = req.body;

  // Validation cơ bản
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Tiêu đề là bắt buộc" });

  // Validation cơ bản
  if (!ObjectID.isValid(coursetype))
    return res
      .status(400)
      .json({ success: false, message: "Thể loại là bắt buộc" });

  // Validation cơ bản
  if (parseInt(price) < 0)
    return res.status(400).json({ success: false, message: "Giá là bắt buộc" });

  try {
    let updatedPost = {
      title,
      description: description || "",
      coursetype,
      thumbnail: thumbnail,
      price,
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
      var studentDeleteCondition;
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

    // Kiểm tra Comment đã tồn tại hay chưa
    const OneComment = await Comment.findOne({ post: req.params.id });

    if (OneComment) {
      // Bổ xung xóa Comment liên quan
      var studentDeleteCondition;
      if (permission.type == "admin")
        CommentDeleteCondition = { post: req.params.id };
      else CommentDeleteCondition = { post: req.params.id, user: req.userId };
      const deletedComment = await Comment.deleteMany(CommentDeleteCondition);
      if (!deletedComment)
        return res.status(401).json({
          success: false,
          message:
            "Không tìm thấy học viên liên quan hoặc người dùng không được ủy quyền",
        });
    }

    // Kiểm tra Question đã tồn tại hay chưa
    const OneQuestion = await Question.findOne({ post: req.params.id });

    if (OneQuestion) {
      // Bổ xung xóa Question liên quan
      var questionDeleteCondition;
      if (permission.type == "admin")
        questionDeleteCondition = { post: req.params.id };
      const deletedquestion = await Question.deleteMany(
        questionDeleteCondition
      );
      if (!deletedquestion)
        return res.status(401).json({
          success: false,
          message:
            "Không tìm thấy câu hỏi liên quan hoặc người dùng không được ủy quyền",
        });
    }

    // Xóa folder video nếu tồn tại
    const dir = "./filevideo/" + req.params.id;
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }

    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
