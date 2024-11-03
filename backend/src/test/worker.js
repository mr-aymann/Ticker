const axios = require('axios');

// Function to reserve a seat
const testReserveSeat = async (show_id, theatre_id, seat_row, seat_number, user_id, screen_id,seat_class) => {
    try {
        const response = await axios.post('http://192.168.1.112:3000/api/book', {
            show_id,
            theatre_id,
            seat_row,
            seat_number,
            user_id,
            screen_id,
            seat_class
        });
        console.log(`Success: ${response.data.message}`);
    } catch (error) {
        if (error.response) {
            console.log(`Error: ${error.response.data.message}`);
        } else {
            console.error('Error:', error.message);
        }
    }
};

// Get parameters from parent thread
const { show_id, theatre_id, seat_row, seat_number, user_id, screen_id,seat_class } = require('worker_threads').workerData;

// Call the reserve seat function
testReserveSeat(show_id, theatre_id, seat_row, seat_number, user_id, screen_id,seat_class);
