# LIRI: A Command Line Node App

    ooooo   ooooo  o8o         ooooo o8o                      ooooo         o8o            o8o     
    `888'   `888'  `"'         `888' `YP                      `888'         `"'            `"'     
     888     888  oooo          888   '  ooo. .oo.  .oo.       888         oooo  oooo d8b oooo     
     888ooooo888  `888          888      `888P"Y88bP"Y88b      888         `888  `888""8P `888     
     888     888   888          888       888   888   888      888          888   888      888     
     888     888   888  .o.     888       888   888   888      888       o  888   888      888  .o.
    o888o   o888o o888o Y8P    o888o     o888o o888o o888o    o888ooooood8 o888o d888b    o888o Y8P

Meet **Liri**, a Language Interpretation and Recognition Interface. Ask Liri to find concerts, songs, and movies. :notes::tv:

## What this project does ##

This project requires [`npm`](https://www.npmjs.com) to install third party libraries by using the command line. [`dotenv`]() is used to load `API keys` from an `.env` file. [`Inquirer`](https://www.npmjs.com/package/inquirer) is used to collect user input. Based on the user input, Liri will use [`Request`](https://www.npmjs.com/package/request) to make an HTTP request to the Bands in Town API, the [`Node Spotify API`](https://www.npmjs.com/package/node-spotify-api), and [`Axios`](https://www.npmjs.com/package/axios) to make an HTTP request to the OMDb API. Dates are parsed and manipulated using [`moment`](https://www.npmjs.com/package/moment). Data logged in the terminal is styled with [`Chalk`](https://www.npmjs.com/package/chalk) and the ASCII art is made using Nick Miner's FIGlet font, [Roman](http://www.figlet.org/fontdb_example.cgi?font=roman.flf). Search results are logged in a `.txt` file using [`fs`](https://nodejs.org/api/fs.html).

## How users can get started with this project ## 

To properly use this Node app, you will need to request a [Spotify key](https://developer.spotify.com/dashboard/), a [Bands In Town key](https://manager.bandsintown.com/support/bandsintown-api), and a [OMDb key](http://www.omdbapi.com/). These keys must be stored in an `.env` file in the following format:

    # Spotify API keys

    SPOTIFY_ID=your-spotify-id
    SPOTIFY_SECRET=your-spotify-secret

    # Bands In Town API key

    BANDSINTOWN_ID=your-bandsintown-id

    # OMDb API key

    OMDB_ID=your-omdb-id

### How to Use: ###

1. **Initialize Liri.**
  - After cloning or downloading the [liri-node-app repo](https://github.com/fkakatie/liri-node-app) and creating an `.env` file with your API keys, enter `node liri` in the command line to call Liri into action.
	
2. **Give a command.**
  - When prompted, give Liri your command. Your options include:
    - Find concert dates
    - Search for a song
    - Look up a movie
    - Another function
	
3. **Enter your query.**
  - After giving your command, let Liri know specifically which concert, song, movie, or function you would like to search for.

4. **Log search results.**
  - All valid search results are entered in the `log.txt` file.

5. **Read and repeat!**
  - Liri will provide your search results right in the terminal and ask if you'd like to search for something else, as long as you'd like! 

## Where users can get help with this project ## 

A **[video tutorial]**(https://drive.google.com/file/d/1m0snmoUbZv1pIUkaG7g23EM7dc8od7YP/view) is available, but if you have any further questions about this project, visit my portfolio and [send me a message](https://fkakatie.github.io/responsive-portfolio/contact.html).

## Who maintains this project ##

This project is lovingly (and casually) maintained by me, @[fkakatie](https://github.com/fkakatie). Thanks for checking it out. 
