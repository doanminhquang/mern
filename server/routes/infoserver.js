const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const os = require("os-utils");

function getCPUUsage(osutils) {
  return new Promise((resolve) => {
    osutils.cpuUsage((value) => resolve(value));
  });
}

function getCPUFree(osutils) {
  return new Promise((resolve) => {
    osutils.cpuFree((value) => resolve(value));
  });
}

// @route GET api/info/db
// @desc Get users
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const db = mongoose.connection;

    infodb = new Object();

    db.db.stats(function (err, stats) {
      infodb.collections = stats.collections;
      infodb.objects = stats.objects;
      infodb.avgObjSize = stats.avgObjSize;
      infodb.storageSize = stats.storageSize;
      // 512mb chỉ số của M0 mongodb alas (stats.totalFreeStorageSize auto 0 nếu dùng alas)
      /*infodb.totalFreeStorageSize =
        stats.totalFreeStorageSize == 0
          ? 536870912 - stats.storageSize
          : stats.totalFreeStorageSize;*/
      const size = stats.fsTotalSize - stats.fsUsedSize;
      infodb.totalFreeStorageSize =
        stats.totalFreeStorageSize == 0
          ? 536870912 - stats.storageSize
          : size - stats.totalFreeStorageSize;
    });

    infosv = new Object();

    infosv.totalmem = os.totalmem();
    infosv.freemem = os.freemem();
    infosv.cpuUsage = await getCPUUsage(os);
    infosv.cpuFree = await getCPUFree(os);
    res.json({ success: true, infodb, infosv });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
});

module.exports = router;
