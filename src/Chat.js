import {Button, debounce, TextareaAutosize, TextField} from "@mui/material";
import {performLogOut} from "./firebase";
import {useNavigate} from 'react-router-dom';
import {useState} from "react";
import {submitTextFromChatScreen} from "./firebase";
import {Textarea} from "@mui/joy";
function Chat() {

    let navigate = useNavigate();
    const [submittedText, setSubmittedText] = useState('');
    let [textBoxValue, setTextBoxValue] = useState('');
    const handleResize = debounce(() => {
    }, 200);

    window.addEventListener('resize', handleResize);

    const navigateToRootScreen = () => {
        let path = "/"
        navigate(path)
    }

    const navigateToUserSettings = () => {
        let path = "/UserSettings";
        navigate(path);
    }

    const handleButtonClick = async (e) => {
        e.stopPropagation();
        const updatedText = await submitTextFromChatScreen(submittedText, textBoxValue);
        setTextBoxValue(updatedText);
        setSubmittedText("");
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to the AnswersAI Chat System</h1>
                <a>Type your question in the chat box below, and hit submit. You can also type --token to know
                how many tokens you have left. You have an allotted amount of 1000 tokens per day.</a>
            </header>
            <Textarea
                id="resultTextBox"
                minRows={3}
                resizable
                value={textBoxValue}
                placeholder="Nothing to see here - yet!"
                readOnly
                sx={{mb: 1}}
            />
            <div>
                <br/>
                <div>
                    <Textarea
                        placeholder="Type your questions here!"
                        required
                        value={submittedText}
                        onChange={e => {
                            e.preventDefault();
                            setSubmittedText(e.target.value);
                        }}
                        sx={{mb: 1}}
                    />
                    <Button type="submit"
                            onClick={
                                handleButtonClick
                            }>Submit</Button>
                </div>
                <Button variant="contained"
                        onClick={() => {
                            navigateToUserSettings();
                        }}>
                    User Settings
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="contained"
                        onClick={() => {
                            performLogOut().then(() => navigateToRootScreen());
                        }}>
                    Log Out
                </Button>
            </div>
            <br/>
        </div>
    );
}

export default Chat;