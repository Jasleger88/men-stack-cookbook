const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');



const authController = require('./controllers/auth.js')
const foodsController = require('./controllers/foods.js');

// server.js
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');


const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// server.js
app.use(passUserToView)
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/foods', foodsController);
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});

app.delete("/userId/foods/_itemId", async (req, res) => {
  try {
    const userId = await Foods.deleteOne(req.params.foodId);
    if (!req.session.user) {
      return res.redirect('/');
    }
    const user = await User.findById(userId);
    if (!req.session.user) {
      return res.redirect('/');
    }
    const itemId = req.params.itemId;
    user.pantry.id(itemId).remove();

    await user.save();
    res.redirect("/pantry");
  } catch (error) {
    console.error(error.message);
    res.redirect('/')
  }
  });


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
