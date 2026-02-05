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
exports.GameRoomService = void 0;
const player_service_1 = require("../player-service/player.service");
const pin_generator_1 = require("../../utils/pin-generator");
const interfaces_1 = require("../../../../common/interfaces");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let GameRoomService = class GameRoomService {
    constructor(playerService) {
        this.playerService = playerService;
        this.games = new Map();
        this.rooms = new Set();
        this.selectionPlayerRoom = new Set();
        this.combatRoom = new Set();
        this.gamesCombatRoom = new Map();
    }
    async createRoom(gameToAdd, size) {
        if (!Object.hasOwn(interfaces_1.sizeCapacity, size)) {
            throw new Error(`Taille de salle invalide : "${size}"`);
        }
        const roomCode = (0, pin_generator_1.generatePin)();
        this.rooms.add(roomCode);
        const gameData = {
            pin: roomCode,
            players: [],
            isLocked: false,
            game: Object.assign(Object.assign({}, gameToAdd), { size }),
        };
        this.games.set(roomCode, gameData);
        return roomCode;
    }
    async createCombatRoomService(firstPlayer, secondPlayer) {
        const roomCode = (0, uuid_1.v4)();
        this.combatRoom.add(roomCode);
        this.gamesCombatRoom.set(roomCode, [firstPlayer, secondPlayer]);
        return roomCode;
    }
    async createSelectPlayerRoom(roomCode) {
        this.selectionPlayerRoom.add(roomCode);
    }
    async joinRoom(roomCode, player) {
        const game = this.validatePlayerAndGame(roomCode, player);
        if (!game)
            return null;
        const maxCapacity = interfaces_1.sizeCapacity[game.game.size];
        if (!maxCapacity) {
            throw new Error(`Taille de salle invalide : "${game.game.size}"`);
        }
        if (game.players.length === maxCapacity.max) {
            return { error: 'roomFull', currentPlayers: game.players.length, capacity: maxCapacity.max };
        }
        player.name = this.playerService.getUniquePlayerName(game, player.name);
        player.isAdmin = game.players.length === 0;
        game.players.push(player);
        const playerAndGame = { newPlayer: player.name, newGame: game };
        return playerAndGame;
    }
    async leaveRoom(roomCode, player) {
        const game = await this.getGame(roomCode);
        if (!game)
            return { reason: 'roomNotFound' };
        const uniqueName = this.playerService.getUniquePlayerName(game, player.name);
        const playerIndex = game.players.findIndex((p) => p.name === player.name || p.name === uniqueName);
        if (playerIndex === -1)
            return { reason: 'playerNotFound' };
        const isAdmin = playerIndex === 0;
        if (isAdmin) {
            this.games.delete(roomCode);
            this.rooms.delete(roomCode);
            return { game, isAdmin, destroyed: true };
        }
        else {
            game.players.splice(playerIndex, 1);
            return { game, isAdmin: false, destroyed: false };
        }
    }
    async getGame(roomCode) {
        return this.games.get(roomCode) || null;
    }
    getAllInformationPlayer(playerName, roomCode) {
        const game = this.games.get(String(roomCode));
        if (!game) {
            return { error: 'roomNotFound' };
        }
        const uniqueName = this.playerService.getUniquePlayerName(game, playerName);
        const player = game.players.find((p) => p.name === playerName || p.name === uniqueName);
        const playerIndex = game.players.findIndex((p) => p.name === playerName || p.name === uniqueName);
        const allPlayer = game.players;
        return { game, player, playerIndex, roomCode, allPlayer };
    }
    getActivePlayers(roomCode) {
        const game = this.games.get(roomCode);
        return game ? game.players : [];
    }
    toggleRoomLock(roomCode, isLocked) {
        const game = this.games.get(roomCode);
        if (game) {
            game.isLocked = isLocked;
            return game;
        }
        return null;
    }
    isRoomExist(roomCode) {
        return this.rooms.has(roomCode);
    }
    isRoomLocked(roomCode) {
        const game = this.games.get(roomCode);
        return game ? game.isLocked : false;
    }
    isRoomFull(roomCode) {
        const game = this.games.get(roomCode);
        if (!game)
            return false;
        const maxCapacity = interfaces_1.sizeCapacity[game.game.size];
        return game.players.length === maxCapacity.max;
    }
    async isFirstPlayer(roomCode, player) {
        const game = this.games.get(roomCode);
        if (!game)
            return false;
        const uniqueName = this.playerService.getUniquePlayerName(game, player.name);
        const foundPlayer = game.players.find((p) => p.name === player.name || p.name === uniqueName);
        return foundPlayer ? !!foundPlayer.isAdmin : false;
    }
    selectCharacter(roomCode, player, avatarUrl) {
        const game = this.games.get(roomCode);
        if (!game)
            return null;
        const uniqueName = this.playerService.getUniquePlayerName(game, player.name);
        const foundPlayer = game.players.find((p) => p.name === player.name || p.name === uniqueName);
        if (foundPlayer) {
            foundPlayer.avatarUrl = avatarUrl;
        }
        return game;
    }
    deselectCharacter(roomCode, player) {
        const game = this.games.get(roomCode);
        if (!game)
            return null;
        const uniqueName = this.playerService.getUniquePlayerName(game, player.name);
        const foundPlayer = game.players.find((p) => p.name === player.name || p.name === uniqueName);
        if (foundPlayer) {
            foundPlayer.avatarUrl = null;
        }
        return game;
    }
    getPlayer(roomCode, playerName) {
        const game = this.games.get(String(roomCode));
        if (!game)
            return undefined;
        const uniqueName = this.playerService.getUniquePlayerName(game, playerName);
        return game.players.find((p) => p.name === playerName || p.name === uniqueName);
    }
    validatePlayerAndGame(roomCode, player) {
        if (!(player === null || player === void 0 ? void 0 : player.name)) {
            return null;
        }
        const game = this.games.get(roomCode);
        if (!game) {
            return null;
        }
        if (game.isLocked) {
            return null;
        }
        return game;
    }
};
exports.GameRoomService = GameRoomService;
exports.GameRoomService = GameRoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], GameRoomService);
//# sourceMappingURL=game-room.service.js.map