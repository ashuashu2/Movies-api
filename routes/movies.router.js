require("dotenv").config()
const express = require("express");
const movieRouter = express.Router();
const movieModel = require("../models/movieModel")

async  function readMovies(){
try {
  const movies = await movieModel.find({})

  return movies
  
} catch (error) {
  console.log("something went wrong")
}
} 


movieRouter.get('/allMovies', async (req, res) => {
  try {

    const findAllMovies = await readMovies();
    res.json({findAllMovies , nbhits :findAllMovies.length });
  } catch (error) {
    res.status(404).json({ error: 'Movies not available' });
  }
});




async  function sortMoviesByReleaseYears(){
  try {
    const movies = await movieModel.find({}).sort({releaseYear:1})
  
    return movies
    
  } catch (error) {
    console.log("something went wrong")
  }
  } 
  
  
  movieRouter.get('/releaseYear', async (req, res) => {
    try {
  
      const findAllMovies = await sortMoviesByReleaseYears();
      res.json(findAllMovies);
    } catch (error) {
      res.status(404).json({ error: 'Movies not available' });
    }
  });
  



async function findMovieByTitle(title) {
  try {
    const movie = await movieModel.findOne({title: title });
    if (movie) {
      return movie;
    } else {
      throw new Error("Movie not found")
    }
  } catch (error) {
    throw error;
  }
}






movieRouter.get('/name/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const movie = await findMovieByTitle(title);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: 'movie not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});





async function findMoviesByGenre(genre) {
  try {
    const movies = await movieModel.find({genre: genre });
    if (movies) {
      return movies;
    } else {
      throw new Error("Movies not found")
    }
  } catch (error) {
    throw error;
  }
}

movieRouter.get('/genreType/:genre', async (req, res) => {
  try {
    const genre = req.params.genre;
    const movies = await findMoviesByGenre(genre);
    if (movies) {
      res.json({movies, nbhits:movies.length});
    } else {
      res.status(404).json({ error: 'movies not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});





async function findMovieById(id) {
  try {
    const movie = await movieModel.findById(id);
    if (movie) {
     
      return movie;
    } else {
      throw new Error("Movie not found")
    }
  } catch (error) {
    throw error;
  }
}

movieRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    console.log(id)

    const movie = await findMovieById(id);
    console.log(movie)

    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: 'movie not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});


 
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


  
  movieRouter.post('/:movieId/reviews', async (req, res) => {
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






  async function updateMovieDetails(title, updatedMovieDetails) {
    try {
      const movie = await movieModel.findOne({ title });
      if (movie) {
        Object.assign(movie, updatedMovieDetails);
        const updatedmovie = await movie.save();
        console.log(updatedmovie)
        return updatedmovie;
      } else {
        throw new Error("movie not found");
      }
    } catch (error) {
      throw error;
    }
  }
  
  movieRouter.post('/update-details/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const updatedMovieDetails = req.body;
      console.log(updatedMovieDetails)
      const updatedmovie = await updateMovieDetails(title, updatedMovieDetails);
      res.json(updatedmovie);
    } catch (error) {
      res.status(404).json({ error: 'movie not updated' });
    }
  });






  async function deleteMovieHandler(id) {
    try {
      const movie = await movieModel.findByIdAndDelete(id);
      console.log({movie})
     const availableMovies = await movieModel.find({})
       
       
        return availableMovies;
      
    } catch (error) {
      throw error;
    }
  }
  
  movieRouter.delete('/delete/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const availableMovies = await deleteMovieHandler(id);
      res.json({availableMovies, totle: availableMovies.length});
    } catch (error) {
      res.status(404).json({ error: 'movie not updated' });
    }
  });



   async function addMovieHandler(newMovie){
    const isMovieExist = await movieModel.findOne({title : newMovie.title})
    if(isMovieExist ){
      console.log("movie already exist")
    }else{
      const updateMovie = new movieModel(newMovie);
      const saveMovie = await updateMovie.save()
      const movies = await movieModel.find({})
  
      return{ saveMovie ,  movies } ;

    }
    
 

   }


  movieRouter.post("/create",async(req,res)=>{
    const newMovie = req.body;
    try {
      const {movies , saveMovie} = await addMovieHandler(newMovie);
    res.json({TotleMovies :  movies.length , newMovie  : saveMovie  })
      
    } catch (error) {
      res.json("movie already exist")
      
    }
    

  })


  module.exports = movieRouter