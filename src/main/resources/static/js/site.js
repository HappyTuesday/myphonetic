var phonetic_map = {
    // 前元音
    'i:': { dj: 'i:', kk: 'i',  mp3: 'phonetics/i-.mp3' },
    'I' : { dj: 'ɪ' , kk: 'ɪ',  mp3: 'phonetics/I_.mp3' },
    'e' : { dj: 'e',  kk: 'ɛ',  mp3: 'phonetics/e.mp3'  },
    'ae': { dj: 'æ',  kk: 'æ',  mp3: 'phonetics/ae.mp3' },
    // 中元音
    'a' : { dj: 'ʌ',  kk: 'ʌ',  mp3: 'phonetics/a.mp3'  },
    'E:': { dj: 'ɜ:', kk: 'ɜ',  mp3: 'phonetics/E_-.mp3'},
    'E' : { dj: 'ə',  kk: 'ə',  mp3: 'phonetics/E_.mp3' },
    // 后元音
    'u:': { dj: 'u:', kk: 'u',  mp3: 'phonetics/u-.mp3' },
    'u' : { dj: 'ʊ',  kk: 'ʊ',  mp3: 'phonetics/u.mp3'  },
    'o:': { dj: 'ɔ:', kk: 'ɔ',  mp3: 'phonetics/o-.mp3' },
    'o' : { dj: 'ɒ',  kk: 'ɑ',  mp3: 'phonetics/o.mp3'  },
    'a:': { dj: 'ɑ:', kk: 'ɑ',  mp3: 'phonetics/a-.mp3' },
    // 开合双元音
    'ei': { dj: 'eɪ', kk: 'e',  mp3: 'phonetics/ei.mp3' },
    'ai': { dj: 'aɪ', kk: 'aɪ', mp3: 'phonetics/ai.mp3'},
    'oi': { dj: 'ɔɪ', kk: 'ɔɪ', mp3: 'phonetics/oi.mp3'},
    'au': { dj: 'aʊ', kk: 'aʊ', mp3: 'phonetics/au.mp3'},
    'O' : { dj: 'əʊ', kk: 'o',  mp3: 'phonetics/O_.mp3'},
    // 集中双元音
    'ir': { dj: 'ɪə', kk: 'ɪr', mp3: 'phonetics/ir.mp3'},
    'er': { dj: 'eə', kk: 'ɛr', mp3: 'phonetics/er.mp3'},
    'ur': { dj: 'ʊə', kk: 'ʊr', mp3: 'phonetics/ur.mp3'},
    // 爆破音
    'p' : { dj: 'p' , kk: 'p' , mp3: 'phonetics/p.mp3' },
    'b' : { dj: 'b' , kk: 'b' , mp3: 'phonetics/p.mp3' },
    't' : { dj: 't' , kk: 't' , mp3: 'phonetics/t.mp3' },
    'd' : { dj: 'd' , kk: 'd' , mp3: 'phonetics/d.mp3' },
    'k' : { dj: 'k' , kk: 'k' , mp3: 'phonetics/k.mp3' },
    'g' : { dj: 'ɡ' , kk: 'ɡ' , mp3: 'phonetics/g.mp3' },
    // 摩擦音
    'f' : { dj: 'f' , kk: 'f' , mp3: 'phonetics/f.mp3' },
    'v' : { dj: 'v' , kk: 'v' , mp3: 'phonetics/v.mp3' },
    's' : { dj: 's' , kk: 's' , mp3: 'phonetics/s.mp3' },
    'z' : { dj: 'z' , kk: 'z' , mp3: 'phonetics/z.mp3' },
    'ss': { dj: 'ʃ' , kk: 'ʃ' , mp3: 'phonetics/ss.mp3'},
    'zz': { dj: 'ʒ' , kk: 'ʒ' , mp3: 'phonetics/zz.mp3'},
    'S' : { dj: 'θ' , kk: 'θ' , mp3: 'phonetics/S_.mp3'},
    'Z' : { dj: 'ð' , kk: 'ð' , mp3: 'phonetics/Z_.mp3'},
    'h' : { dj: 'h' , kk: 'h' , mp3: 'phonetics/h.mp3' },
    // 破擦音
    'q' : { dj: 'tʃ', kk: 'tʃ', mp3: 'phonetics/q.mp3' },
    'j' : { dj: 'dʒ', kk: 'dʒ', mp3: 'phonetics/j.mp3' },
    'tr': { dj: 'tr', kk: 'tr', mp3: 'phonetics/tr.mp3'},
    'dr': { dj: 'dr', kk: 'dr', mp3: 'phonetics/dr.mp3'},
    'ts': { dj: 'ts', kk: 'ts', mp3: 'phonetics/ts.mp3'},
    'dz': { dj: 'dz', kk: 'dz', mp3: 'phonetics/dz.mp3'},
    // 鼻音
    'm' : { dj: 'm' , kk: 'm' , mp3: 'phonetics/m.mp3' },
    'n' : { dj: 'n' , kk: 'n' , mp3: 'phonetics/n.mp3' },
    'ng': { dj: 'ŋ' , kk: 'ŋ' , mp3: 'phonetics/ng.mp3'},
    'l' : { dj: 'l' , kk: 'l' , mp3: 'phonetics/l.mp3' },
    'r' : { dj: 'r' , kk: 'r' , mp3: 'phonetics/r.mp3' },
    'w' : { dj: 'w' , kk: 'w' , mp3: 'phonetics/w.mp3' },
    'y' : { dj: 'j' , kk: 'j' , mp3: 'phonetics/y.mp3' },
};

