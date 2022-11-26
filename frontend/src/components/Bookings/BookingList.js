import classes from './BookingList.module.css';
import BookingListItem from "./BookingListItem.js/BookingListItem";

const BookingList = props => {

    return <ul className = {classes.bookingList} >
        {
            props.bookingList.map(booking => <BookingListItem date={booking.event.date} title={booking.event.title} bookingId={booking._id} onCancel = {props.onCancel}/>)
        }
    </ul>
}

export default BookingList;