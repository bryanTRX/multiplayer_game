export declare enum SocketWaitRoomLabels {
    CreateRoom = "createRoom",
    CreateAndJoinGameRoom = "createAndJoinGameRoom",
    CodeGameCombatRoom = "codeGameCombatRoom",
    RoomCreated = "roomCreated",
    JoinRoom = "joinRoom",
    RoomJoined = "roomJoined",
    PlayersList = "playersList",
    Error = "error",
    RoomNotFound = "roomNotFound",
    VirtualPlayerNotFound = "virtualPlayerNotFound",
    AddVirtualPlayer = "addVirtualPlayer",
    RemoveVirtualPlayer = "removeVirtualPlayer",
    PlayerJoined = "playerJoined",
    LeaveRoomResponse = "leaveRoomResponse",
    RoomDestroyed = "roomDestroyed",
    LeaveRoom = "leaveRoom",
    JoinRoomSelectPlayer = "joinRoomSelectPlayer",
    KickPlayer = "kickPlayer",
    KickResponse = "kickResponse",
    Kicked = "kicked",
    IsRoomExist = "isRoomExist",
    IsRoomExistResponse = "isRoomExistResponse",
    IsRoomLocked = "isRoomLocked",
    IsRoomLockedResponse = "isRoomLockedResponse",
    IsRoomFull = "isRoomFull",
    GetRoomFull = "getRoomFull",
    ToggleRoomLock = "toggleRoomLock",
    RoomLockStatus = "roomLockStatus",
    GetActivePlayers = "getActivePlayers",
    ActivePlayers = "activePlayers",
    IsFirstPlayer = "isFirstPlayer",
    IsFirstPlayerResponse = "isFirstPlayerResponse",
    GetGameID = "getGameID",
    ReturnGameID = "returnGameID",
    GetGameSize = "getGameSize",
    ReturnGameSize = "returnGameSize",
    CharacterSelected = "characterSelected",
    TheCharacterToDeselect = "theCharacterToDeselect",
    CharacterDeselected = "characterDeselected",
    TheCharacterDeselected = "theCharacterDeselected",
    GetAllPlayerAndGameInfo = "getAllPlayerAndGameInfo",
    GetAllGlobalInfo = "getAllGlobalInfo",
    ToAllGlobalInfo = "toAllGlobalINfo",
    ToAllInformation = "toAllInformation",
    NewMessage = "newMessage",
    PlayerValidated = "playerValidated",
    SendMessageCombatRoom = "sendMessageCombatRoom",
    OnSendMessageCombatRoom = "onSendMessageCombatRoom",
    AddAttackerVirtualPlayer = "addAttackerVirtualPlayer",
    AddDefensiveVirtualPlayer = "addDefensiveVirtualPlayer",
    GetAllGame = "getAllgame",
    ToAllForGame = "toAllForGame",
    UpdateBoard = "updateBoard",
    EmitVirtualPlayer = "emitVirtualPlayer",
    onSendMessageCombatRoom = "onSendMessageCombatRoom",
    codeGameCombatRoom = "codeGameCombatRoom",
    kickResponse = "kickResponse",
    kicked = "kicked",
    playersList = "playersList",
    toAllGlobalINfo = "toAllGlobalINfo",
    toAllForGame = "toAllForGame",
    error = "error"
}
export declare enum SocketPlayerMovementLabels {
    StartFight = "startFight",
    AnimatePlayerMove = "animatePlayerMove",
    QuitGame = "quitGame",
    ToggleDoor = "toggleDoor",
    EndTurn = "endTurn",
    StartGame = "startGame",
    CombatEscaped = "combatEscaped",
    PlayerTurn = "playerTurn",
    CombatUpdate = "combatUpdate",
    CombatEnded = "combatEnded",
    CombatRolls = "combatRolls",
    EndGameWinVictories = "endGameWinVictories",
    PlayerMoved = "playerMoved",
    DebugModeChanged = "debugModeChanged",
    ItemChoice = "itemChoice",
    EndAnimation = "endAnimation",
    StartMoving = "startMoving",
    TimeIncrement = "timeIncrement",
    NotificationTurn = "notificationTurn",
    MovePlayer = "movePlayer",
    EndGameCtf = "endGameCtf",
    EndGameTime = "endgGameTime",
    AddPlayerToTile = "addPlayerToTile",
    RestartTimer = "restartTimer",
    InventoryUpdate = "inventoryUpdate",
    RestartTurn = "restartTurn"
}
export declare enum SocketChatLabels {
    JoinGameChat = "joinGameChat",
    SendMessage = "sendMessage",
    LeaveGameChat = "leaveGameChat",
    ChatHistory = "chatHistory",
    NewMessage = "newMessage",
    ChatError = "chatError"
}
export declare enum SocketNotificationLabels {
    VisibilityChanged = "visibilityChanged",
    GameDeleted = "gameDeleted"
}
export declare enum SocketEndGameStatistics {
    UpdatePlayerVictories = "updatePlayerVictories",
    UpdatePlayerDamages = "updatePlayerDamages",
    UpdatePlayerLifeLost = "updataPlayerLifeLost",
    UpdatePlayerCombatCount = "updatePlayerCombatCount",
    UpdatePlayerDodgeCount = "updatePlayerDodgeCount",
    UpdatePlayerLose = "updataPlayerLose"
}
export declare enum SocketChatLogs {
    GetGameLogs = "getGameLogs",
    NewGame = "newGame",
    SendGameLog = "sendGameLog",
    GameLogUpdate = "gameLogUpdate",
    GameLogsHistory = "gameLogsHistory"
}
export declare const VIRTUAL_PLAYER_NAME: string[];
export declare const CHARACTERS: {
    src: string;
    name: string;
    disabled: boolean;
}[];
export declare const allUrlAvatar: string[];
export declare const TILE_TYPES: {
    door: string;
    wall: string;
    water: string;
    ice: string;
    empty: string;
};
export declare enum DiceType {
    FourFaces = "4 Faces",
    SixFaces = "6 Faces"
}
export declare enum LogType {
    COMBAT = "combat"
}
export declare const ROOM_PREFIX: {
    game: string;
    player: string;
};
export declare const CHAT_ROOM_PREFIX = "chat-";
export declare const ERROR_MESSAGES: {
    notInGame: string;
};
