var clientIo = require('socket.io-client');

// Message types
const NEW_CARD_MESSAGE_EVENT = "newCardMessage";

const SOCKET_SERVER_URL = "http://localhost:4000";

const createComputerPlayer = (roomId) => {
    const playerNumber = Math.floor(Math.random()*90000) + 10000;
    var socket = clientIo.connect(SOCKET_SERVER_URL, {
        query: { roomId, playerNumber },
    });
    return socket;
}

const sendMessage = ( socketRef, messageBody ) => {

    let messsageJson = {
        body: messageBody + " | sent by: " + socketRef.id,
        senderId: socketRef.id,
        computerPlayer: true,
    };
    socketRef.emit(NEW_CARD_MESSAGE_EVENT, messsageJson);

    return messsageJson;
};

module.exports = { createComputerPlayer, sendMessage }