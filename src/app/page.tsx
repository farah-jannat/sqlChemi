// "use client";

// import { useState } from "react";
// import { generateCustomQuiz } from "@/services/gemini";
// import { SQLQuestion } from "@/types/quiz";

// export default function DynamicSQLQuiz() {
//   // Form Configuration States
//   const [company, setCompany] = useState("");
//   const [theme, setTheme] = useState("");
//   const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
//     "Medium",
//   );
//   const [numQuestions, setNumQuestions] = useState<number>(3);

//   // Quiz Engine States
//   const [questions, setQuestions] = useState<SQLQuestion[]>([]);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//  const [userQuery, setUserQuery] = useState<string>("");
//   const [showHint, setShowHint] = useState<boolean>(false);
//   const [feedback, setFeedback] = useState<{
//     status: "correct" | "incorrect" | null;
//     message: string;
//   }>({ status: null, message: "" });
//   const [isGenerating, setIsGenerating] = useState<boolean>(false);

//   const handleStartQuiz = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (numQuestions <= 0) return;

//     setIsGenerating(true);
//     const customBatch = await generateCustomQuiz({
//       company,
//       theme,
//       difficulty,
//       count: numQuestions,
//     });

//     if (customBatch && customBatch.length > 0) {
//       setQuestions(customBatch);
//       setCurrentIndex(0);
//       setUserQuery("");
//       setFeedback({ status: null, message: "" });
//     } else {
//       alert(
//         "Failed to build custom quiz. Please check your Gemini API key configuration.",
//       );
//     }
//     setIsGenerating(false);
//   };

//   const handleCheckAnswer = () => {
//     const activeQ = questions[currentIndex];
//     const cleanUser = userQuery
//       .replace(/\s+/g, " ")
//       .trim()
//       .toLowerCase()
//       .replace(/;$/, "");
//     const cleanCorrect = activeQ.correctQuery
//       .replace(/\s+/g, " ")
//       .trim()
//       .toLowerCase()
//       .replace(/;$/, "");

//     if (cleanUser === cleanCorrect) {
//       setFeedback({
//         status: "correct",
//         message:
//           "🎉 Brilliant! Your SQL syntax perfectly matches the logic requirements!",
//       });
//     } else {
//       setFeedback({
//         status: "incorrect",
//         message:
//           "❌ Query mismatch. Review your clauses, criteria, or table joins.",
//       });
//     }
//   };

//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
//       <div className="max-w-4xl mx-auto space-y-8">
//         {/* Title Banner */}
//         <div className="text-center space-y-2">
//           <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
//             Dynamic SQL Quiz Generator
//           </h1>
//           <p className="text-slate-500 text-lg">
//             Customize your practice quiz below.
//           </p>
//           <div className="text-emerald-600 font-semibold text-sm tracking-wide flex items-center justify-center gap-1">
//             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
//             Database Ready!
//           </div>
//         </div>

//         {/* SETUP FORM VIEW: Shows if no questions are loaded yet */}
//         {questions.length === 0 ? (
//           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-6">
//             <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-100 pb-3">
//               Quiz Setup
//             </h2>

//             <form onSubmit={handleStartQuiz} className="space-y-5">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {/* Company Select Input */}
//                 <div className="space-y-1.5">
//                   <label className="text-sm font-medium text-slate-600">
//                     Company Name
//                   </label>
//                   <select
//                     value={company}
//                     onChange={(e) => setCompany(e.target.value)}
//                     className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                   >
//                     <option value="">Select Company...</option>
//                     <option value="Google">Google</option>
//                     <option value="Meta">Meta</option>
//                     <option value="Amazon">Amazon</option>
//                     <option value="Netflix">Netflix</option>
//                     <option value="Uber">Uber</option>
//                   </select>
//                 </div>

//                 {/* Theme Text Input */}
//                 <div className="space-y-1.5">
//                   <label className="text-sm font-medium text-slate-600">
//                     Company Theme
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Ride-sharing, Cloud"
//                     value={theme}
//                     onChange={(e) => setTheme(e.target.value)}
//                     className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                   />
//                 </div>

