import {Routes, Route, BrowserRouter} from 'react-router-dom'
import CompleteRegistration from "./CompleteRegistration";
import Home from './Home.js';
import AuthFlow from './AuthFlow';
import Chat from './Chat';
import UserSettings from './UserSettings';
import './App.css'

function Root() {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/authFlow" element={<AuthFlow/>}/>
                <Route exact path="/chat" element={<Chat/>}/>
                <Route exact path="/completeRegistration" element={<CompleteRegistration/>}/>
                <Route exact path="/userSettings" element={<UserSettings/>}/>
            </Routes>
        </div>
    );
}

export default Root;