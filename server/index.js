const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// Game constants
const PORT = 4000;
const PLAYER_LIMIT_PER_ROOM = 4;
const ROUND_LIMIT = 2;
const GAME_LIMIT = 2;

// Message types
const NEW_CARD_MESSAGE_EVENT = "newCardMessage";
const ROUND_MESSAGE_EVENT = "roundMessage";
const NEW_JOIN_EVENT = "newJoin";
const GAME_END_EVENT = "gameEnd";
const ROOM_END_EVENT = "roomEnd";

let total_messages_map = new Map(); // this map stores total messages per room
let client_room_map = new Map();  // this map stores the socket.id and player_number for each room
let game_count_per_room_map = new Map(); // this map stores the number of games completed per room

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // fetch the roomId 
  const { roomId, playerNumber } = socket.handshake.query;

  // if no games were played for the current room, initialize the game_count_per_room_map
  if (!game_count_per_room_map.has(roomId)) {
    game_count_per_room_map.set(roomId, 0);
    total_messages_map.set(roomId, 0);
  }

  // if this is a new room set the client_room_map for the room to []
  if(!client_room_map.has(roomId)) {
    socket.join(roomId);
    const player_number = playerNumber;
    client_room_map.set(roomId, [{ "socketid": socket.id, "number": player_number }]);

  } else if(client_room_map.get(roomId).length < PLAYER_LIMIT_PER_ROOM) {

    socket.join(roomId);
    const player_number = playerNumber;
    client_room_map.set(roomId, [...client_room_map.get(roomId), { "socketid": socket.id, "number": player_number }]);
    io.in(roomId).emit(NEW_JOIN_EVENT, client_room_map.get(roomId));

  } else {
    console.log("Room is full");
  }

  // Listen for new messages
  socket.on(NEW_CARD_MESSAGE_EVENT, (data) => {
    total_messages_map.set(roomId, total_messages_map.get(roomId)+1);
    io.in(roomId).emit(NEW_CARD_MESSAGE_EVENT, data);

    console.log(`Total messages in room ${roomId}: ${total_messages_map.get(roomId)}`);
    if(total_messages_map.get(roomId) === ROUND_LIMIT * PLAYER_LIMIT_PER_ROOM) {
      // send a GAME_END_EVENT event to all clients
      game_count_per_room_map.set(roomId, game_count_per_room_map.get(roomId)+1);
      total_messages_map.set(roomId, 0);
      console.log(`Game ${game_count_per_room_map.get(roomId)} in room ${roomId} completed`);

      if(game_count_per_room_map.get(roomId) === GAME_LIMIT) {
        // send a GAME_END_EVENT event to all clients
        io.in(roomId).emit(ROOM_END_EVENT);
        console.log(`Room ${roomId} completed`);
      } else {
        io.in(roomId).emit(GAME_END_EVENT);
      }

    } else if(total_messages_map.get(roomId) % 4 === 0) {  
      // send a ROUND_MESSAGE_EVENT channel in roomId
      io.in(roomId).emit(ROUND_MESSAGE_EVENT, total_messages_map.get(roomId)/PLAYER_LIMIT_PER_ROOM + 1);
    }
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    client_room_map.set(roomId, client_room_map.get(roomId).filter((val) => val.socketid !== socket.id));
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
