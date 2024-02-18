import sqlite3 from 'sqlite3';
import fs from 'fs';
import csvParser from 'csv-parser';

const staffCsvFilePath = 'csv/staff-id-to-team-mapping-long.csv';

function createTables(db: sqlite3.Database) {
    db.run(`
        CREATE TABLE IF NOT EXISTS staff_team_lookup (
        staff_pass_id TEXT PRIMARY KEY,
        team_name TEXT NOT NULL,
        created_at INTEGER NOT NULL
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS team_redemptions (
        team_name TEXT PRIMARY KEY,
        representative_pass_id TEXT NOT NULL,
        redeemed_at INTEGER NOT NULL
        );
    `);
}

function importCSVData(db: sqlite3.Database, filePath: string, tableName: string) {
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row: any) => {
            const columns = Object.keys(row);
            const values = columns.map((column) => row[column]);
            db.run(`INSERT OR IGNORE INTO ${tableName} (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`, values);
        })
}

export const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    } else {
        createTables(db);
        importCSVData(db, staffCsvFilePath, 'staff_team_lookup');
    }
});
