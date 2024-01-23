import React, { useState } from "react";
import styled from "styled-components";
import ChatPage from "./ChatPage";
import { FaRocketchat } from "react-icons/fa";

const PopupContainer = styled.div`
  position: fixed;
  bottom: 130px;
  right: 10px;
  width: 300px;
  height: 400px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 999999;
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 70px;
  right: 30px;
  padding: 0px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  z-index: 999999;
  width: 40px;
  height: 40px;
  border: 0,
  borderradius: "50%";
`;

const PopupContainerLeft = styled.div`
  position: fixed;
  bottom: 130px;
  left: 10px;
  width: 300px;
  height: 400px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 999999;
`;

const ToggleButtonLeft = styled.button`
  position: fixed;
  bottom: 70px;
  left: 30px;
  padding: 0px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  z-index: 999999;
  width: 40px;
  height: 40px;
  border: 0,
  borderradius: "50%";
`;

const ChatPopup = ({ float }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {float === "left" ? (
        <>
          <ToggleButtonLeft onClick={togglePopup}>
            <FaRocketchat />
          </ToggleButtonLeft>
          <PopupContainerLeft isOpen={isOpen}>
            <ChatPage height="400px" />
          </PopupContainerLeft>
        </>
      ) : (
        <>
          <ToggleButton onClick={togglePopup}>
            <FaRocketchat />
          </ToggleButton>
          <PopupContainer isOpen={isOpen}>
            <ChatPage height="400px" />
          </PopupContainer>
        </>
      )}
    </>
  );
};

export default ChatPopup;
