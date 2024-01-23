const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Student = require("../models/Students");
const Post = require("../models/Post");
const Comment = require("../models/Comments");

const axios = require("axios");
const fs = require("fs");

// @route GET api/students
// @desc Get student
// @access Private
router.get("", verifyToken, async (req, res) => {
  try {
    const students = await Student.find({})
      .populate("user", ["name", "username", "avatar"])
      .sort({
        createdAt: -1,
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

const getRates = async () => {
  try {
    return await axios.get(
      "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/vnd.json"
    );
  } catch (error) {
    console.error(error);
  }
};

// @route POST api/students
// @desc Create student
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { postid } = req.body;
  try {
    // Kiểm tra user đã tồn tại hay chưa
    const check = await Student.findOne({ post: postid, user: req.userId });
    if (check)
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký từ trước vui lòng thử lại",
      });

    const price = await Post.findById(postid);
    if (price.price === 0) {
      const newStudent = new Student({
        user: req.userId,
        post: postid,
        index: 0,
        price: price.price,
      });

      await newStudent.save();

      res.json({
        success: true,
        message: "Đăng ký khóa học thành công!",
        student: newStudent,
      });
    } else {
      const paypal = require("paypal-rest-sdk");

      paypal.configure({
        mode: "sandbox", //sandbox or live
        client_id:
          "AaU7efKANVNxIiRdw-tEYSnA0Sq_z2Nz91n4FqxoGJUmbZjIhbvW0-UV0GYE0oN81w43fgkk3ELKo75K",
        client_secret:
          "EFJmdc2zArfBv3PhuX69iLF31RYQpDJNN3lTzMJFr9HuXMkhwoEdwyOHiGvCqflKjy0H8rNAyAsYwx_O",
      });

      const List_rate = await getRates();
      const rate = List_rate?.data?.vnd?.usd;
      const price_new = (price.price * rate).toFixed(2);

      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: process.env.return_url,
          cancel_url: `${process.env.cancel_url}/coursedetail/?id=${postid}`,
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: price.title,
                  sku: "001",
                  price: price_new,
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "USD",
              total: price_new,
            },
            description: "",
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          let DataPayPal = {
            user: req.userId,
            post: postid,
            id: payment.id,
            total: price_new,
          };
          let data = JSON.stringify(DataPayPal);
          fs.writeFileSync(`./paypal/${payment.id}.json`, data);
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              return res.json({
                success: true,
                message: "Vui lòng thanh toán hóa đơn",
                student: "",
                url: payment.links[i].href,
              });
            }
          }
        }
      });
    }
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
    const studentDeleteCondition = { post: req.params.id, user: req.userId };
    const price = await Post.findById(req.params.id);
    if (price.price === 0) {
      const deleteStudent = await Student.findOneAndDelete(
        studentDeleteCondition
      );

      if (!deleteStudent)
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy hoặc người dùng không được ủy quyền",
        });

      // Hủy bình luận
      const commentDeleteCondition = { post: req.params.id, user: req.userId };
      const deleteComment = await Comment.findOneAndDelete(
        commentDeleteCondition
      );

      if (!deleteComment) console.log("Chưa bình luận");

      res.json({
        success: true,
        student: deleteStudent,
        message: "Hủy đăng ký thành công",
      });
    } else {
      res.json({
        success: false,
        student: "",
        message: "Không thể hủy khóa học đã trả phí",
      });
    }
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
        message: "Không tìm thấy hoặc người dùng không được ủy quyền",
      });

    // Hủy bình luận
    const commentDeleteCondition = {
      post: deleteStudent.post,
      user: deleteStudent.user,
    };
    const deleteComment = await Comment.findOneAndDelete(
      commentDeleteCondition
    );

    if (!deleteComment) console.log("Chưa bình luận");

    res.json({ success: true, student: deleteStudent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route PUT api/students
// @desc Update students index
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { index } = req.body;

  // Validation cơ bản
  if (!index)
    return res
      .status(400)
      .json({ success: false, message: "Chỉ số lưu vết là bắt buộc" });

  const stock = await Student.findById(req.params.id);

  try {
    if (index > stock.index) {
      let updatedStudent = {
        post: stock.post,
        user: req.userId,
        index,
      };
      var studentUpdateCondition = { _id: req.params.id };
      updatedStudent = await Student.findOneAndUpdate(
        studentUpdateCondition,
        updatedStudent,
        { new: true }
      );
      // Người dùng không được phép cập nhật hoặc không tìm thấy
      if (!updatedStudent)
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy hoặc người dùng không được ủy quyền",
        });

      res.json({
        success: true,
        message: "Đã cập nhật tiến độ!",
        post: updatedStudent,
      });
    } else {
      res.json({
        success: true,
        message: "Chưa cần cập nhật!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
