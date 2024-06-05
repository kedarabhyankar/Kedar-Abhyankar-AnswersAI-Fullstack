import {useEffect} from "react";
import {useNavigate} from 'react-router-dom'
function Home() {


    let navigate = useNavigate()

    useEffect(() => {
        document.title = "AnswersAI Take Home Interview"
    })

    const navigateToAuthFlow = () => {
        let path = "/AuthFlow"
        navigate(path)
    }
    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title"> AnswersAI Take Home Interview </h1>
                <a> Kedar Abhyankar, krabhyankar@gmail.com</a>
                <a> Full Stack Engineer Interview</a>
                <br/>
                <button onClick={navigateToAuthFlow}>Start</button>
            </header>
        </div>
    );

}

export default Home;