import { GameLogGateway } from '@app/gateways/game-log-gateway/game-log.gateway';
import { GameData, Player } from '@common/interfaces';
import { Server } from 'socket.io';
export declare class CombatService {
    private readonly gameLogGateway;
    constructor(gameLogGateway: GameLogGateway);
    startFight(server: Server, roomCode: string, players: Player[], games: Map<string, GameData>): void;
    combatUpdate(server: Server, roomCode: string, attacker: Player, defender: Player): void;
    combatEscaped(server: Server, roomCode: string, escapee: string): void;
    combatEnded(server: Server, roomCode: string, winner: string, loser: string): void;
    combatRolls(server: Server, roomCode: string, attackerBonus: number, defenderBonus: number): void;
}
