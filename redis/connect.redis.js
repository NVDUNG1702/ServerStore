
// const redis = require('redis');

// const client = redis.createClient({
//     port: 6379,
//     host: '127.0.0.1'
// });

// client.on('connect', ()=>{
//     console.log('connect redis success');
// });

// client.on('error', (err)=>{
//     console.log('Error connecting to Redis server: ', err);
// })

// client.on('ready', ()=>{
//     console.log('redis to ready');
// })

// client.ping((error, pong)=>{
//     console.log(pong);
// })


// module.exports = client