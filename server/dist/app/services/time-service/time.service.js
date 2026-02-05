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
exports.TimeService = void 0;
const constants_1 = require("../../constants/constants");
const turn_service_1 = require("../turn-service/turn.service");
const constants_2 = require("../../../../common/constants");
const common_1 = require("@nestjs/common");
const playing_manager_service_1 = require("../playing-manager-service/playing-manager.service");
let TimeService = class TimeService {
    constructor(turnService, playingManagerService) {
        this.turnService = turnService;
        this.playingManagerService = playingManagerService;
        this.gamesCounter = new Map();
        this.gamesInterval = new Map();
        this.gamesIsNotification = new Map();
    }
    startTimer(startValue, server, roomCode, playerTurn) {
        if (this.gamesInterval.get(roomCode))
            return;
        this.gamesCounter.set(roomCode, startValue);
        server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.TimeIncrement, this.gamesCounter.get(roomCode), this.gamesIsNotification.get(roomCode));
        this.manageNotification(server, startValue, roomCode, playerTurn);
        this.startInterval(server, roomCode, startValue);
    }
    stopTimer(roomCode) {
        clearInterval(this.gamesInterval.get(roomCode));
        this.gamesInterval.set(roomCode, undefined);
    }
    startInterval(server, roomCode, startValue) {
        this.gamesInterval.set(roomCode, setInterval(() => {
            if (this.gamesCounter.get(roomCode) > 0) {
                this.gamesCounter.set(roomCode, this.gamesCounter.get(roomCode) - 1);
                server
                    .to(roomCode)
                    .emit(constants_2.SocketPlayerMovementLabels.TimeIncrement, this.gamesCounter.get(roomCode), this.gamesIsNotification.get(roomCode));
            }
            else if (startValue !== constants_1.TIME_BEFORE_TURN) {
                this.manageEndTurn(server, roomCode);
            }
            else {
                this.startTurnTimer(server, roomCode);
            }
        }, constants_1.TIME_TICK));
    }
    manageNotification(server, startValue, roomCode, playerTurn) {
        if (startValue === constants_1.TIME_BEFORE_TURN && this.gamesCounter.get(roomCode) === constants_1.TIME_BEFORE_TURN) {
            server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.NotificationTurn, {
                message: "C'est au tour de " + (playerTurn === null || playerTurn === void 0 ? void 0 : playerTurn.name) + ' à jouer',
                isEnded: false,
            });
            if (playerTurn === null || playerTurn === void 0 ? void 0 : playerTurn.isVirtualPlayer) {
                server.to(roomCode).emit(constants_2.SocketWaitRoomLabels.EmitVirtualPlayer, {
                    codeRoom: roomCode,
                    currentPlayer: playerTurn,
                });
            }
            this.gamesIsNotification.set(roomCode, true);
        }
    }
    manageEndTurn(server, roomCode) {
        this.turnService.endTurn(server, roomCode);
        this.changeTimer(server, roomCode, constants_1.TIME_BEFORE_TURN);
    }
    startTurnTimer(server, roomCode) {
        server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.NotificationTurn, { message: '', isEnded: true });
        this.gamesIsNotification.set(roomCode, false);
        this.changeTimer(server, roomCode, constants_1.TIME_TURN);
    }
    changeTimer(server, roomCode, time) {
        this.stopTimer(roomCode);
        const currentPlayer = this.playingManagerService.gamesPlayerTurn.get(roomCode);
        this.startTimer(time, server, roomCode, currentPlayer);
    }
};
exports.TimeService = TimeService;
exports.TimeService = TimeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => turn_service_1.TurnService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => playing_manager_service_1.PlayingManagerService))),
    __metadata("design:paramtypes", [turn_service_1.TurnService,
        playing_manager_service_1.PlayingManagerService])
], TimeService);
//# sourceMappingURL=time.service.js.map