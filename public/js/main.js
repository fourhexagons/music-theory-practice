console.log('main.js loaded');
// Quiz Data
const quizData = {
  C: {
    accidentals:0, notes:[],
    scale:["C","D","E","F","G","A","B"],
    triads:{2:"Dm",3:"Em",4:"F",5:"G",6:"Am",7:"Bdim"},
    sevenths:{2:"Dm7",3:"Em7",4:"Fmaj7",5:"G7",6:"Am7",7:"Bm7♭5"},
    seventhSpelling:{2:["D","F","A","C"],3:["E","G","B","D"],4:["F","A","C","E"],5:["G","B","D","F"],6:["A","C","E","G"],7:["B","D","F","A"]}
  },
  G: {
    accidentals:1, notes:["F#"],
    scale:["G","A","B","C","D","E","F#"],
    triads:{2:"Am",3:"Bm",4:"C",5:"D",6:"Em",7:"F#dim"},
    sevenths:{2:"Am7",3:"Bm7",4:"Cmaj7",5:"D7",6:"Em7",7:"F#m7♭5"},
    seventhSpelling:{2:["A","C","E","G"],3:["B","D","F#","A"],4:["C","E","G","B"],5:["D","F#","A","C"],6:["E","G","B","D"],7:["F#","A","C","E"]}
  },
  D: {
    accidentals:2, notes:["F#","C#"],
    scale:["D","E","F#","G","A","B","C#"],
    triads:{2:"Em",3:"F#m",4:"G",5:"A",6:"Bm",7:"C#dim"},
    sevenths:{2:"Em7",3:"F#m7",4:"Gmaj7",5:"A7",6:"Bm7",7:"C#m7♭5"},
    seventhSpelling:{2:["E","G","B","D"],3:["F#","A","C#","E"],4:["G","B","D","F#"],5:["A","C#","E","G"],6:["B","D","F#","A"],7:["C#","E","G","B"]}
  },
  A: {
    accidentals:3, notes:["F#","C#","G#"],
    scale:["A","B","C#","D","E","F#","G#"],
    triads:{2:"Bm",3:"C#m",4:"D",5:"E",6:"F#m",7:"G#dim"},
    sevenths:{2:"Bm7",3:"C#m7",4:"Dmaj7",5:"E7",6:"F#m7",7:"G#m7♭5"},
    seventhSpelling:{2:["B","D","F#","A"],3:["C#","E","G#","B"],4:["D","F#","A","C#"],5:["E","G#","B","D"],6:["F#","A","C#","E"],7:["G#","B","D","F#"]}
  },
  E: {
    accidentals:4, notes:["F#","C#","G#","D#"],
    scale:["E","F#","G#","A","B","C#","D#"],
    triads:{2:"F#m",3:"G#m",4:"A",5:"B",6:"C#m",7:"D#dim"},
    sevenths:{2:"F#m7",3:"G#m7",4:"Amaj7",5:"B7",6:"C#m7",7:"D#m7♭5"},
    seventhSpelling:{2:["F#","A","C#","E"],3:["G#","B","D#","F#"],4:["A","C#","E","G#"],5:["B","D#","F#","A"],6:["C#","E","G#","B"],7:["D#","F#","A#","C#"]}
  },
  B: {
    accidentals:5, notes:["F#","C#","G#","D#","A#"],
    scale:["B","C#","D#","E","F#","G#","A#"],
    triads:{2:"C#m",3:"D#m",4:"E",5:"F#",6:"G#m",7:"A#dim"},
    sevenths:{2:"C#m7",3:"D#m7",4:"Emaj7",5:"F#7",6:"G#m7",7:"A#m7♭5"},
    seventhSpelling:{2:["C#","E","G#","B"],3:["D#","F#","A#","C#"],4:["E","G#","B","D#"],5:["F#","A#","C#","E"],6:["G#","B","D#","F#"],7:["A#","C#","E","G#"]}
  },
  "B♭": {
    accidentals:2, notes:["B♭","E♭"],
    scale:["B♭","C","D","E♭","F","G","A"],
    triads:{2:"Cm",3:"Dm",4:"E♭",5:"F",6:"Gm",7:"Adim"},
    sevenths:{2:"Cm7",3:"Dm7",4:"E♭maj7",5:"F7",6:"Gm7",7:"Am7♭5"},
    seventhSpelling:{2:["C","E♭","G","B♭"],3:["D","F","A","C"],4:["E♭","G","B♭","D"],5:["F","A","C","E♭"],6:["G","B♭","D","F"],7:["A","C","E♭","G"]}
  },
  "E♭": {
    accidentals:3, notes:["B♭","E♭","A♭"],
    scale:["E♭","F","G","A♭","B♭","C","D"],
    triads:{2:"Fm",3:"Gm",4:"A♭",5:"B♭",6:"Cm",7:"Ddim"},
    sevenths:{2:"Fm7",3:"Gm7",4:"A♭maj7",5:"B♭7",6:"Cm7",7:"Dm7♭5"},
    seventhSpelling:{2:["F","A♭","C","E♭"],3:["G","B♭","D","F"],4:["A♭","C","E♭","G"],5:["B♭","D","F","A♭"],6:["C","E♭","G","B♭"],7:["D","F","A♭","C"]}
  },
  F: {
    accidentals:1, notes:["B♭"],
    scale:["F","G","A","B♭","C","D","E"],
    triads:{2:"Gm",3:"Am",4:"B♭",5:"C",6:"Dm",7:"Edim"},
    sevenths:{2:"Gm7",3:"Am7",4:"B♭maj7",5:"C7",6:"Dm7",7:"Em7♭5"},
    seventhSpelling:{2:["G","B♭","D","F"],3:["A","C","E","G"],4:["B♭","D","F","A"],5:["C","E","G","B♭"],6:["D","F","A","C"],7:["E","G","B♭","D"]}
  },
  "A♭": {
    accidentals:4, notes:["B♭","E♭","A♭","D♭"],
    scale:["A♭","B♭","C","D♭","E♭","F","G"],
    triads:{2:"B♭m",3:"Cm",4:"D♭",5:"E♭",6:"Fm",7:"Gdim"},
    sevenths:{2:"B♭m7",3:"Cm7",4:"D♭maj7",5:"E♭7",6:"Fm7",7:"Gm7♭5"},
    seventhSpelling:{2:["B♭","D♭","F","A♭"],3:["C","E♭","G","B♭"],4:["D♭","F","A♭","C"],5:["E♭","G","B♭","D♭"],6:["F","A♭","C","E♭"],7:["G","B♭","D♭","F"]}
  },
  "D♭": {
    accidentals:5, notes:["B♭","E♭","A♭","D♭","G♭"],
    scale:["D♭","E♭","F","G♭","A♭","B♭","C"],
    triads:{2:"E♭m",3:"Fm",4:"G♭",5:"A♭",6:"B♭m",7:"Cdim"},
    sevenths:{2:"E♭m7",3:"Fm7",4:"G♭maj7",5:"A♭7",6:"B♭m7",7:"Cm7♭5"},
    seventhSpelling:{2:["E♭","G♭","B♭","D♭"],3:["F","A♭","C","E♭"],4:["G♭","B♭","D♭","F"],5:["A♭","C","E♭","G♭"],6:["B♭","D♭","F","A♭"],7:["C","E♭","G♭","B♭"]}
  },
  "F♯": {
    accidentals:6, notes:["F#","C#","G#","D#","A#","E#"],
    scale:["F#","G#","A#","B","C#","D#","E#"],
    triads:{2:"G#m",3:"A#m",4:"B",5:"C#",6:"D#m",7:"E#dim"},
    sevenths:{2:"G#m7",3:"A#m7",4:"Bmaj7",5:"C#7",6:"D#m7",7:"E#m7♭5"},
    seventhSpelling:{2:["G#","B","D#","F#"],3:["A#","C#","E#","G#"],4:["B","D#","F#","A#"],5:["C#","E#","G#","B"],6:["D#","F#","A#","C#"],7:["E#","G#","B","D#"]}
  },
  "G♭": {
    accidentals:6, notes:["B♭","E♭","A♭","D♭","G♭","C♭"],
    scale:["G♭","A♭","B♭","C♭","D♭","E♭","F"],
    triads:{2:"A♭m",3:"B♭m",4:"C♭",5:"D♭",6:"E♭m",7:"Fdim"},
    sevenths:{2:"A♭m7",3:"B♭m7",4:"C♭maj7",5:"D♭7",6:"E♭m7",7:"Fm7♭5"},
    seventhSpelling:{2:["A♭","C♭","E♭","G♭"],3:["B♭","D♭","F","A♭"],4:["C♭","E♭","G♭","B♭"],5:["D♭","F","A♭","C♭"],6:["E♭","G♭","B♭","D♭"],7:["F","A♭","C♭","E♭"]}
  }
};

