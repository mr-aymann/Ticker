const fs = require('fs');
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();


const config = {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD, // Use your actual password here
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    max: 20, // Adjust based on your application's needs
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
        rejectUnauthorized: false, // Set to true for production with valid certificates
        ca:process.env.CA_CERT_PATH // Use the CA certificate file
    },
};

const client = new Client(config);

module.exports = client;
