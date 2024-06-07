import {Button, TextField} from "@mui/material";
import {completeRegistration} from "./firebase";
import {useLocation, useNavigate} from 'react-router-dom';
import {updateAPIToken} from "./firebase";
import {useState} from "react";

function UserSettings() {

    let navigate = useNavigate();
    const [apiToken, setAPIToken] = useState('');


    const navigateToUserHome = () => {
        let path = "/Chat"
        navigate(path)
    }

    return (
        <div className="App">
            <div className="App-header">
                User Settings
            </div>

            <TextField
                required
                id="email-field"
                inputProps={{
                    style: {
                        color: "white"
                    }
                }}
                label="API Token"
                variant="outlined"
                value={apiToken}
                onChange={(ev) => setAPIToken(ev.target.value)}/>
            <br/>
            <Button
                variant="contained"
                onClick={() => {
                    const res = updateAPIToken(apiToken);
                    res.then(e => {
                        if (e.code === 1) {
                            navigateToUserHome()
                        } else {
                            alert(e.message);
                        }
                    });
                }}>
                Submit Changes
            </Button>
        </div>
    );
}

export default UserSettings;