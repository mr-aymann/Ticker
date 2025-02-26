const pool = require("../config/db");
const { faker } = require("@faker-js/faker");
const cron = require("node-cron");

// Constants for show generation
const SHOW_TIMES = [
    "09:00:00", "11:30:00", "14:30:00", 
    "17:30:00", "20:30:00", "22:45:00"
];

const MOVIE_IDS = [4, 1, 2, 3, 7, 5, 6, 22, 8, 26, 9, 16, 27, 24, 18];
const THEATRE_IDS = [1, 2, 3, 7, 8, 9, 12, 13, 14];

// Seating configuration
const SEATING_CONFIG = {
    CLASSIC_ROWS: 8,
    ROYAL_ROWS: 4,
    EXCLUSIVE_ROWS: 2,
    SEATS_PER_ROW: 20
};

// Calculate total capacity based on seating configuration
function getTotalCapacity() {
    const { CLASSIC_ROWS, ROYAL_ROWS, EXCLUSIVE_ROWS, SEATS_PER_ROW } = SEATING_CONFIG;
    return (CLASSIC_ROWS + ROYAL_ROWS + EXCLUSIVE_ROWS) * SEATS_PER_ROW;
}

// Generate screen data for a specific show
function generateScreenData(theaterId, screenNum, showTime, date) {
    const totalCapacity = getTotalCapacity();
    return {
        theater_id: theaterId,
        movie_id: faker.helpers.arrayElement(MOVIE_IDS),
        slot_id: SHOW_TIMES.indexOf(showTime) + 1,
        show_time: showTime,
        date: date.toISOString().slice(0, 10),
        screen_number: `${theaterId}-0${screenNum}`,
        available_capacity: totalCapacity,
        total_capacity: totalCapacity,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
    };
}

// Insert a single screen show
async function insertScreenShow(screenData) {
    const insertQuery = `
        INSERT INTO screen 
        (theater_id, movie_id, slot_id, show_time, date, 
        available_capacity, total_capacity, is_active, 
        created_at, updated_at, screen_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    try {
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
        console.log(`Inserted: Theatre ${screenData.theater_id}, Screen ${screenData.screen_number}, Date ${screenData.date}, Time ${screenData.show_time}`);
    } catch (error) {
        console.error(`Error inserting screen: Theatre ${screenData.theater_id}, Screen ${screenData.screen_number}`, error.detail);
        throw error;
    }
}

// Clear existing future shows
async function clearFutureShows() {
    const deleteQuery = `
        DELETE FROM screen 
        WHERE date >= CURRENT_DATE 
        AND date <= CURRENT_DATE + INTERVAL '5 days'
    `;
    await pool.query(deleteQuery);
    console.log("Cleared existing future shows");
}

// Main function to insert mock screens
async function insertMockScreens() {
    const now = new Date();
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(now.getDate() + 5);

    try {
        await clearFutureShows();

        for (const theaterId of THEATRE_IDS) {
            for (let date = new Date(now); date <= fiveDaysLater; date.setDate(date.getDate() + 1)) {
                for (let screenNum = 1; screenNum <= 3; screenNum++) {
                    const numShows = faker.number.int({ min: 3, max: 4 });
                    const selectedSlots = faker.helpers.arrayElements(SHOW_TIMES, numShows);
                    
                    for (const showTime of selectedSlots) {
                        const screenData = generateScreenData(theaterId, screenNum, showTime, date);
                        await insertScreenShow(screenData);
                    }
                }
            }
        }
        return true;
    } catch (error) {
        console.error("Error in insertMockScreens:", error);
        throw error;
    }
}

// API endpoint handler
const runInsertionJob = async (req, res) => {
  try {
      console.log("Starting manual show generation...");
      await insertMockScreens();
      return res.status(200).json({
          message: "Shows generated successfully for next 5 days",
          success: true
      });
  } catch (error) {
      console.error("Error in show generation:", error);
      return res.status(500).json({ 
          error: "Failed to generate shows",
          message: error.message,
          success: false
      });
  }
};

module.exports = { 
  runInsertionJob,
  insertMockScreens  // Exported for use in scheduler
};