const keyGroups = [
  ["C"], ["G","D","A","E"], ["F","B♭","E♭","A♭"], ["B","F♯"], ["D♭","G♭"]
];
const DEGREES_PER_KEY = 3;
const englishNums = ["zero","one","two","three","four","five","six"];

// Progress tracking
const PROGRESS_KEY = 'musicTheoryProgress';

function getDefaultProgress() {
  return {
    completedKeys: new Set(),
    unlockedGroups: new Set([0]), // Start with first group unlocked
    stats: {
      correct: 0,
      incorrect: 0,
      byKey: {},
      byType: {
        accCount: { correct: 0, incorrect: 0 },
        accNotes: { correct: 0, incorrect: 0 },
        scale: { correct: 0, incorrect: 0 },
        triads: { correct: 0, incorrect: 0 },
        sevenths: { correct: 0, incorrect: 0 }
      }
    }
  };
}

function loadProgress() {
  const raw = localStorage.getItem('mtp-progress');
  if (!raw) return getDefaultProgress();
  let parsed;
  try {
    parsed = JSON.parse(raw);
    // Convert unlockedGroups and completedKeys to arrays if needed
    let ug = parsed.unlockedGroups;
    let ck = parsed.completedKeys;
    if (!Array.isArray(ug)) ug = ug && typeof ug === 'object' ? Object.values(ug) : [0];
    if (!Array.isArray(ck)) ck = ck && typeof ck === 'object' ? Object.values(ck) : [];
    parsed.unlockedGroups = new Set(ug);
    parsed.completedKeys = new Set(ck);
    return parsed;
  } catch (e) {
    // If anything goes wrong, clear progress and use default
    localStorage.removeItem('mtp-progress');
    return getDefaultProgress();
  }
}