function ui_update_songs_list(songs) {
    var elem = $('#songs_select');
    $('li', elem).remove();
    elem.append(songs.map(function(song){return '<option key="' + song + '">' + song + '</option>'}).join('\n'));
}

function new_phonetic_context() {
    return {
        last_key: null,
        last_key_appended: true,
        lines_before: [],
        lines_after: [],
        current_line: [],
        phonetic_lang: 'dj',
        segments: [{begin: 0, stop: null}],
        loop_seg: null,
        last_seg_index: 0
    };
}

var phonetic_context = new_phonetic_context();

function get_line_ui_code(line) {
    return '<li>' + line.join('') + '</li>';
}

function update_ui_with_current_line(){
    $('#input').val(phonetic_context.current_line.join(''));
}

function ui_append_line_to_lines_before(line) {
    $('#lines_before').append(get_line_ui_code(line));
}

function ui_remove_line_from_lines_before() {
    $('#lines_before>li:last').remove();
}

function ui_insert_line_to_lines_after(line) {
    $('#lines_after').prepend(get_line_ui_code(line));
}

function ui_remove_line_from_lines_after() {
    $('#lines_after>li:first').remove();
}

function play_single_phonetic(phonetic_key){
    mp3_player.src = phonetic_map[phonetic_key].mp3;
    mp3_player.play();
}

function commit_last_key(){
    if(!phonetic_context.last_key_appended){
        console.warn("last typed key is invalid: %s", phonetic_context.last_key);
    }
    phonetic_context.last_key = null;
    phonetic_context.last_key_appended = true;
    update_ui_with_current_line();
}

function append_normal_key(key){
    commit_last_key();
    phonetic_context.current_line.push(key);
    update_ui_with_current_line();
}

function append_phonetic(phonetic_key, is_replace){
    var index = phonetic_context.current_line.length - (is_replace && phonetic_context.last_key_appended ? 1 : 0);
    phonetic_context.current_line[index] = phonetic_map[phonetic_key][phonetic_context.phonetic_lang];
    phonetic_context.last_key_appended = true;
    if(is_replace){
        phonetic_context.last_key = null;
    }else{
        phonetic_context.last_key = phonetic_key;
    }
    update_ui_with_current_line();
    // play_single_phonetic(phonetic_key);
}

function backspace(){
    if(phonetic_context.last_key_appended){
        if (phonetic_context.current_line.length > 0) {
            phonetic_context.current_line.pop();
            update_ui_with_current_line();
        }
    }else{
        phonetic_context.last_key = null;
        phonetic_context.last_key_appended = true;
    }
}

function remove_current_line() {
    commit_last_key();

    if (phonetic_context.lines_after.length > 0) {
        phonetic_context.current_line = phonetic_context.lines_after.shift();
        ui_remove_line_from_lines_after();
    }

    update_ui_with_current_line();
}

