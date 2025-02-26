const cron = require("node-cron");
const { insertMockScreens } = require("../controller/testController");

// Handler for scheduled jobs
async function scheduledJobHandler() {
    try {
        console.log(`Running scheduled show generation at ${new Date().toISOString()}`);
        await insertMockScreens();
        console.log("Scheduled show generation completed successfully");
    } catch (error) {
        console.error("Scheduled job failed:", error);
    }
}

module.exports = { scheduledJobHandler };
