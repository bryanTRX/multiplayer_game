import { TurnService } from '@app/services/turn-service/turn.service';
import { Player } from '@common/interfaces';
import { Server } from 'socket.io';
import { PlayingManagerService } from '@app/services/playing-manager-service/playing-manager.service';
export declare class TimeService {
    private readonly turnService;
    private readonly playingManagerService;
    gamesCounter: Map<string, number>;
    private readonly gamesInterval;
    private readonly gamesIsNotification;
    constructor(turnService: TurnService, playingManagerService: PlayingManagerService);
    startTimer(startValue: number, server: Server, roomCode: string, playerTurn: Player): void;
    stopTimer(roomCode: string): void;
    private startInterval;
    private manageNotification;
    private manageEndTurn;
    private startTurnTimer;
    private changeTimer;
}
