function SongPlayer(phonetic_map, model) {
    this.phonetic_map = phonetic_map;
    this.model = model;

    this.MAX_END = 2 << 31;
    this.model = model;
    this.lines = [{begin: 0, end: this.MAX_END, phonetics: []}];
    this.index = 0;
    this.loop = false;
    this.last_find_index = 0;

    this.mp3_player = $("#mp3_player")[0];
    this.ol_segments = $("#ol_segments");
    this.time_position = $("#time_position");

    this.model.phonetic_lang = ko.observable('dj');
    this.last_key = null;
    this.last_key_appended = true;

    $("#input").keypress(this.keypress).keydown(this.keydown);
    $(this.mp3_player).bind('timeupdate', this.time_update);
}

SongPlayer.prototype.new_line = function(begin, end, phonetics) {
    return {
        begin: begin || 0,
        end: end || this.MAX_END,
        phonetics: phonetics || []
    };
};

SongPlayer.prototype.current_line = function() {
    return this.lines[this.index]
};

SongPlayer.prototype.start_line = function(){
    this.commit_last_key();
    var p = this.mp3_player.currentTime;
    this.update_index(p);
    var line = this.current_line();
    if (line.end <= p) {
        var new_line = this.new_line(p);
        if (this.index < this.lines.length - 1) {
            new_line.end = this.lines[this.index + 1].start;
        }
        this.lines.splice(this.index + 1, 0, new_line);
        this.last_find_index = this.index = this.index + 1;
    } else {
        line.start = p;
    }
};

SongPlayer.prototype.end_line = function(){
    var p = this.mp3_player.currentTime;
    this.commit_last_key();
    this.update_index(p);
    var line = this.current_line();
    if (p < line.end) {
        this.lines.splice(this.index + 1, 0, this.new_line(p, line.end));
    }
    line.end = p;
    this.loop = true;
};

SongPlayer.prototype.merge_line = function(){
    this.commit_last_key();
    var p = this.mp3_player.currentTime;
    this.update_index(p);
    var line = this.current_line();
    if (this.index == this.lines.length - 1) {
        return;
    }
    var next_line = this.lines[this.index + 1];
    line.end = next_line.end;
    line.phonetics = line.phonetics.concat(next_line.phonetics);
    this.lines.splice(this.index + 1, 1);
};

SongPlayer.prototype.update_index = function() {
    var p = this.mp3_player.currentTime;
    this.last_find_index = this.index = this.find_line_index(p, this.last_find_index);
};

SongPlayer.prototype.switch_loop = function(){
    this.loop = !this.loop;
};

SongPlayer.prototype.switch_play_status = function () {
    this.mp3_player.paused = !this.mp3_player.paused;
};

SongPlayer.prototype.prev_line = function(){
    this.commit_last_key();
    this.index--;
    if (this.index < 0) this.index = this.lines.length - 1;
    this.last_find_index = this.index;
};

SongPlayer.prototype.next_line = function(){
    this.commit_last_key();
    this.index++;
    if (this.index == this.lines.length) {
        this.index = 0;
    }
    this.last_find_index = this.index;
};

SongPlayer.prototype.remove_line = function(line_index) {
    this.commit_last_key();
    if (line_index < 0 || line_index >= this.lines.length) return;
    this.lines.splice(line_index, 1);
    if (this.lines.length == 0) {
        this.lines.push(this.new_line());
    }
    if (this.index >= this.lines.length) {
        this.index = 0;
    }
};

SongPlayer.prototype.remove_current_line = function() {
    this.update_index();
    this.remove_line(this.index);
};

SongPlayer.prototype.find_line_index = function(p, start_from) {
    var i;
    for (i = start_from; i < this.lines.length; i++) {
        if (this.lines[i].start > p) {
            return i == 0 ? 0 : i - 1;
        }
    }
    for (i = 0; i < start_from; i++) {
        if (this.lines[i].start > p) {
            return i == 0 ? 0 : i - 1;
        }
    }
    return this.lines.length - 1;
};

