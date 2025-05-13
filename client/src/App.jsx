import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import axios from "axios";
import "./App.css";
// import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { initialEmployee } from "./constants/employeeFields";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";

const PayrollDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(initialEmployee);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [activityDialogVisible, setActivityDialogVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    "e_id",
    "last_name",
    "first_name",
    "middle_name",
    "position",
    "province",
  ]);

  const toastRef = useRef(null);
  const dt = useRef(null);

  const logActivity = (action, employee) => {
    const timestamp = new Date().toLocaleString();
    const message = `${action} - ${employee.first_name} ${employee.last_name} (Employee ID: ${employee.e_id}) at ${timestamp}`;

    setActivityLog((prev) => [message, ...prev]);
  };

  const applyTheme = (themeName) => {
    let themeLink = document.getElementById("theme-link");

    const themeHref = `https://unpkg.com/primereact/resources/themes/${themeName}/theme.css`;

    if (themeLink) {
      themeLink.href = themeHref;
    } else {
      themeLink = document.createElement("link");
      themeLink.rel = "stylesheet";
      themeLink.id = "theme-link";
      themeLink.href = themeHref;
      document.head.appendChild(themeLink);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newTheme = isDarkMode
      ? "bootstrap4-light-blue"
      : "bootstrap4-dark-blue";
    applyTheme(newTheme);
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
  };

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isSavedDark = savedTheme === "bootstrap4-dark-blue";

    if (savedTheme) {
      applyTheme(savedTheme);
      setIsDarkMode(isSavedDark);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const defaultTheme = prefersDark
        ? "bootstrap4-dark-blue"
        : "bootstrap4-light-blue";
      applyTheme(defaultTheme);
      setIsDarkMode(prefersDark);
      localStorage.setItem("theme", defaultTheme);
    }

    fetchEmployees();
  }, []);

  const openNew = () => {
    setCurrentEmployee(initialEmployee);
    setIsEdit(false);
    setEmployeeDialog(true);
  };

  const hideDialog = () => {
    setEmployeeDialog(false);
  };

  const saveEmployee = async () => {
    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/employees/${currentEmployee.id}`,
          currentEmployee
        );
        logActivity("Updated", currentEmployee);
        toastRef.current.show({
          severity: "success",
          summary: "Updated",
          detail: "Employee updated",
        });
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/employees",
          currentEmployee
        );
        logActivity("Added", res.data);
        toastRef.current.show({
          severity: "success",
          summary: "Added",
          detail: "Employee added",
        });
      }
      setEmployeeDialog(false);
      fetchEmployees();
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.error,
      });
      console.log(error);
    }
    console.log(activityLog);
  };

  const editEmployee = (employee) => {
    setCurrentEmployee({ ...employee });
    setIsEdit(true);
    setEmployeeDialog(true);
  };

  const promptDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteEmployeeDialog(true);
  };

  const confirmDeleteEmployee = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/employees/${employeeToDelete.id}`
      );
      setDeleteEmployeeDialog(false);
      fetchEmployees();
      logActivity("Deleted", employeeToDelete);
      toastRef.current.show({
        severity: "success",
        summary: "Deleted",
        detail: "Employee deleted",
      });
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete employee",
      });
      console.log(error);
    }
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const employeeDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveEmployee}
      />
    </>
  );

  return (
    <div className="w-[99vw] h-[100vh] px-5">
      <Toast ref={toastRef} />
      <div className="flex items-center my-3 max-md:flex-col">
        <h2 className="text-2xl whitespace-nowrap mr-5 max-md:mb-5">
          Master - Employee
        </h2>
        <div className="flex w-full justify-between gap-2">
          <Button
            raised
            style={{ background: "#77dd77" }}
            label="Add Employee"
            icon="pi pi-plus"
            onClick={openNew}
          />
          <Button
            style={{ background: "var(--primary-color)" }}
            raised
            label="Export"
            icon="pi pi-upload"
            onClick={() => exportCSV(false)}
          />
          <Button
            label={isDarkMode ? "Light Mode" : "Dark Mode"}
            icon={isDarkMode ? "pi pi-sun" : "pi pi-moon"}
            onClick={toggleTheme}
            raised
            style={isDarkMode ? {} : { background: "black" }}
          />
          <Button
            icon="pi pi-clock"
            label="Activity Log"
            raised
            onClick={() => setActivityDialogVisible(true)}
          />
        </div>
      </div>

      <div>
        <EmployeeTable
          dt={dt}
          employees={employees}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          editEmployee={editEmployee}
          promptDeleteEmployee={promptDeleteEmployee}
        />
      </div>

      <Dialog
        closeIcon="pi pi-times"
        visible={employeeDialog}
        style={{ width: "80vw", maxHeight: "80vh" }}
        header={isEdit ? "Edit Employee" : "New Employee"}
        modal
        footer={employeeDialogFooter}
        onHide={hideDialog}
      >
        <EmployeeForm
          currentEmployee={currentEmployee}
          setCurrentEmployee={setCurrentEmployee}
        />
      </Dialog>

      <DeleteConfirmDialog
        visible={deleteEmployeeDialog}
        onHide={() => setDeleteEmployeeDialog(false)}
        onConfirm={confirmDeleteEmployee}
        employee={employeeToDelete}
      />

      {/* activity dialog */}
      <Dialog
        header="Activity Log"
        visible={activityDialogVisible}
        style={{ width: "40vw" }}
        modal
        onHide={() => setActivityDialogVisible(false)}
      >
        <div className="p-fluid">
          {activityLog.length === 0 ? (
            <p className="text-500">No activity yet.</p>
          ) : (
            <ul className="m-0 p-0 list-none max-h-60 overflow-y-auto">
              {activityLog.map((log, index) => (
                <li key={index} className="mb-2 border-bottom-1 pb-2">
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default PayrollDashboard;
