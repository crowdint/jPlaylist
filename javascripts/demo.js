$(function(){
  Track = function (artist, samples, title, time){
    this.artist = artist;
    this.samples = samples;
    this.title = title;
    this.time = time;
  };
  tracks = [];
  $(".song").not(".no-sample").each(function(index, element){
    obj = $(element);
    samples = {};
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
    * This could change easyly in the code.
    */
    if (obj.attr("mp3") != undefined){
      samples["mp3"] = obj.attr("mp3");
    }
    if (obj.attr("ogg") != undefined){
      samples["oga"] = obj.attr("ogg");
    }
    if (obj.attr("m4a") != undefined){
      samples["m4a"] = obj.attr("m4a");
    }
    track = new Track(obj.attr("artist"), samples, obj.attr("title"),obj.attr("time"));
    tracks.push(track);
  });
  playlist = $("#jplaylist").jPlaylist({
    tracks: tracks
  });
})