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
exports.PlayingManagerService = void 0;
const constants_1 = require("../../constants/constants");
const game_log_gateway_1 = require("../../gateways/game-log-gateway/game-log.gateway");
const game_room_gateway_1 = require("../../gateways/game-room/game-room.gateway");
const time_service_1 = require("../time-service/time.service");
const constants_2 = require("../../../../common/constants");
const common_1 = require("@nestjs/common");
let PlayingManagerService = class PlayingManagerService {
    constructor(timeService, gameGateway, gameLogGateway) {
        this.timeService = timeService;
        this.gameGateway = gameGateway;
        this.gameLogGateway = gameLogGateway;
        this.endGameEmitted = false;
        this.gamesPlayers = new Map();
        this.gamesPlayerTurn = new Map();
    }
    quitGame(server, roomCode, player, map, games) {
        const game = games.get(roomCode);
        if (game) {
            game.players = game.players.filter((p) => p.name !== player.name);
            this.gamesPlayers.set(roomCode, game.players);
            const updatedMap = map.map((tile) => {
                var _a;
                if (((_a = tile.player) === null || _a === void 0 ? void 0 : _a.name) === player.name) {
                    tile.player = undefined;
                }
                return tile;
            });
            server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.QuitGame, game.players, updatedMap);
            if (game.players.length === 1) {
                games.delete(roomCode);
            }
        }
    }
    startGame(server, roomCode, players, games) {
        const gameData = games.get(roomCode);
        if (gameData) {
            gameData.game.map = this.setPlayersSpawn(gameData.game, players);
            gameData.game.map2 = [];
            gameData.players = players;
            if (gameData.game.gameMode === 'CTF') {
                gameData.players = this.setRandomTeams(gameData.players);
            }
            gameData.players = this.setOrderPlayers(gameData.players);
            this.setRandomItems(gameData.game.map);
            gameData.players.forEach((player) => {
                player.inventory = [];
            });
            this.gamesPlayerTurn.set(roomCode, null);
            this.gamesPlayers.set(roomCode, gameData.players);
            server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.StartGame, gameData);
            const gameStatstics = this.gameGateway.games.get(roomCode).glocalStatistics;
            gameStatstics.allTime = Math.floor(Date.now() / constants_1.TIME_BY_SECOND);
        }
    }
    endGameWinVictories(server, roomCode, winner) {
        const gameRoom = this.gameGateway.games.get(roomCode);
        if (gameRoom && gameRoom.glocalStatistics) {
            gameRoom.glocalStatistics.secondTime = Math.floor(Date.now() / constants_1.TIME_BY_SECOND);
        }
        server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.EndGameWinVictories, { winner });
        const playersInGame = this.gamesPlayers.get(roomCode) || [];
        const payload = {
            type: 'combatStart',
            event: `Fin de partie. Joueurs actifs : ${playersInGame.map((player) => player.name).join(', ')}`,
            players: playersInGame,
            room: roomCode,
        };
        if (!this.endGameEmitted && this.gameLogGateway && typeof this.gameLogGateway.handleSendGameLog === 'function') {
            this.gameLogGateway.handleSendGameLog(null, payload);
            this.endGameEmitted = true;
        }
    }
    debugModeChanged(server, roomCode, isDebugMode) {
        server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.DebugModeChanged, { isDebugMode });
    }
    endGameCtf(server, roomCode, player, game) {
        const gameStatstics = this.gameGateway.games.get(roomCode).glocalStatistics;
        gameStatstics.secondTime = Math.floor(Date.now() / constants_1.TIME_BY_SECOND);
        if (game.gameMode === 'CTF') {
            const isOnSpawn = player.coordinate.x === player.spawnPoint.x && player.coordinate.y === player.spawnPoint.y;
            const hasFlag = player.inventory.some((item) => item.name === constants_1.CHESTBOX_NAME);
            if (!(isOnSpawn && hasFlag)) {
                return;
            }
            this.emitEndGameCtf(server, roomCode, player.team);
            const payload = {
                type: 'combatStart',
                event: `Fin de partie. Joueurs actifs : ${this.gamesPlayers
                    .get(roomCode)
                    .map((p) => p.name)
                    .join(', ')}`,
                players: this.gamesPlayers.get(roomCode),
                room: roomCode,
            };
            this.gameLogGateway.handleSendGameLog(null, payload);
        }
    }
    setPlayersSpawn(game, players) {
        const map = game.map.concat(game.map2);
        const spawns = map.filter((tile) => { var _a; return ((_a = tile.item) === null || _a === void 0 ? void 0 : _a.name) === 'spawn'; });
        this.shuffle(spawns);
        this.setPlayers(players, map, spawns);
        for (let i = players.length; i < spawns.length; i++) {
            const spawn = spawns[i];
            const targetTile = map.find((tile) => { var _a, _b, _c, _d; return ((_a = tile.position) === null || _a === void 0 ? void 0 : _a.x) === ((_b = spawn.position) === null || _b === void 0 ? void 0 : _b.x) && ((_c = tile.position) === null || _c === void 0 ? void 0 : _c.y) === ((_d = spawn.position) === null || _d === void 0 ? void 0 : _d.y); });
            if (targetTile) {
                targetTile.item = undefined;
            }
        }
        return map;
    }
    setPlayers(players, map, spawns) {
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            const spawn = spawns[i];
            if (!(spawn === null || spawn === void 0 ? void 0 : spawn.position))
                continue;
            const targetTile = map.find((tile) => { var _a, _b, _c, _d; return ((_a = tile.position) === null || _a === void 0 ? void 0 : _a.x) === ((_b = spawn.position) === null || _b === void 0 ? void 0 : _b.x) && ((_c = tile.position) === null || _c === void 0 ? void 0 : _c.y) === ((_d = spawn.position) === null || _d === void 0 ? void 0 : _d.y); });
            if (!targetTile)
                continue;
            player.coordinate = targetTile.position;
            targetTile.player = Object.assign(Object.assign({}, player), { coordinate: targetTile.position });
            player.spawnPoint = Object.assign({}, targetTile.position);
            targetTile.player = Object.assign(Object.assign({}, player), { coordinate: targetTile.position });
        }
    }
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    setRandomTeams(players) {
        const shuffledPlayers = [...players];
        this.shuffle(shuffledPlayers);
        const midIndex = Math.ceil(shuffledPlayers.length / 2);
        const teamA = shuffledPlayers.slice(0, midIndex);
        const teamB = shuffledPlayers.slice(midIndex);
        teamA.forEach((player) => (player.team = 'teamA'));
        teamB.forEach((player) => (player.team = 'teamB'));
        return players;
    }
    setRandomItems(map) {
        const foundItems = map.filter((t) => { var _a, _b; return ((_a = t.item) === null || _a === void 0 ? void 0 : _a.name) && ((_b = t.item) === null || _b === void 0 ? void 0 : _b.name) !== constants_1.ITEM_TYPES.random; });
        const items = constants_1.ITEMS.slice(0, constants_1.NUMBER_OF_ITEMS_TO_SELECT);
        let itemsLeft = items.filter((i) => !foundItems.some((f) => { var _a; return ((_a = f.item) === null || _a === void 0 ? void 0 : _a.name) === i.name; }));
        map.forEach((tile) => {
            var _a;
            if (((_a = tile.item) === null || _a === void 0 ? void 0 : _a.name) === constants_1.ITEM_TYPES.random) {
                const randomIndex = Math.floor(Math.random() * itemsLeft.length);
                const randomItem = itemsLeft[randomIndex];
                tile.item = randomItem;
                itemsLeft = itemsLeft.filter((i) => i.name !== randomItem.name);
            }
        });
    }
    emitEndGameCtf(server, roomCode, team) {
        server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.EndGameCtf, { team });
        this.debugModeChanged(server, roomCode, false);
        this.timeService.stopTimer(roomCode);
        server.socketsLeave(roomCode);
    }
    setOrderPlayers(players) {
        return players.sort((player1, player2) => {
            if (player2.speed === player1.speed) {
                return Math.random() - constants_1.SPEED_SELECTOR;
            }
            return player2.speed - player1.speed;
        });
    }
};
exports.PlayingManagerService = PlayingManagerService;
exports.PlayingManagerService = PlayingManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => time_service_1.TimeService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => game_room_gateway_1.GameRoomGateway))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => game_log_gateway_1.GameLogGateway))),
    __metadata("design:paramtypes", [time_service_1.TimeService,
        game_room_gateway_1.GameRoomGateway,
        game_log_gateway_1.GameLogGateway])
], PlayingManagerService);
//# sourceMappingURL=playing-manager.service.js.map