// Importing the Employee and ActivityLog models
const Employee = require("../models/employeeModel");
const ActivityLog = require("../models/activityLogModel");

// List of required fields for employee creation and update
const requiredFields = [
  "e_id",
  "first_name",
  "last_name",
  "gender",
  "birthday",
  "phone_no",
  "email",
  "street_address",
  "city",
  "province",
  "zip",
  "department",
  "project",
  "team",
  "position",
  "employment",
  "date_hired",
  "base_monthly_pay",
  "user_profile",
  "pay_frequency",
  "tax_id",
  "sss_gsis_no",
  "phic_id",
  "hdmf_id",
  "bank",
  "bank_account",
];

// GET /employees - Retrieve all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.getAll();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /employees/:id - Retrieve a single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.getById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /employees - Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    // Validate required fields
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Please fill out all the required fields marked with an asterisk (*)`,
        });
      }
    }

    // Create new employee
    const newEmployee = await Employee.create(req.body);

    // Log the activity
    await ActivityLog.log(
      "created",
      newEmployee.id,
      newEmployee.e_id,
      `Created employee ${newEmployee.first_name} ${newEmployee.last_name} (ID: ${newEmployee.e_id})`
    );

    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /employees/:id - Update an existing employee
exports.updateEmployee = async (req, res) => {
  try {
    // Validate required fields
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Please fill out all the required fields marked with an asterisk (*)`,
        });
      }
    }

    const { id } = req.params;

    // Update employee
    const updatedEmployee = await Employee.updateById(id, req.body);

    // Log the activity
    await ActivityLog.log(
      "updated",
      updatedEmployee.id,
      updatedEmployee.e_id,
      `Updated employee ${updatedEmployee.first_name} ${updatedEmployee.last_name} (ID: ${updatedEmployee.e_id})`
    );

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /employees/:id - Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.getById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Log the activity
    await ActivityLog.log(
      "deleted",
      employee.id,
      employee.e_id,
      `Deleted employee ${employee.first_name} ${employee.last_name} (ID: ${employee.e_id})`
    );

    // Delete employee
    await Employee.deleteById(id);

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
