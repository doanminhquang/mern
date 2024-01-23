const express = require("express");
const router = express.Router();
const paypal = require("paypal-rest-sdk");
const Student = require("../models/Students");
const Post = require("../models/Post");
const fs = require("fs");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AaU7efKANVNxIiRdw-tEYSnA0Sq_z2Nz91n4FqxoGJUmbZjIhbvW0-UV0GYE0oN81w43fgkk3ELKo75K",
  client_secret:
    "EFJmdc2zArfBv3PhuX69iLF31RYQpDJNN3lTzMJFr9HuXMkhwoEdwyOHiGvCqflKjy0H8rNAyAsYwx_O",
});

router.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  if (fs.existsSync(`./paypal/${paymentId}.json`)) {
    let rawdata = fs.readFileSync(`./paypal/${paymentId}.json`);
    const data = JSON.parse(rawdata);

    if (data) {
      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: "USD",
              total: data.total,
            },
          },
        ],
      };

      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        async function (error, payment) {
          if (error) {
            console.log(error.response);
            throw error;
          } else {
            // Kiểm tra user đã tồn tại hay chưa
            const check = await Student.findOne({
              post: data.post,
              user: data.user,
            });

            if (!check) {
              const price = await Post.findById(data.post);
              const newStudent = new Student({
                user: data.user,
                post: data.post,
                index: 0,
                price: price.price,
              });

              await newStudent.save();
              res.redirect(
                301,
                `${process.env.fe_url}/coursedetail/?id=${data.post}`
              );
            }

            if (fs.existsSync(`./paypal/${paymentId}.json`)) {
              fs.unlink(`./paypal/${paymentId}.json`, function (err) {
                if (err) throw err;
              });
            }
          }
        }
      );
    }
  } else {
    res.send("Thất bại");
  }
});

module.exports = router;
