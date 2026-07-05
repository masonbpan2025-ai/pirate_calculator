import React, { useState, useEffect } from 'react';

const App = () => {
  const [phase, setPhase] = useState('home'); // 'home' | 'word_problem' | 'calculating' | 'summary'
  const [mode, setMode] = useState('addition'); // 'addition' or 'subtraction'
  const [problemText, setProblemText] = useState("");
  const [problem, setProblem] = useState({ top: 0, bottom: 0 });
  const [step, setStep] = useState('start');
  const [feedback, setFeedback] = useState("");

  // Session Config States
  const [problemCountSetting, setProblemCountSetting] = useState(3);
  const [modeSetting, setModeSetting] = useState('both'); // 'addition' | 'subtraction' | 'both'
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [firstAttempts, setFirstAttempts] = useState({ ones: null, tens: null, hundreds: null });
  const [customEquationInput, setCustomEquationInput] = useState("");
  const [isCustomSession, setIsCustomSession] = useState(false);

  // State for Addition
  const [carryOnes, setCarryOnes] = useState(0);
  const [carryTens, setCarryTens] = useState(0);
  const [onesAnswer, setOnesAnswer] = useState(0);
  const [tensAnswer, setTensAnswer] = useState(0);
  const [hundredsAnswer, setHundredsAnswer] = useState(0);

  // State for Subtraction
  const [currentHundreds, setCurrentHundreds] = useState(0);
  const [currentTens, setCurrentTens] = useState(0);
  const [currentOnes, setCurrentOnes] = useState(0);
  const [onesRemoved, setOnesRemoved] = useState(0);
  const [tensRemoved, setTensRemoved] = useState(0);
  const [hundredsRemoved, setHundredsRemoved] = useState(0);

  // User input final answer check
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [columnAnswerInput, setColumnAnswerInput] = useState("");
  const [onesVerified, setOnesVerified] = useState(false);
  const [tensVerified, setTensVerified] = useState(false);
  const [hundredsVerified, setHundredsVerified] = useState(false);

  // Problem Generator (Word Problems & Numbers)
  const generateProblem = (customObj = null) => {
    setUserAnswer("");
    setIsAnswerCorrect(false);
    setColumnAnswerInput("");
    setOnesVerified(false);
    setTensVerified(false);
    setHundredsVerified(false);
    setFirstAttempts({ ones: null, tens: null, hundreds: null });

    let isAddition = true;
    let top, bottom;

    if (customObj) {
      isAddition = customObj.customOp === 'addition';
      top = customObj.customTop;
      bottom = customObj.customBottom;
    } else {
      if (modeSetting === 'addition') {
        isAddition = true;
      } else if (modeSetting === 'subtraction') {
        isAddition = false;
      } else {
        isAddition = Math.random() > 0.5;
      }
    }
    setMode(isAddition ? 'addition' : 'subtraction');

    if (isAddition) {
      let h1, h2, t1, t2, o1, o2;
      if (customObj) {
        h1 = Math.floor(top / 100);
        t1 = Math.floor(top / 10) % 10;
        o1 = top % 10;
        h2 = Math.floor(bottom / 100);
        t2 = Math.floor(bottom / 10) % 10;
        o2 = bottom % 10;
      } else {
        h1 = Math.floor(Math.random() * 3) + 1;
        h2 = Math.floor(Math.random() * 3) + 1;
        t1 = Math.floor(Math.random() * 9) + 1;
        t2 = Math.floor(Math.random() * 9) + 1;
        o1 = Math.floor(Math.random() * 9) + 1;
        o2 = Math.floor(Math.random() * 9) + 1;
        top = h1 * 100 + t1 * 10 + o1;
        bottom = h2 * 100 + t2 * 10 + o2;
      }
      setProblem({ top, bottom });

      const addTemplates = [
        // Category 1: Part-Part-Whole
        `There are ${top} gold piles in the Captain's cabin and ${bottom} gold piles in the cargo hold. How many gold piles are there on the ship in total?`,
        `The ship's armory holds ${top} iron cannonballs and ${bottom} brass cannonballs. What is the total number of cannonballs?`,
        `Captain Hook has ${top} gold rings and ${bottom} silver necklaces in his chest. How many pieces of jewelry does he have altogether?`,
        
        // Category 2: Add-To / Change Plus
        `First mate Jack has ${top} gold coins in his pouch. The Captain rewards him with ${bottom} more gold coins for his loyalty. How many coins does Jack have now?`,
        `Your pirate crew looted ${top} gold coins from a Spanish galleon, and later found ${bottom} gold coins buried in the sand. What is your total loot?`,
        `The crew caught ${top} fish in the morning and ${bottom} fish in the afternoon. How many fish did the crew catch in total?`,
        
        // Category 3: Joining Sets
        `A pirate island has ${top} green parrots and ${bottom} red parrots. How many parrots live on the island in total?`,
        `There are ${top} veteran sailors and ${bottom} new recruits aboard the Black Pearl. How many sailors are on the ship?`,
        `A merchant ship has ${top} barrels of rum and ${bottom} barrels of water. How many barrels are on the merchant ship in total?`,
        
        // Category 4: Island Collections
        `The crew collected ${top} coconuts from the north beach and ${bottom} coconuts from the south beach. How many coconuts did they collect in total?`,
        `Our scouts spotted ${top} crab holes on the first island and ${bottom} crab holes on the second island. How many crab holes did they count altogether?`
      ];
      if (customObj) {
        setProblemText(`Solve this custom loot equation: ${top} + ${bottom}`);
      } else {
        setProblemText(addTemplates[Math.floor(Math.random() * addTemplates.length)]);
      }

      setStep('combine_ones');
      setCarryOnes(0);
      setCarryTens(0);
      setOnesAnswer(0);
      setTensAnswer(0);
      setHundredsAnswer(0);
      setFeedback("Step 1: Start with the loose coins! Click 'Combine Coins'.");
    } else {
      let h1, h2, t1, t2, o1, o2;
      if (customObj) {
        h1 = Math.floor(top / 100);
        t1 = Math.floor(top / 10) % 10;
        o1 = top % 10;
        h2 = Math.floor(bottom / 100);
        t2 = Math.floor(bottom / 10) % 10;
        o2 = bottom % 10;
      } else {
        let type = Math.random();
        h1 = Math.floor(Math.random() * 5) + 4;
        h2 = Math.floor(Math.random() * (h1 - 1)) + 1;

        if (type < 0.2) {
          // No borrows
          t1 = Math.floor(Math.random() * 5) + 4;
          t2 = Math.floor(Math.random() * (t1 - 1)) + 1;
          o1 = Math.floor(Math.random() * 5) + 4;
          o2 = Math.floor(Math.random() * (o1 - 1)) + 1;
        } else if (type < 0.45) {
          // Double borrow
          o1 = Math.floor(Math.random() * 4);
          o2 = Math.floor(Math.random() * (9 - o1)) + o1 + 1;
          t1 = Math.floor(Math.random() * 4) + 1;
          t2 = Math.floor(Math.random() * (9 - t1)) + t1 + 1;
        } else if (type < 0.7) {
          // Skip borrow
          t1 = 0;
          t2 = Math.floor(Math.random() * 8) + 1;
          o1 = Math.floor(Math.random() * 4);
          o2 = Math.floor(Math.random() * (9 - o1)) + o1 + 1;
        } else {
          // Single borrow (ones only)
          t1 = Math.floor(Math.random() * 5) + 4;
          t2 = Math.floor(Math.random() * (t1 - 1)) + 1;
          o1 = Math.floor(Math.random() * 4);
          o2 = Math.floor(Math.random() * (9 - o1)) + o1 + 1;
        }
        top = h1 * 100 + t1 * 10 + o1;
        bottom = h2 * 100 + t2 * 10 + o2;
      }
      setProblem({ top, bottom });

      const subTemplates = [
        // Category 1: Take-From (Spend / Lose / Use)
        `Blackbeard had ${top} gold coins, but he spent ${bottom} gold coins at the pirate port to buy food. How many gold coins does he have left?`,
        `You dug up a chest with ${top} gold coins, but a sneaky monkey stole ${bottom} of them! How many gold coins remain?`,
        `The ship's carpenter had ${top} wooden planks. He used ${bottom} planks to repair a hole in the hull. How many planks does he have left?`,
        `The cook baked ${top} sea biscuits for the long voyage. The hungry crew ate ${bottom} of them on the first night. How many biscuits are left?`,
        `A pirate merchant had ${top} silk sheets for sale. A wealthy captain bought ${bottom} of them. How many sheets are left?`,

        // Category 2: Compare (How many more / fewer / larger)
        `Captain Redbeard has ${top} gold coins. Captain Bluebeard has ${bottom} gold coins. How many more gold coins does Redbeard have than Bluebeard?`,
        `The Black Pearl has ${top} cannons on the port side. The Jolly Roger has ${bottom} cannons. How many fewer cannons does the Jolly Roger have than the Black Pearl?`,
        `We sailed ${top} miles yesterday and only ${bottom} miles today. How many more miles did we travel yesterday than today?`,
        `A giant treasure chest weighs ${top} pounds. A smaller chest weighs ${bottom} pounds. How many more pounds does the giant chest weigh?`,

        // Category 3: Part-Part-Whole (Find missing part)
        `Out of ${top} treasure chests found on the beach, ${bottom} chests contain gold coins and the rest contain silver cups. How many chests contain silver cups?`,
        `A crew has ${top} pirates. If ${bottom} of them are wearing red bandanas and the rest are wearing blue bandanas, how many pirates are wearing blue bandanas?`,
        `There are ${top} palm trees on Tortuga island. If ${bottom} trees have coconuts and the remaining trees do not, how many palm trees have no coconuts?`,

        // Category 4: Missing Addend (How many more needed)
        `We need ${top} gold piles to buy a new pirate flag. We have already gathered ${bottom} piles. How many more piles of gold do we need to collect?`,
        `The ship's ammunition rack can hold ${top} cannonballs. Currently, there are only ${bottom} cannonballs on the rack. How many empty spaces are left?`
      ];
      if (customObj) {
        setProblemText(`Solve this custom loot equation: ${top} - ${bottom}`);
      } else {
        setProblemText(subTemplates[Math.floor(Math.random() * subTemplates.length)]);
      }

      setCurrentHundreds(h1);
      setCurrentTens(t1);
      setCurrentOnes(o1);
      setOnesRemoved(0);
      setTensRemoved(0);
      setHundredsRemoved(0);
      setStep('eval_borrow_ones');
      setFeedback(`Step 1: Look at the loose coins. We need to pay ${o2}, and we have ${o1}. Do we need to break a Gold Bar?`);
    }
    setPhase('word_problem');
  };

  useEffect(() => {
    // Start at home screen by default
    setPhase('home');
  }, []);

  const startSession = () => {
    setSessionHistory([]);
    setCurrentProblemIndex(0);
    setIsCustomSession(false);
    // Since state setters are asynchronous, we pass the current state configuration directly to initialize the first problem
    generateProblem();
  };

  const handleNextProblem = () => {
    const correctO = mode === 'addition' ? (onesAnswer % 10) : (currentOnes - (problem.bottom % 10));
    const correctT = mode === 'addition' ? (tensAnswer % 10) : (currentTens - (Math.floor(problem.bottom / 10) % 10));
    const correctH = mode === 'addition' ? hundredsAnswer : (currentHundreds - Math.floor(problem.bottom / 100));

    const userO = firstAttempts.ones !== null ? firstAttempts.ones : correctO;
    const userT = firstAttempts.tens !== null ? firstAttempts.tens : correctT;
    const userH = firstAttempts.hundreds !== null ? firstAttempts.hundreds : correctH;

    const userVal = userH * 100 + userT * 10 + userO;
    const correctVal = correctH * 100 + correctT * 10 + correctO;
    const isCorrect = userVal === correctVal;

    const record = {
      top: problem.top,
      bottom: problem.bottom,
      mode: mode,
      correctAnswer: correctVal,
      userAnswer: userVal,
      isCorrect: isCorrect
    };

    setSessionHistory(prev => [...prev, record]);

    if (!isCustomSession && (currentProblemIndex + 1 < problemCountSetting)) {
      setCurrentProblemIndex(prev => prev + 1);
      generateProblem();
    } else {
      setPhase('summary');
    }
  };

  const handleVerifyOnesDigit = (digit) => {
    const correctDigit = mode === 'addition' ? (onesAnswer % 10) : (currentOnes - (problem.bottom % 10));
    setFirstAttempts(prev => {
      if (prev.ones === null) {
        return { ...prev, ones: digit };
      }
      return prev;
    });
    if (digit === correctDigit) {
      setOnesVerified(true);
      setFeedback(mode === 'addition' ? "Correct! Let's combine the Gold Bars next." : "Correct! Let's check the Gold Bars column next.");
      setStep(mode === 'addition' ? 'combine_tens' : 'eval_borrow_tens');
    } else {
      alert("Avast! Count the loose coins carefully and try again.");
    }
  };

  const handleVerifyTensDigit = (digit) => {
    const correctDigit = mode === 'addition' ? (tensAnswer % 10) : (currentTens - (Math.floor(problem.bottom / 10) % 10));
    setFirstAttempts(prev => {
      if (prev.tens === null) {
        return { ...prev, tens: digit };
      }
      return prev;
    });
    if (digit === correctDigit) {
      setTensVerified(true);
      if (mode === 'addition') {
        setFeedback("Correct! Let's combine the Gold Piles next.");
        setStep('combine_hundreds');
      } else {
        setFeedback("Correct! Let's check the Gold Piles next.");
        let targetH = Math.floor(problem.bottom / 100);
        if (targetH > 0) {
          setStep('remove_hundreds');
        } else {
          setStep('input_hundreds_answer');
        }
      }
    } else {
      alert("Avast! Count the gold bars carefully and try again.");
    }
  };

  const handleVerifyHundredsDigit = (digit) => {
    const correctDigit = mode === 'addition' ? hundredsAnswer : (currentHundreds - Math.floor(problem.bottom / 100));
    setFirstAttempts(prev => {
      if (prev.hundreds === null) {
        return { ...prev, hundreds: digit };
      }
      return prev;
    });
    if (digit === correctDigit) {
      setHundredsVerified(true);
      setFeedback("Shiver me timbers! You calculated the total loot correctly!");
      setStep('done');
    } else {
      alert("Avast! Count the gold piles carefully and try again.");
    }
  };

  const handleGuessOperation = (guessedMode) => {
    if (guessedMode === mode) {
      setPhase('calculating');
    } else {
      alert(mode === 'addition' ?
        "Avast! We are finding the total amount, which means we need to PUT THEM TOGETHER (Addition)!" :
        "Avast! We are trying to find out what's left or finding a missing part, which means we TAKE AWAY (Subtraction)!");
    }
  };


  // ================= ADDITION LOGIC =================
  const handleCombineOnes = () => {
    let sum = (problem.top % 10) + (problem.bottom % 10);
    setOnesAnswer(sum);
    setStep('eval_carry_ones');
    setFeedback(`We have ${sum} loose coins now. Do we need to melt 10 coins into a Gold Bar?`);
  };

  const handleEvalCarryOnes = (needsCarry) => {
    if (needsCarry && onesAnswer >= 10) {
      setStep('regroup_ones');
      setFeedback("Aye! We have 10 or more. Click 'Melt 10 Coins into a Bar'!");
    } else if (!needsCarry && onesAnswer < 10) {
      setStep('input_ones_answer');
      setFeedback("Loose coins combined! Count the coins and type the ones answer.");
    } else {
      setFeedback("Are ye sure? Count the loose coins! If it's 10 or more, we MUST melt them!");
    }
  };

  const handleRegroupOnes = () => {
    setOnesAnswer(prev => prev - 10);
    setCarryOnes(1);
    setStep('input_ones_answer');
    setFeedback("Arr, we forged a Gold Bar! Count the remaining coins and type the ones answer.");
  };

  const handleCombineTens = () => {
    let sum = (Math.floor(problem.top / 10) % 10) + (Math.floor(problem.bottom / 10) % 10) + carryOnes;
    setTensAnswer(sum);
    setStep('eval_carry_tens');
    setFeedback(`We have ${sum} Gold Bars now. Do we need to stack 10 Bars into a big Pile?`);
  };

  const handleEvalCarryTens = (needsCarry) => {
    if (needsCarry && tensAnswer >= 10) {
      setStep('regroup_tens');
      setFeedback("Aye! We have 10 or more bars. Click 'Stack 10 Bars into a Pile'!");
    } else if (!needsCarry && tensAnswer < 10) {
      setStep('input_tens_answer');
      setFeedback("Gold Bars combined! Count the bars and type the tens answer.");
    } else {
      setFeedback("Are ye sure? Count the bars again! If it's 10 or more, we MUST stack them!");
    }
  };

  const handleRegroupTens = () => {
    setTensAnswer(prev => prev - 10);
    setCarryTens(1);
    setStep('input_tens_answer');
    setFeedback("We stacked a Gold Pile! Count the remaining bars and type the tens answer.");
  };

  const handleCombineHundreds = () => {
    setHundredsAnswer(Math.floor(problem.top / 100) + Math.floor(problem.bottom / 100) + carryTens);
    setStep('input_hundreds_answer');
    setFeedback("Gold Piles combined! Count the piles and type the hundreds answer.");
  };


  // ================= SUBTRACTION LOGIC =================
  const handleEvalBorrowOnes = (answer) => {
    let targetO = problem.bottom % 10;
    if (answer === 'yes' && currentOnes < targetO) {
      setStep('ask_source_for_ones');
      setFeedback("Aye. We don't have enough loose coins. What should we break to get more?");
    } else if (answer === 'no' && currentOnes >= targetO) {
      if (targetO > 0) {
        setStep('remove_ones');
        setFeedback(`Aye, we have enough! Click ${targetO} coins to hand them over.`);
      } else {
        setStep('input_ones_answer');
        setFeedback("No coins to pay! Count the loose coins and type the ones answer.");
      }
    } else {
      setFeedback(`Look closely! We have ${currentOnes} coins, but need to pay ${targetO}. Think again!`);
    }
  };

  const handleAskSourceForOnes = (source) => {
    if (source === 'ten') {
      if (currentTens > 0) {
        setCurrentTens(prev => prev - 1);
        setCurrentOnes(prev => prev + 10);
        setStep('remove_ones');
        let targetO = problem.bottom % 10;
        setFeedback(`Great! We broke a Gold Bar into 10 loose coins. Click ${targetO} coins to hand them over.`);
      } else {
        setFeedback("Look at the Gold Bars. We have 0! We can't break what we don't have.");
      }
    } else if (source === 'hundred') {
      if (currentTens === 0) {
        setCurrentHundreds(prev => prev - 1);
        setCurrentTens(prev => prev + 10);
        setStep('ask_source_for_ones');
        setFeedback("Awesome! We broke a Gold Pile into 10 Gold Bars. Click a Gold Bar to break it into 10 loose coins.");
      } else {
        setFeedback("Wait, we have Gold Bars right there! Always break the smaller treasure first.");
      }
    }
  };

  const handleEvalBorrowTens = (answer) => {
    let targetT = Math.floor(problem.bottom / 10) % 10;
    if (answer === 'yes' && currentTens < targetT) {
      setStep('ask_source_for_tens');
      setFeedback("Aye. We don't have enough bars. What should we break to get more?");
    } else if (answer === 'no' && currentTens >= targetT) {
      if (targetT > 0) {
         setStep('remove_tens');
         setFeedback(`Aye! Click ${targetT} Gold Bars to hand them over.`);
      } else {
         setStep('input_tens_answer');
         setFeedback("No bars to pay! Count the bars and type the tens answer.");
      }
    } else {
      setFeedback(`Look closely! We have ${currentTens} bars, but need to pay ${targetT}. Think again!`);
    }
  };

  const handleAskSourceForTens = (source) => {
    if (source === 'hundred') {
       setCurrentHundreds(prev => prev - 1);
       setCurrentTens(prev => prev + 10);
       setStep('remove_tens');
       let targetT = Math.floor(problem.bottom / 10) % 10;
       setFeedback(`Great! We broke a Gold Pile into 10 Gold Bars. Click ${targetT} Gold Bars to hand them over.`);
    } else {
       setFeedback("We need BARS! Breaking a Bar gives us loose coins. We must break a Pile.");
    }
  };



  const handleRemoveOne = () => {
    if (step === 'remove_ones') {
      let targetO = problem.bottom % 10;
      setOnesRemoved(targetO);
      setStep('input_ones_answer');
      setFeedback("Loose coins paid! Count the remaining coins and type the ones answer.");
    }
  };

  const handleRemoveTen = () => {
    if (step === 'remove_tens') {
      let targetT = Math.floor(problem.bottom / 10) % 10;
      setTensRemoved(targetT);
      setStep('input_tens_answer');
      setFeedback("Gold Bars paid! Count the remaining bars and type the tens answer.");
    }
  };

  const handleRemoveHundred = () => {
    if (step === 'remove_hundreds') {
      let targetH = Math.floor(problem.bottom / 100);
      setHundredsRemoved(targetH);
      setStep('input_hundreds_answer');
      setFeedback("Gold Piles paid! Count the remaining piles and type the hundreds answer.");
    }
  };


  // ================= RENDERERS =================

  // Home Screen Phase
  if (phase === 'home') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-serif">
        <div className="max-w-2xl w-full bg-[#f4e4bc] p-6 md:p-8 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.6)] border-4 border-[#8b5a2b] relative">
          <div className="absolute top-2 left-2 text-xl select-none">⚓</div>
          <div className="absolute top-2 right-2 text-xl select-none">⚓</div>
          <div className="absolute bottom-2 left-2 text-xl select-none">☠️</div>
          <div className="absolute bottom-2 right-2 text-xl select-none">☠️</div>

          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#4a3b2c] mb-6 uppercase tracking-widest border-b-2 border-[#8b5a2b]/30 pb-3">
            🏴‍☠️ Pirate's Loot Calculator 🏴‍☠️
          </h1>
          <p className="text-lg text-[#3a2a1a] mb-8 leading-relaxed text-center italic">
            "Ahoy, matey! Set yer sail and choose yer treasure settings before starting yer math adventure!"
          </p>

          <div className="flex flex-col gap-6 max-w-md mx-auto">
            {/* Setting 1: Number of problems */}
            <div className="flex flex-col gap-2.5">
              <label className="font-bold text-[#4a3b2c] text-center md:text-left">Number of Problems:</label>
              <div className="flex gap-2 justify-center md:justify-start">
                {[3, 5, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => setProblemCountSetting(n)}
                    className={`flex-1 py-2 rounded font-bold border-2 transition-all active:scale-95 ${
                      problemCountSetting === n
                        ? 'bg-[#d49a2a] text-[#f4e4bc] border-[#8b5a1b] shadow-md'
                        : 'bg-[#e3d1a5] hover:bg-[#d8c393] text-[#4a3b2c] border-[#8b5a2b]/50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={problemCountSetting}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > 0) setProblemCountSetting(val);
                    }}
                    className="w-full py-2 text-center border-2 border-[#8b5a2b] bg-[#fbf6e8] rounded font-mono font-bold text-[#4a3b2c]"
                    placeholder="Custom"
                  />
                </div>
              </div>
            </div>

            {/* Setting 2: Mode of problems */}
            <div className="flex flex-col gap-2.5">
              <label className="font-bold text-[#4a3b2c] text-center md:text-left">Problem Type:</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setModeSetting('addition')}
                  className={`flex-1 py-2.5 rounded font-bold border-2 transition-all active:scale-95 ${
                    modeSetting === 'addition'
                      ? 'bg-[#2b5a3b] text-[#f4e4bc] border-[#1a3a1b] shadow-md'
                      : 'bg-[#e3d1a5] hover:bg-[#d8c393] text-[#4a3b2c] border-[#8b5a2b]/50'
                  }`}
                >
                  Addition (+)
                </button>
                <button
                  onClick={() => setModeSetting('subtraction')}
                  className={`flex-1 py-2.5 rounded font-bold border-2 transition-all active:scale-95 ${
                    modeSetting === 'subtraction'
                      ? 'bg-[#8b2b2b] text-[#f4e4bc] border-[#4a0b0b] shadow-md'
                      : 'bg-[#e3d1a5] hover:bg-[#d8c393] text-[#4a3b2c] border-[#8b5a2b]/50'
                  }`}
                >
                  Subtraction (-)
                </button>
                <button
                  onClick={() => setModeSetting('both')}
                  className={`flex-1 py-2.5 rounded font-bold border-2 transition-all active:scale-95 ${
                    modeSetting === 'both'
                      ? 'bg-[#4a5a6a] text-[#f4e4bc] border-[#1a2a3a] shadow-md'
                      : 'bg-[#e3d1a5] hover:bg-[#d8c393] text-[#4a3b2c] border-[#8b5a2b]/50'
                  }`}
                >
                  Mixed (+ & -)
                </button>
              </div>
            </div>

            {/* Setting 3: Custom Equation */}
            <div className="flex flex-col gap-2.5 border-t border-dashed border-[#8b5a2b]/30 pt-4">
              <label className="font-bold text-[#4a3b2c] text-center md:text-left">Or Enter Custom Equation:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customEquationInput}
                  onChange={(e) => setCustomEquationInput(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-[#8b5a2b] bg-[#fbf6e8] rounded text-[#4a3b2c] placeholder-[#8b5a2b]/60 font-mono text-center md:text-left text-sm"
                  placeholder="e.g., 234 + 189 or 432 - 128"
                />
                <button
                  onClick={() => {
                    const match = customEquationInput.match(/^\s*(\d+)\s*([\+\-])\s*(\d+)\s*$/);
                    if (!match) {
                      alert("Avast! Please enter a valid equation like '234 + 189' or '432 - 128'!");
                      return;
                    }
                    const top = parseInt(match[1]);
                    const opChar = match[2];
                    const bottom = parseInt(match[3]);
                    const op = opChar === '+' ? 'addition' : 'subtraction';

                    if (top >= 1000 || bottom >= 1000) {
                      alert("Avast! Numbers must be 3 digits or less (less than 1000)!");
                      return;
                    }

                    if (op === 'subtraction' && top < bottom) {
                      alert("Avast! For subtraction, the first number must be greater than or equal to the second!");
                      return;
                    }

                    // Start custom adventure!
                    setSessionHistory([]);
                    setCurrentProblemIndex(0);
                    setProblemCountSetting(1);
                    setIsCustomSession(true);
                    generateProblem({ customTop: top, customBottom: bottom, customOp: op });
                  }}
                  className="bg-[#d49a2a] hover:bg-[#b47a0a] border-2 border-[#8b5a1b] text-[#f4e4bc] px-4 py-2 rounded font-bold transition-all active:scale-95 text-sm shrink-0"
                >
                  Illustrate!
                </button>
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={startSession}
              className="mt-4 w-full py-4 bg-[#2b5a3b] hover:bg-[#1a4a2b] text-[#f4e4bc] font-bold rounded-lg text-xl shadow-lg border-2 border-[#1a3a1b] transition-transform active:scale-95 uppercase tracking-widest animate-bounce"
            >
              Start Adventure!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Summary Screen Phase
  if (phase === 'summary') {
    const score = sessionHistory.filter(r => r.isCorrect).length;
    const total = sessionHistory.length;

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-serif">
        <div className="max-w-3xl w-full bg-[#f4e4bc] p-6 md:p-8 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.6)] border-4 border-[#8b5a2b] flex flex-col h-[90vh] md:h-[550px]">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-[#4a3b2c] mb-2 uppercase tracking-widest">
            📜 Captain's Report Sheet 📜
          </h1>
          
          {/* Score Medal Badge */}
          <div className="bg-[#e3d1a5] border-2 border-[#8b5a2b] p-3 rounded text-center mb-4">
            <p className="text-xl md:text-2xl font-bold text-[#4a3b2c]">
              Ye scored <span className="text-emerald-700 font-extrabold">{score}</span> out of <span className="font-bold">{total}</span> correct!
            </p>
            <p className="text-sm text-[#8b5a2b] mt-1 font-sans">
              {score === total ? "Shiver me timbers! A flawless hoard of loot!" : "Good effort, matey! Try again to earn all the gold!"}
            </p>
          </div>

          {/* List of problems with scrollbar */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 mb-4">
            {sessionHistory.map((record, index) => (
              <div 
                key={index} 
                className={`p-3 rounded border-2 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-[#fbf6e8] ${
                  record.isCorrect ? 'border-emerald-600/50' : 'border-rose-600/50'
                }`}
              >
                <div>
                  <span className="font-bold text-[#8b5a2b] mr-2">Problem #{index + 1}:</span>
                  <span className="font-mono text-lg text-[#3a2a1a]">
                    {record.top} {record.mode === 'addition' ? '+' : '-'} {record.bottom}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {record.isCorrect ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-400 text-sm font-sans">
                      ✓ Correct ({record.correctAnswer})
                    </span>
                  ) : (
                    <div className="text-rose-700 font-bold flex flex-col md:flex-row md:items-center gap-1.5 text-xs bg-rose-50 px-2 py-1 rounded border border-rose-300 font-sans">
                      <span className="flex items-center gap-0.5">✗ Incorrect</span>
                      <span className="text-[10px] text-rose-600 font-normal">
                        (Your answer: <span className="line-through">{record.userAnswer}</span> | Right: {record.correctAnswer})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-center mt-auto">
            <button
              onClick={() => setPhase('home')}
              className="px-8 py-3 bg-[#d49a2a] hover:bg-[#b47a0a] border-2 border-[#8b5a1b] text-[#f4e4bc] font-bold rounded-lg text-lg transition-transform active:scale-95 shadow-md uppercase tracking-wider font-serif"
            >
              ⚓ Back to Dock (Restart)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'word_problem') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-serif">
        <div className="max-w-xl w-full bg-[#f4e4bc] p-6 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-[#8b5a2b] relative">
           <h1 className="text-2xl md:text-3xl font-bold text-center text-[#4a3b2c] mb-4 uppercase tracking-widest">Captain's Log</h1>
           <p className="text-lg md:text-xl text-[#3a2a1a] mb-6 leading-relaxed text-center">
             "{problemText}"
           </p>
           <div className="flex flex-col gap-3">
             <p className="text-center font-bold text-base text-[#8b5a2b]">How do we solve this, matey?</p>
             <div className="flex justify-center gap-4">
                <button onClick={() => handleGuessOperation('addition')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-lg shadow-md border-2 border-emerald-900 transition-transform active:scale-95">
                  ADD the Loot (+)
                </button>
                <button onClick={() => handleGuessOperation('subtraction')} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-lg shadow-md border-2 border-rose-900 transition-transform active:scale-95">
                  SUBTRACT the Loot (-)
                </button>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // Calculator Phase
  const topH = Math.floor(problem.top / 100);
  const topT = Math.floor(problem.top / 10) % 10;
  const topO = problem.top % 10;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 p-4 font-sans flex flex-col items-center justify-center">

      {/* Header */}
      <div className="w-full max-w-5xl bg-[#f4e4bc] p-3 rounded shadow-md border-2 border-[#8b5a2b] mb-3 flex justify-between items-center font-serif">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#4a3b2c]">Pirate's Loot Calculator</h1>
          <p className="text-xs md:text-sm text-[#8b5a2b] hidden sm:block">Count yer gold, watch yer carries and borrows!</p>
        </div>
        <div className="text-sm md:text-base font-bold text-[#4a3b2c] bg-[#e3d1a5] px-3 py-1 rounded border border-[#8b5a2b] flex gap-3 uppercase font-sans">
          <span>Problem {currentProblemIndex + 1} of {problemCountSetting}</span>
          <span>|</span>
          <span>{mode === 'addition' ? 'Addition (+)' : 'Subtraction (-)'}</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 items-stretch">

        {/* Left Panel: Vertical Math Problem */}
        <div className="bg-[#f4e4bc] p-4 rounded shadow-md border-2 border-[#8b5a2b] flex flex-col items-center justify-center w-full md:w-56 shrink-0">
          <div className="text-4xl font-mono text-right relative select-none w-full pr-4 text-[#3a2a1a]">

            {/* Addition Problem Setup */}
            {mode === 'addition' && (
              <>
                <div className="flex justify-end gap-1 text-xl text-emerald-700 font-bold mb-1 h-6">
                  <div className="w-8 text-center">{carryTens > 0 ? '+1' : ''}</div>
                  <div className="w-8 text-center">{carryOnes > 0 ? '+1' : ''}</div>
                  <div className="w-8 text-center"></div>
                </div>
                <div className="flex justify-end gap-1 mb-1 tracking-wider relative">
                  <span className="w-8 text-center">{topH}</span>
                  <span className="w-8 text-center">{topT}</span>
                  <span className="w-8 text-center">{topO}</span>
                </div>
                <div className="flex justify-end gap-1 border-b-2 border-[#4a3b2c] pb-2 mb-2 relative tracking-wider">
                  <span className="absolute left-[-12px] top-0 text-xl">+</span>
                  <span className="w-8 text-center">{Math.floor(problem.bottom / 100)}</span>
                  <span className="w-8 text-center">{Math.floor(problem.bottom / 10) % 10}</span>
                  <span className="w-8 text-center">{problem.bottom % 10}</span>
                </div>
                 <div className="flex justify-end gap-1 text-emerald-700 font-bold h-10 tracking-wider">
                   <span className="w-8 text-center">{hundredsVerified ? hundredsAnswer : (['combine_hundreds', 'input_hundreds_answer'].includes(step) ? '?' : '')}</span>
                   <span className="w-8 text-center">{tensVerified ? (tensAnswer % 10) : (['combine_tens', 'input_tens_answer'].includes(step) ? '?' : '')}</span>
                   <span className="w-8 text-center">{onesVerified ? (onesAnswer % 10) : (['combine_ones', 'input_ones_answer'].includes(step) ? '?' : '')}</span>
                 </div>
               </>
             )}

             {/* Subtraction Problem Setup */}
             {mode === 'subtraction' && (
               <div className="flex flex-col gap-3 w-full">
                 {/* Simple Notation Subtraction */}
                 <div className="flex flex-col items-center">
                   <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 w-full text-center tracking-wider font-sans">
                     Simple Notation
                   </div>
                   <div className="text-3xl font-mono text-right w-full relative">
                     <div className="flex justify-end gap-1 text-rose-700 font-bold mb-1 h-6 text-lg">
                       <div className="w-8 text-center">{currentHundreds < topH ? '1' : ''}</div>
                       <div className="w-8 text-center">{currentOnes > topO ? '1' : ''}</div>
                       <div className="w-8 text-center"></div>
                     </div>
                     <div className="flex justify-end gap-1 mb-1 tracking-wider">
                       <span className="w-8 text-center">{topH}</span>
                       <span className="w-8 text-center">{topT}</span>
                       <span className="w-8 text-center">{topO}</span>
                     </div>
                     <div className="flex justify-end gap-1 border-b-2 border-[#4a3b2c] pb-2 mb-2 relative tracking-wider">
                       <span className="absolute left-[-12px] top-0 text-xl">-</span>
                       <span className="w-8 text-center">{Math.floor(problem.bottom / 100)}</span>
                       <span className="w-8 text-center">{Math.floor(problem.bottom / 10) % 10}</span>
                       <span className="w-8 text-center">{problem.bottom % 10}</span>
                     </div>
                     <div className="flex justify-end gap-1 text-rose-700 font-bold h-10 tracking-wider">
                       <span className="w-8 text-center">{hundredsVerified ? (currentHundreds - Math.floor(problem.bottom / 100)) : (['remove_hundreds', 'input_hundreds_answer'].includes(step) ? '?' : '')}</span>
                       <span className="w-8 text-center">{tensVerified ? (currentTens - (Math.floor(problem.bottom / 10) % 10)) : (['remove_tens', 'input_tens_answer'].includes(step) ? '?' : '')}</span>
                       <span className="w-8 text-center">{onesVerified ? (currentOnes - (problem.bottom % 10)) : (['remove_ones', 'input_ones_answer'].includes(step) ? '?' : '')}</span>
                     </div>
                   </div>
                 </div>

                 {/* Separator line */}
                 <div className="border-t border-dashed border-[#8b5a2b]/30 w-full"></div>

                 {/* Standard Notation Subtraction */}
                 <div className="flex flex-col items-center">
                   <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 w-full text-center tracking-wider font-sans">
                     Standard Notation
                   </div>
                   <div className="text-3xl font-mono text-right w-full relative">
                     <div className="flex justify-end gap-1 text-lg text-rose-700 font-bold mb-1 h-6">
                       <div className="w-8 text-center">{currentHundreds !== topH ? currentHundreds : ''}</div>
                       <div className="w-8 text-center">{currentTens !== topT ? currentTens : ''}</div>
                       <div className="w-8 text-center">{currentOnes !== topO ? currentOnes : ''}</div>
                     </div>
                     <div className="flex justify-end gap-1 mb-1 tracking-wider relative">
                       <span className={`w-8 text-center ${currentHundreds !== topH ? "line-through text-slate-500 opacity-50" : ""}`}>{topH}</span>
                       <span className={`w-8 text-center ${currentTens !== topT ? "line-through text-slate-500 opacity-50" : ""}`}>{topT}</span>
                       <span className={`w-8 text-center ${currentOnes !== topO ? "line-through text-slate-500 opacity-50" : ""}`}>{topO}</span>
                     </div>
                     <div className="flex justify-end gap-1 border-b-2 border-[#4a3b2c] pb-2 mb-2 relative tracking-wider">
                       <span className="absolute left-[-12px] top-0 text-xl">-</span>
                       <span className="w-8 text-center">{Math.floor(problem.bottom / 100)}</span>
                       <span className="w-8 text-center">{Math.floor(problem.bottom / 10) % 10}</span>
                       <span className="w-8 text-center">{problem.bottom % 10}</span>
                     </div>
                     <div className="flex justify-end gap-1 text-rose-700 font-bold h-10 tracking-wider">
                       <span className="w-8 text-center">{hundredsVerified ? (currentHundreds - Math.floor(problem.bottom / 100)) : (['remove_hundreds', 'input_hundreds_answer'].includes(step) ? '?' : '')}</span>
                       <span className="w-8 text-center">{tensVerified ? (currentTens - (Math.floor(problem.bottom / 10) % 10)) : (['remove_tens', 'input_tens_answer'].includes(step) ? '?' : '')}</span>
                       <span className="w-8 text-center">{onesVerified ? (currentOnes - (problem.bottom % 10)) : (['remove_ones', 'input_ones_answer'].includes(step) ? '?' : '')}</span>
                     </div>
                   </div>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Right Panel: Visual Blocks Area */}
        <div className="bg-[#f4e4bc] p-4 rounded shadow-md border-2 border-[#8b5a2b] flex-1 flex flex-col items-center">

          {/* Feedback Bar */}
          <div className="w-full bg-[#3a2a1a] text-[#f4e4bc] p-2 rounded mb-3 text-center text-base md:text-lg font-serif font-bold shadow-inset border border-[#1a1005]">
            {feedback}
          </div>

          {/* Visual Canvas */}
          <div className="flex w-full gap-3 h-[300px] relative">

            {/* Hundreds Column */}
            <div className="flex-[1.5] bg-purple-900/10 rounded p-2.5 border border-dashed border-purple-900/30 flex flex-col items-center relative overflow-y-auto">
              <h3 className="text-purple-950 font-bold mb-2 uppercase tracking-wider text-xs sticky top-0 w-full text-center pb-1 z-20 font-serif bg-[#f4e4bc]/90 backdrop-blur-sm">100s: Gold Piles</h3>
              {mode === 'addition' && (
                <div className="w-full flex flex-col items-center gap-1.5">
                  {step === 'done' ? (
                    <div className="w-full flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-950 bg-purple-200/80 px-1.5 py-0.5 rounded border border-purple-400 shrink-0" style={{ visibility: (hundredsVerified || step === 'input_hundreds_answer') ? 'hidden' : 'visible' }}>{hundredsAnswer}</span>
                      <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center">
                        {[...Array(hundredsAnswer)].map((_, i) => <HundredBlock key={`h-ans-${i}`} />)}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-full flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-950 bg-purple-200/80 px-1.5 py-0.5 rounded border border-purple-400 shrink-0" style={{ visibility: (hundredsVerified || step === 'input_hundreds_answer') ? 'hidden' : 'visible' }}>{topH + (carryTens > 0 ? 1 : 0)}</span>
                        <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center">
                          {[...Array(topH)].map((_, i) => <HundredBlock key={`h-top-${i}`} />)}
                          {carryTens > 0 && <HundredBlock isCarry={true} />}
                        </div>
                      </div>
                      <div className="w-full h-px bg-purple-900/30 my-1"></div>
                      <div className="w-full flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-950 bg-purple-200/80 px-1.5 py-0.5 rounded border border-purple-400 shrink-0" style={{ visibility: (hundredsVerified || step === 'input_hundreds_answer') ? 'hidden' : 'visible' }}>{Math.floor(problem.bottom / 100)}</span>
                        <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center">
                          {[...Array(Math.floor(problem.bottom / 100))].map((_, i) => <HundredBlock key={`h-bot-${i}`} />)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              {mode === 'subtraction' && (
                <div className="w-full flex flex-col items-center gap-2">
                   <div className="w-full flex items-center gap-2">
                     <span className="text-xs font-bold text-purple-950 bg-purple-200/80 px-1.5 py-0.5 rounded border border-purple-400 shrink-0" style={{ visibility: (hundredsVerified || step === 'input_hundreds_answer') ? 'hidden' : 'visible' }}>{currentHundreds - hundredsRemoved}</span>
                     <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center">
                        {[...Array(currentHundreds)].map((_, i) => {
                          const isRemoved = i < hundredsRemoved;
                          const isInteractive = step === 'remove_hundreds' && !isRemoved;
                          const isBorrowTarget = (step === 'ask_source_for_ones' || step === 'ask_source_for_tens') && i === currentHundreds - 1;

                          const handlePileClick = () => {
                            if (isInteractive) {
                              handleRemoveHundred();
                            } else if (isBorrowTarget) {
                              if (step === 'ask_source_for_ones') {
                                handleAskSourceForOnes('hundred');
                              } else if (step === 'ask_source_for_tens') {
                                handleAskSourceForTens('hundred');
                              }
                            }
                          };

                          return (
                            <div 
                              key={`sub-h-${i}`} 
                              onClick={handlePileClick} 
                              className={`${(isInteractive || isBorrowTarget) ? 'cursor-pointer hover:scale-105' : ''} ${isRemoved ? 'opacity-20 grayscale' : ''}`}
                            >
                              <HundredBlock isBorrowTarget={isBorrowTarget} />
                            </div>
                          );
                        })}
                     </div>
                   </div>
                   {step !== 'done' && (
                     <>
                       <div className="w-full border-t border-dashed border-purple-900/30 pt-1 text-center text-[10px] text-purple-950 font-bold uppercase tracking-wider">Pay</div>
                       <div className="w-full flex items-center gap-2">
                         <span className="text-xs font-bold text-purple-950 bg-purple-200/80 px-1.5 py-0.5 rounded border border-purple-400 shrink-0" style={{ visibility: (hundredsVerified || step === 'input_hundreds_answer') ? 'hidden' : 'visible' }}>{Math.floor(problem.bottom / 100)}</span>
                         <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center opacity-70">
                           {[...Array(Math.floor(problem.bottom / 100))].map((_, i) => <HundredBlock key={`sub-h-dash-${i}`} dashed={true} removedTarget={i < hundredsRemoved} />)}
                         </div>
                       </div>
                     </>
                   )}
                </div>
              )}

            </div>

            {/* Tens Column */}
            <div className="flex-1 bg-sky-900/10 rounded p-2.5 border border-dashed border-sky-900/30 flex flex-col items-center relative overflow-y-auto">
              <h3 className="text-sky-950 font-bold mb-2 uppercase tracking-wider text-xs sticky top-0 w-full text-center pb-1 z-20 font-serif bg-[#f4e4bc]/90 backdrop-blur-sm">10s: Gold Bars</h3>
              {mode === 'addition' && (
                <div className="w-full flex flex-col items-center gap-1.5">
                  {!['combine_ones', 'eval_carry_ones', 'regroup_ones', 'input_ones_answer', 'combine_tens'].includes(step) ? (
                    <div className="w-full flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-950 bg-sky-200/80 px-1.5 py-0.5 rounded border border-sky-400 shrink-0" style={{ visibility: (tensVerified || step === 'input_tens_answer') ? 'hidden' : 'visible' }}>{tensAnswer}</span>
                      <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center mt-1">
                        {[...Array(tensAnswer)].map((_, i) => <TenBlock key={`t-ans-${i}`} isCarry={['regroup_tens', 'eval_carry_tens'].includes(step) && i >= 10} />)}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-full flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-950 bg-sky-200/80 px-1.5 py-0.5 rounded border border-sky-400 shrink-0" style={{ visibility: (tensVerified || step === 'input_tens_answer') ? 'hidden' : 'visible' }}>{topT + (carryOnes > 0 ? 1 : 0)}</span>
                        <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center">
                          {[...Array(topT)].map((_, i) => <TenBlock key={`t-top-${i}`} />)}
                          {carryOnes > 0 && <TenBlock isCarry={true} />}
                        </div>
                      </div>
                      <div className="w-full h-px bg-sky-900/30 my-1"></div>
                      <div className="w-full flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-950 bg-sky-200/80 px-1.5 py-0.5 rounded border border-sky-400 shrink-0" style={{ visibility: (tensVerified || step === 'input_tens_answer') ? 'hidden' : 'visible' }}>{Math.floor(problem.bottom / 10) % 10}</span>
                        <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center">
                          {[...Array(Math.floor(problem.bottom / 10) % 10)].map((_, i) => <TenBlock key={`t-bot-${i}`} />)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              {mode === 'subtraction' && (
                <div className="w-full flex flex-col items-center gap-2">
                   <div className="w-full flex items-center gap-2">
                     <span className="text-xs font-bold text-sky-950 bg-sky-200/80 px-1.5 py-0.5 rounded border border-sky-400 shrink-0" style={{ visibility: (tensVerified || step === 'input_tens_answer') ? 'hidden' : 'visible' }}>{currentTens - tensRemoved}</span>
                     <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center">
                       {[...Array(currentTens)].map((_, i) => {
                          const isRemoved = i < tensRemoved;
                          const isInteractive = step === 'remove_tens' && !isRemoved;
                          const isBorrowTarget = (step === 'ask_source_for_ones') && i === currentTens - 1;
                          const isNewBorrowed = (step === 'remove_tens' || step === 'ask_source_for_ones') && tensRemoved === 0 && currentTens > topT && i >= currentTens - 10;

                          const handleBarClick = () => {
                            if (isInteractive) {
                              handleRemoveTen();
                            } else if (isBorrowTarget) {
                              if (step === 'ask_source_for_ones') {
                                handleAskSourceForOnes('ten');
                              }
                            } else if (step === 'ask_source_for_tens') {
                              handleAskSourceForTens('ten');
                            }
                          };

                          return (
                            <div 
                              key={`sub-t-${i}`} 
                              onClick={handleBarClick} 
                              className={`${(isInteractive || isBorrowTarget || step === 'ask_source_for_tens') ? 'cursor-pointer hover:scale-105' : ''} ${isRemoved ? 'opacity-20 grayscale' : ''}`}
                            >
                              <TenBlock isBorrowTarget={isBorrowTarget} isNewBorrowed={isNewBorrowed && step === 'ask_source_for_ones'} />
                            </div>
                          );
                        })}
                     </div>
                   </div>
                   {step !== 'done' && (
                     <>
                       <div className="w-full border-t border-dashed border-sky-900/30 pt-1 text-center text-[10px] text-sky-950 font-bold uppercase tracking-wider">Pay</div>
                       <div className="w-full flex items-center gap-2">
                         <span className="text-xs font-bold text-sky-950 bg-sky-200/80 px-1.5 py-0.5 rounded border border-sky-400 shrink-0" style={{ visibility: (tensVerified || step === 'input_tens_answer') ? 'hidden' : 'visible' }}>{Math.floor(problem.bottom / 10) % 10}</span>
                         <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center opacity-70">
                           {[...Array(Math.floor(problem.bottom / 10) % 10)].map((_, i) => <TenBlock key={`sub-t-dash-${i}`} dashed={true} removedTarget={i < tensRemoved} />)}
                         </div>
                       </div>
                     </>
                   )}
                </div>
              )}
            </div>

            {/* Ones Column */}
            <div className="flex-1 bg-amber-900/10 rounded p-2.5 border border-dashed border-amber-900/30 flex flex-col items-center relative overflow-y-auto">
              <h3 className="text-amber-950 font-bold mb-2 uppercase tracking-wider text-xs sticky top-0 w-full text-center pb-1 z-20 font-serif bg-[#f4e4bc]/90 backdrop-blur-sm">1s: Coins</h3>
              {mode === 'addition' && (
                <div className="w-full flex flex-col items-center gap-1.5">
                  {step === 'combine_ones' ? (
                     <>
                       <div className="w-full flex items-center gap-2">
                         <span className="text-xs font-bold text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded border border-amber-400 shrink-0" style={{ visibility: (onesVerified || step === 'input_ones_answer') ? 'hidden' : 'visible' }}>{topO}</span>
                         <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center">
                           {[...Array(topO)].map((_, i) => <OneBlock key={`o-top-${i}`} />)}
                         </div>
                       </div>
                       <div className="w-full h-px bg-amber-900/30 my-1"></div>
                       <div className="w-full flex items-center gap-2">
                         <span className="text-xs font-bold text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded border border-amber-400 shrink-0" style={{ visibility: (onesVerified || step === 'input_ones_answer') ? 'hidden' : 'visible' }}>{problem.bottom % 10}</span>
                         <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center">
                           {[...Array(problem.bottom % 10)].map((_, i) => <OneBlock key={`o-bot-${i}`} />)}
                         </div>
                       </div>
                     </>
                  ) : (
                     <div className="w-full flex items-center gap-2">
                       <span className="text-xs font-bold text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded border border-amber-400 shrink-0" style={{ visibility: (onesVerified || step === 'input_ones_answer') ? 'hidden' : 'visible' }}>{onesAnswer}</span>
                       <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center mt-1">
                         {[...Array(onesAnswer)].map((_, i) => <OneBlock key={`o-ans-${i}`} isCarry={['regroup_ones', 'eval_carry_ones'].includes(step) && i >= 10} />)}
                       </div>
                     </div>
                  )}
                </div>
              )}
              {mode === 'subtraction' && (
                <div className="w-full flex flex-col items-center gap-2">
                  <div className="w-full flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded border border-amber-400 shrink-0" style={{ visibility: (onesVerified || step === 'input_ones_answer') ? 'hidden' : 'visible' }}>{currentOnes - onesRemoved}</span>
                    <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center">
                      {[...Array(currentOnes)].map((_, i) => {
                         const isRemoved = i < onesRemoved;
                         const isInteractive = step === 'remove_ones' && !isRemoved;
                         const isNewBorrowed = currentOnes > topO && onesRemoved === 0 && i >= currentOnes - 10 && step === 'remove_ones';
                         return (
                           <div key={`sub-o-${i}`} onClick={isInteractive ? handleRemoveOne : undefined} className={`${isInteractive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${isRemoved ? 'opacity-20 grayscale' : ''}`}>
                             <OneBlock isNewBorrowed={isNewBorrowed} />
                           </div>
                         )
                      })}
                    </div>
                  </div>
                  {step !== 'done' && (
                    <>
                       <div className="w-full border-t border-dashed border-amber-900/30 pt-1 text-center text-[10px] text-amber-950 font-bold uppercase tracking-wider">Pay</div>
                       <div className="w-full flex items-center gap-2">
                         <span className="text-xs font-bold text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded border border-amber-400 shrink-0" style={{ visibility: (onesVerified || step === 'input_ones_answer') ? 'hidden' : 'visible' }}>{problem.bottom % 10}</span>
                         <div className="grid grid-cols-5 gap-2 flex-1 justify-items-center opacity-70">
                           {[...Array(problem.bottom % 10)].map((_, i) => <OneBlock key={`sub-o-dash-${i}`} dashed={true} removedTarget={i < onesRemoved} />)}
                         </div>
                       </div>
                    </>
                   )}
                </div>
              )}

            </div>
          </div>

          {/* Action Area */}
          <div className="mt-4 flex gap-3 min-h-12 flex-wrap items-center justify-center font-serif w-full">
             {['input_ones_answer', 'input_tens_answer', 'input_hundreds_answer'].includes(step) ? (
               <div className="flex flex-col items-center gap-2.5 w-full animate-fade-in">
                 <span className="text-[#4a3b2c] font-bold text-base md:text-lg">
                   {step === 'input_ones_answer' && "Select the number of Coins remaining:"}
                   {step === 'input_tens_answer' && "Select the number of Gold Bars remaining:"}
                   {step === 'input_hundreds_answer' && "Select the number of Gold Piles remaining:"}
                 </span>
                 <div className="flex gap-1.5 sm:gap-2.5 justify-center flex-nowrap w-full pb-1">
                   {[...Array(10)].map((_, digit) => {
                     let btnColorClass = "bg-[#d49a2a] hover:bg-[#b47a0a] border-[#8b5a1b]";
                     if (step === 'input_tens_answer') btnColorClass = "bg-[#2b5a3b] hover:bg-[#1a4a2b] border-[#1a3a1b]";
                     if (step === 'input_hundreds_answer') btnColorClass = "bg-[#4a5a6a] hover:bg-[#2a3a4a] border-[#1a2a3a]";

                     return (
                       <button
                         key={digit}
                         onClick={() => {
                           if (step === 'input_ones_answer') handleVerifyOnesDigit(digit);
                           else if (step === 'input_tens_answer') handleVerifyTensDigit(digit);
                           else if (step === 'input_hundreds_answer') handleVerifyHundredsDigit(digit);
                         }}
                         className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full ${btnColorClass} text-[#f4e4bc] font-bold text-sm sm:text-lg md:text-xl flex items-center justify-center border-2 shadow-md hover:scale-105 active:scale-95 transition-all duration-150 shrink-0`}
                       >
                         {digit}
                       </button>
                     );
                   })}
                 </div>
               </div>
             ) : (
               <>
                 {mode === 'addition' && (
                   <>
                     {step === 'combine_ones' && <Button onClick={handleCombineOnes}>1. Combine Coins</Button>}
                     {step === 'eval_carry_ones' && (
                       <>
                         <Button onClick={() => handleEvalCarryOnes(true)}>Aye, melt 'em!</Button>
                         <Button color="slate" onClick={() => handleEvalCarryOnes(false)}>Nay, not enough</Button>
                       </>
                     )}
                     {step === 'regroup_ones' && <Button color="amber" onClick={handleRegroupOnes}>2. Melt 10 Coins!</Button>}

                     {step === 'combine_tens' && <Button onClick={handleCombineTens}>3. Combine Bars</Button>}
                     {step === 'eval_carry_tens' && (
                       <>
                         <Button onClick={() => handleEvalCarryTens(true)}>Aye, stack 'em!</Button>
                         <Button color="slate" onClick={() => handleEvalCarryTens(false)}>Nay, not enough</Button>
                       </>
                     )}
                     {step === 'regroup_tens' && <Button color="amber" onClick={handleRegroupTens}>4. Stack 10 Bars!</Button>}

                     {step === 'combine_hundreds' && <Button color="amber" onClick={handleCombineHundreds}>5. Combine Piles</Button>}

                     {step === 'done' && (
                       <Button color="emerald" onClick={handleNextProblem}>Next Adventure!</Button>
                     )}
                   </>
                 )}

                 {mode === 'subtraction' && (
                   <>
                     {step === 'eval_borrow_ones' && (
                       <>
                         <Button onClick={() => handleEvalBorrowOnes('yes')}>Aye, break somethin'</Button>
                         <Button color="slate" onClick={() => handleEvalBorrowOnes('no')}>Nay, we have enough</Button>
                       </>
                     )}
                     {step === 'ask_source_for_ones' && (
                       <span className="text-[#8b5a2b] font-bold italic animate-pulse">👉 Click directly on a Gold Bar or Gold Pile to break it!</span>
                     )}

                     {step === 'eval_borrow_tens' && (
                       <>
                         <Button onClick={() => handleEvalBorrowTens('yes')}>Aye, break somethin'</Button>
                         <Button color="slate" onClick={() => handleEvalBorrowTens('no')}>Nay, we have enough</Button>
                       </>
                     )}
                     {step === 'ask_source_for_tens' && (
                       <span className="text-[#8b5a2b] font-bold italic animate-pulse">👉 Click directly on a Gold Pile to break it!</span>
                     )}

                     {step === 'done' && (
                       <Button color="emerald" onClick={handleNextProblem}>Next Adventure!</Button>
                     )}
                   </>
                 )}
               </>
             )}
           </div>

        </div>
      </div>
    </div>
  );
};

