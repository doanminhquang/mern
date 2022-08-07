import { useContext, useEffect } from "react";
//---------------------------------------------------
import { PostContext } from "../contexts/PostContext";
import { VideoContext } from "../contexts/VideoContext";
import { StudentContext } from "../contexts/StudentContext";
import { CommentContext } from "../contexts/CommentContext";
import { CategoryContext } from "../contexts/CategoryContext";
import { AuthContext } from "../contexts/AuthContext";
import { QuestionContext } from "../contexts/QuestionContext";
//---------------------------------------------------
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";
//---------------------------------------------------
import AddPostModal from "../components/posts/AddPostModal";
import UpdatePostModal from "../components/posts/UpdatePostModal";
import ViewPostModal from "../components/posts/ShowPostModal";
import ActionButtons from "../components/posts/ActionButtons";
//---------------------------------------------------
import { MDBDataTable } from "mdbreact";
import BeVietNamProFont from "../utils/BeVietNamPro";
import { formatDate } from "../utils/FormatDate";
import { getCurrencyVnd } from "../utils/GettextDisplay";
//---------------------------------------------------
import { FaFileCsv } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";
//---------------------------------------------------
import { CSVLink } from "react-csv";
import XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CoursesD = () => {
  // Contexts
  const {
    authState: {
      user: { name },
    },
  } = useContext(AuthContext);

  const {
    postState: { post, posts, postsLoading },
    getPosts,
    setShowAddPostModal,
    showToast: { show, message, type },
    setShowToast,
    showUpdatePostModal,
    showPostModal,
  } = useContext(PostContext);

  const {
    videoState: { videosLoading },
    getAllVideo,
  } = useContext(VideoContext);

  const {
    studentState: { studentsLoading },
    getStudents,
  } = useContext(StudentContext);

  const {
    commentState: { commentLoading },
    getComments,
  } = useContext(CommentContext);

  const {
    categoryState: { categorysLoading },
    getCategorys,
  } = useContext(CategoryContext);

  const {
    questionState: { questionsLoading },
    getAllQuestion,
  } = useContext(QuestionContext);

  // Start: Get all posts
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getPosts();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  // Start: Get all videos
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getAllVideo();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  // Start: Get all students
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getStudents();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  // Start: Get all comments
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getComments();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  // Start: Get all category
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

  // Start: Get all questions
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getAllQuestion();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  const removeHTML = (str) => {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
  };

  // create data
  const createdata = () => {
    let Posts = posts
      ? posts.map((post) => {
          return {
            "Tiêu đề": post.title,
            "Loại khóa học": post.category && post.category.name,
            "Tác giả": post.user.name + " - " + post.user.username,
            "Mô tả": removeHTML(post.description),
            Giá: getCurrencyVnd(post.price),
            "Tổng thu nhập": getCurrencyVnd(post.sumprice),
            "Thời gian": formatDate(post.createdAt),
          };
        })
      : "";
    return Posts;
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

  const FuncRefresh = () => {
    getPosts();
    getAllVideo();
    getStudents();
    getComments();
    getCategorys();
    getAllQuestion();
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
      "DL_Khoa_Hoc_",
      "Dữ Liệu Khóa Học - "
    );
    const headers = [
      [
        "Tiêu đề",
        "Loại khóa học",
        "Tác giả",
        "Mô tả",
        "Giá",
        "Tổng thu nhập",
        "Thời gian",
      ],
    ];
    let data = posts
      ? posts.map((post) => [
          post.title,
          post.category.name,
          post.user.name + " - " + post.user.username,
          removeHTML(post.description),
          getCurrencyVnd(post.price),
          getCurrencyVnd(post.sumprice),
          formatDate(post.createdAt),
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
        1: {
          columnWidth: 100,
        },
        2: {
          columnWidth: 120,
        },
        3: {},
        4: {},
        5: {},
        6: {},
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
    return "DL_Khoa_Hoc_" + today;
  };

  // data table

  const assemblePosts = () => {
    let Posts = posts
      ? posts.map((post) => {
          return {
            tilte: post.title,
            coursetype: post.category && post.category.name,
            username: post.user.name + " - " + post.user.username,
            description: (
              <div
                style={{
                  maxHeight: "100px",
                  overflow: "hidden",
                  textAlign: "justify",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 4,
                  display: "-webkit-box",
                }}
              >
                {removeHTML(post.description)}
              </div>
            ),
            price: getCurrencyVnd(post.price),
            sumprice: getCurrencyVnd(post.sumprice),
            createdAt: formatDate(post.createdAt),
            action: <ActionButtons _id={post._id} />,
          };
        })
      : "";
    return Posts;
  };

  const data = {
    columns: [
      {
        label: "Tên khóa học",
        field: "tilte",
        sort: "asc",
        attributes: {
          width: "20%",
        },
      },
      {
        label: "Loại khóa học",
        field: "coursetype",
        sort: "asc",
        attributes: {
          width: "10%",
        },
      },
      {
        label: "Tác giả",
        field: "username",
        sort: "asc",
        attributes: {
          width: "10%",
        },
      },
      {
        label: "Mô tả",
        field: "description",
        sort: "asc",
        attributes: {
          width: "18%",
        },
      },
      {
        label: "Giá",
        field: "price",
        sort: "asc",
        attributes: {
          width: "5%",
        },
      },
      {
        label: "Tổng thu nhập",
        field: "sumprice",
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
          width: "15%",
        },
      },
    ],
    rows: assemblePosts(),
  };

  let body = null;

  if (
    postsLoading ||
    videosLoading ||
    studentsLoading ||
    commentLoading ||
    categorysLoading ||
    questionsLoading
  ) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" style={{ color: "#603ce4" }} />
      </div>
    );
  } else if (posts && posts.length === 0) {
    body = (
      <>
        <Card className="text-center mx-5 my-5">
          <Card.Header as="h1">Chào {name}</Card.Header>
          <Card.Body>
            <Card.Text>Click nút để thêm khóa học</Card.Text>
            <center>
              <Button
                style={{ background: "#603ce4", border: "none" }}
                onClick={setShowAddPostModal.bind(this, true)}
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
              onClick={setShowAddPostModal.bind(this, true)}
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
      <AddPostModal />
      {post !== null && showUpdatePostModal && <UpdatePostModal />}
      {post !== null && showPostModal && <ViewPostModal />}
      {/* After post is added, show toast */}
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

export default CoursesD;
