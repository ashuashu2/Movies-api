require("dotenv").config()
const express = require("express");
const movieRouter = express.Router();
const movieModel = require("../models/movieModel")

 

 
 async function addRatingAndReview(movieId, userId, rating, reviewText) {
    try {
      const movie = await movieModel.findById(movieId);
      console.log({ movie })
      if (movie) {
        movie.ratings.push(rating);
  
        const review = {
          user: userId,
          text: reviewText,
        };
        movie.reviews.push(review);
  
        await movie.save();
  
        const updatedMovieWithReview = await movieModel.findById(movieId).populate('reviews.user', 'username profilePictureUrl');
        return updatedMovieWithReview;
      } else {
        throw new Error("Movie not found");
      }
    } catch (error) {
      throw error;
    }
  }
  
  movieRouter.post('/:movieId/rating', async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const { userId, rating, review } = req.body;
  
      const updatedMovie = await addRatingAndReview(movieId, userId, rating, review);
      res.json(updatedMovie);
    } catch (error) {
      res.status(404).json({ error: 'Movie not found' });
    }
  });
  
  async function getMovieReviewsWithUserDetails(movieId) {
    try {
      const movie = await movieModel.findById(movieId).populate({
        path: 'reviews',
        populate: {
  
          path: 'user', select: 'username profilePictureUrl'
        },
      });
      const reviewsWithUserDetails = movie.reviews.slice(0, 3).map(review => ({
        reviewText: review.text,
        user: review.user,
      }));
      return reviewsWithUserDetails;
    } catch (error) {
      throw error;
    }
  }
  
  movieRouter.get('/:movieId/reviews', async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const reviewsWithUserDetails = await getMovieReviewsWithUserDetails(movieId);
      res.json(reviewsWithUserDetails);
    } catch (error) {
      res.status(404).json({ error: 'Movie not found' });
    }
  });





  module.exports = movieRouter