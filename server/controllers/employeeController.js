const Employee = require('../models/employeeModel');

const requiredFields = [
  "e_id", "first_name", "last_name", "suffix", "gender", "birthday",
  "phone_no", "email", "street_address", "city", "province", "zip",
  "department", "project", "team", "position", "employment", "date_hired",
  "base_monthly_pay", "user_profile", "pay_frequency", "tax_id",
  "sss_gsis_no", "phic_id", "hdmf_id", "bank", "bank_account"
];

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.getAll();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.getById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Please fill out all the required field or field with the (*) sign.` });
      }
    }

    const newEmployee = await Employee.create(req.body);
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Please fill out all the required field or field with the (*) sign.` });
      }
    }

    const { id } = req.params;
    const updatedEmployee = await Employee.updateById(id, req.body);
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  
  try {
    const { id } = req.params;
    console.log(id);
    
    const employee = await Employee.getById(id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    await Employee.deleteById(id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
