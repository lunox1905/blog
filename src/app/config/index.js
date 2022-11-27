const mongoose = require('mongoose')

const url = process.env.URL
async function connect () {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connect DB successfuly')
    } catch(err) {
        console.log('connect DB error')
    }
}

module.exports = { connect }