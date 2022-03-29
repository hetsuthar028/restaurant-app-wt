import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import WelcomePage from '../components/welcome-screen/WelcomePage';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<WelcomePage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
