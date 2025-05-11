import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { initialEmployee, requiredFields } from "../constants/employeeFields";

const EmployeeForm = ({ currentEmployee, setCurrentEmployee }) => {
  return (
    <div className="p-fluid grid">
      {Object.keys(initialEmployee).map((key) => (
        <div key={key} className="col-12 md:col-6 mb-3">
          <label htmlFor={key} className="block mb-1 capitalize">
            {key.replace(/_/g, " ").replace(/([A-Z])/g, " $1")}
            {requiredFields.includes(key) && (
              <span style={{ color: "red", marginLeft: "4px" }}>*</span>
            )}
          </label>

          {key === "birthday" || key === "date_hired" ? (
            <Calendar
              showIcon
              icon="pi pi-calendar"
              id={key}
              value={
                currentEmployee[key]
                  ? new Date(currentEmployee[key])
                  : undefined
              }
              onChange={(e) => {
                const selectedDate = e.value;
                const normalizedDate = selectedDate
                  ? new Date(selectedDate).toISOString().split("T")[0]
                  : null;

                setCurrentEmployee({
                  ...currentEmployee,
                  [key]: normalizedDate,
                });
              }}
              dateFormat="yy-mm-dd"
            />
          ) : (
            <InputText
              id={key}
              value={currentEmployee[key] || ""}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  [key]: e.target.value,
                })
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default EmployeeForm;
