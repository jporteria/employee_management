const db = require('../config/db');

class ActivityLog {
  static async log(action, employee_id, e_id, description) {
    try {
      await db.query(`
        INSERT INTO activity_logs (action, employee_id, e_id, description)
        VALUES (?, ?, ?, ?)`,
        [action, employee_id, e_id, description]
      );
    } catch (error) {
      console.error('Error in log:', error);
    }
  }
}

module.exports = ActivityLog;
