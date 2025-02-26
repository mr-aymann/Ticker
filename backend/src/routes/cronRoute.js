const express = require('express');
const router = express.Router();
const { scheduledJobHandler } = require('../controller/screenScheduler');

// Cron job endpoint
router.get('/cron', async (req, res) => {
    try {
        console.log(`Cron job triggered at ${new Date().toISOString()}`);
        await scheduledJobHandler();
        res.status(200).send('Cron job completed successfully');
    } catch (error) {
        console.error('Cron job failed:', error);
        res.status(500).send('Cron job failed');
    }
});

module.exports = router;
