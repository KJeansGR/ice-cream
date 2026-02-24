//import express module // this is why you add "type: module"
import express from 'express';

//create an express application
const app = express();

//define aport number where the servervwill listen
const PORT = 3000;

//set ejs as view engine
app.set('view engine', 'ejs');

//MiddleWare that allows express to read form data and store it in req.body
app.use(express.urlencoded({extended: true}))
//create temp array to store orders
const orders = [];

//define our main root ('/')
app.get('/', (req,res)=>{

    res.render(`home`);
});

//Thankyou for order
app.post('/submit-order', (req,res)=>{

    //store data
    const order ={
        // FirstName: req.body.fname,
        // LastName: req.body.lname,
        // email: req.body.email,
        // DeliveryMethod: req.body.method,
        // Toppings: req.body.toppings || "none",
        // PizzaSize:  req.body.size,
        // ExtraInstructions: req.body.comment,
        // timestamp : new Date().toLocaleString()
    };

    orders.push(order);
    //res.send(orders); // displays the json of orders array
    res.render(`confirmation`, {order});
    //res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
});

//admin route
app.get('/admin', (req, res)=>{
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