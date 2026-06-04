// ----- here new one ---------

"use client";

import { useState, useEffect } from "react";
import { generateCustomQuiz } from "@/services/gemini";
import { seedQuestions } from "@/datas";
import { SQLQuestion } from "@/types/quiz";

// Import shadcn select primitives
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DynamicSQLQuiz() {
  // Simple 2-Theme Toggle State ('dark' = original cute charcoal-slate, 'light' = clean light)
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Form Configuration States
  const [selectedTag, setSelectedTag] = useState<string>("ALL_TAGS");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
  );
  const [numQuestions, setNumQuestions] = useState<number>(1);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

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

  // NAVIGATION STATES
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);
  const [isViewingSetup, setIsViewingSetup] = useState<boolean>(true);

  // Hydrate exact initial data profiles
  // Hydrate exact initial data profiles
  useEffect(() => {
    // 1. Core tag aggregation logic
    const tagsSet = new Set<string>();
    seedQuestions.forEach((q) => {
      if (q.tags && Array.isArray(q.tags)) {
        q.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    setAvailableTags(Array.from(tagsSet).sort());

    // 2. Fetch existing local cache keys
    const savedQuestions = localStorage.getItem("sql_quiz_questions");
    const savedIndex = localStorage.getItem("sql_quiz_index");
    const savedQuery = localStorage.getItem("sql_quiz_user_query");
    const savedView = localStorage.getItem("sql_quiz_viewing_setup");
    const savedTheme = localStorage.getItem("sql_quiz_theme");

    if (savedTheme && ["dark", "light"].includes(savedTheme)) {
      setTheme(savedTheme as "dark" | "light");
    }

    // 3. Fallback conditional branching
    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          if (savedIndex) setCurrentIndex(Number(savedIndex));
          if (savedQuery) setUserQuery(savedQuery);
          if (savedView) {
            setIsViewingSetup(savedView === "true");
          } else {
            setIsViewingSetup(false);
          }
        }
      } catch (e) {
        console.error("Failed to restore quiz state", e);
      }
    } else {
      // 🎲 4. RANDOM AUTOLOAD LOGIC FOR NEW USERS:
      // Shallow copy seed questions, shuffle them up, and pull out a clean batch of 3
      const easyQuestions = seedQuestions.filter(
        (q) => q.difficulty === "Easy",
      );
      const shuffled = [...easyQuestions].sort(() => 0.5 - Math.random());
      const defaultBatch = shuffled.slice(0, 1);

      if (defaultBatch.length > 0) {
        setQuestions(defaultBatch);
        setCurrentIndex(0);
        setUserQuery("");
        setIsViewingSetup(false); // Bypasses dashboard setup so they see a playground screen instantly
      }
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("sql_quiz_viewing_setup", isViewingSetup.toString());
    localStorage.setItem("sql_quiz_theme", theme);

    if (questions && questions.length > 0) {
      localStorage.setItem("sql_quiz_questions", JSON.stringify(questions));
      localStorage.setItem("sql_quiz_index", currentIndex.toString());
      localStorage.setItem("sql_quiz_user_query", userQuery);
    } else {
      localStorage.removeItem("sql_quiz_questions");
      localStorage.removeItem("sql_quiz_index");
      localStorage.removeItem("sql_quiz_user_query");
    }
  }, [questions, currentIndex, userQuery, isViewingSetup, theme, hasHydrated]);

  const handleLoadStaticQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (numQuestions <= 0) return;

    const localBank = seedQuestions.filter((question) => {
      const matchesDifficulty = question.difficulty === difficulty;
      const actualTagFilter = selectedTag === "ALL_TAGS" ? "" : selectedTag;
      const matchesTag = actualTagFilter
        ? question.tags?.some(
            (t) => t.toLowerCase() === actualTagFilter.toLowerCase(),
          )
        : true;
      return matchesDifficulty && matchesTag;
    });

    if (localBank.length === 0) {
      const displayTag = selectedTag === "ALL_TAGS" ? "Any" : selectedTag;
      alert(
        `No pre-written exercises found for "${displayTag}" (${difficulty}). Try the Gemini synthesis engine instead!`,
      );
      return;
    }

    setQuestions(localBank.slice(0, numQuestions));
    setCurrentIndex(0);
    setUserQuery("");
    setShowHint(false);
    setShowAnswer(false);
    setFeedback({ status: null, message: "" });
    setIsViewingSetup(false);
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

  const handleCheckAnswer = () => {
    const activeQ = questions[currentIndex];
    if (!activeQ || !activeQ.correctQuery) return;

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
        message: "✨ Amazing! Your SQL script logic lines up perfectly! 🐾",
      });
    } else {
      setFeedback({
        status: "incorrect",
        message:
          "❌ Code syntax mismatched. Check your execution conditions or filtering keys.",
      });
    }
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#111318] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-medium text-sm tracking-wide">
            Syncing local canvas engine...
          </p>
        </div>
      </div>
    );
  }

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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* TOP CONFIGURATION BOX */}
        <div
          className={`border rounded-2xl p-3.5 shadow-xl transition-all  ${panelBg}`}
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
                  className={`w-full h-[38px] border rounded-xl px-3.5 py-2 text-xs focus:ring-2 outline-none transition-all font-medium text-center ${inputBg} ${theme === "light" ? "focus:ring-indigo-400/30" : "focus:ring-purple-400/30"}`}
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
                  // Elegant Modern Sun Icon
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
                  // Elegant Micro Moon Icon
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
                  ✨{" "}
                  {questions.length > 0
                    ? "Reset Playground"
                    : "Static Playroom"}
                </button>

                <button
                  type="button"
                  onClick={handleLoadAIQuiz}
                  disabled={isGenerating}
                  className={`w-full sm:w-auto px-4 h-[38px] rounded-xl font-medium text-xs tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer ${
                    theme === "light"
                      ? "bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-800"
                      : "bg-purple-600 text-white hover:bg-purple-500 disabled:bg-purple-800"
                  }`}
                >
                  {isGenerating ? "Synthesizing... 🐾" : "🤖 Build Gemini Quiz"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Primary View Workspace Grid */}
        {questions.length > 0 && questions[currentIndex] && (
          <div className="grid grid-cols-1  lg:grid-cols-12 gap-6 items-start">
            {/* LEFT AREA PANEL: SCENARIO & SCHEMA */}
            <section
              className={`border h-[calc(100vh-10.5rem)] h-[100vh] overflow-y-auto custom-scroll p-5 rounded-3xl shadow-xl space-y-5 transition-all ${panelBg} lg:col-span-5`}
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
                        : questions[currentIndex].difficulty === "Medium" // Removed the double quotes here!
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
                  {questions[currentIndex].title}
                </h2>
                <p
                  className={`text-sm p-4 rounded-2xl border leading-relaxed font-medium transition-all ${subPanelBg}`}
                >
                  {questions[currentIndex].scenario}
                </p>
              </div>

              {/* Dynamic Relational Schema Panel */}
              <div className="space-y-3">
                <h3
                  className={`text-xs font-bold uppercase tracking-widest ${theme === "light" ? "text-indigo-500/70" : "text-purple-300/40"}`}
                >
                  Target Relation Schemas
                </h3>

                <div className="space-y-4">
                  {(() => {
                    const rawSchema = questions[currentIndex].tableSchema || "";
                    let tableName = "Target Relations";
                    let columns: string[] = [];

                    const match = rawSchema.match(
                      /^([a-zA-Z_0-9]+)\s*\((.*)\)$/,
                    );
                    if (match) {
                      tableName = match[1];
                      columns = match[2]
                        .split(/,\s*/)
                        .map((col) => col.trim())
                        .filter(Boolean);
                    } else if (
                      rawSchema.includes("\n") ||
                      rawSchema.includes(",")
                    ) {
                      const cleanLines = rawSchema
                        .split(/[\n,]+/)
                        .map((l) => l.trim())
                        .filter(Boolean);
                      columns = cleanLines.filter(
                        (line) => !line.endsWith("{") && !line.endsWith("("),
                      );
                    } else {
                      columns = [rawSchema];
                    }

                    return (
                      <div
                        className={`border rounded-2xl overflow-hidden transition-all ${theme === "light" ? "border-slate-200" : "border-slate-800"}`}
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
                            const parts = columnStr
                              .replace(/[()]/g, "")
                              .trim()
                              .split(/\s+/);
                            const columnName = parts[0] || "column_idx";
                            const dataType =
                              parts.slice(1).join(" ") || "VARCHAR";

                            return (
                              <div
                                key={idx}
                                className="px-4 py-2.5 flex items-center justify-between transition-colors"
                              >
                                <span
                                  className={`font-semibold tracking-tight ${theme === "light" ? "text-slate-700" : "text-slate-200"}`}
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
                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20"
                                  }`}
                                >
                                  {dataType.toLowerCase()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </section>

            {/* RIGHT AREA PANEL: WORKSPACE EDITOR */}
            <section
              className={`border  p-5 rounded-3xl shadow-xl space-y-4 transition-all ${panelBg} lg:col-span-7`}
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="sql-editor"
                  className={`block text-xs font-bold uppercase tracking-widest ${theme === "light" ? "text-indigo-500/70" : "text-purple-300/40"}`}
                >
                  Standard SQL Solution Workspace:
                </label>
              <div
  className={`relative rounded-2xl overflow-hidden border transition-all ${
    theme === "light" 
      ? "border-slate-200 focus-within:ring-2 focus-within:ring-indigo-400/30" 
      : "border-slate-800 focus-within:ring-2 focus-within:ring-purple-400/30"
  } ${textEditor}`} // 🌟 1. Moved the background color here to fill the entire card structure
>
  <textarea
    id="sql-editor"
    rows={14}
    value={userQuery}
    onChange={(e) => setUserQuery(e.target.value)}
    placeholder="SELECT&#10;  column_name&#10;FROM&#10;  table_target;&#10;"
    className="w-full font-mono text-sm p-4 outline-none resize-none leading-relaxed transition-all bg-transparent" // 🌟 2. Changed this to bg-transparent
  />
</div></div>

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
                    onClick={() => setShowAnswer(!showAnswer)}
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
                    className={`text-xs font-bold px-1.5 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}
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

              {/* LIVE EVALUATION FEEDBACK PROFILE BLOCK */}
              {feedback.status && (
                <div
                  className={`p-4 rounded-2xl border text-xs font-semibold tracking-wide transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    feedback.status === "correct"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  <p>{feedback.message}</p>
                </div>
              )}

              {/* DYNAMIC COMPONENT EXPANSIONS */}
              {showHint && (
                <div
                  className={`p-4 rounded-2xl border text-xs font-mono tracking-tight leading-relaxed transition-all animate-in zoom-in-95 duration-200 ${subPanelBg}`}
                >
                  <span
                    className={`font-bold block mb-1 uppercase tracking-wider ${theme === "light" ? "text-indigo-600" : "text-purple-400"}`}
                  >
                    💡 Structural Logic Prompt Trace:
                  </span>
                  {questions[currentIndex].hint ||
                    "Analyze matching target conditional filter flags carefully."}
                </div>
              )}

              {showAnswer && (
                <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-xs font-mono text-emerald-600 dark:text-emerald-400 tracking-tight leading-relaxed transition-all animate-in zoom-in-95 duration-200">
                  <span className="font-bold block mb-1 uppercase tracking-wider text-emerald-500">
                    🔑 Verified Execution Statement Target:
                  </span>
                  <pre className="whitespace-pre-wrap">
                    {questions[currentIndex].correctQuery ||
                      "SELECT * FROM target_relation;"}
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
