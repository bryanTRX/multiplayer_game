import { PlayerService } from '@app/services/player-service/player.service';
import { Game, GameData, Player, PlayerAndGame } from '@common/interfaces';
export declare class GameRoomService {
    private readonly playerService;
    readonly games: Map<string, GameData>;
    private readonly rooms;
    private readonly selectionPlayerRoom;
    private readonly combatRoom;
    private readonly gamesCombatRoom;
    constructor(playerService: PlayerService);
    createRoom(gameToAdd: Game, size: string): Promise<string>;
    createCombatRoomService(firstPlayer: Player, secondPlayer: Player): Promise<string>;
    createSelectPlayerRoom(roomCode: string): Promise<void>;
    joinRoom(roomCode: string, player: Player): Promise<PlayerAndGame | {
        error: string;
        currentPlayers: number;
        capacity: number;
    }>;
    leaveRoom(roomCode: string, player: Player): Promise<{
        game?: GameData;
        isAdmin?: boolean;
        destroyed?: boolean;
        reason?: string;
    }>;
    getGame(roomCode: string): Promise<GameData | null>;
    getAllInformationPlayer(playerName: string, roomCode: string): object;
    getActivePlayers(roomCode: string): Player[];
    toggleRoomLock(roomCode: string, isLocked: boolean): GameData | null;
    isRoomExist(roomCode: string): boolean;
    isRoomLocked(roomCode: string): boolean;
    isRoomFull(roomCode: string): boolean;
    isFirstPlayer(roomCode: string, player: Player): Promise<boolean>;
    selectCharacter(roomCode: string, player: Player, avatarUrl: string): GameData | null;
    deselectCharacter(roomCode: string, player: Player): GameData | null;
    getPlayer(roomCode: string, playerName: string): Player;
    private validatePlayerAndGame;
}
