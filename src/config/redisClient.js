const { createClient } = require('redis'); // Use require instead of import
const dotenv = require('dotenv');


dotenv.config();  // Load environment variables from .env

// const redisClient = createClient({
//   password: process.env.redisKey, // Replace with actual password
//   socket: {
//     host: process.env.REDIS_HOST , // Redis Cloud endpoint
//     port:process.env.REDIS_PORT || 17698, // Redis port
//   }
// });



const redisClient = createClient({
    password: process.env.REDIS_KEY,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});


const redisReservedClient = createClient ({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });


redisClient.connect()
    .then(() =>{
         console.log('Connected to Redis Cloud')
         try {
            redisClient.flushAll(); // Use flushAll() to clear all databases
           console.log('Successfully flushed Redis database.');
       } catch (error) {
           console.error('Error flushing Redis database:', error);
       }
    })
    .catch((err) => console.error('Redis connection error:', err));

    

 redisReservedClient.connect()
.then(() => {console.log('Connected to Redis Upstash Cloud')})
.catch((err) => console.error('Redis connection error:', err));

module.exports= {redisClient, redisReservedClient};
