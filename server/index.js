const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const PLAYER_LIMIT_PER_ROOM = 4;

// Message types
const NEW_CARD_MESSAGE_EVENT = "newCardMessage";
const ROUND_MESSAGE_EVENT = "roundMessage";
const NEW_JOIN_EVENT = "newJoin";

let total_messages_map = new Map();
let client_room_map = new Map();  // this map stores the socket.id and player_number for each room

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // fetch the roomId 
  const { roomId } = socket.handshake.query;

  // if this is a new room set the client_room_map for the room to []
  if(!client_room_map.has(roomId)) {
    socket.join(roomId);
    const player_number = Math.floor(Math.random() * 1000);
    client_room_map.set(roomId, [{ "socketid": socket.id, "number": player_number }]);

  } else if(client_room_map.get(roomId).length < PLAYER_LIMIT_PER_ROOM) {

    socket.join(roomId);
    const player_number = Math.floor(Math.random() * 1000);
    client_room_map.set(roomId, [...client_room_map.get(roomId), { "socketid": socket.id, "number": player_number }]);
    io.in(roomId).emit(NEW_JOIN_EVENT, client_room_map.get(roomId));

  } else {
    console.log("Room is full");
  }

  // if this is a new room set the total_messages for the room to 0
  if(!total_messages_map.has(roomId)) {
    total_messages_map.set(roomId, 0);
  }

  // Listen for new messages
  socket.on(NEW_CARD_MESSAGE_EVENT, (data) => {
    total_messages_map.set(roomId, total_messages_map.get(roomId)+1);
    io.in(roomId).emit(NEW_CARD_MESSAGE_EVENT, data);

    if(total_messages_map.get(roomId) % 4 === 0) {  
      // send a ROUND_MESSAGE_EVENT channel in roomId
      io.in(roomId).emit(ROUND_MESSAGE_EVENT, total_messages_map.get(roomId)/4 + 1);
    }
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    client_room_map.set(roomId, client_room_map.get(roomId).filter((val) => val.socketid !== socket.id));
    const vals = client_room_map.get(roomId).filter((val) => val.socketid !== socket.id);

    console.log(`Remaining clients in room ${roomId}: ${client_room_map.get(roomId)}`);
    for(let i = 0; i < vals.length; i++) {
      console.log(vals[i].socketid);
    }
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
