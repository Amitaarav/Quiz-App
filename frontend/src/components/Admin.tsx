import { useState,useEffect } from 'react';
import { io } from 'socket.io-client';
import Socket  from 'socket.io-client/debug';
import { QuizControls } from './QuizControls';
import { CreateProblem } from './CreateProblem';


const socket = io('http://localhost:3000');

const Admin = () => {
    const [ socket, setSocket ] = useState<null | any>(null);
    const [ quizId, setQuizId ] = useState<string>('');
    const [roomId,setRoomId] = useState<string>('');
    useEffect(() => {
        const socket = io('http://localhost:3000');
        setSocket(socket);

        socket.on("connect",()=>{
            console.log(socket.id);
            socket.emit("joinAdmin",{
                password: "ADMIN_PASSWORD"
            });
        })
    },[])
    if(!quizId){
        return (
            <div className='h-screen flex flex-col justify-center items-center p-2'>
                <input className = " border-2 border-black rounded-md p-2"type="text" placeholder = "Enter Quiz Id" onChange={(event)=>{
                    setRoomId(event.target.value);
                }} />
                <br/>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{
                    socket.emit("createQuiz",{
                        roomId
                    });
                    setQuizId(roomId);
                }}> Create Room </button>
            </div>
        )
    }
    return <div> 
        <CreateProblem roomId={quizId} socket={socket} />
        <QuizControls socket={socket} roomId={roomId} />
    </div>
}

export default Admin;