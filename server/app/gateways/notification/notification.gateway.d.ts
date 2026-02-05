import { Server } from 'socket.io';
export declare class NotificationGateway {
    private server;
    private readonly logger;
    setServer(server: Server): void;
    sendVisibilityChangeNotification(name: string, visibility: boolean): void;
    sendGameDeletionNotification(gameId: string, gameName: string): void;
}
