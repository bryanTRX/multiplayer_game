import { GameRoomGateway } from '@app/gateways/game-room/game-room.gateway';
import { CombatService } from '@app/services/combat-service/combat.service';
import { PlayerMovementService } from '@app/services/player-movement-service/player-movement.service';
import { PlayingManagerService } from '@app/services/playing-manager-service/playing-manager.service';
import { TimeService } from '@app/services/time-service/time.service';
import { TurnService } from '@app/services/turn-service/turn.service';
import { GameData, Player, Tile, RoomCodePayload, MessagePayload, CharacterPayload, CombatPayload, PlayerMovePayload, ItemChoicePayload, PlayerPathPayload } from '@common/interfaces';
import { Server, Socket } from 'socket.io';
export declare class PlayerGateway {
    private readonly playerMovementService;
    private readonly turnService;
    private readonly timeService;
    private readonly gameRoomGateway;
    private readonly combatService;
    private readonly playingManagerService;
    server: Server;
    constructor(playerMovementService: PlayerMovementService, turnService: TurnService, timeService: TimeService, gameRoomGateway: GameRoomGateway, combatService: CombatService, playingManagerService: PlayingManagerService);
    handleSendMessage(client: Socket, payload: MessagePayload): void;
    handleJoinRoomSelectPlayer(client: Socket, roomCode: string): void;
    handleCharacterSelected(client: Socket, payload: CharacterPayload): void;
    handleCharacterDeselected(client: Socket, payload: CharacterPayload): void;
    handleGetAllGlobalInfo(client: Socket, payload: RoomCodePayload): void;
    handleStartFight(client: Socket, data: GameData): void;
    handleAnimatePlayerMove(client: Socket, data: GameData): void;
    handleToggleDoor(client: Socket, data: GameData): void;
    handleCombatUpdate(client: Socket, payload: CombatPayload): void;
    handleCombatEscaped(client: Socket, payload: CombatPayload): void;
    handleCombatEnded(client: Socket, payload: CombatPayload): void;
    handlePlayerMoved(client: Socket, payload: PlayerMovePayload): void;
    handleDebugModeChange(client: Socket, data: {
        roomCode: string;
        isDebugMode: boolean;
    }): void;
    handleCombatRolls(client: Socket, payload: CombatPayload): void;
    handleEndGameWinVictories(client: Socket, payload: {
        roomCode: string;
        winner: string;
    }): void;
    handleItemChoice(client: Socket, data: ItemChoicePayload): void;
    handleMovePlayer(client: Socket, data: PlayerPathPayload): void;
    handleInventoryUpdate(client: Socket, data: {
        roomCode: string;
        player: Player;
    }): void;
    handleStartGame(client: Socket, data: GameData): void;
    handleQuitGame(client: Socket, data: GameData): void;
    handleEndTurn(client: Socket, data: GameData): void;
    handleRestartTimer(client: Socket, data: {
        roomCode: string;
        time: number;
    }): void;
    handleRestartTurn(client: Socket, data: {
        roomCode: string;
        player: Player;
    }): void;
    vitualPlayerAnimate(roomCode: string, path: Tile[], player: Player): void;
    emitVirtualPlayer(roomCode: string, virtualPlayer: Player): void;
    calculateDoorManipulationPercentage(roomCode: string): number;
    private isRoomValid;
    private sendError;
    private updateDoorManipulationStatus;
    private handleCurrentPlayerQuit;
    private endGame;
    private resetTimer;
    private restartTimerAfterCombat;
}
