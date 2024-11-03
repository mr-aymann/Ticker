const pool = require('../config/db'); // assuming this exports your PostgreSQL pool or client
const { faker } = require("@faker-js/faker");
const cron = require("node-cron");

// Predefined array of slot times
const slotTimes = [
  "09:00:00", "09:15:00", "09:30:00", "09:45:00", "10:00:00", 
  "10:15:00", "10:30:00", "10:45:00", "11:00:00", "11:15:00",
  "11:30:00", "11:45:00", "12:00:00", "12:15:00", "12:30:00",
  "12:45:00", "13:00:00", "13:15:00", "13:30:00", "13:45:00",
  "14:00:00", "14:15:00", "14:30:00", "14:45:00", "15:00:00",
  "15:15:00", "15:30:00", "15:45:00", "16:00:00", "16:15:00",
  "16:30:00", "16:45:00", "17:00:00", "17:15:00", "17:30:00",
  "17:45:00", "18:00:00", "18:15:00", "18:30:00", "18:45:00",
  "19:00:00", "19:15:00", "19:30:00", "19:45:00", "20:00:00",
  "20:15:00", "20:30:00", "20:45:00", "21:00:00", "21:15:00",
  "21:30:00", "21:45:00", "22:00:00", "22:15:00", "22:30:00",
  "22:45:00", "23:00:00", "23:15:00", "23:30:00", "23:45:00",
  "00:00:00", "00:15:00", "00:30:00", "00:45:00", "01:00:00",
  "01:15:00", "01:30:00", "01:45:00",
];

// Function to insert mock screen data
async function insertMockScreens() {
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    for (let i = 0; i < 10; i++) {
        const theaterId = faker.number.int({ min: 1, max: 6 });
        const slotId = faker.number.int({ min: 0, max: slotTimes.length - 1 });
        const screenData = {
            theater_id: theaterId,
            movie_id: faker.number.int({ min: 1, max: 6 }),
            slot_id: slotId,
            show_time: slotTimes[slotId],
            date: faker.date.between({ from: now, to: threeDaysLater }).toISOString().slice(0, 10),
            available_capacity: faker.number.int({ min: 0, max: 100 }),
            total_capacity: faker.number.int({ min: 100, max: 150 }),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
            screen_number: `${theaterId}-${faker.number.int({ min: 1, max: 3 })}`,
        };

        try {
            const query = `
                INSERT INTO screen 
                (theater_id, movie_id, slot_id, show_time, date, available_capacity, total_capacity, is_active, created_at, updated_at, screen_number)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `;
            await pool.query(query, [
                screenData.theater_id,
                screenData.movie_id,
                screenData.slot_id,
                screenData.show_time,
                screenData.date,
                screenData.available_capacity,
                screenData.total_capacity,
                screenData.is_active,
                screenData.created_at,
                screenData.updated_at,
                screenData.screen_number,
            ]);
            console.log("Screen inserted successfully!");
        } catch (error) {
            console.error("Error inserting screen:", error.code, error.detail);
        }
    }
}

async function runInsertionJob() {
    console.log("Populating screens with movie and theatre references...");
    await insertMockScreens();
    console.log("Mock data insertion complete.");
}

// Uncomment to schedule job to run daily at 6:00 AM
// cron.schedule('0 6 * * *', () => {
//     runInsertionJob();
// });

// Initial run
runInsertionJob();
