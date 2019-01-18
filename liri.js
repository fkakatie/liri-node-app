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
var axios = require('axios')
var fs = require('fs');
var moment = require('moment');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// chalk setup
var invalid = chalk.red;
var heading = chalk.blue;
var divider = chalk.gray;
var inverse = chalk.inverse;

var divLine = '-----------------------------------';

var userInput = process.argv[2];
// console.log(userInput);

var command = {
    // search BANDSINTOWN for concert info
    concert: function() {
        
        var artist = userInput;
        
        // replacing any special characters
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
        
        request('https://rest.bandsintown.com/artists/' + artistSplit + '/events?app_id=' + keys.bandsintown.id + '&date=upcoming', function (error, response, bandData) {
            
            // catch errors
            if (error || response.statusCode !== 200) {
                return console.log(invalid(error));
            } 

            if (bandData.length > 3) {
                // convert bandData to JSON object
                var bandData = JSON.parse(bandData);

                console.log(heading('\nUPCOMING ' + chalk.bold(artist.toUpperCase()) + ' CONCERTS:'));
                console.log(divider(divLine));

                if (bandData.length > 5) {

                    for (var j = 0; j < 5; j++) {

                        var concert = bandData[j];

                        var concertDate = moment(concert.datetime).format('MM/DD/YYYY');

                        console.log(
                            concertDate + divider(' | ') + 
                            concert.venue.city + ', ' + concert.venue.region + ' (' +
                            concert.venue.name + ')');

                    }

                } else {

                    for (var j = 0; j < bandData.length; j++) {

                        var concert = bandData[j];

                        var concertDate = moment(concert.datetime).format('MM/DD/YYYY');

                        console.log(
                            concertDate + divider(' | ') + 
                            concert.venue.city + ', ' + concert.venue.region + ' (' +
                            concert.venue.name + ')');

                    }

                }

            } else {

                console.log(invalid('\nIt looks like ' + artist + ' is not on tour right now.'));
            }

        });

    },
    // search SPOTIFY for song info
    song: function() {

        var track = userInput;

        spotify
        .search({ 
            type: 'track', 
            query: track,
            limit: 3 
        }).then(function(trackData) {

            var trackData = trackData.tracks.items;

            if (trackData > 0) {

                console.log(
                    heading('\n' + chalk.bold(track.toUpperCase()) + ' TRACKS:'));

                for (var l = 0; l < trackData.length; l++) {

                    // var trackData = trackData.tracks.items[l];
                    console.log(divider(divLine));
                    console.log(divider(' TRACK: ') + trackData[l].name); 
                    console.log(divider('ARTIST: ') + trackData[l].artists[0].name);
                    console.log(divider(' ALBUM: ') + trackData[l].album.name);
                    console.log(divider('LISTEN: ') + chalk.italic(trackData[l].external_urls.spotify));

                }; 

            } else {

                console.log(invalid('\nIt seems like ' + track + ' is not actually a song.'));

            }

        }).catch(function(err) {

            console.log(err);

        });
    },
    // search OMDB for movie info
    movie: function() {

        var title = userInput;
                
        var titleSplit = title.split(' ').join('+');

        console.log('http://www.omdbapi.com/?apikey=' + keys.omdb.id + '&t=' + titleSplit);

        axios.get('http://www.omdbapi.com/?apikey=' + keys.omdb.id + '&t=' + titleSplit)
            .then(function ({data}) {

                // var test = Object.keys(movieData);
                console.log(data.Title);

                var movie = data;

                if (movie.Title) {

                console.log(
                    '\n' + heading(movie.Title.toUpperCase()) + 
                    divider(' (' + movie.Year + ')'));
                console.log(movie.Plot);

                console.log(divider(divLine + divLine));

                console.log(divider('STARRING: ') + movie.Actors);
                console.log(divider('PRODUCED IN: ') + movie.Country);
                console.log(divider('LANGUAGE(S): ') + movie.Language);

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

            } else {
                console.log(invalid('\nI cannot find any movies (or television shows!) with the title "' + title + '" right now.'));
            }

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
            }
          
            console.log(data);
          
        });

    },
};

command.song();