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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const chat_history_service_1 = require("../../services/chat-history-service/chat-history.service");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_room_service_1 = require("../../services/game-room-service/game-room.service");
const constants_1 = require("../../../../common/constants");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(gameRoomService, chatHistoryService) {
        this.gameRoomService = gameRoomService;
        this.chatHistoryService = chatHistoryService;
        this.logger = new common_1.Logger(ChatGateway_1.name);
    }
    async handleJoinGame(socket, data) {
        if (!this.isPlayerInRoom(data.roomCode, data.playerName)) {
            socket.emit(constants_1.SocketChatLabels.ChatError, constants_1.ERROR_MESSAGES.notInGame);
            return;
        }
        const chatRoomId = this.getChatRoomId(data.roomCode);
        socket.join(chatRoomId);
        const history = this.chatHistoryService.getMessages(data.roomCode);
        socket.emit(constants_1.SocketChatLabels.ChatHistory, history);
    }
    async handleMessage(socket, data) {
        if (!this.isPlayerInRoom(data.roomCode, data.message.playerName)) {
            socket.emit(constants_1.SocketChatLabels.ChatError, constants_1.ERROR_MESSAGES.notInGame);
            return;
        }
        const messageData = {
            message: data.message.message,
            playerName: data.message.playerName,
            timestamp: new Date(),
        };
        this.chatHistoryService.addMessage(data.roomCode, messageData);
        const chatRoomId = this.getChatRoomId(data.roomCode);
        this.server.to(chatRoomId).emit(constants_1.SocketChatLabels.NewMessage, messageData);
    }
    handleLeaveGame(socket, data) {
        const chatRoomId = this.getChatRoomId(data.roomCode);
        socket.leave(chatRoomId);
    }
    handleConnection(socket) {
        this.logger.log(`Nouveau joueur connecté au chat: ${socket.id}`);
    }
    handleDisconnect(socket) {
        this.logger.log(`Joueur déconnecté du chat: ${socket.id}`);
    }
    isPlayerInRoom(roomCode, playerName) {
        const players = this.gameRoomService.getActivePlayers(roomCode);
        return players.some((player) => player.name === playerName);
    }
    getChatRoomId(roomCode) {
        return `${constants_1.CHAT_ROOM_PREFIX}${roomCode}`;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.SocketChatLabels.JoinGameChat),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.SocketChatLabels.SendMessage),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.SocketChatLabels.LeaveGameChat),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveGame", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleDisconnect", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    }),
    __metadata("design:paramtypes", [game_room_service_1.GameRoomService,
        chat_history_service_1.ChatHistoryService])
], ChatGateway);
//# sourceMappingURL=chat-system.gateway.js.map