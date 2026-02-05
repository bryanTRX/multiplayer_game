import { GameLogGateway } from '@app/gateways/game-log-gateway/game-log.gateway';
import { GameRoomGateway } from '@app/gateways/game-room/game-room.gateway';
import { TimeService } from '@app/services/time-service/time.service';
import { Game, GameData, Player, Tile } from '@common/interfaces';
import { Server } from 'socket.io';
export declare class PlayingManagerService {
    private readonly timeService;
    private readonly gameGateway;
    private readonly gameLogGateway;
    endGameEmitted: boolean;
    gamesPlayers: Map<string, Player[]>;
    gamesPlayerTurn: Map<string, Player>;
    constructor(timeService: TimeService, gameGateway: GameRoomGateway, gameLogGateway: GameLogGateway);
    quitGame(server: Server, roomCode: string, player: Player, map: Tile[], games: Map<string, GameData>): void;
    startGame(server: Server, roomCode: string, players: Player[], games: Map<string, GameData>): void;
    endGameWinVictories(server: Server, roomCode: string, winner: string): void;
    debugModeChanged(server: Server, roomCode: string, isDebugMode: boolean): void;
    endGameCtf(server: Server, roomCode: string, player: Player, game: Game): void;
    private setPlayersSpawn;
    private setPlayers;
    private shuffle;
    private setRandomTeams;
    private setRandomItems;
    private emitEndGameCtf;
    private setOrderPlayers;
}
