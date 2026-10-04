const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const { connectMongo } = require('./config/mongo');
connectMongo().catch(err => console.error('MongoDB connection failed:', err));


const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files and body parsing
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions (must come before routes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'campus-eats-dev-secret',
  resave: false,
  saveUninitialized: false,
}));

// Make the logged-in user available to every view
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes (after sessions)
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Start server (last)
app.listen(PORT, () => {
  console.log(`Campus Eats running at http://localhost:${PORT}`);
});