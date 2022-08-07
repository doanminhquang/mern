import { useContext, useEffect } from "react";
import { CategoryContext } from "../contexts/CategoryContext";
import { AuthContext } from "../contexts/AuthContext";
//--------------------------------------------------
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";
//--------------------------------------------------
import AddCategoryModal from "../components/categorys/AddCategoryModal";
import UpdateCategoryModal from "../components/categorys/UpdateCategoryModal";
import ActionButtons from "../components/categorys/ActionButtons";
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
import BeVietNamProFont from "../utils/BeVietNamPro";

const Category = () => {
  // Contexts
  const {
    authState: {
      user: { name },
    },
  } = useContext(AuthContext);

  const {
    categoryState: { category, categorys, categorysLoading },
    getCategorys,
    setShowAddCategoryModal,
    showUpdateCategoryModal,
    showToast: { show, message, type },
    setShowToast,
  } = useContext(CategoryContext);

  // Start: Get all Categorys
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getCategorys();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  // create data
  const createdata = () => {
    let Categorys = categorys
      ? categorys.map((category) => {
          return {
            "Thể loại": category.name,
          };
        })
      : "";
    return Categorys;
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
      "DL_The_Loai_",
      "Dữ Liệu Thể Loại - "
    );
    const headers = [["Thể loại"]];
    let data = categorys ? categorys.map((category) => [category.name]) : "";
    let content = {
      startY: 50,
      head: headers,
      body: data,
      pageBreak: "avoid",
      theme: "grid",
      headStyles: {
        textColor: "white",
        fontStyle: "bold",
        background: "#603ce4",
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
    return "DL_The_Loai_" + today;
  };

  // data table

  const assemblePosts = () => {
    let Categorys = categorys
      ? categorys.map((category) => {
          return {
            name: category.name,
            action: <ActionButtons _id={category._id} />,
          };
        })
      : "";
    return Categorys;
  };

  const data = {
    columns: [
      {
        label: "Thể loại",
        field: "name",
        sort: "asc",
        attributes: {
          width: "85%",
        },
      },
      {
        label: "Hành động",
        field: "action",
        sort: "asc",
        attributes: {
          width: "15%",
        },
      },
    ],
    rows: assemblePosts(),
  };

  const FuncRefresh = () => {
    getCategorys();
  };

  let body = null;

  if (categorysLoading) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" style={{ color: "#603ce4" }} />
      </div>
    );
  } else if (categorys && categorys.length === 0) {
    body = (
      <>
        <Card className="text-center mx-5 my-5">
          <Card.Header as="h1">Chào {name}</Card.Header>
          <Card.Body>
            <Card.Text>
              Chưa có thể loại nào được tìm thấy, vui lòng thêm dữ liệu
            </Card.Text>
            <center>
              <Button
                style={{
                  background: "#603ce4",
                  border: "none",
                  marginRight: "10px",
                  padding: 10,
                }}
                onClick={setShowAddCategoryModal.bind(this, true)}
              >
                Thêm ngay
              </Button>
              <Button
                title="Làm mới dữ liệu"
                style={{
                  marginLeft: "10px",
                  background: "#603ce4",
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
                background: "#603ce4",
                border: "none",
                marginLeft: "10px",
                padding: 10,
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
                background: "#603ce4",
                border: "none",
                padding: 10,
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
                background: "#603ce4",
                border: "none",
                padding: 10,
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
                background: "#603ce4",
                border: "none",
                padding: 10,
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
                background: "#603ce4",
                border: "none",
                marginRight: "10px",
                padding: 10,
              }}
              onClick={setShowAddCategoryModal.bind(this, true)}
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
            background: "white",
            padding: 10,
            borderRadius: 15,
          }}
        >
          {data ? (
            <MDBDataTable
              data={data}
              paging={false}
              info={false}
              hover={true}
              responsive
              bordered
              entries={5}
              displayEntries={false}
              searchLabel="Tìm kiếm"
              noRecordsFoundLabel="Chưa có bản ghi nào"
              paginationLabel={["Trước", "Sau"]}
            />
          ) : (
            ""
          )}
        </div>
      </>
    );
  }

  return (
    <div
      style={{
        padding: " 2.75rem 2.25rem",
        width: "100%",
        position: "relative",
      }}
    >
      {body}
      <AddCategoryModal />
      {category !== null && showUpdateCategoryModal && <UpdateCategoryModal />}
      {/* After category is added, show toast */}
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
    </div>
  );
};

export default Category;
