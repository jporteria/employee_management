import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import axios from "axios";
import "./App.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
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

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
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
    </div>
  );
};

export default PayrollDashboard;
