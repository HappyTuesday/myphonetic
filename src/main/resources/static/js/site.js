function Lyric(player, song, id, lines) {
    this.player = player;
    this.song = song;
    this.id = id;
    this.lines = lines;
    this.active = ko.observable(false);
    this.drafts = ko.observableArray([]);
}

Lyric.prototype.handle_click = function() {
    this.activate_and_play();
};

Lyric.prototype.activate = function() {
    this.song.activate();
    this.song.lyrics().forEach(function(l){
        l.active(l == this);
    }, this);
};

Lyric.prototype.activate_and_play = function() {
    this.activate();
    this.play();
}

Lyric.prototype.play = function() {
    this.player.play(this);
};

Lyric.prototype.save = function() {
    $.ajax('/song/' + this.song.name + '/lyric/' + this.id, {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: this.id,
            lines: this.lines = this.get_latest_lines()
        }),
        success: function(result){
            this.id = result.id;
        }.bind(this)
    });
};

Lyric.prototype.save_draft = function(draft) {
    this.drafts.push(draft);
};

Lyric.prototype.load_draft = function() {
    return this.drafts.pop();
};

Lyric.prototype.save_as_new = function() {
    $.ajax('/song/' + this.song.name + '/lyric', {
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            lines: this.get_latest_lines()
        }),
        success: function(result){
            this.song.push_lyric(result).activate_and_play();
        }.bind(this)
    });
};

Lyric.prototype.remove = function() {
    $.ajax('/song/' + this.song.name + '/lyric/' + this.id, {
        type: 'DELETE',
        success: function(){
            var index = this.song.find_lyric_index_by_id(this.id);
            this.song.lyrics.splice(index, 1);
            if (index >= this.song.lyrics().length) {
                index--;
            }
            if (index >= 0) {
                this.song.lyrics()[index].activate_and_play();
            } else {
                this.song.create_lyric();
            }
        }.bind(this)
    });
};

Lyric.prototype.get_latest_lines = function() {
    return this == this.player.lyric() ? this.player.lines_for_upload() : this.lines;
};

function Song(my_phonetic, name) {
    this.my_phonetic = my_phonetic;
    this.name = name;
    this.mp3url = "";
    this.lyrics = ko.observableArray([]);
    this.active = ko.observable(false);
    this.loaded = ko.observable(false);
}

Song.prototype.find_lyric_index_by_id = function(id) {
    var lyrics = this.lyrics();
    for (var i = 0; i < lyrics.length; i++) {
        if (lyrics[i].id == id) return i;
    }
};

Song.prototype.push_lyric = function(lyric){
    var obj = new Lyric(this.my_phonetic.player, this, lyric.id, lyric.lines)
    this.lyrics.push(obj);
    return obj;
};

Song.prototype.set_lyrics = function(lyrics) {
    this.lyrics.removeAll();
    lyrics.forEach(function(l){
        this.push_lyric(l);
    }, this);
};

Song.prototype.create_lyric = function() {
    $.ajax('/song/' + this.name + '/lyric', {
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function(result){
            this.push_lyric(result).activate_and_play();
        }.bind(this)
    });
};

Song.prototype.load = function() {
    $.ajax('/song/' + this.name, {
        type: 'GET',
        success: function(result) {
            this.loaded(true);
            this.mp3url = result.mp3url;
            this.set_lyrics(result.lyrics);
            this.activate();

            if (this.lyrics().length == 0) {
                this.create_lyric();
            } else {
                this.lyrics()[0].activate_and_play();
            }
        }.bind(this)
    });
};

Song.prototype.activate = function() {
    this.my_phonetic.songs().forEach(function(s){
        s.active(s == this);
    }, this);
};

Song.prototype.remove = function() {
    $.ajax('/song/' + this.name, {
        type: 'DELETE',
        success: function() {
            if (this.active()) {
                this.my_phonetic.player.stop();
                this.lyrics().forEach(function(l){
                    l.active(false);
                });
                this.active(false);
            }
            this.my_phonetic.songs.splice(this.my_phonetic.songs().indexOf(this), 1);
        }.bind(this)
    });
};

Song.prototype.handle_click = function() {
    if (this.loaded()) {
        this.activate();
        this.lyrics().forEach(function(l){
            if (l.active()) {
                l.play();
                return true;
            }
        })
    } else {
        this.load();
    }
};

function MyPhonetic(phonetic_map) {
    this.songs = ko.observableArray([]);
    this.player = new SongPlayer(phonetic_map, this);
}

MyPhonetic.prototype.load_songs = function() {
    $.get('/songs', function(songs) {
        this.songs.removeAll();
        songs.forEach(function(s){
            this.songs.push(new Song(this, s));
        }, this);
    }.bind(this));
};

var my_phonetic;

$(function(){
    my_phonetic = new MyPhonetic(phonetic_map);
    ko.applyBindings(my_phonetic);
    my_phonetic.load_songs();
});