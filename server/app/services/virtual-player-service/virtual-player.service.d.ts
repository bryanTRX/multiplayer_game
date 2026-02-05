import { GameRoomService } from '@app/services/game-room-service/game-room.service';
import { PlayerService } from '@app/services/player-service/player.service';
import { Player } from '@common/interfaces';
export declare class VirtualPlayerService {
    private readonly gameRoomService;
    private readonly playerService;
    constructor(gameRoomService: GameRoomService, playerService: PlayerService);
    addAttackerVirtualPlayer(roomCode: string): Promise<Player | {
        error: string;
    }>;
    addDefensiveVirtualPlayer(roomCode: string): Promise<Player | {
        error: string;
    }>;
    addVirtualPlayer(roomCode: string, isAggressive: boolean): Promise<Player | {
        error: string;
    }>;
    removeVirtualPlayer(roomCode: string, playerName: string): Promise<{
        success?: boolean;
        error?: string;
    }>;
    getVirtualPlayers(roomCode: string): Promise<Player[]>;
    private findGame;
    private getRandomVirtualPlayerName;
    private createVirtualPlayer;
}
