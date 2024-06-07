import {useState} from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Button} from "@mui/material";
import {login, registerUser} from './firebase'
import {useNavigate} from 'react-router-dom'
import CustomTextField from "./CustomTextField";

/**
 @Author Kedar Abhyankar
 @Email krabhyankar@gmail.com
 */

function AuthFlow() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate()


    //Navigation to completeRegistration
    const navigateToRegistrationFlow = () => {
        let path = "/completeRegistration"
        navigate(path, {state: {email}})
    }

    //Navigation for Login
    const navigateToUserHome = () => {
        let path = "/chat"
        navigate(path, {state: {email}})
    }

    function performLogin() {
        const res = login(email, password);
        res.then(e => {
            if (e.code === 1) {
                navigateToUserHome()
            } else {
                alert("Couldn't login. Are you sure you've registered?");
            }
        });
    }

    function performRegisterUser() {
        const res = registerUser(email, password);
        res.then(e => {
            if (e.code === 1) {
                //registered successfully
                navigateToRegistrationFlow()
            } else {
                alert(e.message);
            }
        });
    }
    return (
        <div className="App">
            <header className="App-header">
                <p> Please sign in below. If it's your first time here, then select register.</p>
                <br/>
                <CustomTextField
                    id={"email-field"}
                    label={"Email Address"}
                    value={email}
                    type={"email"}
                    onChange={(ev) => setEmail(ev.target.value)}
                />
                <br/>
                <CustomTextField
                    id={"password=field"}
                    label={"Password"}
                    value={password}
                    type={"password"}
                    onChange={(ev) => setPassword(ev.target.value)}/>
                <br/>
                <div>
                    <Button
                        variant="contained"
                        onClick={performLogin}>
                        Login
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button
                        variant="contained"
                        onClick={performRegisterUser}>
                        Register
                    </Button>
                </div>
            </header>
        </div>
    );
}

export default AuthFlow;