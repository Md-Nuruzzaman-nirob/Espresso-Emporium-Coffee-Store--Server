const express = require('express');
const cors = require('cors');
require("dotenv").config();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


// mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxwgpuv.mongodb.net/?retryWrites=true&w=majority`;

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

        const database = client.db("coffeeDB");
        const coffeeCollections = database.collection("coffees");

        // get || read
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollections.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // post || create
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body
            const result = await coffeeCollections.insertOne(newCoffee)
            res.send(result);
        })

        // put || update
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const updatedCoffee = req.body
            const filter = {
                _id: new ObjectId(id)
            }
            const option = {
                upsert: true
            }
            const updatingCoffee = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo,
                }
            }
            const result = await coffeeCollections.updateOne(filter, updatingCoffee, option)
            res.send(result)
        })

        //delete 
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await coffeeCollections.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('website is working')
})

app.listen(port, () => {
    console.log('port are running on', port);
})