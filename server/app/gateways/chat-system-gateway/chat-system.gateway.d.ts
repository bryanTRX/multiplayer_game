import { ChatHistoryService } from '@app/services/chat-history-service/chat-history.service';
import { MessageInRoomInterface, PlayerInGameInterface } from '@common/interfaces';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameRoomService } from '@app/services/game-room-service/game-room.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameRoomService;
    private readonly chatHistoryService;
    private readonly server;
    private readonly logger;
    constructor(gameRoomService: GameRoomService, chatHistoryService: ChatHistoryService);
    handleJoinGame(socket: Socket, data: PlayerInGameInterface): Promise<void>;
    handleMessage(socket: Socket, data: MessageInRoomInterface): Promise<void>;
    handleLeaveGame(socket: Socket, data: PlayerInGameInterface): void;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    private isPlayerInRoom;
    private getChatRoomId;
}
