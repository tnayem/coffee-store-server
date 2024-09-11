const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json())
app.use(cors())

// console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ycg9h6w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const coffeeCollection = client.db('coffeeDb').collection('coffee')
        const userCollection = client.db('coffeeDb').collection('user')
        // Post data from client side to server side
        app.post('/coffee',async(req,res)=>{
            const newCoffee = req.body 
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        })
        // Get data from server
        app.get('/coffee',async(req,res)=>{
            const result = await coffeeCollection.find().toArray()
            res.send(result)
        })
        // Get spacific coffee from server
        app.get('/coffee/:id', async(req,res)=>{
            const id = req.params.id 
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })
        // Delete data from server
        app.delete('/coffee/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })
        // Update Coffe 
        app.put('/coffee/:id', async(req,res)=>{
            const id = req.params.id 
            const query = {_id : new ObjectId(id)}
            const options = { upsert: true };
            const updateCoffe = req.body
            const coffe = {
                $set:{
                    coffeeName:updateCoffe.coffeeName,
                    chefName:updateCoffe.chefName,
                    coffeeSupplier:updateCoffe.coffeeSupplier,
                    coffeeTaste:updateCoffe.coffeeTaste,
                    coffeeCategory:updateCoffe.coffeeCategory,
                    coffeeDetails:updateCoffe.coffeeDetails,
                    photoURL: updateCoffe.photoURL
                }
            }
            const result = await coffeeCollection.updateOne(query,coffe,options)
            res.send(result)
        })
        // Post user info from client side to database 
        app.post('/user',async(req,res)=>{
            const user = req.body 
            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to my MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log(`App is running from port ${port}`)
})