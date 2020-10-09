const axios = require('axios'); 
const cheerio = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
require('dotenv').config()


const URL = "https://www.amazon.com/dp/B007TOHIJQ"; 



var job = new CronJob(
	'5 * * * * *',
	function() {
		axios.get(URL).then((res)=> {
			const html = res.data;
			const $ = cheerio.load(html);
			const priceString = $('#priceblock_ourprice').text();
			const price =parseFloat(priceString.replace('$',''));
			const title = $('#productTitle').text();
			if(price > 20) {
			  	sendMail();
			  	console.log(title, price);
			}		  
		});
	},
	null,
	true,
	'America/Los_Angeles'
);

async function sendMail(){
	let transporter = nodemailer.createTransport({
	    host: "smtp.gmail.com",
	    port: 587,
	    secure: false, // true for 465, false for other ports
	    auth: {
	      user: process.env.USER, // generated ethereal user
	      pass: process.env.PASS, // generated ethereal password
	    },
	  });	
  // send mail with defined transport object
	await transporter.sendMail({
		from: `"Huu Thang" ${process.env.USER}`, // sender address
		to: process.env.EMAIL, // list of receivers
		subject: "Price change", // Subject line
		text: "Alert!!! Price changed", // plain text body
	});
	console.log('Mail sent!');	
}