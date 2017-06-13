package nick.myphonetic.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Lyric {

    private List<Line> lines = new ArrayList<>();
    private Date createDate;

    public List<Line> getLines() {
        return lines;
    }

    public void setLines(List<Line> lines) {
        this.lines = lines;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public static class Line {
        private List<String> phonetics = new ArrayList<>();
        private int start;
        private int end;

        public List<String> getPhonetics() {
            return phonetics;
        }

        public void setPhonetics(List<String> phonetics) {
            this.phonetics = phonetics;
        }

        public int getStart() {
            return start;
        }

        public void setStart(int start) {
            this.start = start;
        }

        public int getEnd() {
            return end;
        }

        public void setEnd(int end) {
            this.end = end;
        }
    }
}
