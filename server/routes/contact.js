const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Contact = require("../models/Contact");
const csvtojson = require("csvtojson");
const fs = require("fs");

// @route GET api/contacts
// @desc Get contacts
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/contacts
// @desc Create contact
// @access Public
router.post("/", async (req, res) => {
  const { namecontact, email, subject, messagecontact, status } = req.body;
  try {
    const newContact = new Contact({
      name: namecontact,
      email,
      subject,
      message: messagecontact,
      status: status ? status : "Wait",
    });

    await newContact.save();

    res.json({
      success: true,
      message: "Gửi liên hệ thành công!",
      contact: newContact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// convert value
var arr = [
  {
    value: "Wait",
    showtext: "Đang đợi",
  },
  {
    value: "Processing",
    showtext: "Đang xử lý",
  },
  {
    value: "Done",
    showtext: "Hoàn thành",
  },
];

const getValue = (showtext) => {
  var res = arr.find((o) => o.showtext === showtext);
  return res.value;
};

//////////////////////

// @route POST api/contacts/csv
// @desc Create contacts by file csv
// @access Private
router.post("/csv", verifyToken, async (req, res) => {
  let data = req.body.base64.split(",")[1];
  const randomId =
    new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
  const fileName = "./filetemp/" + req.userId + "_" + randomId + ".csv";
  fs.writeFile(fileName, data, "base64", function (err) {
    if (err) console.log(err);
  });
  try {
    var arrayToInsert = [];
    csvtojson()
      .fromFile(fileName)
      .then((source) => {
        for (var i = 0; i < source.length; i++) {
          var oneRow = {
            name: source[i]["Tên người gửi"],
            email: source[i]["Địa chỉ mail"],
            subject: source[i]["Tiêu đề"],
            message: source[i]["Nội dung"],
            status: getValue(source[i]["Trạng thái"]),
          };
          arrayToInsert.push(oneRow);
        }

        Contact.insertMany(arrayToInsert, (err, result) => {
          if (err) console.log(err);
          if (result) {
            fs.stat(fileName, function (err) {
              if (err) {
                return console.error(err);
              }
              fs.unlink(fileName, function (err) {
                if (err) return console.log(err);
              });
            });
            res.status(200).json({
              success: true,
              message:
                "Thêm dữ liệu từ file csv thành công " +
                result.length +
                " bản ghi",
            });
          }
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/contacts/excel
// @desc Create contacts by file excel
// @access Private
router.post("/excel", verifyToken, async (req, res) => {
  let data = JSON.parse(req.body.jsonObject);
  try {
    var arrayToInsert = [];
    for (var i = 0; i < data.length; i++) {
      var oneRow = {
        name: data[i]["Tên người gửi"],
        email: data[i]["Địa chỉ mail"],
        subject: data[i]["Tiêu đề"],
        message: data[i]["Nội dung"],
        status: getValue(data[i]["Trạng thái"]),
      };
      arrayToInsert.push(oneRow);
    }
    Contact.insertMany(arrayToInsert, (err, result) => {
      if (err) console.log(err);
      if (result) {
        res.status(200).json({
          success: true,
          message:
            "Thêm dữ liệu từ file csv thành công " + result.length + " bản ghi",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route PUT api/contacts
// @desc Update contact
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { name, email, subject, message, status } = req.body;

  try {
    let updatedContact = {
      name,
      email,
      subject,
      message,
      status: status ? status : "Wait",
    };
    const contactUpdateCondition = { _id: req.params.id };

    updatedContact = await Contact.findOneAndUpdate(
      contactUpdateCondition,
      updatedContact,
      { new: true }
    );

    // Người dùng không được phép cập nhật bài đăng hoặc không tìm thấy bài đăng
    if (!updatedContact)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy bài đăng hoặc người dùng không được ủy quyền",
      });

    res.json({
      success: true,
      message: "Đã cập nhật!",
      contact: updatedContact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route DELETE api/contacts
// @desc Delete contact
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const contactDeleteCondition = { _id: req.params.id };
    const deletedContact = await Contact.findOneAndDelete(
      contactDeleteCondition
    );

    if (!deletedContact)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy bài đăng hoặc người dùng không được ủy quyền",
      });

    res.json({ success: true, post: deletedContact });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
