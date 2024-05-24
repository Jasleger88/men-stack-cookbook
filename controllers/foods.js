// controllers/foods.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    res.render('foods/index.ejs', { pantry: currentUser.pantry })
  }
  catch (error) {
    console.error(error.message)
    res.redirect("/")
  }
});

router.get("/new", (req, res) => {
  res.render('foods/new.ejs')
});

router.post("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    currentUser.pantry.push(req.body)
    await currentUser.save()
    res.render('foods/index.ejs', { pantry: currentUser.pantry })
  }
  catch (error) {
    console.error(error.message)
    res.redirect("/")
  }
});

router.delete("/users/:userId/foods/:itemId", async (req, res) => {
  try {
    const currentUser = await User.deleteOne(req.params.user._id);
    res.render('foods/food.js', { pantry: currentUser.pantry });
  }
  catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});



//router.delete('/items/:id', (req, res) => {
 // const { id } = req.params;

module.exports = router;
