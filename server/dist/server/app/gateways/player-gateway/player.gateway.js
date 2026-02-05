"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerGateway = void 0;
const constants_1 = require("../../constants/constants");
const game_room_gateway_1 = require("../game-room/game-room.gateway");
const combat_service_1 = require("../../services/combat-service/combat.service");
const player_movement_service_1 = require("../../services/player-movement-service/player-movement.service");
const playing_manager_service_1 = require("../../services/playing-manager-service/playing-manager.service");
const time_service_1 = require("../../services/time-service/time.service");
const turn_service_1 = require("../../services/turn-service/turn.service");
const constants_2 = require("../../../../common/constants");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let PlayerGateway = class PlayerGateway {
    constructor(playerMovementService, turnService, timeService, gameRoomGateway, combatService, playingManagerService) {
        this.playerMovementService = playerMovementService;
        this.turnService = turnService;
        this.timeService = timeService;
        this.gameRoomGateway = gameRoomGateway;
        this.combatService = combatService;
        this.playingManagerService = playingManagerService;
    }
    handleSendMessage(client, payload) {
        client.emit(constants_2.SocketWaitRoomLabels.OnSendMessageCombatRoom, {
            message: payload.message,
            roomCode: payload.roomCode,
            userName: payload.userName,
        });
    }
    handleJoinRoomSelectPlayer(client, roomCode) {
        if (!this.isRoomValid(client, roomCode)) {
            return;
        }
        const players = this.gameRoomGateway.selectionPlayerRoom.get(roomCode);
        players.add(client.id);
        client.join(roomCode);
        this.server.to(roomCode).emit(constants_2.SocketWaitRoomLabels.PlayerJoined, { playerId: client.id, roomCode });
    }
    handleCharacterSelected(client, payload) {
        if (!this.isRoomValid(client, payload.roomCode)) {
            return;
        }
        this.server.emit(constants_2.SocketWaitRoomLabels.TheCharacterToDeselect, {
            theUrlOfSelectPlayer: payload.avatarUrl,
            theRoomCodeToDesable: payload.roomCode,
        });
    }
    handleCharacterDeselected(client, payload) {
        this.server.emit(constants_2.SocketWaitRoomLabels.TheCharacterDeselected, {
            theUrlOfSelectPlayer: payload.avatarUrl,
            theRoomCodeToDesable: payload.roomCode,
        });
    }
    handleGetAllGlobalInfo(client, payload) {
        const gameData = this.gameRoomGateway.games.get(payload.roomCode);
        if (!gameData) {
            this.sendError(client, `Room ${payload.roomCode} not found.`);
            return;
        }
        client.emit(constants_2.SocketWaitRoomLabels.ToAllGlobalInfo, gameData.glocalStatistics);
    }
    handleStartFight(client, data) {
        this.timeService.stopTimer(data.roomCode);
        this.combatService.startFight(this.server, data.roomCode, data.players, this.gameRoomGateway.games);
    }
    handleAnimatePlayerMove(client, data) {
        const { roomCode, map: path, player, game } = data;
        this.playerMovementService.animatePlayerMove(this.server, roomCode, path, player, game);
    }
    handleToggleDoor(client, data) {
        const gameData = this.gameRoomGateway.games.get(data.roomCode);
        if (!gameData || !data.tile) {
            return;
        }
        this.playerMovementService.toggleDoor(this.server, data.roomCode, data.tile);
        this.updateDoorManipulationStatus(gameData, data.tile);
        this.calculateDoorManipulationPercentage(data.roomCode);
    }
    handleCombatUpdate(client, payload) {
        this.combatService.combatUpdate(this.server, payload.roomCode, payload.attacker, payload.defender);
    }
    handleCombatEscaped(client, payload) {
        this.combatService.combatEscaped(this.server, payload.roomCode, payload.escapee);
    }
    handleCombatEnded(client, payload) {
        this.combatService.combatEnded(this.server, payload.roomCode, payload.winner, payload.loser);
        this.restartTimerAfterCombat(payload.roomCode);
    }
    handlePlayerMoved(client, payload) {
        this.playerMovementService.playerMoved(this.server, payload.roomCode, payload.player, payload.nextPosition);
    }
    handleDebugModeChange(client, data) {
        this.playingManagerService.debugModeChanged(this.server, data.roomCode, data.isDebugMode);
    }
    handleCombatRolls(client, payload) {
        this.combatService.combatRolls(this.server, payload.roomCode, payload.attackerBonus, payload.defenderBonus);
    }
    handleEndGameWinVictories(client, payload) {
        const gameData = this.gameRoomGateway.games.get(payload.roomCode);
        if (!gameData || gameData.game.gameMode === 'CTF') {
            return;
        }
        this.endGame(payload.roomCode, payload.winner);
    }
    handleItemChoice(client, data) {
        this.playerMovementService.choseItem(this.server, data);
    }
    handleMovePlayer(client, data) {
        const gameData = this.gameRoomGateway.games.get(data.roomCode);
        if (!gameData) {
            return;
        }
        this.playerMovementService.animatePlayerMove(this.server, data.roomCode, data.path, data.player, gameData.game);
    }
    handleInventoryUpdate(client, data) {
        this.playerMovementService.notifyInventoryUpdate(this.server, data.roomCode, data.player);
    }
    handleStartGame(client, data) {
        this.playingManagerService.startGame(this.server, data.roomCode, data.players, this.gameRoomGateway.games);
    }
    handleQuitGame(client, data) {
        this.playingManagerService.quitGame(this.server, data.roomCode, data.player, data.map, this.gameRoomGateway.games);
        if (this.handleCurrentPlayerQuit(client, data)) {
            client.leave(data.roomCode);
            return;
        }
        this.playingManagerService.debugModeChanged(this.server, data.roomCode, false);
        this.server.socketsLeave(data.roomCode);
    }
    handleEndTurn(client, data) {
        this.turnService.endTurn(this.server, data.roomCode);
        this.resetTimer(data.roomCode);
    }
    handleRestartTimer(client, data) {
        const currentPlayer = this.playingManagerService.gamesPlayerTurn.get(data.roomCode);
        this.timeService.startTimer(data.time, this.server, data.roomCode, currentPlayer);
    }
    handleRestartTurn(client, data) {
        this.server.to(data.roomCode).emit(constants_2.SocketPlayerMovementLabels.RestartTurn, {
            player: data.player,
        });
    }
    vitualPlayerAnimate(roomCode, path, player) {
        const gameData = this.gameRoomGateway.games.get(roomCode);
        if (!gameData) {
            return;
        }
        this.playerMovementService.animatePlayerMove(this.server, roomCode, path, player, gameData.game);
    }
    emitVirtualPlayer(roomCode, virtualPlayer) {
        this.server.emit(constants_2.SocketWaitRoomLabels.EmitVirtualPlayer, {
            codeRoom: roomCode,
            currentPlayer: virtualPlayer,
        });
    }
    calculateDoorManipulationPercentage(roomCode) {
        const gameData = this.gameRoomGateway.games.get(roomCode);
        if (!gameData || !gameData.glocalStatistics) {
            return 0;
        }
        const allDoors = gameData.glocalStatistics.allDoors;
        const totalDoors = allDoors.length;
        if (totalDoors === 0) {
            return 0;
        }
        const manipulatedDoors = allDoors.filter((door) => door.isManipulated).length;
        const percentage = (manipulatedDoors / totalDoors) * constants_1.POURCENTAGE_CALCULATION;
        gameData.glocalStatistics.percentageOfDors = percentage;
        return percentage;
    }
    isRoomValid(client, roomCode) {
        if (!this.gameRoomGateway.rooms.has(roomCode)) {
            this.sendError(client, `Room ${roomCode} does not exist.`);
            return false;
        }
        return true;
    }
    sendError(client, message) {
        client.emit(constants_2.SocketWaitRoomLabels.Error, { message });
    }
    updateDoorManipulationStatus(gameData, tile) {
        var _a;
        const door = (_a = gameData.glocalStatistics) === null || _a === void 0 ? void 0 : _a.allDoors.find((d) => d.coordinate.x === tile.position.x && d.coordinate.y === tile.position.y);
        if (door && !door.isManipulated) {
            door.isManipulated = true;
        }
    }
    handleCurrentPlayerQuit(client, data) {
        const currentTurn = this.playingManagerService.gamesPlayerTurn.get(data.roomCode);
        const players = this.playingManagerService.gamesPlayers.get(data.roomCode) || [];
        if (currentTurn && data.player.name === currentTurn.name && players.length > 1) {
            client.leave(data.roomCode);
            return true;
        }
        else if (players.length > 1) {
            this.restartTimerAfterCombat(data.roomCode);
            return true;
        }
        return false;
    }
    endGame(roomCode, winner) {
        this.playingManagerService.endGameWinVictories(this.server, roomCode, winner);
        this.playingManagerService.debugModeChanged(this.server, roomCode, false);
        this.timeService.stopTimer(roomCode);
        this.server.socketsLeave(roomCode);
    }
    resetTimer(roomCode) {
        this.timeService.stopTimer(roomCode);
        const currentPlayer = this.playingManagerService.gamesPlayerTurn.get(roomCode);
        this.timeService.startTimer(constants_1.TIME_BEFORE_TURN, this.server, roomCode, currentPlayer);
    }
    restartTimerAfterCombat(roomCode) {
        const currentPlayer = this.playingManagerService.gamesPlayerTurn.get(roomCode);
        this.timeService.startTimer(this.timeService.gamesCounter.get(roomCode), this.server, roomCode, currentPlayer);
    }
};
exports.PlayerGateway = PlayerGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], PlayerGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.SendMessageCombatRoom),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.JoinRoomSelectPlayer),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleJoinRoomSelectPlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.CharacterSelected),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleCharacterSelected", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.CharacterDeselected),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleCharacterDeselected", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.GetAllGlobalInfo),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleGetAllGlobalInfo", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.StartFight),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleStartFight", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.AnimatePlayerMove),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleAnimatePlayerMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.ToggleDoor),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleToggleDoor", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.CombatUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleCombatUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.CombatEscaped),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleCombatEscaped", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.CombatEnded),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleCombatEnded", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.PlayerMoved),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handlePlayerMoved", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.DebugModeChanged),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleDebugModeChange", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.CombatRolls),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleCombatRolls", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.EndGameWinVictories),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleEndGameWinVictories", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.ItemChoice),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleItemChoice", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.StartMoving),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleMovePlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.InventoryUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleInventoryUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.StartGame),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleStartGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.QuitGame),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleQuitGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.EndTurn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleEndTurn", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.RestartTimer),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleRestartTimer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketPlayerMovementLabels.RestartTurn),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PlayerGateway.prototype, "handleRestartTurn", null);
exports.PlayerGateway = PlayerGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => player_movement_service_1.PlayerMovementService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => turn_service_1.TurnService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => time_service_1.TimeService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => game_room_gateway_1.GameRoomGateway))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => combat_service_1.CombatService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => playing_manager_service_1.PlayingManagerService))),
    __metadata("design:paramtypes", [player_movement_service_1.PlayerMovementService,
        turn_service_1.TurnService,
        time_service_1.TimeService,
        game_room_gateway_1.GameRoomGateway,
        combat_service_1.CombatService,
        playing_manager_service_1.PlayingManagerService])
], PlayerGateway);
//# sourceMappingURL=player.gateway.js.map