import { GameLogGateway } from '@app/gateways/game-log-gateway/game-log.gateway';
import { Server } from 'socket.io';
import { PlayingManagerService } from '@app/services/playing-manager-service/playing-manager.service';
export declare class TurnService {
    private readonly gameLogGateway;
    private readonly playingManagerService;
    constructor(gameLogGateway: GameLogGateway, playingManagerService: PlayingManagerService);
    endTurn(server: Server, roomCode: string): void;
    private nextPlayer;
}
