import { useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import Navbar from "./Navbar";
import Axios from "axios";
import { apiUrl } from "../contexts/constants";
import ChatPopup from "../components/chat/ChatPopupComponent";

function App_Compile() {
  const [userCode, setUserCode] = useState(``);

  const [userLang, setUserLang] = useState("python");

  const [userTheme, setUserTheme] = useState("vs-dark");

  const [fontSize, setFontSize] = useState(20);

  const [userInput, setUserInput] = useState("");

  const [userOutput, setUserOutput] = useState("");

  const [inputRadio, setInputRadio] = useState("false");

  const options = {
    fontSize: fontSize,
  };

  // Function to call the compile endpoint

  function compile() {
    if (userCode === ``) {
      return;
    }

    // Post request to compile endpoint

    Axios.post(`${apiUrl}/compilecode`, {
      code: userCode,
      language: userLang,
      input: userInput,
      inputRadio: inputRadio,
    }).then((res) => {
      setUserOutput(res.data.output);
    });
  }

  // Function to clear the output screen

  function clearOutput() {
    setUserOutput("");
  }

  return (
    <>
      <div className="App">
        <Navbar
          userLang={userLang}
          setUserLang={setUserLang}
          userTheme={userTheme}
          setUserTheme={setUserTheme}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />

        <div className="main">
          <div className="left-container">
            <Editor
              options={options}
              height="calc(100vh - 50px)"
              width="100%"
              theme={userTheme}
              language={userLang}
              defaultLanguage="python"
              defaultValue="# Điền code tại đây"
              onChange={(value) => {
                setUserCode(value);
              }}
              id="code"
            />

            <button id="run-btn" className="run-btn" onClick={() => compile()}>
              Chạy
            </button>
          </div>

          <div className="right-container">
            <h4 className="h44">Tham số:</h4>
            <div onChange={(event) => setInputRadio(event.target.value)}>
              <input
                type="radio"
                value="true"
                name="inputRadio"
                checked={inputRadio === "true"}
              />
              <b style={{ color: "white", marginLeft: 5 }}>Có</b>
              <input
                type="radio"
                value="false"
                name="inputRadio"
                checked={inputRadio === "false"}
                style={{ marginLeft: 10 }}
              />
              <b style={{ color: "white", marginLeft: 5 }}>Không</b>
            </div>
            <div className="input-box">
              <textarea
                id="code-inp"
                onChange={(e) => setUserInput(e.target.value)}
                disabled={inputRadio === "false"}
              ></textarea>
            </div>

            <h4 className="h44">Kết quả:</h4>
            <div className="output-box">
              <pre id="userOutput" style={{ color: "green" }}>
                {userOutput}
              </pre>

              <button
                id="clear-btn"
                onClick={() => {
                  clearOutput();
                }}
                className="clear-btn"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <ChatPopup float="left" />
    </>
  );
}

export default App_Compile;
