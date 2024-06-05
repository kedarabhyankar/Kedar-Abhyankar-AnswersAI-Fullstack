import {Button, TextareaAutosize, TextField} from "@mui/material";
import {performLogOut} from "./firebase";
import {useNavigate} from 'react-router-dom';

function Chat() {

    let navigate = useNavigate();
    const navigateToRootScreen = () => {
        let path = "/"
        navigate(path)
    }

    const navigateToUserSettings = () => {
        let path = "/UserSettings";
        navigate(path);
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to the AnswersAI Chat System</h1>
                <div>
                    <Button variant="contained"
                            onClick={() => {
                                navigateToUserSettings();
                            }}>
                        User Settings
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="contained"
                            onClick={() => {
                                performLogOut().then(r => navigateToRootScreen());
                            }}>
                        Log Out
                    </Button>
                </div>
                <TextField
                    fullWidth
                    minRows={50}
                    sx={{input: {color: 'white'}}}
                >

                </TextField>
            </header>
        </div>
    );
}

export default Chat;