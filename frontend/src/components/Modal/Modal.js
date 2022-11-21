import '../../index.css'
import classes from './Modal.module.css'

const Modal = props => (
    <div className={classes.modal}>
        <header className={classes.modalHeader}>{props.title}</header>
        <section className={classes.modalContent}>
            {props.children}
        </section>
        <section className={classes.modalActions}>
            {props.canConfirm && <button className='btn' onClick={props.onConfirm}>Confirm</button>}
            {props.canCancel && <button className='btn' onClick={props.onCancel}>Cancel</button>}
        </section>
    </div>
);

export default Modal;