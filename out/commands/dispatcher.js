"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codeception_1 = require("./codeception");
function Dispatcher(commandOptions = {}) {
    return new codeception_1.CodeceptionCommand(commandOptions);
}
exports.default = Dispatcher;
//# sourceMappingURL=dispatcher.js.map