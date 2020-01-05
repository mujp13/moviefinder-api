'use strict';

const apiKey = 'a9011b00';
const searchURL = 'https://www.omdbapi.com/';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayMovies(responseJson) {
  let movie = responseJson.Search;
  $('#movies').empty();

  for (let i = 0; i < movie.length; i++) {
    $('#movies').append(
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

  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  });
}

$(function() {
  $('form').submit(event => {
    event.preventDefault();
    $('#js-error-message').empty();
    const searchTerm = $('#js-search-term').val();
    getMovies(searchTerm)
      .then(function(movies) {
        displayMovies(movies);
      })
      .catch(err => {
        $('#js-error-message').text('Movie not found. Please try again!');
      });
  });
});
