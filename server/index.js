require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var compiler = require("compilex");

const { notFound, errorHandler } = require("./middleware/errorHandler");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const contactRouter = require("./routes/contact");
const userRouter = require("./routes/user");
const videoRouter = require("./routes/video");
const studentRouter = require("./routes/student");
const infoServerRouter = require("./routes/infoserver");
const comment = require("./routes/comment");
const category = require("./routes/category");
const question = require("./routes/question");
const compilecode = require("./routes/compilecode");
const pay = require("./routes/pay");

if (process.env.ENV_VARIABLE == "production") {
  console.log = function () {};
}

const connectDB = async () => {
  try {
    const conn =
      process.env.MODE != "LOCAL"
        ? `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@qlms.wo0ki.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
        : "mongodb://localhost:27017/QLMS";
    await mongoose.connect(conn, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log("MongoDB đã kết nối");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json({ limit: "500mb", parameterLimit: 500000 }));
app.use(
  express.urlencoded({ limit: "500mb", extended: true, parameterLimit: 500000 })
);
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api/students", studentRouter);
app.use("/api/info", infoServerRouter);
app.use("/api/comments", comment);
app.use("/api/categorys", category);
app.use("/api/questions", question);
app.use("/api/compilecode", compilecode);
app.use("/api/payment", pay);
app.use("/filevideo", express.static(__dirname + "/filevideo"));
app.use("/fileattachment", express.static(__dirname + "/fileattachment"));
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Máy chủ được khởi động ở port ${PORT}`));

compiler.flush(function () {
  console.log("Tất cả các tệp tạm thời đã được xóa!");
});
