"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sizeCapacity = exports.GameSize = void 0;
var GameSize;
(function (GameSize) {
    GameSize["bigSize"] = "Grande Taille";
    GameSize["mediumSize"] = "Moyenne Taille";
    GameSize["smallSize"] = "Petite Taille";
})(GameSize || (exports.GameSize = GameSize = {}));
exports.sizeCapacity = {
    [GameSize.bigSize]: { min: 2, max: 6 },
    [GameSize.mediumSize]: { min: 2, max: 4 },
    [GameSize.smallSize]: { min: 2, max: 2 },
};
//# sourceMappingURL=interfaces.js.map