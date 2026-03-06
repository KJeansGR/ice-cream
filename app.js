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
app.post('/submit-order', async(req,res)=>{

    try {
    const order = req.body;
    console.log('New order submitted:', order);

    // SQL INSERT query with placeholders to prevent SQL injection
    const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings) 
                VALUES (?, ?, ?, ?, ?);`;
    const params = 
    [
        req.body.name,
        req.body.email,
        req.body.flavor,
        req.body.cone || "none",
        Array.isArray(req.body.toppings) ? 
        req.body.toppings.join(", ") : ""
    ];

    const result = await pool.execute(sql, params);

    console.log('Order saved with ID:', result[0].insertId);
    console.log('New order submitted:', order);
    // orders.push(order);
    res.render(`confirmation`, {order});

    } catch (err) {
        console.error('Error saving order:', err);
        res.status(500).send('Sorry, there was an error processing your order. Please try again.');
    }
})

// Display all orders
app.get('/admin', async (req, res) => {
    try {
        // Fetch all orders from database, newest first
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');  
        // Render the admin page
        res.render('admin', { orders });        
    }
    catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
});

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