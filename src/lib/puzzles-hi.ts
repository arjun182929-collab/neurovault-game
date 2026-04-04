// NeuroVault: Extreme Puzzle Lab - Hinglish Translations
// Desi Gen Z style - Hindi + English mix, Instagram/WhatsApp vibes
// Kyunki puzzle English mein karna boring hai bhai! 😎

export interface PuzzleTranslation {
  title: string;
  question: string;
  options: { [optionId: string]: string };
  hint: string;
  explanation: string;
}

// Difficulty labels in Hinglish
export const DIFFICULTY_LABELS_HI: Record<string, string> = {
  easy: 'Aasan',
  hard: 'Mushkil',
  extreme: 'Bhayanak',
  insane: 'Paagal Khaana',
  impossible: 'Naa Mumkin',
};

export const PUZZLES_HI: Record<number, PuzzleTranslation> = {

  // ===== EASY (1-10) =====

  // Level 1 - Logic
  1: {
    title: 'Pehla Step Boss',
    question: 'Agar saare Bloops Razzies hain aur saare Razzies Lazzies hain, toh kya saare Bloops 100% Lazzies hain?',
    options: {
      a: 'Haan bhai, pakka',
      b: 'Zaroori nahi hai yaar',
      c: 'Sirf kuch Bloops hain',
      d: 'Pata nahi bhai, decide nahi ho raha',
    },
    hint: 'Transitive logic socho - agar A→B aur B→C...',
    explanation: 'Classic syllogism hai bhai. Agar Bloops ⊆ Razzies aur Razzies ⊆ Lazzies, toh Bloops ⊆ Lazzies transitivity se proven hai. Dekha kitna simple tha!',
  },

  // Level 2 - Pattern
  2: {
    title: 'Number Ka Formula',
    question: 'Batao agla kya aayega:\n2, 4, 8, 16, ?',
    options: {
      a: '24',
      b: '30',
      c: '32',
      d: '28',
    },
    hint: 'Har number ko same cheez se multiply kar rahe hain...',
    explanation: 'Sequence har baar double hoti hai bhai: 2×2=4, 4×2=8, 8×2=16, 16×2=32. Simple hai na!',
  },

  // Level 3 - Fake Answer
  3: {
    title: 'Dhoka Mat Kha',
    question: 'Ek kisan ke paas 17 sheep hain. 9 ke alawa sab mar jaate hain. Ab kitne sheep bache?',
    options: {
      a: '8',
      b: '0',
      c: '9',
      d: '17',
    },
    hint: 'Dhyaan se padho: "All but 9 die" ka matlab kya hai...',
    explanation: '"9 ke alawa sab mar gaye" matlab 9 zinda hain bhai! Math bas distract karne ke liye hai. Dhoka mat kha! 😂',
  },

  // Level 4 - Reverse Thinking
  4: {
    title: 'Ulta Socho Bhai',
    question: 'Kaunsa button press NAHI karna chahiye aage jaane ke liye?',
    options: {
      a: 'Press me to lose',
      b: 'Isse mat dabao yaar',
      c: 'Ise skip kar do',
      d: 'Ye galat button hai',
    },
    hint: 'Sawal kehta hai NAHI press karo correct answer ko. Toh tumhe PRESS karna padega!',
    explanation: 'Reverse psychology hai bhai! "NOT press" ka matlab hai ki actually press karo. Simple sa logic but mind blow ho gaya na? 😎',
  },

  // Level 5 - Logic
  5: {
    title: 'Umar Ka Khel',
    question: 'Tom Jerry se 5 saal bada hai. 3 saal baad Tom ka double umar hoga Jerry se. Abhi Jerry ki umar kya hai?',
    options: {
      a: '1',
      b: '2',
      c: '3',
      d: '4',
    },
    hint: 'Set up karo: T = J + 5 aur T + 3 = 2(J + 3)',
    explanation: 'T = J + 5, T + 3 = 2J + 6 → J + 5 + 3 = 2J + 6 → J + 8 = 2J + 6 → J = 2. Jerry abhi 2 saal ka hai bhai!',
  },

  // Level 6 - Pattern
  6: {
    title: 'Shape Ka Game',
    question: 'Batao agla kya aayega:\n△ ○ △ △ ○ △ △ △ ○ ?',
    options: {
      a: '△',
      b: '○',
      c: '□',
      d: '◇',
    },
    hint: 'Har circle ke beech kitne triangles hain, count karo.',
    explanation: 'Pattern hai bhai: 1△, ○, 2△, ○, 3△, ○, 4△... Ab △ aayega. Dekha kitna clean hai!',
  },

  // Level 7 - Memory
  7: {
    title: 'Yaad Rakhna Boss',
    question: 'Sequence yaad karo, phir answer do.',
    options: {
      a: '🧠⚡🔮💎',
      b: '⚡🧠💎🔮',
      c: '🧠🔮⚡💎',
      d: '💎⚡🔮🧠',
    },
    hint: 'Pehla tha brain, second tha lightning...',
    explanation: 'Sequence ye thi bhai: 🧠⚡🔮💎. Agla baar dhyan se dekhna! 👀',
  },

  // Level 8 - Fake Answer
  8: {
    title: 'Ginti Ka Jugaad',
    question: 'Tumhare paas 6 apples hain aur tum 4 le jaate ho. Ab tumhare paas kitne hain?',
    options: {
      a: '2',
      b: '4',
      c: '6',
      d: '10',
    },
    hint: '"4 le jaate ho" - matlab 4 kis ke paas hain ab?',
    explanation: 'TU 4 apples le gaya bhai, matlab TERE paas 4 hain! Classic word trick - kahin mat bhoolna ye! 😏',
  },

  // Level 9 - Hidden UI
  9: {
    title: 'Dhoondh Le Bhaisaab',
    question: 'Answer is screen pe chhupa hai kahin. Dhyan se dekho bhai.',
    options: {},
    hint: 'Har cheez pehli nazar mein dikhti nahi...',
    explanation: 'Ek hidden button tha bottom-right corner mein! Dhoond liya tune? Waah! 🔍',
  },

  // Level 10 - Logic
  10: {
    title: 'Darwaze Ke Raaz',
    question: 'Saamne 2 darwaze hain. Ek azaadi mein le jaata hai, ek tabahi mein. 2 guards hain: ek hamesha jhooth bolta hai, ek sach bolta hai. Tum EK guard se EK sawaal pooch sakte ho.\n\nKya poochoge?',
    options: {
      a: '"Kaunsa darwaza azaadi mein le jaata hai?"',
      b: '"Dusra guard kya bolega?"',
      c: '"Agar main dusre guard se poochhta ki kaunsa darwaza safe hai, toh wo kya kahega?" → Phir OPPOSITE pick karo',
      d: '"Kya tum sach bolne wala guard ho?"',
    },
    hint: 'Jhootha aur sachha dono ko ek saath handle karna hai.',
    explanation: 'Dusre guard se poochhne se dono guards galat darwaze ki taraf point karte hain. Sachha sachha bataata hai ki jhootha kya bolega. Jhootha jhooth bolta hai ki sachha kya bolega. Toh ulta darwaza choose karo bhai! 🧠',
  },

  // ===== HARD (11-30) =====

  // Level 11 - Pattern
  11: {
    title: 'Code Tod De',
    question: 'Decode karo bhai: 8 → 5, 15 → 6, 23 → 5, 42 → ?',
    options: {
      a: '6',
      b: '8',
      c: '4',
      d: '7',
    },
    hint: 'Number ke digits ka sum karo.',
    explanation: '4 + 2 = 6. Answer hai digits ka sum: 8→8, 1+5=6, 2+3=5, 4+2=6. Arre simple tha na!',
  },

  // Level 12 - Logic
  12: {
    title: 'Jazeera Ka Khel',
    question: 'Ek island pe knights hamesha sach bolte hain, knaves hamesha jhooth. A kehta hai "Hum dono knaves hain."\n\nToh A kya hai?',
    options: {
      a: 'Knight',
      b: 'Knave',
      c: 'Koi bhi ho sakta hai',
      d: 'Info kam hai bhai',
    },
    hint: 'Agar A knight hota toh "hum dono knaves hain" kya sach bol sakta tha?',
    explanation: 'Knight kabhi nahi bol sakta "main knave hoon" (ye paradox hai). Toh A knave hai pakka. A ka statement "hum DONO knaves hain" jhooth hai, toh B knight hai. Mind blown na? 🤯',
  },

  // Level 13 - Memory
  13: {
    title: 'Grid Ka Yaad',
    question: 'Grid yaad karo, phir batao position (2,3) pe kya symbol tha.',
    options: {
      a: '🌊',
      b: '⚡',
      c: '🔥',
      d: '🎯',
    },
    hint: 'Grid 3x3 hai. Position (2,3) = row 2, column 3.',
    explanation: 'Row 2: 🌊⚡🌙. Column 3 = ⚡. Yaad rakhne wale hain tu! 🧠',
  },

  // Level 14 - Fake Answer
  14: {
    title: 'Train Ka Jugaad',
    question: 'Ek train City A se 60 mph pe nikalti hai. Dusri City B se 40 mph pe. Shehron ke beech 200 miles hain. 2 ghante baad wo mil jaate hain. City A se kitni door milte hain?',
    options: {
      a: '100 miles',
      b: '120 miles',
      c: '80 miles',
      d: '150 miles',
    },
    hint: 'Distance = speed × time. City A wali train ke liye...',
    explanation: 'City A ki train: 60 mph × 2 ghante = 120 miles. "100 miles" ek trap hai (halfway point) jo alag speed ko ignore karta hai. Smart hain na setter log! 😏',
  },

  // Level 15 - Reverse Thinking
  15: {
    title: 'Ulta Din Boss',
    question: 'Ek duniya mein jahan "true" ka matlab "false" aur "false" ka matlab "true", toh kaunsa statement TRUE hai?',
    options: {
      a: '1 + 1 = 2',
      b: '1 + 1 = 3',
      c: 'Aasmaan neela hai',
      d: 'Paani geela hai',
    },
    hint: 'Ulta duniya mein false statements true ban jaate hain...',
    explanation: 'Ulta duniya mein false = true. "1 + 1 = 3" normally false hai, toh reversed world mein ye TRUE hai bhai! Logical hai na?',
  },

  // Level 16 - Pattern
  16: {
    title: 'Fibonacci Magic',
    question: 'Batao kya aayega: 1, 1, 2, 3, 5, 8, 13, ?',
    options: {
      a: '18',
      b: '20',
      c: '21',
      d: '26',
    },
    hint: 'Har number pichle do ka sum hai.',
    explanation: '8 + 13 = 21. Fibonacci sequence hai bhai! Nature mein bhi milta hai ye pattern - sunflowers, pinecones sab mein! 🌻',
  },

  // Level 17 - Hidden UI
  17: {
    title: 'Hilao Ke Dekho',
    question: 'Exit chhupa hai. Screen ko shake karo (ya question mark pe 3 baar click karo).',
    options: {},
    hint: 'Kabhi kabhi answer click nahi, interaction pe depend karta hai.',
    explanation: 'Question mark pe triple-click karke hidden answer mil gaya! Jugaad laga re baba! 🎯',
  },

  // Level 18 - Logic
  18: {
    title: 'Einstein Level Lite',
    question: '5 ghar ek row mein hain. Green ghar white ghar ke turant daayein mein hai. Agar white ghar number 2 hai, toh green ghar number kya hai?',
    options: {
      a: 'House 1',
      b: 'House 3',
      c: 'House 4',
      d: 'House 5',
    },
    hint: '"Turant daayein" matlab agla hi ghar.',
    explanation: 'White ghar hai number 2. "Turant daayein" matlab house 3. Green = house 3. Einstein ka riddle hai ye lite version! 🧠',
  },

  // Level 19 - Memory
  19: {
    title: 'Rangon Ki Baarish',
    question: 'Colors dekho, phir correct order pick karo.\n\n🔴 🟢 🔵 🟡 🟣',
    options: {
      a: '🔴🟢🔵🟡🟣🟠',
      b: '🟢🔴🔵🟡🟠🟣',
      c: '🔴🔵🟢🟡🟣🟠',
      d: '🔴🟢🔵🟡🟠🟣',
    },
    hint: 'Red aur Green swap ho gaye the jo tum expect kar rahe the...',
    explanation: 'Actual order thi 🟢🔴🔵🟡🟠🟣, display wali nahi! Tricky hai na bhai? 🎨',
  },

  // Level 20 - Fake Answer
  20: {
    title: 'Calendar Ka Dhoka',
    question: 'Kuch mahine mein 30 din hain, kuch mein 31. Kitne mahine mein 28 din hain?',
    options: {
      a: '1',
      b: 'Sirf February',
      c: '12',
      d: 'Leap year pe depend karta hai',
    },
    hint: 'Kya koi mahina hai jismein kam se kam 28 din NAHI hain?',
    explanation: 'SAARE 12 mahine mein kam se kam 28 din hain bhai! Classic misdirection - pagal kar diya na? 😂',
  },

  // ===== EXTREME (21-30) =====

  // Level 21 - Pattern
  21: {
    title: 'Binary Ka Khel',
    question: 'Binary pattern decode karo:\n\n01, 10, 11, 100, 101, ?',
    options: {
      a: '110',
      b: '111',
      c: '1000',
      d: '011',
    },
    hint: 'Ye binary representations hain ek famous sequence ke.',
    explanation: 'Binary mein: 1, 2, 3, 4, 5, 6. Answer hai 6 ka binary = 110. Programmer vibe aa rahi hai? 💻',
  },

  // Level 22 - Logic
  22: {
    title: 'Teen Dev',
    question: 'Teen beings hain: ek hamesha sach bolta, ek hamesha jhooth, ek random. Wo "da" ya "ja" bolte hain par tumhe nahi pata kaunsa yes/kaunsa no hai.\n\nKitne sawaal lagenge teeno pehchanne mein?',
    options: {
      a: '2',
      b: '3',
      c: '4',
      d: '5',
    },
    hint: 'Ye hai George Boolos ka famous "Hardest Logic Puzzle Ever".',
    explanation: 'Exactly 3 sawaalon mein solve ho jaata hai bhai, counterfactual questions use karke jo language ki confusion ko bypass kar dete hain. Ye puzzle NASA scientists ko bhi pasand hai! 🚀',
  },

  // Level 23 - Reverse Thinking
  23: {
    title: 'Aaina Dimag',
    question: 'Main hoon eternity ka beginning, time aur space ka end. Main hoon har end ka start, aur har race ka end.\n\nPAR main letter "e" NAHI hoon. Main kya hoon?',
    options: {
      a: 'Letter "e"',
      b: 'Kuch nahi exist nahi karta',
      c: '"Kuch nahi" / void ka concept',
      d: 'Time khud',
    },
    hint: 'Classic answer exclude ho gaya hai. Philosophy mein aur kya fit hota hai?',
    explanation: 'Void/nothingness bhi fit hota hai bhai: eternity ka beginning (time se pehle), sab cheezon ka end. Twist tha obvious "e" ko reject karna! 🕳️',
  },

  // Level 24 - Memory
  24: {
    title: 'Grid Ka Toofan',
    question: 'Ye 4x4 grid yaad karo (3 seconds), phir answer do.',
    options: {
      a: '(3,2) pe kya tha? → 🔥',
      b: '(3,2) pe kya tha? → 💎',
      c: '(3,2) pe kya tha? → ⚡',
      d: '(3,2) pe kya tha? → 🌙',
    },
    hint: 'Row 3, Column 2.',
    explanation: 'Row 3: 🔥🎯💎. Column 2 = 🔥. Photographic memory hai teri ya nahi? 📸',
  },

  // Level 25 - Hidden UI
  25: {
    title: 'Gayab Darwaza',
    question: 'Yahan koi obvious button nahi hai. Answer andheron mein chhupa hai.',
    options: {},
    hint: 'Andhera cheezein chhupata hai. Cursor ko edges ke paas slowly move karo.',
    explanation: 'Top-left corner mein ek almost invisible button tha! Nazar aaya bhi? 👁️',
  },

  // Level 26 - Fake Answer
  26: {
    title: 'Probability Ka Jhakaas',
    question: 'Tumhare paas 3 boxes hain. Ek mein prize hai. Tum Box 1 pick karte ho. Host Box 3 kholta hai (khaali). Kya tum Box 2 pe switch karoge?',
    options: {
      a: 'Farak nahi padta (50/50 hai)',
      b: 'Haan switch karo (2/3 chance jeetne ka)',
      c: 'Nahi, ruko (pehla pick better hai)',
      d: 'Host pe depend karta hai',
    },
    hint: 'Ye Monty Hall problem hai. Host ka action tumhe information deta hai.',
    explanation: 'Monty Hall bhai! Switch karne se 2/3 probability jeetne ki. Tumhara pehla pick 1/3 tha. Host ne ek door eliminate kar diya toh baaki 2/3 probability doosre door pe concentrate ho gayi. Maths is beautiful! 🎲',
  },

  // Level 27 - Logic
  27: {
    title: 'Zehar Aur Daaru',
    question: 'Tumhare paas 1000 wine bottles hain, 1 mein zehar hai. Zehar exactly 1 ghante mein maarta hai. Tumhare paas 10 test strips hain jo color change karte hain agar zehar ho. 1 ghante ka time hai.\n\nKya tum zehar wali bottle dhoondh sakte ho?',
    options: {
      a: 'Nahi, 1 ghante mein impossible hai',
      b: 'Haan, binary encoding use karke',
      c: 'Sirf agar lucky rahe',
      d: 'Haan, 100 ek saath test karo',
    },
    hint: '2^10 = 1024 > 1000. Bottle numbers ki binary representation socho...',
    explanation: 'Har bottle ko 10-bit binary number assign karo. Strip i un bottles ko test karti hai jahan bit i = 1. 1 ghante baad strips ka color pattern exact bottle reveal kar deta hai binary representation se. Genius hack hai ye! 🔬',
  },

  // Level 28 - Pattern
  28: {
    title: 'Dekho Aur Bolo',
    question: 'Look-and-Say sequence mein agla kya hai?\n\n1, 11, 21, 1211, ?',
    options: {
      a: '111221',
      b: '1231',
      c: '131221',
      d: '12211',
    },
    hint: 'Pichle number ko loud bolke dekho: one 1, two 1s, one 2 one 1...',
    explanation: '1211 → "one 1, one 2, two 1s" → 111221. Fun fact: Conway isko discover kiya tha aur iski properties mind-blowing hain! 🗣️',
  },

  // Level 29 - Reverse Thinking
  29: {
    title: 'Jhootha Ka Jhootha',
    question: 'Ek aadmi kehta hai "Main abhi jhooth bol raha hoon." Agar statement true hai toh wo jhooth bol raha hai (contradiction). Agar false hai toh wo sach bol raha hai (contradiction).\n\nKaunsa option best describe karta hai ye?',
    options: {
      a: 'Statement true hai',
      b: 'Statement false hai',
      c: 'Ye undecidable paradox hai — na true na false',
      d: 'Aadmi exist hi nahi karta',
    },
    hint: 'Kya ek statement apni truth value ko reference kar sake aur consistent rahe?',
    explanation: 'Liar\'s Paradox self-referential hai aur classical logic mein undecidable. Gödel ne similar ideas apni incompleteness theorems mein use ki thi. Philosophy level up ho gaya! 📚',
  },

  // Level 30 - The Gauntlet
  30: {
    title: 'Mahasangram',
    question: 'Ek jail mein 100 cells hain. Shuru mein sab locked. Guard 1 sab toggle karta hai. Guard 2 multiples of 2 toggle karta hai. Guard 3 multiples of 3... Guard 100 cell 100 toggle karta hai.\n\nKhet ki baad kitne cells UNLOCKED hain?',
    options: {
      a: '10',
      b: '50',
      c: '25',
      d: '1',
    },
    hint: 'Ek cell apne har factor ke liye ek baar toggle hoti hai. Kab toggle count odd hota hai?',
    explanation: 'Sirf ODD factors wale cells unlocked hain = perfect squares bhai! √100 = 10. 1² se 10² tak 10 perfect squares hain. Maths + logic combo! 🔢',
  },

  // ===== INSANE (31-40) =====

  // Level 31 - Pattern
  31: {
    title: 'Pattern Ka Raja',
    question: 'Pattern dhundho: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ?',
    options: {
      a: '87',
      b: '89',
      c: '76',
      d: '91',
    },
    hint: 'Famous sequence hai jahan har number pichle do ka sum hota hai.',
    explanation: 'Fibonacci hai bhai: 34 + 55 = 89. Isko toh sota hua bhi solve kar sakta hai! 😴',
  },

  // Level 32 - Fake Answer
  32: {
    title: 'Be-Had Hotel',
    question: 'Hilbert ka Hotel full hai. Ek naya guest aata hai. Kya hotel use bina kisi ko hataaye accommodate kar sakta hai?',
    options: {
      a: 'Nahi yaar, full hai',
      b: 'Haan, guest n ko room n+1 mein bhejo',
      c: 'Sirf agar hotel width mein infinite ho',
      d: 'Haan, naya wing bana ke',
    },
    hint: 'Agar har guest next room number mein shift ho jaaye?',
    explanation: 'Infinite hotel mein guest ko room n se room n+1 mein shift karo. Room 1 khaali ho jaata hai. Infinity + 1 = infinity bhai! Aakhir infinity infinity hota hai! ♾️',
  },

  // Level 33 - Reverse Thinking
  33: {
    title: 'Khud Ki Baat',
    question: 'Kaunsa statement paradox create karta hai?\n\nA: "Ye statement false hai."\nB: "Ye statement true hai."\nC: Dono A aur B\nD: Na koi paradox create karta hai',
    options: {
      a: 'Sirf Statement A',
      b: 'Sirf Statement B',
      c: 'Dono A aur B',
      d: 'Na koi',
    },
    hint: 'Kya statement B consistently true ho sakta hai? Kya A?',
    explanation: 'A Liar\'s Paradox create karta hai (agar true→false, agar false→true). B consistently true ho sakta hai (koi paradox nahi). Deep thinking ki zaroorat hai! 🧘',
  },

  // Level 34 - Logic
  34: {
    title: 'Neeli Aankhein',
    question: 'Ek island pe 100 neeli aankh wale log, 100 brown aankh wale. Wo dusron ki aankhein dekh sakte hain apni nahi. Koi communication nahi. Agar kisi ko apni aankh ka color pata chale toh raat ko chale jaate hain.\n\nDay 101 pe kaun chale jaata hai?',
    options: {
      a: 'Koi nahi (samajh nahi aa raha)',
      b: 'Saare neeli aankh wale chale jaate hain',
      c: 'Saare brown aankh wale chale jaate hain',
      d: 'Sab chale jaate hain',
    },
    hint: '1 neeli aankh se shuru karo, phir 2, phir 3... Inductively kya hota hai?',
    explanation: 'Common knowledge se, induction se: agar n neeli aankh wale hain toh wo day n pe chale jaate. 100 neeli aankh day 100 pe chale jaate. Brown walo ko day 101 pe samajh aata hai, day 102 pe chale jaate. Xindabad logic! 👁️',
  },

  // Level 35 - Hidden UI
  35: {
    title: 'Bhatakti Aatma',
    question: 'Answer dimensions ke beech mein hai. Apne mouse ko puzzle area pe 3 baar ghoomao circle mein reveal karne ke liye.',
    options: {},
    hint: 'Kuch puzzles ko patience aur specific interaction pattern ki zaroorat hoti hai.',
    explanation: 'Puzzle area pe circular mouse movements ne hidden reveal trigger kar diya! Patience pays off bhai! 👻',
  },

  // Level 36 - Memory
  36: {
    title: 'Computer Ban Ja',
    question: 'Yaad karo: ADD 3, MULTIPLY BY 2, SUBTRACT 5. Starting number: 7. Result kya hai?',
    options: {
      a: '15',
      b: '12',
      c: '13',
      d: '17',
    },
    hint: '7 + 3 = ? → × 2 = ? → - 5 = ?',
    explanation: '7 + 3 = 10, 10 × 2 = 20, 20 - 5 = 15. Tum toh ek insaano CPU ho bhai! 🖥️',
  },

  // Level 37 - Pattern
  37: {
    title: 'Prime Ka Chakravyuh',
    question: '7th prime number kya hai?',
    options: {
      a: '13',
      b: '15',
      c: '17',
      d: '19',
    },
    hint: 'Primes: 2, 3, 5, 7, 11, 13, ?',
    explanation: '7th prime: 2, 3, 5, 7, 11, 13, 17. Basics strong rakho, sab easy lagega! 🔢',
  },

  // Level 38 - Fake Answer
  38: {
    title: 'Sikka Uchal',
    question: 'Maine fair coin 10 baar flip kiya aur har baar heads aaya. Agla flip heads aane ki probability kya hai?',
    options: {
      a: '1/1024 (bahut unlikely)',
      b: '1/2 (50%)',
      c: '50% se kam (streak ke wajah se)',
      d: '50% se zyada (hot streak)',
    },
    hint: 'Gambler\'s Fallacy phir se aagaya...',
    explanation: 'Coin ki koi yaad nahi hoti bhai! Har flip independent hai. Probability hamesha 50% hai. Past results future pe effect nahi daalte. Isko Gambler\'s Fallacy kehte hain! 🪙',
  },

  // Level 39 - Logic
  39: {
    title: 'Halt Ka Sawal',
    question: 'Kya tum ek program likh sakte ho jo bataye ki koi bhi given program eventually rukega (halt) ya forever chalega?',
    options: {
      a: 'Haan, agar computing power zyada ho',
      b: 'Nahi, ye mathematically impossible hai',
      c: 'Haan, par sirf simple programs ke liye',
      d: 'Programming language pe depend karta hai',
    },
    hint: 'Turing ne 1936 mein ye prove kiya...',
    explanation: 'Alan Turing ne Halting Problem ko undecidable prove kiya. Koi universal halting checker exist nahi kar sakta. Ye computer science ka foundational result hai. Turing sahab zindabaad! 💻',
  },

  // Level 40 - Reverse Thinking
  40: {
    title: 'Jahaz Ka Raaz',
    question: 'Agar tum jahaz ki har plank ko ek ek karke replace karo, toh wo wahi jahaz hai? Ab purani planks se dusra jahaz banao. Kaunsa ORIGINAL Ship of Theseus hai?',
    options: {
      a: 'Bana hua jahaz (same materials)',
      b: 'Na koi — identity ek illusion hai',
      c: 'Jo continuously repair hua jahaz',
      d: 'Dono equally original hain',
    },
    hint: 'Kya cheez ko "same" banana time pe kya decide karta hai?',
    explanation: 'Ship of Theseus paradox identity ka concept challenge karta hai. Deepest answer ye hai ki persistent identity khud ek illusion hai — ek concept jo humara dimag continuous change pe impose karta hai. Philosopher vibes! ⚓',
  },

  // ===== IMPOSSIBLE VAULT (41-50) =====

  // Level 41 - Logic
  41: {
    title: 'Berry Ka Ulta',
    question: '"Sabse chhota positive integer jo 60 letters ke neeche define nahi ho sakta."\n\nPar ye definition khud 60 letters se kam hai. Kya hoga?',
    options: {
      a: 'Integer 42 hai',
      b: 'Ye self-referential paradox hai — consistently koi aisa integer exist nahi karta',
      c: 'Definition invalid hai',
      d: 'Language pe depend karta hai',
    },
    hint: 'Kya ek definition wahi cheez define kar sake jo uske hisaab se undefinable hai?',
    explanation: 'Berry\'s Paradox: definition khud se contradict karta hai. Agar aisa integer exist karta hai toh definition use 60 letters ke neeche define kar deti hai, making it definable — claim se contradict. Ye Gödel ki incompleteness se related hai. Heavy stuff bhai! 📖',
  },

  // Level 42 - Pattern
  42: {
    title: 'Collatz Ka Jaal',
    question: 'Koi bhi positive integer le lo. Agar even hai toh 2 se divide. Agar odd hai toh 3 se multiply aur 1 add. Repeat.\n\nHamesha kya hota hai (conjectured par unproven)?',
    options: {
      a: 'Ye 0 pe pahunchna',
      b: 'Ye 1 pe pahunchna (phir cycle 4→2→1)',
      c: 'Ye infinity tak badhta hai',
      d: 'Starting number pe depend karta hai',
    },
    hint: 'Try karo: 6→3→10→5→16→8→4→2→1...',
    explanation: 'Collatz Conjecture: har positive integer eventually 1 pe pahunchna, phir cycles 4→2→1→4... Itna simple lagta hai par mathematicians abhi tak solve nahi kar paaye! Unsolved mystery hai ye! 🌀',
  },

  // Level 43 - Memory
  43: {
    title: 'Calculator Saheb',
    question: 'Ye 8 numbers yaad karo: 7, 3, 9, 1, 5, 8, 2, 6. Ab batao: 3rd aur 7th number ka sum kya hai?',
    options: {
      a: '11',
      b: '10',
      c: '12',
      d: '8',
    },
    hint: '3rd number tha 9, 7th tha 2...',
    explanation: '3rd = 9, 7th = 2. 9 + 2 = 11. Mental math king bhai tu! 🧮',
  },

  // Level 44 - Fake Answer
  44: {
    title: 'Gol Khelne Mein',
    question: 'Kya ek solid sphere ko todke 2 SAME spheres bana sakte ho bhai jo original jitne bade hon?',
    options: {
      a: 'Nahi, volume conservation violate hoti hai',
      b: 'Haan, mathematically (Axiom of Choice se)',
      c: 'Sirf 4+ dimensions mein',
      d: 'Sirf non-measurable sets se',
    },
    hint: 'Ye real mathematical theorem hai. Volume conservation infinite decomposition mein break down ho jaata hai.',
    explanation: 'Banach-Tarski Paradox real theorem hai bhai! Axiom of Choice se sphere ko finitely many pieces mein tod ke do identical copies bana sakte ho. Pieces non-measurable sets hain. Maths mein kuch bhi possible hai! 🪄',
  },

  // Level 45 - Reverse Thinking
  45: {
    title: 'Dimag Ke Andar',
    question: 'Tum prove nahi kar sakte ki tum ek brain nahi ho jo simulated experiences feed ho rahe hain. Ye dekh ke, tum KYA jaan sakte ho for certain?',
    options: {
      a: 'Kuch bhi certain nahi hai',
      b: '"Main sochta hoon, isliye main hoon" — doubt karne ka act doubter ki existence prove karta hai',
      c: 'Physical reality exist karti hai',
      d: 'Dusre minds exist karte hain',
    },
    hint: 'Agar sab kuch simulated hai bhi, toh kuch toh experience kar raha hai...',
    explanation: 'Descartes ka cogito ergo sum: agar sab experience illusion bhi hai, toh tumhare doubt karne ka fact ye prove karta hai ki kuch exist karta hai doubt karne ke liye. "Main sochta hoon, isliye main hoon." Deep hai bhai! 🧘',
  },

  // Level 46 - Logic
  46: {
    title: 'P vs NP',
    question: 'P vs NP poochta hai: kya har problem jiska solution quickly verify ho sakta hai, quickly bhi solve ho sakta hai?\n\nCurrent status kya hai?',
    options: {
      a: 'Proven ki P ≠ NP',
      b: 'Proven ki P = NP',
      c: 'Unsolved hai — 7 Millennium Prize Problems mein se ek ($1M reward)',
      d: 'Proven ki ye undecidable hai',
    },
    hint: 'Ye arguably computer science ka sabse important open question hai.',
    explanation: 'P vs NP abhi tak UNSOLVED hai decades of effort ke baad. Ye Clay Millennium Prize problem hai worth $1,000,000. Most experts believe P ≠ NP par koi proof nahi hai. Ise solve karne wale ko Nobel nahi Fields Medal milega! 💰',
  },

  // Level 47 - Hidden UI
  47: {
    title: 'Sunnata Ka Raaz',
    question: 'Yahan kuch nahi hai. Ya hai? Answer sunnata mein hai.\n\n(Neeche khaali space mein 5 baar click karo reveal karne ke liye.)',
    options: {},
    hint: 'Khaali jagah pe repeatedly click karo text ke neeche.',
    explanation: 'Khaali jagah pe 5 clicks ne hidden truth reveal kar diya! Sunnata mein bhi kuch chhupa hota hai bhai! 🤫',
  },

  // Level 48 - Pattern
  48: {
    title: 'Ramanujan Ki Taxi',
    question: 'Ramanujan ne note kiya ki 1729 sabse chhota number hai jo do alag alag tarikon se cubes ka sum hai.\n\n1729 = ? (dono tarikon se)',
    options: {
      a: '1³+12³ aur 9³+10³',
      b: '7³+8³ aur 5³+12³',
      c: '2³+11³ aur 7³+10³',
      d: '1³+12³ aur 8³+9³',
    },
    hint: 'Check karo: 1+1728=1729 aur 729+1000=1729.',
    explanation: '1729 = 1³ + 12³ = 1 + 1728 = 1729, aur 1729 = 9³ + 10³ = 729 + 1000 = 1729. Taxicab number Ta(2) hai ye! Ramanujan ki genius ko pranaam! 🙏',
  },

  // Level 49 - Fake Answer
  49: {
    title: 'Simpson Ka Ulta',
    question: 'Hospital A ka 90% survival rate hai. Hospital B ka 80%. Par DONO mild aur severe cases ke liye separately, Hospital B better hai.\n\nYe kaise possible hai?',
    options: {
      a: 'Numbers galat hain — ye ho nahi sakta',
      b: 'Simpson\'s Paradox — alag case distributions aggregate conclusions reverse kar sakti hain',
      c: 'Hospital A apne statistics pe cheat karta hai',
      d: 'Ye sirf small samples mein hota hai',
    },
    hint: 'Weighted averages aur case mix socho overall rates ko kaise affect karta hai.',
    explanation: "Simpson's Paradox: A mostly mild cases treat karta hai (high survival), B mostly severe (lower survival). B actually har category mein better hai, par aggregate different case distributions ki wajah se reverse ho jaata hai. Statistics mein sab kuch isn't as it seems! 📊",
  },

  // Level 50 - Reverse Thinking
  50: {
    title: 'Antim Sawal',
    question: 'Tum Level 50 pe pohoch gaye — Vault ka sabse gehra raaz.\n\nAgar is game mein sab kuch tumhe trick karne ke liye design tha, toh KYA YE SAWAL bhi ek trick hai?\n\nWo answer choose karo jo prove kare ki tumne sach mein samajh liya:',
    options: {
      a: 'Har puzzle ek trick thi — ye bhi',
      b: 'Asli puzzle tha sab kuch question karne ki seekhna, khud ko bhi',
      c: 'Koi right answer nahi hai',
      d: '42',
    },
    hint: 'Sab kuch dekho tune seekha... Game sach mein kya sikha raha tha?',
    explanation: 'Zyada socho. Zyada tez fail karo. Naa mumkin ko solve karo.\n\nAsli vault thi wo skills jo tumne raaste mein unlock ki thi. 🧠',
  },
};
