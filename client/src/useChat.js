import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

// Message types
const NEW_CARD_MESSAGE_EVENT = "newCardMessage";
const ROUND_MESSAGE_EVENT = "roundMessage";
const NEW_JOIN_EVENT = "newJoin";
const GAME_END_EVENT = "gameEnd";
const ROOM_END_EVENT = "roomEnd";

const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (roomId, playerNumber) => {
  const [ messages, setMessages ] = useState([]);
  const [ round, setRound ] = useState(1);
  const [ members, setMembers ] = useState([]);
  const [ cardSentForRound, setCardSentForRound ] = useState(0);
  const [ gameEnd, setGameEnd ] = useState(false);
  const [ roomEnd, setRoomEnd ] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId, playerNumber },
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

    socketRef.current.on(GAME_END_EVENT, () => {
      // TODO: save all the game information to DB

      // redirect all users to a new game page
      socketRef.current.disconnect();
      setGameEnd(true);
    });

    socketRef.current.on(ROOM_END_EVENT, () => {
      socketRef.current.disconnect();
      setRoomEnd(true);
    });

    return () => {
      // socketRef.current.disconnect();
    };
  }, [ roomId, socketRef, playerNumber ]);

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
        computerPlayer: false,
      };
      socketRef.current.emit(NEW_CARD_MESSAGE_EVENT, messsageJson);

      return messsageJson;
    }
  };

  return { messages, round, members, player_number, gameEnd, roomEnd, sendMessage, socketRef };
};

export default useChat;
