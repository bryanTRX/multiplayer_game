import { GameLogGateway } from '@app/gateways/game-log-gateway/game-log.gateway';
import { GameRoomGateway } from '@app/gateways/game-room/game-room.gateway';
import { GameRoomService } from '@app/services/game-room-service/game-room.service';
import { Game, Item, Player, Position, Tile } from '@common/interfaces';
import { Server } from 'socket.io';
import { PlayingManagerService } from '@app/services/playing-manager-service/playing-manager.service';
export declare class PlayerMovementService {
    private readonly gameGateway;
    private readonly gameRoomService;
    private readonly gameLogGateway;
    private readonly playingManagerService;
    constructor(gameGateway: GameRoomGateway, gameRoomService: GameRoomService, gameLogGateway: GameLogGateway, playingManagerService: PlayingManagerService);
    get _gameLogGateway(): GameLogGateway;
    animatePlayerMove(server: Server, roomCode: string, path: Tile[], currentPlayer: Player, game: Game): void;
    toggleDoor(server: Server, roomCode: string, tile: Tile): void;
    playerMoved(server: Server, roomCode: string, loser: Player, nextPosition: Position): void;
    choseItem(server: Server, data: {
        item: Item;
        playerPosition: Position;
        roomCode: string;
    }): void;
    notifyInventoryUpdate(server: Server, roomCode: string, currentPlayer: Player): void;
    private handleTileTransition;
    private isItemOnTile;
    private handleItemPickup;
    private manageItemPickupBot;
    private addItemInventory;
    private updatePlayerItemsUsed;
    private countPlayersWithFlag;
    private updatePlayerInventory;
    private generateLogMessage;
    private logItemEvent;
    private endAnimation;
    private setPlayerToNewTile;
    private setPlayerToNull;
    private countTilesLeft;
    private emitMovePlayer;
}
