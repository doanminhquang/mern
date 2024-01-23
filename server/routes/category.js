const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Category = require("../models/Category");
const User = require("../models/User");

// @route GET api/category
// @desc Get categorys
// @access Public
router.get("", async (req, res) => {
  try {
    const categorys = await Category.find({});
    res.json({ success: true, categorys });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route POST api/categorys
// @desc Create category
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { name } = req.body;
  try {
    // Kiểm tra name đã tồn tại bình luận hay chưa
    const check = await Category.findOne({ name });
    if (check)
      return res.status(400).json({
        success: false,
        message: "Đã tồn tại thể loại này",
      });

    const newCategory = new Category({
      name,
    });

    await newCategory.save();

    res.json({
      success: true,
      message: "Thêm thể loại thành công!",
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route PUT api/categorys
// @desc Update category
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { name } = req.body;

  // Validation cơ bản
  if (!name)
    return res
      .status(400)
      .json({ success: false, message: "Thể loại là bắt buộc" });

  try {
    let updatedCategory = {
      name,
    };

    var categoryUpdateCondition = { _id: req.params.id };
    const permission = await User.findById(req.userId).select("type");

    if (permission.type !== "admin")
      return res.status(401).json({
        success: false,
        message: "Người dùng không được ủy quyền",
      });

    const Stock = await Category.findById(req.params.id);

    const Find = await Category.findOne({ name: name });

    if (Find && Find.name !== Stock.name)
      return res.status(401).json({
        success: false,
        message: "Đã tồn tại thể loại này",
      });

    updatedCategory = await Category.findOneAndUpdate(
      categoryUpdateCondition,
      updatedCategory,
      { new: true }
    );

    // Người dùng không được phép cập nhật bài đăng hoặc không tìm thấy bài đăng
    if (!updatedCategory)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy thể loại hoặc người dùng không được ủy quyền",
      });

    res.json({
      success: true,
      message: "Đã cập nhật!",
      category: updatedCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

// @route DELETE api/categorys
// @desc Delete category by id
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const categoryDeleteCondition = { _id: req.params.id };
    const deleteCategory = await Category.findOneAndDelete(
      categoryDeleteCondition
    );

    if (!deleteCategory)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy thể loại hoặc người dùng không được ủy quyền",
      });

    res.json({
      success: true,
      student: deleteCategory,
      message: "Xóa thể loại thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
