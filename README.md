# gds-swe-tha

## Overview

This repository contains my solution to the Take Home Assignment for GovTech's Internship Programme (GDS).

For about me, [click here](ABOUT).

### Task

Given this information, you are to build a system using Node.js and Typescript that supports 3 functions:

1. Perform look up of the representative's staff pass ID against the mapping file
2. Verify if the team can redeem their gift by comparing the team name against past redemption in the redemption data
3. Add new redemption to the redemption data if this team is still eligible for redemption, otherwise, do nothing and send the representative away

The redemption data should at least contain the following information: `team_name` and `redeemed_at`. The latter refers to the timestamp the redemption occurred in epoch milliseconds. You should include unit tests for your solution.

## Set up

```
npm install
```

To start the server
```
npm start
```
The server will be running at `localhost:3000`.

To run tests
```
npm test
```

## Configuration

To adjust CSV file path for staff to team mapping, change the staffCsvFilePath variable in `src/database.ts`.

```
const staffCsvFilePath = 'csv/staff-id-to-team-mapping-long.csv';
```

## Solution Explanation

### Approach

In this solution, I've employed a tech stack that combines TypeScript, Node.js, and Express on the backend, leveraging SQLite as the database solution. For the frontend, I've utilized React.js.

### Assumptions Made

1. Each team has a unique name.
2. Each team can only redeem one gift maximum.
3. Teams are only eligible to redeem their gift if no one from their team has made a redemption.
4. The redemption data is assumed to have a predefined schema, including fields such as team name, representative's staff pass ID, and a redemption timestamp.
5. Every employee's staff pass ID can be found in the mapping csv.
6. Mapping records cannot be created in the future.
7. All records in the csv files do not contain any null values.

### Database Schema

To maintain data integrity and ensure the consistency of redemptions, I have chosen to use SQLite. Indexing allows the database to quickly locate and retrieve data, helping to speed up lookup operations.

| staff_team_lookup        |                         |
| ------------------------ |-------------------------|
| staff_pass_id            |  TEXT, PRIMARY KEY      |
| team_name                |  TEXT                   |
| created_at               |  INTEGER                |


| team_redemptions         |                         |
| ------------------------ |-------------------------|
| team_name                |  TEXT, PRIMARY KEY      |
| representative_pass_id   |  TEXT                   |
| redeemed_at              |  INTEGER                |

### API Endpoints

#### GET /staff/:staffPassId
Verify the identity of a staff member based on their unique staff pass ID. Returns information about the staff member if found.

Parameters:

| Name          | Type         | Description         |
| ------------- |--------------|---------------------|
| staffPassId   |  string      | The unique identifier associated with the staff member |


#### GET /redemption/:teamName
Checks the redemption status for a specific team. Returns eligibility status and past redemption information if found.

Parameters:

| Name          | Type         | Description         |
| ------------- |--------------|---------------------|
| teamName      |  string      | The name of the team for which redemption status is requested |


#### POST /redemption/add
Adds a new redemption for a specific team.

Body: 
- teamName: The name of the team.
- representativePassId: The pass ID of the team representative.


Parameters:

| Name          | Type         | Description         |
| ------------- |--------------|---------------------|
| teamName      |  string      | The name of the team |
| representativePassId      |  string      | The staff pass ID of the team representative redeeming on behalf of the team  |

## Test Suite Overview

### Test Setup and Teardown

Before each test, the relevant data is prepared by inserting or deleting records in the tables. After each test, the data is cleaned up to ensure the database remains in a consistent state.

`verifyStaff` Function

This test suite assesses the behavior of the `verifyStaff` function, which is responsible for verifying if a staff exists in the records. The tests cover scenarios where the staff record exists and where it doesn't.

`checkForPastRedemption` Function

This test suite validates the behavior of the `checkForPastRedemption` function, which is responsible for verifying if a team has redeemed in the past. The tests cover scenarios where the redemption record exists and where it doesn't.

`addNewRedemption` Function

This test suite assesses the functionality of the `addNewRedemption` function, which adds new redemption records. The tests include cases where redemption is successfully added, where the redemption already exists with the same staff representative, and where the redemption already exists with a different staff representative.