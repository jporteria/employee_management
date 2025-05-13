import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { initialEmployee, requiredFields } from "../constants/employeeFields";

const EmployeeForm = ({
  currentEmployee,
  setCurrentEmployee,
  visible,
  onHide,
  footer,
  isEdit,
}) => {
  const [errors, setErrors] = useState({});

  const validateField = (key, value) => {
    if (key === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    }
  };

  return (
    <Dialog
      closeIcon="pi pi-times"
      visible={visible}
      style={{ width: "80vw", maxHeight: "80vh" }}
      header={isEdit ? "Edit Employee" : "New Employee"}
      modal
      footer={footer}
      onHide={onHide}
    >
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
              <>
                <InputText
                  id={key}
                  value={currentEmployee[key] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCurrentEmployee({
                      ...currentEmployee,
                      [key]: value,
                    });
                    if (key === "email") {
                      validateField(key, value);
                    }
                  }}
                  className={errors[key] ? "p-invalid" : ""}
                />
                {errors[key] && (
                  <small className="p-error">{errors[key]}</small>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default EmployeeForm;
