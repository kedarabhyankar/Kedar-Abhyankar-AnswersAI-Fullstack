import {Routes, Route, BrowserRouter} from 'react-router-dom'
import CompleteRegistration from "./CompleteRegistration";
import Home from './Home.js';
import AuthFlow from './AuthFlow';
import Chat from './Chat';

function Root() {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/authFlow" element={<AuthFlow/>}/>
                <Route exact path="/chat" element={<Chat/>}/>
                <Route exact path="/completeRegistration" element={<CompleteRegistration/>}/>
            </Routes>
        </div>
    );
}

export default Root;