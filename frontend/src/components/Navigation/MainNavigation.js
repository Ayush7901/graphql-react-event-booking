import { NavLink } from "react-router-dom"; // doesn't allow to send another page request but captures the click and renders the dom required
import './MainNavigation.css'
import AuthContext from "../../context/auth-context";
import { useContext } from "react";

const MainNavigation = props => {
    const authContext = useContext(AuthContext);
    // console.log(authContext);
    return (
        <header className="main-navigation">
            <div className="main-naviagtion_logo" >
                <h1>EventFull your bookings place !</h1>
            </div>
            <div className="main-navigation_items" >
                <ul>
                    {!authContext.authState.token && <li>
                        <NavLink to="/auth">Login</NavLink>
                    </li>}
                    <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>
                    {authContext.authState.token && <li>
                        <NavLink to="/bookings">Bookings</NavLink>
                    </li>}

                </ul>
            </div>
        </header>


    );
}
export default MainNavigation;