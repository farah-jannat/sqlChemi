"use client";

import { useState, useEffect } from "react";
import { generateCustomQuiz } from "@/services/gemini";
import { SQLQuestion } from "@/types/quiz";
// import { transpileToPostgres } from "@/utils/sqlTranslator";

// Import shadcn select primitives
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

declare global {
  interface Window {
    SQL: any;
  }
}

export default function DynamicSQLQuiz() {
  // 1. Single State Tracking for the Engine
  const [pgEngine, setPgEngine] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 2. Form Configuration States
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedTag, setSelectedTag] = useState<string>("ALL_TAGS");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
  );
  const [numQuestions, setNumQuestions] = useState<number>(2);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // 3. Quiz Engine States
  const [allQuestionsBank, setAllQuestionsBank] = useState<SQLQuestion[]>([]);
  const [questions, setQuestions] = useState<SQLQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userQuery, setUserQuery] = useState<string>("");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    status: "correct" | "incorrect" | "error" | null;
    message: string;
  }>({ status: null, message: "" });

  // button animatin state
  const [animationKey, setAnimationKey] = useState(0);

  // 4. Navigation States
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);
  const [isViewingSetup, setIsViewingSetup] = useState<boolean>(true);

  const activeQuestion = questions[currentIndex] || null;

  // 5. Clean Client-Side PostgreSQL Loading Pipeline
  // 6. Fetch Local Questions Bank and Aggregate Tags

  // ==========================================
  // ✅ 1st useEffect: INITIALIZE THE DATABASE
  // ==========================================
  useEffect(() => {
    let isMounted = true;
    if (typeof window === "undefined") return;

    const loadDatabaseEngine = async () => {
      try {
        setIsGenerating(true);
        const { PGlite } = await import("@electric-sql/pglite");
        const db = await PGlite.create();

        if (isMounted) {
          setPgEngine(db);
          console.log("🐘 PGlite Engine loaded successfully!");
        }
      } catch (error) {
        console.error("Failed to initialize browser PostgreSQL engine:", error);
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };

    loadDatabaseEngine();
    return () => {
      isMounted = false;
    };
  }, []); // <--- Empty dependency array means it only runs on mount.

  // ==========================================
  // 🔍 2nd useEffect: DYNAMIC FETCHING PIPELINE
  // ==========================================
  // useEffect(() => {
  //   let isMounted = true;

  //   const loadQuestions = async () => {
  //     try {
  //       // 1. Fetch the manifest
  //       const manifestRes = await fetch("/datas/manifest.json");
  //       if (!manifestRes.ok) throw new Error("Could not load manifest");
  //       const manifest = await manifestRes.json();

  //       // 2. Filter logic (case-insensitive for reliability)
  //       let filtered = manifest.filter(
  //         (q: any) => q.difficulty.toLowerCase() === difficulty.toLowerCase(),
  //       );

  //       if (selectedTag !== "ALL_TAGS") {
  //         filtered = filtered.filter((q: any) =>
  //           q.tags?.some(
  //             (t: string) => t.toLowerCase() === selectedTag.toLowerCase(),
  //           ),
  //         );
  //       }

  //       if (filtered.length === 0) {
  //         console.warn("No questions match these criteria");
  //         // Optional: setQuestions([]) to clear UI if nothing found
  //         return;
  //       }

  //       // 3. Shuffle and pick subset
  //       const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  //       const selectedSubset = shuffled.slice(0, numQuestions);

  //       // 4. Batch fetch contents
  //       const questionContents = await Promise.all(
  //         selectedSubset.map(async (item: any) => {
  //           const res = await fetch(
  //             `/datas/questions/${item.difficulty.toLowerCase()}/${item.id}.json`,
  //           );
  //           return res.json();
  //         }),
  //       );

  //       // 5. Update UI state
  //       if (isMounted) {
  //         setQuestions(questionContents);
  //         setCurrentIndex(0);
  //         setIsViewingSetup(false);
  //         setHasHydrated(true);
  //         setFeedback({ status: null, message: "" });
  //       }

  //       const allTags = manifest.flatMap((q: any) => q.tags || []);
  //       const uniqueTags = Array.from(new Set(allTags)) as string[];

  //       setAvailableTags(uniqueTags);
  //     } catch (err) {
  //       console.error("Failed to load dynamic quiz data:", err);
  //     }
  //   };

  //   loadQuestions();
  //   return () => {
  //     isMounted = false;
  //   };

  //   // This array ensures the quiz refreshes whenever user changes settings
  // }, [difficulty, selectedTag, numQuestions]);

  // Add this effect to populate the tags only once on mount
  useEffect(() => {
    const loadTags = async () => {
      try {
        const res = await fetch("/datas/manifest.json");
        const manifest = await res.json();
        const allTags = manifest.flatMap((q: any) => q.tags || []);
        const uniqueTags = Array.from(new Set(allTags)) as string[];
        setAvailableTags(uniqueTags);
      } catch (err) {
        console.error("Could not load tags for dropdown:", err);
      }
    };
    loadTags();
  }, []);

  // 3rd use Effect
  // ✅ This runs once immediately when the app loads
  useEffect(() => {
    // Only trigger if we haven't loaded any questions yet
    if (questions.length === 0 && !isGenerating) {
      // We simulate a "Reset" trigger to load the first set of questions
      const initialEvent = { preventDefault: () => {} } as React.FormEvent;
      handleLoadStaticQuiz(initialEvent);
    }
  }, []); // Empty dependency array = runs once on mount

  const handleLoadStaticQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const manifestRes = await fetch("/datas/manifest.json");
      const manifest = await manifestRes.json();

      // 1. Filter based on current state (when button is clicked)
      let filtered = manifest.filter(
        (q: any) => q.difficulty.toLowerCase() === difficulty.toLowerCase(),
      );

      if (selectedTag !== "ALL_TAGS") {
        filtered = filtered.filter((q: any) =>
          q.tags?.some(
            (t: string) => t.toLowerCase() === selectedTag.toLowerCase(),
          ),
        );
      }

      if (filtered.length === 0) {
        alert("No questions match your criteria.");
        return;
      }

      // 2. Shuffle and pick
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      const selectedSubset = shuffled.slice(0, numQuestions);

      // 3. Batch fetch
      const questionContents = await Promise.all(
        selectedSubset.map(async (item: any) => {
          const res = await fetch(
            `/datas/questions/${item.difficulty.toLowerCase()}/${item.id}.json`,
          );
          return res.json();
        }),
      );

      // 4. Update UI
      setQuestions(questionContents);
      setCurrentIndex(0);
      setUserQuery("");
      setShowHint(false);
      setShowAnswer(false);
      setFeedback({ status: null, message: "" });
      setIsViewingSetup(false);
      setHasHydrated(true);
    } catch (error) {
      console.error("Error loading quiz:", error);
      alert("There was an error loading the questions.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadAIQuiz = async () => {
    if (numQuestions <= 0) return;
    setIsGenerating(true);
    setFeedback({ status: null, message: "" });

    const actualTagFilter =
      selectedTag === "ALL_TAGS" ? "General SQL Operations" : selectedTag;

    try {
      const customBatch = await generateCustomQuiz({
        company: "",
        theme: actualTagFilter,
        difficulty,
        count: numQuestions,
      });

      if (customBatch && customBatch.length > 0) {
        setQuestions(customBatch);
        setCurrentIndex(0);
        setUserQuery("");
        setShowHint(false);
        setShowAnswer(false);
        setIsViewingSetup(false);
      } else {
        alert(
          "Failed to build custom quiz. Check your API token or validation wrapper.",
        );
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("Error generating quiz via Gemini interface engine.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --------------------------------------------------------

  console.log("Current Active Question Data:", activeQuestion);

  // const handleCheckAnswer = async () => {
  //   setAnimationKey((prev) => prev + 1);
  //   const activeQ = questions[currentIndex];
  //   if (!activeQ || !pgEngine) return;

  //   let translatedQuery = transpileToPostgres(userQuery);
  //   translatedQuery = translatedQuery
  //     .replace(/`([^`]+)`/g, '"$1"')
  //     .replace(/LIMIT\s+(\d+)\s*,\s*(\d+)/i, "LIMIT $2 OFFSET $1");

  //   try {
  //     if (activeQ.setupSQL) {
  //       await pgEngine.exec(`
  //         DROP SCHEMA public CASCADE;
  //         CREATE SCHEMA public;
  //         GRANT ALL ON SCHEMA public TO public;
  //       `);
  //       await pgEngine.exec(activeQ.setupSQL);
  //     }

  //     const goldenResult = await pgEngine.query(activeQ.correctQuery);
  //     const studentResult = await pgEngine.query(translatedQuery);

  //     // ========================================================
  //     // 📊 PHASE 3 & 4: UNIVERSAL NORMALIZATION & MATCH ENGINE
  //     // ========================================================
  //     const normalize = (rows: any[]) => {
  //       if (!rows || !Array.isArray(rows)) return [];

  //       return rows.map((row) => {
  //         const normalizedRow: any = {};
  //         // Sort keys to ensure column order independence
  //         const sortedKeys = Object.keys(row).sort();

  //         for (const key of sortedKeys) {
  //           const val = row[key];
  //           // Standardize types and strings to allow loose matching
  //           if (val === null || val === undefined) {
  //             normalizedRow[key] = null;
  //           } else if (typeof val === "string") {
  //             normalizedRow[key] = val.trim().toLowerCase();
  //           } else if (typeof val === "number") {
  //             normalizedRow[key] = val;
  //           } else {
  //             normalizedRow[key] = val;
  //           }
  //         }
  //         return normalizedRow;
  //       });
  //     };

  //     const goldenCleaned = normalize(goldenResult.rows);
  //     const studentCleaned = normalize(studentResult.rows);

  //     //

  //     // Sort function for row-order independence
  //     const sortFn = (a: any, b: any) => JSON.stringify(a).localeCompare(JSON.stringify(b));

  //     // Sort both datasets by their string representation
  //     const goldenSorted = [...goldenCleaned].sort(sortFn);
  //     const studentSorted = [...studentCleaned].sort(sortFn);

  //     // Final comparison: only cares about final data content
  //     const isMatch = JSON.stringify(goldenSorted) === JSON.stringify(studentSorted);

  //       console.log("Golden:", JSON.stringify(goldenCleaned));
  //       console.log("Student:", JSON.stringify(studentCleaned));

  //     // ========================================================
  //     // 🎯 PHASE 5: FEEDBACK DISPATCHER
  //     // ========================================================
  //     if (isMatch) {
  //       setFeedback({
  //         status: "correct",
  //         message: "🎉 🏆 Success! Your query produced the correct data results! 🐾",
  //       });
  //     } else {
  //       setFeedback({
  //         status: "incorrect",
  //         message: "❌ Output Mismatch. The data returned by your query does not match the target solution.",
  //       });
  //     }
  //   } catch (error: any) {
  //     setFeedback({
  //       status: "error",
  //       message: `💻 Database Syntax Error: ${error.message || error}`,
  //     });
  //   }
  // };

  const handleCheckAnswer = async () => {
    setAnimationKey((prev) => prev + 1);
    const activeQ = questions[currentIndex];
    if (!activeQ || !pgEngine) return;

    try {
      // 1. Reset and Rebuild the Database Environment
      // We await these strictly to ensure the table exists before querying
      if (activeQ.setupSQL) {
        await pgEngine.exec(`
        DROP SCHEMA IF EXISTS public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO public;
      `);
        await pgEngine.exec(activeQ.setupSQL);
      }

      // 2. Execute Queries
      // Use NOT EXISTS in your JSON's correctQuery instead of NOT IN to avoid NULL traps.
      const goldenResult = await pgEngine.query(activeQ.correctQuery);
      const studentResult = await pgEngine.query(userQuery);

      // 3. Normalization: Standardize rows to be order and case-insensitive
      // const normalize = (rows: any[]) => {
      //   if (!rows || !Array.isArray(rows)) return [];

      //   return rows.map((row) => {
      //     const normalizedRow: any = {};
      //     // Sort keys alphabetically to ignore column selection order
      //     const sortedKeys = Object.keys(row).sort();

      //     for (const key of sortedKeys) {
      //       const val = row[key];
      //       // Standardize types/strings for content-only matching
      //       if (val === null || val === undefined) {
      //         normalizedRow[key] = null;
      //       } else if (typeof val === "string") {
      //         normalizedRow[key] = val.trim().toLowerCase();
      //       } else {
      //         normalizedRow[key] = val;
      //       }
      //     }
      //     return normalizedRow;
      //   });
      // };

      console.log("Golden raw:", goldenResult.rows);
      console.log("Student raw:", studentResult.rows);

      const normalize = (rows: any[]) => {
        if (!rows || !Array.isArray(rows)) return [];

        return rows.map((row) => {
          const normalizedRow: any = {};
          const sortedKeys = Object.keys(row).sort();

          for (const key of sortedKeys) {
            const val = row[key];
            const normalizedKey = key.toLowerCase();

            // Handle nulls explicitly
            if (val === null || val === undefined) {
              normalizedRow[normalizedKey] = null;
            }
            // Convert Dates to ISO string for consistency
            else if (val instanceof Date) {
              normalizedRow[normalizedKey] = val.toISOString();
            }
            // Standardize strings and numbers
            else {
              // String(val) handles both numbers (840) and strings ('840')
              // .trim() removes accidental spaces
              // .toLowerCase() keeps case consistency
              normalizedRow[normalizedKey] = String(val).trim().toLowerCase();
            }
          }
          return normalizedRow;
        });
      };
      const goldenCleaned = normalize(goldenResult.rows);
      const studentCleaned = normalize(studentResult.rows);

      // 4. Comparison: Sort rows to ignore "ORDER BY" variations
      const sortFn = (a: any, b: any) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b));

      const goldenSorted = [...goldenCleaned].sort(sortFn);
      const studentSorted = [...studentCleaned].sort(sortFn);

      const isMatch =
        JSON.stringify(goldenSorted) === JSON.stringify(studentSorted);

      // Debugging logs for your console
      console.log("Golden (Normalized):", goldenSorted);
      console.log("Student (Normalized):", studentSorted);

      // 5. Feedback Dispatcher
      if (isMatch) {
        setFeedback({
          status: "correct",
          message: "🎉 🏆 Success! Your query produced the correct results! 🐾",
        });
      } else {
        setFeedback({
          status: "incorrect",
          message:
            "❌ Output Mismatch. Your query executed, but the data result does not match the solution.",
        });
      }
    } catch (error: any) {
      console.error("Database Execution Error:", error);
      setFeedback({
        status: "error",
        message: `💻 Database Error: ${error.message || error}`,
      });
    }
  };

  const pageBg = {
    dark: "bg-gradient-to-br from-[#12141c] to-[#1a1d26] text-slate-200",
    light: "bg-gradient-to-br from-[#f4f6fa] to-[#e9ecf3] text-slate-700",
  }[theme];

  const panelBg = {
    dark: "bg-slate-900/60 backdrop-blur-md border-slate-800/80",
    light: "bg-white border-slate-200/80 shadow-sm",
  }[theme];

  const inputBg = {
    dark: "bg-slate-950/50 border-slate-800 text-slate-300 focus:bg-slate-950 hover:bg-slate-900",
    light:
      "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white hover:bg-slate-100/70",
  }[theme];

  const labelText = {
    dark: "text-purple-300/70",
    light: "text-slate-500 font-semibold",
  }[theme];

  const titleText = {
    dark: "text-white",
    light: "text-slate-900",
  }[theme];

  const subPanelBg = {
    dark: "bg-slate-950/40 border-slate-800/80 text-slate-300",
    light: "bg-slate-50 border-slate-200 text-slate-700",
  }[theme];

  const schemaHeader = {
    dark: "bg-slate-900/80 border-slate-800 text-slate-300",
    light: "bg-slate-100/90 text-slate-800 border-slate-200",
  }[theme];

  const schemaRows = {
    dark: "divide-slate-800/60 text-slate-200 hover:bg-slate-900/20",
    light: "divide-slate-200 text-slate-800 hover:bg-slate-50",
  }[theme];

  const staticBtn = {
    dark: "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750",
    light:
      "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs",
  }[theme];

  const textEditor = {
    dark: "bg-slate-950/40 text-purple-100 placeholder-slate-600 border-slate-800 focus:bg-slate-950/90",
    light:
      "bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20",
  }[theme];

  return (
    <main
      className={`min-h-screen p-4 md:p-8 selection:bg-indigo-500/30 transition-colors duration-300 ${pageBg}`}
    >
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-4 lg:space-y-6">
        {/* TOP CONFIGURATION BOX */}
        <div
          className={`border rounded-2xl p-3.5 shadow-xl transition-all   ${panelBg}`}
        >
          <form
            onSubmit={handleLoadStaticQuiz}
            className="flex flex-wrap lg:flex-nowrap items-end justify-between gap-4 w-full"
          >
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 flex-grow">
              {/* SHADCN TOPIC FOCUS FILTER */}
              <div className="space-y-1.5 w-full sm:w-56">
                <label
                  className={`text-xs font-semibold tracking-wide pl-1 block ${labelText}`}
                >
                  Sql topic focus
                </label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger
                    className={`w-full border rounded-xl px-3.5 py-2 h-[38px] text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 shadow-none transition-all ${inputBg}`}
                  >
                    <SelectValue placeholder="All Structural Tasks" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    sideOffset={6}
                    className={`border rounded-xl shadow-2xl text-xs font-medium w-[100%] ${theme === "light" ? "bg-white text-slate-700 border-slate-200" : "bg-slate-900/95 text-slate-300 border-slate-800"}`}
                  >
                    <SelectItem
                      value="ALL_TAGS"
                      className={`rounded-lg cursor-pointer ${theme === "light" ? "focus:bg-indigo-500/10 focus:text-indigo-600" : "focus:bg-purple-500/20 focus:text-purple-300"}`}
                    >
                      All Structural Tasks
                    </SelectItem>
                    {availableTags.map((tag) => (
                      <SelectItem
                        key={tag}
                        value={tag}
                        className={`rounded-lg cursor-pointer ${theme === "light" ? "focus:bg-indigo-500/10 focus:text-indigo-600" : "focus:bg-purple-500/20 focus:text-purple-300"}`}
                      >
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SHADCN DIFFICULTY FILTER */}
              <div className="space-y-1.5 w-full sm:w-36">
                <label
                  className={`text-xs font-semibold tracking-wide pl-1 block ${labelText}`}
                >
                  Difficulty stack
                </label>
                <Select
                  value={difficulty}
                  onValueChange={(val) =>
                    setDifficulty(val as "Easy" | "Medium" | "Hard")
                  }
                >
                  <SelectTrigger
                    className={`w-full border rounded-xl px-3.5 py-2 h-[38px] text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 shadow-none transition-all ${inputBg}`}
                  >
                    <SelectValue placeholder="Medium" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    sideOffset={6}
                    className={`border rounded-xl shadow-2xl text-xs font-medium ${theme === "light" ? "bg-white text-slate-700 border-slate-200" : "bg-slate-900/95 text-slate-300 border-slate-800"}`}
                  >
                    <SelectItem
                      value="Easy"
                      className="rounded-lg focus:bg-emerald-500/20 focus:text-emerald-300 cursor-pointer"
                    >
                      Easy
                    </SelectItem>
                    <SelectItem
                      value="Medium"
                      className="rounded-lg focus:bg-amber-500/20 focus:text-amber-300 cursor-pointer"
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value="Hard"
                      className="rounded-lg focus:bg-rose-500/20 focus:text-rose-300 cursor-pointer"
                    >
                      Advanced
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Length Parameter */}
              <div className="space-y-1.5 w-full sm:w-28">
                <label
                  className={`text-xs font-semibold tracking-wide pl-1 block ${labelText}`}
                >
                  Output length
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className={`w-full h-[32px] border rounded-xl px-3.5 py-2 text-xs focus:ring-2 outline-none transition-all font-medium text-center ${inputBg} ${theme === "light" ? "focus:ring-indigo-400/30" : "focus:ring-purple-400/30"}`}
                />
              </div>
            </div>

            {/* Actions Group & Streamlined Switcher Icon */}
            <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 shrink-0 w-full lg:w-auto justify-end">
              {/* ⚡ COMPACT SINGLE ICON THEME CONTROLLER */}
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`w-[38px] h-[38px] flex items-center justify-center rounded-xl border transition-all active:scale-90 cursor-pointer ${
                  theme === "light"
                    ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 shadow-xs"
                    : "bg-slate-950/60 border-slate-800 text-purple-300 hover:bg-slate-900"
                }`}
                title={`Switch to ${theme === "dark" ? "Light" : "Cute Dark"} Mode`}
              >
                {theme === "dark" ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path
                      strokeLinecap="round"
                      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>

              <div
                className={`flex items-center gap-2 border rounded-full px-4 h-[38px] text-xs shrink-0 transition-all ${theme === "light" ? "bg-indigo-50 border-indigo-200" : "bg-purple-950/40 border-purple-900/40"}`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme === "light" ? "bg-indigo-400" : "bg-purple-400"}`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${theme === "light" ? "bg-indigo-400" : "bg-purple-400"}`}
                  ></span>
                </span>
                <p
                  className={`font-medium whitespace-nowrap ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}
                >
                  Pool:{" "}
                  <span
                    className={`font-bold ${theme === "light" ? "text-indigo-600" : "text-purple-500"}`}
                  >
                    {questions.length} Items
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full sm:w-auto px-4 h-[38px] border rounded-xl font-medium text-xs tracking-wide shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer ${staticBtn}`}
                >
                  {/* 🧹{" "}
                  {questions.length > 0
                    ? "Reset "
                    : "Static Playroom"} */}
                  🧹 Reset
                </button>

                <button
                  type="button"
                  onClick={handleLoadAIQuiz}
                  disabled={isGenerating}
                  className={`px-5 h-[38px] rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer text-white ${
                    theme === "light"
                      ? "bg-indigo-600 hover:bg-indigo-500"
                      : "bg-purple-600 hover:bg-purple-500"
                  }`}
                >
                  {isGenerating ? "Synthesizing... 🐾" : "🤖 Gemini Quiz"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Primary View Workspace Grid */}
        {questions.length > 0 && questions[currentIndex] && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6   md:gap-4 lg:gap-6 items-start">
            {/* LEFT AREA PANEL: SCENARIO & SCHEMA */}
            <section
              // className={`border h-[calc(100vh-10.5rem)] h-[100vh] overflow-y-auto custom-scroll p-5 rounded-3xl shadow-xl space-y-5 transition-all ${panelBg} lg:col-span-5`}
              className={`${theme === "light" ? "light" : "dark"} border h-[calc(100vh-10.5rem)] overflow-y-auto custom-scroll p-5 rounded-3xl md:col-span-5 shadow-xl space-y-5 transition-all ${panelBg} `}
            >
              <div
                className={`flex items-center justify-between border-b pb-3 ${theme === "light" ? "border-slate-200" : "border-slate-800/60"}`}
              >
                <div className="flex items-center gap-1.5">
                  {questions[currentIndex].tags?.slice(0, 1).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide border ${
                        theme === "light"
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                          : "bg-purple-500/10 border-purple-500/20 text-purple-500 dark:text-purple-300"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide border ${
                      questions[currentIndex].difficulty === "Easy"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                        : questions[currentIndex].difficulty === "Medium"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-300"
                          : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-300"
                    }`}
                  >
                    {questions[currentIndex].difficulty}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <span
                  className={`text-xs font-bold tracking-widest uppercase ${theme === "light" ? "text-indigo-500/70" : "text-purple-300/40"}`}
                >
                  EXERCISE {currentIndex + 1} OF {questions.length}
                </span>
                <h2 className={`text-lg font-bold leading-snug ${titleText}`}>
                  {questions[currentIndex]?.title}
                </h2>
                <p
                  className={`text-sm p-4 rounded-2xl border leading-relaxed font-medium transition-all ${subPanelBg}`}
                >
                  {/* {questions[currentIndex]?.scenario ||  (questions[currentIndex] as any)?.description} */}
                  {questions[currentIndex]?.scenario}
                </p>
              </div>

              {/* Dynamic Relational Schema Panel */}
              {/* Dynamic Relational Schema Panel */}
              <div className="space-y-4">
                {(() => {
                  const rawSchema = questions[currentIndex]?.tableSchema || "";

                  // 1. Clean and split the schema into individual table definitions
                  // Handles multi-table definitions separated by newlines or semicolons
                  const tableDefinitions = rawSchema
                    .split(/[\n;]+/)
                    .map((t) => t.replace(/CREATE\s+TABLE\s+/i, "").trim())
                    .filter(Boolean);

                  // If there's no schema data available, show a fallback layout
                  if (tableDefinitions.length === 0) {
                    return (
                      <div className="text-xs font-medium text-slate-500 italic p-2">
                        No schema provided.
                      </div>
                    );
                  }

                  // 2. Loop through every individual table definition discovered
                  return tableDefinitions.map((tableStr, tableIdx) => {
                    let tableName = "Target Relation";
                    let columns: string[] = [];

                    // Match: table_name (col1 INT, col2 VARCHAR)
                    const match = tableStr.match(
                      /^([a-zA-Z_0-9]+)\s*\(([\s\S]*)\)$/,
                    );

                    if (match) {
                      tableName = match[1];
                      columns = match[2]
                        .split(/,\s*/)
                        .map((col) => col.trim())
                        .filter(Boolean);
                    } else {
                      // Fallback fallback if the table structure lacks standard parens
                      columns = [tableStr];
                    }

                    // 3. Return a clean, independent card structure for each table
                    return (
                      <div
                        key={tableIdx}
                        className={`border rounded-2xl overflow-hidden transition-all ${
                          theme === "light"
                            ? "border-slate-200"
                            : "border-slate-800"
                        }`}
                      >
                        <div
                          className={`px-4 py-2.5 border-b flex items-center justify-between ${schemaHeader}`}
                        >
                          <span className="text-xs font-bold font-mono">
                            📋 {tableName}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                              theme === "light"
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                : "bg-purple-500/10 border-purple-500/30 text-purple-500 dark:text-purple-300"
                            }`}
                          >
                            Relation Table
                          </span>
                        </div>

                        <div
                          className={`divide-y bg-transparent font-mono text-xs ${schemaRows}`}
                        >
                          {columns.map((columnStr, idx) => {
                            const cleanColStr = columnStr
                              .replace(/PRIMARY\s+KEY|NOT\s+NULL/i, "")
                              .replace(/[()]/g, "")
                              .trim();
                            const parts = cleanColStr.split(/\s+/);
                            const columnName = parts[0] || "column_idx";
                            const dataType =
                              parts.slice(1).join(" ") || "VARCHAR";

                            return (
                              <div
                                key={idx}
                                className="px-4 py-2.5 flex items-center justify-between transition-colors"
                              >
                                <span
                                  className={`font-semibold tracking-tight ${
                                    theme === "light"
                                      ? "text-slate-700"
                                      : "text-slate-200"
                                  }`}
                                >
                                  {columnName}
                                </span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all uppercase tracking-tight border ${
                                    dataType.toUpperCase().includes("INT")
                                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20"
                                      : dataType
                                            .toUpperCase()
                                            .includes("CHAR") ||
                                          dataType
                                            .toUpperCase()
                                            .includes("TEXT")
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20"
                                        : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                  }`}
                                >
                                  {dataType}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </section>

            {/* RIGHT AREA PANEL: WORKSPACE EDITOR */}
            <section
              className={`border   p-5 rounded-3xl shadow-xl space-y-4 transition-all ${panelBg} md:col-span-7`}
            >
              <div className="space-y-1.5 ">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="sql-editor"
                    className={`block text-xs font-bold uppercase tracking-widest ${theme === "light" ? "text-indigo-500/70" : "text-purple-300/40"}`}
                  >
                    Standard SQL Solution Workspace:
                  </label>
                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 py-[4px] px-[10px] rounded-md text-[12px] font-bold">
                    PostgreSQL
                  </span>
                </div>
                <div
                  className={`relative  rounded-2xl overflow-hidden border transition-all   ${
                    theme === "light"
                      ? "border-slate-200 focus-within:ring-2 focus-within:ring-indigo-400/30"
                      : "border-slate-800 focus-within:ring-2 focus-within:ring-purple-400/30"
                  } ${textEditor}`}
                >
                  <textarea
                    id="sql-editor"
                    rows={14}
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="SELECT&#10;  column_name&#10;FROM&#10;  table_target;&#10;"
                    className="w-full overflow-y-auto no-scrollbar font-mono text-sm p-4 outline-none resize-none leading-relaxed transition-all bg-transparent"
                  />
                </div>
              </div>

              {/* INTERACTION HUB */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCheckAnswer}
                    className={`px-5 h-[38px] rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer text-white ${
                      theme === "light"
                        ? "bg-indigo-600 hover:bg-indigo-500"
                        : "bg-purple-600 hover:bg-purple-500"
                    }`}
                  >
                    Submit Code
                  </button>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className={`px-3 h-[38px] rounded-xl text-xs font-bold transition-all border active:scale-95 cursor-pointer ${theme === "light" ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300" : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60"}`}
                    title="Toggle Query Tip Hint"
                  >
                    💡 {showHint ? "Conceal" : "Hint"}
                  </button>
                  <button
                    onClick={() => {
                      setShowAnswer(!showAnswer);
                      // setAnimationKey((prev) => prev + 1);
                    }}
                    // setAnimationKey(prev => prev + 1);
                    className={`px-3 h-[38px] border rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${theme === "light" ? "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200" : "bg-slate-800/80 hover:bg-slate-800 text-purple-300 border-purple-900/40"}`}
                    title="Toggle System Solution Model Statement"
                  >
                    👀 {showAnswer ? "Hide Key" : "Answer"}
                  </button>
                </div>

                {/* SLIDER CONTROLS */}
                <div
                  className={`flex items-center gap-1.5 p-1 rounded-xl border ${theme === "light" ? "bg-slate-100 border-slate-200" : "bg-slate-950/60 border-slate-800/80"}`}
                >
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
                    className={`w-8 h-8 flex items-center justify-center border rounded-lg text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-20 ${theme === "light" ? "bg-white border-slate-300 text-slate-500 hover:bg-slate-50" : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                  >
                    ◀
                  </button>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 tracking-tight ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}
                  >
                    {currentIndex + 1} / {questions.length}
                  </span>
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
                    className={`w-8 h-8 flex items-center justify-center border rounded-lg text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-20 ${theme === "light" ? "bg-white border-slate-300 text-slate-500 hover:bg-slate-50" : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                  >
                    ▶
                  </button>
                </div>
              </div>

              {/* DYNAMIC FEEDBACK BANNER AREA */}
              {feedback.status && (
                <div
                  key={animationKey}
                  className={`p-4 rounded-2xl border text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                    feedback.status === "correct"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : feedback.status === "incorrect"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20 font-mono text-xs leading-relaxed"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {/* EXPANDABLE HINT BLOCK */}
              {showHint && activeQuestion && (
                <div
                  className={`p-4 border rounded-2xl text-xs leading-relaxed font-medium transition-all ${subPanelBg}`}
                >
                  📌{" "}
                  <span className="font-bold uppercase tracking-wider">
                    Strategic Hint:
                  </span>{" "}
                  {activeQuestion.hint ||
                    "Review core data relations and columns on the left to structure your filtering variables properly."}
                </div>
              )}

              {/* EXPANDABLE SOLUTION MODEL BLOCK */}
              {showAnswer && activeQuestion && (
                <div
                  className={`p-4 border rounded-2xl font-mono text-xs leading-relaxed tracking-tight transition-all ${subPanelBg}`}
                >
                  💡{" "}
                  <span className="font-bold uppercase font-sans tracking-wider">
                    Expected Query Layout:
                  </span>
                  <pre className="mt-2 text-indigo-400 whitespace-pre-wrap">
                    {activeQuestion.correctQuery ||
                      "No reference solution registered for this entity."}
                  </pre>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
