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
var NotificationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const constants_1 = require("../../../../common/constants");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let NotificationGateway = NotificationGateway_1 = class NotificationGateway {
    constructor() {
        this.logger = new common_1.Logger(NotificationGateway_1.name);
    }
    setServer(server) {
        this.server = server;
    }
    sendVisibilityChangeNotification(name, visibility) {
        this.logger.log(`Notification envoyée pour le jeu "${name}", visibilité: ${visibility}`);
        const payload = { name, visibility };
        this.server.emit(constants_1.SocketNotificationLabels.VisibilityChanged, payload);
    }
    sendGameDeletionNotification(gameId, gameName) {
        this.logger.log(`Notification envoyée pour la suppression du jeu "${gameName}" (ID: ${gameId})`);
        const payload = { id: gameId, name: gameName };
        this.server.emit(constants_1.SocketNotificationLabels.GameDeleted, payload);
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map