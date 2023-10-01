import { forwardRef } from 'react';
import './Modal.css';

const Modal = forwardRef(function Modal ({ handleRestart }, ref) {
    return (
        <div className="modal-bg " >
            <div className='modal' >
                <div className='modal-content' >
                    You completed it in <string>{ref?.current}</string> moves
                    <div className='restart-btn' >
                        <div className='btn' onClick={handleRestart} >Restart</div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Modal;