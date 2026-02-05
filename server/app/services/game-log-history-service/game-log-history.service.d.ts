import { GameLogEntry } from '@common/interfaces';
export declare class GameLogHistoryService {
    private logs;
    getLogs(roomCode: string): GameLogEntry[];
    addLog(roomCode: string, log: GameLogEntry): void;
    clearLogs(roomCode: string): void;
}
