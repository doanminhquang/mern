const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");

// @route GET api/users
// @desc Get users
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    let userGetCondition = "";

    const permission = await User.findById(req.userId).select("type");
    if (permission.type == "admin") userGetCondition = {};
    else userGetCondition = { _id: req.userId };

    const users = await User.find(userGetCondition).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/users
// @desc Register user
// @access Private
router.post("/", verifyToken, async (req, res) => {
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

    // Kiểm tra mail đã tồn tại hay chưa
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

    res.json({
      success: true,
      message: "Người dùng đã được tạo thành công",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route PUT api/users
// @desc Update user
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { username, email, password, type, name, avatar, flag } = req.body;

  let userUpdateCondition = "";

  const permission = await User.findById(req.userId).select("type");
  if (permission.type === "admin") userUpdateCondition = { _id: req.params.id };
  else
    userUpdateCondition =
      req.params.id === req.userId ? { _id: req.params.id } : "";
  let hashedPassword = "";
  if (flag === "newpass") {
    hashedPassword = await argon2.hash(password);
  }
  try {
    let updatedUser = {
      name,
      username,
      email,
      password: hashedPassword ? hashedPassword : password,
      type,
      avatar,
    };

    // const userUpdateCondition = { _id: req.params.id };

    updatedUser = await User.findOneAndUpdate(
      userUpdateCondition,
      updatedUser,
      { new: true }
    );

    // Người dùng không được phép cập nhật tài khoản hoặc không tìm thấy tài khoản
    if (!updatedUser)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy tài khoản hoặc người dùng không được ủy quyền",
      });

    res.json({
      success: true,
      message: "Đã cập nhật!",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route DELETE api/users
// @desc Delete user
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    //const userDeleteCondition = { _id: req.params.id };

    let userDeleteCondition = "";

    const permission = await User.findById(req.userId).select("type");
    if (permission.type == "admin")
      userDeleteCondition = { _id: req.params.id };
    else
      userDeleteCondition =
        req.params.id === req.userId ? { _id: req.params.id } : "";

    const deletedUser = await User.findOneAndDelete(userDeleteCondition);

    if (!deletedUser)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy tài khoản hoặc người dùng không được ủy quyền",
      });

    res.json({ success: true, user: deletedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
