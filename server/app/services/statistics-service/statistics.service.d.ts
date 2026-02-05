import { GlobalStatistics } from '@common/interfaces';
import { GameRoomService } from '@app/services/game-room-service/game-room.service';
export declare class StatisticsService {
    private readonly gameRoomService;
    constructor(gameRoomService: GameRoomService);
    getAllGlobalInfo(roomCode: string): GlobalStatistics | null;
    updatePlayerVictories(playerName: string, roomCode: string, nbOfVictorie: number): void;
    updatePlayerLose(playerName: string, roomCode: string, nbPlayerLose: number): void;
    updatePlayerPourcentageTile(playerName: string, roomCode: string, value: number): void;
    updatePlayerDamages(playerName: string, roomCode: string, nbDamage: number): void;
    updateLifeLost(playerName: string, roomCode: string, lifeLost: number): void;
    updateCombatCount(playerName: string, roomCode: string, secondPlayer: string): void;
    updateDodgeCount(playerName: string, roomCode: string): void;
}
