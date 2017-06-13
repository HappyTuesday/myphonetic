function MyPhonetic(phonetic_map) {
    this.model = {
        songs: ko.observable([]),
        player: {}
    };
    this.player = new SongPlayer(phonetic_map, this.model.player);
}

MyPhonetic.prototype.load_songs = function() {
    $.get('/songs', function(songs) {
       this.model.songs(songs);
    });
};

$(function(){
   var my_phonetic = new MyPhonetic(phonetic_map);
    ko.applyBindings(my_phonetic.model);
    my_phonetic.load_songs();
});