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

class PhoneSMS {
  constructor() {
    this.Myport = new SerialPort("COM11", {
      baudrRate: 9600,
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      flowControl: false,
    });
  }

  getList = () => {
    SerialPort.list().then((ports) => {
      ports.forEach(function (port) {
        console.log(port);
      });
    });
  };

  onOpen = (error) => {
    if (!error) {
      console.log("Kết nối thành công");
    }
  };

  onDataReceived = (data) => {
    console.log("Phản hồi: " + data);
  };

  onError = (error) => {
    console.log(error);
  };

  onClose = (error) => {
    console.log("Ngắt kết nối");
    console.log(error);
  };

  sendcode = (toPhone, code, time) => {
    setTimeout(() => {
      this.Myport.write("AT+CMGF=1\r");
      setTimeout(() => {
        this.Myport.write(`AT+CMGS="${toPhone}"\r`);
        setTimeout(() => {
          this.Myport.write(
            `Ma khoi phuc: ${code}\rHet hieu luc sau 10 phut: ${time}.`
          );
          setTimeout(() => {
            this.Myport.write("\x1A");
          }, 100);
        }, 100);
      }, 100);
    }, 1000);
  };
}

module.exports = PhoneSMS;
