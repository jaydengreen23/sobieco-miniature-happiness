const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =process.env.MONGO_URI;
const {ObjectId} = require('mongodb');
const session = require('express-session');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));



app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret in production
  resave: false,
  saveUninitialized: true
}));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("jaydenSobieProfile");
    const mongoCollection = db.collection("jaydenSobieCollection");
    const profilesCollection = db.collection("profiles");

    app.use((req, res, next) => {
      if (!req.session.userId) {
        req.session.userId = 'test-user-123'; // or use a valid ObjectId string if needed
      }
      next();
    })


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
  const userId = req.session.userId;
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
app.get('/edit-profile', async (req, res) => {
  const userId = req.session.userId;

  try {
    const profile = await profilesCollection.findOne({ userId });

    if (!profile) {
      return res.redirect('/create-profile');
    }

    // ✅ Pass both profile and message to the view
    res.render('edit-profile', { profile, message: null });
  } catch (err) {
    console.error('Error loading profile for edit:', err);
    res.status(500).send('Error loading profile.');
  }
});
app.post('/edit-profile', async (req, res) => {
  const userId = req.session.userId;

  const updateFields = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip
  };

  await profilesCollection.updateOne({ userId }, { $set: updateFields });

  res.redirect('/welcome'); // or wherever you want to go after editing
});
app.post('/delete-profile', async (req, res) => {
  const userId = req.session.userId;

  try {
    // Delete the profile and any related data
    await profilesCollection.deleteOne({ userId });
    await db.collection('registrations').deleteOne({ userId });

    // Optionally destroy the session
    req.session.destroy(() => {
      res.redirect('/create-profile'); // Or redirect somewhere else
    });
  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).send('Failed to delete profile.');
  }
});

app.listen(port, ()=> console.log(`server is running on .. ${port}`));
} catch (err) {
  console.error("MongoDB connection failed:", err);
}
}

startServer();