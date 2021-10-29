import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { AuthContext } from "../contexts/AuthContext";
//--------------------------------------------------
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";
//--------------------------------------------------
import Register from "../components/users/RegisterForm";
import UpdateUserModal from "../components/users/UpdateUserModal";
import ActionButtons from "../components/users/ActionButtons";
//--------------------------------------------------
import { MDBDataTable } from "mdbreact";
import { CSVLink } from "react-csv";
import XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
//--------------------------------------------------
import { FaFileCsv } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";
//--------------------------------------------------
import { formatDate } from "../utils/FormatDate";
import BeVietNamProFont from "../utils/BeVietNamPro";
import { getTextDisplayUserType } from "../utils/GettextDisplay";

const Account = () => {
  // Contexts
  const {
    authState: {
      user: { name },
    },
  } = useContext(AuthContext);

  const {
    userState: { user, users, usersLoading },
    getUsers,
    setShowAddUserModal,
    showUpdateUserModal,
    showToast: { show, message, type },
    setShowToast,
  } = useContext(UserContext);

  // Start: Get all users
  useEffect(() => {
    getUsers();
  });

  // create data
  const createdata = () => {
    let Users = users
      ? users.map((user) => {
          return {
            "Tên người dùng": user.name,
            "Tên tài khoản": user.username,
            "Địa chỉ mail": user.email,
            "Loại tài khoản": getTextDisplayUserType(user.type),
            "Thời gian": formatDate(user.createdAt),
          };
        })
      : "";
    return Users;
  };

  // csv

  const hanlderClickCSV = () => {
    var ELMFileCSV = document.getElementById("filecsv");
    ELMFileCSV.click();
  };

  /// xlxs

  const downloadxls = (e, data) => {
    e.preventDefault();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    XLSX.writeFile(wb, createNamefile() + ".xlsx");
  };

  /// pdf
  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    doc.addFileToVFS("BeVietNamProFont.ttf", BeVietNamProFont);
    doc.addFont("BeVietNamProFont.ttf", "BeVietNamProFont", "normal");
    doc.setFont("BeVietNamProFont");
    const title = createNamefile().replace(
      "DL_Tai_Khoan_",
      "Dữ Liệu Tài Khoản - "
    );
    const headers = [
      [
        "Tên người dùng",
        "Tên tài khoản",
        "Địa chỉ mail",
        "Loại tài khoản",
        "Thời gian",
      ],
    ];
    let data = users
      ? users.map((user) => [
          user.name,
          user.username,
          user.email,
          user.type,
          formatDate(user.createdAt),
        ])
      : "";
    let content = {
      startY: 50,
      head: headers,
      body: data,
      pageBreak: "avoid",
      theme: "grid",
      headStyles: {
        textColor: "white",
        fontStyle: "bold",
        background: "#1261a0",
      },
      bodyStyles: {
        textColor: "black",
      },
      styles: {
        font: "BeVietNamProFont",
        fontStyle: "normal",
        overflow: "linebreak",
      },
      columnStyles: {
        0: {},
        1: {
          columnWidth: 100,
        },
        2: {
          columnWidth: 120,
        },
        3: {},
        4: {},
      },
    };
    var pageHeight =
      doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth =
      doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.text(title, pageWidth / 2, pageHeight / 2, { align: "center" });
    doc.autoTable(content);
    doc.save(createNamefile() + ".pdf");
  };

  /// generate name file

  const createNamefile = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    return "DL_Tai_Khoan_" + today;
  };

  // data table

  const assemblePosts = () => {
    let Users = users
      ? users.map((user) => {
          return {
            name: user.name,
            username: user.username,
            email: user.email,
            type: getTextDisplayUserType(user.type),
            createdAt: formatDate(user.createdAt),
            action: <ActionButtons _id={user._id} />,
          };
        })
      : "";
    return Users;
  };

  const data = {
    columns: [
      {
        label: "Tên người dùng",
        field: "name",
        sort: "asc",
        attributes: {
          width: "15%",
        },
      },
      {
        label: "Tên tài khoản",
        field: "username",
        sort: "asc",
        attributes: {
          width: "15%",
        },
      },
      {
        label: "Địa chỉ mail",
        field: "email",
        sort: "asc",
        attributes: {
          width: "15%",
        },
      },
      {
        label: "Loại tài khoản",
        field: "type",
        sort: "asc",
        attributes: {
          width: "15%",
        },
      },
      {
        label: "Thời gian",
        field: "createdAt",
        sort: "asc",
        attributes: {
          width: "10%",
        },
      },
      {
        label: "Hành động",
        field: "action",
        sort: "asc",
        attributes: {
          width: "8%",
        },
      },
    ],
    rows: assemblePosts(),
  };

  const FuncRefresh = () => {
    getUsers();
  };

  let body = null;

  if (usersLoading) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
      </div>
    );
  } else if (users && users.length === 0) {
    body = (
      <>
        <Card className="text-center mx-5 my-5">
          <Card.Header as="h1">Chào {name}</Card.Header>
          <Card.Body>
            <Card.Text>
              Chưa có tài khoản nào được tìm thấy, vui lòng thử lại
            </Card.Text>
            <center>
              <Button
                title="Làm mới dữ liệu"
                style={{
                  marginLeft: "10px",
                  background: "#1261A0",
                  border: "none",
                }}
                onClick={() => {
                  FuncRefresh();
                }}
              >
                <HiRefresh />
              </Button>
            </center>
          </Card.Body>
        </Card>
      </>
    );
  } else {
    body = (
      <>
        <div
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div id="left">
            <Button
              style={{
                background: "#1261A0",
                border: "none",
                marginLeft: "10px",
              }}
              onClick={hanlderClickCSV}
            >
              <CSVLink
                id="filecsv"
                data={createdata()}
                filename={createNamefile() + ".csv"}
              ></CSVLink>
              <FaFileCsv />
            </Button>
            <Button
              style={{
                marginLeft: "10px",
                background: "#1261A0",
                border: "none",
              }}
              onClick={(e) => {
                downloadxls(e, createdata());
              }}
            >
              <FaFileExcel />
            </Button>
            <Button
              style={{
                marginLeft: "10px",
                background: "#1261A0",
                border: "none",
              }}
              onClick={() => {
                exportPDF();
              }}
            >
              <FaFilePdf />
            </Button>

            <Button
              title="Làm mới dữ liệu"
              style={{
                marginLeft: "10px",
                background: "#1261A0",
                border: "none",
              }}
              onClick={() => {
                FuncRefresh();
              }}
            >
              <HiRefresh />
            </Button>
          </div>
          <div id="right">
            <Button
              style={{
                background: "#1261A0",
                border: "none",
                marginRight: "10px",
              }}
              onClick={setShowAddUserModal.bind(this, true)}
            >
              Thêm ngay
            </Button>
          </div>
        </div>
        <div
          id="block_data_table"
          style={{
            overflow: "scroll",
            maxHeight: "calc(100vh - 116px)",
            padding: 0,
          }}
        >
          {data ? (
            <MDBDataTable
              data={data}
              paging={false}
              info={false}
              responsive
              bordered
            />
          ) : (
            ""
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {body}
      <Register />
      {user !== null && showUpdateUserModal && <UpdateUserModal />}
      {/* After user is added, show toast */}
      <Toast
        show={show}
        style={{ position: "fixed", top: "20%", right: "10px" }}
        className={`bg-${type} text-white`}
        onClose={setShowToast.bind(this, {
          show: false,
          message: "",
          type: null,
        })}
        delay={3000}
        autohide
      >
        <Toast.Body>
          <strong>{message}</strong>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default Account;
