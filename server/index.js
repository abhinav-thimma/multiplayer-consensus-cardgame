if (typeof(PhusionPassenger) != 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
}

const express = require("express");
const app = express();
const cors = require("cors");

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;

// Reading the room card configuration file
const ROOM_CARD_CONFIG = require("./RoomCardConfig.json");

// Game config
const CONFIG_MAP = new Map();

// Message types
const NEW_CARD_MESSAGE_EVENT = "newCardMessage";
const ROUND_MESSAGE_EVENT = "roundMessage";
const NEW_JOIN_EVENT = "newJoin";
const GAME_END_EVENT = "gameEnd";
const ROOM_END_EVENT = "roomEnd";

let total_messages_map = new Map(); // this map stores total messages per room
let client_room_map = new Map();  // this map stores the socket.id and player_number for each room
let game_count_per_room_map = new Map(); // this map stores the number of games completed per room
let room_assignment_map = new Map(); // This map stores how many players have been assigned to each room

function asignRoomId() {
  for(let i= 0; i< ROOM_CARD_CONFIG['rooms'].length; i++) {
    let roomid = ROOM_CARD_CONFIG['rooms'][i]['roomid'];
    let player_limit = ROOM_CARD_CONFIG['rooms'][i]['player_limit'];

    if(!room_assignment_map.get(roomid)) {
      room_assignment_map.set(roomid, 0);
    }

    if(room_assignment_map.get(roomid) < player_limit) {
      room_assignment_map.set(roomid, room_assignment_map.get(roomid) + 1);
      return roomid;
    }
  }
}

function assignCardsForPlayer(game_idx, room_id, player_idx) {
  let player_cards = [];

  for(let i= 0; i< ROOM_CARD_CONFIG.rooms.length; i++) {
    let current_room_id = ROOM_CARD_CONFIG.rooms[i].roomid;
    
    if(room_id === current_room_id) {
      let current_game = ROOM_CARD_CONFIG.rooms[i].games[game_idx];
      let cards = current_game.cards;

      for(let j= 0; j< cards.length; j++) {
        if(parseInt(cards[j].player) == parseInt(player_idx)) {
          player_cards.push(cards[j]);
        }
      }
    }
  }
  return player_cards;
}

function updateConfigMap(roomId) {

  for (let i = 0; i < ROOM_CARD_CONFIG['rooms'].length; i++) {
    let current_room_id = ROOM_CARD_CONFIG['rooms'][i]['roomid'];
    if (current_room_id === roomId) {
      let config = {
        'PLAYER_LIMIT_PER_ROOM': ROOM_CARD_CONFIG['rooms'][i]['player_limit'],
        'GAME_LIMIT': ROOM_CARD_CONFIG['rooms'][i]['game_limit'],
        'ROUND_LIMIT': ROOM_CARD_CONFIG['rooms'][i]['round_limit'],
        'COUNTDOWN_DURATION': 60000
      }
      CONFIG_MAP.set(roomId, config);
      break;
    }
  }
}

function getFeedbackQuestions(roomId, gameIdx) {
  let feedback_questions = [];

  for (let i = 0; i < ROOM_CARD_CONFIG.rooms.length; i++) {
    let current_room_id = ROOM_CARD_CONFIG.rooms[i].roomid;
    if (current_room_id === roomId) {
      let current_game = ROOM_CARD_CONFIG.rooms[i].games[gameIdx];
      feedback_questions = current_game.feedback_questions;
      break;
    }
  }
  return feedback_questions;
}

/*_______________________________________EXPRESS: START______________________________________________*/
// creating and handling API requests on express server
app.use(cors({
  origin: '*'
}));

app.get('/assignroom', (req, res) => {
  let roomId = asignRoomId();
  res.send({"room": roomId});
});

app.get('/getconfig', (req, res) => {
  let roomId = req.query.roomId;
  let playerNum = req.query.playerNum;
  let game_idx = game_count_per_room_map.get(roomId)? game_count_per_room_map.get(roomId) : 0;
  let player_idx = 0;

  if(client_room_map.get(roomId)) {
    client_room_map.get(roomId).forEach((value, key) => {
      if(value.number === playerNum) {
        player_idx = key;
      }
    });
  }

  let playerCards = assignCardsForPlayer(game_idx, roomId, player_idx);
  updateConfigMap(roomId);

  let feedback_questions = getFeedbackQuestions(roomId, game_idx);

  res.send({"cards": playerCards, "config": CONFIG_MAP.get(roomId), "feedback_questions": feedback_questions});
});


/*_______________________________________EXPRESS: END________________________________________________*/


/*_______________________________________SOCKET.IO: START______________________________________________*/
io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // fetch the roomId 
  const { roomId, playerNumber } = socket.handshake.query;
  if(!CONFIG_MAP.has(roomId)) {
    updateConfigMap(roomId);
  }

  // if no games were played for the current room, initialize the game_count_per_room_map
  if (!game_count_per_room_map.has(roomId)) {
    game_count_per_room_map.set(roomId, 0);
    total_messages_map.set(roomId, 0);
  }

  // if this is a new room set the client_room_map for the room to []
  if(!client_room_map.has(roomId)) {
    socket.join(roomId);
    const player_number = playerNumber;
    client_room_map.set(roomId, [{ "socketid": socket.id, "number": player_number}]);

  } else if(client_room_map.get(roomId).length < CONFIG_MAP.get(roomId).PLAYER_LIMIT_PER_ROOM) {

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
    if(total_messages_map.get(roomId) === CONFIG_MAP.get(roomId).ROUND_LIMIT * CONFIG_MAP.get(roomId).PLAYER_LIMIT_PER_ROOM) {
      // send a GAME_END_EVENT event to all clients
      game_count_per_room_map.set(roomId, game_count_per_room_map.get(roomId)+1);
      total_messages_map.set(roomId, 0);
      console.log(`Game ${game_count_per_room_map.get(roomId)} in room ${roomId} completed`);

      if(game_count_per_room_map.get(roomId) === CONFIG_MAP.get(roomId).GAME_LIMIT) {
        // send a GAME_END_EVENT event to all clients
        io.in(roomId).emit(ROOM_END_EVENT);
        console.log(`Room ${roomId} completed`);
      } else {
        io.in(roomId).emit(GAME_END_EVENT);
      }

    } else if(total_messages_map.get(roomId) % CONFIG_MAP.get(roomId).PLAYER_LIMIT_PER_ROOM === 0) {  
      // send a ROUND_MESSAGE_EVENT channel in roomId
      io.in(roomId).emit(ROUND_MESSAGE_EVENT, total_messages_map.get(roomId)/CONFIG_MAP.get(roomId).PLAYER_LIMIT_PER_ROOM + 1);
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
  console.log(`Socket.io and Express Listening on port ${PORT}`);
});

/*_______________________________________SOCKET.IO: END________________________________________________*/