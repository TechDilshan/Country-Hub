
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { isAuthenticated } = require('../middleware/auth');

// All favorite routes are protected
router.use(isAuthenticated);

router.post('/', favoriteController.addFavorite);
router.delete('/:countryCode', favoriteController.removeFavorite);
router.get('/', favoriteController.getUserFavorites);
router.get('/check/:countryCode', favoriteController.checkFavorite);

module.exports = router;
