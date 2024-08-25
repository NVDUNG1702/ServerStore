
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anhy1st@gmail.com',
        pass: 'vhjs vzaq eevz vkga'
    }
});


module.exports = {
    transporter
}