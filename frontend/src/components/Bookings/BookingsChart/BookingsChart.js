import { Bar as BarChart } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import Spinner from '../../Spinner/Spinner';
import classes from './BookingsChart.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Bookings Analysis',
        },
    },
};



const BookingsChart = props => {
    const [isLoading, setLoading] = useState(true);
    const [bookingChartData, setBookingChartData] = useState({ labels: [], datasets: [] })
    const prepareChartData = () => {
        setLoading(true);
        const BOOKING_BUCKETS = {
            Cheap: {
                min: 0,
                max: 100
            },
            Normal: {
                min: 100,
                max: 200
            },
            Expensive: {
                min: 200,
                max: 10000000
            }
        };
        const labels = [];


        const bookingChartData = {};
        for (const bucket in BOOKING_BUCKETS) {
            labels.push(bucket);
            const filterdBookingsCount = props.bookings.reduce((prev, curr) => {
                if (curr.event.price < BOOKING_BUCKETS[bucket].max && curr.event.price > BOOKING_BUCKETS[bucket].min) {
                    return prev + 1;
                }
                else return prev;
            }, 0);

            bookingChartData[bucket] = filterdBookingsCount;
        }

        const data = {
            labels,
            datasets: [
                {
                    label: 'Number of Events',
                    data: labels.map((label) => {
                        // console.log(label);
                        return bookingChartData[label];
                    }),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
        };


        console.log(data);
        setBookingChartData(data);
        setLoading(false);
    }
    useEffect(() => {
        prepareChartData();
    }, [])


    return (
        <div className={classes.bookingChart}>
            {isLoading ? <Spinner /> : <BarChart options={options} data={bookingChartData} />}
        </div>
    );
}



export default BookingsChart;