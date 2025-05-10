import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";
import "primereact/resources/themes/fluent-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const PayrollDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    name: "",
    position: "",
    salary: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const toastRef = useRef(null);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openNew = () => {
    setCurrentEmployee({ name: "", position: "", salary: "" });
    setIsEdit(false);
    setEmployeeDialog(true);
  };

  const hideDialog = () => {
    setEmployeeDialog(false);
  };

  const saveEmployee = async () => {
    if (
      !currentEmployee.name ||
      !currentEmployee.position ||
      !currentEmployee.salary
    ) {
      toastRef.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "All fields are required",
      });
      return;
    }
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
        detail: "Something went wrong",
      });
    }
  };

  const editEmployee = (employee) => {
    setCurrentEmployee({ ...employee });
    setIsEdit(true);
    setEmployeeDialog(true);
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    await axios.delete(`http://localhost:5000/api/employees/${id}`);
    fetchEmployees();
    toastRef.current.show({
      severity: "success",
      summary: "Deleted",
      detail: "Employee deleted",
    });
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
    <div className="p-m-4">
      <Toast ref={toastRef} />
      <div className="p-d-flex p-jc-between p-ai-center mb-3">
        <h2>Payroll Management</h2>
        <Button label="Add Employee" icon="pi pi-plus" onClick={openNew} />
      </div>
      <DataTable
        value={employees}
        paginator
        rows={5}
        globalFilter={globalFilter}
        header={
          <InputText
            placeholder="Search..."
            onInput={(e) => setGlobalFilter(e.target.value)}
          />
        }
      >
        <Column field="name" header="Name" sortable></Column>
        <Column field="position" header="Position" sortable></Column>
        <Column field="salary" header="Salary" sortable></Column>
        <Column
          header="Actions"
          body={(rowData) => (
            <>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning p-mr-2"
                onClick={() => editEmployee(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteEmployee(rowData.id)}
              />
            </>
          )}
        ></Column>
      </DataTable>

      <Dialog
        visible={employeeDialog}
        style={{ width: "400px" }}
        header={isEdit ? "Edit Employee" : "New Employee"}
        modal
        footer={employeeDialogFooter}
        onHide={hideDialog}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={currentEmployee.name}
              onChange={(e) =>
                setCurrentEmployee({ ...currentEmployee, name: e.target.value })
              }
              required
              autoFocus
            />
          </div>
          <div className="p-field">
            <label htmlFor="position">Position</label>
            <InputText
              id="position"
              value={currentEmployee.position}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  position: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="p-field">
            <label htmlFor="salary">Salary</label>
            <InputText
              id="salary"
              value={currentEmployee.salary}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  salary: e.target.value,
                })
              }
              required
              keyfilter="pint"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PayrollDashboard;
