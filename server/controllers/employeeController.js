const Employee = require('../models/employeeModel');

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
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, position, salary } = req.body;
    if (!name || !position || !salary) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newEmployee = await Employee.create({ name, position, salary });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { name, position, salary } = req.body;
    if (!name || !position || !salary) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const updatedEmployee = await Employee.update(req.params.id, { name, position, salary });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.getById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await Employee.delete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};