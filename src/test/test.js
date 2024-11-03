const axios = require('axios');

const testReserveSeat = async (show_id, theatre_id, seat_row, seat_number, user_id,screen_number,seat_class,amount) => {
    try {
        const response = await axios.post('http://192.168.1.112:3000/api/book', {
            show_id,
            theatre_id,
            seat_row,
            seat_number,
            user_id,
            screen_number,
            seat_class,
            amount
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

// Parameters for the test
const show_id = 1; // Example show ID
const theatre_id = 1; // Example theatre ID
const seat_row = 'C'; // Example seat row
const seat_number = 1; // Example seat number
const user_id = 'user123'; // Example user ID
const screen_number='1-01';
const seat_class='Classic'
const amount=299;

// Simulate concurrent requests
const concurrencyLimit = 2; // Number of concurrent requests
const requests = [];

// Create multiple concurrent requests
for (let i = 0; i < concurrencyLimit; i++) {
    requests.push(testReserveSeat(show_id, theatre_id, seat_row, seat_number, `${user_id}_${i}`,screen_number,seat_class,amount));
}

// Execute all requests
Promise.all(requests).then(() => {
    console.log('All requests completed.');
}).catch((error) => {
    console.error('One or more requests failed:', error);
});
