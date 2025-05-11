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

const initialEmployee = {
  e_id: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  gender: "",
  birthday: "",
  phone_no: "",
  email: "",
  street_address: "",
  city: "",
  province: "",
  zip: "",
  department: "",
  project: "",
  team: "",
  position: "",
  employment: "",
  date_hired: "",
  base_monthly_pay: "",
  user_profile: "",
  pay_frequency: "",
  tax_id: "",
  sss_gsis_no: "",
  phic_id: "",
  hdmf_id: "",
  bank: "",
  bank_account: "",
};

const PayrollDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(initialEmployee);
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
        await axios.put(`http://localhost:5000/api/employees/${currentEmployee.id}`, currentEmployee);
        toastRef.current.show({ severity: "success", summary: "Updated", detail: "Employee updated" });
      } else {
        await axios.post("http://localhost:5000/api/employees", currentEmployee);
        toastRef.current.show({ severity: "success", summary: "Added", detail: "Employee added" });
      }
      setEmployeeDialog(false);
      fetchEmployees();
    } catch (error) {
      toastRef.current.show({ severity: "error", summary: "Error", detail: "Something went wrong" });
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
      await axios.delete(`http://localhost:5000/api/employees/${employeeToDelete.id}`);
      setDeleteEmployeeDialog(false);
      fetchEmployees();
      toastRef.current.show({ severity: "success", summary: "Deleted", detail: "Employee deleted" });
    } catch (error) {
      toastRef.current.show({ severity: "error", summary: "Error", detail: "Failed to delete employee" });
    }
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const actionBodyTemplate = (rowData) => (
    <>
      <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editEmployee(rowData)} />
      <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => promptDeleteEmployee(rowData)} />
    </>
  );

  const employeeDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveEmployee} />
    </>
  );

  return (
    <div className="p-m-4 w-[100vw] h-[100vh] px-5">
      <Toast ref={toastRef} />
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl pt-1">Master - Employee</h2>
        <div className="flex gap-2">
          <Button label="Add Employee" icon="pi pi-plus" onClick={openNew} />
          <Button label="Export" icon="pi pi-upload" onClick={() => exportCSV(false)} />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <DataTable
          ref={dt}
          value={employees}
          paginator
          rows={10}
          size="small"
          resizableColumns
          globalFilter={globalFilter}
          header={<InputText placeholder="Search..." onInput={(e) => setGlobalFilter(e.target.value)} />}
        >
          <Column field="e_id" header="E_ID" />
          <Column field="last_name" header="Last Name" />
          <Column field="first_name" header="First Name" />
          <Column field="middle_name" header="Middle Name" />
          <Column field="position" header="Position" />
          <Column field="province" header="Province" />
          <Column body={actionBodyTemplate} exportable={false} frozen alignFrozen="right" />
        </DataTable>
      </div>

      <Dialog
        visible={employeeDialog}
        style={{ width: "80vw", maxHeight: "80vh" }}
        header={isEdit ? "Edit Employee" : "New Employee"}
        modal
        footer={employeeDialogFooter}
        onHide={hideDialog}
      >
        <div className="p-fluid grid">
          {Object.keys(initialEmployee).map((key, idx) => (
            <div key={key} className="col-12 md:col-6 mb-3">
              <label htmlFor={key} className="block mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <InputText
                id={key}
                value={currentEmployee[key]}
                onChange={(e) => setCurrentEmployee({ ...currentEmployee, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </Dialog>

      <Dialog
        visible={deleteEmployeeDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={
          <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteEmployeeDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={confirmDeleteEmployee} />
          </>
        }
        onHide={() => setDeleteEmployeeDialog(false)}
      >
        <div className="confirmation-content flex items-center">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
          {employeeToDelete && <span>Are you sure you want to delete <b>{employeeToDelete.firstName} {employeeToDelete.lastName}</b>?</span>}
        </div>
      </Dialog>
    </div>
  );
};

export default PayrollDashboard;