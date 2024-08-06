import { Server } from 'socket.io'
import { IOManager } from './managers/IOManager'

const io = IOManager.getIo().io;
io.on('connnection',(client)=>{
    client.on('event',data => {
        const type = data.type;
    })
    client.on('disconnect',()=>{
        
    })
})

io.listen(3000)