// LIRI HOMEWORK
    // IMPORT PACKAGES
    // GET KEYS

    // COLLECT INPUT FROM USER
    // GET INFO FROM API
    // LOG INFO TO CONSOLE

require('dotenv').config();

var keys = require('./keys.js');

var request = require('request');
var axios = require('axios')
var moment = require('moment');

var inquirer = require('inquirer');
var fs = require('fs');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var chalk = require('chalk');

// chalk setup
var invalid = chalk.red;
var heading = chalk.blue;
var divider = chalk.gray;
var inverse = chalk.inverse;

var divLine = '---------------------------------------------------------';

var userInput = process.argv[2];
// console.log(userInput);

var command = {
    // search BANDSINTOWN for concert info
    concert: function() {
        
        var artist = userInput;
        
        // replacing any special characters as required by bandsInTown API
        var artistSplit = artist.split('');
  
        for (var i = 0; i < artistSplit.length; i++) {
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

        // use request to search bandsInTown API
        request(
            'https://rest.bandsintown.com/artists/' + artistSplit + 
            '/events?app_id=' + keys.bandsintown.id + 
            '&date=upcoming', function (error, response, bandData) {
            
            // catch errors
            if (error || response.statusCode !== 200) {
                return console.log(invalid(error));
            };

            // if data from bandsInTown API is returned...
            if (!bandData.includes('warn=Not found')) {

                // convert bandData to JSON object
                var bandData = JSON.parse(bandData);

                // print title to console
                console.log(heading('\nUPCOMING ' + chalk.bold(artist.toUpperCase()) + ' CONCERTS:'));
                console.log(divider(divLine));

                // if there are more than five upcoming concerts...
                if (bandData.length > 5) {

                    for (var j = 0; j < 5; j++) {

                        var concert = bandData[j];

                        // convert date using moment.js
                        var concertDate = moment(concert.datetime).format('MM/DD/YYYY');

                        // only print location data that exists
                        if (concert.venue.region) {
                            // print upcoming concerts to console
                            console.log(
                                concertDate + divider(' | ') + 
                                concert.venue.city + ', ' + concert.venue.region + ' (' +
                                concert.venue.name + ')');
                        } else {
                            // print upcoming concerts to console
                            console.log(
                                concertDate + divider(' | ') + 
                                concert.venue.city + 
                                ' (' + concert.venue.name + ')');
                        };

                    };
                // if there are LESS than five upcoming concerts...
                } else {

                    // print all upcoming concerts to the console
                    for (var j = 0; j < bandData.length; j++) {

                        var concert = bandData[j];

                        // convert date using moment.js
                        var concertDate = moment(concert.datetime).format('MM/DD/YYYY');

                        // only print location data that exists
                        if (concert.venue.region) {
                            // print upcoming concerts to console
                            console.log(
                                concertDate + divider(' | ') + 
                                concert.venue.city + ', ' + concert.venue.region + ' (' +
                                concert.venue.name + ')');
                        } else {
                            // print upcoming concerts to console
                            console.log(
                                concertDate + divider(' | ') + 
                                concert.venue.city + 
                                ' (' + concert.venue.name + ')');
                        };
                        
                    };

                };

            } else {
                
                // no data is returned from bandsInTown API
                console.log(invalid('\nIt looks like "' + artist + '" is not on tour right now.'));
            };

        });

    },
    // search SPOTIFY for song info
    song: function() {

        var track = userInput;

        spotify
        .search({ 
            type: 'track', 
            query: track, // uses userinput for query
            limit: 3 
        }).then(function(trackData) {

            var trackData = trackData.tracks.items;

            // if data is returned from spotify api
            if (trackData.length !== 0) {

                // print title to console
                console.log(heading('\n' + chalk.bold(track.toUpperCase()) + ' TRACKS:'));

                for (var l = 0; l < trackData.length; l++) {

                    // print track data to console
                    console.log(divider(divLine));
                    console.log(divider(' TRACK: ') + trackData[l].name); 
                    console.log(divider('ARTIST: ') + trackData[l].artists[0].name);
                    console.log(divider(' ALBUM: ') + trackData[l].album.name);
                    console.log(divider('LISTEN: ') + chalk.italic(trackData[l].external_urls.spotify));

                }; 
            // no data is returned from spotify api
            } else {

                console.log(invalid('\nIt seems like "' + track + '" is not actually a song.'));

            };

        // catch errors using promise
        }).catch(function(err) {

            console.log(invalid(err));

        });
    },
    // search OMDB for movie info
    movie: function() {

        var title = userInput;
                
        var titleSplit = title.split(' ').join('+');

        // search omdbi api using axios
        axios
        .get('http://www.omdbapi.com/?apikey=' + keys.omdb.id + '&t=' + titleSplit)
        .then(function ({data}) {

            var movie = data;

            if (movie.Title) {

            // print movie data to console
            console.log(
                '\n' + heading(movie.Title.toUpperCase()) + 
                divider(' (' + movie.Year + ')'));
            console.log(movie.Plot);

            console.log(divider(divLine));

            console.log(divider('STARRING: ') + movie.Actors);
            console.log(divider('PRODUCED IN: ') + movie.Country);
            console.log(divider('LANGUAGE(S): ') + movie.Language);

                // only print ratings data that exists
                if (movie.Ratings[1] && movie.Ratings[0]) {
                    console.log(divider('RATINGS: ') + 'Rotten Tomatoes: ' + 
                        movie.Ratings[1].Value + 
                        divider(' | ') + 
                        'IMDb: ' + movie.Ratings[0].Value);
                } else if (movie.Ratings[1]) {
                    console.log(
                        divider('RATING: ') + 'Rotten Tomatoes: ' + 
                        movie.Ratings[1].Value);
                } else if (movie.Ratings[0]) {
                    console.log(
                        divider('RATING: ') + 'IMDb: ' + movie.Ratings[0].Value);
                }

            } 
            // if no data is returned from omdb api
            else {
                console.log(invalid('\nI cannot find any movies (or television shows!) with the title "' + title + '" right now.'));
            };

        })
        
        // catch errors
        .catch(function (error) {
            console.log(invalid(error));
        });
    },
    // read RANDOM.txt
    random: function() {
        
        fs.readFile("random.txt", "utf8", function(error, data) {

            // catch errors
            if (error) {
              return console.log(error);
            };
          
            console.log(data);
          
        });

    }
};

// inquirer
// .prompt([
//     {
//         name: 'name',
//         type: 'input',
//         message: 'Player Name:'
//     }, {
//         name: 'position',
//         type: 'list',
//         message: 'Player Position:',
//         choices: ['Guard', 'Forward', 'Center']
//     }
// ])
// .then(function(answers) {
// // Use user feedback for... whatever!!
// });

command.concert();
// command.song();
// command.movie();