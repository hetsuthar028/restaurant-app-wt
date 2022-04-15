import axios from 'axios';
import React, { useState, useEffect } from 'react';

export const AppContext = React.createContext();

export const AppProvider = (props) => {

    const [currentUser, setCurrentUser] = useState(null);

    const fetchCurrentUser = () => {
        axios.get(`http://localhost:5001/user/auth/currentuser`, {
            headers: {
                authorization: JSON.stringify(window.localStorage.getItem('bearer')),
            }
        })
        .then((response) => {
            console.log("Fetch user request", response.data.user);
            setCurrentUser(response.data.user);
        })
        .catch((error) => {
            console.log("Error in fetching currentUser in AppContext:", error?.response);
        })
    }

    useEffect(() => {
        // console.log("Current user", currentUser);
        // fetchCurrentUser();
        // console.log("Context called");
    }, []);

    return (
        <AppContext.Provider value={{currentUser: currentUser}}>
            {props.children}
        </AppContext.Provider>
    )
}