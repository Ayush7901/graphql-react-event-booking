import React, { useContext, useEffect, useState } from "react";
import BookingList from "../components/Bookings/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsTabs from "../components/Bookings/BookingsTabs/BookingsTabs";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";

const BookingsPage = () => {

    const [isLoading, setLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [displayTypeState, setDisplayType] = useState('list');
    const authContext = useContext(AuthContext);


    useEffect(() => {
        fetchBookings();
    }, []);

    const cancelBookingHandler = async bookingId => {
        setLoading(true);
        let requestBody;
        const token = authContext.authState.token;
        requestBody = {
            query: `
            mutation {
                cancelBooking(bookingId : "${bookingId}"){
                    title
                    description
                    date
                }
            }
            ` ,
        };
        try {
            const result = await fetch('http://localhost:3001/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            const resData = await result.json();
            // console.log(resData);
            const canceledEvent = resData.data.cancelBooking;
            console.log(canceledEvent);
            const bookingsData = [];

            bookings.map(booking => {
                if (booking._id !== bookingId) bookingsData.push(booking);
            });

            setBookings(bookingsData);



        }
        catch (err) {
            console.log(err);
            // throw new Error('Here is the issue');
        }
        setLoading(false);
    }

    const fetchBookings = async () => {
        setLoading(true);
        let requestBody;
        const token = authContext.authState.token;
        requestBody = {
            query: `
            query {
                bookings{
                    _id
                    event{
                        title
                        date
                        price
                    }
                    createdAt
                }
            }
            ` ,
        };
        try {
            const result = await fetch('http://localhost:3001/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            const resData = await result.json();
            // console.log(resData);
            const bookingsData = resData.data.bookings;

            setBookings(bookingsData.map(booking => {
                return booking;
            }));


        }
        catch (err) {
            console.log(err);
            // throw new Error('Here is the issue');
        }
        setLoading(false);
    }

    const displayTypeHandler = displayType => {
        if (displayType === 'list') {
            setDisplayType('list');
        }
        else {
            setDisplayType('chart');
        }
    }

    return (
        <div>
            {isLoading ? <Spinner />
                :
                <React.Fragment>
                    <BookingsTabs
                        displayTypeHandler={displayTypeHandler}
                        activeOutputType={displayTypeState}
                        bookings={bookings}
                    />
                    <div>
                        {displayTypeState === 'list' ?
                            <BookingList
                                bookingList={bookings}
                                onCancel={cancelBookingHandler}
                            /> :
                            <BookingsChart
                                bookings={bookings}
                            />
                        }
                    </div>
                </React.Fragment>
            }
        </div>
    );
};

export default BookingsPage;