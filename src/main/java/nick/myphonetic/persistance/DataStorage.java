package nick.myphonetic.persistance;

import nick.myphonetic.models.SongInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class DataStorage {
    @Value("${mp3.root.path}")
    private String mp3RootPath;

    @Value("${data.root.path}")
    private String dataRootPath;

    public List<String> getSongNames() {
        Stream<String> songsInStorageFolder = Arrays.stream(new File(dataRootPath).listFiles())
                .map(File::getName)
                .filter(DataStorage::checkIfValidDataFile)
                .map(DataStorage::toSongName);

        Stream<String> songsInMp3Folder = Arrays.stream(new File(mp3RootPath).listFiles())
                .map(File::getName)
                .filter(s->s.endsWith(".mp3"))
                .map(s->s.replaceFirst("\\.mp3$", ""));

        return Stream.concat(songsInMp3Folder, songsInStorageFolder).distinct().collect(Collectors.toList());
    }

    public SongInfo loadSongInfo(String songName) throws IOException {
        File dataFile = getDataFilePathForSong(songName);
        if (dataFile.exists()) {
            try (InputStream fs = new FileInputStream(dataFile)) {
                try (XMLDecoder decoder = new XMLDecoder(fs)) {
                    SongInfo songInfo = (SongInfo) decoder.readObject();
                    songInfo.setName(songName);
                    return songInfo;
                }
            }
        } else {
            SongInfo song = new SongInfo();
            song.setName(songName);
            song.setMp3url("/mp3/" + songName);
            return song;
        }
    }

    public void saveSongInfo(SongInfo songInfo) throws IOException {
        try (OutputStream fs = new FileOutputStream(getDataFilePathForSong(songInfo.getName()))) {
            try (XMLEncoder encoder = new XMLEncoder(fs)) {
                encoder.writeObject(songInfo);
            }
        }
    }

    public void deleteSong(String songName, boolean deleteMp3) {
        File dataFile = getDataFilePathForSong(songName);
        dataFile.delete();
        if (deleteMp3) {
            File mp3File = getMp3FilePathForSong(songName);
            if (mp3File.exists()) {
                mp3File.delete();
            }
        }
    }

    public File getDataFilePathForSong(String songName) {
        return new File(dataRootPath, toDataFileName(songName));
    }

    public File getMp3FilePathForSong(String songName) {
        return new File(mp3RootPath, toMp3FileName(songName));
    }

    private  static boolean checkIfValidDataFile(String fileName) {
        return fileName.endsWith(".xml");
    }

    private static String toSongName(String fileName) {
        return fileName.replaceFirst("\\.xml$", "");
    }

    private static String toDataFileName(String songName) {
        return songName + ".xml";
    }

    private static String toMp3FileName(String songName) {
        return songName + ".mp3";
    }
}
