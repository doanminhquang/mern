import { useState, useContext } from "react";
import { CgMenuBoxed } from "react-icons/cg";
import { QuestionContext } from "../../contexts/QuestionContext";
import Button from "react-bootstrap/Button";

const CardQuestion = (props) => {
  // Contexts
  const { setShowToastQ } = useContext(QuestionContext);

  // State
  const [checked, setchecked] = useState("");
  const [showanswer, setShowanswer] = useState(false);

  let data = props.item;

  const [checkedState, setCheckedState] = useState(
    new Array(data ? data.choice.length : 1).fill(false)
  );

  const CheckAnswer = () => {
    if (data.answer.length === 1) {
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
    <div>
      {data && (
        <>
          <h5>
            <CgMenuBoxed />
            <a>{data.title}</a>
          </h5>
          <div>
            {data.attachments ? (
              isBase64UrlImage(data.attachments) ? (
                <img src={data.attachments} />
              ) : (
                <audio
                  controls="controls"
                  autoBuffer="autobuffer"
                  autoPlay="autoplay"
                >
                  <source src={data.attachments} />
                </audio>
              )
            ) : (
              ""
            )}
          </div>
          <div>
            {data.choice.map(function (item, i) {
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
                        type={data.answer.length === 1 ? "radio" : "checkbox"}
                        name={item._id}
                        value={item}
                        checked={
                          data.answer.length === 1
                            ? checked === item
                            : checkedState[i]
                        }
                        onChange={(e) => {
                          data.answer.length === 1
                            ? SetRadioChecked(e)
                            : handleOnChange(e, i);
                        }}
                        disabled={showanswer}
                      />{" "}
                      {item}
                      {showanswer && data.answer.length === 1
                        ? item === checked
                          ? item === data.answer[0]
                            ? " Đúng"
                            : " Sai"
                          : ""
                        : showanswer && checkedState[i]
                        ? data.answer.indexOf(item) > -1 &&
                          item === data.answer[data.answer.indexOf(item)]
                          ? Fnccountanswer()
                          : " Sai"
                        : ""}
                    </label>
                  </div>
                </>
              );
            })}
            <p>
              {data.answer.length === 1
                ? data.answer[0] === checked
                  ? showanswer && "Đúng"
                  : showanswer && "Sai"
                : countanswer === data.answer.length &&
                  checkedState.filter((x) => x == true).length ===
                    data.answer.length
                ? "Đúng và đủ"
                : countanswer === data.answer.length &&
                  checkedState.filter((x) => x == true).length >
                    data.answer.length
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
        </>
      )}
    </div>
  );
};

export default CardQuestion;
