const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");
const Student = require("../models/Students");
const Comment = require("../models/Comments");

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

// @route GET api/users/:id
// @desc Get users
// @access Private
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const users = await User.find({ _id: req.params.id }).select("-password");
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
  const { username, password, email, type, name, phone } = req.body;

  // Simple validation
  if (!username || !password || !email || !name || !phone)
    return res.status(400).json({
      success: false,
      message: "Vui lòng kiểm tra các trường thtôngg tin",
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

    // Kiểm tra phone đã tồn tại hay
    const cphone = await User.findOne({ phone });

    if (cphone)
      return res
        .status(400)
        .json({ success: false, message: "Số điện thoại đã được sử dụng" });

    // Tất cả tốt
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      type: type || "student",
      name,
      phone,
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
  const { username, email, password, type, name, avatar, flag, phone } =
    req.body;

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
      password: hashedPassword !== "" ? hashedPassword : password,
      type,
      avatar,
      phone,
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

// @route PUT api/users/myinfo
// @desc Update user
// @access Private
router.put("/myinfo/:id", verifyToken, async (req, res) => {
  const { nusername, nemail, npassword, nname, navatar, ntype, nphone } =
    req.body;
  let stockpass = await User.findById(req.userId).select("password");

  let hashedPassword = "";
  if (npassword !== "") {
    hashedPassword = await argon2.hash(npassword);
  }
  try {
    let updatedUser = {
      name: nname,
      username: nusername,
      email: nemail,
      password: hashedPassword !== "" ? hashedPassword : stockpass.password,
      type: ntype,
      avatar: navatar,
      phone: nphone,
    };

    if (req.params.id === req.userId) {
      updatedUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        updatedUser,
        { new: true }
      );
    } else {
      res.status(500).json({ success: false, message: "Không hợp lệ" });
    }

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

    // Kiểm tra Student đã tồn tại hay chưa
    const OneStudent = await Student.findOne({ post: req.params.id });

    if (OneStudent) {
      // Bổ xung xóa Student liên quan
      if (permission.type == "admin")
        StudentDeleteCondition = { post: req.params.id };
      else StudentDeleteCondition = { post: req.params.id, user: req.userId };
      const deletedStudent = await Student.deleteMany(StudentDeleteCondition);
      if (!deletedStudent)
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
      if (permission.type == "admin")
        CommentDeleteCondition = { post: req.params.id };
      else CommentDeleteCondition = { post: req.params.id, user: req.userId };
      const deletedComment = await Comment.deleteMany(CommentDeleteCondition);
      if (!deletedComment)
        return res.status(401).json({
          success: false,
          message:
            "Không tìm thấy bình luận liên quan hoặc người dùng không được ủy quyền",
        });
    }

    res.json({ success: true, user: deletedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
