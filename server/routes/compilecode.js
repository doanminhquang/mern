const express = require("express");
const router = express.Router();
var compiler = require("compilex");

var option = { stats: true };
compiler.init(option);

const CheckBlackList = (str) => {
  // filter
  const Black_list = [
    "subprocess",
    "os",
    "sys",
    "system",
    "sh",
    "Command",
    "plumbum",
    "pexpect",
    "fabric",
    "envoy",
    "shell",
    "shlex",
    "exec",
    "child_process",
    "spawnSync",
    "execSync",
    "eval",
  ];

  for (var i = 0; i < Black_list.length; i++) {
    if (str.includes(Black_list[i], 0)) {
      return true;
    }
  }

  return false;
};

router.post("/", async (req, res) => {
  try {
    var code = req.body.code;
    var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.language;

    if (code === undefined || code === null || code === "")
      return res.send({ output: "Thiếu code" });

    var index_input = code?.includes("input(", 0);
    var check_input_code = index_input ? index_input : false;

    if (
      check_input_code &&
      (input === undefined || input === null || input === "")
    ) {
      return res.send({ output: "Thiếu dữ liệu input" });
    }

    if (check_input_code && inputRadio !== "true") {
      return res.send({ output: "Thiếu dữ liệu cờ" });
    }

    if (
      (input === undefined || input === null || input === "") &&
      inputRadio === "true"
    ) {
      return res.send({ output: "Sai dữ liệu cờ" });
    }

    const rul1 = CheckBlackList(input ? input : "");
    const rul2 = CheckBlackList(code ? code : "");

    if (!rul1 && !rul2) {
      /*
      if (lang === "c" || lang === "cpp") {
        if (inputRadio === "true" &&
          typeof input === String) {
          var envData = { OS: "windows", cmd: "gcc" };
          compiler.compileCPPWithInput(envData, code, input, function (data) {
            if (data.error) {
              res.send(data.error);
            } else {
              res.send(data.output);
            }
          });
        } else {
          var envData = { OS: "windows", cmd: "gcc" };
          compiler.compileCPP(envData, code, function (data) {
            if (data.error) {
              res.send(data.error);
            } else {
              res.send(data.output);
            }
          });
        }
      }
      */
      if (lang === "python") {
        if (inputRadio === "true") {
          var envData = { OS: "windows" };
          compiler.compilePythonWithInput(
            envData,
            code,
            input,
            function (data) {
              res.send(data);
            }
          );
        } else {
          var envData = { OS: "windows" };
          compiler.compilePython(envData, code, function (data) {
            res.send(data);
          });
        }
      }
      /* 
      if (lang === "java") {
        if (inputRadio === "true") {
          var envData = { OS: "windows" };
          compiler.compileJavaWithInput(envData, code, input, function (data) {
            res.send(data);
          });
        } else {
          var envData = { OS: "windows" };
          compiler.compileJava(envData, code, function (data) {
            res.send(data);
          });
        }
      }
      */
      /*  
      if (lang === "c#") {
        if (inputRadio === "true") {
          var envData = { OS: "windows" };
          compiler.compileCSWithInput(envData, code, input, function (data) {
            res.send(data);
          });
        } else {
          var envData = { OS: "windows" };
          compiler.compileCS(envData, code, function (data) {
            res.send(data);
          });
        }
      }
      */
      /*
      if (lang === "vb") {
        if (inputRadio === "true") {
          var envData = { OS: "windows" };
          compiler.compileVBWithInput(envData, code, input, function (data) {
            res.send(data);
          });
        } else {
          var envData = { OS: "windows" };
          compiler.compileVB(envData, code, function (data) {
            res.send(data);
          });
        }
      }
    */
    } else {
      res.send({ output: "Hacked Detect" });
    }
  } catch (error) {
    res.send({ output: error });
  }
});

router.get("/fullStat", function (req, res) {
  try {
    compiler.fullStat(function (data) {
      res.send(data);
    });
  } catch (error) {
    res.send({ output: error });
  }
});

module.exports = router;
