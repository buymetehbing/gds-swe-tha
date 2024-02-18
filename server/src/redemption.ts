import { db } from './database';

export function checkForPastRedemption(teamName: string, callback: (record: any | null) => void) {
    if (teamName == null || teamName == "") {
        callback(null);
        return;
    }

    const sql = 'SELECT * FROM team_redemptions WHERE team_name = ?';
    db.get(sql, [teamName], (err, row) => {
        if (err || row === undefined || row === null) {
            callback(null);
        } else {
            callback(row);
        }
    });
}

export function addNewRedemption(teamName: string, representativePassId: string, redeemedAt: number, callback: (success: boolean) => void) {
    if (teamName == null || teamName == "" || representativePassId == null || representativePassId == "") {
        callback(false);
        return;
    }

    const sql = 'INSERT INTO team_redemptions (team_name, representative_pass_id, redeemed_at) VALUES (?, ?, ?)';
    db.run(sql, [teamName, representativePassId, redeemedAt], (err) => {
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
}

