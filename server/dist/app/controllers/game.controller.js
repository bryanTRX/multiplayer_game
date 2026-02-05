"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GameController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const create_game_dto_1 = require("../dto/create-game.dto");
const update_game_dto_1 = require("../dto/update-game.dto");
const game_service_1 = require("../services/game-service/game.service");
const common_1 = require("@nestjs/common");
let GameController = GameController_1 = class GameController {
    constructor(gameService) {
        this.gameService = gameService;
        this.logger = new common_1.Logger(GameController_1.name);
    }
    async getAllGames() {
        try {
            const games = await this.gameService.getAllGames();
            this.logger.log('Successfully retrieved all games.');
            return games;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get all games.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getVisibleGames() {
        try {
            const visibleGames = await this.gameService.getVisibleGames();
            this.logger.log('Successfully retrieved all visible games.');
            return visibleGames;
        }
        catch (error) {
            throw new common_1.HttpException('An unexpected error occurred.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getGameById(id) {
        try {
            const game = await this.gameService.getGameById(id);
            if (!game) {
                throw new common_1.HttpException('Game not found.', common_1.HttpStatus.NOT_FOUND);
            }
            this.logger.log(`Game with ID ${id} found successfully.`);
            return game;
        }
        catch (error) {
            if (error instanceof common_1.HttpException && error.getStatus() === common_1.HttpStatus.NOT_FOUND) {
                throw error;
            }
            throw new common_1.HttpException('Failed to fetch game.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createGame(createGameDto) {
        try {
            const existingGame = await this.gameService.findGameByAttributes(createGameDto.name);
            if (existingGame) {
                throw new common_1.HttpException('Failed to add game, it already exists', common_1.HttpStatus.CONFLICT);
            }
            const newGame = await this.gameService.createGame(createGameDto);
            this.logger.log(`Game "${createGameDto.name}" created successfully.`);
            return newGame;
        }
        catch (error) {
            if (error instanceof common_1.HttpException && error.getStatus() === common_1.HttpStatus.CONFLICT) {
                throw error;
            }
        }
    }
    async updateGame(id, updateGameDto) {
        try {
            const game = await this.gameService.getGameById(id);
            if (!game) {
                throw new common_1.HttpException('Game not found.', common_1.HttpStatus.NOT_FOUND);
            }
            const updatedGame = await this.gameService.updateGame(id, updateGameDto);
            if (!updatedGame) {
                throw new common_1.HttpException('Failed to update game.', common_1.HttpStatus.BAD_REQUEST);
            }
            this.logger.log(`Game with ID ${id} updated successfully.`);
            return updatedGame;
        }
        catch (error) {
            if (error instanceof common_1.HttpException && error.getStatus() === common_1.HttpStatus.BAD_REQUEST) {
                throw error;
            }
            else {
                throw new common_1.HttpException('Game not found.', common_1.HttpStatus.NOT_FOUND);
            }
        }
    }
    async updateVisibility(id, visibility) {
        try {
            const updatedGame = await this.gameService.updateVisibility(id, visibility);
            if (!updatedGame) {
                throw new common_1.HttpException('Game not found.', common_1.HttpStatus.NOT_FOUND);
            }
            this.logger.log(`Visibility of game with ID ${id} updated to ${visibility}.`);
            return updatedGame;
        }
        catch (error) {
            if (error instanceof common_1.HttpException && error.getStatus() === common_1.HttpStatus.NOT_FOUND) {
                throw error;
            }
            throw new common_1.HttpException('Failed to update visibility.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteGame(id) {
        try {
            const game = await this.gameService.getGameById(id);
            if (!game) {
                throw new common_1.HttpException('Game not found.', common_1.HttpStatus.NOT_FOUND);
            }
            const deletedGame = await this.gameService.deleteGame(id);
            this.logger.log(`Game with ID ${id} deleted successfully.`);
            return deletedGame;
        }
        catch (error) {
            if (error instanceof common_1.HttpException && error.getStatus() === common_1.HttpStatus.NOT_FOUND) {
                throw error;
            }
            throw new common_1.HttpException('Failed to delete game.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getAllGames", null);
__decorate([
    (0, common_1.Get)('visible'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getVisibleGames", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getGameById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_game_dto_1.CreateGameDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "createGame", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_game_dto_1.UpdateGameDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "updateGame", null);
__decorate([
    (0, common_1.Patch)(':id/visibility'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('visibility')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "updateVisibility", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "deleteGame", null);
exports.GameController = GameController = GameController_1 = __decorate([
    (0, common_1.Controller)('Game'),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map