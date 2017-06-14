function LyricLine(player, line) {
    this.player = player;
    this.start = ko.observable(line.start || 0);
    this.end = ko.observable(line.end || this.player.duration());
    this.phonetics = ko.observableArray(line.phonetics || []);

    this.left = ko.pureComputed(function(){
        return this.start() * this.player.unit();
    }, this);

    this.right = ko.pureComputed(function() {
        return this.player.client_width() - this.end() * this.player.unit();
    }, this);

    this.width = ko.pureComputed(function() {
        return (this.end() - this.start()) * this.player.unit() - 1;
    }, this);
}

LyricLine.prototype.push = function(phonetic) {
    return this.phonetics.push(phonetic);
};

LyricLine.prototype.pop = function() {
    return this.phonetics.pop();
};

function SongPlayer(phonetic_map) {
    this.phonetic_map = phonetic_map;

    this.mp3_player = $("#mp3_player")[0];
    this.progress_bar = $("#progress_bar")[0];

    this.lines = ko.observableArray([this.create_new_line({})]);

    this.index = ko.observable(0);
    this.loop = ko.observable(false);
    this.last_find_index = 0;

    this.position = ko.observable(0);
    this.progress_pointer_left = ko.observable(0);
    this.phonetic_lang = ko.observable('dj');
    this.last_key = ko.observable(null);
    this.last_key_appended = ko.observable(true);
}

SongPlayer.prototype.play = function(songInfo, lyric) {
    this.index(0);
    this.last_find_index = 0;
    this.lines.removeAll();
    (lyric.lines || []).forEach(function(line) {
        this.lines.push(this.create_new_line(line));
    }, this);
    if (this.lines().length == 0) {
        this.lines.push(this.create_new_line({}));
    }
    this.loop(false);

    this.last_key(null);
    this.last_key_appended(true);

    this.mp3_player.src = songInfo.mp3url;
    this.mp3_player.play();
};

SongPlayer.MAX_DURATION = 365 * 24 * 3600;

SongPlayer.prototype.stop = function() {
    this.mp3_player.stop();
};

SongPlayer.prototype.client_width = function() {
    return this.progress_bar.clientWidth;
};

SongPlayer.prototype.duration = function() {
    return this.mp3_player.duration || SongPlayer.MAX_DURATION;
};

SongPlayer.prototype.unit = function() {
    return this.client_width() / this.duration();
};

SongPlayer.prototype.create_new_line = function(line) {
    return new LyricLine(this, line);
};

SongPlayer.prototype.current_line = function() {
    return this.lines()[this.index()]
};

SongPlayer.prototype.update_position = function() {
    var p = this.mp3_player.currentTime;
    this.position(p);
    this.progress_pointer_left(p * this.unit());
};

SongPlayer.prototype.update_index = function() {
    this.last_find_index = this.find_line_index(this.position(), this.last_find_index);
    this.index(this.last_find_index);
};

SongPlayer.prototype.before_change_lines = function() {
    this.update_position();
    this.update_index();
    this.commit_last_key();
};

SongPlayer.prototype.goto_line = function(line_index) {
    if (line_index < 0 || line_index >= this.lines().length) return;
    this.last_find_index = line_index;
    this.index(line_index);
    this.mp3_player.currentTime = this.current_line().start();
};

SongPlayer.prototype.start_line = function(){
    this.before_change_lines();
    var line = this.current_line(), p = this.position();
    if (line.end() <= p) {
        var new_line = this.create_new_line({start: p});
        if (this.index() < this.lines().length - 1) {
            new_line.end(this.lines()[this.index() + 1].start());
        }
        this.lines.splice(this.index() + 1, 0, new_line);
        this.index(this.last_find_index = this.index() + 1);
    } else {
        line.start(p);
    }
};

SongPlayer.prototype.end_line = function(){
    this.before_change_lines();
    var line = this.current_line(), p = this.position();
    if (p < line.end()) {
        this.lines.splice(this.index() + 1, 0, this.create_new_line({start: p, end: line.end()}));
    }
    line.end(p);
};

SongPlayer.prototype.merge_line = function(){
    this.before_change_lines();
    var line = this.current_line();
    if (this.index() == this.lines().length - 1) {
        return;
    }
    var next_line = this.lines()[this.index() + 1];
    line.end(next_line.end());
    line.phonetics(line.phonetics().concat(next_line.phonetics()));
    this.lines.splice(this.index() + 1, 1);
};

SongPlayer.prototype.split_line = function() {
    this.before_change_lines();
    var line = this.current_line(), p = this.position(), new_line;
    if (p < line.end()) {
        new_line = this.create_new_line({start: p, end: line.end()});
        line.end(p);
        this.lines.splice(this.index() + 1, 0, new_line);
    } else {
        new_line = this.create_new_line({start: p});
        if (this.index() < this.lines().length - 1) {
            new_line.end(this.lines()[this.index() + 1].start());
        }
        this.lines.splice(this.index() + 1, 0, new_line);
    }
    this.index(this.last_find_index = this.index() + 1);
};

SongPlayer.prototype.switch_loop = function(){
    this.loop(!this.loop());
};

SongPlayer.prototype.switch_play_status = function () {
    if (this.mp3_player.paused) {
        this.mp3_player.play();
    } else {
        this.mp3_player.pause();
    }
};

