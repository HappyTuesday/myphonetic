package nick.myphonetic.controllers;

import nick.myphonetic.models.Lyric;
import nick.myphonetic.models.SongInfo;
import nick.myphonetic.persistance.DataStorage;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.Date;

@RestController
public class LyricController {
    @Resource
    DataStorage dataStorage;

    @GetMapping("/song/{name}/lyric/{index}")
    public Lyric getLyric(@PathVariable("name") String songName, @PathVariable("index") int lyricIndex) throws IOException {
        return dataStorage.loadSongInfo(songName).getLyrics().get(lyricIndex);
    }

    @PutMapping("/song/{name}/lyric")
    public void addLyric(@PathVariable("name") String songName, Lyric lyric) throws IOException {
        lyric.setCreateDate(new Date());
        SongInfo songInfo = dataStorage.loadSongInfo(songName);
        songInfo.getLyrics().add(lyric);
        dataStorage.saveSongInfo(songInfo);
    }

    @DeleteMapping("/song/{name}/lyric/{index}")
    public void deleteLyric(@PathVariable("name") String songName, @PathVariable("index") int lyricIndex) throws IOException {
        SongInfo songInfo = dataStorage.loadSongInfo(songName);
        songInfo.getLyrics().remove(lyricIndex);
        dataStorage.saveSongInfo(songInfo);
    }

    @PostMapping("/song/{name}/lyric/{index}")
    public void updateLyric(@PathVariable("name") String songName, @PathVariable("index") int lyricIndex, Lyric lyric) throws IOException {
        lyric.setCreateDate(new Date());
        SongInfo songInfo = dataStorage.loadSongInfo(songName);
        songInfo.getLyrics().set(lyricIndex, lyric);
        dataStorage.saveSongInfo(songInfo);
    }
}
