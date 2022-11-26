import classes from './BookingListItem.module.css';

const BookingListItem = props => {
    return <li key={props.bookingId} className={classes.bookingListItem}>
        <div>
            {props.title} - {new Date(props.date).toLocaleDateString()}
        </div>
        <div>
            <button className='btn' onClick={props.onCancel.bind(this, props.bookingId)}>Cancel</button>
        </div>
    </li>
}

export default BookingListItem;