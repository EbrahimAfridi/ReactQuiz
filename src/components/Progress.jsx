export default function Progress({index, numQuestions, points, totalPoints, answer}){
    return(
        <header className="progress">

            <progress max={numQuestions} value={index + Number(answer !== null)}/>

            <p>Question <strong>{index}</strong> / {numQuestions} </p>

            <p><strong>{points}</strong> / {totalPoints}</p>

        </header>
    )
}


{/*
    doing Number(answer !== null) because we want the progress bar to move after selecting an option and
    not wait till we click the next button. As this will return the boolean into 0 or 1.
*/}