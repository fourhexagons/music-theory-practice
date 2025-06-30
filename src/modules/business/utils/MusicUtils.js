/**
 * Music Theory Utilities
 * Extracted from main.js utility functions
 */
export class MusicUtils {
  static ordinal(n) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  static wordToNumber(word) {
    const numberWords = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20
    };
    return numberWords[word.toLowerCase()] !== undefined ? numberWords[word.toLowerCase()] : null;
  }

  static accidentalToUnicode(s) {
    s = s.trim();
    if (/^([A-Ga-g])bb$/.test(s)) return s[0].toUpperCase() + '\uD834\uDD2B';
    if (/^([A-Ga-g])(##|x)$/.test(s)) return s[0].toUpperCase() + '\uD834\uDD2A';
    if (/^([A-Ga-g])b$/.test(s)) return s[0].toUpperCase() + '♭';
    if (/^([A-Ga-g])#$/.test(s)) return s[0].toUpperCase() + '♯';
    return s.toUpperCase().normalize('NFC');
  }

  static normalizeAccList(strOrArr) {
    const list = Array.isArray(strOrArr) ? strOrArr : String(strOrArr).replace(/,/g, ' ').split(/\s+/);
    return list.map(s => MusicUtils.accidentalToUnicode(s)).filter(Boolean).sort().join(' ').trim();
  }
}

// Make utilities available globally for backward compatibility
window.ordinal = MusicUtils.ordinal;
window.wordToNumber = MusicUtils.wordToNumber;
window.accidentalToUnicode = MusicUtils.accidentalToUnicode;
window.normalizeAccList = MusicUtils.normalizeAccList; 