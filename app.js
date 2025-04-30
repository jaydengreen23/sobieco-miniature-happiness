const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =process.env.MONGO_URI;
const {ObjectId} = require('mongodb');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))

//begin all my middle wares

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//const db = "vi-database";
async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("jaydenSobieProfile");
    const mongoCollection = db.collection("jaydenSobieCollection");
    const profilesCollection = db.collection("profiles");


app.get('/', async function (req, res) {
  let results = await mongoCollection.find({}).toArray();

  res.render('profile',{profileData:results});
})
//*********************************************** */
// Create profile
app.get('/create-profile', (req, res) => {
  res.render('create-profile',{message: null});  
});
app.post('/create-profile', async (req, res) => {
  const { firstname, lastname, email, phone, birthdate, gender, city, state, zip } = req.body;
  
  // Validation (make sure all fields are filled)
  if (!firstname || !lastname || !email || !phone || !birthdate || !gender) {
    return res.render('create-profile', { message: 'Please fill in all required fields.' });
  }

  // Prepare the data to insert into MongoDB
  const userId = 'example-id'; // TODO: Replace with actual session user later
  const profileData = {
    userId,
    firstname,
    lastname,
    email,
    phone,
    birthdate,
    gender,
    city,
    state,
    zip,
  };

  try {
    // Insert the data into MongoDB collection
    await db.collection('profiles').insertOne(profileData);

    // Redirect to the welcome page after successful creation
    res.redirect('/welcome');
  } catch (err) {
    console.error(err);
    res.render('create-profile', { message: 'Error saving profile. Please try again.' });
  }
});
//****************************************************** */
//Welcome screen
app.get('/welcome', async (req, res) => {
  try {
    const userId = req.session?.userId || 'example-id'; // Simulate user session
    const profile = await profilesCollection.findOne({ userId });

    if (!profile) {
      return res.redirect('/create-profile');
    }

    // Simulate registration (optional)
    const registration = await db.collection('registrations').findOne({ userId });

    res.render('welcome', { profile, registration });
  } catch (err) {
    console.error(err);
    res.send("Error loading welcome page.");
  }
});
//****************************************************** */
//Registration form
// Show the registration form
app.get('/registration-form', (req, res) => {
  res.render('registration-form');
});

// Handle registration form submission
app.post('/registration-form', async (req, res) => {
  const userId = 'example-id'; // replace with session user later
  const data = {
    userId,
    firstTime: req.body['first-time'],
    isStudent: req.body['is-student'],
    submitResearch: req.body['submit-research'],
    submissionTitle: req.body['submission-title'],
    coAuthors: req.body['co-authors'],
    abstract: req.body['abstract'],
    researchArea: req.body['research-area'],
    includeInProceedings: req.body['include-in-proceedings'],
  };

  try {
    const registrationCollection = db.collection('registrations');
    await registrationCollection.updateOne(
      { userId },
      { $set: data },
      { upsert: true }
    );

    res.redirect('/welcome');
  } catch (err) {
    console.error('Error saving registration:', err);
    res.status(500).send('Error saving registration.');
  }
});
//****************************************************** */
// Update profile
app.post('/update-profile', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login');

  const updateFields = {
    firstname: req.body.firstname,
    middlename: req.body.middlename,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip
  };

  await db.collection('profiles').updateOne(
    { userId },
    { $set: updateFields },
    { upsert: true }
  );

  res.redirect('/profile');
});


app.listen(port, ()=> console.log(`server is running on .. ${port}`));
} catch (err) {
  console.error("MongoDB connection failed:", err);
}
}

startServer();