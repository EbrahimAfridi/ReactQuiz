import Header from "./components/Header.jsx";
import "./index.css"
import Main from "./components/Main.jsx";
import {useEffect, useReducer} from "react";
import Loader from "./components/Loader.jsx";
import Error from "./components/Error.jsx";
import StartingScreen from "./components/StartingScreen.jsx";
import Questions from "./components/Questions.jsx";
import Progress from "./components/Progress.jsx";
import FinishScreen from "./components/FinishScreen.jsx";
import NextButton from "./components/NextButton.jsx";
import Footer from "./components/Footer.jsx";
import Timer from "./components/Timer.jsx";

const SECS_PER_QUES = 30;

const initialState = {

    questions: [],

    status: "loading",   // loading, error, ready, active, finished

    index: 0,

    answer: null,

    points: 0,

    highscore: 0,

    secondsRemaining: null,

};

function reducer(state, action) {

    switch (action.type) {

        case "dataReceived":

            return {

                ...state,

                questions: action.payload,

                status: "ready"

            };

        case "dataFailed":

            return {

                ...state,

                status: "error",

            };

        case "start":

            return {

                ...state,

                status: "active",

                secondsRemaining: (state.questions.length * SECS_PER_QUES)

            };

        case "newAnswer":

            const question = state.questions.at(state.index);  // this gives us the index of current selected question

            return {

                ...state,

                answer: action.payload,

                points: action.payload === question.correctOption ? state.points + question.points : state.points,

            };

        case "nextQuestion":

            return {

                ...state,

                index: state.index + 1,

                answer: null,

            };

        case "finish":

            return {

                ...state,

                status: 'finished',

                points: 0,

                highscore: state.highscore > state.points ? state.highscore : state.points,

            };

        case "reset":

            return {
                ...initialState,

                questions: state.questions,

                status: "ready"

            };

        case "timer":

            return {

                ...state,

                secondsRemaining: state.secondsRemaining - 1,

                status: state.secondsRemaining === 0 ? "finished" : state.status,

            };

        default:

            throw new Error("Unknown action");

    }

}


export default function ReactQuiz(){

    const [{questions, status, index, answer, points, highscore, secondsRemaining}, dispatch] = useReducer(reducer, initialState);

    const numQuestions = questions.length;  // this is a derived state [derived from initialState object]

    const totalPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

    useEffect(() => {

        fetch("http://localhost:8000/questions/")

            .then((res) => res.json())

            .then((data) => dispatch({type: "dataReceived", payload: data}))

            .catch(() => dispatch({type: "dataFailed"}))

    }, []);

    return(

        <div className="app">

            <Header/>

            <Main>

                { status === 'loading' && <Loader/> }

                { status === "error" && <Error/> }

                { status === "ready" && <StartingScreen dispatch={dispatch} numQuestions={numQuestions}/> }

                { status === "active" && (

                    <>

                        <Progress points={points} index={index} numQuestions={numQuestions} totalPoints={totalPoints} answer={answer}/>

                        <Questions dispatch={dispatch} answer={answer} question={ questions[index] }/>

                        <Footer>

                            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>

                            <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions}/>

                        </Footer>

                    </>

                )}

                { status === 'finished' && <FinishScreen dispatch={dispatch} points={points} totalPoints={totalPoints} highscore={highscore}/> }

            </Main>
        </div>

    )
}