import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Toast } from "primereact/toast";
import axios from "axios";
import "./App.css";
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);
  const [selectedColumns, setSelectedColumns] = useState([
    "e_id",
    "last_name",
    "first_name",
    "middle_name",
    "position",
    "province",
  ]);

  // References for toast messages and data table
  const toastRef = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch activity logs from backend API
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

  // Apply selected theme to the app
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

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = isDarkMode
      ? "bootstrap4-light-blue"
      : "bootstrap4-dark-blue";
    applyTheme(newTheme);
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme); // Store theme selection in local storage
  };

  // Fetch employee data from backend API
  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/employees");
    setEmployees(res.data);
  };

  // Fetch employees and activity logs on component mount
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
  }, []); // Empty dependency array to run this effect only once on mount

  // Open the employee form dialog to add a new employee
  const openNew = () => {
    setCurrentEmployee(initialEmployee);
    setIsEdit(false);
    setEmployeeDialog(true);
  };

  // Close the employee form dialog
  const hideDialog = () => {
    setEmployeeDialog(false);
  };

  // Save employee (either add new or update existing based on isEdit flag)
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
      setEmployeeDialog(false); // Close dialog after saving
      fetchEmployees(); // Refresh employee data
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.error,
      });
      console.log(error);
    }
  };

  // Edit an existing employee
  const editEmployee = (employee) => {
    setCurrentEmployee({ ...employee });
    setIsEdit(true);
    setEmployeeDialog(true); // Open dialog in edit mode
  };

  // Prompt to delete an employee (show confirmation dialog)
  const promptDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteEmployeeDialog(true);
  };

  // Confirm deletion of an employee
  const confirmDeleteEmployee = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/employees/${employeeToDelete.id}`
      );
      setDeleteEmployeeDialog(false); // Close delete dialog
      fetchEmployees(); // Refresh employee data
      fetchActivityLogs(); // Refresh activity logs
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

  // Export employee data to CSV
  const exportCSV = () => {
    dt.current.exportCSV();
  };

  return (
    <div className="w-[99vw] h-[100vh] px-5">
      {/* Toast notifications */}
      <Toast ref={toastRef} />
      <div className="flex items-center my-3 max-md:flex-col">
        <h2 className="text-2xl whitespace-nowrap mr-5 max-md:mb-5">
          Master - Employee
        </h2>
        <div className="flex w-full justify-between gap-2">
          {/* Add employee button */}
          <Button
            raised
            style={{ background: "#77dd77", color: "black" }}
            label="Add Employee"
            icon="pi pi-plus"
            onClick={openNew}
          />
          <div className="flex gap-2 items-center">
            {/* Export CSV button */}
            <Button
              style={{ background: "#e0f7fa", color: "black" }}
              label={isSmallScreen ? "" : "Export to CSV"}
              icon="pi pi-upload"
              onClick={() => exportCSV(false)}
            />
            {/* Activity log button */}
            <Button
              icon="pi pi-clock"
              style={{ background: "#fff3cd", color: "black" }}
              label={isSmallScreen ? "" : "Activity Log"}
              onClick={() => setActivityDialogVisible(true)}
            />
            {/* Theme toggle button */}
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
              className="theme-toggle-button"
              tooltip="Toggle Theme"
              tooltipOptions={{ position: "left" }}
            />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff" }}>
        {/* Employee table */}
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

      {/* Employee form dialog */}
      <EmployeeForm
        currentEmployee={currentEmployee}
        setCurrentEmployee={setCurrentEmployee}
        visible={employeeDialog}
        onHide={hideDialog}
        isEdit={isEdit}
        onSave={saveEmployee}
      />
      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        visible={deleteEmployeeDialog}
        onHide={() => setDeleteEmployeeDialog(false)}
        onConfirm={confirmDeleteEmployee}
        employee={employeeToDelete}
      />
      {/* Activity log dialog */}
      <ActivityLogDialog
        visible={activityDialogVisible}
        onHide={() => setActivityDialogVisible(false)}
        logs={activityLog}
      />
    </div>
  );
};

export default PayrollDashboard;
