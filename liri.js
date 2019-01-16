// LIRI HOMEWORK
    // IMPORT PACKAGES
    // GET KEYS

    // COLLECT INPUT FROM USER
    // GET INFO FROM API
    // LOG INFO TO CONSOLE

require('dotenv').config();

var keys = require('./keys.js');

var chalk = require('chalk');

var request = require('request');
var fs = require('fs');
var moment = require('moment');

var Spotify = require('node-spotify-api');
var bandsintown = require('bandsintown')('"' + keys.bandsintown + '"');
var Omdb = require('omdb');

// chalk setup
var invalid = chalk.red;
var title = chalk.blue;
var divider = chalk.gray;
var inverse = chalk.inverse;

var divLine = '-----------------------------------';

var spotify = new Spotify(keys.spotify);


var userInput = process.argv[2];
// console.log(userInput);

var command = {
    // search BANDSINTOWN for concert info
    concert: function() {
        
        var artist = userInput;
        
        var artistSplit = userInput.split('');
  
        for (var i = 0; i < artistSplit.length; i++) {
            // replacing any special characters
            switch (artistSplit[i]) {
            case '/':
                artistSplit[i] = '%252F';
                break;
            case '?':
                artistSplit[i] = '%253F';
                break;
            case '*':
                artistSplit[i] = '%252A';
                break;
            case '"':
                artistSplit[i] = '%27C';
                break;
            default:
                artistSplit[i] = artistSplit[i];
                break;
            };

        };

        artistSplit = artistSplit.join('');
        
        request('https://rest.bandsintown.com/artists/' + artistSplit + '/events?app_id=' + keys.bandsintown + '&date=upcoming', function (error, response, bandData) {
            // catch errors
            if (error || response.statusCode !== 200) {
                return console.log(invalid(error));
            } 

            if (bandData.length > 3) {

                // Print the HTML for the Google homepage.
                var bandData = JSON.parse(bandData);

                console.log(title('\nUPCOMING ' + chalk.bold(artist.toUpperCase()) + ' CONCERTS:'));
                console.log(divider(divLine));

                for (var j = 0; j < 5; j++) {

                    var concert = bandData[j];

                    var concertDate = moment(concert.datetime).format('MM/DD/YYYY');

                    console.log(
                        concertDate + divider(' | ') + 
                        concert.venue.city + ', ' + concert.venue.region + ' (' +
                        concert.venue.name + ')');

                }

            } else {

                console.log(invalid('\nIt looks like ' + artist + ' is not on tour right now.'));
            }

        });

    },
    // search SPOTIFY for song info
    song: function() {
        console.log('artist(s)');
        console.log('song name');
        console.log('album');
        console.log('preview');
    },
    // search OMDB for movie info
    movie: function() {
        console.log('title');
        console.log('year');
        console.log('country');
        console.log('language');
        console.log('imdb rating | rotten tomatoes rating');
        console.log('plot');
        console.log('cast');
    },
    // read RANDOM.txt
    random: function() {
        
        fs.readFile("random.txt", "utf8", function(error, data) {

            // catch errors
            if (error) {
              return console.log(error);
            }
          
            console.log(data);
          
        });

    },
};

command.concert();