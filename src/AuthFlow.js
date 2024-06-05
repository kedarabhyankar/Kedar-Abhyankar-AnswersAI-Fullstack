import {useState} from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Button, TextField} from "@mui/material";
import {login, registerUser} from './firebase'
import {useNavigate} from 'react-router-dom'

function AuthFlow() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    let navigate = useNavigate()

    const navigateToRegistrationFlow = () => {
        let path = "/completeRegistration"
        navigate(path, { state: {email}})
    }

    const navigateToUserHome = () => {
        let path = "/chat"
        navigate(path, { state: {email}})
    }
    return (
        <div className="App">
            <header className="App-header">
                <a> Please sign in below. If it's your first time here, then select register.</a>
                <br/>
                <TextField
                    required
                    id="email-field"
                    inputProps={{
                        style: {
                            color: "white"
                        }
                    }}
                    label="Email Address"
                    variant="outlined"
                    value={email}
                    type="email"
                    onChange={(ev) => setEmail(ev.target.value)}/>
                <br/>
                <TextField
                    required
                    id="email-field"
                    inputProps={{
                        style: {
                            color: "white"
                        }
                    }}
                    label="Password"
                    variant="outlined"
                    value={password}
                    type="password"
                    onChange={(ev) => setPassword(ev.target.value)}/>
                <br/>
                <div>
                    <Button
                        variant="contained"
                        onClick={() => {
                            const res = login(email, password);
                            res.then(e => {
                                if (e.code === 1) {
                                    navigateToUserHome()
                                } else {
                                    alert(e.message);
                                }
                            });
                        }}>
                        Login
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button
                        variant="contained"
                        onClick={() => {
                            const res = registerUser(email, password);
                            res.then(e => {
                                if (e.code === 1) {
                                    //registered successfully
                                    navigateToRegistrationFlow()
                                } else {
                                    alert(e.message);
                                }
                            });
                        }}>
                        Register
                    </Button>
                </div>
            </header>
        </div>
    );
}

export default AuthFlow;