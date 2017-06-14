function MyPhonetic(phonetic_map) {
    this.self = this;
    this.songs = ko.observableArray([]);
    this.current_song = ko.observable({});
    this.current_lyric = ko.observable({});
    this.player = new SongPlayer(phonetic_map);
}

MyPhonetic.prototype.load_songs = function() {
    $.get('/songs', function(songs) {
        this.current_song({});
        this.current_lyric({});
        this.songs.removeAll();
        songs.forEach(function(s){this.songs.push(s)}, this);
        if (songs.length > 0) {
            this.current_song(songs[0]);
        }
    }.bind(this));
};

MyPhonetic.prototype.set_current_song = function(songName) {
    $.get('/song/' + songName, function(song) {
        this.current_song(song);
        this.play();
    }.bind(this));
};

MyPhonetic.prototype.set_current_lyric = function(lyric) {
    this.current_lyric(lyric);
};

MyPhonetic.prototype.play = function() {
    this.player.play(this.current_song(), this.current_lyric());
};

var my_phonetic;

$(function(){
    my_phonetic = new MyPhonetic(phonetic_map);
    ko.applyBindings(my_phonetic);
    my_phonetic.load_songs();
});