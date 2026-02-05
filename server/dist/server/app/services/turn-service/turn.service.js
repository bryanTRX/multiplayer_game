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
exports.TurnService = void 0;
const game_log_gateway_1 = require("../../gateways/game-log-gateway/game-log.gateway");
const constants_1 = require("../../../../common/constants");
const common_1 = require("@nestjs/common");
const playing_manager_service_1 = require("../playing-manager-service/playing-manager.service");
let TurnService = class TurnService {
    constructor(gameLogGateway, playingManagerService) {
        this.gameLogGateway = gameLogGateway;
        this.playingManagerService = playingManagerService;
    }
    endTurn(server, roomCode) {
        var _a;
        const currentPlayer = this.playingManagerService.gamesPlayerTurn.get(roomCode);
        this.nextPlayer(roomCode);
        server.to(roomCode).emit(constants_1.SocketPlayerMovementLabels.EndTurn, {
            roomCode,
            playerTurn: this.playingManagerService.gamesPlayerTurn.get(roomCode),
            isNotification: true,
        });
        const logMessage = `c'est le tour  à ${(_a = this.playingManagerService.gamesPlayerTurn.get(roomCode)) === null || _a === void 0 ? void 0 : _a.name}`;
        this.gameLogGateway.handleSendGameLog(null, {
            type: 'global',
            event: logMessage,
            room: roomCode,
            players: [currentPlayer, this.playingManagerService.gamesPlayerTurn.get(roomCode)],
        });
    }
    nextPlayer(roomCode) {
        const index = this.playingManagerService.gamesPlayers
            .get(roomCode)
            .findIndex((player) => { var _a; return player.name === ((_a = this.playingManagerService.gamesPlayerTurn.get(roomCode)) === null || _a === void 0 ? void 0 : _a.name); });
        const gamesPlayers = this.playingManagerService.gamesPlayers.get(roomCode);
        if (index === gamesPlayers.length - 1) {
            const nextPlayer = gamesPlayers[0];
            this.playingManagerService.gamesPlayerTurn.set(roomCode, nextPlayer);
        }
        else {
            const nextPlayer = gamesPlayers[index + 1];
            this.playingManagerService.gamesPlayerTurn.set(roomCode, nextPlayer);
        }
    }
};
exports.TurnService = TurnService;
exports.TurnService = TurnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => game_log_gateway_1.GameLogGateway))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => playing_manager_service_1.PlayingManagerService))),
    __metadata("design:paramtypes", [game_log_gateway_1.GameLogGateway,
        playing_manager_service_1.PlayingManagerService])
], TurnService);
//# sourceMappingURL=turn.service.js.map