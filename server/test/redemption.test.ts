import { checkForPastRedemption, addNewRedemption } from '../src/redemption';
import { db } from '../src/database';

describe('Test checkForPastRedemption function', () => {

  const testRedemption= {
    team_name: 'TEAMABC',
    representative_pass_id: 'MANAGER_ABCD1234',
    redeemed_at: 1234567899000
  };

  beforeAll((done) => {
    const sql = 'INSERT INTO team_redemptions (team_name, representative_pass_id, redeemed_at) VALUES (?, ?, ?)';
    db.run(sql, [testRedemption.team_name, testRedemption.representative_pass_id, testRedemption.redeemed_at], (err) => {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });

  afterAll((done) => {
    const deleteSql = 'DELETE FROM team_redemptions WHERE team_name = ?';
    db.run(deleteSql, [testRedemption.team_name], (err) => {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });

  test('Should return team redemption record if exists', (done) => {
    checkForPastRedemption(testRedemption.team_name, (record) => {
      expect(record).toEqual(testRedemption);
      done();
    });
  });

  test('Should return null record if does not exist', (done) => {
    const teamName = 'TEAM123';

    checkForPastRedemption(teamName, (record) => {
      expect(record).toBeNull();
      done();
    });
  });

});


describe('Test addNewRedemption function', () => {

  const testRedemption= {
    team_name: 'TEAMABC',
    representative_pass_id: 'MANAGER_ABCD1234',
    redeemed_at: 1234567899000
  };

  beforeAll((done) => {
    const sql = 'DELETE FROM team_redemptions WHERE team_name = ?';
    db.run(sql, [testRedemption.team_name], (err) => {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });

  afterAll((done) => {
    const sql = 'DELETE FROM team_redemptions WHERE team_name = ?';
    db.run(sql, [testRedemption.team_name], (err) => {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
  });

  test('Should return true if redemption added', (done) => {
    addNewRedemption(testRedemption.team_name, testRedemption.representative_pass_id, testRedemption.redeemed_at, (record) => {
      expect(record).toEqual(true);
      done();
    });
  });

  test('Should return false if redemption already exists (same staff representative)', (done) => {
    const redeemedAt = Date.now();

    addNewRedemption(testRedemption.team_name, testRedemption.representative_pass_id, redeemedAt, (record) => {
      expect(record).toEqual(false);
      done();
    });
  });

  test('Should return false if redemption already exists (different staff representative)', (done) => {
    const representativePassId = 'STAFF_ABCD1234';
    const redeemedAt = Date.now();

    addNewRedemption(testRedemption.team_name, representativePassId, redeemedAt, (record) => {
      expect(record).toEqual(false);
      done();
    });
  });

});
