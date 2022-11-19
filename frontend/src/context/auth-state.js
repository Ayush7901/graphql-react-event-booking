import { useState } from "react";
import AuthContext from "./auth-context";

const AuthState = (props) => {
    const [authState, setAuthState] = useState({
        token: null,
        userId: null,
    });

    function login(token, userId, tokenExpiration) {
        setAuthState(
            {
                token: token,
                userId: userId
            }
        )
    }

    function logout() {
        setAuthState(
            {
                token: null,
                userId: null
            }
        )
    }


    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthState;