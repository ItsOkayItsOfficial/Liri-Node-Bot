/*
 * Author: Alex P
 * Project Name: liri-node-app hal.js
 * Version: 1
 * Date: 09.18.17
 * URL: github.com/itsokayitsofficial/liri-node-app
 */


// Variables - require
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var chalk = require("chalk");

// Variables - global
var tweetKey = keys.twitterKeys;
var spotKey = keys.spotifyKeys;
var input = process.argv;
var calc = parseFloat;
var op = input[2];
var mod = input[3];
var hal = chalk.bold('Hal: ');

// Varia)ble - Initilize Twitter
var twitter = new twitter({
  consumer_key: tweetKey.consumer_key,
  consumer_secret: tweetKey.consumer_secret,
  access_token_key: tweetKey.access_token_key,
  access_token_secret: tweetKey.access_token_secret
});

// Variable - Initilize Spotify
var spotify = new spotify({
  id: spotKey.client_id,
  secret: spotKey.client_secret
});


// Run - logData()
// turn on logData
logData('', 'white', true);
// tell logData what to log
logData('- - - - - - - - - - - - - - - - - - - - - - - - -- - - ', '', true);
logData('Command: node hal.js ' + op + ' ' + mod, 'white', true);
logData('');


// Switch - to handle input
switch (op) {
  case 'tweets':
    getTweets();
    break;
  case 'song':
    getSong();
    break;
  case 'movie':
    getMovie();
    break;
  case 'hal':
    halChoice();
    break;
  case '-info':
    halInfo();
    break;
  case '-clear':
    clearLogs();
    break;
  default:
    logData(hal + 'Input not understood. Type "node hal.js -info" for more information.', 'red');
};


// Function - Get tweets from Twitter
function getTweets() {
  // Variable - request.params()
  var params = {
    screen_name: 'okayitsofficial'
  };

  // Get - Twitter API
  twitter.get('statuses/user_timeline', params, function (error, tweets, repsonse) {
    // If - no errors
    if (!error) {
      logData(hal + 'Here are your most recent tweets.', 'red');
      logData('');
      for (var i = 0; i < tweets.length; i++) {
        logData('Tweeted on ' + tweets[i].created_at, 'blue');
        logData('     "' + tweets[i].text + '"', 'white');
        logData('');
      }
    } else {
      console.log(error);
    }
  });
};


// Function - Get Spotify song info
function getSong() {
  // Variable - local
  var songName = '';
  var query = '';

  // For - Capture complete title
  for (var i = 3; i < input.length; i++) {
    // Build a string of song title
    var songName = input[i];
  }

  // If - Checks if song has been entechalk.red
  if (songName === '') {
    // Variable - searches for What's My Age Again
    var params = {
      type: 'track',
      query: "the sign"
    };
    // Log
    logData(hal + 'I see you could not choose a song to search for.', 'red');
    logData(hal + "Might I suggest some of Scandinavia's finest?", 'red');
  }
  // Else - If query is populated
  else {
    // Variable - applies input to search
    var params = {
      type: 'track',
      query: songName
    };
    // Log
    logData(hal + 'Searching...', 'red');
  }

  // Search - Spotify API
  spotify.search(params, function (error, data) {
    // Variables - local
    var output = data.tracks.items;

    // If - no errors
    if (!error) {
      // Log - hal
      logData(hal + 'Here are some songs that match your search keyword.', 'red');

      // For - captures output
      for (var i = 0; i < output.length; i++) {
        // Return - returns feedback in place of null value
        var name = output[i].artists;
        var artist = [];
        // For - captures mutliple artists into array
        for (var a = 0; a < name.length; a++) {
          var multi = name[a].name;
          artist.push(' ' + multi);
        }
        // Log - data
        logData('');
        logData((i + 1 + ') ') + output[i].name, 'white');
        logData('     Artist(s):' + artist);
        logData('     Album: ' + output[i].album.name);
        logData('     Preview: ' + output[i].preview_url)
      }
      // Else - if errors
    } else {
      console.log(error);
    }

  });
};


// Function - Get OMDB movie info
function getMovie() {
  // Variable - local
  var movieName = '';

  // For - Capture complete title
  for (var i = 3; i < input.length; i++) {
    // Build a string of movie title
    var movieName = input[i];
  }

  // If - Checks if movie has been entechalk.red
  if (movieName === '') {
    // Variable - searchs for Mr. Nobody if not
    movieName = 'mr nobody';
    // Log
    logData(hal + 'I see you could not choose a movie to search for.', 'red');
    logData(hal + 'Might I suggest an early 2010s bomb starring a post-op Courtney Cox?', 'red');
  }
  // Else - If movieName is populated
  else {
    // Log
    logData(hal + 'Searching...', 'red');
  }

  // Variable - API ref
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=40e9cece";

  // Request API - Get movie info
  request(queryUrl, function (error, response, body) {
    var omdb = JSON.parse(body);
    // If - no errors
    if (!error && response.statusCode === 200) {
      if (omdb.Response === "False") {
        logData(hal + 'I could not find the movie you searched for. Please try another title.', 'red');
      } else {
        logData(hal + 'Movie found!', 'red');
        logData('');
        logData(omdb.Title + ' (' + omdb.Year + ')', 'white');
        logData(omdb.Actors, 'white');
        logData('----------------');
        logData('IMDB: ' + omdb.imdbRating + ' - Rotten Tomatoes: ' + omdb.Ratings[1].Value);
        logData('Country(s): ' + omdb.Country + ' - Language(s): ' + omdb.Language);
        logData('');
        logData(omdb.Plot);
        logData('Rated: ' + omdb.Rated);
        logData('');
      }
    } else {
      console.log(error);
    }

  });
};


// Function - Random choice from random.txt
function halChoice() {

};


// Function - Log input
function logData(log, color, halt) {
  // File - logoData logs...data
  fs.appendFileSync('log.txt', log + '\r\n');
  // If - on/off for logData
  if (!halt) {
    if (color !== undefined) {
      console.log(chalk[color](log));
    } else {
      console.log(log);
    }
  };
};


// Function - Settings for keywords
function halInfo() {
  console.log('');
  console.log('To run ' + chalk.red.bold('Hal'));
  console.log('----------------');
  console.log('Type in Terminal: node hal.js <keyword>');
  console.log('');
  console.log('Keywords');
  console.log('----------------');
  console.log('tweets                  shows last 20 tweets and when they were created');
  console.log("song '<song name>'      shows song name, artist(s), album, and preview URL");
  console.log("movie '<movie name>'    shows movie title, year made,, main actors, IMDB and Rotten Tomatoes rating, country and language, plot, and rating");
  console.log("hal                     Hal's choice");
  console.log('');
};

// Function - Clear log file
function clearLogs() {
  // File - clear logData from log.txt
  fs.truncate('log.txt', 0, function () {
    console.log(chalk.red(hal + 'Logs have been scrubbed.'));
  });
};