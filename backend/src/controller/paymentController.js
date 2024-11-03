// controllers/paymentController.js
const { redisClient } = require("../config/redisClient"); // Change to require
const Razorpay = require('razorpay');
const crypto = require('crypto');
//const seatController = require('./seatController');
const dotenv = require('dotenv');
const { redisReservedClient } = require("../config/redisClient"); // Change to require
const pool = require("../config/db");


dotenv.config()

// config/razorpay.js

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;


const initiatePayment = async (req, res) => {
  const { amount, currency, receipt,user_id } = req.body;

  if (!amount || !currency || !receipt) {
    return res.status(400).json({ message: "Missing required payment parameters." });
  }

  try {
    // Step 1: Create an order in Razorpay
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise (smallest currency unit)
      currency,
      receipt,
      payment_capture: 1, // Auto capture
    };
    console.log("line 35 : options:",options);
    const order = await razorpay.orders.create(options);
    // Check if the order object exists
    if (order && order.id) {
        return {
          status: 200,
          data: {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
          },
        };
      } else {
        throw new Error("Failed to create payment order - no response from Razorpay.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      return {
        status: 500,
        message: "Failed to initiate payment due to an error with Razorpay.",
        error: error.message,
      };
    }
  };


const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, receiptId } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !receiptId) {
    return res.status(400).json({ message: "Missing required payment verification parameters." });
  }

  try {
    // Step 2: Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment verification signature." });
    }

    // Step 3: Finalize reservation upon successful payment verification
    
    const finalReservationResponse = await finalReservation({ body: { receiptId , order_id: razorpayOrderId}, });
    console.log(finalReservationResponse)
    if (finalReservationResponse.status === 200) {
      res.status(200).json({
        message: "Payment verified and reservation finalized successfully.",
        reservation: finalReservationResponse.data,
      });
    } else {
      res.status(500).json({ message: "Error finalizing reservation after payment verification." });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment." });
  }
};

const finalReservation = async (req, res) => {
    const { receiptId, order_id } = req.body;
  
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
  
      if (seatResult.rows.length > 0 ) {
        await pool.query("ROLLBACK");
        return res.status(409).json({ message: "Seat already booked by another user in DB." });
      }
  
      // Step 3: Insert final reservation in the database
      const reserveQuery = `
        INSERT INTO seat_reservations (show_id, theater_id, seat_row, seat_number, user_id, screen_number, seat_class, order_id, status, reserved_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,'booked', NOW())
        ON CONFLICT (theater_id, screen_number, seat_row, seat_number) DO NOTHING
        RETURNING *;
      `;
      const reserveResult = await pool.query(reserveQuery, [show_id, theatre_id, seat_row, seat_number, user_id, screen_number, seat_class,order_id]);
  
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
      
    }
    catch (redisError) {
        console.error("Error updating Redis cache:", redisError);
        res.status(500).send({ message: "Internal Server Error in Redis" });
    }
      
      
    return { error: false, data: reserveResult.rows[0], status: 200 };

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

module.exports = {
  initiatePayment,
  verifyPayment,
};