SongPlayer.prototype.keypress = function(e) {
    if(e.key == 'Enter'){
        this.handle_enter();
    } else if(e.key == ' '){
        this.append_normal_key(e.key);
    } else if(e.key == '['){
        this.start_line();
    } else if(e.key == ']'){
        this.end_line();
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
    return false;
};

SongPlayer.prototype.keydown = function(e) {
    if(e.key == 'Backspace') {
        this.backspace();
    } else if (e.key == 'ArrowUp') {
        this.prev_line();
    } else if (e.key == 'ArrowDown') {
        this.next_line();
    } else if (e.key == 'Delete') {
        this.remove_current_line();
    }
};

SongPlayer.prototype.time_update = function() {
    var p = this.mp3_player.currentTime;
    if (this.loop) {
        if (this.current_line().end < p) {
            this.mp3_player.currentTime = p = this.current_line().start;
        }
    }
    this.update_index(p);
    this.time_position[0].style.left = p / this.mp3_player.duration * this.ol_segments[0].clientWidth;
};

SongPlayer.prototype.play = function(songInfo, lyric) {
    lyric |= [this.new_line()];

    this.lines = lyric.lines;
    this.index = 0;
    this.loop = false;
    this.last_find_index = 0;

    this.last_key = null;
    this.last_key_appended = true;

    this.mp3_player.src = songInfo.url;
    this.mp3_player.play();
    this.update_lines_ui();
};

SongPlayer.prototype.stop = function() {
    this.mp3_player.stop();
};

SongPlayer.prototype.handle_input = function(key) {
    if(this.last_key != null){
        if(this.phonetic_map[this.last_key + key]){
            this.append_phonetic(this.last_key + key, true);
        }else{
            this.commit_last_key();
            if(this.phonetic_map[key]){
                this.append_phonetic(key, false);
            }else{
                this.last_key = key;
                this.last_key_appended = false;
            }
        }
    } else if(this.phonetic_map[key]){
        this.append_phonetic(key, false);
    } else{
        this.last_key = key;
        this.last_key_appended = false;
    }
};

SongPlayer.prototype.handle_enter = function() {
    if (this.index == this.lines.length - 1) {
        this.start_line();
    } else {
        this.next_line();
    }
};

SongPlayer.prototype.commit_last_key = function(){
    if(!this.last_key_appended){
        console.warn("last typed key is invalid: %s", this.last_key);
    }
    this.last_key = null;
    this.last_key_appended = true;
};

SongPlayer.prototype.append_normal_key = function(key){
    this.commit_last_key();
    this.current_line().push(key);
};

SongPlayer.prototype.append_phonetic = function(phonetic_key, is_replace){
    if (is_replace) {
        this.current_line().pop();
    }
    this.current_line().push(this.phonetic_map[phonetic_key][this.model.phonetic_lang()]);
    this.last_key_appended = true;
    if(is_replace){
        this.last_key = null;
    } else {
        this.last_key = phonetic_key;
    }
    // this.play_single_phonetic(phonetic_key);
};

SongPlayer.prototype.backspace = function(){
    if(this.last_key_appended){
        this.current_line().pop();
    } else {
        this.last_key = null;
        this.last_key_appended = true;
    }
};

SongPlayer.prototype.current_time_backward = function(){
    this.mp3_player.currentTime -= 5;
};

SongPlayer.prototype.current_time_forward = function(){
    this.mp3_player.currentTime += 5;
};

SongPlayer.prototype.update_lines_ui = function(){
    console.info(this.lines);
    var len = this.mp3_player.duration;
    len = len ? len : 1;
    var ui_len = this.ol_segments[0].clientWidth;
    var unit = ui_len / len;
    var left = 0;
    this.ol_segments[0].innerHTML = this.lines.map(function(line, i){
        var end = line.end;
        if (!end) {
            if (i < this.lines.length - 1) {
                end = this.lines[i+1].start;
            } else {
                end = len;
            }
        }
        var width = (end - line.start) * unit - 2;
        if (width < 0) {
            return '';
        }
        var classClause = '';
        if (this.loop && this.index == i) {
            classClause = 'class="current"'
        }
        var elem = '<li ' + classClause + ' style="margin-left: ' + (line.start * unit - left) + 'px;width: ' + width + 'px"></li>';
        left = end * unit;
        return elem;
    }.bind(this)).join('');
};

// utility
Array.prototype.last = function() {
    return this[this.length - 1];
};