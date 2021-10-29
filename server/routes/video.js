const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Video = require("../models/Post_Detail");
const User = require("../models/User");

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
  const { title, video, postid } = req.body;
  try {
    const newVideo = new Video({
      title,
      video,
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
  const { title, video, postid } = req.body;

  try {
    let updatedVideo = {
      title,
      video,
      postid,
    };
    const videoUpdateCondition = { _id: req.params.id };

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
      contact: updatedVideo,
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
    const deletedvideo = await Video.findOneAndDelete(videoDeleteCondition);

    if (!deletedvideo)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy video hoặc người dùng không được ủy quyền",
      });

    res.json({ success: true, video: deletedvideo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
