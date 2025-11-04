interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ 
    open, 
    title, 
    message, 
    onConfirm, 
    onCancel 
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <>
            <div className="modal d-block" tabIndex={-1} role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" onClick={onCancel}></button>
                        </div>
                        <div className="modal-body">
                            <p>{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onCancel}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger" onClick={onConfirm}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}