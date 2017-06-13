package nick.myphonetic.models;

import java.util.ArrayList;
import java.util.List;

public class SongInfo {
    private String name;
    private String mp3url;
    private List<Lyric> lyrics = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMp3url() {
        return mp3url;
    }

    public void setMp3url(String mp3url) {
        this.mp3url = mp3url;
    }

    public List<Lyric> getLyrics() {
        return lyrics;
    }

    public void setLyrics(List<Lyric> lyrics) {
        this.lyrics = lyrics;
    }
}
