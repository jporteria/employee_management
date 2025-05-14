import { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { initialEmployee, requiredFields } from "../constants/employeeFields";

const EmployeeForm = ({
  currentEmployee,    // Object representing the employee being created or edited
  setCurrentEmployee, // Function to update the current employee state
  visible,            // Control the visibility of the form dialog
  onHide,             // Function to close the Dialog
  isEdit,             // Indicate whether the form is in edit mode
  onSave,             // Save employee data
}) => {
  const [errors, setErrors] = useState({});
  const inputRefs = useRef({});

  // Validate a single field (used during typing)
  const validateField = (key, value) => {
    let message = "";

    if (requiredFields.includes(key) && !value?.trim()) {
      message = "This field is required";
    }

    if (key === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        message = "Invalid email address";
      }
    }

    return message;
  };

  // Validate all fields on Save
  const validateAllFields = () => {
    const newErrors = {};
    for (const key of Object.keys(initialEmployee)) {
      const value = currentEmployee[key];
      const errorMessage = validateField(key, value);
      if (errorMessage) {
        newErrors[key] = errorMessage;
      }
    }
    setErrors(newErrors);

    // Auto focus first invalid input
    if (Object.keys(newErrors).length > 0) {
      const firstInvalidKey = Object.keys(newErrors)[0];
      inputRefs.current[firstInvalidKey]?.focus?.();
    }

    return Object.keys(newErrors).length === 0;
  };

  // Handle input change and validate that single field
  const handleChange = (key, value) => {
    setCurrentEmployee((prev) => ({
      ...prev,
      [key]: value,
    }));

    const errorMessage = validateField(key, value);
    setErrors((prev) => ({
      ...prev,
      [key]: errorMessage,
    }));
  };

  // Save button click
  const handleSaveClick = () => {
    const isValid = validateAllFields();
    if (isValid) {
      onSave(); // Only call save if form is valid
    }
  };

  // Footer inside the component
  const dialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHide}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={handleSaveClick}
      />
    </>
  );

  return (
    <Dialog
      closeIcon="pi pi-times"
      visible={visible}
      style={{ width: "80vw", maxHeight: "80vh" }}
      header={isEdit ? "Edit Employee" : "New Employee"}
      modal
      footer={dialogFooter}
      onHide={() => {
        setErrors({});
        onHide();
      }}
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
                icon="pi pi-calendar"
                showIcon
                id={key}
                value={
                  currentEmployee[key] ? new Date(currentEmployee[key]) : null
                }
                onChange={(e) => {
                  const selectedDate = e.value;
                  const iso = selectedDate
                    ? new Date(selectedDate).toISOString().split("T")[0]
                    : "";
                  handleChange(key, iso);
                }}
                dateFormat="yy-mm-dd"
                className={errors[key] ? "p-invalid" : ""}
                inputRef={(el) => (inputRefs.current[key] = el?.inputElement)}
              />
            ) : (
              <InputText
                id={key}
                value={currentEmployee[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className={errors[key] ? "p-invalid" : ""}
                ref={(el) => (inputRefs.current[key] = el)}
              />
            )}

            {errors[key] && <small className="p-error">{errors[key]}</small>}
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default EmployeeForm;
