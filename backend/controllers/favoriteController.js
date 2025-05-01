
const Favorite = require('../models/Favorite');

// Add a country to favorites
exports.addFavorite = async (req, res) => {
  try {
    const { countryCode, countryData } = req.body;
    
    // Check if already a favorite
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      countryCode
    });
    
    if (existingFavorite) {
      return res.status(400).json({ message: 'Country already in favorites' });
    }
    
    // Create new favorite
    const favorite = await Favorite.create({
      user: req.user._id,
      countryCode,
      countryData
    });
    
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error while adding favorite' });
  }
};

// Remove a country from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const { countryCode } = req.params;
    
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      countryCode
    });
    
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error while removing favorite' });
  }
};

// Get all favorites for a user
exports.getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id });
    
    // Format the response to match the frontend's expected format
    const formattedFavorites = favorites.map(fav => fav.countryData);
    
    res.status(200).json(formattedFavorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error while fetching favorites' });
  }
};

// Check if a country is in favorites
exports.checkFavorite = async (req, res) => {
  try {
    const { countryCode } = req.params;
    
    const favorite = await Favorite.findOne({
      user: req.user._id,
      countryCode
    });
    
    res.status(200).json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ message: 'Server error while checking favorite status' });
  }
};
