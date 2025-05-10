import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

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
  const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

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
    setCurrentEmployee({ name: "", position: "", salary: "" });
    setIsEdit(false);
    setEmployeeDialog(true);
  };

  const hideDialog = () => {
    setEmployeeDialog(false);
  };

  const saveEmployee = async () => {
    if (!currentEmployee.name || !currentEmployee.position || !currentEmployee.salary) {
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
        await axios.post("http://localhost:5000/api/employees", currentEmployee);
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

  const promptDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteEmployeeDialog(true);
  };

  const confirmDeleteEmployee = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${employeeToDelete.id}`);
      setDeleteEmployeeDialog(false);
      fetchEmployees();
      toastRef.current.show({
        severity: "success",
        summary: "Deleted",
        detail: `Employee "${employeeToDelete.name}" deleted`,
      });
      setEmployeeToDelete(null);
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete employee",
      });
    }
  };

  const employeeDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveEmployee} />
    </>
  );

  const deleteEmployeeDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setDeleteEmployeeDialog(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={confirmDeleteEmployee}
      />
    </>
  );

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editEmployee(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => promptDeleteEmployee(rowData)}
        />
      </>
    );
  };

  return (
    <div className="p-m-4 w-[100vw] h-[100vh] px-5">
      <Toast ref={toastRef} />
      <div className="p-d-flex p-jc-between p-ai-center mb-3">
        <h2 className="text-xl pt-1">Master - Employee</h2>
        <div className="flex justify-between gap-2">
          <Button label="Add Employee" icon="pi pi-plus" onClick={openNew} />
          <Button
            label="Export"
            type="button"
            icon="pi pi-upload"
            rounded
            onClick={() => exportCSV(false)}
            data-pr-tooltip="CSV"
          />
        </div>
      </div>

      <DataTable
        ref={dt}
        style={{ minWidth: "90vw" }}
        resizableColumns
        value={employees}
        paginator
        rows={10}
        size={"small"}
        globalFilter={globalFilter}
        header={
          <InputText
            placeholder="Search..."
            onInput={(e) => setGlobalFilter(e.target.value)}
          />
        }
      >
        <Column field="name" header="Name" sortable />
        <Column field="position" header="Position" sortable />
        <Column field="salary" header="Salary" sortable />
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "5rem" }}
        />
      </DataTable>

      {/* Employee Create/Edit Dialog */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        visible={deleteEmployeeDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteEmployeeDialogFooter}
        onHide={() => setDeleteEmployeeDialog(false)}
      >
        <div className="confirmation-content flex items-center">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
          {employeeToDelete && (
            <span>
              Are you sure you want to delete <b>{employeeToDelete.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default PayrollDashboard;
