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
        return (this.end() - this.start()) * this.player.unit();
    }, this);
}

LyricLine.prototype.push = function(phonetic) {
    return this.phonetics.push(phonetic);
};

LyricLine.prototype.pop = function() {
    return this.phonetics.pop();
};

function SongPlayer(phonetic_map, my_phonetic) {
    this.phonetic_map = phonetic_map;
    this.my_phonetic = my_phonetic;
    this.lyric = ko.observable(null);

    this.mp3_player = $("#mp3_player")[0];
    this.progress_bar = $("#progress_bar")[0];
    this.lyric_editor = $("#lyric_editor")[0];

    this.duration = ko.observable(SongPlayer.FAKE_DURATION);

    this.lines = ko.observableArray([this.create_new_line({})]);

    this.index = ko.observable(0);
    this.loop = ko.observable(false);
    this.playing = ko.observable(false);
    this.last_find_index = 0;
    this.position = ko.observable(0);
    this.position_time = ko.observable(this.seconds_to_time(0));
    this.progress_pointer_left = ko.observable(0);
    this.phonetic_lang = ko.observable('dj');
    this.last_key = ko.observable(null);
    this.last_key_appended = ko.observable(true);

    this.listen_audio_event();
    this.listen_lyric_editor_event();
    this.listen_button_event();
    this.listen_progress_bar_event();
}

SongPlayer.prototype.play = function(lyric) {
    if (this.lyric())
        this.save_draft();

    this.lyric(lyric);

    this.mp3_player.src = lyric.song.mp3url;
    this.mp3_player.play();

    this.position_time(this.seconds_to_time(0));
    this.duration(SongPlayer.FAKE_DURATION);
    this.last_find_index = 0;

    if (!this.load_draft()) {
        this.position(0);

        this.set_lines(lyric.lines);
        this.index(0);
        this.loop(false);

        this.last_key(null);
        this.last_key_appended(true);
    }
};

SongPlayer.prototype.stop = function() {
    this.mp3_player.src = "";
    this.lyric(null);
};

SongPlayer.prototype.set_lines = function(origin_lines) {
    this.lines.removeAll();
    (origin_lines || []).forEach(function(line) {
        this.lines.push(this.create_new_line(line));
    }, this);
    if (this.lines().length == 0) {
        this.lines.push(this.create_new_line({}));
    }
};

SongPlayer.prototype.save_draft = function() {
    this.lyric().save_draft({
        position: this.position(),
        lines: this.lines_for_upload(),
        index: this.index(),
        loop: this.loop(),
        last_key: this.last_key(),
        last_key_appended: this.last_key_appended()
    });
};

SongPlayer.prototype.load_draft = function() {
    var draft = this.lyric().load_draft();
    if (!draft) return false;
    this.position(draft.position);
    this.set_lines(draft.lines);
    this.index(draft.index);
    this.loop(draft.loop);
    this.last_key(draft.last_key);
    this.last_key_appended(draft.last_key_appended);
    this.mp3_player.currentTime = this.position();
    return true;
};

SongPlayer.FAKE_DURATION = 24 * 3600;

SongPlayer.prototype.seconds_to_time = function(p) {
    var h = Math.floor(p / 3600).toString();
    p %= 3600;
    var m = Math.floor(p / 60).toString();
    p %= 60;
    var s = Math.round(p).toString();
    var r = "";
    if (h != "0") {
        r += h + ":";
    }
    r += (m.length == 1 ? "0" : "") + m + ":";
    r += (s.length == 1 ? "0" : "") + s;
    return r;
};

