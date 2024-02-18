import { db } from './database';

export function verifyStaff(staffPassId: string, callback: (record: any | null) => void) {
    if (staffPassId == null || staffPassId == "") {
        callback(null);
        return;
    }
    
    const sql = 'SELECT * FROM staff_team_lookup WHERE staff_pass_id = ?';
    db.get(sql, [staffPassId], (err, row) => {
        if (err || row === undefined || row === null) {
            callback(null);
        } else {
            callback(row);
        }
    });
}