function move_to_previous_line() {
    if (phonetic_context.lines_before.length == 0) return;

    commit_last_key();

    phonetic_context.lines_after.unshift(phonetic_context.current_line);
    ui_insert_line_to_lines_after(phonetic_context.current_line);
    
    phonetic_context.current_line = phonetic_context.lines_before.pop();
    ui_remove_line_from_lines_before();

    update_ui_with_current_line();
}

function move_to_next_line(append_new_line) {
    commit_last_key();

    if (append_new_line || phonetic_context.lines_after.length > 0) {
        phonetic_context.lines_before.push(phonetic_context.current_line);
        ui_append_line_to_lines_before(phonetic_context.current_line);

        if (append_new_line) {
            phonetic_context.current_line = [];
        } else {
            phonetic_context.current_line = phonetic_context.lines_after.shift();
            ui_remove_line_from_lines_after();
        }
    }

    update_ui_with_current_line();
}

function move_to_line_number(line_number) {
    for (var i = phonetic_context.lines_before.length; i < line_number; i++) {
        move_to_next_line();
    }
    for (var i = line_number; i < phonetic_context.lines_before.length; i++) {
        move_to_previous_line();
    }
}

$('#input').keypress(function(e){
    if(e.key == 'Enter'){
        move_to_next_line(true);
    } else if(e.key == ' '){
        append_normal_key(e.key);
    } else if(e.key == '['){
        begin_segment();
    } else if(e.key == ']'){
        stop_segment();
    } else if(e.key == '{'){
        prev_loop();
    } else if(e.key == '}'){
        next_loop();
    } else if(e.key == '='){
        switch_play_status();
    } else if (e.key == '-') {
        switch_loop();
    } else if (e.key == '<') {
        current_time_backward();
    } else if (e.key == '>') {
        current_time_forward();
    } else if (e.key == '\\') {
        merge_segment();
    } else if(phonetic_context.last_key != null){
        if(phonetic_map[phonetic_context.last_key + e.key]){
            append_phonetic(phonetic_context.last_key + e.key, true);
        }else{
            commit_last_key();
            if(phonetic_map[e.key]){
                append_phonetic(e.key, false);
            }else{
                phonetic_context.last_key = e.key;
                phonetic_context.last_key_appended = false;
            }
        }
    } else if(phonetic_map[e.key]){
        append_phonetic(e.key, false);
    } else{
        phonetic_context.last_key = e.key;
        phonetic_context.last_key_appended = false;
    }
    return false;
}).keydown(function(e){
    if(e.key == 'Backspace') {
        backspace();
    } else if (e.key == 'ArrowUp') {
        move_to_previous_line();
    } else if (e.key == 'ArrowDown') {
        move_to_next_line(false);
    } else if (e.key == 'Delete') {
        remove_current_line();
    }
});

$(function(){
    $.get('/songs', function(songs) {
        ui_update_songs_list(songs);
    })
})

$('#songs_select').change(function(e){
    var song = e.target.value;
    phonetic_context = new_phonetic_context();
    start_song(song);
})

function start_song(song){
    $('#title').val(song)
    mp3_player.src = "/song/" + song;
    mp3_player.play();
    update_segment_ui();
}

function begin_segment(){
    var p = mp3_player.currentTime - 1;
    var seg_index = find_segment_index(p, phonetic_context.last_seg_index);
    var seg = phonetic_context.segments[seg_index];
    if (seg.stop && seg.stop <= p) {
        phonetic_context.segments.splice(seg_index + 1, 0, {begin: p});
    } else {
        seg.begin = p;
    }
    update_segment_ui();
}

function stop_segment(){
    var p = mp3_player.currentTime;
    var seg_index = find_segment_index(p, phonetic_context.last_seg_index);
    var seg = phonetic_context.segments[seg_index];
    if (seg.stop && seg.stop <= p) {
        seg.stop = p;
    } else {
        phonetic_context.segments.splice(seg_index + 1, 0, {begin: p, stop: seg.stop});
        seg.stop = p;
    }
    loop_seg(seg);
    update_segment_ui();
}

