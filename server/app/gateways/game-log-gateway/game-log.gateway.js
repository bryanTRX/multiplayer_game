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
var GameLogGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogGateway = void 0;
const game_log_history_service_1 = require("../../services/game-log-history-service/game-log-history.service");
const constants_1 = require("../../../../common/constants");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let GameLogGateway = GameLogGateway_1 = class GameLogGateway {
    constructor(gameLogHistoryService) {
        this.gameLogHistoryService = gameLogHistoryService;
        this.logger = new common_1.Logger(GameLogGateway_1.name);
    }
    handleJoinRoom(socket, data) {
        const gameRoomId = this.getGameRoomId(data.roomCode);
        const playerRoomId = this.getPlayerRoomId(data.playerName);
        socket.join(gameRoomId);
        socket.join(playerRoomId);
        this.logger.log(`Socket ${socket.id} a rejoint la room ${gameRoomId} (joueur: ${data.playerName})`);
    }
    handleGetGameLogs(socket, data) {
        if (!this.isValidRoomData(data)) {
            return;
        }
        const logs = this.gameLogHistoryService.getLogs(data.roomCode);
        socket.emit(constants_1.SocketChatLogs.GameLogsHistory, logs);
    }
    handleSendGameLog(socket, payload) {
        const roomCode = payload.room;
        const logEntry = {
            type: payload.type,
            event: payload.event,
            players: payload.players,
            timestamp: new Date(),
        };
        if (this.isCombatLog(payload) && this.hasPlayers(payload)) {
            this.sendCombatLogToPlayers(logEntry, payload.players);
        }
        else if (roomCode) {
            this.sendLogToGameRoom(logEntry, roomCode);
        }
    }
    handleNewGame(socket, data) {
        if (!this.isValidRoomData(data)) {
            return;
        }
        this.gameLogHistoryService.clearLogs(data.roomCode);
        const gameRoomId = this.getGameRoomId(data.roomCode);
        this.server.to(gameRoomId).emit(constants_1.SocketChatLogs.GameLogsHistory, []);
        this.logger.log(`Nouvelle partie démarrée par ${data.playerName} dans la room ${data.roomCode}`);
    }
    handleConnection(socket) {
        this.logger.log(`Client connecté: ${socket.id}`);
    }
    handleDisconnect(socket) {
        this.logger.log(`Client déconnecté: ${socket.id}`);
    }
    getGameRoomId(roomCode) {
        return `${constants_1.ROOM_PREFIX.game}${roomCode}`;
    }
    getPlayerRoomId(playerName) {
        return `${constants_1.ROOM_PREFIX.player}${playerName}`;
    }
    isValidRoomData(data) {
        return Boolean(data === null || data === void 0 ? void 0 : data.roomCode);
    }
    isCombatLog(payload) {
        return payload.type === constants_1.LogType.COMBAT;
    }
    hasPlayers(payload) {
        return Boolean(payload.players && payload.players.length > 0);
    }
    sendCombatLogToPlayers(logEntry, players) {
        players.forEach((player) => {
            if (player.name) {
                const playerRoomId = this.getPlayerRoomId(player.name);
                this.server.to(playerRoomId).emit(constants_1.SocketChatLogs.GameLogUpdate, logEntry);
            }
        });
    }
    sendLogToGameRoom(logEntry, roomCode) {
        this.gameLogHistoryService.addLog(roomCode, logEntry);
        const gameRoomId = this.getGameRoomId(roomCode);
        this.server.to(gameRoomId).emit(constants_1.SocketChatLogs.GameLogUpdate, logEntry);
    }
};
exports.GameLogGateway = GameLogGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameLogGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.SocketWaitRoomLabels.JoinRoom),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameLogGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.SocketChatLogs.GetGameLogs),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameLogGateway.prototype, "handleGetGameLogs", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.SocketChatLogs.SendGameLog),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameLogGateway.prototype, "handleSendGameLog", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.SocketChatLogs.NewGame),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameLogGateway.prototype, "handleNewGame", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameLogGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameLogGateway.prototype, "handleDisconnect", null);
exports.GameLogGateway = GameLogGateway = GameLogGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    }),
    __metadata("design:paramtypes", [game_log_history_service_1.GameLogHistoryService])
], GameLogGateway);
//# sourceMappingURL=game-log.gateway.js.map