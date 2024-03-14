require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser')

// set the view engine to ejs
let path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }))

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function getInfoData() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const result = await client
      .db("quebec-database")
      .collection("quebec-collection")
      .find()
      .toArray();

    console.log("mongo call await inside function: ", result);

    return result;
    //await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  catch (err) {
    console.log("getInfoData() error:", err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

// read from mongo
app.get('/', async (req, res) => {

  let result = await getInfoData()
    .catch(console.error);

  console.log("getInfoData() result:", result);

  res.render('index', {
    pageTitle: "Information",
    infoData: result

  });
});


// create to mongo
app.post('/addInfo', async (req, res) => {

  try {

    client.connect;
    const collection = client
      .db("quebec-database")
      .collection("quebec-collection");

    //draws from body parser
    console.log(req.body);

    await collection.insertOne(req.body);


    res.redirect('/');
  }
  catch (err) {
    console.log(err)
  }
  finally {
  }

});

app.post('/updateInfo', async (req, res) => {

  try {
    console.log("req.body: ", req.body)

    client.connect;
    const collection = client
      .db("quebec-database")
      .collection("quebec-collection");

    let result = await collection.findOneAndUpdate({
      "_id": new ObjectId(req.body.id)
    },
      {
        $set:
        {
          name: req.body.name,
          country: req.body.country,
          job: req.body.job,
          hobby: req.body.hobby,
          note: req.body.note
        }
      }
    )
      .then(result => {
        console.log(result);
        res.redirect('/');
      })
    }
    catch(error){
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  finally {}

}); 

  

app.post('/deleteInfo', async (req, res) => {

  try {
    client.connect;
    const collection = client
      .db("quebec-database")
      .collection("quebec-collection");

    //draws from body parser
    console.log(req.body);

    let result = await collection.findOneAndDelete(
      {
        "_id": new ObjectId(req.body.id)
      }
    )

    res.redirect('/');
  }
  catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  } finally {
  }
});


app.listen(port, () => {
  console.log(`Quebec app listening on port ${port}`)
})