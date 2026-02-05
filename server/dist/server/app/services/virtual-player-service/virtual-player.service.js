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
exports.VirtualPlayerService = void 0;
const constants_1 = require("../../constants/constants");
const game_room_service_1 = require("../game-room-service/game-room.service");
const player_service_1 = require("../player-service/player.service");
const constants_2 = require("../../../../common/constants");
const common_1 = require("@nestjs/common");
let VirtualPlayerService = class VirtualPlayerService {
    constructor(gameRoomService, playerService) {
        this.gameRoomService = gameRoomService;
        this.playerService = playerService;
    }
    async addAttackerVirtualPlayer(roomCode) {
        return this.addVirtualPlayer(roomCode, true);
    }
    async addDefensiveVirtualPlayer(roomCode) {
        return this.addVirtualPlayer(roomCode, false);
    }
    async addVirtualPlayer(roomCode, isAggressive) {
        const game = await this.findGame(roomCode);
        if (!game)
            return { error: constants_2.SocketWaitRoomLabels.RoomNotFound };
        if (this.gameRoomService.isRoomFull(roomCode)) {
            return { error: constants_2.SocketWaitRoomLabels.IsRoomFull };
        }
        const allPossibleUrl = constants_2.allUrlAvatar;
        const takenAvart = new Set();
        game.players.forEach((element) => {
            takenAvart.add(element.avatarUrl);
        });
        let selectedAvatarUrl = '';
        allPossibleUrl.forEach((element) => {
            if (!takenAvart.has(element)) {
                selectedAvatarUrl = element;
            }
        });
        const candidate = this.getRandomVirtualPlayerName();
        const uniqueName = this.playerService.getUniquePlayerName(game, candidate);
        const virtualPlayer = this.createVirtualPlayer(uniqueName, selectedAvatarUrl, isAggressive);
        game.players.push(virtualPlayer);
        return virtualPlayer;
    }
    async removeVirtualPlayer(roomCode, playerName) {
        const game = await this.findGame(roomCode);
        if (!game)
            return { error: constants_2.SocketWaitRoomLabels.RoomNotFound };
        const playerIndex = game.players.findIndex((p) => p.name === playerName && p.isVirtualPlayer);
        if (playerIndex === -1) {
            return { error: constants_2.SocketWaitRoomLabels.VirtualPlayerNotFound };
        }
        game.players.splice(playerIndex, 1);
        return { success: true };
    }
    async getVirtualPlayers(roomCode) {
        const game = await this.findGame(roomCode);
        return game ? game.players.filter((player) => player.isVirtualPlayer) : [];
    }
    async findGame(roomCode) {
        const game = await this.gameRoomService.getGame(roomCode);
        if (!game) {
            return null;
        }
        return game;
    }
    getRandomVirtualPlayerName() {
        return constants_2.VIRTUAL_PLAYER_NAME[Math.floor(Math.random() * constants_2.VIRTUAL_PLAYER_NAME.length)];
    }
    createVirtualPlayer(name, avatarUrl, isAggressive) {
        const attackIsFour = Math.random() < constants_1.VALUE_RADOMISER;
        const attack = attackIsFour ? constants_2.DiceType.FourFaces : constants_2.DiceType.SixFaces;
        const defense = attackIsFour ? constants_2.DiceType.SixFaces : constants_2.DiceType.FourFaces;
        return {
            name,
            isVirtualPlayer: true,
            life: Math.random() < constants_1.VALUE_RADOMISER ? constants_1.VIRTUAL_PLAYER_STAT.default : constants_1.VIRTUAL_PLAYER_STAT.max,
            speed: Math.random() < constants_1.VALUE_RADOMISER ? constants_1.VIRTUAL_PLAYER_STAT.default : constants_1.VIRTUAL_PLAYER_STAT.max,
            attack,
            defense,
            coordinate: { x: 0, y: 0 },
            spawnPoint: { x: 0, y: 0 },
            isAdmin: false,
            victories: 0,
            agressive: isAggressive,
            stats: {
                nbVictory: 0,
                nbDefeat: 0,
                nbDamage: 0,
                nbLifeLost: 0,
                nbCombat: 0,
                nbEvasion: 0,
                name,
                nbItem: 0,
                pourcentageOfTile: 0,
                nbDoors: 0,
            },
            avatarUrl,
        };
    }
};
exports.VirtualPlayerService = VirtualPlayerService;
exports.VirtualPlayerService = VirtualPlayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_room_service_1.GameRoomService,
        player_service_1.PlayerService])
], VirtualPlayerService);
//# sourceMappingURL=virtual-player.service.js.map