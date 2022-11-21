import '../index.css'
import classes from "./Events.module.css";
import Card from '../components/ui/Card';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Modal/Backdrop';
import React, { useState } from 'react';
const EventsPage = () => {
    const [showModal, setShowModal] = useState(false);

    const onCancel = () => {
        setShowModal(false);
    }

    const onConfirm = () => {
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
                    <p>Modal Content</p>
                </Modal>
            }
            <div className={classes.eventControl}>

                <Card>
                    <p>Create your events by clicking here !</p>
                    <button className='btn' onClick={showModalHandler}>Create Event</button>
                </Card>


            </div>
        </React.Fragment>

    );
};

export default EventsPage;