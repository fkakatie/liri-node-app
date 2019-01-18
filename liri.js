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
var heading = chalk.magenta;
var divider = chalk.gray;
var inverse = chalk.inverse;

var divLine = '-------------------------------------------------';

var searchTerm;

// search BANDSINTOWN for concert info
function concert() {
        
    var artist = searchTerm;
    
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

        reRun();

    });

};

// search SPOTIFY for song info
function song() {

    var track = searchTerm;

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

        reRun();

    // catch errors using promise
    }).catch(function(err) {
        console.log(invalid(err));
        reRun();
    });
};

// search OMDB for movie info
function movie() {

    var title = searchTerm;
            
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

        reRun();

    })
    
    // catch errors
    .catch(function (error) {
        console.log(invalid(error));
        reRun();
    });

};

// read RANDOM.txt
// random: function() {
    
//     fs.readFile("random.txt", "utf8", function(error, data) {

//         // catch errors
//         if (error) {
//           return console.log(error);
//         };
        
//         console.log(data);
        
//     });

// }
// };

// call liri to command line
function initLiri() {

    console.log("\n ooooo   ooooo  o8o         ooooo o8o                      " + heading("ooooo         o8o            o8o     "));
    console.log(" `888'   `888'  `*'         `888' `YP                      " + heading("`888'         `*'            `*'     "));
    console.log("  888     888  oooo          888   '  ooo. .oo.  .oo.      " + heading(" 888         oooo  oooo d8b oooo     "));
    console.log("  888ooooo888  `888          888      `888P`Y88bP`Y88b     " + heading(" 888         `888  `888'`8P `888     "));
    console.log("  888     888   888          888       888   888   888     " + heading(" 888          888   888      888     "));
    console.log("  888     888   888  .o.     888       888   888   888     " + heading(" 888       o  888   888      888 ") + " .o.");
    console.log(" o888o   o888o o888o Y8P    o888o     o888o o888o o888o    " + heading("o888ooooood8 o888o d888b    o888o") + " Y8P");
    console.log(divider(divLine + divLine));

    liriInquire();
    
};

// collect user input
function liriInquire() {

    inquirer
    .prompt([
        {
            name: 'command',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['Find concert dates', 'Search for a song', 'Look up a movie', 'Surprise me']
        }, {
            name: 'searchTerm',
            type: 'input',
            message: 'Which one?',
            validate: function(value) {
                if (value.trim().length == 0) {
                  return false;
                }
                return true;
            }
        }
    ])
    .then(function(inquiry) {
    
        var command = inquiry.command;
        searchTerm = inquiry.searchTerm.trim();

        switch (command) {
            case 'Find concert dates':
                concert(searchTerm);
                break;
            case 'Search for a song':
                song(searchTerm);
                break;
            case 'Look up a movie':
                movie(searchTerm);
                break;
            default:
                break;
        }
        
    });

};

// check if user will rerun liri
function reRun() {

    console.log('');

    inquirer
    .prompt([
        {
            name: 'rerun',
            type: 'confirm',
            message: 'Would you like to search for something else?'
        }
    ])
    .then(function(result) {

        result.rerun ? liriInquire() : console.log('\nOkay! You can call me again by typing ' + heading('node liri') + ' in the command line.');

    });

};

// ready, set, go!
initLiri();