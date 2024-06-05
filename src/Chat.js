import {Button} from "@mui/material";
import {performLogOut} from "./firebase";

function Chat() {

    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to the AnswersAI Chat System</h1>
                <Button variant="contained"
                        onClick={() => {
                            performLogOut();
                        }}>
                    Log Out
                </Button>
            </header>
        </div>
    );
}

export default Chat;