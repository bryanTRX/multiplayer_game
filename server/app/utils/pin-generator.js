"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePin = generatePin;
const constants_1 = require("../constants/constants");
function generatePin() {
    return Math.floor(Math.random() * constants_1.MAX_PIN_VALUE)
        .toString()
        .padStart(constants_1.PIN_LENGTH, '0');
}
//# sourceMappingURL=pin-generator.js.map