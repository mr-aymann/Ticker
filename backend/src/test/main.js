const { Worker } = require('worker_threads');

// Function to create worker threads
const createWorker = (show_id, theatre_id, seat_row, seat_number, user_id, screen_id,seat_class) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', {
            workerData: { show_id, theatre_id, seat_row, seat_number, user_id, screen_id,seat_class }
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            } else {
                resolve();
            }
        });
    });
};

// Parameters for the test
const show_id = 1; // Example show ID
const theatre_id = 1; // Example theatre ID
const seat_row = 'A'; // Example seat row
const seat_number = 10; // Example seat number
const user_id = 'user123'; // Example user ID
const screen_id = 11;
const seat_class='Classic';

// Simulate concurrent requests
const concurrencyLimit = 25; // Number of concurrent requests
const workerPromises = [];

// Create multiple worker threads
for (let i = 0; i < concurrencyLimit; i++) {
    const userIdWithIndex = `${user_id}_${i}`; // Unique user ID for each thread
    workerPromises.push(createWorker(show_id, theatre_id, seat_row, seat_number, userIdWithIndex, screen_id,seat_class));
}

// Execute all worker threads
Promise.all(workerPromises)
    .then(() => {
        console.log('All requests completed.');
    })
    .catch((error) => {
        console.error('One or more requests failed:', error);
    });
