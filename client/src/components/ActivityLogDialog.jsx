import { Dialog } from "primereact/dialog";

// Component to display a modal dialog with a list of activity logs
const ActivityLogDialog = ({ visible, onHide, logs }) => {
  return (
    <Dialog
      header="Activity Log"
      closeIcon="pi pi-times"
      visible={visible}
      style={{ width: "45vw", height: "60vh" }}
      modal
      onHide={onHide}
    >
      <div className="p-fluid">
        {logs.length === 0 ? (
          <p className="text-500">No activity yet.</p>
        ) : (
          <ul className="m-0 p-0 list-none overflow-y-auto">
            {logs.map((log, index) => (
              <li key={index} className="mb-2 border-bottom-1 pb-2">
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  );
};

export default ActivityLogDialog;