//                 {/* Difficulty Option Dropdown */}
//                 <div className="space-y-1.5">
//                   <label className="text-sm font-medium text-slate-600">
//                     Difficulty
//                   </label>
//                   <select
//                     value={difficulty}
//                     onChange={(e) => setDifficulty(e.target.value as any)}
//                     className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                   >
//                     <option value="Easy">Easy</option>
//                     <option value="Medium">Medium</option>
//                     <option value="Hard">Hard</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Number of questions input */}
//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-slate-600">
//                   Number of Questions
//                 </label>
//                 <input
//                   type="number"
//                   min={1}
//                   max={10}
//                   value={numQuestions}
//                   onChange={(e) => setNumQuestions(Number(e.target.value))}
//                   className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//               </div>

//               {/* Submit CTA button */}
//               <div className="pt-2 text-center">
//                 <button
//                   type="submit"
//                   disabled={isGenerating}
//                   className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:bg-blue-300"
//                 >
//                   {isGenerating
//                     ? "Gemini Synthesizing Sandbox..."
//                     : "Generate Quiz"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         ) : (
//           /* ACTIVE INTERACTIVE PLAYGROUND WORKSPACE BLOCK */
//           <div className="grid grid-cols-1 gap-6 animate-fadeIn">
//             {/* Context Definition Block */}
//             <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
//               <div className="flex items-center justify-between">
//                 <button
//                   onClick={() => setQuestions([])}
//                   className="text-xs text-blue-600 font-semibold hover:underline"
//                 >
//                   ← Build Another Custom Setup
//                 </button>
//                 <span
//                   className={`px-2.5 py-1 rounded-full text-xs font-medium ${
//                     questions[currentIndex].difficulty === "Easy"
//                       ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
//                       : questions[currentIndex].difficulty === "Medium"
//                         ? "bg-amber-50 text-amber-700 border border-amber-200"
//                         : "bg-rose-50 text-rose-700 border border-rose-200"
//                   }`}
//                 >
//                   {questions[currentIndex].difficulty}
//                 </span>
//               </div>

//               <h2 className="text-xl font-bold text-slate-800">
//                 Question {currentIndex + 1} of {questions.length}:{" "}
//                 {questions[currentIndex].title}
//               </h2>
//               <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
//                 {questions[currentIndex].scenario}
//               </p>

//               <div>
//                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
//                   Relational Table Schemas
//                 </h3>
//                 <pre className="font-mono text-sm bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto">
//                   {questions[currentIndex].tableSchema}
//                 </pre>
//               </div>

//               {/* <div>
//                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expected Output Formats</h3>
//                 <p className="text-sm text-slate-600 italic">{questions[currentIndex].expectedOutput}</p>
//               </div> */}
//             </section>

//             {/* Input Code Editor Layout */}
//             <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
//               <label
//                 htmlFor="sql-editor"
//                 className="block text-sm font-semibold text-slate-700"
//               >
//                 Write your standard SQL solution statement:
//               </label>
//               <textarea
//                 id="sql-editor"
//                 rows={5}
//                 value={userQuery}
//                 onChange={(e) => setUserQuery(e.target.value)}
//                 placeholder="SELECT ... FROM ... WHERE ... ;"
//                 className="w-full font-mono text-sm p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//               />

//               {/* Functional CTA Interactions */}
//               <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
//                 <div className="space-x-2">
//                   <button
//                     onClick={handleCheckAnswer}
//                     className="px-5 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
//                   >
//                     Validate Engine Output
//                   </button>
//                   <button
//                     onClick={() => setShowHint(!showHint)}
//                     className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
//                   >
//                     {showHint ? "Conceal Hint" : "Reveal Hint"}
//                   </button>
//                 </div>

