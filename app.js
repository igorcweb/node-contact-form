// In order for the app to work, you must enter real infromation inside of the creds.json file
const express = require('express'),
   bodyParser = require('body-parser'),
   exphbs     = require('express-handlebars'),
   path       = require('path'),
   nodemailer = require('nodemailer'),
   creds          = require("./creds"),
   app        = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message<h3/>
    <p>${req.body.message}</p>
  `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(
      {
        service:
          creds.service,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: creds.user, // generated ethereal user
          pass: creds.pass // generated ethereal password
        },
        //If using a local host
        tls: {
          rejectUnathorized: false
        }
      }
    );
    // setup email data with unicode symbols
    let mailOptions = { from: `${creds.name} <${creds.user}>`, 
                        to: creds.to, 
                        subject: creds.subject, 
                        text: "Hello world?", 
                        html: output }; // sender address // list of receivers // Subject line // plain text body // html body

    // send mail with defined transport object
    transporter.sendMail(
      mailOptions,
      (error,info) => {
        if (error) {
          return console.log(
            error
          );
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        
        res.render('contact', {msg: 'Email has been sent'});
      });
  });
app.listen(3000, () => {
  console.log('Server is running');
});