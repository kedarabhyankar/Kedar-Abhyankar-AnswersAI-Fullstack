import {Button} from "@mui/material";
import {performLogOut} from "./firebase";
import {useNavigate} from 'react-router-dom';

function Chat() {

    let navigate = useNavigate();
    const navigateToRootScreen = () => {
        let path = "/"
        navigate(path)
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to the AnswersAI Chat System</h1>
                <Button variant="contained"
                        onClick={() => {
                            performLogOut().then(r => navigateToRootScreen());
                        }}>
                    Log Out
                </Button>
            </header>
        </div>
    );
}

export default Chat;