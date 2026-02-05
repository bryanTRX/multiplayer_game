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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const notification_gateway_1 = require("../../gateways/notification/notification.gateway");
const game_schema_1 = require("../../schema/game.schema");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
let GameService = class GameService {
    constructor(gameModel, notificationGateway) {
        this.gameModel = gameModel;
        this.notificationGateway = notificationGateway;
    }
    async getAllGames() {
        return this.gameModel.find({});
    }
    async getGameById(id) {
        return this.gameModel.findOne({ id });
    }
    async getVisibleGames() {
        return this.gameModel.find({ visibility: true });
    }
    async createGame(game) {
        const newGame = Object.assign(Object.assign({}, game), { id: (0, uuid_1.v4)(), modificationDate: this.formatDate(new Date()), screenshot: game.screenshot || '' });
        return this.gameModel.create(newGame);
    }
    async updateGame(id, game) {
        return this.gameModel.findOneAndUpdate({ id }, Object.assign(Object.assign({}, game), { dateModification: this.formatDate(new Date()), screenshot: game.screenshot }), { new: true });
    }
    async updateVisibility(id, visibility) {
        const game = await this.gameModel.findOneAndUpdate({ id }, { visibility, dateModification: this.formatDate(new Date()) }, { new: true });
        if (game) {
            this.notificationGateway.sendVisibilityChangeNotification(game.name, visibility);
        }
        return game;
    }
    async deleteGame(id) {
        const game = await this.gameModel.findOne({ id });
        if (game) {
            await this.gameModel.deleteOne({ id });
            this.notificationGateway.sendGameDeletionNotification(game.id, game.name);
        }
    }
    async findGameByAttributes(name) {
        return this.gameModel.findOne({ name });
    }
    formatDate(date) {
        const d = new Date(date);
        if (isNaN(d.getTime()))
            return 'Invalid Date';
        const pad = (num) => num.toString().padStart(2, '0');
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        return `${year}/${month}/${day} - ${hours}:${minutes}`;
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(game_schema_1.Game.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notification_gateway_1.NotificationGateway])
], GameService);
//# sourceMappingURL=game.service.js.map