import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
//-----------------------------------------
import { useContext, useState, useEffect } from "react";
//-----------------------------------------
import { QuestionContext } from "../../contexts/QuestionContext";

const ShowQuestionModal = () => {
  // Contexts
  const {
    questionState: { question },
    showQuestionModal,
    setShowQuestionModal,
    setShowToastQ,
  } = useContext(QuestionContext);

  // State
  const [showQuestion, setshowQuestion] = useState(question);
  const [checked, setchecked] = useState("");
  const [showanswer, setShowanswer] = useState(false);

  const [checkedState, setCheckedState] = useState(
    new Array(showQuestion ? showQuestion.choice.length : 1).fill(false)
  );

  useEffect(() => setshowQuestion(question), [question]);

  const closeDialog = () => {
    setShowQuestionModal(false);
  };

  const CheckAnswer = () => {
    if (showQuestion.answer.length === 1) {
      if (checked === "") {
        setShowToastQ({
          showQ: true,
          messageQ: "Chưa chọn đáp án nào",
          typeQ: "danger",
        });
      } else {
        setShowanswer(true);
      }
    } else {
      if (checkedState.indexOf(true) === -1) {
        setShowToastQ({
          showQ: true,
          messageQ: "Chưa chọn đáp án nào",
          typeQ: "danger",
        });
      } else {
        setShowanswer(true);
      }
    }
  };

  const SetRadioChecked = (event) => {
    setchecked(event.target.value);
  };

  const handleOnChange = (event, position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };

  let countanswer = 0;

  const Fnccountanswer = () => {
    countanswer++;
    return " Đúng";
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
    <Modal show={showQuestionModal} onHide={closeDialog} size="xl">
      <Modal.Header closeButton>
        <Modal.Title
          style={{
            width: "100%",
            fontSize: "1.2rem",
          }}
        >
          {showQuestion.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: "76vh" }}>
        <div>
          {showQuestion.attachments !== "" ? (
            isBase64UrlImage(showQuestion.attachments) ? (
              <img src={showQuestion.attachments} />
            ) : (
              <audio
                controls="controls"
                autoBuffer="autobuffer"
                autoPlay="autoplay"
              >
                <source src={showQuestion.attachments} />
              </audio>
            )
          ) : (
            ""
          )}
        </div>
        <div>
          {showQuestion.choice.map(function (item, i) {
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
                  <label>
                    <input
                      type={
                        showQuestion.answer.length === 1 ? "radio" : "checkbox"
                      }
                      name={showQuestion._id}
                      value={item}
                      checked={
                        showQuestion.answer.length === 1
                          ? checked === item
                          : checkedState[i]
                      }
                      onChange={(e) => {
                        showQuestion.answer.length === 1
                          ? SetRadioChecked(e)
                          : handleOnChange(e, i);
                      }}
                      disabled={showanswer}
                    />{" "}
                    {item}
                    {showanswer && showQuestion.answer.length === 1
                      ? item === checked
                        ? item === showQuestion.answer[0]
                          ? " Đúng"
                          : " Sai"
                        : ""
                      : showanswer && checkedState[i]
                      ? showQuestion.answer.indexOf(item) > -1 &&
                        item ===
                          showQuestion.answer[showQuestion.answer.indexOf(item)]
                        ? Fnccountanswer()
                        : " Sai"
                      : ""}
                  </label>
                </div>
              </>
            );
          })}
          <p>
            {showQuestion.answer.length === 1
              ? showQuestion.answer[0] === checked
                ? showanswer && "Đúng"
                : showanswer && "Sai"
              : countanswer === showQuestion.answer.length &&
                checkedState.filter((x) => x == true).length ===
                  showQuestion.answer.length
              ? "Đúng và đủ"
              : countanswer === showQuestion.answer.length &&
                checkedState.filter((x) => x == true).length >
                  showQuestion.answer.length
              ? "Có ý đúng nhưng lựa chọn dư"
              : countanswer !== 0
              ? "Có ý đúng nhưng chưa đủ"
              : showanswer && "Sai toàn bộ"}
          </p>
          {!showanswer ? (
            <Button
              disabled={showanswer}
              onClick={() => {
                CheckAnswer();
              }}
            >
              Kiểm tra
            </Button>
          ) : (
            <Button
              disabled={!showanswer}
              onClick={() => {
                setShowanswer(false);
              }}
            >
              Làm lại
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShowQuestionModal;
