package nick.myphonetic;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;
import java.util.stream.*;

@RestController
public class SongController {

    @Value("${songs.path}")
    private String songsPath;

    @RequestMapping("/songs")
    public List<String> listSongs() {
        return  Arrays.asList(new File(songsPath).listFiles())
            .stream()
            .map(f->f.getName())
            .filter(f->f.endsWith(".mp3"))
            .collect(Collectors.toCollection(ArrayList::new));
    }

    @RequestMapping("/song/{name}.mp3")
    public void getSong(@PathVariable("name") String name, @RequestHeader(value="range", defaultValue="bytes=0-") String requestRange, HttpServletResponse response)
            throws IOException {

        File file = new File(songsPath + "/" + name + ".mp3");
        if (!file.exists()) {
            response.setStatus(404);
            return;
        }

        long length = file.length();
        List<HttpRange> ranges = HttpRange.parseRanges(requestRange);
        HttpRange range = ranges.size() == 0 ? HttpRange.createByteRange(0) : ranges.get(0);
        long start = range.getRangeStart(length), end = range.getRangeEnd(length);

        response.setContentType("audio/mpeg");
        response.setContentLength((int)(end - start + 1));
        response.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + length);
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Accept-Ranges", "bytes");

        if (start != 0 || end != length - 1) {
            response.setStatus(206);
        }

        try(InputStream in = new FileInputStream(file)) {
            try(OutputStream out = response.getOutputStream()) {
                StreamUtils.copyRange(in, out, start, end);
            }
        }
    }
}