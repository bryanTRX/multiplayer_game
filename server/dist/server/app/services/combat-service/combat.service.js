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
exports.CombatService = void 0;
const game_log_gateway_1 = require("../../gateways/game-log-gateway/game-log.gateway");
const constants_1 = require("../../../../common/constants");
const common_1 = require("@nestjs/common");
let CombatService = class CombatService {
    constructor(gameLogGateway) {
        this.gameLogGateway = gameLogGateway;
    }
    startFight(server, roomCode, players, games) {
        const game = games.get(roomCode);
        if (!game)
            return;
        server.to(roomCode).emit(constants_1.SocketPlayerMovementLabels.StartFight, players);
        const payload = {
            type: 'combatStart',
            event: `Combat : ${players[0].name} vs ${players[1].name}`,
            players,
            room: roomCode,
        };
        if (this.gameLogGateway && typeof this.gameLogGateway.handleSendGameLog === 'function') {
            this.gameLogGateway.handleSendGameLog(null, payload);
        }
    }
    combatUpdate(server, roomCode, attacker, defender) {
        server.to(roomCode).emit(constants_1.SocketPlayerMovementLabels.CombatUpdate, { attacker, defender });
    }
    combatEscaped(server, roomCode, escapee) {
        server.to(roomCode).emit(constants_1.SocketPlayerMovementLabels.CombatEscaped, { escapee });
    }
    combatEnded(server, roomCode, winner, loser) {
        server.to(roomCode).emit(constants_1.SocketPlayerMovementLabels.CombatEnded, { winner, loser });
    }
    combatRolls(server, roomCode, attackerBonus, defenderBonus) {
        server.to(roomCode).emit(constants_1.SocketPlayerMovementLabels.CombatRolls, { attackerBonus, defenderBonus });
    }
};
exports.CombatService = CombatService;
exports.CombatService = CombatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => game_log_gateway_1.GameLogGateway))),
    __metadata("design:paramtypes", [game_log_gateway_1.GameLogGateway])
], CombatService);
//# sourceMappingURL=combat.service.js.map