import {Button} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import {updateAPIToken} from "./firebase";
import {useState} from "react";
import CustomTextField from "./CustomTextField";

/**
 @Author Kedar Abhyankar
 @Email krabhyankar@gmail.com
 */
function UserSettings() {

    let navigate = useNavigate();
    const [apiToken, setAPIToken] = useState('');


    function performAPITokenUpdate(){
        const res = updateAPIToken(apiToken);
        res.then(e => {
            if (e.code === 1) {
                navigateToUserHome()
            } else {
                alert(e.message);
            }
        });
    }

    const navigateToUserHome = () => {
        let path = "/Chat"
        navigate(path)
    }

    return (
        <div className="App">
            <div className="App-header">
                User Settings
            </div>

            <CustomTextField
                id={"api-token"}
                label={"API Token"}
                value={apiToken}
                onChange={(ev) => setAPIToken(ev.target.value)}/>
            <br/>
            <Button
                variant="contained"
                onClick={performAPITokenUpdate}>
                Submit Changes
            </Button>
        </div>
    );
}

export default UserSettings;