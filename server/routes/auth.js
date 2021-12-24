const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const fs = require("fs");
const PhoneSMS = require("../code/sendsms.js");
const Phone_SMS = new PhoneSMS();
const nodemailer = require("nodemailer");
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
  const { username, password, email, type, name, phone } = req.body;

  // Simple validation
  if (!username || !password || !email || !name || !phone)
    return res.status(400).json({
      success: false,
      message: "Vui lòng kiểm tra các trường thông tin",
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

const validateEmail = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validatePhone = (phone) => {
  var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(phone);
};

const setTime = (minutes = 0) => {
  var now = new Date();
  return now.setTime(now.getTime() + 17 * 3600 * minutes);
};

const sendMail = (andress, code, time) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_Mail,
      pass: process.env.PASS_Mail,
    },
  });

  var mailOptions = {
    from: process.env.ADMIN_Mail,
    to: andress,
    subject: "Mã khôi phục tài khoản tại hệ thống QLMS",
    text: `Mã khôi phục: ${code}. Hạn sử dụng là 10 phút: ${time}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Đã Gửi: " + info.response);
    }
  });
};

const createCode = async (_id, andress) => {
  let CodeData = {
    code: Math.floor(100000 + Math.random() * 900000), // Tạo ngẫu nhiên code độ dài = 6
    Expires: setTime(10), // 10 Phút,
  };

  let data = JSON.stringify(CodeData);
  fs.writeFileSync(`./code/${_id}.json`, data);

  if (validateEmail(andress)) {
    sendMail(andress, CodeData.code, new Date(CodeData.Expires));
  } else if (validatePhone(andress)) {
    Phone_SMS.sendcode(andress, CodeData.code, new Date(CodeData.Expires));
  }
};

// @route POST api/auth/check
// @desc check user
// @access Public
router.post("/check", async (req, res) => {
  const { find } = req.body;

  // Simple validation
  if (!find)
    return res.status(400).json({
      success: false,
      message: "Vui lòng kiểm tra thông tin cần tìm kiếm",
    });
  var type = "";
  if (validateEmail(find)) {
    type = "Email";
  } else if (validatePhone(find)) {
    type = "Phone";
  } else {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
    });
  }
  try {
    // Kiểm tra user đã tồn tại hay chưa
    let user = await (type == "Email"
      ? User.findOne({ email: find })
      : User.findOne({ phone: find }));
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy",
      });
    createCode(user._id, find);
    res.json({
      success: true,
      message: "Có tồn tại tài khoản",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/auth/forgot
// @desc change pass user
// @access Public
router.post("/forgot", async (req, res) => {
  const { find, code, newpassword } = req.body;

  // Simple validation
  if (!find)
    return res.status(400).json({
      success: false,
      message: "Vui lòng kiểm tra thông tin cần tìm kiếm",
    });
  var type = "";
  if (validateEmail(find)) {
    type = "Email";
  } else if (validatePhone(find)) {
    type = "Phone";
  } else {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
    });
  }
  try {
    // Kiểm tra user đã tồn tại hay chưa
    let user = await (type == "Email"
      ? User.findOne({ email: find })
      : User.findOne({ phone: find }));
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy",
      });

    if (!fs.existsSync(`./code/${user._id}.json`))
      return res.status(400).json({
        success: false,
        message: "Tạo mã thất bại",
      });
    // check code
    let rawdata = fs.readFileSync(`./code/${user._id}.json`);
    let codedata = JSON.parse(rawdata);
    if (code == codedata.code && new Date() <= new Date(codedata.Expires)) {
      let updatedUser = {
        name: user.name,
        username: user.username,
        email: user.email,
        password: await argon2.hash(newpassword),
        type: user.type,
        avatar: user.avatar,
        phone: user.phone,
      };

      updatedUser = await User.findOneAndUpdate({ _id: user.id }, updatedUser, {
        new: true,
      });

      // Người dùng không được phép cập nhật tài khoản hoặc không tìm thấy tài khoản
      if (!updatedUser)
        return res.status(401).json({
          success: false,
          message:
            "Không tìm thấy tài khoản hoặc người dùng không được ủy quyền",
        });
      // xóa file json
      if (fs.existsSync(`./code/${user._id}.json`)) {
        fs.unlink(`./code/${user._id}.json`, function (err) {
          if (err) throw err;
        });
      }

      return res.json({
        success: true,
        message: "Đã cập nhật!",
      });
    }
    res.json({
      success: false,
      message: "Mã sai hoặc hết hạn",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