//                 {/* Question index navigation controls */}
//                 <div className="flex gap-1.5">
//                   <button
//                     onClick={() => {
//                       if (currentIndex > 0) {
//                         setCurrentIndex(currentIndex - 1);
//                         setFeedback({ status: null, message: "" });
//                         setUserQuery("");
//                         setShowHint(false);
//                       }
//                     }}
//                     disabled={currentIndex === 0}
//                     className="p-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//                   >
//                     ◀ Prev
//                   </button>
//                   <button
//                     onClick={() => {
//                       if (currentIndex < questions.length - 1) {
//                         setCurrentIndex(currentIndex + 1);
//                         setFeedback({ status: null, message: "" });
//                         setUserQuery("");
//                         setShowHint(false);
//                       }
//                     }}
//                     disabled={currentIndex === questions.length - 1}
//                     className="p-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
//                   >
//                     Next ▶
//                   </button>
//                 </div>
//               </div>

//               {/* Conditional Hint component block */}
//               {showHint && (
//                 <div className="p-4 bg-amber-50/70 text-amber-900 border border-amber-100 rounded-lg text-sm">
//                   <span className="font-bold">Hint:</span>{" "}
//                   {questions[currentIndex].hint}
//                 </div>
//               )}

//               {/* Verification Result Feedback System Banner */}
//               {feedback.status && (
//                 <div
//                   className={`p-4 rounded-lg text-sm font-medium border ${
//                     feedback.status === "correct"
//                       ? "bg-emerald-50 text-emerald-900 border-emerald-100"
//                       : "bg-rose-50 text-rose-900 border-rose-100"
//                   }`}
//                 >
//                   {feedback.message}
//                 </div>
//               )}
//             </section>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// ------------------------------------------------------------------------------------------

"use client";

import { useState, useEffect } from "react";
import { generateCustomQuiz } from "@/services/gemini";
import { themedQuestionBanks } from "@/datas/seedQuestions";
import { SQLQuestion } from "@/types/quiz";

