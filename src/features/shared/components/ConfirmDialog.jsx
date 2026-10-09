import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  loading = false,
}) => (
  <Modal open={open} onClose={loading ? () => {} : onClose} title={title} description={description} size="sm">
    <div className="flex justify-end gap-2">
      <Button variant="secondary" onClick={onClose} disabled={loading} data-autofocus>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>
        {confirmText}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
