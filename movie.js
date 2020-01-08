/* This javascript file is to get the movie API date from https://www.omdbapi.com based on movieid which is provided when a user clicks from searched results and display the detailed movie information*/

'use strict';

const apiKey = 'a9011b00';
const searchURL = 'https://www.omdbapi.com/';

function formatQueryParams(params) {
   //To make the query statement that is joined with the api url for fetch to get the data
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function getMovieDetail() {
  //Get the movieId from the user search to get movie detail api data
  let movieId = sessionStorage.getItem('movieId');

  const params = {
    apikey: apiKey,
    i: movieId
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  });
}

function displayMovieDetail(responseJson) {
  let movie = responseJson;

  let output = `
      <div class="row">
        <div class="col-md-4">
          <img src="${movie.Poster}" class="thumbnail" alt="Movie Image">
        </div>
        <div class="col-md-8">
          <p class="movie-title"><b>${movie.Title}</b></p>
          <ul class="list-group">
            <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
            <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
            <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
            <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
            <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
            <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
            <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="well">
          <h3>Plot</h3>
          <p class="movie-plot">${movie.Plot}</p>
          <hr>
          <div class="detail-buttons">
          <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
          <a onclick="javascript:history.go(-1)" class="btn btn-default"  href="#">Go Back To Search</a>         
          </div>
        </div>
      </div>
    `;
  
  $('#movie').html(output);
}


function getDetail() {
  //Higher function to call all subsequent functions to get movie detail page to work
  getMovieDetail()
    .then(function(movies) {
      displayMovieDetail(movies);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

$(getDetail);