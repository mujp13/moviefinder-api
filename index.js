/* This javascript file is to get the movie API date from https://www.omdbapi.com with a search parameter and use DOM manipulation to allow users to search and get the result back */

'use strict';

const apiKey = 'a9011b00';
const searchURL = 'https://www.omdbapi.com/';

function formatQueryParams(params) {
  //To make the query statement that is joined with the api url for fetch to get the data
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayMovies(responseJson) {
  //Display searched results
  let movie = responseJson.Search;
  $('#movies').empty();

  for (let i = 0; i < movie.length; i++) {
    $('#movies').append(
      `<div class="col-md-3">
      <div class="well text-center">
        <img src="${movie[i].Poster}" onclick="movieSelected('${movie[i].imdbID}')" class="movie-image" alt="Movie Image">
        <h5>${movie[i].Title}</h5>
        <a onclick="movieSelected('${movie[i].imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
      </div>
    </div>`
    );
  }

  $('#results').removeClass('hidden');
}

function movieSelected(id) {
  //When a user clicks on "Movie Details" button, the html page moves to movie.html
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovies(query) {
  //Set the apikey and s= search query joined with the url
    const params = {
    apikey: apiKey,
    s: query
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

$(function() {
  //User searches for any movie and clicks on"Submit" button to get the result
  $('form').submit(event => {
    event.preventDefault();
    $('#js-error-message').empty();
    const searchTerm = $('#js-search-term').val();
    getMovies(searchTerm)
      .then(function(movies) {
        displayMovies(movies);
      })
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
  });
});
