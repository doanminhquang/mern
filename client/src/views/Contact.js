import { useContext, useEffect, useState } from "react";
//---------------------------------------------------
import axios from "axios";
import { apiUrl } from "../contexts/constants";
import { ContactContext } from "../contexts/ContactContext";
import { AuthContext } from "../contexts/AuthContext";
//---------------------------------------------------
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";
//---------------------------------------------------
import UpdateContactModal from "../components/contacts/UpdateContactModal";
import ViewContactModal from "../components/contacts/ShowContactModal";
import ActionButtons from "../components/contacts/ActionButtons";
//---------------------------------------------------
import { MdSend } from "react-icons/md";
import { Form } from "react-bootstrap";
//---------------------------------------------------
import { formatDate } from "../utils/FormatDate";
import BeVietNamProFont from "../utils/BeVietNamPro";
import { getExtension } from "../utils/CheckExtension";
import { convertBase64 } from "../utils/convertBase64";
import { getTextDisplayContact } from "../utils/GettextDisplay";
//---------------------------------------------------
import { FaFileCsv } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";
//---------------------------------------------------
import { MDBDataTable } from "mdbreact";
import { CSVLink } from "react-csv";
import XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ContactView = () => {
  // Contexts
  const {
    authState: {
      user: { name },
    },
  } = useContext(AuthContext);

  const {
    contactState: { contact, contacts, contactsLoading },
    getContacts,
    showToast: { show, message, type },
    setShowToast,
    showContactModal,
    showUpdateContactModal,
  } = useContext(ContactContext);

  const [File, setFile] = useState();
  const [LockSend, SetLockSend] = useState(true);
  const [ChangeFile, SetChangeFile] = useState(false);

  // Start: Get all contacts
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getContacts();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  const isEXCEL = (file) => {
    if (file.size > 0) {
      var ext = getExtension(file.name);
      switch (ext.toLowerCase()) {
        case "xlsx":
        case "xls":
          return true;
      }
    }
    return false;
  };

  const uploadFileCSV = async (e) => {
    const file = e.target.files[0];
    if (file)
      if (file.size > 0 && getExtension(file.name).toLowerCase() === "csv") {
        const base64 = await convertBase64(file);
        setFile({ base64: base64 });
        SetLockSend(false);
      } else {
        alert("Tệp tin không hợp lệ, chỉ chấp nhận CSV");
        SetLockSend(true);
      }
  };

  const uploadFileExcel = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (isEXCEL(file)) {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
          var data = event.target.result;

          var workbook = XLSX.read(data, {
            type: "binary",
          });
          workbook.SheetNames.forEach((sheet) => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[sheet]
            );
            let jsonObject = JSON.stringify(rowObject);
            setFile({ jsonObject: jsonObject });
            SetLockSend(false);
          });
        };
        fileReader.readAsBinaryString(file);
      } else {
        alert("Tệp tin không hợp lệ, chỉ chấp nhận Excel");
        SetLockSend(true);
      }
    }
  };

  const hanlderClickUpload = () => {
    var ELMInput = document.getElementById("upload");
    ELMInput.click();
  };

  // Add CSV
  const addCSV = async (file) => {
    try {
      let response = await axios.post(`${apiUrl}/contacts/csv`, file);
      if (response.data.success) {
        getContacts();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  // Add Excel
  const addExcel = async (file) => {
    try {
      let response = await axios.post(`${apiUrl}/contacts/excel`, file);
      if (response.data.success) {
        getContacts();
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Máy chủ lỗi" };
    }
  };

  const FuncRefresh = () => {
    getContacts();
    document.getElementById("upload").value = "";
  };

  const onSubmitCSV = async (event) => {
    event.preventDefault();
    const { success, message } = await addCSV(File);
    if (success) {
      setFile({ base64: null });
      SetLockSend(true);
    }
    setShowToast({ show: true, message, type: success ? "success" : "danger" });
    document.getElementById("upload").value = "";
  };

  const onSubmitExcel = async (event) => {
    event.preventDefault();
    const { success, message } = await addExcel(File);
    if (success) {
      setFile({ jsonObject: null });
      SetLockSend(true);
    }
    setShowToast({ show: true, message, type: success ? "success" : "danger" });
    document.getElementById("upload").value = "";
  };

  const onChangeCheckBox = (boolvalue) => {
    SetChangeFile(boolvalue);
    SetLockSend(true);
  };

  // create data
  const createdata = () => {
    let Contacts = contacts
      ? contacts.map((contact) => {
          return {
            "Tên người gửi": contact.name,
            "Địa chỉ mail": contact.email,
            "Tiêu đề": contact.subject,
            "Nội dung": contact.message,
            "Trạng thái": getTextDisplayContact(contact.status),
            "Thời gian": formatDate(contact.createdAt),
          };
        })
      : "";
    return Contacts;
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
    const title = createNamefile().replace("DL_Lien_He_", "Dữ Liệu Liên Hệ - ");
    const headers = [
      [
        "Tên người gửi",
        "Địa chỉ mail",
        "Tiêu đề",
        "Nội dung",
        "Trạng thái",
        "Thời gian",
      ],
    ];
    let data = contacts.map((contact) => [
      contact.name,
      contact.email,
      contact.subject,
      contact.message,
      getTextDisplayContact(contact.status),
      formatDate(contact.createdAt),
    ]);
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
    return "DL_Lien_He_" + today;
  };

  // data table
  const assembleContacts = () => {
    let Contacts = contacts
      ? contacts.map((contact) => {
          return {
            name: contact.name,
            email: contact.email,
            subject: contact.subject,
            status: getTextDisplayContact(contact.status),
            createdAt: formatDate(contact.createdAt),
            action: <ActionButtons _id={contact._id} />,
          };
        })
      : "";
    return Contacts;
  };

  const data = {
    columns: [
      {
        label: "Tên người gửi",
        field: "name",
        sort: "asc",
        attributes: {
          width: "7%",
        },
      },
      {
        label: "Địa chỉ mail",
        field: "email",
        sort: "asc",
        attributes: {
          width: "5%",
        },
      },
      {
        label: "Tiêu đề",
        field: "subject",
        sort: "asc",
        attributes: {
          width: "8%",
        },
      },
      {
        label: "Trạng thái",
        field: "status",
        sort: "asc",
        attributes: {
          width: "5%",
        },
      },
      {
        label: "Thời gian",
        field: "createdAt",
        sort: "asc",
        attributes: {
          width: "5%",
        },
      },
      {
        label: "Hành động",
        field: "action",
        sort: "asc",
        attributes: {
          width: "6%",
        },
      },
    ],
    rows: assembleContacts(),
  };

  let body = null;

  if (contactsLoading) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
      </div>
    );
  } else if (contacts && contacts.length === 0) {
    body = (
      <>
        <Card className="text-center mx-5 my-5">
          <Card.Header as="h1">Chào {name}</Card.Header>
          <Card.Body>
            <Card.Text>Hiện tại chưa ghi nhận được thắc mắc náo</Card.Text>
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
              {ChangeFile ? (
                <form
                  style={{
                    display: "inline-block",
                  }}
                  onSubmit={onSubmitCSV}
                >
                  <Form.Check
                    type="checkbox"
                    label="CSV"
                    style={{ display: "inline-flex", marginRight: "10px" }}
                    onChange={() => onChangeCheckBox(false)}
                  />
                  <Button
                    style={{
                      background: "#1261A0",
                      border: 0,
                    }}
                    onClick={hanlderClickUpload}
                    title="Nhập tệp CSV"
                  >
                    <FaFileUpload />
                    <input
                      id="upload"
                      type="file"
                      accept=".csv"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        uploadFileCSV(e);
                      }}
                    />
                  </Button>
                  <Button
                    type="submit"
                    disabled={LockSend}
                    title="Gửi"
                    style={{
                      background: "#1261A0",
                      border: 0,
                      marginLeft: "10px",
                    }}
                  >
                    <MdSend />
                  </Button>
                </form>
              ) : (
                <form
                  style={{
                    display: "inline-block",
                  }}
                  onSubmit={onSubmitExcel}
                >
                  <Form.Check
                    type="checkbox"
                    label="Excel"
                    style={{ display: "inline-flex", marginRight: "10px" }}
                    onChange={() => onChangeCheckBox(true)}
                    checked={true}
                  />
                  <Button
                    style={{
                      background: "#1261A0",
                      border: 0,
                    }}
                    onClick={hanlderClickUpload}
                    title="Nhập tệp Excel"
                  >
                    <FaFileUpload />
                    <input
                      id="upload"
                      type="file"
                      accept=".xls,.xlsx"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        uploadFileExcel(e);
                      }}
                    />
                  </Button>
                  <Button
                    type="submit"
                    disabled={LockSend}
                    title="Gửi"
                    style={{
                      background: "#1261A0",
                      border: 0,
                      marginLeft: "10px",
                    }}
                  >
                    <MdSend />
                  </Button>
                </form>
              )}
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
              title="Xuất tệp csv"
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
              title="Xuất tệp excel"
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
              title="Xuất tệp pdf"
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
          {ChangeFile ? (
            <form
              style={{
                display: "inline-block",
                float: "right",
                marginRight: "10px",
              }}
              onSubmit={onSubmitCSV}
            >
              <Form.Check
                type="checkbox"
                label="CSV"
                style={{ display: "inline-flex", marginRight: "10px" }}
                onChange={() => onChangeCheckBox(false)}
              />
              <Button
                style={{
                  background: "#1261A0",
                  border: 0,
                }}
                onClick={hanlderClickUpload}
                title="Nhập tệp CSV"
              >
                <FaFileUpload />
                <input
                  id="upload"
                  type="file"
                  accept=".csv"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    uploadFileCSV(e);
                  }}
                />
              </Button>
              <Button
                type="submit"
                disabled={LockSend}
                title="Gửi"
                style={{
                  background: "#1261A0",
                  border: 0,
                  marginLeft: "10px",
                }}
              >
                <MdSend />
              </Button>
            </form>
          ) : (
            <form
              style={{
                display: "inline-block",
                float: "right",
                marginRight: "10px",
              }}
              onSubmit={onSubmitExcel}
            >
              <Form.Check
                type="checkbox"
                label="Excel"
                style={{ display: "inline-flex", marginRight: "10px" }}
                onChange={() => onChangeCheckBox(true)}
                checked={true}
              />
              <Button
                style={{
                  background: "#1261A0",
                  border: 0,
                }}
                onClick={hanlderClickUpload}
                title="Nhập tệp Excel"
              >
                <FaFileUpload />
                <input
                  id="upload"
                  type="file"
                  accept=".xls,.xlsx"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    uploadFileExcel(e);
                  }}
                />
              </Button>
              <Button
                type="submit"
                disabled={LockSend}
                title="Gửi"
                style={{
                  background: "#1261A0",
                  border: 0,
                  marginLeft: "10px",
                }}
              >
                <MdSend />
              </Button>
            </form>
          )}
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
      {contact !== null && showUpdateContactModal && <UpdateContactModal />}
      {contact !== null && showContactModal && <ViewContactModal />}
      {/* After contact is added, show toast */}
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

export default ContactView;