SongPlayer.prototype.client_width = function() {
    return this.progress_bar.clientWidth;
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

    this.position_time(this.seconds_to_time(p));
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

SongPlayer.prototype.listen_lyric_editor_event = function() {
    var self = this;
    $(this.lyric_editor).keypress(function(e){
        if(e.key == 'Enter'){
            self.split_line();
        } else if(e.key == ' '){
            self.append_normal_key(e.key);
        } else if(e.key == '['){
            self.start_line();
        } else if(e.key == ']'){
            self.end_line();
            self.loop(true);
        } else if(e.key == '{'){
            self.prev_line();
        } else if(e.key == '}'){
            self.next_line();
        } else if(e.key == '='){
            self.switch_play_status();
        } else if (e.key == '-') {
            self.switch_loop();
        } else if (e.key == '<') {
            self.current_time_backward();
        } else if (e.key == '>') {
            self.current_time_forward();
        } else if (e.key == '\\') {
            self.merge_line();
        } else {
            self.handle_input(e.key);
        }
    }).keydown(function(e){
        if(e.key == 'Backspace') {
            self.backspace();
        } else if (e.key == 'ArrowUp') {
            self.prev_line();
        } else if (e.key == 'ArrowDown') {
            self.next_line();
        } else if (e.key == 'Delete') {
            self.remove_current_line();
        }
    });
};

SongPlayer.prototype.listen_audio_event = function() {
    var self = this;
    $(this.mp3_player).bind('timeupdate', function(){
        var p = self.mp3_player.currentTime;
        if (self.loop()) {
            if (self.current_line().end() < p) {
                self.mp3_player.currentTime = self.current_line().start();
            }
        }
        self.update_position();
        self.update_index();
    }).bind('durationchange', function(){
        var new_duration = self.mp3_player.duration;
        if (!new_duration) return;
        self.lines().forEach(function(line){
            if (line.end() == SongPlayer.FAKE_DURATION || line.end() > new_duration) {
                line.end(new_duration);
            }
        }, self);
        self.duration(new_duration);
        console.info("duration for " + self.lyric().song.name + ":" + self.lyric().id + " changed to " + new_duration);
    }).bind('playing', function(){
        self.playing(true);
    }).bind('pause', function(){
        self.playing(false);
    });
};

SongPlayer.prototype.listen_button_event = function() {
    var self = this;
    $("#btn_toggle_pause").click(function(){
        self.switch_play_status();
    });
    $("#btn_toggle_loop").click(function(){
        self.switch_loop();
    });
    $("#btn_start_line").click(function(){
        self.start_line();
    });
    $("#btn_end_line").click(function(){
        self.end_line();
        self.loop(true);
    });
    $("#btn_split_line").click(function(){
        self.split_line();
    });
    $("#btn_merge_line").click(function(){
        self.merge_line();
    });
    $("#btn_delete_line").click(function(){
        self.remove_line();
    });
    $("#btn_prev_line").click(function(){
        self.prev_line();
    });
    $("#btn_next_line").click(function(){
        self.next_line();
    });
    $("#btn_prev_seconds").click(function(){
        self.current_time_backward();
    });
    $("#btn_next_seconds").click(function(){
        self.current_time_forward();
    });
    $("#btn_save_lyric_new").click(function() {
        self.lyric().save_as_new();
    });
    $("#btn_save_lyric").click(function(){
        self.lyric().save();
    });
    $("#btn_delete_lyric").click(function(){
        self.lyric().remove();
    });
};

SongPlayer.prototype.listen_progress_bar_event = function() {
    var self = this;
    $("#progress_bar").click(function(e){
        self.mp3_player.currentTime = (e.pageX - $(this).offset().left) / self.unit();
    });
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

SongPlayer.prototype.handle_line_click = function(line) {
    var lines = this.lines(), index = -1;
    for (var i = 0; i < lines.length; i++) {
        if (line == lines[i]) {
            index = i;
            break;
        }
    }
    if (index >= 0) {
        this.goto_line(index);
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

SongPlayer.prototype.lines_for_upload = function() {
    return this.lines().map(function(line) {
        return {
            start: line.start(),
            end: line.end(),
            phonetics: line.phonetics()
        }
    });
};