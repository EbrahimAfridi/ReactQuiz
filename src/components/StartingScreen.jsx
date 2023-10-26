

export default function StartingScreen({numQuestions, dispatch}){
    return(

        <div className="start">

            <h2>Welcome to the React Quiz</h2>

            <h3>{numQuestions} Question to test your react mastery</h3>

            <button onClick={() => dispatch( {type: "start"} )} className="btn btn-ui">

                Let's Start

            </button>

        </div>
    )
}