export default function DynamicSQLQuiz() {
  // Form Configuration States
  const [company, setCompany] = useState("");
  const [theme, setTheme] = useState("saas");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Medium",
  );
  const [numQuestions, setNumQuestions] = useState<number>(3);

  // Quiz Engine States
  const [questions, setQuestions] = useState<SQLQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userQuery, setUserQuery] = useState<string>("");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    status: "correct" | "incorrect" | null;
    message: string;
  }>({ status: null, message: "" });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 🔄 NEW NAVIGATION STATES
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);
  const [isViewingSetup, setIsViewingSetup] = useState<boolean>(true); // Controls which screen is currently visible

  // 1. EFFECT: Load state on mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem("sql_quiz_questions");
    const savedIndex = localStorage.getItem("sql_quiz_index");
    const savedQuery = localStorage.getItem("sql_quiz_user_query");
    const savedView = localStorage.getItem("sql_quiz_viewing_setup");

    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions);
        setQuestions(parsed);
        if (savedIndex) setCurrentIndex(Number(savedIndex));
        if (savedQuery) setUserQuery(savedQuery);

        // If there are questions, restore whether they were looking at the setup or quiz screen
        if (savedView) {
          setIsViewingSetup(savedView === "true");
        } else {
          setIsViewingSetup(parsed.length === 0);
        }
      } catch (e) {
        console.error("Failed to restore quiz state", e);
      }
    }
    setHasHydrated(true);
  }, []);

  // 2. EFFECT: Sync state changes to localStorage
  useEffect(() => {
    if (!hasHydrated) return;

    localStorage.setItem("sql_quiz_viewing_setup", isViewingSetup.toString());

    if (questions.length > 0) {
      localStorage.setItem("sql_quiz_questions", JSON.stringify(questions));
      localStorage.setItem("sql_quiz_index", currentIndex.toString());
      localStorage.setItem("sql_quiz_user_query", userQuery);
    } else {
      localStorage.removeItem("sql_quiz_questions");
      localStorage.removeItem("sql_quiz_index");
      localStorage.removeItem("sql_quiz_user_query");
    }
  }, [questions, currentIndex, userQuery, isViewingSetup, hasHydrated]);

  // ACTION 1: Load Hardcoded Questions
  const handleLoadStaticQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (numQuestions <= 0) return;

    const selectedThemeKey = theme.toLowerCase() || "saas";
    const localBank = themedQuestionBanks[selectedThemeKey]?.[difficulty] || [];

    if (localBank.length === 0) {
      alert(
        `No hardcoded questions found for ${theme} (${difficulty}). Try using the AI generator instead!`,
      );
      return;
    }

    const staticBatch = localBank.slice(0, numQuestions).map((q) => ({
      ...q,
      scenario: q.scenario.replace(/{companyName}/g, company || "the company"),
    }));

    setQuestions(staticBatch);
    setCurrentIndex(0);
    setUserQuery("");
    setShowHint(false);
    setShowAnswer(false);
    setFeedback({ status: null, message: "" });
    setIsViewingSetup(false); // 👈 Take user straight to the quiz panel
  };

  // ACTION 2: Fetch AI Questions
  const handleLoadAIQuiz = async () => {
    if (numQuestions <= 0) return;

    setIsGenerating(true);
    setFeedback({ status: null, message: "" });

    const customBatch = await generateCustomQuiz({
      company,
      theme,
      difficulty,
      count: numQuestions,
    });

    if (customBatch && customBatch.length > 0) {
      setQuestions(customBatch);
      setCurrentIndex(0);
      setUserQuery("");
      setShowHint(false);
      setShowAnswer(false);
      setIsViewingSetup(false); // 👈 Take user straight to the quiz panel
    } else {
      alert(
        "Failed to build custom quiz. Check your API key or daily tier limits.",
      );
    }
    setIsGenerating(false);
  };

  // Completely wipe session to start fresh from scratch
  const handleAbandonQuizFully = () => {
    if (
      confirm("Are you sure you want to delete this active quiz pool entirely?")
    ) {
      setQuestions([]);
      setCurrentIndex(0);
      setUserQuery("");
      setShowHint(false);
      setShowAnswer(false);
      setFeedback({ status: null, message: "" });
      setIsViewingSetup(true);
    }
  };

  const handleCheckAnswer = () => {
    const activeQ = questions[currentIndex];
    const cleanUser = userQuery
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .replace(/;$/, "");
    const cleanCorrect = activeQ.correctQuery
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .replace(/;$/, "");

    if (cleanUser === cleanCorrect) {
      setFeedback({
        status: "correct",
        message:
          "🎉 Brilliant! Your SQL syntax perfectly matches the logic requirements!",
      });
    } else {
      setFeedback({
        status: "incorrect",
        message:
          "❌ Query mismatch. Review your clauses, criteria, or table joins.",
      });
    }
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium text-sm">
            Resuming dashboard context...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title Banner */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Dynamic SQL Quiz Generator
          </h1>
          <p className="text-slate-500 text-lg">
            Seamlessly toggle screens without dropping your progress.
          </p>
        </div>

        {/* 📋 IF USER HAS ACTIVE QUESTIONS, SHOW A NAVIGATION QUICK-LINK DOCK */}
        {questions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="text-sm text-blue-800">
              You have an active session loaded:{" "}
              <span className="font-bold">
                {questions.length} Questions (
                {questions[currentIndex].difficulty})
              </span>
            </div>
            <button
              onClick={() => setIsViewingSetup(!isViewingSetup)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-sm"
            >
              {isViewingSetup
                ? "👉 Return to Active Quiz"
                : "⚙️ View Setup / Configuration"}
            </button>
          </div>
        )}

        {/* CONDITION VIEW DISPATCHER */}
        {isViewingSetup ? (
          /* SETUP FORM VIEW */
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-2xl font-bold text-slate-800">
                Quiz Configuration
              </h2>
              {questions.length > 0 && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-medium">
                  Modifying this will let you replace or abandon the current
                  pool
                </span>
              )}
            </div>

            <form onSubmit={handleLoadStaticQuiz} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">
                    Company Name
                  </label>
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Company...</option>
                    <option value="Google">Google</option>
                    <option value="Meta">Meta</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Uber">Uber</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">
                    Company Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="saas">SaaS Operations</option>
                    <option value="ecommerce">E-Commerce Focus</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-600">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-white rounded-lg font-bold shadow-md hover:bg-slate-900 active:scale-95 transition-all"
                >
                  ⚡{" "}
                  {questions.length > 0
                    ? "Overwrite with Pre-written"
                    : "Practice Hardcoded (Instant)"}
                </button>

              <button
  type="button"
  onClick={handleLoadAIQuiz}
  disabled={isGenerating}
  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:bg-blue-300"
>
  {isGenerating 
    ? "AI Synthesizing Pool..." 
    : `🤖 ${questions.length > 0 ? "Overwrite with AI" : "Generate with Gemini"}`
  }
</button></div>
            </form>
          </div>
        ) : (
          /* ACTIVE INTERACTIVE PLAYGROUND WORKSPACE BLOCK */
          <div className="grid grid-cols-1 gap-6">
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleAbandonQuizFully}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  🗑️ Wipe Quiz & Start Fresh
                </button>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    questions[currentIndex].difficulty === "Easy"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : questions[currentIndex].difficulty === "Medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {questions[currentIndex].difficulty}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-800">
                Question {currentIndex + 1} of {questions.length}:{" "}
                {questions[currentIndex].title}
              </h2>
              <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
                {questions[currentIndex].scenario}
              </p>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Relational Table Schemas
                </h3>
                <pre className="font-mono text-sm bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                  {questions[currentIndex].tableSchema}
                </pre>
              </div>
            </section>

            {/* Input Code Editor Layout */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <label
                htmlFor="sql-editor"
                className="block text-sm font-semibold text-slate-700"
              >
                Write your standard SQL solution statement:
              </label>
              <textarea
                id="sql-editor"
                rows={5}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="SELECT ... FROM ... WHERE ... ;"
                className="w-full font-mono text-sm p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCheckAnswer}
                    className="px-5 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
                  >
                    Validate Engine Output
                  </button>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    {showHint ? "Conceal Hint" : "Reveal Hint"}
                  </button>
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                  >
                    {showAnswer ? "Hide Answer" : "👀 Show Answer"}
                  </button>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      if (currentIndex > 0) {
                        setCurrentIndex(currentIndex - 1);
                        setFeedback({ status: null, message: "" });
                        setUserQuery("");
                        setShowHint(false);
                        setShowAnswer(false);
                      }
                    }}
                    disabled={currentIndex === 0}
                    className="p-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    ◀ Prev
                  </button>
                  <button
                    onClick={() => {
                      if (currentIndex < questions.length - 1) {
                        setCurrentIndex(currentIndex + 1);
                        setFeedback({ status: null, message: "" });
                        setUserQuery("");
                        setShowHint(false);
                        setShowAnswer(false);
                      }
                    }}
                    disabled={currentIndex === questions.length - 1}
                    className="p-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next ▶
                  </button>
                </div>
              </div>

              {showHint && (
                <div className="p-4 bg-amber-50/70 text-amber-900 border border-amber-100 rounded-lg text-sm">
                  <span className="font-bold">Hint:</span>{" "}
                  {questions[currentIndex].hint}
                </div>
              )}

              {showAnswer && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Correct Query Solution:
                  </div>
                  <pre className="font-mono text-sm p-3 bg-slate-900 text-purple-300 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {questions[currentIndex].correctQuery}
                  </pre>
                </div>
              )}

              {feedback.status && (
                <div
                  className={`p-4 rounded-lg text-sm font-medium border ${
                    feedback.status === "correct"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-100"
                      : "bg-rose-50 text-rose-900 border-rose-100"
                  }`}
                >
                  {feedback.message}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
