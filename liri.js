/*
 * Author: Alex P
 * Project Name: liri-node-app liri.js
 * Version: 1
 * Date: 09.18.17
 * URL: github.com/itsokayitsofficial/liri-node-app
 */


// Variables - require
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");

// Variables - global
var twitter = keys.twitterKeys;
var spotify = keys.spotifyKeys;
var input = process.argv;
var calc = parseFloat;
var output;
var op = input[2];


// Run - logData()
// turn on logData
logData('', true);
// tell logData what to log
logData('Command: node liri.js' + op, true);


// Switch - to handle input
switch (op) {
  case 'my-tweets':
    getTweets();
    break;
  case 'spotify-this-song':
    getSong();
    break;
  case 'movie-this':
    getMovie();
    break;
  case 'do-what-it-says':
    liriChoice();
    break;
  case '-i':
    liriInfo();
    break;
  default:
    logData('Liri: Input not understood. Type "node liri.js -i" for info.');
};


// Function - Get tweets from Twitter
function getTweets() {
  var user = {screen_name: 'okayitsofficial'};
  twitter.get('statuses/user_timeline', user, function(error, response, tweets) {
        // If - no errors
        if (!error && response.statusCode === 200) {
          // Log tweets
          logData(tweets);
        }
        // Else - errors
        else {
          // Show error
          console.log(error);
        }
      });
}

// Function - Get Spotify song info
function getSong() {

}


// Function - Get OMDB movie info
function getMovie() {

}


// Function - Random choice from random.txt
function liriChoice() {

}


// Function - Log input
function logData(log, halt) {
  // fs - logoData logs...data
  fs.appendFileSync('log.txt', log + '\r\n');
  // If - on/off for logData
  if (!halt) {
    console.log(log);
  };
}

function liriInfo() {
  console.log('');
  console.log('To run Liri');
  console.log('----------------');
  console.log('Type in Terminal: node liri.js <keyword>');
	console.log('');
  console.log('Keywords');
  console.log('----------------');
	console.log('my-tweets                        shows last 20 tweets and when they were created');
	console.log("spotify-this-song '<song name>'  shows song name, artist(s), album, and preview URL");
	console.log("movie-this '<movie name>'        shows movie title, year, IMDB rating, country language, plot, and actors");
  console.log("do-what-it-says                  Liri's choice");
  console.log('');
}