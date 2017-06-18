package nick.myphonetic.controllers;

import nick.myphonetic.models.Lyric;
import nick.myphonetic.models.SongInfo;
import nick.myphonetic.persistance.DataStorage;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
public class LyricController {
    @Resource
    DataStorage dataStorage;

    @GetMapping("/song/{name}/lyric/{id}")
    public Lyric getLyric(@PathVariable("name") String songName, @PathVariable("id") int id) throws IOException {
        return dataStorage.loadSongInfo(songName).getLyrics()
                .stream()
                .filter(l->l.getId() == id)
                .findFirst().get();
    }

    @PutMapping("/song/{name}/lyric")
    public Lyric addLyric(@PathVariable("name") String songName, @RequestBody Lyric lyric) throws IOException {
        lyric.setCreateDate(new Date());
        SongInfo songInfo = dataStorage.loadSongInfo(songName);
        int id = songInfo.getLyrics().stream().reduce(0, (a,x)->Integer.max(a, x.getId()), (x,y)->y) + 1;
        lyric.setId(id);
        songInfo.getLyrics().add(lyric);
        dataStorage.saveSongInfo(songInfo);
        return lyric;
    }

    @DeleteMapping("/song/{name}/lyric/{id}")
    public void deleteLyric(@PathVariable("name") String songName, @PathVariable("id") int id) throws IOException {
        SongInfo songInfo = dataStorage.loadSongInfo(songName);
        songInfo.getLyrics().removeIf(l->l.getId() == id);
        dataStorage.saveSongInfo(songInfo);
    }

    @PostMapping("/song/{name}/lyric/{id}")
    public Lyric updateLyric(@PathVariable("name") String songName, @PathVariable("id") int id, @RequestBody Lyric lyric) throws IOException {
        lyric.setCreateDate(new Date());
        SongInfo songInfo = dataStorage.loadSongInfo(songName);
        List<Lyric> ls = songInfo.getLyrics();
        for (int i = 0; i < ls.size(); i++) {
            if (ls.get(i).getId() == id) {
                lyric.setId(id);
                ls.set(i, lyric);
            }
        }
        dataStorage.saveSongInfo(songInfo);
        return lyric;
    }
}
