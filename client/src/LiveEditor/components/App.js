import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import useLocalStorage from "../hooks/useLocalStorage";

function App() {
  const [html, setHtml] = useLocalStorage("html", "");
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", "");
  const [srcDoc, setSrcDoc] = useState("");
  const [SwitchLanguageJS, SetSwitchLanguageJS] = useState(true);

  useEffect(() => {
    let cancel = false;
    if (!cancel) {
      if (html === "" && css === "" && js === "") {
        setHtml(
          '<h1>Bây giờ là </h1>\n<h1 id="time"></h1>\n<p>Live Editor</p>'
        );
        setCss(
          "body{\n     background: #444857;\n}\nh1{\n     color: white;\n     display: inline;\n}\np{\n     color:white; \n     font-size:28px;\n     text-align:center;\n     margin-top:20vh;\n}"
        );
        setJs(
          'setInterval(function() {\n     var today = new Date();\n     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();\n     //document.getElementById("time").innerHTML = time;\n  \t $("#time").html(time);  \t\n}, 1000);'
        );
      }
    }

    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
          ${
            SwitchLanguageJS
              ? '<script\n  src="https://code.jquery.com/jquery-3.6.0.min.js"\n  integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="\n  crossorigin="anonymous"></script>'
              : ""
          }
        </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, js, SwitchLanguageJS]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="pane left-pane">
          <Editor
            language="xml"
            displayName="HTML"
            value={html}
            onChange={setHtml}
            mode={true}
          />
          <Editor
            language="css"
            displayName="CSS"
            value={css}
            onChange={setCss}
            mode={true}
          />
          <Editor
            language="javascript"
            displayName="JS"
            value={js}
            onChange={setJs}
            mode={true}
            onChangeSwitch={SetSwitchLanguageJS}
            defaulValueSwitch={SwitchLanguageJS}
          />
        </div>
        <div className="pane">
          <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            frameBorder="0"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </>
  );
}

export default App;
