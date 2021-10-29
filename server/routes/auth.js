const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  const { username, password, email, type, name } = req.body;

  // Simple validation
  if (!username || !password || !email || !name)
    return res.status(400).json({
      success: false,
      message: "Vui lòng kiểm tra họ tên, tên người dùng, email hoặc mật khẩu",
    });

  try {
    // Kiểm tra user đã tồn tại hay chưa
    const user = await User.findOne({ username });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Tên người dùng đã được sử dụng" });

    // Kiểm tra mail đã tồn tại hay
    const mail = await User.findOne({ email });

    if (mail)
      return res
        .status(400)
        .json({ success: false, message: "Địa chỉ email đã được sử dụng" });

    // Tất cả tốt
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      type: type || "student",
      name,
    });
    await newUser.save();

    // Trả về token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "Người dùng đã được tạo thành công",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password)
    return res.status(400).json({
      success: false,
      message: "Thiếu tên người dùng và / hoặc mật khẩu",
    });

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác",
      });

    // Username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác",
      });

    // All good
    // Return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "Người dùng đã đăng nhập thành công",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
