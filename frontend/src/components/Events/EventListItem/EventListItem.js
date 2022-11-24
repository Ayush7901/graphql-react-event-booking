import classes from './EventListItem.module.css';
import '../../../index.css'

const EventListItem = (props) => {
    return <li className={classes.eventsListItem} key={props.eventId}>
        <div>
            <h1>{props.title}</h1>
            <h2>{props.price}$</h2>
        </div>
        <div>
            {props.userId !== props.creatorId && <button className='btn' onClick={props.viewDetail.bind(this, props.eventId)} >View Details</button>}
            {props.userId === props.creatorId && <p>You are the owner of this event!</p>}
        </div>
    </li>
}

export default EventListItem;