// Pirate Styled Components

const HundredBlock = ({ isCarry = false, isBorrowTarget = false, dashed = false, removedTarget = false }) => {
  const highlight = isCarry || isBorrowTarget;
  return (
    <div className={`w-9 h-9 rounded-sm transition-all duration-300 shadow-md relative flex-shrink-0
      ${dashed ? (removedTarget ? 'bg-emerald-100/50 border border-emerald-500' : 'bg-transparent border border-dashed border-amber-600') :
        'bg-yellow-400 border border-yellow-600 shadow-[inset_0_-2px_4px_rgba(180,100,0,0.4)]'}
      ${highlight && !dashed ? 'ring-2 ring-rose-500 shadow-md shadow-rose-500/50 scale-105 z-10 cursor-pointer animate-pulse' : ''}
    `}
    style={!dashed ? {
        backgroundImage: `linear-gradient(to right, rgba(180, 100, 0, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(180, 100, 0, 0.4) 1px, transparent 1px)`,
        backgroundSize: '10% 10%'
    } : {}}>
      {dashed && removedTarget && <div className="absolute inset-0 flex items-center justify-center text-emerald-600 font-bold text-lg">✓</div>}
      {isBorrowTarget && (
         <div className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[8px] px-1 py-0.2 rounded-full font-bold shadow-md whitespace-nowrap z-20">Break!</div>
      )}
    </div>
  );
};

