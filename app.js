const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
var bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set Static Folder
app.use(express.static(`${__dirname}\public`))

// Index Route
app.get('/', (req, res)=>{
res.render('index', {
    stripePublishableKey: keys.stripePublishableKey
  });
});

// app.get('/success', (req,res)=>{
// res.render('success')
// })

// Charge Route
app.post('/charge', (req, res) => {
const amount = 1500;
// console.log(req.body);
// res.send('Test');
stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Web Development Ebook',
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});
const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})