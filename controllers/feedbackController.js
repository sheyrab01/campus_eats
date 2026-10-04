const Feedback = require('../models/Feedback');
const Restaurant = require('../models/Restaurant');

exports.submitFeedback = async (req, res) => {
  try {
    console.log('Feedback form received:', req.body);
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.getRestaurantById(restaurantId);

    if (!restaurant) {
      return res.status(404).send('Restaurant not found.');
    }

    const { customerName, rating, comment } = req.body;
    const numericRating = Number(rating);

    if (!customerName || !numericRating || numericRating < 1 || numericRating > 5) {
      console.log('Rejected: missing name or invalid rating');
      return res.redirect(`/restaurants/${restaurantId}/menu`);
    }

    const result = await Feedback.createFeedback({ restaurantId, customerName, rating: numericRating, comment });
    console.log('Saved to MongoDB, id:', result.insertedId);
    res.redirect(`/restaurants/${restaurantId}/menu`);
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).send('Could not save feedback');
  }
};