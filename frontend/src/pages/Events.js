import '../index.css'
import classes from "./Events.module.css";
import Card from '../components/ui/Card';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Modal/Backdrop';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList';
import Spinner from '../components/Spinner/Spinner';
import dateformat from 'dateformat'
const EventsPage = () => {
    const authContext = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [selectedEvent, setEvent] = useState(null);
    const titleRef = useRef();
    const dateRef = useRef();
    const descriptionRef = useRef();
    const priceRef = useRef();

    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        setLoading(true);
        let requestBody;
        requestBody = {
            query: `
            query {
                events{
                    _id
                    title
                    description
                    date
                    price
                    creator{
                        _id
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
                }
            });
            const resData = await result.json();
            const eventsData = resData.data.events;
            setEvents(eventsData.map(event => {
                return event;
            }));


        }
        catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const showDetailHandler = eventId => {
        const event = events.find(e =>
            (e._id === eventId)
        );
        setEvent(event);

    }

    const onCancel = () => {
        setShowModal(false);
        setEvent(null);
    }

    const bookingHandler = async () => {
        let requestBody;
        const token = authContext.authState.token;
        requestBody = {
            query: `
            mutation{
                bookEvent(eventId : "${selectedEvent._id}"){
                    _id
                    createdAt
                    updatedAt
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
            const bookingData = resData.data.bookEvent;
            console.log(bookingData);
        }
        catch (err) {
            console.log(err);
        }


        setShowModal(false);
        setEvent(null);
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
        requestBody = {
            query: `
            mutation{
                createEvent(eventInput : {title : "${title}" , price : ${price} , description : "${description}" , date : "${date}"}){
                    title
                    description
                    _id
                    price
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
            const eventData = resData.data.createEvent;
            const event = {
                title: eventData.title,
                price: eventData.price,
                date: eventData.date,
                description: eventData.description,
                _id: eventData._id,
                creator: {
                    _id: authContext.authState.userId,
                }
            }
            const eventList = [];
            events.map(event => eventList.push(event));
            eventList.push(event);
            setEvents(eventList);
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
            {(showModal || selectedEvent) && <Backdrop />}
            {showModal &&
                <Modal title="Add your event" canCancel={true} canConfirm={true} onCancel={onCancel} onConfirm={onConfirm} confirmText="Confirm" >
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
            {
                selectedEvent &&
                <Modal title={selectedEvent.title} onCancel={onCancel} canCancel={true} canConfirm={true} onConfirm={bookingHandler} confirmText="Book" >
                    <h1>{selectedEvent.title}</h1>
                    <h2>${selectedEvent.price} </h2> - <h2>{dateformat(new Date(selectedEvent.date))}</h2>
                    <p>{selectedEvent.description}</p>
                </Modal>

            }
            <section>
                {
                    isLoading ? <Spinner />
                        :
                        <EventList events={events} authUserId={authContext.authState.userId} onViewDetail={showDetailHandler} />
                }

            </section>
        </React.Fragment>

    );
};

export default EventsPage;