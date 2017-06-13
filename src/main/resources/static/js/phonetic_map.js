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
}