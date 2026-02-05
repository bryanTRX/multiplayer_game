"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesModule = void 0;
const game_controller_1 = require("../controllers/game.controller");
const chat_system_gateway_1 = require("../gateways/chat-system-gateway/chat-system.gateway");
const game_log_gateway_1 = require("../gateways/game-log-gateway/game-log.gateway");
const game_room_gateway_1 = require("../gateways/game-room/game-room.gateway");
const notification_gateway_1 = require("../gateways/notification/notification.gateway");
const game_schema_1 = require("../schema/game.schema");
const chat_history_service_1 = require("../services/chat-history-service/chat-history.service");
const game_log_history_service_1 = require("../services/game-log-history-service/game-log-history.service");
const game_room_service_1 = require("../services/game-room-service/game-room.service");
const game_service_1 = require("../services/game-service/game.service");
const player_movement_service_1 = require("../services/player-movement-service/player-movement.service");
const player_service_1 = require("../services/player-service/player.service");
const virtual_player_service_1 = require("../services/virtual-player-service/virtual-player.service");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const time_service_1 = require("../services/time-service/time.service");
const turn_service_1 = require("../services/turn-service/turn.service");
const player_gateway_1 = require("../gateways/player-gateway/player.gateway");
const playing_manager_service_1 = require("../services/playing-manager-service/playing-manager.service");
const combat_service_1 = require("../services/combat-service/combat.service");
const statistics_service_1 = require("../services/statistics-service/statistics.service");
let GamesModule = class GamesModule {
};
exports.GamesModule = GamesModule;
exports.GamesModule = GamesModule = __decorate([
    (0, common_1.Module)({
        controllers: [game_controller_1.GameController],
        providers: [
            game_service_1.GameService,
            game_room_service_1.GameRoomService,
            player_movement_service_1.PlayerMovementService,
            player_service_1.PlayerService,
            virtual_player_service_1.VirtualPlayerService,
            common_1.Logger,
            game_room_gateway_1.GameRoomGateway,
            player_gateway_1.PlayerGateway,
            notification_gateway_1.NotificationGateway,
            time_service_1.TimeService,
            turn_service_1.TurnService,
            chat_system_gateway_1.ChatGateway,
            chat_history_service_1.ChatHistoryService,
            game_log_gateway_1.GameLogGateway,
            game_log_history_service_1.GameLogHistoryService,
            combat_service_1.CombatService,
            playing_manager_service_1.PlayingManagerService,
            statistics_service_1.StatisticsService,
        ],
        imports: [mongoose_1.MongooseModule.forFeature([{ name: game_schema_1.Game.name, schema: game_schema_1.gameSchema }])],
        exports: [
            player_service_1.PlayerService,
            combat_service_1.CombatService,
            game_room_service_1.GameRoomService,
            player_movement_service_1.PlayerMovementService,
            time_service_1.TimeService,
            turn_service_1.TurnService,
            virtual_player_service_1.VirtualPlayerService,
            playing_manager_service_1.PlayingManagerService,
            statistics_service_1.StatisticsService,
        ],
    })
], GamesModule);
//# sourceMappingURL=game.modules.js.map