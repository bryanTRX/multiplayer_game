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
exports.GameRoomGateway = void 0;
const constants_1 = require("../../constants/constants");
const game_room_service_1 = require("../../services/game-room-service/game-room.service");
const statistics_service_1 = require("../../services/statistics-service/statistics.service");
const virtual_player_service_1 = require("../../services/virtual-player-service/virtual-player.service");
const constants_2 = require("../../../../common/constants");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let GameRoomGateway = class GameRoomGateway {
    constructor(gameRoomService, virtualPlayerService, statisticsService) {
        this.gameRoomService = gameRoomService;
        this.virtualPlayerService = virtualPlayerService;
        this.statisticsService = statisticsService;
        this.games = new Map();
        this.rooms = new Set();
        this.socketMap = new Map();
        this.selectionPlayerRoom = new Map();
    }
    async handleCreatAndJoinGameRoom(client, payload) {
        const roomCode = await this.gameRoomService.createCombatRoomService(payload.firstPlayer, payload.secondPlayer);
        this.server.emit(constants_2.SocketWaitRoomLabels.CodeGameCombatRoom, {
            codeRoom: roomCode,
            theFirstPlayer: payload.firstPlayer,
            theSecondPlayer: payload.secondPlayer,
        });
    }
    async handleUpdateBoard(client, payload) {
        const game = this.games.get(payload.roomCode);
        if (game) {
            game.updateMap = payload.board;
        }
    }
    async handleCreateRoom(client, game) {
        const roomCode = await this.gameRoomService.createRoom(game, game.size);
        this.initializeNewRoom(roomCode, game, client);
        return roomCode;
    }
    async handleJoinRoom(client, payload) {
        const roomCode = payload.roomCode.toString();
        const result = await this.gameRoomService.joinRoom(roomCode, payload.player);
        if (!result) {
            client.emit(constants_2.SocketWaitRoomLabels.RoomJoined, { success: false, reason: 'roomNotFound or invalidPlayer' });
            return;
        }
        if ('error' in result && result.error === 'roomFull') {
            client.emit(constants_2.SocketWaitRoomLabels.RoomJoined, { success: false, reason: 'roomFull' });
            return;
        }
        const game = 'newGame' in result ? result.newGame : null;
        client.join(roomCode);
        if ('newPlayer' in result) {
            this.socketMap.set(result.newPlayer, client);
        }
        this.server.to(roomCode).emit(constants_2.SocketWaitRoomLabels.PlayersList, game.players);
        client.emit(constants_2.SocketWaitRoomLabels.RoomJoined, {
            success: true,
            playerJoin: 'newPlayer' in result ? result.newPlayer : null,
        });
    }
    async handleLeaveRoom(client, payload) {
        const roomCode = payload.roomCode.toString();
        const result = await this.gameRoomService.leaveRoom(roomCode, payload.player);
        client.leave(roomCode);
        if (result.reason) {
            client.emit(constants_2.SocketWaitRoomLabels.LeaveRoomResponse, { success: false, reason: result.reason });
            return;
        }
        const gameData = await this.gameRoomService.getGame(payload.roomCode);
        const players = (gameData === null || gameData === void 0 ? void 0 : gameData.players) || null;
        const responsePayload = { success: true, redirect: '/home', allPlayers: players };
        if (result.destroyed) {
            this.server.to(roomCode).emit(constants_2.SocketWaitRoomLabels.RoomDestroyed, {
                message: 'La salle a été fermée par administrateur.',
                redirect: '/home',
            });
        }
        else {
            this.server.to(roomCode).emit(constants_2.SocketWaitRoomLabels.PlayersList, result.game.players);
        }
        client.emit(constants_2.SocketWaitRoomLabels.LeaveRoomResponse, responsePayload);
    }
    async handleKickPlayer(client, payload) {
        const roomCode = payload.roomCode.toString();
        const result = await this.gameRoomService.leaveRoom(roomCode, payload.player);
        const gameData = await this.gameRoomService.getGame(roomCode);
        const players = gameData ? gameData.players : [];
        if (result.reason) {
            client.emit(constants_2.SocketWaitRoomLabels.KickResponse, { success: false, reason: result.reason });
            return;
        }
        this.handlePlayerKick(roomCode, payload.player, client, players);
    }
    handleIsRoomExist(client, roomCode) {
        client.emit(constants_2.SocketWaitRoomLabels.IsRoomExistResponse, this.gameRoomService.isRoomExist(roomCode));
    }
    handleIsRoomLocked(client, roomCode) {
        client.emit(constants_2.SocketWaitRoomLabels.IsRoomLockedResponse, this.gameRoomService.isRoomLocked(roomCode));
    }
    handleIsRoomFull(client, roomCode) {
        client.emit(constants_2.SocketWaitRoomLabels.GetRoomFull, this.gameRoomService.isRoomFull(roomCode));
    }
    handleToggleRoomLock(client, payload) {
        const game = this.gameRoomService.toggleRoomLock(payload.roomCode, payload.isLocked);
        if (game) {
            this.server.to(payload.roomCode).emit(constants_2.SocketWaitRoomLabels.RoomLockStatus, payload.isLocked);
        }
    }
    handleGetActivePlayers(client, roomCode) {
        client.emit(constants_2.SocketWaitRoomLabels.ActivePlayers, this.gameRoomService.getActivePlayers(roomCode));
    }
    async handleIsFirstPlayer(client, payload) {
        const isFirst = await this.gameRoomService.isFirstPlayer(payload.roomCode, payload.player);
        client.emit(constants_2.SocketWaitRoomLabels.IsFirstPlayerResponse, { isFirst });
    }
    async handleGetGameId(client, roomId) {
        const gameData = await this.gameRoomService.getGame(roomId);
        const idOfGame = gameData.game.id;
        client.emit(constants_2.SocketWaitRoomLabels.ReturnGameID, idOfGame);
    }
    async handleGetGameSize(client, roomCode) {
        const gameData = await this.gameRoomService.getGame(roomCode);
        const roomSize = gameData.game.size;
        client.emit(constants_2.SocketWaitRoomLabels.ReturnGameSize, roomSize);
    }
    handleGetAllInformation(client, payload) {
        const allInformation = this.gameRoomService.getAllInformationPlayer(payload.player, payload.roomCode);
        client.emit(constants_2.SocketWaitRoomLabels.ToAllInformation, allInformation);
    }
    handleGetAll(client, payload) {
        const allGlobalInfo = this.gameRoomService.games.get(payload.roomCode);
        client.emit(constants_2.SocketWaitRoomLabels.ToAllForGame, allGlobalInfo);
    }
    handleUpdatePlayerVictories(client, payload) {
        this.statisticsService.updatePlayerVictories(payload.currentPlayer, payload.roomCode, payload.nbVictories);
    }
    handleUpdatePlayerLose(client, payload) {
        this.statisticsService.updatePlayerLose(payload.currentPlayer, payload.roomCode, payload.nbLoses);
    }
    handleUpdatePlayerCombatCount(client, payload) {
        this.statisticsService.updateCombatCount(payload.currentPlayer, payload.roomCode, payload.theSecondPlayer);
    }
    handleUpdateDodgeCombatCount(client, payload) {
        this.statisticsService.updateDodgeCount(payload.currentPlayer, payload.roomCode);
    }
    handleUpdatePlayerLifeLost(client, payload) {
        this.statisticsService.updateLifeLost(payload.playerName, payload.roomCode, payload.dealDamage);
    }
    handleUpdatePlayerDamages(client, payload) {
        this.statisticsService.updatePlayerDamages(payload.playerName, payload.roomCode, payload.dealDamage);
    }
    async handleAddAttackerVirtualPlayer(client, roomCode) {
        await this.handleAddVirtualPlayer(client, roomCode, 'attacker');
    }
    async handleAddDefensiveVirtualPlayer(client, roomCode) {
        await this.handleAddVirtualPlayer(client, roomCode, 'defensive');
    }
    async handleRemoveVirtualPlayer(client, payload) {
        const result = await this.virtualPlayerService.removeVirtualPlayer(payload.roomCode, payload.playerName);
        if (result.error) {
            client.emit(constants_2.SocketWaitRoomLabels.Error, { message: result.error });
            return;
        }
        const game = await this.gameRoomService.getGame(payload.roomCode);
        this.server.to(payload.roomCode).emit(constants_2.SocketWaitRoomLabels.PlayersList, game.players);
    }
    handlePathToMove(currentPlayer, roomCode) {
        const allGlobalInfo = this.games.get(roomCode);
        const key = `${currentPlayer.coordinate.x},${currentPlayer.coordinate.y}`;
        this.trackPlayerPosition(allGlobalInfo, key, currentPlayer.name);
        this.updateExplorationStatistics(allGlobalInfo, currentPlayer, roomCode);
    }
    initializeNewRoom(roomCode, game, client) {
        this.gameRoomService.createSelectPlayerRoom(roomCode);
        this.selectionPlayerRoom.set(roomCode, new Set());
        this.rooms.add(roomCode);
        const gameData = {
            pin: roomCode,
            players: [],
            isLocked: false,
            updateMap: [],
            game,
            size: game.size,
            playerPositions: {},
            pourcentagePlayerScareModeved: {},
            glocalStatistics: {
                allTime: 0,
                percentageOfTile: 0,
                percentageOfDors: 0,
                nbrPlayerOpenDoor: 0,
                secondTime: 0,
                allDoors: [],
                nbOfTakenFleg: 0,
            },
        };
        this.games.set(roomCode, gameData);
        client.join(roomCode);
        const playerGame = this.games.get(roomCode);
        this.initializeDoors(playerGame);
        client.emit(constants_2.SocketWaitRoomLabels.RoomCreated, roomCode);
    }
    initializeDoors(playerGame) {
        for (const tile of playerGame.game.map) {
            if (tile.type === 'Porte') {
                playerGame.glocalStatistics.allDoors.push({
                    coordinate: tile.position,
                    isManipulated: false,
                });
            }
        }
    }
    handlePlayerKick(roomCode, player, client, players) {
        const kickedSocket = this.socketMap.get(player.name);
        if (kickedSocket) {
            kickedSocket.emit(constants_2.SocketWaitRoomLabels.Kicked, {
                message: 'Vous avez été expulsé de la salle par administrateur.',
                redirect: '/home',
            });
            kickedSocket.leave(roomCode);
            this.socketMap.delete(player.name);
        }
        this.server.to(roomCode).emit(constants_2.SocketWaitRoomLabels.PlayersList, players);
        client.emit(constants_2.SocketWaitRoomLabels.KickResponse, {
            success: true,
            redirect: '/home',
            allPlayers: players,
        });
    }
    async handleAddVirtualPlayer(client, roomCode, type) {
        const service = this.virtualPlayerService;
        const result = type === 'attacker' ? await service.addAttackerVirtualPlayer(roomCode) : await service.addDefensiveVirtualPlayer(roomCode);
        if ('error' in result) {
            client.emit(constants_2.SocketWaitRoomLabels.Error, { message: result.error });
            return;
        }
        const game = await this.gameRoomService.getGame(roomCode);
        if (game) {
            this.server.to(roomCode).emit(constants_2.SocketWaitRoomLabels.PlayersList, game.players);
        }
    }
    trackPlayerPosition(gameInfo, positionKey, playerName) {
        if (!gameInfo.playerPositions[positionKey]) {
            gameInfo.playerPositions[positionKey] = [];
        }
        if (!gameInfo.playerPositions[positionKey].includes(playerName)) {
            gameInfo.playerPositions[positionKey].push(playerName);
        }
    }
    updateExplorationStatistics(gameInfo, player, roomCode) {
        const playerName = player.name;
        const totalTileCount = Object.keys(gameInfo.playerPositions).length;
        let playerPositionCount = 0;
        for (const players of Object.values(gameInfo.playerPositions)) {
            playerPositionCount += players.filter((p) => p === playerName).length;
        }
        gameInfo.pourcentagePlayerScareModeved[playerName] = playerPositionCount;
        this.updateMapExplorationPercentage(gameInfo, playerName, playerPositionCount, totalTileCount, roomCode);
    }
    updateMapExplorationPercentage(gameInfo, playerName, playerPositionCount, totalTileCount, roomCode) {
        const mapSize = gameInfo.game.size;
        let gridSize;
        switch (mapSize) {
            case 'Grande Taille':
                gridSize = constants_1.MAP_GRID_SIZE.large;
                break;
            case 'Moyenne Taille':
                gridSize = constants_1.MAP_GRID_SIZE.medium;
                break;
            case 'Petite Taille':
                gridSize = constants_1.MAP_GRID_SIZE.small;
                break;
            default:
                return;
        }
        const playerPercentage = Math.ceil((playerPositionCount / gridSize) * constants_1.POURCENTAGE_CALCULATION);
        const totalPercentage = Math.ceil((totalTileCount / gridSize) * constants_1.POURCENTAGE_CALCULATION);
        this.statisticsService.updatePlayerPourcentageTile(playerName, roomCode, playerPercentage);
        gameInfo.glocalStatistics.percentageOfTile = totalPercentage;
    }
};
exports.GameRoomGateway = GameRoomGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameRoomGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.CreateAndJoinGameRoom),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleCreatAndJoinGameRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.UpdateBoard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleUpdateBoard", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.CreateRoom),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleCreateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.JoinRoom),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.LeaveRoom),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.KickPlayer),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleKickPlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.IsRoomExist),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleIsRoomExist", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.IsRoomLocked),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleIsRoomLocked", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.IsRoomFull),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleIsRoomFull", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.ToggleRoomLock),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleToggleRoomLock", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.GetActivePlayers),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleGetActivePlayers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.IsFirstPlayer),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleIsFirstPlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.GetGameID),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleGetGameId", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.GetGameSize),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleGetGameSize", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.GetAllPlayerAndGameInfo),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleGetAllInformation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.GetAllGlobalInfo),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleGetAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketEndGameStatistics.UpdatePlayerVictories),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleUpdatePlayerVictories", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketEndGameStatistics.UpdatePlayerLose),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleUpdatePlayerLose", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketEndGameStatistics.UpdatePlayerCombatCount),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleUpdatePlayerCombatCount", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketEndGameStatistics.UpdatePlayerDodgeCount),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleUpdateDodgeCombatCount", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketEndGameStatistics.UpdatePlayerLifeLost),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleUpdatePlayerLifeLost", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketEndGameStatistics.UpdatePlayerDamages),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameRoomGateway.prototype, "handleUpdatePlayerDamages", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.AddAttackerVirtualPlayer),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleAddAttackerVirtualPlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.AddDefensiveVirtualPlayer),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleAddDefensiveVirtualPlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_2.SocketWaitRoomLabels.RemoveVirtualPlayer),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameRoomGateway.prototype, "handleRemoveVirtualPlayer", null);
exports.GameRoomGateway = GameRoomGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [game_room_service_1.GameRoomService,
        virtual_player_service_1.VirtualPlayerService,
        statistics_service_1.StatisticsService])
], GameRoomGateway);
//# sourceMappingURL=game-room.gateway.js.map