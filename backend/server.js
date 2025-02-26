const cors = require("cors");
const app = require('./src/app');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

const pool = require("./src/config/db");

pool.connect()
    .then(() => console.log('Connected to the PostgreSQL database'))
    .then(() => pool.query("SELECT VERSION()"))
    .then(result => console.log(result.rows[0].version))
    .catch(err => console.error('Connection error', err.stack))


// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// CORS
app.use(cors());

// Server listening
app.listen(PORT, () => {
    console.log(`Listening on port no ${PORT}`);
});
