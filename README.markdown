# jPlaylist

This jquery plugin is intended to be used along [jPlayer](http://jplayer.org/) which is an html5 + javascript + flash based audio/video player for your site.

jPlayer could be used setting some classes and ids inside a specific div that you must provide and currently has no predefined and user friendly way to set up a playlist. jPlaylist is a cool decoupled plugin that will help you to use jPlayer functionalities with your customized selectors for both player and playlist.

# Getting started

jPlaylist takes from your html code special classes for the main player and the playlist tracks. The next ones are the default selectors:

Main Player:

    jPlayer selector: "#jplayer"
    Information: ".information .title"
    Main Play Control: ".main-play"
    Main Pause Control: ".main-pause"
    Main Back Control: ".main-back"
    Main Forward Control: ".main-forward"
    Playlist Class: ".playlist"

Within the playlist selector, there should be the tracks with the specified classes:

    Track class: ".song"
    No sample class: ".no-sample"
    Play control: ".play"
    Pause control: ".pause"
    Back control: ".back"
    Forward control: ".forward"

To totally decouple the html and the javascript functionality, jPlaylist takes the tracks' samples and all these classes as parameters to the object as follows:

    tracks = [
      {
        artist: "artist1"
        title: "title1",
        samples: {
          mp3: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.mp3"
        }
        time: "2:00PM"
      },
      {
        artist: "artist2"
        title: "title2",
        samples: {
          m4a: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
          oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
        }
        time: "2:00PM"
      },
      {
        artist: "artist3"
        title: "title3",
        samples: {
          mp3: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.mp3",
          m4a: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
          oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
        }
        time: "2:00PM"
      }
    ];
    
    playlist = $("#jPlaylist").jPlaylist({
      mobile: false,
      player: "#jplayer",
      tracks: tracks,
      ui: {
        main: {
          information: {
            title_class: "mydiv .information .title"
          },
          controls: {
            play_class: ".my-main-play",
            pause_class: ".my-main-pause",
            back_class: ".my-main-back",
            forward_class: ".my-main-forward"
          }
        },
        tracks_class: ".my-playlist",
        tracks: {
          track_class: ".my-song",
          no_sample_class: ".my-no-sample",
          controls: {
            play_class: ".my-play",
            pause_class: ".my-pause",
            back_class: ".my-back",
            forward_class: ".my-forward"
          }
        }
      }
    });

For this release, the tracks must be in the same order as they appear in the HTML to follow the playlist the right way.

That's all. The songs will be took from the params and if the player could play it, it will depending on the formats given and the browser.