const TenBlock = ({ isCarry = false, isBorrowTarget = false, isNewBorrowed = false, dashed = false, removedTarget = false }) => {
  const highlight = isCarry || isBorrowTarget || isNewBorrowed;
  return (
    <div className={`w-3.5 h-11 rounded-sm flex flex-col gap-[0.5px] p-[0.5px] transition-all duration-500 shadow-sm flex-shrink-0 relative
      ${dashed ? (removedTarget ? 'bg-emerald-100/50 border border-emerald-500' : 'bg-transparent border border-dashed border-amber-600') :
        'bg-yellow-400 border border-yellow-600 shadow-[inset_-1px_0_2px_rgba(180,100,0,0.3)]'}
      ${highlight && !dashed ? 'ring-2 ring-rose-500 shadow-md shadow-rose-500/50 scale-105 z-10 cursor-pointer animate-pulse' : ''}
    `}>
      {dashed ? (
        removedTarget && <div className="flex items-center justify-center h-full text-emerald-600 font-bold text-xs">✓</div>
      ) : (
        <>
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`w-full flex-1 rounded-[0.5px] bg-yellow-300 border-b border-yellow-500/30`}></div>
          ))}
          {isBorrowTarget && (
             <div className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[8px] px-1 py-0.2 rounded-full font-bold shadow-md whitespace-nowrap z-20">Break!</div>
          )}
        </>
      )}
    </div>
  );
};

