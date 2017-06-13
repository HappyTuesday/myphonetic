package nick.myphonetic.controllers;

import nick.myphonetic.persistance.DataStorage;
import org.springframework.http.HttpRange;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.List;

@Controller
public class Mp3Controller {

    @Resource
    private DataStorage dataStorage;

    @GetMapping("/mp3/{name}")
    public void getSong(@PathVariable("name") String name, @RequestHeader(value="range", defaultValue="bytes=0-") String requestRange, HttpServletResponse response)
            throws IOException {

        File file = dataStorage.getMp3FilePathForSong(name);
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

    @PostMapping("/mp3/{name}")
    public String uploadMp3(@PathVariable("name") String name, @RequestParam("mp3") MultipartFile mp3) throws IOException {
        File localMp3 = dataStorage.getMp3FilePathForSong(name);
        try (OutputStream out = new FileOutputStream(localMp3)) {
            try (InputStream in = mp3.getInputStream()) {
                StreamUtils.copy(in, out);
            }
        }
        return "redirect:/";
    }
}
