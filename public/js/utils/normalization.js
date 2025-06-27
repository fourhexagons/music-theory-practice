/**
 * Music Theory Practice - Normalization Utilities
 * 
 * Contains functions for normalizing chord symbols, accidentals, and other music notation.
 * These functions handle various input formats and convert them to standardized Unicode notation.
 */

// Stage 1: Root note normalization
const ROOT_PATTERNS = new Map([
  ['b', '♭'],
  ['#', '♯']
]);

// Stage 2: Quality normalization - ordered from most specific to least specific
const QUALITY_TRANSFORMATIONS = [
  // Case-sensitive single-character codes first to avoid ambiguity.
  { match: /^M7$/, output: 'maj7' },
  { match: /^m7$/, output: 'm7' },
  { match: /^M$/, output: '' },
  { match: /^m$/, output: 'm' },

  // Case-insensitive text-based chords and other symbols.
  { match: /^(MAJ7|Maj7|MAJOR7|Δ7?|∆7?)$/i, output: 'maj7' },
  { match: /^(m7b5|m7♭5|ø7?|halfdim|half-?dim)$/i, output: 'm7♭5' },
  { match: /^(min7b5|min7♭5|minor7b5|minor7♭5)$/i, output: 'm7♭5' },
  { match: /^(dom|dominant)7?$/i, output: '7' },
  { match: /^(min7|minor7|-7)$/i, output: 'm7' },
  { match: /^(dim|dimin|diminished|o|°|˚)$/i, output: '˚' },
  { match: /^(min|minor|-)$/i, output: 'm' },
  { match: /^7$/i, output: '7'},
  { match: /^(maj|major)$/i, output: '' }
];

/**
 * Normalizes a root note to standard format
 * @param {string} root - The root note to normalize
 * @returns {string} - The normalized root note
 */
function normalizeRootNote(root) {
  if (!root) return '';
  const note = root[0].toUpperCase();
  let accidentals = root.substring(1);
  
  // Explicitly handle triple flats, then doubles
  if (accidentals.toLowerCase() === 'bbb') return note + '𝄫♭';
  
  // Order is critical: process double accidentals before single ones.
  const normalizedAccidentals = accidentals
    .replace(/bb/ig, '𝄫')
    .replace(/##|x/ig, '𝄪')
    .replace(/b/ig, '♭')
    .replace(/#/g, '♯');

  return note + normalizedAccidentals;
}

/**
 * Normalizes a chord quality to standard format
 * @param {string} quality - The chord quality to normalize
 * @returns {string} - The normalized chord quality
 */
function normalizeQuality(quality) {
  if (!quality) return '';
  
  // Try each transformation pattern in order
  for (const transform of QUALITY_TRANSFORMATIONS) {
    if (transform.match.test(quality)) {
      return transform.output;
    }
  }
  
  return quality;
}

/**
 * Normalizes a chord symbol to standard format
 * @param {string} chord - The chord symbol to normalize
 * @returns {string} - The normalized chord symbol
 */
function normalizeChord(chord) {
  if (typeof chord !== 'string') return '';
  if (!chord) return '';
  // Stage 1: Basic cleanup - remove outer and inner whitespace
  const cleanedChord = chord.trim().replace(/\s+/g, '');
  // Stage 2: Handle single note case
  if (/^[a-g](?:bb|b|##|#|x)?$/i.test(cleanedChord)) {
    return normalizeRootNote(cleanedChord);
  }
  // Stage 3: Split into root and quality (case-insensitive)
  const rootMatch = cleanedChord.match(/^([a-g](?:bb|b|##|#|x)*)(.*)/i);
  if (!rootMatch) return cleanedChord;
  const [, root, quality] = rootMatch;
  // Stage 4: Normalize root note
  const normalizedRoot = normalizeRootNote(root);
  // Stage 5: Handle empty quality
  if (!quality) return normalizedRoot;
  // Stage 6: Transform quality
  let normalizedQuality = normalizeQuality(quality);
  // Stage 7: Replace all b5, b9, #5, #9, etc. with Unicode accidentals
  normalizedQuality = normalizedQuality
    .replace(/b(5|9|13)/g, '♭$1')
    .replace(/#(5|9|13)/g, '♯$1');
  // Stage 8: Combine and handle special cases
  return normalizedRoot + normalizedQuality;
}

// Make the primary function available globally
window.normalizeChord = normalizeChord;
window.normalizeRootNote = normalizeRootNote;
window.normalizeQuality = normalizeQuality; 