const SerialPort = require("serialport");

const Build = () => {
  SerialPort.list().then((ports) => {
    ports.forEach(function (port) {
      var pnpId = "USB\\VID_0408&PID_EA26&MI_01";
      if (port.pnpId.toString().includes(pnpId)) {
        return port.path;
      }
    });
  });
};

const onOpen = (error) => {
  if (!error) {
    console.log("Kết nối thành công");
  }
};

const onDataReceived = (data) => {
  console.log("Phản hồi: " + data);
};

const onClose = (error) => {
  console.log("Ngắt kết nối");
  console.log(error);
};

const onError = (error) => {
  console.log("DCOM " + error);
};

class PhoneSMS {
  constructor() {
    this.Myport = new SerialPort("COM9", {
      baudrRate: 9600,
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      flowControl: false,
    })
      .on("error", onError)
      .on("open", onOpen)
      .on("data", onDataReceived)
      .on("close", onClose);
  }

  getList = () => {
    SerialPort.list().then((ports) => {
      ports.forEach(function (port) {
        console.log(port);
      });
    });
  };

  sendcode = (toPhone, code, time, mode) => {
    let sms_data = {
      register: `Ma xac thuc: ${code}\rHet hieu luc sau 10 phut: ${time}.`,
      forgot: `Ma khoi phuc: ${code}\rHet hieu luc sau 10 phut: ${time}.`,
      default: "Not found sms",
    };

    setTimeout(() => {
      this.Myport?.write("AT+CMGF=1\r");
      setTimeout(() => {
        this.Myport?.write(`AT+CMGS="${toPhone}"\r`);
        setTimeout(() => {
          this.Myport?.write(sms_data[mode] || sms_data["default"]);
          setTimeout(() => {
            this.Myport?.write("\x1A");
          }, 100);
        }, 100);
      }, 100);
    }, 1000);
  };
}

module.exports = PhoneSMS;
