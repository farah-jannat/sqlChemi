import { SQLQuestion } from "@/types/quiz";

export const hardQuestions: SQLQuestion[] = [
  {
    id: "g_h1",
    title: "Google AdSense: Running Total Ad Spend Threshold",
    difficulty: "Hard",
    company: "Google",
    tags: ["Window Functions", "Running Totals", "CTEs"],
    scenario:
      "Google accounts billing tracks daily advertiser expenditures. For each advertiser, calculate the running cumulative sum of their ad spend over time. Return the advertiser ID, log date, and the running total. Filter the final list to only include entries where the running total has exceeded $10,000.",
    tableSchema:
      "ad_spend(spend_id INT, advertiser_id INT, log_date TEXT, amount REAL)",
    correctQuery:
      "WITH RunningTotalCTE AS (SELECT advertiser_id, log_date, SUM(amount) OVER(PARTITION BY advertiser_id ORDER BY log_date ASC) AS cumulative_spend FROM ad_spend) SELECT * FROM RunningTotalCTE WHERE cumulative_spend > 10000;",
    setupSQL:
      "CREATE TABLE ad_spend (spend_id INT, advertiser_id INT, log_date TEXT, amount REAL); INSERT INTO ad_spend VALUES (1, 55, '2026-01-01', 4000.00), (2, 55, '2026-01-02', 7000.00), (3, 66, '2026-01-01', 2000.00);",
    hint: "Use a Common Table Expression (CTE) alongside a windowed SUM() framework, and filter the external query where the total meets the condition.",
  },
  {
    id: "m_h1",
    title: "Meta Graph: Mutual Friends Counter Matrix",
    difficulty: "Hard",
    company: "Meta",
    tags: ["Self Joins", "Advanced Aggregations", "Combinatorics"],
    scenario:
      "The Facebook recommendations engine needs to evaluate common ties. For every pair of unique users in the system who are **not** currently direct friends themselves, calculate the count of mutual friends they share. Output user_a, user_b, and the mutual count.",
    tableSchema: "friends(user_id INT, friend_id INT)",
    correctQuery:
      "SELECT f1.user_id AS user_a, f2.user_id AS user_b, COUNT(f1.friend_id) AS mutual_count FROM friends f1 JOIN friends f2 ON f1.friend_id = f2.friend_id WHERE f1.user_id < f2.user_id AND NOT EXISTS (SELECT 1 FROM friends direct WHERE direct.user_id = f1.user_id AND direct.friend_id = f2.user_id) GROUP BY f1.user_id, f2.user_id HAVING COUNT(f1.friend_id) > 0;",
    setupSQL:
      "CREATE TABLE friends (user_id INT, friend_id INT); INSERT INTO friends VALUES (1, 3), (2, 3), (1, 4), (2, 4), (1, 5);",
    hint: "Self-join the connection graph over matching shared friends, filter structural duplicates using user_a < user_b comparisons, and clear out explicit direct connections using a NOT EXISTS block.",
  },
  {
    id: "a_h1",
    title: "Amazon Logistics: Consecutive Active Warehouse Days",
    difficulty: "Hard",
    company: "Amazon",
    tags: ["Gaps and Islands", "LEAD/LAG", "Date Arithmetic"],
    scenario:
      "Amazon supply chain engineering maps labor sustainability indices. Identify warehouses that have processed packages for at least 3 consecutive calendar days. Return the unique warehouse IDs.",
    tableSchema: "operations(op_id INT, warehouse_id INT, shift_date TEXT)",
    correctQuery:
      "WITH RankedOps AS (SELECT DISTINCT warehouse_id, shift_date, JULIANDAY(shift_date) - ROW_NUMBER() OVER(PARTITION BY warehouse_id ORDER BY shift_date ASC) AS island_id FROM operations) SELECT DISTINCT warehouse_id FROM RankedOps GROUP BY warehouse_id, island_id HAVING COUNT(shift_date) >= 3;",
    setupSQL:
      "CREATE TABLE operations (op_id INT, warehouse_id INT, shift_date TEXT); INSERT INTO operations VALUES (1, 9, '2026-03-01'), (2, 9, '2026-03-02'), (3, 9, '2026-03-03'), (4, 8, '2026-03-01'), (5, 8, '2026-03-03');",
    hint: "This is a classical Gaps and Islands structure challenge. Subtract an absolute sequence order mapping from Julian calendar dates to isolate contiguous group structures.",
  },
  {
    id: "n_h1",
    title: "Netflix: MoM Subscriber Acquisition Rate Changes",
    difficulty: "Hard",
    company: "Netflix",
    tags: ["Window Functions", "LAG", "Growth Analytics"],
    scenario:
      "Netflix financial management reviews monthly acquisition fluctuations. Calculate the Month-over-Month growth rate percentage change for new signups. Return the current month value, current volume, and the percentage variance compared against the immediate previous month ledger.",
    tableSchema: "signups(user_id INT, join_month VARCHAR)",
    correctQuery:
      "WITH MonthlyCounts AS (SELECT join_month, COUNT(user_id) AS current_signups FROM signups GROUP BY join_month), GrowthCTE AS (SELECT join_month, current_signups, LAG(current_signups, 1) OVER (ORDER BY join_month ASC) AS previous_signups FROM MonthlyCounts) SELECT join_month, current_signups, ROUND(((current_signups - previous_signups) * 100.0 / previous_signups), 2) AS mom_growth_pct FROM GrowthCTE WHERE previous_signups IS NOT NULL;",
    setupSQL:
      "CREATE TABLE signups (user_id INT, join_month TEXT); INSERT INTO signups VALUES (1, '2026-01'), (2, '2026-01'), (3, '2026-02'), (4, '2026-02'), (5, '2026-02'), (6, '2026-03');",
    hint: "Consolidate active aggregate registers into distinct monthly buckets, pull lagging rows using LAG(), and evaluate growth rates via standardized variance mathematical logic formulas.",
  },
  {
    id: "u_h1",
    title: "Uber Marketplaces: Detect Fraudulent Trip Loops",
    difficulty: "Hard",
    company: "Uber",
    tags: ["Self Joins", "Correlated Subqueries", "Geospatial Approximations"],
    scenario:
      "Uber trust and safety models catch driver cancellation abuse schemes. Isolate drivers who have logged two completely independent cancellations within 15 minutes of each other in the same service sector area. Output the driver identifier code.",
    tableSchema:
      "ride_records(record_id INT, driver_id INT, status VARCHAR, area_id INT, log_time TEXT)",
    correctQuery:
      "SELECT DISTINCT t1.driver_id FROM ride_records t1 JOIN ride_records t2 ON t1.driver_id = t2.driver_id AND t1.record_id < t2.record_id WHERE t1.status = 'Cancelled' AND t2.status = 'Cancelled' AND t1.area_id = t2.area_id AND (JULIANDAY(t2.log_time) - JULIANDAY(t1.log_time)) * 1444.0 <= 15.0;",
    setupSQL:
      "CREATE TABLE ride_records (record_id INT, driver_id INT, status TEXT, area_id INT, log_time TEXT); INSERT INTO ride_records VALUES (1, 40, 'Cancelled', 7, '2026-04-01 10:00:00'), (2, 40, 'Cancelled', 7, '2026-04-01 10:12:00'), (3, 50, 'Cancelled', 7, '2026-04-01 10:00:00');",
    hint: "Self-join transaction logs over matching driver markers, assert identical target region locations, and apply SQLite JULIANDAY minute conversion modifiers to isolate narrow time bounds.",
  },
];
