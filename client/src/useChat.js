import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CARD_MESSAGE_EVENT = "newCardMessage";
const ROUND_MESSAGE_EVENT = "roundMessage";
const NEW_JOIN_EVENT = "newJoin";
const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (roomId) => {
  const [ messages, setMessages ] = useState([]);
  const [ round, setRound ] = useState(1);
  const [ members, setMembers ] = useState([]);
  const [ cardSentForRound, setCardSentForRound ] = useState(0);
  const socketRef = useRef();

  
  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CARD_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    socketRef.current.on(ROUND_MESSAGE_EVENT, (round) => {
      setRound(round);
    });

    socketRef.current.on(NEW_JOIN_EVENT, (memberInfoList) => {
      setMembers(memberInfoList);
    });

    return () => {
      // socketRef.current.disconnect();
    };
  }, [ roomId, socketRef ]);

  let player_number = "Unknown";
  for (var i = 0, l = members.length; i < l; i++) {
    if(members[i]["socketid"] === socketRef.current.id) {
      player_number = "Player " + members[i]["number"];
      break;
    }
  }

  const sendMessage = (messageBody, round) => {
    if(cardSentForRound < round) {
      setCardSentForRound(round);
      let messsageJson = {
        body: messageBody + " | sent by: " + player_number,
        senderId: socketRef.current.id,
      };
      socketRef.current.emit(NEW_CARD_MESSAGE_EVENT, messsageJson);

      return messsageJson;
    }
  };

  return { messages, round, members, player_number, sendMessage, socketRef };
};

export default useChat;
