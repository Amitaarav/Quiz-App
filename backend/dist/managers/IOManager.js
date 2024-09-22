"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoManager = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer();
class IoManager {
    static getIo() {
        if (!this.instance) {
            this.instance = new IoManager();
            const io = new socket_io_1.Server(server);
            this.io = io;
        }
        return this.io;
    }
}
exports.IoManager = IoManager;
