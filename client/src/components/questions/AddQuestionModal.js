import { useContext, useState } from "react";
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

const AddQuestionModal = () => {
  // Contexts
  const {
    postState: { post },
  } = useContext(PostContext);

  const {
    showAddQuestionModal,
    setShowAddQuestionModal,
    addQuestion,
    setShowToastQ,
  } = useContext(QuestionContext);

  // State
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    choice: [],
    answer: [],
    postid: post._id,
    attachments: "",
    base64: "",
  });

  const [choicetmp, setChoicetmp] = useState("");

  const { title, choice, answer, attachments, base64 } = newQuestion;

  const onChangeNewQuestionForm = (event) =>
    setNewQuestion({ ...newQuestion, [event.target.name]: event.target.value });

  const closeDialog = () => {
    setTimeout(resetAddPostData, 0);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (newQuestion.choice.length >= 2 && newQuestion.answer.length >= 1) {
      const { success, message } = await addQuestion(newQuestion);
      setTimeout(resetAddPostData(), 0);
      setShowToastQ({
        showQ: true,
        messageQ: message,
        typeQ: success ? "success" : "danger",
      });
    } else {
      setShowToastQ({
        showQ: true,
        messageQ: "Cần ít nhất hai lựa chọn và một đáp án trở lên",
        typeQ: "danger",
      });
    }
  };

  const resetAddPostData = () => {
    setNewQuestion({
      title: "",
      choice: [],
      answer: [],
      postid: post._id,
      attachments: "",
      base64: "",
    });
    setShowAddQuestionModal(false);
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (file)
      if (isImage(file) || isAudio(file)) {
        const base64 = await convertBase64(file);
        setNewQuestion({
          ...newQuestion,
          attachments: isImage(file) ? "image" : "audio",
          base64,
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
      let temparr2 = newQuestion.choice;
      var index = temparr2.indexOf(choicetmp);
      if (index !== -1) {
        setShowToastQ({
          showQ: true,
          messageQ: "Đã có lựa chọn này",
          typeQ: "danger",
        });
      } else {
        setNewQuestion({
          ...newQuestion,
          choice: [...choice, choicetmp],
        });
        setChoicetmp("");
      }
    }
  };

  const deletechoice = (i, str) => {
    let temparr = newQuestion.choice;
    temparr.splice(i, 1);
    setNewQuestion({
      ...newQuestion,
      choice: temparr,
    });

    let temparr2 = newQuestion.answer;
    var index = temparr2.indexOf(str);
    if (index !== -1) {
      temparr2.splice(index, 1);
      setNewQuestion({
        ...newQuestion,
        answer: temparr2,
      });
    }
  };

  const addtoanswer = (str) => {
    let value = newQuestion.answer.find((o) => o === str);
    if (value) {
      setShowToastQ({
        showQ: true,
        messageQ: "Đã tồn tại đáp án này",
        typeQ: "danger",
      });
    } else {
      setNewQuestion({
        ...newQuestion,
        answer: [...answer, str],
      });
    }
  };

  const deleteanswer = (i) => {
    let temparr = newQuestion.answer;
    temparr.splice(i, 1);
    setNewQuestion({
      ...newQuestion,
      answer: temparr,
    });
  };

  return (
    <Modal show={showAddQuestionModal} onHide={closeDialog} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>[Thêm câu hỏi] {post.title}</Modal.Title>
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
              onChange={onChangeNewQuestionForm}
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
            {attachments === "image" ? (
              <img src={base64} />
            ) : (
              <audio
                controls="controls"
                autoBuffer="autobuffer"
                autoPlay="autoplay"
              >
                <source src={base64} />
              </audio>
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
              {newQuestion.choice.map(function (item, i) {
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
              {newQuestion.answer.map(function (item, i) {
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

export default AddQuestionModal;
