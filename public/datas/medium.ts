import { SQLQuestion } from "@/types/quiz";

export const mediumQuestions: SQLQuestion[] = [
  {
    id: "g_m1",
    title: "YouTube: Content Creator Retention",
    difficulty: "Medium",
    company: "Google",
    tags: ["GROUP BY", "HAVING Clause", "Aggregation"],
    scenario: "YouTube analytics tracks channel loyalty. Find all `channel_id`s that have published videos across multiple categories, specifically channels with a total watch time exceeding 500,000 minutes across at least 2 distinct categories.",
    tableSchema: "videos(video_id INT, channel_id INT, category VARCHAR, watch_minutes INT)",
    correctQuery: "SELECT channel_id FROM videos GROUP BY channel_id HAVING COUNT(DISTINCT category) >= 2 AND SUM(watch_minutes) > 500000;",
    setupSQL: "CREATE TABLE videos (video_id INT, channel_id INT, category TEXT, watch_minutes INT); INSERT INTO videos VALUES (1, 10, 'Tech', 300000), (2, 10, 'Vlogs', 250000), (3, 11, 'Tech', 600000);",
    hint: "Group rows by channel_id, then apply multi-condition aggregates using the HAVING clause."
  },
  {
    id: "m_m1",
    title: "Facebook Messenger: Unreturned Conversations",
    difficulty: "Medium",
    company: "Meta",
    tags: ["Subqueries", "IN Operator", "Set Analysis"],
    scenario: "Find all `user_id`s who have sent a chat message but have *never* received an incoming message from any user in the system.",
    tableSchema: "chats(message_id INT, sender_id INT, receiver_id INT)",
    correctQuery: "SELECT DISTINCT sender_id FROM chats WHERE sender_id NOT IN (SELECT DISTINCT receiver_id FROM chats WHERE receiver_id IS NOT NULL);",
    setupSQL: "CREATE TABLE chats (message_id INT, sender_id INT, receiver_id INT); INSERT INTO chats VALUES (1, 1, 2), (2, 2, 3), (3, 1, 3);",
    hint: "Use an independent subquery to select all active receiver IDs, and filter main senders using NOT IN."
  },
  {
    id: "a_m1",
    title: "Amazon Prime: Identify Binge Watchers",
    difficulty: "Medium",
    company: "Amazon",
    tags: ["Window Functions", "ROW_NUMBER"],
    scenario: "Amazon Video wants to analyze viewing sessions. For each user, rank their streaming logs chronologically. Return the user ID, device, and watch date for their **second** logged stream.",
    tableSchema: "view_logs(log_id INT, user_id INT, device VARCHAR, watch_date TEXT)",
    correctQuery: "SELECT user_id, device, watch_date FROM (SELECT user_id, device, watch_date, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY watch_date ASC) as rn FROM view_logs) WHERE rn = 2;",
    setupSQL: "CREATE TABLE view_logs (log_id INT, user_id INT, device TEXT, watch_date TEXT); INSERT INTO view_logs VALUES (1, 101, 'TV', '2026-01-01'), (2, 101, 'Mobile', '2026-01-02'), (3, 102, 'PC', '2026-01-01');",
    hint: "Wrap a windowed ROW_NUMBER() ranking inside a subquery alias, then filter the outer block matching index 2."
  },
  {
    id: "n_m1",
    title: "Netflix: Active Subscription Gaps",
    difficulty: "Medium",
    company: "Netflix",
    tags: ["Conditional Logic", "CASE WHEN", "Ratios"],
    scenario: "Calculate the conversion health of Netflix subscriptions. Write a query showing each membership plan and the percentage share of accounts that are currently auto-renewing. Express it as a floating ratio decimal.",
    tableSchema: "subs(sub_id INT, plan_type VARCHAR, auto_renew INT)",
    correctQuery: "SELECT plan_type, AVG(CASE WHEN auto_renew = 1 THEN 1.0 ELSE 0.0 END) AS renewal_rate FROM subs GROUP BY plan_type;",
    setupSQL: "CREATE TABLE subs (sub_id INT, plan_type TEXT, auto_renew INT); INSERT INTO subs VALUES (1, 'Premium', 1), (2, 'Premium', 0), (3, 'Basic', 1);",
    hint: "Combine an inline CASE conditional expression directly inside an AVG mathematical aggregation block."
  },
  {
    id: "u_m1",
    title: "Uber Logistics: Identify Peak Pricing Shifts",
    difficulty: "Medium",
    company: "Uber",
    tags: ["Self Joins", "Time Deltas"],
    scenario: "Uber data platforms track dynamic surge pricing adjustments. Find all instances where a localized area's surge multiplier value doubled inside a single hour tracking period compared to its previous state record.",
    tableSchema: "surges(surge_id INT, area_id INT, multiplier REAL, log_hour INT)",
    correctQuery: "SELECT curr.area_id FROM surges curr JOIN surges prev ON curr.area_id = prev.area_id AND curr.log_hour = prev.log_hour + 1 WHERE curr.multiplier >= (prev.multiplier * 2);",
    setupSQL: "CREATE TABLE surges (surge_id INT, area_id INT, multiplier REAL, log_hour INT); INSERT INTO surges VALUES (1, 5, 1.2, 8), (2, 5, 2.5, 9), (3, 6, 1.5, 8);",
    hint: "Perform a self-join linking the dataset table onto itself matching exact identical area keys and sequential hourly states."
  }
];