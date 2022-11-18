// import { userQuery } from "react-query"
import { useRef, useState } from "react";
// refs connect to our DOM elemnts and then we can listen to every keystroke to get the details/data required

import Card from "../components/ui/Card";
import classes from './Auth.module.css'


const AuthPage = () => {
    const [isLogin, setLogin] = useState(true);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const switchHandler = () => {
        setLogin(!isLogin)
    }

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
            mutation {
                createUser(userInput :{email : "${enteredEmail}", password : "${enteredPassword}"}){
                  _id
                  email
                }
              }
              
            ` : `
            query{
                login(email :"${enteredEmail}",password : "${enteredPassword}"){
                  token
                  tokenExpiration
                  userId
                }
              }
            `,
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

        }
        catch (err) {
            console.log(err);
        }
        // console.log(enteredEmail, enteredPassword)

    }

    return (
        <div className={classes.authcontent}>
            <Card>
                <form className={classes.from} onSubmit={submitHandler}>
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
                        <button className={classes.button} type="button" onClick={switchHandler}>{isLogin ? "Login" : "Sign up"}  instead</button>
                    </div>
                </form>
            </Card>
        </div>

    );
};

export default AuthPage;