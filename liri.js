// LIRI HOMEWORK
    // IMPORT PACKAGES
    // GET KEYS

    // COLLECT INPUT FROM USER
    // GET INFO FROM API
    // LOG INFO TO CONSOLE

require('dotenv').config();

var keys = require('./keys.js');

var request = require('request');
var fs = require('fs');
var moment = require('moment');

var Spotify = require('node-spotify-api');
var BandsInTown = require('bandsintown');
var Omdb = require('omdb');

// moment stuff

var now = moment().format();

var bandsDate = moment(now).format('MM-DD-YYYY');

// 1. search _spotify_ for song info

var spotify = new Spotify(keys.spotify);


// 2. search _bands in town_ for concert info


// 3. search _omdb_ for movie info

