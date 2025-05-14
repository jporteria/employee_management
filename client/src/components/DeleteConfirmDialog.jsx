import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

// Confirmation dialog for deleting an employee
const DeleteConfirmDialog = ({
  visible,    // Controls dialog visibility
  onHide,     // Function to hide the dialog
  onConfirm,  // Function to confirm deletion
  employee,   // The employee object to be deleted
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
          <Button
            label="No"
            icon="pi pi-times"
            className="p-button-text"
            onClick={onHide} // Cancel deletion
          />
          <Button
            label="Yes"
            icon="pi pi-check"
            className="p-button-text"
            onClick={onConfirm} // Confirm deletion
          />
        </>
      }
      onHide={onHide} // Called when dialog is dismissed
    >
      <div className="confirmation-content flex items-center">
        {/* Warning icon and confirmation message */}
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
