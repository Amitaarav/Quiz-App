"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IOManager_1 = require("./managers/IOManager");
const UserManager_1 = require("./managers/UserManager");
const io = IOManager_1.IoManager.getIo();
const userManager = new UserManager_1.UserManager();
io.on('connnection', (socket) => {
    userManager.addUser(socket);
});
io.listen(3000);
