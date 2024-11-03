const pool = require("../config/db"); // assuming this exports your PostgreSQL pool or client
const { faker } = require("@faker-js/faker");
const cron = require("node-cron");

// Predefined array of slot times
const slotTimes = [
  "09:00:00",
  "09:30:00",
  "09:45:00",
  "10:15:00",
  "10:30:00",
  "10:45:00",
  "11:00:00",
  "11:30:00",
  "12:00:00",
  "12:15:00",
  "12:30:00",
  "12:45:00",
  "13:00:00",
  "13:15:00",
  "13:30:00",
  "13:45:00",
  "14:15:00",
  "16:15:00",
  "16:30:00",
  "17:30:00",
  "17:45:00",
  "18:00:00",
  "18:15:00",
  "18:30:00",
  "18:45:00",
  "20:00:00",
  "20:30:00",
  "21:00:00",
  "21:15:00",
  "21:30:00",
  "21:45:00",
  "22:00:00",
  "22:15:00",
  "22:30:00",
  "22:45:00",
  "00:00:00",
  "00:15:00",
  "00:30:00",
];

// Function to insert mock screen data
async function insertMockScreens() {
  const now = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(now.getDate() + 3);

  for (let i = 0; i < 30; i++) {
    const theaterId = faker.number.int({ min: 1, max: 15 });
    const slotId = faker.number.int({ min: 0, max: slotTimes.length - 1 });

    const screenData = {
      theater_id: theaterId,
      movie_id: faker.number.int({ min: 1, max:  5}),
      slot_id: slotId+1,
      show_time: slotTimes[slotId],
      date: faker.date
        .between({ from: now, to: threeDaysLater })
        .toISOString()
        .slice(0, 10),
      available_capacity: faker.number.int({ min: 50, max: 100 }),
      total_capacity: faker.number.int({ min: 100, max: 150 }),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      screen_number: `${theaterId}-0${faker.number.int({ min: 1, max: 3 })}`,
    };
    console.log(screenData);

    try {
      // Check for existing show with the same theater_id, screen_number, slot_id, and date
      const checkQuery = `
                SELECT 1 FROM screen 
                WHERE theater_id = $1 
                AND screen_number = $2 
                AND slot_id = $3 
                AND date = $4 
                LIMIT 1
            `;

      const existingShow = await pool.query(checkQuery, [
        screenData.theater_id,
        screenData.screen_number,
        screenData.slot_id,
        screenData.date,
      ]);

      if (existingShow.rows.length > 0) {
        console.log("Duplicate show found, skipping insertion.");
      } else {
        // Insert the new show if no duplicates are found
        const insertQuery = `
                    INSERT INTO screen 
                    (theater_id, movie_id, slot_id, show_time, date, available_capacity, total_capacity, is_active, created_at, updated_at, screen_number)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                `;

        await pool.query(insertQuery, [
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
      }
    } catch (error) {
      console.error("Error inserting screen:", error.code, error.detail);
    }
  }
}

const runInsertionJob = async (req, res, next) => {
  try {
    console.log("Populating screens with movie and theatre references...");
    await insertMockScreens();
    res.status(200).json("All screens inserted successfully")
  } catch (error) {
    console.error("Error inserting:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Uncomment to schedule job to run daily at 6:00 AM
// cron.schedule('0 6 * * *', () => {
//     runInsertionJob();
// });

// Initial run
module.exports = { runInsertionJob };
