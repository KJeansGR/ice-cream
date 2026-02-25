//import express module // this is why you add "type: module"
import express from 'express';

//create an express application
const app = express();

//define aport number where the servervwill listen
const PORT = 3002;

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

    /*
                <th> Time</th>
                <th> Customer</th>
                <th> Email</th>
                <th>Flavor</th>
                <th>Cone</th>
                <th>Toppings</th>
    */
    //store data
    const order ={
        Time: new Date().toLocaleString(),
        Customer: req.body.name,
        Email: req.body.email,
        Flavor: req.body.flavor,
        Cone: req.body.cone || "none",
        Toppings: req.body.toppings,
        //AdditionalComments: req.body.comments
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