import { CreateGameDto } from '@app/dto/create-game.dto';
import { UpdateGameDto } from '@app/dto/update-game.dto';
import { GameService } from '@app/services/game-service/game.service';
export declare class GameController {
    private readonly gameService;
    private readonly logger;
    constructor(gameService: GameService);
    getAllGames(): Promise<import("../schema/game.schema").Game[]>;
    getVisibleGames(): Promise<import("../schema/game.schema").Game[]>;
    getGameById(id: string): Promise<import("../schema/game.schema").Game>;
    createGame(createGameDto: CreateGameDto): Promise<import("../schema/game.schema").Game>;
    updateGame(id: string, updateGameDto: UpdateGameDto): Promise<import("../schema/game.schema").Game>;
    updateVisibility(id: string, visibility: boolean): Promise<import("../schema/game.schema").Game>;
    deleteGame(id: string): Promise<void>;
}
