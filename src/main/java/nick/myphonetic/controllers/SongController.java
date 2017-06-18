package nick.myphonetic.controllers;

import nick.myphonetic.models.SongInfo;
import nick.myphonetic.persistance.DataStorage;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.List;

@RestController
public class SongController {

    @Resource
    DataStorage dataStorage;

    @GetMapping("/songs")
    public List<String> getSongNames() {
        return dataStorage.getSongNames();
    }

    @GetMapping("/song/{name}")
    public SongInfo getSongInfo(@PathVariable("name") String songName) throws IOException {
        return dataStorage.loadSongInfo(songName);
    }

    @DeleteMapping("/song/{name}")
    public void deleteSongInfo(@PathVariable("name") String songName, @RequestParam(value = "deleteMp3", defaultValue = "true") boolean deleteMp3) throws IOException {
        dataStorage.deleteSong(songName, deleteMp3);
    }
}