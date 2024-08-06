import { Server } from "socket.io";
import http from "http";
const server = http.createServer();

export class IoManager {
    private static io:Server;
    private static instance: IoManager;
    
    public static getIo(){
        if(!this.instance){
            this.instance = new IoManager();
            const io = new Server(server);
            this.io = io;
    }
    return this.io;
    }

}