SongPlayer.prototype.prev_line = function(){
    this.before_change_lines();
    if (this.index() <= 0) {
        this.goto_line(this.lines().length - 1);
    } else {
        this.goto_line(this.index() - 1);
    }
};

SongPlayer.prototype.next_line = function(){
    this.before_change_lines();
    if (this.index() >= this.lines().length - 1) {
        this.goto_line(0);
    } else {
        this.goto_line(this.index() + 1);
    }
};

SongPlayer.prototype.remove_line = function(line_index) {
    this.before_change_lines();
    if (line_index < 0 || line_index >= this.lines().length) return;
    if (this.lines().length == 1) {
        this.lines.push(this.create_new_line({}));
    }
    if (this.index() >= this.lines().length - 1) {
        this.goto_line(0);
    }
    this.lines.splice(line_index, 1);
};

SongPlayer.prototype.remove_current_line = function() {
    this.before_change_lines();
    this.remove_line(this.index());
};

SongPlayer.prototype.find_line_index = function(p, start_from) {
    var i, lines = this.lines();
    if (p < lines[0].start()) return 0;
    for (i = start_from; i < lines.length - 1; i++) {
        if (lines[i].start() <= p && p < lines[i+1].start()) {
            return i;
        }
    }
    for (i = 0; i < start_from - 1; i++) {
        if (lines[i].start() <= p && p < lines[i+1].start()) {
            return i;
        }
    }
    return lines.length - 1;
};

SongPlayer.prototype.keypress = function(m, e) {
    if(e.key == 'Enter'){
        this.split_line();
    } else if(e.key == ' '){
        this.append_normal_key(e.key);
    } else if(e.key == '['){
        this.start_line();
    } else if(e.key == ']'){
        this.end_line();
        this.loop(true);
    } else if(e.key == '{'){
        this.prev_line();
    } else if(e.key == '}'){
        this.next_line();
    } else if(e.key == '='){
        this.switch_play_status();
    } else if (e.key == '-') {
        this.switch_loop();
    } else if (e.key == '<') {
        this.current_time_backward();
    } else if (e.key == '>') {
        this.current_time_forward();
    } else if (e.key == '\\') {
        this.merge_line();
    } else {
        this.handle_input(e.key);
    }
    return true;
};

SongPlayer.prototype.keydown = function(m, e) {
    if(e.key == 'Backspace') {
        this.backspace();
    } else if (e.key == 'ArrowUp') {
        this.prev_line();
    } else if (e.key == 'ArrowDown') {
        this.next_line();
    } else if (e.key == 'Delete') {
        this.remove_current_line();
    }
    return true;
};

SongPlayer.prototype.timeupdate = function() {
    var p = this.mp3_player.currentTime;
    if (this.loop()) {
        if (this.current_line().end() < p) {
            this.mp3_player.currentTime = this.current_line().start();
        }
    }
    this.update_position();
    this.update_index();
};

SongPlayer.prototype.durationchange = function() {
    var new_duration = this.mp3_player.duration;
    if (!new_duration) return true;
    this.lines().forEach(function(line){
        if (line.end() == SongPlayer.MAX_DURATION) {
            line.end(new_duration);
        }
    }, this);
};

SongPlayer.prototype.handle_input = function(key) {
    if (this.last_key() != null) {
        if(this.phonetic_map[this.last_key() + key]) {
            this.append_phonetic(this.last_key() + key, this.last_key_appended());
            this.last_key(null);
            this.last_key_appended(true);
        } else {
            this.commit_last_key();
            if (this.phonetic_map[key]) {
                this.append_phonetic(key, false);
            } else {
                this.last_key(key);
                this.last_key_appended(false);
            }
        }
    } else if (this.phonetic_map[key]) {
        this.append_phonetic(key, false);
        this.last_key_appended(true);
    } else {
        this.last_key(key);
        this.last_key_appended(false);
    }
};

SongPlayer.prototype.commit_last_key = function(){
    if(!this.last_key_appended()){
        console.warn("last typed key is invalid: %s", this.last_key());
    }
    this.last_key(null);
    this.last_key_appended(true);
};

SongPlayer.prototype.append_normal_key = function(key){
    this.commit_last_key();
    this.current_line().push(key);
};

SongPlayer.prototype.append_phonetic = function(phonetic_key, is_replace){
    if (is_replace) {
        this.current_line().pop();
    }
    this.current_line().push(this.phonetic_map[phonetic_key][this.phonetic_lang()]);
    this.last_key_appended(true);
    if(is_replace){
        this.last_key(null);
    } else {
        this.last_key(phonetic_key);
    }
};

SongPlayer.prototype.backspace = function(){
    if(this.last_key_appended()){
        this.current_line().pop();
    } else {
        this.last_key(null);
        this.last_key_appended(true);
    }
};

SongPlayer.prototype.current_time_backward = function(){
    this.mp3_player.currentTime -= 5;
};

SongPlayer.prototype.current_time_forward = function(){
    this.mp3_player.currentTime += 5;
};

SongPlayer.prototype.lyric_for_upload = function() {
    return {
        lines: this.lines().map(function(line){
            return {
                start: line.start(),
                end: line.end(),
                phonetics: line.phonetics()
            };
        })
    };
};

// utility
Array.prototype.last = function() {
    return this[this.length - 1];
};