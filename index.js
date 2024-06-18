const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require( 'cors');
const app = express();
const port = process.env.PORT ||5001;

//midleware 
app.use(cors());
app.use(express.json());


///coffeeShop

///zUDtn3YBtRj4XhDB



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.0f5vnoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

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
    const coffeeCollection = client.db('coffeeBD').collection('coffee')

    //upload data
    app.post('/coffee', async(req, res) =>{
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee)
        res.send(result)
    })


    app.get('/coffee', async(req, res) =>{
        const coffees = await coffeeCollection.find().toArray();
        res.send(coffees)
    })

///delete------------
    app.delete('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const quary = {_id : new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(quary);
      res.send(result);
    })
    //Update
    app.put('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const option = {upsert : true};
      const updatedCoffee = req.body;
      const coffee= {
        $set: {
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
           taste: updatedCoffee.taste,
            photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, option);
      res.send(result)
    })



    app.get('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('coffee server is runing');
})



app.listen(port, ()=>{
    console.log(`server port is: ${port}`);
})