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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const game_room_service_1 = require("../game-room-service/game-room.service");
let StatisticsService = class StatisticsService {
    constructor(gameRoomService) {
        this.gameRoomService = gameRoomService;
    }
    getAllGlobalInfo(roomCode) {
        const game = this.gameRoomService.games.get(String(roomCode));
        return game.glocalStatistics;
    }
    updatePlayerVictories(playerName, roomCode, nbOfVictorie) {
        const player = this.gameRoomService.getPlayer(roomCode, playerName);
        player.stats.nbVictory = nbOfVictorie;
        player.stats.nbCombat = player.stats.nbDefeat + player.stats.nbVictory;
    }
    updatePlayerLose(playerName, roomCode, nbPlayerLose) {
        const player = this.gameRoomService.getPlayer(roomCode, playerName);
        player.stats.nbDefeat = nbPlayerLose;
        player.stats.nbCombat = player.stats.nbDefeat + player.stats.nbVictory;
    }
    updatePlayerPourcentageTile(playerName, roomCode, value) {
        const player = this.gameRoomService.getPlayer(roomCode, playerName);
        player.stats.pourcentageOfTile = Math.ceil(value);
    }
    updatePlayerDamages(playerName, roomCode, nbDamage) {
        const player = this.gameRoomService.getPlayer(roomCode, playerName);
        player.stats.nbDamage += nbDamage;
    }
    updateLifeLost(playerName, roomCode, lifeLost) {
        const player = this.gameRoomService.getPlayer(roomCode, playerName);
        player.stats.nbLifeLost += lifeLost;
    }
    updateCombatCount(playerName, roomCode, secondPlayer) {
        const player = this.gameRoomService.getPlayer(roomCode, playerName);
        const gameSecondPlayer = this.gameRoomService.getPlayer(roomCode, secondPlayer);
        if (gameSecondPlayer.isVirtualPlayer) {
            gameSecondPlayer.stats.nbCombat += 1;
        }
        player.stats.nbCombat += 1;
    }
    updateDodgeCount(playerName, roomCode) {
        const player = this.gameRoomService.getPlayer(roomCode, playerName);
        player.stats.nbEvasion += 1;
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_room_service_1.GameRoomService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map