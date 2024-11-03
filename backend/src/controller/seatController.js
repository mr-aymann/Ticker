const { redisClient } = require("../config/redisClient"); // Change to require
const { redisReservedClient } = require("../config/redisClient"); // Change to require
const paymentController = require('./paymentController');
const pool = require("../config/db");
const RefreshToken = require("../schemas/refreshToken");
const User = require("../schemas/user");

// Fetch seat layout by theatre ID and screen number and format as JSON
// const getSeatLayoutByTheatre = async (req, res) => {
//     const { tid, sno, slot_id, date } = req.query;

//     if (!tid || !sno) {
//         return res.status(400).json({ error: 'Theatre ID and screen number are required' });
//     }

//     try {

//         // Fetch the show ID based on theater ID, slot ID, date, and screen number
//         const showQuery = `
//             SELECT id AS show_id
//             FROM screen
//             WHERE theater_id = $1
//               AND slot_id = $2
//               AND date = $3
//               AND screen_number = $4;
//         `;
//         const showResult = await pool.query(showQuery, [tid, slot_id, date, sno]);
//         if (showResult.rows.length === 0) {
//             return res.status(404).json({ message: 'No shows found for the given theatre and screen At that particular time' });
//         }

//         const { show_id } = showResult.rows[0];
//         const redisKey = `reserved_seat:${show_id}`;
//         const cachedSeats = await redisReservedClient.get(redisKey);
//         const reservedSeats = cachedSeats ? JSON.parse(cachedSeats) : [];

//         const query = `
//             SELECT
//                 sl.seat_class,
//                 sl.row,
//                 sl.seat_numbers,
//                 sl.seat_gaps,
//                 sl.price,
//                 t.name AS theater_name,
//                 sl.screen_number
//             FROM
//                 seat_layout sl
//             JOIN
//                 theaters t ON sl.theater_id = t.id
//             WHERE
//                 sl.theater_id = $1 AND sl.screen_number = $2
//             ORDER BY
//                 sl.seat_class, sl.row;
//         `;
//         const values = [tid, sno];
//         const result = await pool.query(query, values);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: 'No seat layout found for the given theatre and screen' });
//         }

//         const { theater_name, screen_number } = result.rows[0];
//         const layout = {
//             theater_name,
//             screen_number,
//             seat_layout: []
//         };

//         const seatClasses = {};

//         for (const row of result.rows) {
//             const seatClass = row.seat_class;
//             const seatRow = row.row;
//             const seatNumbers = row.seat_numbers;
//             const price = row.price;

//             if (!seatClasses[seatClass]) {
//                 seatClasses[seatClass] = {
//                     name: seatClass,
//                     seats: [],
//                     price
//                 };
//             }

//             for (const seatNumber of seatNumbers) {
//                 const isReserved = reservedSeats.some(seat =>
//                     seat.seat_row === seatRow && seat.seat_number === seatNumber
//                 ) ? 'booked' : 'free';

//                 seatClasses[seatClass].seats.push({
//                     row: seatRow,
//                     number: seatNumber,
//                     status: isReserved
//                 });
//             }
//         }

//         Object.values(seatClasses).forEach(seatClass => {
//             layout.seat_layout.push(seatClass);
//         });

