import { CreateGameDto } from '@app/dto/create-game.dto';
import { UpdateGameDto } from '@app/dto/update-game.dto';
import { NotificationGateway } from '@app/gateways/notification/notification.gateway';
import { Game, GameDocument } from '@app/schema/game.schema';
import { Model } from 'mongoose';
export declare class GameService {
    private readonly gameModel;
    private readonly notificationGateway;
    constructor(gameModel: Model<GameDocument>, notificationGateway: NotificationGateway);
    getAllGames(): Promise<Game[]>;
    getGameById(id: string): Promise<Game | null>;
    getVisibleGames(): Promise<Game[]>;
    createGame(game: CreateGameDto): Promise<Game>;
    updateGame(id: string, game: UpdateGameDto): Promise<Game | null>;
    updateVisibility(id: string, visibility: boolean): Promise<Game | null>;
    deleteGame(id: string): Promise<void>;
    findGameByAttributes(name: string): Promise<Game | null>;
    private formatDate;
}
