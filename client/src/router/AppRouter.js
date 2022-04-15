import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from '../components/welcome-screen/WelcomePage';
const Home = React.lazy(() => import('../components/home/Home'));
const Login = React.lazy(() => import('../components/auth/Login'));
const SignUp = React.lazy(() => import('../components/auth/SignUp'));
const MenuForm = React.lazy(() => import('../components/menu-item/MenuForm'));
const NotFoundPage = React.lazy(() => import('../components/error/NotFoundPage'));

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
