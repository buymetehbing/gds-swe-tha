import { verifyStaff } from '../src/staff';
import { db } from '../src/database';


describe('Test verifyStaff function', () => {

  const testStaff = {
    staff_pass_id: 'MANAGER_ABCD1234',
    team_name: 'TEAMABC',
    created_at: 1234567899000
  };

  beforeAll((done) => {

    const insertSql = 'INSERT OR IGNORE INTO staff_team_lookup (staff_pass_id, team_name, created_at) VALUES (?, ?, ?)';
    db.run(insertSql, [testStaff.staff_pass_id, testStaff.team_name, testStaff.created_at], function (err) {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });

  afterAll((done) => {
    const deleteSql = 'DELETE FROM staff_team_lookup WHERE staff_pass_id = ?';
    db.run(deleteSql, [testStaff.staff_pass_id], (err) => {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });

  test('Should return staff record if exists', (done) => {
    verifyStaff(testStaff.staff_pass_id, (record) => {
      expect(record).toEqual(testStaff);
      done();
    });

  });

  test('Should return null if staff does not exist', (done) => {
    const nonExistentID = 'NON_EXISTING_ID';

    verifyStaff(nonExistentID, (record) => {
      expect(record).toBeNull();
      done();
    });
  });

  test('Should return null if staff pass ID is passed as an empty string', (done) => {
    const emptyID = '';

    verifyStaff(emptyID, (record) => {
      expect(record).toBeNull();
      done();
    });
  });

});
