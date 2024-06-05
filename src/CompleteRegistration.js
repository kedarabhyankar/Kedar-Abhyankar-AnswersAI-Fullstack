import {useState} from "react";
import {Button, FormControl, FormHelperText, TextField} from "@mui/material";
import {completeRegistration, login} from "./firebase";
import {useNavigate, useLocation} from 'react-router-dom'

function CompleteRegistration() {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [apiToken, setAPIToken] = useState('')
    let navigate = useNavigate();

    const navigateToUserHome = () => {
        let path = "/Chat"
        navigate(path)
    }

    const { state } = useLocation();


    return (
        <div className="App">
            <header className="App-header">
                <a>Let's complete registration.</a>
                <br/>
                <TextField
                    required
                    id="firstname-field"
                    inputProps={{
                        style: {
                            color: "white"
                        }
                    }}
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(ev) => setFirstName(ev.target.value)}/>
                <br/>
                <TextField
                    required
                    id="lastname-field"
                    inputProps={{
                        style: {
                            color: "white"
                        }
                    }}
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(ev) => setLastName(ev.target.value)}/>
                <br/>
                <TextField
                    id="apitoken-field"
                    inputProps={{
                        style: {
                            color: "white"
                        }
                    }}
                    label="OpenAI API Token"
                    variant="outlined"
                    value={apiToken}
                    onChange={(ev) => setAPIToken(ev.target.value)}/>
                <FormHelperText>
                    While you don't need an openAI API Token to register, in order to use this
                    application, you will
                    need to set one prior to using the tool. You can get a token from the OpenAI API
                    Website.
                </FormHelperText>
                <Button
                    variant="contained"
                    onClick={() => {
                        const email = state.email;
                        const res = completeRegistration(email, firstName, lastName, apiToken);
                        res.then(e => {
                            if (e.code === 1) {
                                navigateToUserHome()
                            } else {
                                alert(e.message);
                            }
                        });
                    }}>
                    Complete Registration
                </Button>
            </header>
        </div>
    );
}

export default CompleteRegistration;