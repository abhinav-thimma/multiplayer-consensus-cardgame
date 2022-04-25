import React from "react";

import "./Card.css";

const Card = (props) => {

  const { owner, body } = props;
  return (
    <li
      className={`message-item-square ${owner ? "my-message" : "received-message"
        }`}
    >
      {body}
    </li>
  );
};

export default Card;
