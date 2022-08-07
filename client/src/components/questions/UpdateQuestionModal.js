import { useContext, useState, useEffect } from "react";
//------------------------------------------
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
//------------------------------------------
import { PostContext } from "../../contexts/PostContext";
import { QuestionContext } from "../../contexts/QuestionContext";
import { TiAttachmentOutline } from "react-icons/ti";
import { isImage, isAudio } from "../../utils/CheckExtension";
import { convertBase64 } from "../../utils/convertBase64";

const UpdateQuestionModal = () => {
  // Contexts
  const {
    postState: { post },
  } = useContext(PostContext);

  const {
    questionState: { question },
    showUpdateQuestionModal,
    setShowUpdateQuestionModal,
    updateQuestion,
    setShowToastQ,
  } = useContext(QuestionContext);

  // State

  const [updatedQuestion, setUpdatedQuestion] = useState(question);

  useEffect(() => setUpdatedQuestion(question), [question]);

  const [choicetmp, setChoicetmp] = useState("");

  const { title, choice, answer, attachments } = updatedQuestion;

  const onChangeupdateQuestionForm = (event) =>
    setUpdatedQuestion({
      ...updatedQuestion,
      [event.target.name]: event.target.value,
    });

  const closeDialog = () => {
    setUpdatedQuestion(question);
    setShowUpdateQuestionModal(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (
      updatedQuestion.choice.length >= 2 &&
      updatedQuestion.answer.length >= 1
    ) {
      const { success, message } = await updateQuestion(updatedQuestion);
      setShowToastQ({
        showQ: true,
        messageQ: message,
        typeQ: success ? "success" : "danger",
      });
      if (success) {
        closeDialog();
      }
    } else {
      setShowToastQ({
        showQ: true,
        messageQ: "Cần ít nhất hai lựa chọn và một đáp án trở lên",
        typeQ: "danger",
      });
    }
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (file)
      if (isImage(file) || isAudio(file)) {
        const base64 = await convertBase64(file);
        setUpdatedQuestion({
          ...updatedQuestion,
          attachments: base64,
        });
      } else {
        alert("Tệp tin không hợp lệ, chỉ chấp nhận hình ảnh hoặc âm thanh");
      }
  };

  const hanlderClickUpload = () => {
    var ELMInput = document.getElementById("upload");
    ELMInput.click();
  };

  const addnewchoice = () => {
    if (choicetmp === "") {
      setShowToastQ({
        showQ: true,
        messageQ: "Không được để trống lựa chọn",
        typeQ: "danger",
      });
    } else {
      let temparr2 = updatedQuestion.choice;
      var index = temparr2.indexOf(choicetmp);
      if (index !== -1) {
        setShowToastQ({
          showQ: true,
          messageQ: "Đã có lựa chọn này",
          typeQ: "danger",
        });
      } else {
        setUpdatedQuestion({
          ...updatedQuestion,
          choice: [...choice, choicetmp],
        });
        setChoicetmp("");
      }
    }
  };

  const deletechoice = (i, str) => {
    let temparr = updatedQuestion.choice;
    temparr.splice(i, 1);
    setUpdatedQuestion({
      ...updatedQuestion,
      choice: temparr,
    });

    let temparr2 = updatedQuestion.answer;
    var index = temparr2.indexOf(str);
    if (index !== -1) {
      temparr2.splice(index, 1);
      setUpdatedQuestion({
        ...updatedQuestion,
        answer: temparr2,
      });
    }
  };

  const addtoanswer = (str) => {
    let value = updatedQuestion.answer.find((o) => o === str);
    if (value) {
      setShowToastQ({
        showQ: true,
        messageQ: "Đã tồn tại đáp án này",
        typeQ: "danger",
      });
    } else {
      setUpdatedQuestion({
        ...updatedQuestion,
        answer: [...answer, str],
      });
    }
  };

  const deleteanswer = (i) => {
    let temparr = updatedQuestion.answer;
    temparr.splice(i, 1);
    setUpdatedQuestion({
      ...updatedQuestion,
      answer: temparr,
    });
  };

  async function isBase64UrlImage(base64String) {
    let image = new Image();
    image.src = base64String;
    return await new Promise((resolve) => {
      image.onload = function () {
        if (image.height === 0 || image.width === 0) {
          resolve(false);
          return;
        }
        resolve(true);
      };
      image.onerror = () => {
        resolve(false);
      };
    });
  }

  return (
    <Modal
      show={showUpdateQuestionModal}
      onHide={closeDialog}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>[Sửa câu hỏi] {post.title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Tiêu đề"
              name="title"
              required
              aria-describedby="title-help"
              value={title}
              onChange={onChangeupdateQuestionForm}
            />
            <Form.Text id="title-help" muted>
              Bắt buộc
            </Form.Text>
          </Form.Group>
          <div
            style={{
              margin: 10,
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            Chỉ chấp nhận file âm thanh hoặc hình ảnh:{" "}
            <Button
              style={{
                background: "#603ce4",
                border: 0,
                with: "100%",
              }}
              onClick={() => hanlderClickUpload()}
            >
              Vui lòng chọn tệp đính <TiAttachmentOutline />
              <input
                id="upload"
                type="file"
                accept="image/*|audio/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  uploadFile(e);
                }}
              />
            </Button>
          </div>
          <center>
            {updatedQuestion.attachments !== "" ? (
              isBase64UrlImage(updatedQuestion.attachments) ? (
                <img src={attachments} />
              ) : (
                <audio
                  controls="controls"
                  autoBuffer="autobuffer"
                  autoPlay="autoplay"
                >
                  <source src={attachments} />
                </audio>
              )
            ) : (
              ""
            )}
          </center>
          <div>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Lựa chọn"
                name="choice"
                value={choicetmp}
                onChange={(e) => setChoicetmp(e.target.value)}
              />
            </Form.Group>
            <Button
              style={{
                background: "#603ce4",
                border: 0,
                with: "100%",
              }}
              onClick={() => addnewchoice()}
            >
              Thêm lựa chọn
            </Button>
            <div style={{ padding: 5 }}>
              {updatedQuestion.choice.map(function (item, i) {
                return (
                  <>
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignContent: "center",
                        alignItems: "center",
                        margin: 5,
                      }}
                    >
                      {item}
                      <div style={{ width: "fit-content" }}>
                        <Button
                          style={{ marginRight: 5 }}
                          onClick={() => {
                            addtoanswer(item);
                          }}
                        >
                          Thêm lựa chọn làm đáp án
                        </Button>
                        <Button
                          onClick={() => {
                            deletechoice(i, item);
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            <p>Đáp án:</p>
            <div style={{ padding: 5 }}>
              {updatedQuestion.answer.map(function (item, i) {
                return (
                  <>
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignContent: "center",
                        alignItems: "center",
                        margin: 5,
                      }}
                    >
                      {item}
                      <Button
                        onClick={() => {
                          deleteanswer(i);
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ background: "rgb(96 60 228 / 82%)", border: "none" }}
            onClick={closeDialog}
          >
            Hủy
          </Button>
          <Button
            id="btn_add"
            style={{ background: "#603ce4", border: "none" }}
            type="submit"
          >
            Thêm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateQuestionModal;
