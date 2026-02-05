import { GameLogHistoryService } from '@app/services/game-log-history-service/game-log-history.service';
import { RoomJoinData, GameLogPayload } from '@common/interfaces';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
export declare class GameLogGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameLogHistoryService;
    private readonly server;
    private readonly logger;
    constructor(gameLogHistoryService: GameLogHistoryService);
    handleJoinRoom(socket: Socket, data: RoomJoinData): void;
    handleGetGameLogs(socket: Socket, data: {
        roomCode?: string;
    }): void;
    handleSendGameLog(socket: Socket, payload: GameLogPayload): void;
    handleNewGame(socket: Socket, data: RoomJoinData): void;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    private getGameRoomId;
    private getPlayerRoomId;
    private isValidRoomData;
    private isCombatLog;
    private hasPlayers;
    private sendCombatLogToPlayers;
    private sendLogToGameRoom;
}
