import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { columnOptions } from "../constants/employeeFields";

// Main table for displaying employee records
const EmployeeTable = ({
  dt,                    // Ref for exporting/filtering
  employees,             // Employee data array
  globalFilter,          // Search term
  setGlobalFilter,       // Update global filter
  selectedColumns,       // Currently visible columns
  setSelectedColumns,    // Update visible columns
  editEmployee,          // Function to trigger edit modal
  promptDeleteEmployee,  // Function to trigger delete confirmation
}) => {

  // Template for action buttons in the rightmost column
  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        style={{ background: "#edc001", color: "#232323" }}
        className="p-button p-button-rounded p-button-outlined mr-2"
        onClick={() => editEmployee(rowData)}
        icon="pi pi-pencil"
      />
      <Button
        style={{ background: "red" }}
        className="p-button p-button-rounded p-button-outlined"
        onClick={() => promptDeleteEmployee(rowData)}
        icon="pi pi-trash"
      />
    </>
  );

  return (
    <DataTable
      style={{ background: "var(--primary-color)" }}
      ref={dt}
      value={employees}   
      paginator     
      rows={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      size="small"
      removableSort         
      resizableColumns  
      globalFilter={globalFilter}  
      header={
        // Search bar and column toggle dropdown in header
        <div className="flex justify-between items-center">
          <InputText
            placeholder="Search..."
            onInput={(e) => setGlobalFilter(e.target.value)}
          />
          <MultiSelect
            value={selectedColumns}
            options={columnOptions}
            onChange={(e) => setSelectedColumns(e.value)}
            optionLabel="label"
            placeholder="Select Columns"
            display="chip"
            className="w-1/4 max-md:w-1/2 min-w-[50px]"
          />
        </div>
      }
    >
      {/* Render columns based on selected fields */}
      {selectedColumns.includes("e_id") && (
        <Column sortable field="e_id" header="Employee ID" />
      )}
      {selectedColumns.includes("last_name") && (
        <Column sortable field="last_name" header="Last Name" />
      )}
      {selectedColumns.includes("first_name") && (
        <Column sortable field="first_name" header="First Name" />
      )}
      {selectedColumns.includes("middle_name") && (
        <Column sortable field="middle_name" header="Middle Name" />
      )}
      {selectedColumns.includes("position") && (
        <Column sortable field="position" header="Position" />
      )}
      {selectedColumns.includes("province") && (
        <Column sortable field="province" header="Province" />
      )}
      {selectedColumns.includes("city") && (
        <Column sortable field="city" header="City" />
      )}
      {selectedColumns.includes("address") && (
        <Column sortable field="street_address" header="Street Address" />
      )}
      {selectedColumns.includes("postal_code") && (
        <Column sortable field="zip" header="Zip Code" />
      )}
      {selectedColumns.includes("phone") && (
        <Column sortable field="phone_no" header="Phone" />
      )}
      {selectedColumns.includes("email") && (
        <Column sortable field="email" header="Email" />
      )}
      {selectedColumns.includes("gender") && (
        <Column sortable field="gender" header="Gender" />
      )}
      {selectedColumns.includes("birthday") && (
        <Column sortable field="birthday" header="Birthday" />
      )}
      {selectedColumns.includes("sss_id") && (
        <Column sortable field="sss_gsis_no" header="SSS/GSIS" />
      )}
      {selectedColumns.includes("tin") && (
        <Column sortable field="tax_id" header="TIN" />
      )}
      {selectedColumns.includes("philhealth_id") && (
        <Column sortable field="phic_id" header="PhilHealth" />
      )}
      {selectedColumns.includes("pagibig_id") && (
        <Column sortable field="hdmf_id" header="PAG-IBIG" />
      )}
      {selectedColumns.includes("date_hired") && (
        <Column sortable field="date_hired" header="Date Hired" />
      )}
      {selectedColumns.includes("salary") && (
        <Column sortable field="base_monthly_pay" header="Salary" />
      )}
      {selectedColumns.includes("tax_id") && (
        <Column sortable field="tax_id" header="Tax ID" />
      )}
      {selectedColumns.includes("department") && (
        <Column sortable field="department" header="Department" />
      )}

      {/* Action column (Edit/Delete) pinned to right */}
      <Column
        body={actionBodyTemplate}
        exportable={false}
        frozen
        alignFrozen="right"
      />
    </DataTable>
  );
};

export default EmployeeTable;
