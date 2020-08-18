import React, { useState, useEffect } from "react";
import queryString from "query-string";

import io from "socket.io-client";

// import style
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Messages from "../Messages/Messages";
import Input from "../Input/Input";
import TextContainer from "../TextContainer/TextContainer";

let socket;
function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const END_POINT = "localhost:4000";
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(END_POINT);

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
        console.log('user has joined')
        if(error){
            alert("error has occured ", error);
        }
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [END_POINT, location.search]);



  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
        setUsers(users);
    });
  }, [message]);


  const sendMessage = (event) => {
    event.preventDefault();
    console.log('message ', message)
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
      </div>
      <TextContainer users={users} />
    </div>
  );
}

export default Chat;
