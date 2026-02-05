"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogHistoryService = void 0;
const common_1 = require("@nestjs/common");
let GameLogHistoryService = class GameLogHistoryService {
    constructor() {
        this.logs = {};
    }
    getLogs(roomCode) {
        return this.logs[roomCode] || [];
    }
    addLog(roomCode, log) {
        if (!this.logs[roomCode]) {
            this.logs[roomCode] = [];
        }
        this.logs[roomCode].push(log);
    }
    clearLogs(roomCode) {
        this.logs[roomCode] = [];
    }
};
exports.GameLogHistoryService = GameLogHistoryService;
exports.GameLogHistoryService = GameLogHistoryService = __decorate([
    (0, common_1.Injectable)()
], GameLogHistoryService);
//# sourceMappingURL=game-log-history.service.js.map