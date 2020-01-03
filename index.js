'use strict';

const apiKey = 'a9011b00';
const searchURL = 'https://www.omdbapi.com/';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayMovies(responseJson) {
  console.log(responseJson);
  let movie = responseJson.Search;
  $('#results-list').empty();

  for (let i = 0; i < movie.length; i++) {
    $('#results-list').append(
      `<div class="col-md-3">
      <div class="well text-center">
        <img src="${movie[i].Poster}">
        <h5>${movie[i].Title}</h5>
        <a onclick="movieSelected('${movie[i].imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
      </div>
    </div>`
    );
  }

  $('#results').removeClass('hidden');
}

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovies(query) {
  const params = {
    apikey: apiKey,
    s: query
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Search result not found. Please type the correct keyword or movie title');
    })
    .then(responseJson => displayMovies(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      console.log(err.message);
    });
}

$(document).ready(() => {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    getMovies(searchTerm);
  });
});

/* for movie.html */

function getMovieDetail() {
  let movieId = sessionStorage.getItem('movieId');
  console.log(movieId);

  const params = {
    apikey: apiKey,
    i: movieId
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayMovieDetail(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      console.log(err.message);
    });
}


function displayMovieDetail(responseJson) {
  let movie = responseJson;

  let output = `
      <div class="row">
        <div class="col-md-4">
          <img src="${movie.Poster}" class="thumbnail">
        </div>
        <div class="col-md-8">
          <h2>${movie.Title}</h2>
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
          ${movie.Plot}
          <hr>
          <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
          <a href="index.html" class="btn btn-default">Go Back To Search</a>
        </div>
      </div>
    `;

  $('#movie').html(output);
}