//         res.status(200).json(layout);
//     } catch (error) {
//         console.error('Error fetching seat layout:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const getSeatLayoutByTheatre = async (req, res) => {
  const { tid, sno, slot_id, date } = req.query;

  if (!tid || !sno) {
    return res
      .status(400)
      .json({ error: "Theatre ID and screen number are required" });
  }

  try {
    // Fetch show ID
    const showQuery = `
            SELECT show_id AS show_id 
            FROM screen 
            WHERE theater_id = $1 
              AND slot_id = $2 
              AND date = $3 
              AND screen_number = $4;
        `;

    const showValues = [tid, slot_id, date, sno];
    const showResult = await pool.query(showQuery, showValues);

    if (showResult.rows.length === 0) {
      return res.status(400).json({
        message:
          "No shows found for the given theatre and screen at that particular time",
      });
    }

    const { show_id } = showResult.rows[0];

    // Construct the Redis key and get reserved seats
    const redisKey = `reserved_seat:${show_id}`;
    const cachedSeats = await redisReservedClient.get(redisKey);
    const reservedSeats = cachedSeats ? JSON.parse(cachedSeats) : [];

    // Fetch seat layout
    const query = `
            SELECT
                sl.seat_class,
                sl.row,
                sl.seat_numbers,
                sl.seat_gaps,
                sl.price,
                t.name AS theater_name,
                sl.screen_number
            FROM
                seat_layout sl
            JOIN
                theaters t ON sl.theater_id = t.id
            WHERE
                sl.theater_id = $1 AND sl.screen_number = $2
            ORDER BY
                sl.price DESC,
                sl.row DESC;
        `;
    const values = [tid, sno];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "No seat layout found for the given theatre and screen",
      });
    }

    const layout = {
      theater_name: result.rows[0].theater_name,
      screen_number: result.rows[0].screen_number,
      seats: [],
    };

    // Organize seats by class
    const seatClasses = result.rows.reduce((acc, row) => {
      const { seat_class, row: seatRow, seat_numbers: seatNumbers, seat_gaps: seatGaps, price } = row;

      if (!acc[seat_class]) {
        acc[seat_class] = { name: seat_class, seats: [], price: price };
      }

      const seatValues = [];
      const seatStatus = [];

      let gapIndex = 0;
      seatNumbers.forEach((seatNumber, index) => {
        const isReserved = reservedSeats.some(
          (seat) => seat.seat_class === seat_class && seat.seat_row === seatRow && seat.seat_number === seatNumber
        );

        // Check if there's a gap
        if (seatGaps[index]) {
          seatValues.push(-1); // Representing gap with -1
          seatStatus.push("gap");
          gapIndex++; // Move to the next gap
        } else {
          seatValues.push(seatNumber);
          seatStatus.push(isReserved ? "booked" : "free");
        }
      });

      acc[seat_class].seats.push({
        row: seatRow,
        values: seatValues,
        status: seatStatus,
      });

      return acc;
    }, {});

    layout.seats = Object.values(seatClasses);
    res.status(200).json(layout);
  } catch (error) {
    console.error("Error fetching seat layout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Function to temporarily cache seat reservation in Redis for in-progress transactions
async function cacheOrderSeat(
  show_id,
  theatre_id,
  seat_row,
  seat_number,
  seat_class,
  user_id
) {
  // Create the Redis key for this seat reservation
  const key = `order_seat:${show_id}:${theatre_id}:${seat_row}:${seat_number}:${seat_class}`;

  // Check if the seat is already in progress
  const existingUserId = await redisClient.get(key);

  if (existingUserId) {
    if (existingUserId === user_id) {
      // If the seat is in progress for the same user, allow them to proceed
      console.log(`User ${user_id} is continuing with their order.`);
      return {
        success: true,
        message: "You can proceed with payment.",
      };
    } else {
      // If the seat is reserved by another user, block the transaction
      console.log(
        `Seat already in progress(order) by another user: (${existingUserId}).`
      );
      return {
        success: false,
        message: "Seat is currently being ordered by another user.",
      };
    }
  }
  // If the seat is in progress for the same user or no user, allow transaction and set user ID
  await redisClient.set(key, user_id, { EX: 120 }); // Set a temporary lock for 500 seconds
  console.log(`Seat reservation in progress for user ${user_id}.`);

  return { success: true, message: "Seat reservation in progress." };
}

// Reserve Seat API with Transaction Timeout, Deadlock Detection, and Redis Caching
const reservedSeat = async (req, res) => {
  const {
    show_id,
    theatre_id,
    seat_row,
    seat_number,
    user_id,
    screen_number,
    seat_class,
    amount,
  } = req.body;

  // Input validation
  if (
    !show_id ||
    !theatre_id ||
    !seat_row ||
    !seat_number ||
    !user_id ||
    !screen_number ||
    !seat_class
  ) {
    return res.status(400).send({ message: "Missing required parameters." });
  }
  

  try {

    // Set transaction timeout to 10 seconds to avoid long locks
    await pool.query("SET LOCAL statement_timeout = '600';"); // 10 seconds timeout

    // Check Redis cache for seat reservation status first

    // Generate unique receipt ID for tracking
    const receiptId = `receipt_${show_id}_${theatre_id}_${seat_row}_${seat_number}_${seat_class}_${user_id}`;

    // Step 1: Check Redis to see if another user is holding this seat
    const redisKey = `order_seat:${show_id}:${theatre_id}:${seat_row}:${seat_number}:${seat_class}`;
    const cachedUserId = await redisClient.get(redisKey);

    if (cachedUserId && cachedUserId !== user_id) {
      console.log(
        `Seat is currently reserved by another user (${cachedUserId}).`
      );
      return res.status(409).json({ message: "Seat reservation in progress by another user." });
    }
 
    // Lock the specific row for updates, but allow others to read the table freely.
    const seatQuery = `
            SELECT * FROM seat_reservations 
            WHERE show_id = $1 AND theater_id = $2 AND seat_row = $3 AND seat_number = $4
            FOR NO KEY UPDATE; -- Lock the row for update by this transaction only
        `;
    const seatResult = await pool.query(seatQuery, [
      show_id,
      theatre_id,
      seat_row,
      seat_number,
    ]);

    if (seatResult.rows.length > 0 && seatResult.rows[0].status === "booked") {
      // Seat is already booked
      await pool.query("ROLLBACK");
      return res.status(409).send({ message: "Seat already booked.(DB hit)" });
    } else {
      // Cache the reserved seat in Redis for future requests
      await cacheOrderSeat(show_id, theatre_id, seat_row, seat_number,seat_class,user_id);
    }

    // Step 3: Store reservation details in Redis with the receipt ID as the key
    const reservationData = JSON.stringify({ show_id, theatre_id, seat_row, seat_number, user_id, screen_number, seat_class });
    await redisClient.set(receiptId, reservationData, { EX: 600 }); // Hold reservation details for 10 minutes

     // Step 4: Initiate payment through paymentController
     const paymentResult = await paymentController.initiatePayment({
      body: { amount, currency:'INR', receipt:receiptId },
    });

    if (paymentResult.status === 200) {
      return res.status(200).json({
        message: "Seat reserved temporarily, awaiting payment.",
        orderId: paymentResult.data.orderId,
        amount: paymentResult.data.amount,
        currency: paymentResult.data.currency,
        receipt: receiptId,
      });
    } else {
      // Clear Redis reservation on payment initiation failure
      await redisClient.del(redisKey);
      await redisClient.del(receiptId);
      return res.status(500).json({ message: "Failed to initiate payment." });
    }
  } catch (error) {
    console.error("Error in reservedSeat:", error);
    await redisClient.del(redisKey); // Clean up Redis in case of error
    res.status(500).json({ message: "Error reserving seat." });
  }
};
   

// controllers/seatController.js

const finalReservation = async (req, res) => {
  const { receiptId } = req.body;

  try {

    // Step 1: Retrieve reservation data from Redis
    const reservationData = await redisClient.get(receiptId);
    if (!reservationData) {
      return res.status(404).json({ message: "Reservation data not found." });
    }

    const { show_id, theatre_id, seat_row, seat_number, user_id, screen_number, seat_class } = JSON.parse(reservationData);

    await pool.query("BEGIN");

     // Set transaction timeout to 10 seconds to avoid long locks
     await pool.query("SET LOCAL statement_timeout = '600';"); // 10 seconds timeout

    // Step 2: Check for existing booking in the database to handle concurrency
    const seatQuery = `
      SELECT * FROM seat_reservations 
      WHERE show_id = $1 AND theater_id = $2 AND seat_row = $3 AND seat_number = $4
      FOR NO KEY UPDATE;
    `;
    const seatResult = await pool.query(seatQuery, [show_id, theatre_id, seat_row, seat_number]);

    if (seatResult.rows.length > 0 && seatResult.rows[0].status === "booked") {
      await pool.query("ROLLBACK");
      return res.status(409).json({ message: "Seat already booked by another user in DB." });
    }

    // Step 3: Insert final reservation in the database
    const reserveQuery = `
      INSERT INTO seat_reservations (show_id, theater_id, seat_row, seat_number, user_id, screen_number, seat_class, status, reserved_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'booked', NOW())
      ON CONFLICT (theater_id, screen_number, seat_row, seat_number) DO NOTHING
      RETURNING *;
    `;
    const reserveResult = await pool.query(reserveQuery, [show_id, theatre_id, seat_row, seat_number, user_id, screen_number, seat_class]);

    if (reserveResult.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(409).json({ message: "Seat booking failed due to concurrency issues." });
    }

    await pool.query("COMMIT");
    const newReservedSeat = {
      seat_row,
      seat_number,
      seat_class,
    };

    // Redis key for reserved seats
    const seatRedisConfirmkey = `reserved_seat:${show_id}`;

    try {
      // Get the existing data from Redis
      const existingData = await redisReservedClient.get(seatRedisConfirmkey);

      let reservedSeats = [];
      if (existingData) {
        // Parse existing data if any
        reservedSeats = JSON.parse(existingData);
      }

      // Append the new reservation
      reservedSeats.push(newReservedSeat);

      // Update Redis with the combined array and set expiration to 1 day (86400 seconds)
      await redisReservedClient.set(
        seatRedisConfirmkey,
        JSON.stringify(reservedSeats),
        { EX: 86400 }
      );
    } catch (redisError) {
      console.error("Error updating Redis cache:", redisError);
      res.status(500).send({ message: "Internal Server Error in Redis" });
    }

    res.status(200).json({
      message: "Reservation finalized successfully.",
      reservation: reserveResult.rows[0],
    });
  } catch (error) {
    await pool.query("ROLLBACK"); // Rollback in case of error
    console.error("Error reserving seat:", error);

    // Handle deadlock and timeout errors
    if (error.code === "40P01") {
      // Deadlock detected
      return res
        .status(503)
        .send({ message: "Deadlock detected, please try again." });
    }
    if (error.code === "57014") {
      // Query cancelled due to timeout
      return res
        .status(503)
        .send({ message: "Transaction timed out, please try again." });
    }

    res.status(500).send({ message: "Internal Server Error" });
  }
};




module.exports = { getSeatLayoutByTheatre, reservedSeat ,finalReservation};
