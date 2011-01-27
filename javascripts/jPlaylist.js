/*
 * jPlaylist Plugin for jPlayer JavaScript Audio and Video Player
 * 
 *    https://github.com/crowdint/jPlaylist
 *
 * For further information about jPlayer visit:
 *
 *    http://www.happyworm.com/jquery/jplayer
 *
 * Copyright (c) 2011 Crowd Interactive
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Daniel A. Gaytán Valencia
 * Version: 0.0.1
 * Date: 26th January 2011
 */

(function( $ ){
  $.fn.jPlaylist = function(options) {
    /*
    * Default Options
    */
    this.options = {
      mobile: false,
      player: "#jplayer",
      tracks: [],
      ui: {
        main: {
          information: {
            title_class: ".information .title"
          },
          controls: {
            play_class: ".main-play",
            pause_class: ".main-pause",
            back_class: ".main-back",
            forward_class: ".main-forward"
          }
        },
        tracks_class: ".playlist",
        tracks: {
          track_class: ".song",
          no_sample_class: ".no-sample",
          controls: {
            play_class: ".play",
            pause_class: ".pause",
            back_class: ".back",
            forward_class: ".forward"
          }
        }
      }
    };
    /*
    * A track object should have this structure:
    *
    * {
    *   artist: "artist3",
    *   title: "title3",
    *   samples: {
    *     mp3: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.mp3",
    *     m4a: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
    *     oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
    *   }
    *   time: "2:00PM"
    * }
    *
    */
    this.options.mobile =                               (options.mobile == undefined)? this.options.mobile : options.mobile;
    this.options.tracks =                               (options.tracks == undefined)? this.options.tracks : options.tracks;
    this.options.player =                               (options.player == undefined)? this.options.player : options.player;
    if (options.ui != undefined){
      if (options.ui.main != undefined){
        this.options.ui.main.information =                  (options.ui.main.information == undefined)? this.options.ui.main.information : options.ui.main.information;
        this.options.ui.main.controls.play_class =          (options.ui.main.controls.play_class == undefined)? this.options.ui.main.controls.play_class : options.ui.main.controls.play_class;
        this.options.ui.main.controls.pause_class =         (options.ui.main.controls.pause_class == undefined)? this.options.ui.main.controls.pause_class : options.ui.main.controls.pause_class;
        this.options.ui.main.controls.back_class =          (options.ui.main.controls.back_class == undefined)? this.options.ui.main.controls.back_class : options.ui.main.controls.back_class;
        this.options.ui.main.controls.forward_class =       (options.ui.main.controls.forward_class == undefined)? this.options.ui.main.controls.forward_class : options.ui.main.controls.forward_class;
        this.options.ui.main.tracks_class =                 (options.ui.tracks_class == undefined)? this.options.ui.tracks_class : options.ui.tracks_class;
      }
      if (options.ui.tracks != undefined){
        this.options.ui.tracks.track_class =                (options.ui.tracks.track_class == undefined)? this.options.ui.tracks.track_class : options.ui.tracks.track_class;
        this.options.ui.tracks.no_sample_class =            (options.ui.tracks.no_sample_class == undefined)? this.options.ui.tracks.no_sample_class : options.ui.tracks.no_sample_class;
        if (options.ui.tracks.controls != undefined){
          this.options.ui.tracks.controls.play_class =        (options.ui.tracks.controls.play_class == undefined)? this.options.ui.tracks.controls.play_class : options.ui.tracks.controls.play_class;
          this.options.ui.tracks.controls.pause_class =       (options.ui.tracks.controls.pause_class == undefined)? this.options.ui.tracks.controls.pause_class : options.ui.tracks.controls.pause_class;
          this.options.ui.tracks.controls.back_class =        (options.ui.tracks.controls.back_class == undefined)? this.options.ui.tracks.controls.back_class : options.ui.tracks.controls.back_class;
          this.options.ui.tracks.controls.forward_class =     (options.ui.tracks.controls.forward_class == undefined)? this.options.ui.tracks.controls.forward_class : options.ui.tracks.controls.forward_class;
        }
      }
    }
    // UI objects
    this.ui = {
      main_play: $(this.options.ui.main.controls.play_class),
      main_pause: $(this.options.ui.main.controls.pause_class),
      main_back: $(this.options.ui.main.controls.back_class),
      main_forward: $(this.options.ui.main.controls.forward_class),
      playlist: $(this.options.ui.tracks_class)
    };
    this.tracks = this.options.tracks;
    this.tracks_with_sample = $(this.options.ui.tracks.track_class).not(this.options.ui.tracks.no_sample_class);
    for(i = 0; i < this.tracks.length; i++ ){
      this.tracks[i]["ui"] = {
        play: $(this.tracks_with_sample[i]).children(this.options.ui.tracks.controls.play_class),
        pause: $(this.tracks_with_sample[i]).children(this.options.ui.tracks.controls.pause_class),
        back: $(this.tracks_with_sample[i]).children(this.options.ui.tracks.controls.back_class),
        forward: $(this.tracks_with_sample[i]).children(this.options.ui.tracks.controls.forward_class)
      }
      this.tracks[i]["supplied_formats"] = function(){
        formats = "";
        for (key in this.samples){
            formats += key + ", "
        }
        return formats;
      }
    }
    this.current_track = this.tracks[0];
    this.current_track_index = 0;
    this.player = $(this.options.player);
    playlist_object = this;
    if (this.tracks.length > 0){
      this.player.jPlayer({
        ready: function () {
          $(this).jPlayer("setMedia", playlist_object.tracks[0].samples);
        },
        supplied: playlist_object.tracks[0].supplied_formats(),
        ended: function () {
          playlist_object.is_playing = false;
          // change main pause to play
          playlist_object.change_main_pause_to_play();
          // change track pause to play
          playlist_object.change_current_track_pause_to_play();
        }
      });
    }
    this.is_playing = false;

    this.play = function(){
      this.player.jPlayer("play");
      this.is_playing = true;
    }

    this.pause = function(){
      this.player.jPlayer("pause");
      this.is_playing = false;
    }

    this.back = function(){
      song = (this.current_track_index == 0)? this.tracks.length - 1 : this.current_track_index - 1;
      this.player.jPlayer("setMedia", playlist_object.tracks[song].samples);
      this.player.jPlayer("option", "supplied", playlist_object.tracks[song].supplied_formats());
      if (this.is_playing){
        this.player.jPlayer("play");
      }
      this.current_track = playlist_object.tracks[song];
      this.current_track_index = song;
    }

    this.forward = function(){
      if (this.current_track_index == this.tracks.length - 1){
        song = 0;
      } else {
        song = this.current_track_index + 1;
      }
      playlist_obj = this;
      this.player.jPlayer("setMedia", playlist_object.tracks[song].samples);
      this.player.jPlayer("option", "supplied", playlist_object.tracks[song].supplied_formats());
      if (this.is_playing){
        this.player.jPlayer("play");
      }
      this.current_track = playlist_object.tracks[song];
      this.current_track_index = song;
    }

    this.play_track = function(track_index){
      this.player.jPlayer("setMedia", playlist_object.tracks[track_index].samples);
      this.player.jPlayer("option", "supplied", playlist_object.tracks[track_index].supplied_formats());
      this.play();
      this.current_track = playlist_object.tracks[track_index];
      this.current_track_index = track_index;
    }

    this.update_information = function(){
      $(this.options.ui.main.information.title_class).html(this.current_track.artist + " - " + this.current_track.title);
    }
    this.change_main_play_to_pause = function(){
      playlist_object.ui.main_play.hide();
      playlist_object.ui.main_pause.show();
    }
    this.change_current_track_play_to_pause = function(){
      playlist_object.current_track.ui.play.hide();
      playlist_object.current_track.ui.pause.show();
    }
    this.change_main_pause_to_play = function(){
      playlist_object.ui.main_pause.hide();
      playlist_object.ui.main_play.show();
    }
    this.change_current_track_pause_to_play = function(){
      playlist_object.current_track.ui.pause.hide();
      playlist_object.current_track.ui.play.show();
    }
    this.show_back_and_forward_buttons = function(){
      playlist_object.ui.main_back.show();
      playlist_object.ui.main_forward.show();
    }
    this.show_current_track_back_and_forward_buttons = function(){
      playlist_object.current_track.ui.back.show();
      playlist_object.current_track.ui.forward.show();
    }
    this.hide_current_track_back_and_forward_buttons = function(){
      playlist_object.current_track.ui.back.hide();
      playlist_object.current_track.ui.forward.hide();
    }

    /*
    * Set up events
    */
    if (!this.options.mobile){
      $(this.options.ui.main.controls.play_class).bind("click", function(){
        // show loading
        console.log("Loading");
        // charge the track
        playlist_object.play();
        // change main play to pause
        playlist_object.change_main_play_to_pause();
        // show back and forward buttons
        playlist_object.show_back_and_forward_buttons();
        // change track play to pause
        playlist_object.change_current_track_play_to_pause();
        // show current track back and forward buttons
        playlist_object.show_current_track_back_and_forward_buttons();
        // update information
        playlist_object.update_information();
      });
      $(this.options.ui.main.controls.pause_class).bind("click", function(){
        // pause the track
        playlist_object.pause();
        // change main pause to play
        playlist_object.change_main_pause_to_play();
        // change track pause to play
        playlist_object.change_current_track_pause_to_play();
        // hide current track back and forward buttons
        playlist_object.hide_current_track_back_and_forward_buttons();
      });
      $(this.options.ui.main.controls.back_class).bind("click", function(){
        if (playlist_object.is_playing){
          // change main pause to play
          playlist_object.change_main_pause_to_play();
          // change track pause to play
          playlist_object.change_current_track_pause_to_play();
          // hide current track back and forward buttons
          playlist_object.hide_current_track_back_and_forward_buttons();
          // change current track to the previous one
          playlist_object.back();
          // update information
          playlist_object.update_information();
          // change main play to pause
          playlist_object.change_main_play_to_pause();
          // change track play to pause
          playlist_object.change_current_track_play_to_pause();
          // show current track back and forward buttons
          playlist_object.show_current_track_back_and_forward_buttons();
        } else {
          // change current track to the previous one
          playlist_object.back();
          // update information
          playlist_object.update_information();
        }
      });
      $(this.options.ui.main.controls.forward_class).bind("click", function(){
        if (playlist_object.is_playing){
          // change main pause to play
          playlist_object.change_main_pause_to_play();
          // change track pause to play
          playlist_object.change_current_track_pause_to_play();
          // hide current track back and forward buttons
          playlist_object.hide_current_track_back_and_forward_buttons();
          // change current track to the previous one
          playlist_object.forward();
          // update information
          playlist_object.update_information();
          // change main play to pause
          playlist_object.change_main_play_to_pause();
          // change track play to pause
          playlist_object.change_current_track_play_to_pause();
          // show current track back and forward buttons
          playlist_object.show_current_track_back_and_forward_buttons();
        } else {
          // change current track to the next one
          playlist_object.forward();
          // update information
          playlist_object.update_information();
        }
      });
      $(this.tracks_with_sample).children(this.options.ui.tracks.controls.play_class).bind("click", function(){
        // change main pause to play
        playlist_object.change_main_pause_to_play();
        // change track pause to play
        playlist_object.change_current_track_pause_to_play();
        // hide current track back and forward buttons
        playlist_object.hide_current_track_back_and_forward_buttons();
        // change current track to the previous one
        playlist_object.play_track(playlist_object.tracks_with_sample.index(  $(this).parents(playlist_object.options.ui.tracks.track_class) ));
        // update information
        playlist_object.update_information();
        // change main play to pause
        playlist_object.change_main_play_to_pause();
        // change track play to pause
        playlist_object.change_current_track_play_to_pause();
        // show current track back and forward buttons
        playlist_object.show_current_track_back_and_forward_buttons();
      });
      $(this.tracks_with_sample).children(this.options.ui.tracks.controls.pause_class).bind("click", function(){
        // pause the track
        playlist_object.pause();
        // change main pause to play
        playlist_object.change_main_pause_to_play();
        // change track pause to play
        playlist_object.change_current_track_pause_to_play();
        // hide current track back and forward buttons
        playlist_object.hide_current_track_back_and_forward_buttons();
      });
      $(this.tracks_with_sample).children(this.options.ui.tracks.controls.back_class).bind("click", function(){
        if (playlist_object.is_playing){
          // change main pause to play
          playlist_object.change_main_pause_to_play();
          // change track pause to play
          playlist_object.change_current_track_pause_to_play();
          // hide current track back and forward buttons
          playlist_object.hide_current_track_back_and_forward_buttons();
          // change current track to the previous one
          playlist_object.back();
          // update information
          playlist_object.update_information();
          // change main play to pause
          playlist_object.change_main_play_to_pause();
          // change track play to pause
          playlist_object.change_current_track_play_to_pause();
          // show current track back and forward buttons
          playlist_object.show_current_track_back_and_forward_buttons();
        } else {
          // change current track to the next one
          playlist_object.back();
          // update information
          playlist_object.update_information();
        }
      });
      $(this.tracks_with_sample).children(this.options.ui.tracks.controls.forward_class).bind("click", function(){
        if (playlist_object.is_playing){
          // change main pause to play
          playlist_object.change_main_pause_to_play();
          // change track pause to play
          playlist_object.change_current_track_pause_to_play();
          // hide current track back and forward buttons
          playlist_object.hide_current_track_back_and_forward_buttons();
          // change current track to the previous one
          playlist_object.forward();
          // update information
          playlist_object.update_information();
          // change main play to pause
          playlist_object.change_main_play_to_pause();
          // change track play to pause
          playlist_object.change_current_track_play_to_pause();
          // show current track back and forward buttons
          playlist_object.show_current_track_back_and_forward_buttons();
        } else {
          // change current track to the next one
          playlist_object.forward();
          // update information
          playlist_object.update_information();
        }
      });
    } else {
      var touch_moving = false

      $("body").bind("touchmove", function(){
        touch_moving = true;
      })

      $(this.options.ui.main.controls.play_class).bind("touchstart", function(){
        touch_moving = false;
      });

      $(this.options.ui.main.controls.pause_class).bind("touchstart", function(){
        touch_moving = false;
      });

      $(this.options.ui.main.controls.back_class).bind("touchstart", function(){
        touch_moving = false;
      });

      $(this.options.ui.main.controls.forward_class).bind("touchstart", function(){
        touch_moving = false;
      });

      $(this.options.ui.main.controls.play_class).bind("touchend", function(){
        if (!touch_moving){
          // show loading
          console.log("Loading");
          // charge the track
          playlist_object.play();
          // change main play to pause
          playlist_object.change_main_play_to_pause();
          // show back and forward buttons
          playlist_object.show_back_and_forward_buttons();
          // change track play to pause
          playlist_object.change_current_track_play_to_pause();
          // show current track back and forward buttons
          playlist_object.show_current_track_back_and_forward_buttons();
          // update information
          playlist_object.update_information();
        }
        touch_moving = false;
      });
      $(this.options.ui.main.controls.pause_class).bind("touchend", function(){
        if (!touch_moving){
          // pause the track
          playlist_object.pause();
          // change main pause to play
          playlist_object.change_main_pause_to_play();
          // change track pause to play
          playlist_object.change_current_track_pause_to_play();
          // hide current track back and forward buttons
          playlist_object.hide_current_track_back_and_forward_buttons();
        }
        touch_moving = false;
      });
      $(this.options.ui.main.controls.back_class).bind("touchend", function(){
        if (!touch_moving){
          if (playlist_object.is_playing){
            // change main pause to play
            playlist_object.change_main_pause_to_play();
            // change track pause to play
            playlist_object.change_current_track_pause_to_play();
            // hide current track back and forward buttons
            playlist_object.hide_current_track_back_and_forward_buttons();
            // change current track to the previous one
            playlist_object.back();
            // update information
            playlist_object.update_information();
            // change main play to pause
            playlist_object.change_main_play_to_pause();
            // change track play to pause
            playlist_object.change_current_track_play_to_pause();
            // show current track back and forward buttons
            playlist_object.show_current_track_back_and_forward_buttons();
          } else {
            // change current track to the previous one
            playlist_object.back();
            // update information
            playlist_object.update_information();
          }
        }
        touch_moving = false;
      });
      $(this.options.ui.main.controls.forward_class).bind("touchend", function(){
        if (!touch_moving){
          if (playlist_object.is_playing){
            // change main pause to play
            playlist_object.change_main_pause_to_play();
            // change track pause to play
            playlist_object.change_current_track_pause_to_play();
            // hide current track back and forward buttons
            playlist_object.hide_current_track_back_and_forward_buttons();
            // change current track to the previous one
            playlist_object.forward();
            // update information
            playlist_object.update_information();
            // change main play to pause
            playlist_object.change_main_play_to_pause();
            // change track play to pause
            playlist_object.change_current_track_play_to_pause();
            // show current track back and forward buttons
            playlist_object.show_current_track_back_and_forward_buttons();
          } else {
            // change current track to the next one
            playlist_object.forward();
            // update information
            playlist_object.update_information();
          }
        }
        touch_moving = false;
      });
      $(this.tracks_with_sample).children(this.options.ui.tracks.controls.play_class).bind("touchend", function(){
        if (!touch_moving){
          // change main pause to play
          playlist_object.change_main_pause_to_play();
          // change track pause to play
          playlist_object.change_current_track_pause_to_play();
          // hide current track back and forward buttons
          playlist_object.hide_current_track_back_and_forward_buttons();
          // change current track to the previous one
          playlist_object.play_track(playlist_object.tracks_with_sample.index(  $(this).parents(playlist_object.options.ui.tracks.track_class) ));
          // update information
          playlist_object.update_information();
          // show back and forward buttons
          playlist_object.show_back_and_forward_buttons();
          // change main play to pause
          playlist_object.change_main_play_to_pause();
          // change track play to pause
          playlist_object.change_current_track_play_to_pause();
          // show current track back and forward buttons
          playlist_object.show_current_track_back_and_forward_buttons();
        }
        touch_moving = false;
      });
      $(this.tracks_with_sample).children(this.options.ui.tracks.controls.pause_class).bind("touchend", function(){
        if (!touch_moving){
          // pause the track
          playlist_object.pause();
          // change main pause to play
          playlist_object.change_main_pause_to_play();
          // change track pause to play
          playlist_object.change_current_track_pause_to_play();
          // hide current track back and forward buttons
          playlist_object.hide_current_track_back_and_forward_buttons();
        }
        touch_moving = false;
      });
      $(this.tracks_with_sample).children(this.options.ui.tracks.controls.back_class).bind("touchend", function(){
        if (!touch_moving){
          if (playlist_object.is_playing){
            // change main pause to play
            playlist_object.change_main_pause_to_play();
            // change track pause to play
            playlist_object.change_current_track_pause_to_play();
            // hide current track back and forward buttons
            playlist_object.hide_current_track_back_and_forward_buttons();
            // change current track to the previous one
            playlist_object.back();
            // update information
            playlist_object.update_information();
            // change main play to pause
            playlist_object.change_main_play_to_pause();
            // change track play to pause
            playlist_object.change_current_track_play_to_pause();
            // show current track back and forward buttons
            playlist_object.show_current_track_back_and_forward_buttons();
          } else {
            // change current track to the next one
            playlist_object.back();
            // update information
            playlist_object.update_information();
          }
        }
        touch_moving = false;
      });
      $(this.tracks_with_sample).children(this.options.ui.tracks.controls.forward_class).bind("touchend", function(){
        if (!touch_moving){
          if (playlist_object.is_playing){
            // change main pause to play
            playlist_object.change_main_pause_to_play();
            // change track pause to play
            playlist_object.change_current_track_pause_to_play();
            // hide current track back and forward buttons
            playlist_object.hide_current_track_back_and_forward_buttons();
            // change current track to the previous one
            playlist_object.forward();
            // update information
            playlist_object.update_information();
            // change main play to pause
            playlist_object.change_main_play_to_pause();
            // change track play to pause
            playlist_object.change_current_track_play_to_pause();
            // show current track back and forward buttons
            playlist_object.show_current_track_back_and_forward_buttons();
          } else {
            // change current track to the next one
            playlist_object.forward();
            // update information
            playlist_object.update_information();
          }
        }
        touch_moving = false;
      });
    }
    return this;
  };
})( jQuery );