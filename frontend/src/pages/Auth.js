// import { userQuery } from "react-query"
import { useRef, useState, useContext, useEffect } from "react";
// refs connect to our DOM elemnts and then we can listen to every keystroke to get the details/data required

import Card from "../components/ui/Card";
import AuthContext from "../context/auth-context";
import classes from './Auth.module.css';



const AuthPage = () => {
    const [isLogin, setLogin] = useState(true);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const [token, setToken] = useState(null);
    const [userId, setUserID] = useState(null);
    const switchHandler = () => {
        setLogin(!isLogin)
    }
    const authContext = useContext(AuthContext);
    useEffect(() => {
        authContext.login(token, userId);
        // eslint-disable-next-line
    }, [token, userId])

    async function submitHandler(event) {
        event.preventDefault();
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        // for reading we use refs
        // for showing we use states

        if (enteredEmail.trim().length === 0 || enteredPassword.trim().length === 0) {
            return;
        }
        let requestBody;

        requestBody = {
            query: isLogin ? `
            query{
                login(email :"${enteredEmail}",password : "${enteredPassword}"){
                  token
                  tokenExpiration
                  userId
                }
              }
            `: `
            mutation {
                createUser(userInput :{email : "${enteredEmail}", password : "${enteredPassword}"}){
                  _id
                  email
                }
              }
              
            ` ,
        };
        try {
            // if we directly send a request like this it fails we have to add few more headers according to CORS policy 
            const result = await fetch('http://localhost:3001/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(result);
            // if (result.status !== 200 || result.status !== 201) {
            //     throw new Error('There was some issue !');

            // }
            const resData = await result.json();
            console.log(resData);
            // if (resData.data.login.token) {
            //     this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
            // }
            setToken(resData.data.login.token)
            setUserID(resData.data.login.userId);
        }
        catch (err) {
            console.log(err);
        }
        // console.log(enteredEmail, enteredPassword)

    }

    return (
        <div className={classes.authcontent}>
            <Card>
                <form className={classes.form} onSubmit={submitHandler}>
                    <div className={classes.control}>
                        <label htmlFor='email'>Email</label>
                        <input type='text' required id='email' ref={emailInputRef} />
                    </div>
                    <div className={classes.control}>
                        <label htmlFor="password">
                            Password
                        </label>
                        <input type='text' required id='password' ref={passwordInputRef} />

                    </div>
                    <div className={classes.actions}>
                        <button className={classes.button} type="submit">Submit </button>
                        <button className={classes.button} type="button" onClick={switchHandler}>{isLogin ? "Sign up" : "Login"}  instead</button>
                    </div>
                </form>
            </Card>
        </div>

    );
};

export default AuthPage;