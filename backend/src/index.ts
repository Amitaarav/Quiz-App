
import { IoManager } from './managers/IOManager'
import { UserManager } from './managers/UserManager';

const io = IoManager.getIo();

const userManager = new UserManager();
io.on('connnection',(socket)=>{
    userManager.addUser(socket);
})

io.listen(8080)