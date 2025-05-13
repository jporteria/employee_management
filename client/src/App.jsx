import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
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
import ActivityLogDialog from "./components/ActivityLogDialog";

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

  const fetchActivityLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/activity-logs");
      const formatted = res.data.map((log) => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        return `${log.action.toUpperCase()} - ${
          log.description
        } at ${timestamp}`;
      });
      setActivityLog(formatted);
    } catch (error) {
      console.error("Failed to fetch activity logs", error);
    }
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
    fetchActivityLogs();
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
        fetchActivityLogs();
        toastRef.current.show({
          severity: "success",
          summary: "Updated",
          detail: "Employee updated",
        });
      } else {
        await axios.post(
          "http://localhost:5000/api/employees",
          currentEmployee
        );
        fetchActivityLogs();
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
      fetchActivityLogs();
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
            style={{ background: "#77dd77", color: "black" }}
            label="Add Employee"
            icon="pi pi-plus"
            onClick={openNew}
          />
          <div className="flex gap-2 items-center">
            <Button
              style={{ background: "#e0f7fa", color: "black" }}
              label="Export to CSV"
              icon="pi pi-upload"
              onClick={() => exportCSV(false)}
            />
            <Button
              icon="pi pi-clock"
              style={{ background: "#fff3cd", color: "black" }}
              label="Activity Log"
              onClick={() => setActivityDialogVisible(true)}
            />
            <SelectButton
              value={isDarkMode ? "Dark" : "Light"}
              options={["Light", "Dark"]}
              onChange={(e) => {
                const selected = e.value === "Dark";
                if (selected !== isDarkMode) toggleTheme();
              }}
              itemTemplate={(option) => (
                <i
                  className={`pi ${option === "Dark" ? "pi-moon" : "pi-sun"}`}
                />
              )}
              // className="p-button-rounded"
              className="theme-toggle-button"
              tooltip="Toggle Theme"
              tooltipOptions={{ position: "left" }}
            />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }}>
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

      <EmployeeForm
        currentEmployee={currentEmployee}
        setCurrentEmployee={setCurrentEmployee}
        visible={employeeDialog}
        onHide={hideDialog}
        footer={employeeDialogFooter}
        isEdit={isEdit}
      />
      <DeleteConfirmDialog
        visible={deleteEmployeeDialog}
        onHide={() => setDeleteEmployeeDialog(false)}
        onConfirm={confirmDeleteEmployee}
        employee={employeeToDelete}
      />
      <ActivityLogDialog
        visible={activityDialogVisible}
        onHide={() => setActivityDialogVisible(false)}
        logs={activityLog}
      />
    </div>
  );
};

export default PayrollDashboard;
