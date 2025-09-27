const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express()

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(process.env.MONGO_URI);

// schemas
const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
});

const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date,
})

// API routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async(req, res) => {
  try {
    const user = new User({username: req.body.username});
    await user.save;

    res.json({username: user.username, _id: user._id});
  } catch (err) {
    res.status(400).json({error: err});
  }
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({}, { __v: 0 });
  res.json(users);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const {description, duration, date} = req.body;
  const userId = req.params._id;

  const user = await User.findById(userId);
  if (!user) return res.json({error: "User not found"});

  const exerciseDate = date ? new Date(date) : new Date();
  if (isNaN(exerciseDate.getTime())) {
    return res.json({error: "Invalid date"});
  }

  const exercise = new Exercise({
    userId,
    description,
    duration: parseInt(duration),
    date: exerciseDate,
  });

  await exercise.save();

  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString(),
    _id: user._id,
  });
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const {from, to, limit} = req.query;
  const userId = req.params._id;

  const user = await User.findById(userId);
  if (!user) return res.json({ error: "User not found" });

  let filter = { userId };
  let dateFilter = {};

  if (from) dateFilter.$gte = new Date(from);
  if (to) dateFilter.$lte = new Date(to);
  if (Object.keys(dateFilter).length) filter.date = dateFilter;

  let query = Exercise.find(filter, {__v: 0, userId: 0});

  if (limit) query = query.limit(parseInt(limit));

  const exercises = await query.exec();

  const log = exercises.map((e) => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString(),
  }));

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