const OneBlock = ({ isCarry = false, isNewBorrowed = false, dashed = false, removedTarget = false }) => {
  const highlight = isCarry || isNewBorrowed;
  return (
    <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center flex-shrink-0
      ${dashed ? (removedTarget ? 'bg-emerald-100/50 border border-emerald-500' : 'bg-transparent border border-dashed border-amber-600') :
        'bg-yellow-400 border border-yellow-600 shadow-[inset_0_-1px_2px_rgba(180,100,0,0.5)]'}
      ${highlight && !dashed ? 'ring-2 ring-emerald-400 shadow-md shadow-emerald-400/50 scale-110 z-10' : ''}
    `}>
      {dashed && removedTarget && <span className="text-emerald-600 font-bold text-[10px]">✓</span>}
    </div>
  );
};

const Button = ({ children, onClick, color = 'emerald' }) => {
  const colors = {
    emerald: 'bg-[#2b5a3b] hover:bg-[#1a4a2b] border-[#1a3a1b]',
    amber: 'bg-[#d49a2a] hover:bg-[#b47a0a] border-[#8b5a1b]',
    rose: 'bg-[#8b2b2b] hover:bg-[#6b1b1b] border-[#4a0b0b]',
    slate: 'bg-[#4a5a6a] hover:bg-[#2a3a4a] border-[#1a2a3a]'
  };

  return (
    <button
      onClick={onClick}
      className={`${colors[color]} text-[#f4e4bc] px-4 py-1.5 rounded text-sm md:text-base shadow-sm hover:shadow-md transition-transform focus:outline-none border-2 active:scale-95 tracking-wide`}
    >
      {children}
    </button>
  );
};

export default App;
