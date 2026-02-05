import { GameRoomService } from '@app/services/game-room-service/game-room.service';
import { StatisticsService } from '@app/services/statistics-service/statistics.service';
import { VirtualPlayerService } from '@app/services/virtual-player-service/virtual-player.service';
import { CombatRoomPayload, DamagePayload, Game, GameData, Player, PlayerActionPayload, PlayerInfoPayload, RoomAndPlayerInterface, RoomCodeInterface, RoomJoinPayload, RoomLeavePayload, StatisticsUpdatePayload, ToggleLockPayload, UpdateBoardPayload, UpdatePlayerDodgeCountInterface } from '@common/interfaces';
import { Server, Socket } from 'socket.io';
export declare class GameRoomGateway {
    private readonly gameRoomService;
    private readonly virtualPlayerService;
    private readonly statisticsService;
    server: Server;
    games: Map<string, GameData & {
        isDebugMode?: boolean;
    }>;
    readonly rooms: Set<string>;
    readonly socketMap: Map<string, Socket>;
    readonly selectionPlayerRoom: Map<string, Set<string>>;
    constructor(gameRoomService: GameRoomService, virtualPlayerService: VirtualPlayerService, statisticsService: StatisticsService);
    handleCreatAndJoinGameRoom(client: Socket, payload: CombatRoomPayload): Promise<void>;
    handleUpdateBoard(client: Socket, payload: UpdateBoardPayload): Promise<void>;
    handleCreateRoom(client: Socket, game: Game): Promise<string>;
    handleJoinRoom(client: Socket, payload: RoomJoinPayload): Promise<void>;
    handleLeaveRoom(client: Socket, payload: RoomLeavePayload): Promise<void>;
    handleKickPlayer(client: Socket, payload: PlayerActionPayload): Promise<void>;
    handleIsRoomExist(client: Socket, roomCode: string): void;
    handleIsRoomLocked(client: Socket, roomCode: string): void;
    handleIsRoomFull(client: Socket, roomCode: string): void;
    handleToggleRoomLock(client: Socket, payload: ToggleLockPayload): void;
    handleGetActivePlayers(client: Socket, roomCode: string): void;
    handleIsFirstPlayer(client: Socket, payload: PlayerActionPayload): Promise<void>;
    handleGetGameId(client: Socket, roomId: string): Promise<void>;
    handleGetGameSize(client: Socket, roomCode: string): Promise<void>;
    handleGetAllInformation(client: Socket, payload: PlayerInfoPayload): void;
    handleGetAll(client: Socket, payload: RoomCodeInterface): void;
    handleUpdatePlayerVictories(client: Socket, payload: StatisticsUpdatePayload): void;
    handleUpdatePlayerLose(client: Socket, payload: StatisticsUpdatePayload): void;
    handleUpdatePlayerCombatCount(client: Socket, payload: StatisticsUpdatePayload): void;
    handleUpdateDodgeCombatCount(client: Socket, payload: UpdatePlayerDodgeCountInterface): void;
    handleUpdatePlayerLifeLost(client: Socket, payload: DamagePayload): void;
    handleUpdatePlayerDamages(client: Socket, payload: DamagePayload): void;
    handleAddAttackerVirtualPlayer(client: Socket, roomCode: string): Promise<void>;
    handleAddDefensiveVirtualPlayer(client: Socket, roomCode: string): Promise<void>;
    handleRemoveVirtualPlayer(client: Socket, payload: RoomAndPlayerInterface): Promise<void>;
    handlePathToMove(currentPlayer: Player, roomCode: string): void;
    initializeNewRoom(roomCode: string, game: Game, client: Socket): void;
    initializeDoors(playerGame: GameData): void;
    handlePlayerKick(roomCode: string, player: Player, client: Socket, players: Player[]): void;
    handleAddVirtualPlayer(client: Socket, roomCode: string, type: 'attacker' | 'defensive'): Promise<void>;
    trackPlayerPosition(gameInfo: GameData & {
        isDebugMode?: boolean;
    }, positionKey: string, playerName: string): void;
    updateExplorationStatistics(gameInfo: GameData & {
        isDebugMode?: boolean;
    }, player: Player, roomCode: string): void;
    private updateMapExplorationPercentage;
}
