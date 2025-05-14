const db = require('../config/db');

class Employee {
  // Retrieves all employees from the database
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM employees');
      return rows;
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }

  // Retrieves a single employee by their ID from the database
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  // Creates a new employee in the database
  // Checks if the employee ID already exists before inserting
  static async create(data) {
    try {
      const {
        e_id, first_name, middle_name, last_name, suffix, gender, birthday,
        phone_no, email, street_address, city, province, zip, department,
        project, team, position, employment, date_hired, base_monthly_pay,
        user_profile, pay_frequency, tax_id, sss_gsis_no, phic_id,
        hdmf_id, bank, bank_account
      } = data;

      const [existing] = await db.query('SELECT * FROM employees WHERE e_id = ?', [e_id]);
      if (existing.length > 0) {
        throw new Error(`Employee ID ${e_id} already exists.`);
      }

      const [result] = await db.query(`
        INSERT INTO employees (
          e_id, first_name, middle_name, last_name, suffix, gender, birthday,
          phone_no, email, street_address, city, province, zip, department,
          project, team, position, employment, date_hired, base_monthly_pay,
          user_profile, pay_frequency, tax_id, sss_gsis_no, phic_id,
          hdmf_id, bank, bank_account, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        e_id, first_name, middle_name, last_name, suffix, gender, birthday,
        phone_no, email, street_address, city, province, zip, department,
        project, team, position, employment, date_hired, base_monthly_pay,
        user_profile, pay_frequency, tax_id, sss_gsis_no, phic_id,
        hdmf_id, bank, bank_account
      ]);

      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('Error in create:', error.message);
      throw error;
    }
  }

  // Updates an existing employee by their ID
  // Ensures that the employee ID does not conflict with another employee's ID
  static async updateById(id, data) {
    const {
      e_id, first_name, middle_name, last_name, suffix, gender, birthday,
      phone_no, email, street_address, city, province, zip, department,
      project, team, position, employment, date_hired, base_monthly_pay,
      user_profile, pay_frequency, tax_id, sss_gsis_no, phic_id,
      hdmf_id, bank, bank_account
    } = data;

    try {
      const [existing] = await db.query('SELECT * FROM employees WHERE e_id = ? AND id != ?', [e_id, id]);
      if (existing.length > 0) {
        throw new Error(`Employee ID ${e_id} already exists for another employee.`);
      }

      const [result] = await db.query(` 
        UPDATE employees SET
          e_id = ?, first_name = ?, middle_name = ?, last_name = ?, suffix = ?, gender = ?, birthday = ?,
          phone_no = ?, email = ?, street_address = ?, city = ?, province = ?, zip = ?, department = ?,
          project = ?, team = ?, position = ?, employment = ?, date_hired = ?, base_monthly_pay = ?,
          user_profile = ?, pay_frequency = ?, tax_id = ?, sss_gsis_no = ?, phic_id = ?,
          hdmf_id = ?, bank = ?, bank_account = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? 
      `, [
        e_id, first_name, middle_name, last_name, suffix, gender, birthday,
        phone_no, email, street_address, city, province, zip, department,
        project, team, position, employment, date_hired, base_monthly_pay,
        user_profile, pay_frequency, tax_id, sss_gsis_no, phic_id,
        hdmf_id, bank, bank_account, id
      ]);

      if (result.affectedRows === 0) {
        throw new Error('No employee updated. ID may not exist.');
      }

      return { id, ...data };
    } catch (error) {
      console.error('Error in updateById:', error.message);
      throw error;
    }
  }

  // Deletes an employee from the database by their ID
  static async deleteById(id) {
    try {
      await db.query('DELETE FROM employees WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error in deleteById:', error);
      throw error;
    }
  }
}

module.exports = Employee;
