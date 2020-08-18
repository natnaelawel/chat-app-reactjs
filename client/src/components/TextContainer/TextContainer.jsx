import React from "react";

// import onlineIcon from "../../icons/onlineIcon.png";

import "./TextContainer.css";

const TextContainer = ({ users }) => (
  <div className="textContainer">
    <div>
      <h1>
        Realtime Chat Application{" "}
        <span role="img" aria-label="emoji">
          💬
        </span>
      </h1>
      <h2>
        Created with React, Express, Node and Socket.IO{" "}
        <span role="img" aria-label="emoji">
          ❤️
        </span>
      </h2>
      <h2>
        Try it out right now!{" "}
        <span role="img" aria-label="emoji">
          ⬅️
        </span>
      </h2>
    </div>
    {users && (
      <div>
        <h1>People currently chatting:</h1>
        <div className="activeContainer">
          {users.map(({ name }) => (
            <React.Fragment>
              <div key={name} className="activeItem">
                <h3><span>🔵 </span>{name}</h3>
                
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default TextContainer;
