"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.CHAT_ROOM_PREFIX = exports.ROOM_PREFIX = exports.LogType = exports.DiceType = exports.TILE_TYPES = exports.allUrlAvatar = exports.CHARACTERS = exports.VIRTUAL_PLAYER_NAME = exports.SocketChatLogs = exports.SocketEndGameStatistics = exports.SocketNotificationLabels = exports.SocketChatLabels = exports.SocketPlayerMovementLabels = exports.SocketWaitRoomLabels = void 0;
var SocketWaitRoomLabels;
(function (SocketWaitRoomLabels) {
    SocketWaitRoomLabels["CreateRoom"] = "createRoom";
    SocketWaitRoomLabels["CreateAndJoinGameRoom"] = "createAndJoinGameRoom";
    SocketWaitRoomLabels["CodeGameCombatRoom"] = "codeGameCombatRoom";
    SocketWaitRoomLabels["RoomCreated"] = "roomCreated";
    SocketWaitRoomLabels["JoinRoom"] = "joinRoom";
    SocketWaitRoomLabels["RoomJoined"] = "roomJoined";
    SocketWaitRoomLabels["PlayersList"] = "playersList";
    SocketWaitRoomLabels["Error"] = "error";
    SocketWaitRoomLabels["RoomNotFound"] = "roomNotFound";
    SocketWaitRoomLabels["VirtualPlayerNotFound"] = "virtualPlayerNotFound";
    SocketWaitRoomLabels["AddVirtualPlayer"] = "addVirtualPlayer";
    SocketWaitRoomLabels["RemoveVirtualPlayer"] = "removeVirtualPlayer";
    SocketWaitRoomLabels["PlayerJoined"] = "playerJoined";
    SocketWaitRoomLabels["LeaveRoomResponse"] = "leaveRoomResponse";
    SocketWaitRoomLabels["RoomDestroyed"] = "roomDestroyed";
    SocketWaitRoomLabels["LeaveRoom"] = "leaveRoom";
    SocketWaitRoomLabels["JoinRoomSelectPlayer"] = "joinRoomSelectPlayer";
    SocketWaitRoomLabels["KickPlayer"] = "kickPlayer";
    SocketWaitRoomLabels["KickResponse"] = "kickResponse";
    SocketWaitRoomLabels["Kicked"] = "kicked";
    SocketWaitRoomLabels["IsRoomExist"] = "isRoomExist";
    SocketWaitRoomLabels["IsRoomExistResponse"] = "isRoomExistResponse";
    SocketWaitRoomLabels["IsRoomLocked"] = "isRoomLocked";
    SocketWaitRoomLabels["IsRoomLockedResponse"] = "isRoomLockedResponse";
    SocketWaitRoomLabels["IsRoomFull"] = "isRoomFull";
    SocketWaitRoomLabels["GetRoomFull"] = "getRoomFull";
    SocketWaitRoomLabels["ToggleRoomLock"] = "toggleRoomLock";
    SocketWaitRoomLabels["RoomLockStatus"] = "roomLockStatus";
    SocketWaitRoomLabels["GetActivePlayers"] = "getActivePlayers";
    SocketWaitRoomLabels["ActivePlayers"] = "activePlayers";
    SocketWaitRoomLabels["IsFirstPlayer"] = "isFirstPlayer";
    SocketWaitRoomLabels["IsFirstPlayerResponse"] = "isFirstPlayerResponse";
    SocketWaitRoomLabels["GetGameID"] = "getGameID";
    SocketWaitRoomLabels["ReturnGameID"] = "returnGameID";
    SocketWaitRoomLabels["GetGameSize"] = "getGameSize";
    SocketWaitRoomLabels["ReturnGameSize"] = "returnGameSize";
    SocketWaitRoomLabels["CharacterSelected"] = "characterSelected";
    SocketWaitRoomLabels["TheCharacterToDeselect"] = "theCharacterToDeselect";
    SocketWaitRoomLabels["CharacterDeselected"] = "characterDeselected";
    SocketWaitRoomLabels["TheCharacterDeselected"] = "theCharacterDeselected";
    SocketWaitRoomLabels["GetAllPlayerAndGameInfo"] = "getAllPlayerAndGameInfo";
    SocketWaitRoomLabels["GetAllGlobalInfo"] = "getAllGlobalInfo";
    SocketWaitRoomLabels["ToAllGlobalInfo"] = "toAllGlobalINfo";
    SocketWaitRoomLabels["ToAllInformation"] = "toAllInformation";
    SocketWaitRoomLabels["NewMessage"] = "newMessage";
    SocketWaitRoomLabels["PlayerValidated"] = "playerValidated";
    SocketWaitRoomLabels["SendMessageCombatRoom"] = "sendMessageCombatRoom";
    SocketWaitRoomLabels["OnSendMessageCombatRoom"] = "onSendMessageCombatRoom";
    SocketWaitRoomLabels["AddAttackerVirtualPlayer"] = "addAttackerVirtualPlayer";
    SocketWaitRoomLabels["AddDefensiveVirtualPlayer"] = "addDefensiveVirtualPlayer";
    SocketWaitRoomLabels["GetAllGame"] = "getAllgame";
    SocketWaitRoomLabels["ToAllForGame"] = "toAllForGame";
    SocketWaitRoomLabels["UpdateBoard"] = "updateBoard";
    SocketWaitRoomLabels["EmitVirtualPlayer"] = "emitVirtualPlayer";
    SocketWaitRoomLabels["onSendMessageCombatRoom"] = "onSendMessageCombatRoom";
    SocketWaitRoomLabels["codeGameCombatRoom"] = "codeGameCombatRoom";
    SocketWaitRoomLabels["kickResponse"] = "kickResponse";
    SocketWaitRoomLabels["kicked"] = "kicked";
    SocketWaitRoomLabels["playersList"] = "playersList";
    SocketWaitRoomLabels["toAllGlobalINfo"] = "toAllGlobalINfo";
    SocketWaitRoomLabels["toAllForGame"] = "toAllForGame";
    SocketWaitRoomLabels["error"] = "error";
})(SocketWaitRoomLabels || (exports.SocketWaitRoomLabels = SocketWaitRoomLabels = {}));
var SocketPlayerMovementLabels;
(function (SocketPlayerMovementLabels) {
    SocketPlayerMovementLabels["StartFight"] = "startFight";
    SocketPlayerMovementLabels["AnimatePlayerMove"] = "animatePlayerMove";
    SocketPlayerMovementLabels["QuitGame"] = "quitGame";
    SocketPlayerMovementLabels["ToggleDoor"] = "toggleDoor";
    SocketPlayerMovementLabels["EndTurn"] = "endTurn";
    SocketPlayerMovementLabels["StartGame"] = "startGame";
    SocketPlayerMovementLabels["CombatEscaped"] = "combatEscaped";
    SocketPlayerMovementLabels["PlayerTurn"] = "playerTurn";
    SocketPlayerMovementLabels["CombatUpdate"] = "combatUpdate";
    SocketPlayerMovementLabels["CombatEnded"] = "combatEnded";
    SocketPlayerMovementLabels["CombatRolls"] = "combatRolls";
    SocketPlayerMovementLabels["EndGameWinVictories"] = "endGameWinVictories";
    SocketPlayerMovementLabels["PlayerMoved"] = "playerMoved";
    SocketPlayerMovementLabels["DebugModeChanged"] = "debugModeChanged";
    SocketPlayerMovementLabels["ItemChoice"] = "itemChoice";
    SocketPlayerMovementLabels["EndAnimation"] = "endAnimation";
    SocketPlayerMovementLabels["StartMoving"] = "startMoving";
    SocketPlayerMovementLabels["TimeIncrement"] = "timeIncrement";
    SocketPlayerMovementLabels["NotificationTurn"] = "notificationTurn";
    SocketPlayerMovementLabels["MovePlayer"] = "movePlayer";
    SocketPlayerMovementLabels["EndGameCtf"] = "endGameCtf";
    SocketPlayerMovementLabels["EndGameTime"] = "endgGameTime";
    SocketPlayerMovementLabels["AddPlayerToTile"] = "addPlayerToTile";
    SocketPlayerMovementLabels["RestartTimer"] = "restartTimer";
    SocketPlayerMovementLabels["InventoryUpdate"] = "inventoryUpdate";
    SocketPlayerMovementLabels["RestartTurn"] = "restartTurn";
})(SocketPlayerMovementLabels || (exports.SocketPlayerMovementLabels = SocketPlayerMovementLabels = {}));
var SocketChatLabels;
(function (SocketChatLabels) {
    SocketChatLabels["JoinGameChat"] = "joinGameChat";
    SocketChatLabels["SendMessage"] = "sendMessage";
    SocketChatLabels["LeaveGameChat"] = "leaveGameChat";
    SocketChatLabels["ChatHistory"] = "chatHistory";
    SocketChatLabels["NewMessage"] = "newMessage";
    SocketChatLabels["ChatError"] = "chatError";
})(SocketChatLabels || (exports.SocketChatLabels = SocketChatLabels = {}));
var SocketNotificationLabels;
(function (SocketNotificationLabels) {
    SocketNotificationLabels["VisibilityChanged"] = "visibilityChanged";
    SocketNotificationLabels["GameDeleted"] = "gameDeleted";
})(SocketNotificationLabels || (exports.SocketNotificationLabels = SocketNotificationLabels = {}));
var SocketEndGameStatistics;
(function (SocketEndGameStatistics) {
    SocketEndGameStatistics["UpdatePlayerVictories"] = "updatePlayerVictories";
    SocketEndGameStatistics["UpdatePlayerDamages"] = "updatePlayerDamages";
    SocketEndGameStatistics["UpdatePlayerLifeLost"] = "updataPlayerLifeLost";
    SocketEndGameStatistics["UpdatePlayerCombatCount"] = "updatePlayerCombatCount";
    SocketEndGameStatistics["UpdatePlayerDodgeCount"] = "updatePlayerDodgeCount";
    SocketEndGameStatistics["UpdatePlayerLose"] = "updataPlayerLose";
})(SocketEndGameStatistics || (exports.SocketEndGameStatistics = SocketEndGameStatistics = {}));
var SocketChatLogs;
(function (SocketChatLogs) {
    SocketChatLogs["GetGameLogs"] = "getGameLogs";
    SocketChatLogs["NewGame"] = "newGame";
    SocketChatLogs["SendGameLog"] = "sendGameLog";
    SocketChatLogs["GameLogUpdate"] = "gameLogUpdate";
    SocketChatLogs["GameLogsHistory"] = "gameLogsHistory";
})(SocketChatLogs || (exports.SocketChatLogs = SocketChatLogs = {}));
exports.VIRTUAL_PLAYER_NAME = [
    'Sam',
    'Max',
    'Mia',
    'Liam',
    'Noah',
    'Olivia',
    'Emma',
    'Ava',
    'Sophia',
    'Amelia',
    'Mason',
    'Lucas',
    'Ethan',
    'James',
    'Henry',
    'Jackson',
    'Aiden',
    'Matthew',
    'Samuel',
    'David',
    'Joseph',
    'Carter',
    'Wyatt',
    'John',
    'Daniel',
    'Luke',
    'Gabriel',
    'Anthony',
    'Dylan',
    'Leo',
    'Isaac',
    'Andrew',
    'Joshua',
    'Nathan',
    'Ryan',
    'Caleb',
    'Jack',
    'Owen',
    'Liam',
];
exports.CHARACTERS = [
    { src: 'Darkus/Darkus_Avant.png', name: 'Darkus', disabled: false },
    { src: 'Escanor/Escanor_Avant.png', name: 'Escanor', disabled: false },
    { src: 'Gustave/Gustave_Avant.png', name: 'Gustave', disabled: false },
    { src: 'Guts/Guts_Avant.png', name: 'Guts', disabled: false },
    { src: 'Hinata/Hinata_Avant.png', name: 'Hinata', disabled: false },
    { src: 'Luffy/Luffy_Avant.png', name: 'Luffy', disabled: false },
    { src: 'Osiris/Osiris_Avant.png', name: 'Osiris', disabled: false },
    { src: 'Pawn_Red/Pawn_Red_Avant.png', name: 'Pawn Red', disabled: false },
    { src: 'Poufa/Poufa_Avant.png', name: 'Poufa', disabled: false },
    { src: 'Sakura/Sakura_Avant.png', name: 'Sakura', disabled: false },
    { src: 'Silver/Silver_Avant.png', name: 'Silver', disabled: false },
    { src: 'Warrior_Purple/Warrior_Purple_Avant.png', name: 'Warrior Purple', disabled: false },
];
exports.allUrlAvatar = [
    './assets/images/Personnages/Darkus/Darkus_Avant.png',
    './assets/images/Personnages/Escanor/Escanor_Avant.png',
    './assets/images/Personnages/Gustave/Gustave_Avant.png',
    './assets/images/Personnages/Guts/Guts_Avant.png',
    './assets/images/Personnages/Hinata/Hinata_Avant.png',
    './assets/images/Personnages/Luffy/Luffy_Avant.png',
    './assets/images/Personnages/Osiris/Osiris_Avant.png',
    './assets/images/Personnages/Pawn_Red/Pawn_Red_Avant.png',
    './assets/images/Personnages/Poufa/Poufa_Avant.png',
    './assets/images/Personnages/Sakura/Sakura_Avant.png',
    './assets/images/Personnages/Silver/Silver_Avant.png',
    './assets/images/Personnages/Warrior_Purple/Warrior_Purple_Avant.png',
];
exports.TILE_TYPES = {
    door: 'Porte',
    wall: 'Mur',
    water: 'Eau',
    ice: 'Glace',
    empty: '',
};
var DiceType;
(function (DiceType) {
    DiceType["FourFaces"] = "4 Faces";
    DiceType["SixFaces"] = "6 Faces";
})(DiceType || (exports.DiceType = DiceType = {}));
var LogType;
(function (LogType) {
    LogType["COMBAT"] = "combat";
})(LogType || (exports.LogType = LogType = {}));
exports.ROOM_PREFIX = {
    game: 'game-room-',
    player: 'player-',
};
exports.CHAT_ROOM_PREFIX = 'chat-';
exports.ERROR_MESSAGES = {
    notInGame: 'Vous devez être dans la partie pour accéder au chat',
};
//# sourceMappingURL=constants.js.map