// State management
let state = {
  phase: "accCount",
  groupIndex: 0,
  keyIndex: 0,
  chordDegrees: [],
  advTriads: [], advIdx: 0,
  adv7ths: [], sevIdx: 0,
  progress: loadProgress()
};

// DOM Elements
const Q = document.getElementById("question"),
      A = document.getElementById("answer"),
      F = document.getElementById("feedback"),
      form = document.getElementById("quiz-form"),
      R = document.getElementById("reset"),
      P = document.getElementById("seventhPractice");

// Utility functions
function shuffle(arr) {
  for(let i = arr.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function ordinal(n) {
  const s = ["th","st","nd","rd"], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

function normalize(raw) {
  return raw.trim().replace(/b/g,"♭").toUpperCase().replace(/\s+/g, " ");
}

// Robust accidental normalization for all answer checking
function accidentalToUnicode(s) {
  s = s.trim();
  // Special case: 'bb' or 'Bb' as a token means B♭
  if (/^bb$/i.test(s)) return 'B♭';
  if (/^b$/i.test(s)) return 'B';
  // Double flat: Abb, Bbb, etc.
  if (/^([A-Ga-g])bb$/.test(s)) return s[0].toUpperCase() + '\uD834\uDD2B'; // 𝄫
  // Double sharp: A##, B##, etc. or Ax, Bx
  if (/^([A-Ga-g])(##|x)$/.test(s)) return s[0].toUpperCase() + '\uD834\uDD2A'; // 𝄪
  // Single flat: Ab, Bb, etc.
  if (/^([A-Ga-g])b$/.test(s)) return s[0].toUpperCase() + '♭';
  // Single sharp: A#, B#, etc.
  if (/^([A-Ga-g])#$/.test(s)) return s[0].toUpperCase() + '♯';
  // Already Unicode accidental
  if (/^([A-Ga-g])♭$/.test(s)) return s[0].toUpperCase() + '♭';
  if (/^([A-Ga-g])♯$/.test(s)) return s[0].toUpperCase() + '♯';
  if (/^([A-Ga-g])𝄫$/.test(s)) return s[0].toUpperCase() + '\uD834\uDD2B';
  if (/^([A-Ga-g])𝄪$/.test(s)) return s[0].toUpperCase() + '\uD834\uDD2A';
  return s.toUpperCase().normalize('NFC');
}

function normalizeAccList(strOrArr) {
  if (Array.isArray(strOrArr)) {
    return strOrArr
      .map(s => accidentalToUnicode(s))
      .filter(Boolean)
      .sort()
      .join(' ')
      .trim();
  } else {
    return String(strOrArr)
      .replace(/,/g, ' ')
      .split(/\s+/)
      .map(s => accidentalToUnicode(s))
      .filter(Boolean)
      .sort()
      .join(' ')
      .trim();
  }
}

function normalizeChord(str) {
  // Normalize each token in the chord string
  return str.trim().split(/\s+/).map(accidentalToUnicode).join('').toUpperCase();
}

function chordVariations(root, qual) {
  const v = [];
  switch (qual) {
    case "m": // minor
      v.push(
        root + "m", root + "M", root + "-", root + "MIN", root + "MINOR",
        root + " MIN", root + " MINOR", root + "min", root + "minor", root + " min", root + " minor"
      );
      break;
    case "": // major
      v.push(
        root, root + "MAJ", root + "MAJOR", root + " MAJ", root + " MAJOR",
        root + "maj", root + "major", root + " maj", root + " major"
      );
      break;
    case "dim": // diminished
      v.push(
        root + "DIM", root + "dim", root + " DIM", root + " dim", root + "DIMINISHED", root + "diminished", root + " DIMINISHED", root + " diminished", root + "°"
      );
      break;
    case "aug": // augmented
      v.push(
        root + "AUG", root + "aug", root + " AUG", root + " aug", root + "AUGMENTED", root + "augmented", root + " AUGMENTED", root + " augmented", root + "+"
      );
      break;
    default:
      v.push(root + qual.toUpperCase());
      break;
  }
  return v;
}

// Event handlers
R.onclick = () => {
  if (confirm("Are you sure you want to restart? Your progress will be saved.")) {
    location.reload();
  }
};

form.onsubmit = e => {
  e.preventDefault();
  checkAnswer();
};

A.onkeydown = e => {
  if(e.key === "Enter") {
    e.preventDefault();
    checkAnswer();
  }
};

P.onclick = () => {
  state.phase = "adv7ths";
  state.adv7ths = [];
  keyGroups.flat().forEach(k => {
    for(let d = 2; d <= 7; d++) state.adv7ths.push({k,d});
  });
  shuffle(state.adv7ths);
  state.sevIdx = 0;
  P.style.display = "none";
  askQuestion();
};

// Quiz logic
function askQuestion() {
  A.value = "";
  F.textContent = "";
  A.className = "";
  A.focus();
  
  const grp = keyGroups[state.groupIndex],
        key = grp[state.keyIndex];
  if (typeof key === 'undefined') {
    advancePhase();
    if (state.phase !== 'done') askQuestion();
    return;
  }
  let q = "";
  
  switch(state.phase) {
    case "accCount":
      q = `How many accidentals in ${key} major?`;
      break;
    case "accNotes":
      if (!state.accNotes || state.accNotes.length === 0) {
        F.textContent = "[Error] Accidentals state not initialized.";
        state.phase = "accCount";
        askQuestion();
        return;
      }
      q = quizData[key].accidentals === 1
        ? `Name the accidental in ${key} major.`
        : `Name the accidentals in ${key} major.`;
      break;
    case "scale":
      q = `Spell the ${key} major scale.`;
      break;
    case "triads":
      if (!state.chordDegrees || state.chordDegrees.length === 0) {
        F.textContent = "[Error] Triad degrees not initialized.";
        state.phase = "scale";
        askQuestion();
        return;
      }
      q = `In ${key} major, what chord is built on the ${ordinal(state.chordDegrees[0])} degree?`;
      break;
    case "advTriads": {
      if (!state.advTriads || state.advTriads.length === 0 || state.advIdx >= state.advTriads.length) {
        F.textContent = "[Error] Advanced triads state not initialized.";
        state.phase = "triads";
        askQuestion();
        return;
      }
      const at = state.advTriads[state.advIdx];
      q = `In ${at.k} major, what chord is built on the ${ordinal(at.d)} degree?`;
      break;
    }
    case "adv7ths": {
      if (!state.adv7ths || state.adv7ths.length === 0 || state.sevIdx >= state.adv7ths.length) {
        F.textContent = "[Error] Advanced sevenths state not initialized.";
        state.phase = "advTriads";
        askQuestion();
        return;
      }
      const sv = state.adv7ths[state.sevIdx];
      q = `Spell the notes in the ${sv.k} major ${ordinal(sv.d)}-degree seventh chord.`;
      break;
    }
    case "done":
      q = "🎉 You have completed the quiz!";
      A.disabled = true;
      break;
  }
  Q.textContent = q;
}

function updateProgress(correct) {
  const { progress } = state;
  const key = keyGroups[state.groupIndex][state.keyIndex];
  
  // Update overall stats
  if (correct) {
    progress.stats.correct++;
  } else {
    progress.stats.incorrect++;
  }
  
  // Update key-specific stats
  if (!progress.stats.byKey[key]) {
    progress.stats.byKey[key] = { correct: 0, incorrect: 0 };
  }
  if (correct) {
    progress.stats.byKey[key].correct++;
  } else {
    progress.stats.byKey[key].incorrect++;
  }
  
  // Update type-specific stats
  if (correct) {
    progress.stats.byType[state.phase].correct++;
  } else {
    progress.stats.byType[state.phase].incorrect++;
  }
  
  // Save progress
  saveProgress(progress);
}

function checkAnswer() {
  console.log('[DEBUG] checkAnswer called');
  if(state.phase === "done") return;
  
  const raw = A.value.trim();
  if(!raw) {
    F.style.color = "red";
    F.textContent = "⚠️ Please enter an answer.";
    A.classList.add("incorrect");
    return;
  }
  
  let correct = false;
  const grp = keyGroups[state.groupIndex],
        key = grp[state.keyIndex];

  switch(state.phase) {
    case "accCount": {
      const cnt = quizData[key].accidentals,
            low = raw.toLowerCase();
      if(cnt === 0) {
        if(["0","zero","none","no accidentals","null"].includes(low)) correct = true;
      } else if(raw === String(cnt) || low === englishNums[cnt]) correct = true;
      break;
    }
    case "accNotes": {
      if (!state.accNotes || state.accNotes.length === 0) {
        F.textContent = "[Error] Accidentals state not initialized.";
        state.phase = "accCount";
        askQuestion();
        return;
      }
      const at = {k:key, d: state.accNotes[0]};
      const correctNotes = quizData[at.k].notes || [];
      const normAnswer = normalizeAccList(raw);
      const normOrig = normalizeAccList(correctNotes);
      console.log('[DEBUG] accNotes', { raw, correctNotes, normAnswer, normOrig });
      if(normAnswer === normOrig) correct = true;
      break;
    }
    case "scale": {
      // Accept both 7-note and 8-note (with repeated root) answers
      const expArr = quizData[key].scale.map(accidentalToUnicode);
      const exp = expArr.join("");
      const candArr = raw.trim().split(/\s+/).map(accidentalToUnicode);
      const cand = candArr.join("");
      let correctScale = false;
      if (cand === exp) correctScale = true;
      // Accept repeated root at the octave
      if (
        candArr.length === expArr.length + 1 &&
        candArr.slice(0, expArr.length).join("") === exp &&
        candArr[0] === candArr[candArr.length - 1]
      ) {
        correctScale = true;
      }
      if (correctScale) correct = true;
      break;
    }
    case "triads":
    case "advTriads": {
      let at;
      if (state.phase === "triads") {
        if (!state.chordDegrees || state.chordDegrees.length === 0) {
          F.textContent = "[Error] Triad degrees not initialized.";
          state.phase = "scale";
          askQuestion();
          return;
        }
        at = {k:key, d: state.chordDegrees[0]};
      } else {
        if (!state.advTriads || state.advTriads.length === 0 || state.advIdx >= state.advTriads.length) {
          F.textContent = "[Error] Advanced triads state not initialized.";
          state.phase = "triads";
          askQuestion();
          return;
        }
        at = state.advTriads[state.advIdx];
      }
      const orig = quizData[at.k].triads[at.d];
      const root = orig.match(/^[A-G][#♭]?/)[0];
      const qual = orig.slice(root.length).toLowerCase();
      const variations = chordVariations(root, qual);
      const normAnswer = normalizeChord(raw);
      const normSet = new Set(variations.map(normalizeChord));
      console.log('[DEBUG] triads/advTriads', {
        orig,
        root,
        qual,
        variations,
        normAnswer,
        normSet: Array.from(normSet)
      });
      if(normSet.has(normAnswer)) correct = true;
      break;
    }
    case "adv7ths": {
      if (!state.adv7ths || state.adv7ths.length === 0 || state.sevIdx >= state.adv7ths.length) {
        F.textContent = "[Error] Advanced sevenths state not initialized.";
        state.phase = "advTriads";
        askQuestion();
        return;
      }
      const sv = state.adv7ths[state.sevIdx];
      const expArr = quizData[sv.k].seventhSpelling[sv.d]
        .map(n => n.replace(/B/g,"♭").toUpperCase());
      const gotArr = (raw.match(/[A-G][#b♭]?/g) || [])
        .map(n => n.replace(/b/g,"♭").toUpperCase());
      correct = expArr.every(n => gotArr.includes(n));
      break;
    }
  }

  // Update progress
  updateProgress(correct);

  if(correct) {
    A.classList.replace("incorrect","correct");
    F.style.color = "green";
    F.textContent = "✅ Correct!";
    setTimeout(() => {
      advancePhase();
      askQuestion();
    }, 500);
  } else {
    A.classList.replace("correct","incorrect");
    F.style.color = "red";
    F.textContent = "❌ Incorrect, try again.";
  }
}

function advancePhase() {
  const grp = keyGroups[state.groupIndex],
        key = grp[state.keyIndex];
  
  switch(state.phase) {
    case "accCount":
      state.phase = quizData[key].accidentals > 0 ? "accNotes" : "scale";
      break;
    case "accNotes":
      state.phase = "scale";
      break;
    case "scale":
      state.phase = "triads";
      state.chordDegrees = [2,3,4,5,6,7];
      shuffle(state.chordDegrees);
      state.chordDegrees = state.chordDegrees.slice(0,DEGREES_PER_KEY);
      break;
    case "triads":
      state.chordDegrees.shift();
      if(!state.chordDegrees.length) {
        state.keyIndex++;
        if(state.keyIndex >= grp.length) {
          if(state.groupIndex < keyGroups.length-1) {
            state.groupIndex++;
            state.keyIndex = 0;
            state.phase = "accCount";
            state.progress.unlockedGroups.add(state.groupIndex);
            saveProgress(state.progress);
          } else {
            state.phase = "advTriads";
            state.advTriads = [];
            keyGroups.flat().forEach(k => {
              for(let d = 2; d <= 7; d++) state.advTriads.push({k,d});
            });
            shuffle(state.advTriads);
            state.advIdx = 0;
          }
        } else {
          state.phase = "accCount";
        }
      }
      break;
    case "advTriads":
      state.advIdx++;
      if(state.advIdx >= state.advTriads.length) {
        state.phase = "adv7ths";
        P.style.display = "block";
      }
      break;
    case "adv7ths":
      state.sevIdx++;
      if(state.sevIdx >= state.adv7ths.length) state.phase = "done";
      break;
  }
}

// Initialize
askQuestion();

// Remove previous skip/jump logic and replace with new skip logic
function handleSkipParam() {
  console.log('handleSkipParam running', window.location.search);
  const params = new URLSearchParams(window.location.search);
  const skip = params.get('skip');
  if (skip) {
    function normalizeKeyName(key) {
      return accidentalToUnicode(key.trim()).normalize('NFC');
    }
    const phaseMap = {
      'scale': 'scale',
      'triad': 'triads',
      'triad+': 'advTriads',
      '7th': 'sevenths',
      '7th+': 'adv7ths'
    };
    let key, phase;
    if (!skip.includes('-')) {
      // Only key provided, default to accCount
      key = normalizeKeyName(skip);
      phase = 'accCount';
    } else {
      // Format: KEY-phase
      const firstDash = skip.indexOf('-');
      key = normalizeKeyName(skip.slice(0, firstDash));
      const rawPhase = skip.slice(firstDash + 1);
      phase = phaseMap[rawPhase];
    }
    // Debug: log normalized skip key and phase
    console.log('[DEBUG] skip logic', { skip, normalizedSkipKey: key, phase });
    let found = false;
    outer: for (let g = 0; g < keyGroups.length; g++) {
      for (let idx = 0; idx < keyGroups[g].length; idx++) {
        const groupKey = keyGroups[g][idx];
        const normGroupKey = normalizeKeyName(groupKey);
        console.log(`[DEBUG] comparing`, { normGroupKey, key });
        if (normGroupKey === key && phase) {
          state.groupIndex = g;
          state.keyIndex = idx;
          state.phase = phase;
          found = true;
          // Data-driven state initialization
          if (phase === 'accCount' || phase === 'accNotes') {
            const accCount = quizData[groupKey]?.accidentals || 0;
            state.accNotes = Array.from({length: accCount}, (_, i) => i);
          }
          if (phase === 'triads') {
            state.chordDegrees = [2,3,4,5,6,7].slice(0, DEGREES_PER_KEY);
          }
          if (phase === 'advTriads') {
            state.advTriads = [];
            for(let d = 2; d <= 7; d++) state.advTriads.push({k:groupKey,d});
            state.advIdx = 0;
          }
          if (phase === 'sevenths') {
            state.seventhDegrees = [2,3,4,5,6,7].slice(0, DEGREES_PER_KEY);
          }
          if (phase === 'adv7ths') {
            state.adv7ths = [];
            for(let d = 2; d <= 7; d++) state.adv7ths.push({k:groupKey,d});
            state.sevIdx = 0;
          }
          console.log('[DEBUG] skip match', { groupIndex: g, keyIndex: idx, phase: state.phase });
          console.log('[DEBUG] state after skip:', JSON.parse(JSON.stringify(state)));
          askQuestion();
          renderProgressMenu();
          break outer;
        }
      }
    }
    if (!found) {
      // Show a clear error in the UI instead of reloading
      if (typeof F !== 'undefined') {
        F.style.color = 'red';
        F.textContent = `Invalid skip parameter or key: "${skip}". Please check your URL.`;
        // Also show a visible error in the menu area
        const menu = document.getElementById('progress-menu');
        if (menu) menu.innerHTML = `<div style="color:red;padding:1rem;">Invalid skip parameter or key: <b>${skip}</b></div>`;
      } else {
        alert(`Invalid skip parameter or key: "${skip}". Please check your URL.`);
      }
      renderProgressMenu();
    }
  } else {
    // No skip param, render menu for default state
    renderProgressMenu();
  }
}

// --- On load, render UI and run skip logic after DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  renderProfileSwitcher();
  handleSkipParam();
});
// Also run skip logic whenever the URL changes (popstate event)
window.addEventListener('popstate', handleSkipParam);

// --- Profile and Progress Menu UI ---
const PROFILE_KEY = 'mtp-profile';
const PROFILES = {
  beginner: 'Beginner',
  dev: 'Dev/Teacher'
};

function getProfile() {
  return localStorage.getItem(PROFILE_KEY) || 'beginner';
}
function setProfile(profile) {
  localStorage.setItem(PROFILE_KEY, profile);
}

function clearProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}

function renderProfileSwitcher() {
  const el = document.getElementById('profile-switcher');
  if (!el) return;
  el.innerHTML = '';
  const label = document.createElement('label');
  label.textContent = 'Profile: ';
  const select = document.createElement('select');
  for (const key in PROFILES) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = PROFILES[key];
    select.appendChild(opt);
  }
  select.value = getProfile();
  select.onchange = () => {
    setProfile(select.value);
    if (select.value === 'beginner') {
      clearProgress();
      location.reload();
    } else {
      // Dev: unlock all
      const progress = getDefaultProgress();
      progress.unlockedGroups = new Set(keyGroups.map((_, i) => i));
      progress.completedKeys = new Set(keyGroups.flat());
      saveProgress(progress);
      location.reload();
    }
  };
  label.appendChild(select);
  el.appendChild(label);
  // Add Clear Progress button
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear Progress';
  clearBtn.style.marginLeft = '1rem';
  clearBtn.onclick = () => {
    clearProgress();
    location.reload();
  };
  el.appendChild(clearBtn);
}

function isKeyUnlocked(g, idx) {
  const profile = getProfile();
  if (profile === 'dev') return true;
  const progress = state.progress;
  return progress.unlockedGroups.has(g) && (!progress.completedKeys || !progress.completedKeys.has(keyGroups[g][idx]));
}
function isKeyCompleted(g, idx) {
  const progress = state.progress;
  return progress.completedKeys && progress.completedKeys.has(keyGroups[g][idx]);
}

function renderProgressMenu() {
  const el = document.getElementById('progress-menu');
  if (!el) return;
  el.innerHTML = '';
  keyGroups.forEach((group, g) => {
    const groupDiv = document.createElement('div');
    groupDiv.style.marginBottom = '1rem';
    group.forEach((key, idx) => {
      console.log('[DEBUG] menu button key:', key, typeof key);
      const btn = document.createElement('button');
      btn.textContent = key;
      btn.style.display = 'block';
      btn.style.width = '90%';
      btn.style.margin = '0.25rem auto';
      btn.style.padding = '0.5rem';
      btn.style.borderRadius = '6px';
      btn.style.border = '1px solid #ddd';
      btn.style.background = '#fff';
      btn.style.color = '#222'; // Always visible text for inactive buttons
      btn.style.cursor = isKeyUnlocked(g, idx) ? 'pointer' : 'not-allowed';
      btn.disabled = !isKeyUnlocked(g, idx);
      if (state.groupIndex === g && state.keyIndex === idx) {
        btn.style.background = '#2196f3';
        btn.style.color = '#fff';
        btn.style.fontWeight = 'bold';
      } else if (isKeyCompleted(g, idx)) {
        btn.style.background = '#c8e6c9';
        btn.style.color = '#333';
      }
      btn.onclick = () => {
        if (!btn.disabled) {
          // Sanitize key value for skip navigation
          const safeKey = typeof key === 'string' ? key : String(key);
          window.location.href = `?skip=${encodeURIComponent(safeKey)}`;
        }
      };
      groupDiv.appendChild(btn);
    });
    el.appendChild(groupDiv);
  });
}

// --- Patch progress logic to unlock next group/key on completion ---
const origUpdateProgress = updateProgress;
updateProgress = function(correct) {
  const prevPhase = state.phase;
  origUpdateProgress.apply(this, arguments);
  // If completed a key, mark as completed and unlock next
  if (correct && (prevPhase === 'triads' || prevPhase === 'advTriads' || prevPhase === 'adv7ths')) {
    const key = keyGroups[state.groupIndex][state.keyIndex];
    state.progress.completedKeys.add(key);
    // Unlock next key/group if not already
    if (state.keyIndex + 1 < keyGroups[state.groupIndex].length) {
      state.progress.unlockedGroups.add(state.groupIndex);
    } else if (state.groupIndex + 1 < keyGroups.length) {
      state.progress.unlockedGroups.add(state.groupIndex + 1);
    }
    saveProgress(state.progress);
    renderProgressMenu();
  }
};

// --- On load, render UI ---
document.addEventListener('DOMContentLoaded', () => {
  renderProfileSwitcher();
  renderProgressMenu();
});
// Also re-render menu after each question
const origAskQuestion = askQuestion;
askQuestion = function() {
  origAskQuestion.apply(this, arguments);
  renderProgressMenu();
};
