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
exports.PlayerMovementService = void 0;
const constants_1 = require("../../constants/constants");
const game_log_gateway_1 = require("../../gateways/game-log-gateway/game-log.gateway");
const game_room_gateway_1 = require("../../gateways/game-room/game-room.gateway");
const game_room_service_1 = require("../game-room-service/game-room.service");
const constants_2 = require("../../../../common/constants");
const common_1 = require("@nestjs/common");
const playing_manager_service_1 = require("../playing-manager-service/playing-manager.service");
let PlayerMovementService = class PlayerMovementService {
    constructor(gameGateway, gameRoomService, gameLogGateway, playingManagerService) {
        this.gameGateway = gameGateway;
        this.gameRoomService = gameRoomService;
        this.gameLogGateway = gameLogGateway;
        this.playingManagerService = playingManagerService;
    }
    get _gameLogGateway() {
        return this.gameLogGateway;
    }
    animatePlayerMove(server, roomCode, path, currentPlayer, game) {
        let index = 1;
        const interval = setInterval(() => {
            if (index < path.length) {
                const nextTile = path[index];
                const previousTile = path[index - 1];
                this.handleTileTransition(previousTile, nextTile, currentPlayer, roomCode);
                if (this.isItemOnTile(nextTile)) {
                    this.handleItemPickup(server, interval, { tile: nextTile, player: currentPlayer, roomCode, path, tileIndex: index });
                    return;
                }
                this.emitMovePlayer(server, roomCode, nextTile, previousTile, currentPlayer);
                this.playingManagerService.endGameCtf(server, roomCode, currentPlayer, game);
                index++;
            }
            else {
                this.endAnimation(interval, currentPlayer, server, roomCode, 0);
            }
        }, constants_1.ANIMATION_INTERVAL);
    }
    toggleDoor(server, roomCode, tile) {
        server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.ToggleDoor, tile);
    }
    playerMoved(server, roomCode, loser, nextPosition) {
        server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.PlayerMoved, { loser, nextPosition });
    }
    choseItem(server, data) {
        server.to(data.roomCode).emit(constants_2.SocketPlayerMovementLabels.ItemChoice, data);
    }
    notifyInventoryUpdate(server, roomCode, currentPlayer) {
        const newPlayer = Object.assign({}, currentPlayer);
        const playerList = this.playingManagerService.gamesPlayers.get(roomCode);
        playerList.find((player) => player.name === currentPlayer.name).inventory = newPlayer.inventory;
        server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.InventoryUpdate, {
            playerName: currentPlayer.name,
            inventory: currentPlayer.inventory,
        });
    }
    handleTileTransition(previousTile, nextTile, player, roomCode) {
        this.setPlayerToNull(previousTile);
        this.setPlayerToNewTile(player, nextTile, roomCode);
    }
    isItemOnTile(tile) {
        var _a;
        return !!((_a = tile.item) === null || _a === void 0 ? void 0 : _a.name) && tile.item.name !== constants_1.ITEM_TYPES.spawn;
    }
    handleItemPickup(server, interval, playerMovementParams) {
        if (this.manageItemPickupBot(server, interval, playerMovementParams)) {
            return;
        }
        this.addItemInventory(playerMovementParams.tile, playerMovementParams.player, playerMovementParams.roomCode, server);
        playerMovementParams.tile.item = { name: '', description: '', image: '' };
        const countNumberOfTilesLeft = this.countTilesLeft(playerMovementParams.path, playerMovementParams.tileIndex);
        this.emitMovePlayer(server, playerMovementParams.roomCode, playerMovementParams.tile, playerMovementParams.path[playerMovementParams.tileIndex - 1], playerMovementParams.player);
        this.endAnimation(interval, playerMovementParams.player, server, playerMovementParams.roomCode, countNumberOfTilesLeft);
    }
    manageItemPickupBot(server, interval, playerMovementParams) {
        if (playerMovementParams.player.inventory.length === 2 && playerMovementParams.player.isVirtualPlayer) {
            if (playerMovementParams.tile.item.name === 'chestbox-2') {
                const oldItem = Object.assign({}, playerMovementParams.player.inventory[0]);
                const flag = Object.assign({}, playerMovementParams.tile.item);
                playerMovementParams.tile.item = oldItem;
                playerMovementParams.player.inventory[0] = flag;
                this.addItemInventory(playerMovementParams.tile, playerMovementParams.player, playerMovementParams.roomCode, server);
            }
            this.emitMovePlayer(server, playerMovementParams.roomCode, playerMovementParams.tile, playerMovementParams.path[playerMovementParams.tileIndex - 1], playerMovementParams.player);
            const countNumberOfTilesLeft = this.countTilesLeft(playerMovementParams.path, playerMovementParams.tileIndex);
            this.endAnimation(interval, playerMovementParams.player, server, playerMovementParams.roomCode, countNumberOfTilesLeft);
            return true;
        }
        return false;
    }
    addItemInventory(currentTile, player, roomCode, server) {
        const gameGateway = this.gameGateway.games.get(roomCode);
        const currentGame = this.gameRoomService.games.get(roomCode);
        const currentPlayer = this.gameRoomService.getPlayer(roomCode, player.name);
        this.updatePlayerItemsUsed(currentPlayer, currentTile);
        const numberOfPlayerWithFlag = this.countPlayersWithFlag(currentGame);
        gameGateway.glocalStatistics.nbOfTakenFleg = numberOfPlayerWithFlag;
        this.updatePlayerInventory(currentTile, player, roomCode, server);
        const logMessage = this.generateLogMessage(currentTile, player);
        this.logItemEvent(logMessage, player, roomCode);
    }
    updatePlayerItemsUsed(player, currentTile) {
        const itemName = { name: currentTile.item.name };
        if (!player.itemsUsed) {
            player.itemsUsed = [];
        }
        if (!player.itemsUsed.includes(itemName)) {
            player.itemsUsed.push(itemName);
        }
        player.stats.nbItem = player.itemsUsed.length;
    }
    countPlayersWithFlag(currentGame) {
        let numberOfPlayerWithFlag = 0;
        if (!currentGame.players) {
            return numberOfPlayerWithFlag;
        }
        for (const myCurrentPlayer of currentGame.players) {
            if (!myCurrentPlayer.itemsUsed) {
                continue;
            }
            for (const playerItem of myCurrentPlayer.itemsUsed) {
                if (playerItem.name === constants_1.CHESTBOX_NAME) {
                    numberOfPlayerWithFlag += 1;
                }
            }
        }
        return numberOfPlayerWithFlag;
    }
    updatePlayerInventory(currentTile, currentPlayer, roomCode, server) {
        if (!(currentTile.item && currentPlayer.inventory))
            return;
        currentPlayer.inventory.push(currentTile.item);
        if (!currentTile.item.name)
            return;
        const playersInRoom = this.playingManagerService.gamesPlayers.get(roomCode);
        if (!playersInRoom)
            return;
        const playerToUpdate = playersInRoom.find((player) => player.name === currentPlayer.name);
        if (playerToUpdate) {
            playerToUpdate.inventory = currentPlayer.inventory;
        }
        this.notifyInventoryUpdate(server, roomCode, currentPlayer);
    }
    generateLogMessage(currentTile, player) {
        if (currentTile.item.name === constants_1.CHESTBOX_NAME) {
            return `${player.name} a capturé le drapeau `;
        }
        return `${player.name} a ramassé l'objet ${currentTile.item.name}`;
    }
    logItemEvent(logMessage, player, roomCode) {
        const payload = {
            type: 'item',
            event: logMessage,
            players: [player],
            room: roomCode,
        };
        this.gameLogGateway.handleSendGameLog(null, payload);
    }
    endAnimation(interval, currentPlayer, server, roomCode, countNumberOfTilesLeft) {
        clearInterval(interval);
        const playerTurn = this.playingManagerService.gamesPlayerTurn.get(roomCode);
        const players = this.playingManagerService.gamesPlayers.get(roomCode);
        currentPlayer.coordinate = playerTurn.coordinate;
        const foundPlayer = players.find((player) => player.name === currentPlayer.name);
        foundPlayer.coordinate = currentPlayer.coordinate;
        server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.EndAnimation, { player: currentPlayer, countNumberOfTilesLeft });
    }
    setPlayerToNewTile(playerToMove, currentTile, roomCode) {
        currentTile.player = playerToMove;
        playerToMove.coordinate = currentTile.position;
        this.gameGateway.handlePathToMove(playerToMove, roomCode);
    }
    setPlayerToNull(previousTile) {
        previousTile.player = null;
    }
    countTilesLeft(path, currentTileIndex) {
        let countNumberOfTilesLeft = 0;
        for (let i = 0; i < path.length; i++) {
            if (i > currentTileIndex) {
                countNumberOfTilesLeft++;
            }
        }
        return countNumberOfTilesLeft;
    }
    emitMovePlayer(server, roomCode, nextTile, previousTile, player) {
        server.to(roomCode).emit(constants_2.SocketPlayerMovementLabels.MovePlayer, { nextTile, previousTile, player });
    }
};
exports.PlayerMovementService = PlayerMovementService;
exports.PlayerMovementService = PlayerMovementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => game_room_gateway_1.GameRoomGateway))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => game_room_service_1.GameRoomService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => game_log_gateway_1.GameLogGateway))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => playing_manager_service_1.PlayingManagerService))),
    __metadata("design:paramtypes", [game_room_gateway_1.GameRoomGateway,
        game_room_service_1.GameRoomService,
        game_log_gateway_1.GameLogGateway,
        playing_manager_service_1.PlayingManagerService])
], PlayerMovementService);
//# sourceMappingURL=player-movement.service.js.map