import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import InfluencerList from './components/InfluencerList';
import InfluencerForm from './components/InfluencerForm';

function App() {
    return (
        <div className="App">
            <h1>Influencer Management</h1>
            <Router>
                <Routes>
                    <Route path="/" element={<InfluencerList/>}/>
                    <Route path="influencer" element={<InfluencerForm/>}/>
                    <Route path="influencer/:nickname" element={<InfluencerForm/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
