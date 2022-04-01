import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import Home from '../components/home/Home';
import WelcomePage from '../components/welcome-screen/WelcomePage';
import MenuForm from '../components/menu-item/MenuForm';
import NotFoundPage from '../components/error/NotFoundPage';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<WelcomePage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/home' element={<Home />} />
                <Route path='/menu/add' element={<MenuForm />} />
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
