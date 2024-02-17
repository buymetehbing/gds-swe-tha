import express, { Request, Response } from 'express'
const cors = require('cors');
import { verifyStaff } from './src/staff'
import { checkForPastRedemption, addNewRedemption } from './src/redemption';

const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

app.get('/staff/:staffPassId', (req: Request, res: Response) => {
    const { staffPassId } = req.params;

    verifyStaff(staffPassId, (record) => {
        if (record) {
            res.status(200).send({ staff_pass_id: record.staff_pass_id, team_name: record.team_name });
        } else {
            res.status(404).json({ message: `No staff found with ID ${staffPassId}.` });
        }
    });
});

app.get('/redemption/:teamName', (req: Request, res: Response) => {
    const { teamName } = req.params;

    checkForPastRedemption(teamName, (record) => {
        if (record) {
            res.status(200).json({ status: 'INELIGIBLE', data: record });
        } else {
            res.status(200).json({ status: 'ELIGIBLE' });
        }
    });
});

app.post('/redemption/add', (req: Request, res: Response) => {
    const { teamName, representativePassId } = req.body;
    const redeemedAt = Date.now();

    addNewRedemption(teamName, representativePassId, redeemedAt, (success) => {
        if (success) {
            res.status(200).json({ message: `Redemption for ${teamName} added successfully.` });
        } else {
            res.status(500).json({ message: `Redemption for ${teamName} failed.` });
        }
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})