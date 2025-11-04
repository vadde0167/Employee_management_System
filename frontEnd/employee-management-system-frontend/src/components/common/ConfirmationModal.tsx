import './ConfirmationModal.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel 
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button 
                        onClick={onCancel}
                        className="modal-button cancel"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="modal-button confirm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}