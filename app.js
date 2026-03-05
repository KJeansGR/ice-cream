//import express module // this is why you add "type: module"
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

//load environment variables
dotenv.config();

//create an express application
const app = express();

//define aport number where the servervwill listen
const PORT = 3015;

//set ejs as view engine
app.set('view engine', 'ejs');

//create a pool of database connections
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user:  process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
    port:  process.env.DB_PORT

}).promise();

//MiddleWare that allows express to read form data and store it in req.body
app.use(express.urlencoded({extended: true}))
//create temp array to store orders
const orders = [];

//define our main root ('/')
app.get('/', (req,res)=>{

    res.render(`home`);
});


// Database test route (for debugging)
app.get('/db-test', async (req, res) => {


    try {


  const orders = await pool.query('SELECT * FROM orders');

       res.send(orders[0]);


    } catch (err) {


       console.error('Database error:', err);

       res.status(500).send('Database error: ' + err.message);

    }

});



//Thankyou for order
app.post('/submit-order', (req,res)=>{
    const order ={
        Time: new Date().toLocaleString('en-US', 
        {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
         }),
        Customer: req.body.name,
        Email: req.body.email,
        Flavor: req.body.flavor,
        Cone: req.body.cone || "none",
        Toppings: req.body.toppings,
        AdditionalComments: req.body.comments
    };

    orders.push(order);
    res.render(`confirmation`, {order});
})

//admin route
app.get('/admin', (req, res)=>{
    //res.send(orders);
    res.render(`admin`, {orders});
})

//Thankyou for order
app.get('/thank-you', (req,res)=>{
    res.render(`confirmation`);
});



//start server, and listen on designated PORT
app.listen(PORT, ()=>{

    console.log(`Server is running at 
        http//:localhost:${PORT}`);
})

app.use(express.static('public'));