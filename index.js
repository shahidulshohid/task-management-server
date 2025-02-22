const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const post = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wnw5g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const taskCollection = client.db("taskManagement").collection("tasks");
    const usersCollection = client.db("taskManagement").collection("users");

    // add task
    app.post("/addTask", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      console.log(result);
      res.send(result);
    });

    //get all tasks 
    app.get('/tasks', async(req, res) => {
      const email = req.query.email
      const query = {email: email}
      const result = await taskCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/tasksOne/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await taskCollection.findOne(query)
      res.send(result)
    })

    app.patch("/tasksUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const task = req.body;
      const option = { upsert: true };
      const updateDoc = {
        $set: task,
      };
      const result = await taskCollection.updateOne(query, updateDoc, option);
      res.send(result);
        });

    // delete task 
    app.delete('/tasks/:id', async(req, res) => {
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await taskCollection.deleteOne(query)
      res.send(result)
    })

    app.post("/users", async (req, res) => {
      const task = req.body;
      const result = await usersCollection.insertOne(task);
      console.log(result);
      res.send(result);
    });

    app.get('/users', async(req, res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("task management server is running");
});

app.listen(post, () => {
  console.log(`task management server is running on port ${post}`);
});
