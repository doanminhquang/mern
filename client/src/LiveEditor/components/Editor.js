import React, { useState, useEffect } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import { Controlled as ControlledEditor } from "react-codemirror2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompressAlt, faExpandAlt } from "@fortawesome/free-solid-svg-icons";

export default function Editor(props) {
  const {
    language,
    displayName,
    value,
    onChange,
    mode,
    onChangeSwitch,
    defaulValueSwitch,
  } = props;
  const [open, setOpen] = useState(mode);
  const [NewDisplayName, setNewDisplayName] = useState(displayName);

  function handleChange(editor, data, value) {
    onChange(value);
  }

  useEffect(() => {
    let cancel = false;
    if (!cancel) {
      if (defaulValueSwitch && NewDisplayName === "JS") {
        onChangeSwitch(true);
        setNewDisplayName("JQuery");
      } else if (!defaulValueSwitch && NewDisplayName === "JQuery") {
        onChangeSwitch(false);
        setNewDisplayName("JS");
      }
    }

    return () => {
      cancel = true;
    };
  }, [defaulValueSwitch]);

  const handleSwitchLanguage = () => {
    if (NewDisplayName === "JS") {
      onChangeSwitch(true);
      setNewDisplayName("JQuery");
    } else if (NewDisplayName === "JQuery") {
      onChangeSwitch(false);
      setNewDisplayName("JS");
    }
  };

  return (
    <div className={`editor-container ${open ? "" : "collapsed"}`}>
      <div className="editor-title">
        <button
          type="button"
          className="expand-collapse-btn"
          onClick={() => handleSwitchLanguage()}
        >
          {NewDisplayName}
        </button>
        <button
          type="button"
          className="expand-collapse-btn"
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        >
          <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt} />
        </button>
      </div>
      <ControlledEditor
        onBeforeChange={handleChange}
        value={value}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          theme: "material",
          lineNumbers: true,
        }}
      />
    </div>
  );
}
