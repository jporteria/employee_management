import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const DeleteConfirmDialog = ({
  visible,
  onHide,
  onConfirm,
  employee,
}) => {
  return (
    <Dialog
      closeIcon="pi pi-times"
      visible={visible}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirm"
      modal
      footer={
        <>
          <Button label="No" icon="pi pi-times" className="p-button-text" onClick={onHide} />
          <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={onConfirm} />
        </>
      }
      onHide={onHide}
    >
      <div className="confirmation-content flex items-center">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
        {employee && (
          <span>
            Are you sure you want to delete <b>{employee.first_name} {employee.last_name}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
