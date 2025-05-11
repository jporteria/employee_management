import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { columnOptions } from "../constants/employeeFields";

const EmployeeTable = ({
  dt,
  employees,
  globalFilter,
  setGlobalFilter,
  selectedColumns,
  setSelectedColumns,
  editEmployee,
  promptDeleteEmployee,
}) => {
  const actionBodyTemplate = (rowData) => (
    <>
      <button
        style={{ background: "yellow" }}
        className="p-button p-button-rounded p-button-outlined mr-2"
        onClick={() => editEmployee(rowData)}
      >
        <i className="pi pi-pencil"></i>
      </button>
      <button
        style={{ background: "red" }}
        className="p-button p-button-rounded p-button-outlined"
        onClick={() => promptDeleteEmployee(rowData)}
      >
        <i className="pi pi-trash"></i>
      </button>
    </>
  );

  return (
    <DataTable
      style={{ background: "var(--primary-color)" }}
      ref={dt}
      value={employees}
      paginator
      rows={10}
      size="small"
      removableSort
      globalFilter={globalFilter}
      header={
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
        <Column sortable field="address" header="Address" />
      )}
      {selectedColumns.includes("postal_code") && (
        <Column sortable field="postal_code" header="Postal Code" />
      )}
      {selectedColumns.includes("phone") && (
        <Column sortable field="phone" header="Phone" />
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
      {selectedColumns.includes("civil_status") && (
        <Column sortable field="civil_status" header="Civil Status" />
      )}
      {selectedColumns.includes("sss_id") && (
        <Column sortable field="sss_id" header="SSS ID" />
      )}
      {selectedColumns.includes("tin") && (
        <Column sortable field="tin" header="TIN" />
      )}
      {selectedColumns.includes("philhealth_id") && (
        <Column sortable field="philhealth_id" header="PhilHealth ID" />
      )}
      {selectedColumns.includes("pagibig_id") && (
        <Column sortable field="pagibig_id" header="PAG-IBIG ID" />
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
