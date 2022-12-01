import classes from './BookingsTabs.module.css';

const BookingsTabs = props => {

    

    return (
        <div className={classes.bookingsControl} >
            <button className={props.activeOutputType === 'list' ? 'active' : ''} onClick={props.displayTypeHandler.bind(this, 'list')}>List</button>
            <button className={props.activeOutputType === 'chart' ? 'active' : ''} onClick={props.displayTypeHandler.bind(this, 'chart')} >Chart</button>
        </div>
    );

}

export default BookingsTabs;