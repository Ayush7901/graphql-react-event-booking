import classes from './EventList.module.css';
import EventListItem from './EventListItem/EventListItem';

const EventList = (props) => {
    const events = props.events.map(event => {
        return <EventListItem 
        title={event.title} 
        eventId = {event._id} 
        userId = {props.authUserId}
        price = {event.price}
        date = {event.date}
        creatorId = {event.creator._id}
        viewDetail = {props.onViewDetail}
        />;
    })

    return <ul className={classes.eventsList}>{events}</ul>;
}

export default EventList;