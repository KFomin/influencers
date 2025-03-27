import React from 'react';
import {BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';
import InfluencerList from './components/influencer-list/InfluencerList';
import InfluencerForm from './components/influencer-form/InfluencerForm';
import logo from './assets/logo.svg'
import './App.css'

function App() {
    return (
        <div className={"app"}>
            <Router>
                <NavLink to='/'>
                    <img className={"app-logo"} src={logo} alt="logo"/>
                </NavLink>
                <Routes>
                    <Route path="/" element={<InfluencerList/>}/>
                    <Route path="influencer" element={<InfluencerForm/>}/>
                    <Route path="influencer/:nicknameParam" element={<InfluencerForm/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
