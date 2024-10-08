import { IoManager } from "./managers/IOManager";

export type AllowedSubmissions = 0  | 1 | 2 | 3;

const PROBLEM_TIME_S = 20;
// user interface
interface User{
    name : string,
    id : string,
    points : number
}
//submission interface
interface Submission {
    problemId : string,
    userId : string,
    isCorrect : boolean;
    optionSelected : AllowedSubmissions;
}
//problem interface
interface Problem{
    id : string,
    title : string,
    description : string,
    image? : string,
    startTime : number,
    answer :AllowedSubmissions ,
    options : {
        id : number,
        title : string
    }[],
    submissions : Submission[];
    
}


export class Quiz {
    public roomId: string;
    private hasStarted: boolean;
    private problems : Problem[];
    private activeProblem : number ;
    private users : User[];
    private currentState: "leaderboard" | "question" | "notStarted" | "ended" ;
    constructor(roomId : string)
    {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = "notStarted";
        console.log("room created");
        setInterval(() =>{
            this.debug()
        },10000)
    }

    debug(){
        console.log("----------debug----------")
        console.log("room id : " + this.roomId);
        console.log("has started : " + this.hasStarted);
        console.log("problems : " + JSON.stringify(this.problems));
        console.log("active problem : " + this.activeProblem);
        console.log("users : " + this.users);
        console.log("current state : " + this.currentState);
    }

    addProblem(problem : Problem ){
        this.problems.push(problem);
        console.log(this.problems);
    }
    start(){
        this.hasStarted = true;
        const io = IoManager.getIo();
        //activate the the problem and start the timer
        this.setActiveProblem(this.problems[0]);
        this.problems[0].startTime = new Date().getTime();
    }

    // function to make ackive the problem that has been asked in the quiz
    setActiveProblem(problem : Problem){
        console.log("setting active problem")
        this.currentState = "question";
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        //Todo : clear this if function moves ahead
        IoManager.getIo().to(this.roomId).emit("CHANGE_PROBLEM",{
            problem
        })
        setTimeout(() => {
            // when the time is up, send the leaderboard
            this.sendLeaderboard();
        },PROBLEM_TIME_S * 1000 )
    }

    // function for leaderboard to display
    sendLeaderboard(){
        const leaderBoard = this.getLeaderboard();
        IoManager.getIo().to(this.roomId).emit("leaderboard",{
            leaderBoard
        });
    }
    //
    next(){
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        
        if(problem){
            this.setActiveProblem(problem);
        }
        else{
            this.activeProblem--;
            
        }
        
    }

    //random function to generate random Id for the individual users
    generateRandomId(length : number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    addUser(name : string){
        const id = this.generateRandomId(7);
        this.users.push({
            id,
            name,
            points: 0
        })
        return id;
    }
    submit(userId : string, roomId : string, problemId : string, submission : AllowedSubmissions){
        const problem = this.problems.find(x=>x.id == problemId);
        const user = this.users.find(x=>x.id == userId);
        if(!problem || !user){
            return;
        }
        const existingSubmission = problem.submissions.find(x => x.userId === userId);
        if(existingSubmission){
            return;
        }

        problem.submissions.push({
            problemId,
            userId,
            isCorrect: problem.answer === submission,
            optionSelected  : submission,
        });
        user.points += (1000 - (500 * (new Date().getTime() - problem.startTime)/ (PROBLEM_TIME_S * 1000)));
    }

    getLeaderboard(){
        //sorted user for leaderboard for top 20
        return this.users.sort((a,b)=>a.points < b.points ? -1 : 1).splice(0,20);
    }
    getCurrentState(){
        if(this.currentState === "notStarted"){
            return {
                type: "notStarted"
            }
        }
        if(this.currentState === "ended"){
            return {
                type: "ended",
                leaderboard: this.getLeaderboard()
            }
        }
        if(this.currentState === "leaderboard"){
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderboard()
            }
        }
        if(this.currentState === "question"){
            const problem = this.problems[this.activeProblem];
            return {
                type: "question",
                problem
            }
        }
    }
}