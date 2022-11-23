import '../index.css'
import classes from "./Events.module.css";
import Card from '../components/ui/Card';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Modal/Backdrop';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../context/auth-context';
const EventsPage = () => {
    const authContext = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const titleRef = useRef();
    const dateRef = useRef();
    const descriptionRef = useRef();
    const priceRef = useRef();

    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        let requestBody;
        const token = authContext.authState.token;
        // eslint-disable-next-line
        requestBody = {
            // eslint-disable-next-line
            query: `
            query {
                events{
                    _id
                    title
                    description
                    date
                    price
                    creator{
                        email
                    }
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
                    // 'Authorization': 'Bearer ' + token,
                }
            });
            console.log(result);
            const resData = await result.json();
            console.log(resData);
            const eventsData = resData.data.events;
            setEvents(eventsData.map(event => {
                return <li className={classes.eventsListItem} key = {event._id}>{event.title}</li>;
            }))

        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const onCancel = () => {
        setShowModal(false);
    }

    const onConfirm = async () => {

        const title = titleRef.current.value;
        const price = +priceRef.current.value;
        const description = descriptionRef.current.value;
        const date = dateRef.current.value;

        if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }


        let requestBody;
        const token = authContext.authState.token;
        // eslint-disable-next-line
        requestBody = {
            // eslint-disable-next-line
            query: `
            mutation{
                createEvent(eventInput : {title : \"${title}\" , price : ${price} , description : \"${description}\" , date : \"${date}\"}){
                    title
                    description
                    creator{
                        email
                        createdEvents{
                            title
                            creator{
                                password
                            }
                        }
                    }
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
            console.log(result);
            const resData = await result.json();
            console.log(resData);
            fetchEvents();
        }
        catch (err) {
            console.log(err);
        }
        setShowModal(false);
    }

    const showModalHandler = () => {
        setShowModal(true);
    }

    return (

        <React.Fragment>
            {showModal && <Backdrop />}
            {showModal &&
                <Modal title="Add your event" canCancel={true} canConfirm={true} onCancel={onCancel} onConfirm={onConfirm}>
                    <form className='form'>
                        <div className='form-control'>
                            <label htmlFor='title'>Title</label>
                            <input type='text' id='title' ref={titleRef} />

                        </div>

                        <div className='form-control'>
                            <label htmlFor='price'>Price</label>
                            <input type='number' id='price' ref={priceRef} />

                        </div>
                        <div className='form-control'>
                            <label htmlFor='date'>Date</label>
                            <input type='datetime-local' id='date' ref={dateRef} />

                        </div>
                        <div className='form-control'>
                            <label htmlFor='description'>Description</label>
                            <textarea rows="4" id='description' ref={descriptionRef} />

                        </div>

                    </form>
                </Modal>
            }
            {authContext.authState.token && <div className={classes.eventControl}>

                <Card>
                    <p>Create your events by clicking here !</p>
                    <button className='btn' onClick={showModalHandler}>Create Event</button>
                </Card>


            </div>}
            <section>
                <ul className={classes.eventsList}>
                    {events}
                </ul>
            </section>
        </React.Fragment>

    );
};

export default EventsPage;