function switch_play_status(){
    if (mp3_player.paused) {
        mp3_player.play();
    } else {
        mp3_player.pause();
    }
}

function switch_loop(){
    if (phonetic_context.loop_seg){
        phonetic_context.loop_seg = null;
        console.info("clear loop");
    } else {
        console.info('set loop');
        loop_seg(find_segment(mp3_player.currentTime, phonetic_context.last_seg_index));
    }
    update_segment_ui();
}


function prev_loop(){
    var p = mp3_player.currentTime;
    var seg_index = find_segment_index(p, phonetic_context.last_seg_index);
    var seg = phonetic_context.segments[seg_index];
    if (seg_index > 0) {
        seg_index -= 1;
        phonetic_context.last_seg_index = seg_index;
    }
    loop_seg(phonetic_context.segments[seg_index]);
    update_segment_ui();
}

function next_loop(){
    var p = mp3_player.currentTime;
    var seg_index = find_segment_index(p, phonetic_context.last_seg_index);
    var seg = phonetic_context.segments[seg_index];
    if (seg_index < phonetic_context.segments.length - 1) {
        seg_index += 1;
        phonetic_context.last_seg_index = seg_index;
    }
    loop_seg(phonetic_context.segments[seg_index]);
    update_segment_ui();
}

function current_time_backward(){
    mp3_player.currentTime -= 5;
}

function current_time_forward(){
    mp3_player.currentTime += 5;
}

function merge_segment(){
    var p = mp3_player.currentTime;
    var seg_index = find_segment_index(p, phonetic_context.last_seg_index);
    var seg = phonetic_context.segments[seg_index];
    if (seg_index == phonetic_context.segments.length - 1) {
        return;
    }
    seg.stop = phonetic_context.segments[seg_index+1].stop;
    phonetic_context.segments.splice(seg_index+1, 1);
    update_segment_ui();
}

function loop_seg(seg) {
    phonetic_context.loop_seg = seg;
    mp3_player.currentTime = seg.begin;
    console.info("loop at: %s-%s", seg.begin, seg.stop);
}

function update_segment_ui(){
    console.debug(phonetic_context.segments);
    var len = mp3_player.duration;
    len = len ? len : 1;
    var ui_len = ol_segments.clientWidth;
    var unit = ui_len / len;
    var left = 0;
    ol_segments.innerHTML = phonetic_context.segments.map(function(seg, i){
        var stop = seg.stop;
        if (!stop) {
            if (i < phonetic_context.segments.length - 1) {
                stop = phonetic_context.segments[i+1].begin;
            } else {
                stop = len;
            }
        }
        var width = (stop - seg.begin) * unit - 2;
        if (width < 0) {
            return '';
        }
        var classClause = '';
        if (phonetic_context.loop_seg == seg) {
            classClause = 'class="current"'
        }
        var elem = '<li ' + classClause + ' style="margin-left: ' + (seg.begin * unit - left) + 'px;width: ' + width + 'px"></li>';
        left = stop * unit;
        return elem;
    }).join('');
}

$(mp3_player).bind('timeupdate', function(e){
    if (phonetic_context.loop_seg) {
        if (phonetic_context.loop_seg.stop && mp3_player.currentTime >= phonetic_context.loop_seg.stop) {
            mp3_player.currentTime = phonetic_context.loop_seg.begin;
        }
    }

    time_position.style.left = mp3_player.currentTime / mp3_player.duration * ol_segments.clientWidth;
    
    phonetic_context.last_seg_index = find_segment_index(mp3_player.currentTime, phonetic_context.last_seg_index);
    move_to_line_number(phonetic_context.last_seg_index);
})

function find_segment(p, disp) {
    return phonetic_context.segments[find_segment_index(p, disp)]
}

function find_segment_index(p, disp) {
    for (var i = disp; i < phonetic_context.segments.length; i++) {
        if (phonetic_context.segments[i].begin > p) {
            return i == 0 ? 0 : i - 1;
        }
    }
    for (var i = 0; i < disp; i++) {
        if (phonetic_context.segments[i].begin > p) {
            return i == 0 ? 0 : i - 1;
        }
    }
    return phonetic_context.segments.length - 1
}

// utility
Array.prototype.last = function() {
    return this[this.length - 1];
}