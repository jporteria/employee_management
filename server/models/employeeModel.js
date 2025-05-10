const db = require('../config/db');

class Employee {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM employees');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0];
  }

  static async create({ name, position, salary }) {
    const [result] = await db.query(
      'INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)',
      [name, position, salary]
    );
    return { id: result.insertId, name, position, salary };
  }

  static async update(id, { name, position, salary }) {
    await db.query(
      'UPDATE employees SET name = ?, position = ?, salary = ? WHERE id = ?',
      [name, position, salary, id]
    );
    return { id, name, position, salary };
  }

  static async delete(id) {
    await db.query('DELETE FROM employees WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Employee;