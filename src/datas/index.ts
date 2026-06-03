// import { SQLQuestion } from "@/types/quiz";

// // export const seedQuestions: SQLQuestion[] = [

// export const themedQuestionBanks: Record<
//   string,
//   {
//     Easy: SQLQuestion[];
//     Medium: SQLQuestion[];
//     Hard: SQLQuestion[];
//   }
// > = {

//   saas: {
//     Easy: [
//       {
//         id: "se1",
//         title: "Find All Active Users",
//         difficulty: "Easy",
//         scenario:
//           "Retrieve the `user_id` and `user_name` of all users at {companyName} with an 'active' status.",
//         tableSchema: "users(user_id, user_name, status)",
//         correctQuery:
//           "SELECT user_id, user_name FROM users WHERE status = 'active';",
//         setupSQL:
//           "CREATE TABLE users (user_id INT, user_name TEXT, status TEXT); INSERT INTO users VALUES (1, 'Alice', 'active'), (2, 'Bob', 'inactive'), (3, 'Charlie', 'active');",
//         hint: "Use a simple WHERE condition filtering values exactly equal to 'active'.",
//       },
//       {
//         id: "se2",
//         title: "Count Issues by Type",
//         difficulty: "Easy",
//         scenario: "Count the number of issues for each `issue_type`.",
//         tableSchema: "issues(issue_id, issue_type)",
//         correctQuery:
//           "SELECT issue_type, COUNT(issue_id) AS issue_count FROM issues GROUP BY issue_type;",
//         setupSQL:
//           "CREATE TABLE issues (issue_id INT, issue_type TEXT); INSERT INTO issues VALUES (101, 'Bug'), (102, 'Feature'), (103, 'Bug'), (104, 'Task');",
//         hint: "Combine the COUNT aggregates with a GROUP BY clause on the issue_type column.",
//       },
//       {
//         id: "se3",
//         title: "Find Projects with No Issues",
//         difficulty: "Easy",
//         scenario: "Identify all projects that have no issues reported in them.",
//         tableSchema:
//           "projects(project_id, project_name)\nissues(issue_id, project_id)",
//         correctQuery:
//           "SELECT p.project_id, p.project_name FROM projects p LEFT JOIN issues i ON p.project_id = i.project_id WHERE i.issue_id IS NULL;",
//         setupSQL:
//           "CREATE TABLE projects (project_id INT, project_name TEXT); CREATE TABLE issues (issue_id INT, project_id INT); INSERT INTO projects VALUES (1, 'Jira'), (2, 'Confluence'), (3, 'Bitbucket'); INSERT INTO issues VALUES (101, 1), (102, 3);",
//         hint: "Perform a LEFT JOIN from projects to issues, filtering for records where the issue identifier IS NULL.",
//       },
//       {
//         id: "se4",
//         title: "Find Recent Comments",
//         difficulty: "Easy",
//         scenario: "Retrieve all comments created on or after '2025-08-01'.",
//         tableSchema: "comments(comment_id, comment_text, created_at)",
//         correctQuery:
//           "SELECT * FROM comments WHERE created_at >= '2025-08-01';",
//         setupSQL:
//           "CREATE TABLE comments (comment_id INT, comment_text TEXT, created_at TEXT); INSERT INTO comments VALUES (1, 'First comment', '2025-07-31'), (2, 'Second comment', '2025-08-01'), (3, 'Third comment', '2025-08-02');",
//         hint: "Apply a standard comparison operator (>=) within your filter clause against the calendar literal value.",
//       },
//       {
//         id: "se5",
//         title: "Users with a Specific Email Domain",
//         difficulty: "Easy",
//         scenario:
//           "Find all users whose email address ends with '@example.com'.",
//         tableSchema: "users(user_id, user_name, email)",
//         correctQuery:
//           "SELECT user_id, user_name FROM users WHERE email LIKE '%@example.com';",
//         setupSQL:
//           "CREATE TABLE users (user_id INT, user_name TEXT, email TEXT); INSERT INTO users VALUES (1, 'Alice', 'alice@example.com'), (2, 'Bob', 'bob@work.com'), (3, 'Charlie', 'charlie@example.com');",
//         hint: "Utilize the LIKE text pattern operator alongside a wild card character (%) tracking the specific suffix value.",
//       },
//       {
//         id: "se6",
//         title: "Count Comments per Issue",
//         difficulty: "Easy",
//         scenario: "For each issue, count the total number of comments.",
//         tableSchema: "comments(comment_id, issue_id)",
//         correctQuery:
//           "SELECT issue_id, COUNT(comment_id) AS comment_count FROM comments GROUP BY issue_id;",
//         setupSQL:
//           "CREATE TABLE comments (comment_id INT, issue_id INT); INSERT INTO comments VALUES (1, 101), (2, 101), (3, 102), (4, 101);",
//         hint: "Group target entries by the common structural element id field while tallying rows with COUNT.",
//       },
//       {
//         id: "se7",
//         title: "Find Critical Priority Issues",
//         difficulty: "Easy",
//         scenario: "Select all issues that have a 'Critical' priority.",
//         tableSchema: "issues(issue_id, summary, priority)",
//         correctQuery: "SELECT * FROM issues WHERE priority = 'Critical';",
//         setupSQL:
//           "CREATE TABLE issues (issue_id INT, summary TEXT, priority TEXT); INSERT INTO issues VALUES (1, 'UI Glitch', 'Medium'), (2, 'System Crash', 'Critical'), (3, 'Typo in docs', 'Low');",
//         hint: "Run a simple conditional expression validation asserting exact string parameter matching configuration.",
//       },
//       {
//         id: "se8",
//         title: "List Unique Project Statuses",
//         difficulty: "Easy",
//         scenario: "Get a list of all unique statuses a project can have.",
//         tableSchema: "projects(project_id, status)",
//         correctQuery: "SELECT DISTINCT status FROM projects;",
//         setupSQL:
//           "CREATE TABLE projects (project_id INT, status TEXT); INSERT INTO projects VALUES (1, 'Active'), (2, 'On Hold'), (3, 'Active'), (4, 'Archived');",
//         hint: "Prepend your target attribute with the unique processing keyword identifier modifier.",
//       },
//       {
//         id: "se9",
//         title: "Find a Specific User",
//         difficulty: "Easy",
//         scenario: "Retrieve all information for the user named 'Bob'.",
//         tableSchema: "users(user_id, user_name, email)",
//         correctQuery: "SELECT * FROM users WHERE user_name = 'Bob';",
//         setupSQL:
//           "CREATE TABLE users (user_id INT, user_name TEXT, email TEXT); INSERT INTO users VALUES (1, 'Alice', 'a@a.com'), (2, 'Bob', 'b@b.com');",
//         hint: "Extract wild-card components where string column structures strictly equate with your target user definition configuration.",
//       },
//       {
//         id: "se10",
//         title: "Issues Assigned to a User",
//         difficulty: "Easy",
//         scenario:
//           "Find all issues assigned to the user with `assignee_id` = 1.",
//         tableSchema: "issues(issue_id, summary, assignee_id)",
//         correctQuery:
//           "SELECT issue_id, summary FROM issues WHERE assignee_id = 1;",
//         setupSQL:
//           "CREATE TABLE issues (issue_id INT, summary TEXT, assignee_id INT); INSERT INTO issues VALUES (101, 'Fix login', 1), (102, 'Update docs', 2), (103, 'Deploy fix', 1);",
//         hint: "Filter fields down with matching assignments utilizing structural equal sign evaluations.",
//       },
//     ],
//     Medium: [
//       {
//         id: "sm1",
//         title: "Users Who Commented on Their Own Issues",
//         difficulty: "Medium",
//         scenario:
//           "Identify users from {companyName} who have commented on an issue they also reported. Return the `user_id` and `user_name`.",
//         tableSchema:
//           "users(user_id, user_name)\nissues(issue_id, reporter_id)\ncomments(comment_id, issue_id, author_id)",
//         correctQuery:
//           "SELECT DISTINCT u.user_id, u.user_name FROM users u JOIN issues i ON u.user_id = i.reporter_id JOIN comments c ON i.issue_id = c.issue_id AND u.user_id = c.author_id;",
//         setupSQL:
//           "CREATE TABLE users (user_id INT, user_name TEXT); CREATE TABLE issues (issue_id INT, reporter_id INT); CREATE TABLE comments (comment_id INT, issue_id INT, author_id INT); INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'); INSERT INTO issues VALUES (101, 1), (102, 2); INSERT INTO comments VALUES (1, 101, 1), (2, 101, 2), (3, 102, 1);",
//         hint: "Join tables using both the issue references and structural matches checking where user metrics point to overlapping roles.",
//       },
//       {
//         id: "sm2",
//         title: "Average Comments Before Closure",
//         difficulty: "Medium",
//         scenario:
//           "Calculate the average number of comments an issue receives before it is marked 'Closed'.",
//         tableSchema:
//           "comments(comment_id, issue_id)\nissue_history(history_id, issue_id, status)",
//         correctQuery:
//           "WITH CommentCounts AS (SELECT issue_id, COUNT(comment_id) as num_comments FROM comments GROUP BY issue_id), ClosedIssues AS (SELECT DISTINCT issue_id FROM issue_history WHERE status = 'Closed') SELECT AVG(cc.num_comments) FROM CommentCounts cc JOIN ClosedIssues ci ON cc.issue_id = ci.issue_id;",
//         setupSQL:
//           "CREATE TABLE comments (comment_id INT, issue_id INT); CREATE TABLE issue_history (history_id INT, issue_id INT, status TEXT); INSERT INTO comments VALUES (1, 101), (2, 101), (3, 102); INSERT INTO issue_history VALUES (1, 101, 'Closed'), (2, 102, 'Closed'), (3, 103, 'Open');",
//         hint: "Write an aggregate Common Table Expression (CTE) to pre-calculate total items prior to computing execution results across joined rows.",
//       },
//       {
//         id: "sm3",
//         title: "Second Most Recent Comment",
//         difficulty: "Medium",
//         scenario: "For each user, find their second most recent comment.",
//         tableSchema: "comments(user_id, comment_text, created_at)",
//         correctQuery:
//           "WITH RankedComments AS (SELECT user_id, comment_text, ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY created_at DESC) as rn FROM comments) SELECT user_id, comment_text FROM RankedComments WHERE rn = 2;",
//         setupSQL:
//           "CREATE TABLE comments (user_id INT, comment_text TEXT, created_at TEXT); INSERT INTO comments VALUES (1, 'First', '2025-01-01'), (1, 'Second', '2025-01-02'), (1, 'Third', '2025-01-03'), (2, 'A', '2025-01-04'), (2, 'B', '2025-01-05');",
//         hint: "Leverage advanced analytical window evaluation components like ROW_NUMBER() grouping items via PARTITION BY definitions.",
//       },
//       {
//         id: "sm4",
//         title: "Inactive Users",
//         difficulty: "Medium",
//         scenario:
//           "Find users who have not created an issue or a comment in the last 90 days (relative to '2025-08-11').",
//         tableSchema:
//           "users(user_id, user_name)\nissues(reporter_id, created_at)\ncomments(author_id, created_at)",
//         correctQuery:
//           "WITH LastActivity AS (SELECT user_id, MAX(activity_date) as last_date FROM (SELECT reporter_id as user_id, created_at as activity_date FROM issues UNION ALL SELECT author_id, created_at FROM comments) AS AllActivity GROUP BY user_id) SELECT u.user_id, u.user_name FROM users u LEFT JOIN LastActivity la ON u.user_id = la.user_id WHERE la.last_date IS NULL OR la.last_date < DATE('2025-08-11', '-90 days');",
//         setupSQL:
//           "CREATE TABLE users(user_id INT, user_name TEXT); CREATE TABLE issues(reporter_id INT, created_at TEXT); CREATE TABLE comments(author_id INT, created_at TEXT); INSERT INTO users VALUES (1, 'Active User'), (2, 'Inactive User'); INSERT INTO issues VALUES (1, '2025-08-01'); INSERT INTO comments VALUES (1, '2025-08-02');",
//         hint: "Consolidate chronological metrics across separate entity lists using UNION ALL prior to evaluating dates.",
//       },
//       {
//         id: "sm5",
//         title: "Projects and Their User Count",
//         difficulty: "Medium",
//         scenario:
//           "List each project and the number of unique users who have commented on it.",
//         tableSchema:
//           "projects(project_id, project_name)\ncomments(project_id, user_id)",
//         correctQuery:
//           "SELECT p.project_name, COUNT(DISTINCT c.user_id) as user_count FROM projects p LEFT JOIN comments c ON p.project_id = c.project_id GROUP BY p.project_name;",
//         setupSQL:
//           "CREATE TABLE projects(project_id INT, project_name TEXT); CREATE TABLE comments(project_id INT, user_id INT); INSERT INTO projects VALUES (1, 'Jira'), (2, 'Confluence'); INSERT INTO comments VALUES (1, 1), (1, 2), (1, 1), (2, 3);",
//         hint: "Utilize COUNT(DISTINCT user_id) to accurately map unique engagement values across project aggregations.",
//       },
//       {
//         id: "sm6",
//         title: "Monthly Active Users (MAU)",
//         difficulty: "Medium",
//         scenario:
//           "Calculate the number of unique active users for each month in 2025.",
//         tableSchema: "activity_log(user_id, event_date)",
//         correctQuery:
//           "SELECT STRFTIME('%Y-%m', event_date) as month, COUNT(DISTINCT user_id) as mau FROM activity_log WHERE STRFTIME('%Y', event_date) = '2025' GROUP BY month;",
//         setupSQL:
//           "CREATE TABLE activity_log(user_id INT, event_date TEXT); INSERT INTO activity_log VALUES (1, '2025-01-10'), (2, '2025-01-15'), (1, '2025-01-20'), (3, '2025-02-05'), (1, '2025-02-10');",
//         hint: "Employ date format functions like STRFTIME to convert timestamp values into monthly string blocks.",
//       },
//       {
//         id: "sm7",
//         title: "Issues with No Comments",
//         difficulty: "Medium",
//         scenario: "Find all issues that have not received any comments.",
//         tableSchema:
//           "issues(issue_id, summary)\ncomments(comment_id, issue_id)",
//         correctQuery:
//           "SELECT i.issue_id, i.summary FROM issues i LEFT JOIN comments c ON i.issue_id = c.issue_id WHERE c.comment_id IS NULL;",
//         setupSQL:
//           "CREATE TABLE issues(issue_id INT, summary TEXT); CREATE TABLE comments(comment_id INT, issue_id INT); INSERT INTO issues VALUES (101, 'Bug A'), (102, 'Feature B'); INSERT INTO comments VALUES (1, 101);",
//         hint: "Isolate unmatched mappings after performing an outer join operations layout.",
//       },
//       {
//         id: "sm8",
//         title: "User with Most Bug Reports",
//         difficulty: "Medium",
//         scenario: "Find the user who has reported the most 'Bug' type issues.",
//         tableSchema:
//           "users(user_id, user_name)\nissues(reporter_id, issue_type)",
//         correctQuery:
//           "SELECT u.user_name FROM users u JOIN issues i ON u.user_id = i.reporter_id WHERE i.issue_type = 'Bug' GROUP BY u.user_name ORDER BY COUNT(i.issue_id) DESC LIMIT 1;",
//         setupSQL:
//           "CREATE TABLE users(user_id INT, user_name TEXT); CREATE TABLE issues(reporter_id INT, issue_type TEXT); INSERT INTO users VALUES(1, 'Alice'), (2, 'Bob'); INSERT INTO issues VALUES (1, 'Bug'), (1, 'Bug'), (2, 'Feature'), (2, 'Bug');",
//         hint: "Organize calculations via structural counts sorted in descending sequence layouts with a LIMIT value.",
//       },
//       {
//         id: "sm9",
//         title: "Average Time to First Comment",
//         difficulty: "Medium",
//         scenario:
//           "Calculate the average time (in hours) between an issue's creation and its first comment.",
//         tableSchema:
//           "issues(issue_id, created_at)\ncomments(issue_id, created_at)",
//         correctQuery:
//           "WITH FirstComments AS (SELECT issue_id, MIN(created_at) as first_comment_time FROM comments GROUP BY issue_id) SELECT AVG((JULIANDAY(fc.first_comment_time) - JULIANDAY(i.created_at)) * 24) as avg_hours_to_comment FROM issues i JOIN FirstComments fc ON i.issue_id = fc.issue_id;",
//         setupSQL:
//           "CREATE TABLE issues(issue_id INT, created_at TEXT); CREATE TABLE comments(issue_id INT, created_at TEXT); INSERT INTO issues VALUES (101, '2025-08-01 10:00:00'); INSERT INTO comments VALUES (101, '2025-08-01 12:30:00');",
//         hint: "Compute baseline timestamps values using standard SQL day conversion functions multiplied across hourly periods.",
//       },
//       {
//         id: "sm10",
//         title: "Subscription Plan Breakdown",
//         difficulty: "Medium",
//         scenario: "Count the number of users on each subscription plan.",
//         tableSchema: "users(user_id, plan_id)\nplans(plan_id, plan_name)",
//         correctQuery:
//           "SELECT p.plan_name, COUNT(u.user_id) as user_count FROM plans p JOIN users u ON p.plan_id = u.plan_id GROUP BY p.plan_name;",
//         setupSQL:
//           "CREATE TABLE users(user_id INT, plan_id INT); CREATE TABLE plans(plan_id INT, plan_name TEXT); INSERT INTO plans VALUES (1, 'Free'), (2, 'Premium'); INSERT INTO users VALUES (1, 1), (2, 2), (3, 1), (4, 2), (5, 2);",
//         hint: "Join structural map files checking where plan properties intersect categorical identifiers.",
//       },
//     ],
//     Hard: [], // Ready for your hard questions later!
//   },
// };

import { SQLQuestion } from "@/types/quiz"; // Adjust path to your interface
import { easyQuestions } from "./easy";
import { mediumQuestions } from "./medium";
import { hardQuestions } from "./hard";

// This merges everything into a clean 100-question flat array
export const seedQuestions: SQLQuestion[] = [
  ...easyQuestions,
  ...mediumQuestions,
  ...hardQuestions,
];

// export const seedQuestions: SQLQuestion[] = [
//   // =========================================================================
//   // EASY QUESTIONS
//   // =========================================================================
//   {
//     id: "se11",
//     title: "Spotify: Top Streamed Artists",
//     difficulty: "Easy",
//     company: "Spotify",
//     tags: ["Filtering", "Sorting"],
//     scenario:
//       "Identify all songs that have been streamed more than 100 million times. Return the `track_name` and `stream_count`, sorted from highest to lowest streams.",
//     tableSchema:
//       "songs(track_id INT, track_name VARCHAR, artist VARCHAR, stream_count INT)",
//     correctQuery:
//       "SELECT track_name, stream_count FROM songs WHERE stream_count > 100000000 ORDER BY stream_count DESC;",
//     setupSQL:
//       "CREATE TABLE songs (track_id INT, track_name TEXT, artist TEXT, stream_count INT); INSERT INTO songs VALUES (1, 'Shape of You', 'Ed Sheeran', 150000000), (2, 'Yesterday', 'The Beatles', 50000000), (3, 'Blinding Lights', 'The Weeknd', 200000000);",
//     hint: "Use a simple numeric evaluation in your WHERE clause and combine it with an ORDER BY clause tracking descending values.",
//   },
//   {
//     id: "se12",
//     title: "Uber: High Rating Trips",
//     difficulty: "Easy",
//     company: "Uber",
//     tags: ["Basic Filtering", "Logical Operators"],
//     scenario:
//       "Uber's quality team wants to look into standard trips. Find all completed trips where the driver rating was a perfect 5.0 and the ride status was 'Completed'.",
//     tableSchema:
//       "trips(trip_id INT, driver_id INT, status VARCHAR, driver_rating FLOAT)",
//     correctQuery:
//       "SELECT * FROM trips WHERE status = 'Completed' AND driver_rating = 5.0;",
//     setupSQL:
//       "CREATE TABLE trips (trip_id INT, driver_id INT, status TEXT, driver_rating REAL); INSERT INTO trips VALUES (101, 20, 'Completed', 5.0), (102, 21, 'Cancelled', 5.0), (103, 22, 'Completed', 4.2);",
//     hint: "Connect multiple evaluation expressions inside your filtering block using the logical AND operator.",
//   },
//   {
//     id: "se13",
//     title: "Airbnb: Find Available Rentals",
//     difficulty: "Easy",
//     company: "Airbnb",
//     tags: ["Null Handling", "Filtering"],
//     scenario:
//       "Airbnb hosts want to review empty dates. Write a query to list all properties that do not have a guest checked in currently (i.e., `guest_id` is missing).",
//     tableSchema:
//       "bookings(property_id INT, property_name VARCHAR, guest_id INT)",
//     correctQuery:
//       "SELECT property_id, property_name FROM bookings WHERE guest_id IS NULL;",
//     setupSQL:
//       "CREATE TABLE bookings (property_id INT, property_name TEXT, guest_id INT); INSERT INTO bookings VALUES (1, 'Cozy Cabin', 501), (2, 'Modern Condo', NULL), (3, 'Beachfront Villa', NULL);",
//     hint: "To filter for records missing a value, assert structural alignment against empty fields using the 'IS NULL' syntax.",
//   },
//   {
//     id: "se14",
//     title: "Shopify: Calculate Total Revenue",
//     difficulty: "Easy",
//     company: "Shopify",
//     tags: ["Aggregation", "Sum"],
//     scenario:
//       "Find the total total gross earnings from all sales processed through the Shopify storefront system.",
//     tableSchema: "sales(order_id INT, product_id INT, total_price REAL)",
//     correctQuery: "SELECT SUM(total_price) AS total_revenue FROM sales;",
//     setupSQL:
//       "CREATE TABLE sales (order_id INT, product_id INT, total_price REAL); INSERT INTO sales VALUES (1, 99, 45.50), (2, 101, 120.00), (3, 99, 15.00);",
//     hint: "Apply the collective mathematical SUM aggregation across the pricing attribute configuration.",
//   },
//   {
//     id: "se15",
//     title: "TikTok: Video Interaction Counter",
//     difficulty: "Easy",
//     company: "TikTok",
//     tags: ["Aggregation", "Group By"],
//     scenario:
//       "For each unique video posted, calculate the total count of likes recorded in the database metrics tracking table.",
//     tableSchema: "video_likes(like_id INT, video_id INT, user_id INT)",
//     correctQuery:
//       "SELECT video_id, COUNT(like_id) AS total_likes FROM video_likes GROUP BY video_id;",
//     setupSQL:
//       "CREATE TABLE video_likes (like_id INT, video_id INT, user_id INT); INSERT INTO video_likes VALUES (1, 701, 11), (2, 701, 12), (3, 702, 11);",
//     hint: "Combine structural aggregation counts using COUNT alongside a categorical map breakdown using GROUP BY.",
//   },
//   {
//     id: "se16",
//     title: "Zoom: Long Meetings Analysis",
//     difficulty: "Easy",
//     company: "Zoom",
//     tags: ["Basic Filtering"],
//     scenario:
//       "Zoom's network optimization team needs data on high-bandwidth calls. Retrieve a list of meeting IDs that lasted longer than 60 minutes.",
//     tableSchema: "meetings(meeting_id INT, host_id INT, duration_minutes INT)",
//     correctQuery:
//       "SELECT meeting_id FROM meetings WHERE duration_minutes > 60;",
//     setupSQL:
//       "CREATE TABLE meetings (meeting_id INT, host_id INT, duration_minutes INT); INSERT INTO meetings VALUES (401, 9, 30), (402, 12, 90), (403, 14, 65);",
//     hint: "Write a traditional standard quantitative assertion expression using the greater-than character (>).",
//   },
//   {
//     id: "se17",
//     title: "Duolingo: Active Streak Check",
//     difficulty: "Easy",
//     company: "Duolingo",
//     tags: ["Filtering", "Distinct"],
//     scenario:
//       "Find all unique user IDs who logged a learning event on today's calendar date '2026-06-03'.",
//     tableSchema: "daily_progress(log_id INT, user_id INT, activity_date TEXT)",
//     correctQuery:
//       "SELECT DISTINCT user_id FROM daily_progress WHERE activity_date = '2026-06-03';",
//     setupSQL:
//       "CREATE TABLE daily_progress (log_id INT, user_id INT, activity_date TEXT); INSERT INTO daily_progress VALUES (1, 88, '2026-06-03'), (2, 88, '2026-06-03'), (3, 99, '2026-06-02');",
//     hint: "Prepend the targeted column element identifier modifier using DISTINCT to avoid reading duplicate user values.",
//   },
//   {
//     id: "se18",
//     title: "DoorDash: Average Delivery Time",
//     difficulty: "Easy",
//     company: "DoorDash",
//     tags: ["Aggregation", "Average"],
//     scenario:
//       "Calculate the average time (in minutes) it takes for a dasher to drop off food deliveries once an order leaves the restaurant.",
//     tableSchema:
//       "deliveries(delivery_id INT, dasher_id INT, duration_minutes INT)",
//     correctQuery:
//       "SELECT AVG(duration_minutes) AS average_duration FROM deliveries;",
//     setupSQL:
//       "CREATE TABLE deliveries (delivery_id INT, dasher_id INT, duration_minutes INT); INSERT INTO deliveries VALUES (1, 55, 18), (2, 56, 32), (3, 55, 25);",
//     hint: "Use the mathematical system grouping modifier AVG() across target metric intervals.",
//   },
//   {
//     id: "se19",
//     title: "Pinterest: Search Board Matching",
//     difficulty: "Easy",
//     company: "Pinterest",
//     tags: ["Pattern Matching", "LIKE"],
//     scenario:
//       "Users often search for aesthetic designs. Find all boards where the `board_title` contains the word 'Room' anywhere in its description name string.",
//     tableSchema: "boards(board_id INT, user_id INT, board_title VARCHAR)",
//     correctQuery: "SELECT * FROM boards WHERE board_title LIKE '%Room%';",
//     setupSQL:
//       "CREATE TABLE boards (board_id INT, user_id INT, board_title TEXT); INSERT INTO boards VALUES (1, 10, 'Aesthetic Room Decor'), (2, 10, 'Gardening Tips'), (3, 11, 'Cozy Living Room Ideas');",
//     hint: "Implement contextual keyword extraction by framing your pattern template query inside double wild-card percentage symbols like '%Word%'.",
//   },
//   {
//     id: "se20",
//     title: "Tesla: Active Supercharger Outlets",
//     difficulty: "Easy",
//     company: "Tesla",
//     tags: ["Filtering"],
//     scenario:
//       "Identify all Tesla Supercharger charging stations that are currently situated in the 'California' territory region.",
//     tableSchema:
//       "stations(station_id INT, location_city VARCHAR, state VARCHAR)",
//     correctQuery:
//       "SELECT station_id, location_city FROM stations WHERE state = 'California';",
//     setupSQL:
//       "CREATE TABLE stations (station_id INT, location_city TEXT, state TEXT); INSERT INTO stations VALUES (1, 'Los Angeles', 'California'), (2, 'Austin', 'Texas'), (3, 'San Francisco', 'California');",
//     hint: "Filter text variables strictly by applying a clean direct string verification against your intended string parameter state target.",
//   },

//   {
//     id: "se21",
//     title: "Netflix: Top 3 Longest Movies",
//     difficulty: "Easy",
//     company: "Netflix",
//     tags: ["LIMIT", "Sorting"],
//     scenario:
//       "Netflix wants to feature long-form content. Write a query to find the top 3 longest films in the catalog. Return the `title` and `duration_minutes` sorted from longest to shortest.",
//     tableSchema: "movies(movie_id INT, title VARCHAR, duration_minutes INT)",
//     correctQuery:
//       "SELECT title, duration_minutes FROM movies ORDER BY duration_minutes DESC LIMIT 3;",
//     setupSQL:
//       "CREATE TABLE movies (movie_id INT, title TEXT, duration_minutes INT); INSERT INTO movies VALUES (1, 'The Irishman', 209), (2, 'Extraction', 116), (3, 'Roma', 135), (4, 'Red Notice', 118);",
//     hint: "Sort the duration column in descending order (`DESC`) first, and then cap the total output records by ending the query with `LIMIT 3`.",
//   },
//   {
//     id: "se22",
//     title: "Amazon: Calculative Profit Margins",
//     difficulty: "Easy",
//     company: "Amazon",
//     tags: ["Mathematical Operators", "Column Aliasing"],
//     scenario:
//       "For each item sold, calculate its raw profit by subtracting `cost_price` from `sale_price`. Return the `product_id` and name the calculated column as `raw_profit`.",
//     tableSchema:
//       "inventory(product_id INT, product_name VARCHAR, cost_price REAL, sale_price REAL)",
//     correctQuery:
//       "SELECT product_id, (sale_price - cost_price) AS raw_profit FROM inventory;",
//     setupSQL:
//       "CREATE TABLE inventory (product_id INT, product_name TEXT, cost_price REAL, sale_price REAL); INSERT INTO inventory VALUES (1, 'Kindle', 70.00, 99.99), (2, 'Echo Dot', 25.00, 49.99);",
//     hint: "You can perform direct arithmetic operations between two numeric columns inside your SELECT statement. Use `AS raw_profit` to assign the column alias.",
//   },
//   {
//     id: "se23",
//     title: "Slack: High Volume Channel Filtering",
//     difficulty: "Easy",
//     company: "Slack",
//     tags: ["GROUP BY", "HAVING Clause"],
//     scenario:
//       "Slack analytics tracks workspace activity. Write a query to find all `channel_id`s that have received strictly more than 2 messages total.",
//     tableSchema: "messages(message_id INT, channel_id INT, user_id INT)",
//     correctQuery:
//       "SELECT channel_id FROM messages GROUP BY channel_id HAVING COUNT(message_id) > 2;",
//     setupSQL:
//       "CREATE TABLE messages (message_id INT, channel_id INT, user_id INT); INSERT INTO messages VALUES (1, 101, 1), (2, 101, 2), (3, 101, 3), (4, 102, 1);",
//     hint: "Because you are filtering on an aggregated condition (`COUNT()`), you cannot use `WHERE`. You must group by `channel_id` and filter using a `HAVING` clause.",
//   },
//   {
//     id: "se24",
//     title: "Shopify: Checkout Status Mapping",
//     difficulty: "Easy",
//     company: "Shopify",
//     tags: ["CASE WHEN", "Conditional Logic"],
//     scenario:
//       "Create a descriptive summary list of checkouts. If `is_completed` equals 1, display it as 'Paid'. For any other value, display it as 'Pending'. Label this conditional column as `payment_status`.",
//     tableSchema:
//       "checkouts(checkout_id INT, total_amount REAL, is_completed INT)",
//     correctQuery:
//       "SELECT checkout_id, CASE WHEN is_completed = 1 THEN 'Paid' ELSE 'Pending' END AS payment_status FROM checkouts;",
//     setupSQL:
//       "CREATE TABLE checkouts (checkout_id INT, total_amount REAL, is_completed INT); INSERT INTO checkouts VALUES (1, 45.00, 1), (2, 12.50, 0);",
//     hint: "Implement conditional branching directly in your projection list using a `CASE WHEN condition THEN outcome ELSE alternative END` block.",
//   },
//   {
//     id: "se25",
//     title: "LinkedIn: Standardization of Job Roles",
//     difficulty: "Easy",
//     company: "LinkedIn",
//     tags: ["String Functions", "UPPER"],
//     scenario:
//       "LinkedIn search indices require unified casings. Retrieve all user profile IDs and their `job_title`s, converting the job text into complete uppercase letters. Alias the column as `clean_title`.",
//     tableSchema: "profiles(profile_id INT, job_title VARCHAR)",
//     correctQuery:
//       "SELECT profile_id, UPPER(job_title) AS clean_title FROM profiles;",
//     setupSQL:
//       "CREATE TABLE profiles (profile_id INT, job_title TEXT); INSERT INTO profiles VALUES (1, 'Software Engineer'), (2, 'data analyst');",
//     hint: "Wrap your target string column identifier inside the standard scalar processing function `UPPER()`.",
//   },
//   {
//     id: "se26",
//     title: "Lyft: Filter Rides by Month",
//     difficulty: "Easy",
//     company: "Lyft",
//     tags: ["Date Parsing", "STRFTIME"],
//     scenario:
//       "Lyft's regional data engineers need records specifically from January 2026. Write a query to find all `ride_id`s where the `ride_date` occurred in the month of January 2026.",
//     tableSchema: "rides(ride_id INT, driver_id INT, ride_date TEXT)",
//     correctQuery:
//       "SELECT ride_id FROM rides WHERE STRFTIME('%Y-%m', ride_date) = '2026-01';",
//     setupSQL:
//       "CREATE TABLE rides (ride_id INT, driver_id INT, ride_date TEXT); INSERT INTO rides VALUES (1, 501, '2026-01-15 08:30:00'), (2, 502, '2026-02-01 12:00:00');",
//     hint: "Use SQLite's `STRFTIME('%Y-%m', column)` function inside the filter block to extract just the Year-Month portion of your text timestamps.",
//   },
//   {
//     id: "se27",
//     title: "DoorDash: Correlating Orders and Dashers",
//     difficulty: "Easy",
//     company: "DoorDash",
//     tags: ["INNER JOIN", "Multi-table Linking"],
//     scenario:
//       "Match delivery assignments cleanly. Write an INNER JOIN query that retrieves the `customer_order_id` along with the matching dasher's `real_name`.",
//     tableSchema:
//       "orders(order_id INT, customer_order_id VARCHAR, dasher_id INT)\ndashers(dasher_id INT, real_name VARCHAR)",
//     correctQuery:
//       "SELECT o.customer_order_id, d.real_name FROM orders o JOIN dashers d ON o.dasher_id = d.dasher_id;",
//     setupSQL:
//       "CREATE TABLE orders (order_id INT, customer_order_id TEXT, dasher_id INT); CREATE TABLE dashers (dasher_id INT, real_name TEXT); INSERT INTO orders VALUES (1, 'ORD-99', 10), (2, 'ORD-100', 11); INSERT INTO dashers VALUES (10, 'Rahman'), (11, 'Sultana');",
//     hint: "Link both relational models by writing a standard `JOIN` statement connected via the matching `dasher_id` foreign key constraint.",
//   },
//   {
//     id: "se28",
//     title: "Airbnb: Find Specific Price Ranges",
//     difficulty: "Easy",
//     company: "Airbnb",
//     tags: ["BETWEEN Operator", "Filtering"],
//     scenario:
//       "A traveler is searching for budget accommodations. Find all unique property listings where the `price_per_night` is within the range of $50 to $150 inclusive.",
//     tableSchema:
//       "listings(property_id INT, title VARCHAR, price_per_night REAL)",
//     correctQuery:
//       "SELECT * FROM listings WHERE price_per_night BETWEEN 50 AND 150;",
//     setupSQL:
//       "CREATE TABLE listings (property_id INT, title TEXT, price_per_night REAL); INSERT INTO listings VALUES (1, 'Shared Room Centro', 45.00), (2, 'Private Suite Loft', 120.00), (3, 'Luxury Penthouse', 450.00);",
//     hint: "Instead of writing two distinct greater-than/less-than conditions joined by an AND, you can declare an evaluation range cleanly using the `BETWEEN X AND Y` syntax.",
//   },
//   {
//     id: "se29",
//     title: "Google: Count Unique Search Devices",
//     difficulty: "Easy",
//     company: "Google",
//     tags: ["COUNT DISTINCT", "Aggregation"],
//     scenario:
//       "Find the count of **unique** device types that have connected to the network log systems.",
//     tableSchema: "device_logs(log_id INT, user_id INT, device_type VARCHAR)",
//     correctQuery:
//       "SELECT COUNT(DISTINCT device_type) AS unique_devices FROM device_logs;",
//     setupSQL:
//       "CREATE TABLE device_logs (log_id INT, user_id INT, device_type TEXT); INSERT INTO device_logs VALUES (1, 10, 'Android'), (2, 11, 'iOS'), (3, 12, 'Android');",
//     hint: "If you simply write COUNT(device_type), it will count duplicate records. Inject the `DISTINCT` keyword right inside your `COUNT()` parenthesis parameters.",
//   },
//   {
//     id: "se30",
//     title: "Duolingo: Filter Missing Profile Fields",
//     difficulty: "Easy",
//     company: "Duolingo",
//     tags: ["COALESCE", "Null Alternative Mapping"],
//     scenario:
//       "Duolingo profiles can lack custom user biographies. Write a query to select user profiles. If their `bio` string contains a NULL value, output the backup text 'No bio added' instead. Label this clean evaluation string as `clean_bio`.",
//     tableSchema: "user_profiles(user_id INT, username VARCHAR, bio VARCHAR)",
//     correctQuery:
//       "SELECT user_id, COALESCE(bio, 'No bio added') AS clean_bio FROM user_profiles;",
//     setupSQL:
//       "CREATE TABLE user_profiles (user_id INT, username TEXT, bio TEXT); INSERT INTO user_profiles VALUES (1, 'polyglot99', 'Learning Bengali!'), (2, 'traveler_dev', NULL);",
//     hint: "Use the value fallback evaluation system `COALESCE(column, default_value)`. It checks arguments sequentially and swaps out empty properties seamlessly.",
//   },
//   {
//     id: "se1",
//     title: "Find All Active Users",
//     difficulty: "Easy",
//     company: "Atlassian",
//     tags: ["Filtering", "Basic Syntax"],
//     scenario:
//       "Retrieve the `user_id` and `user_name` of all users with an 'active' status.",
//     tableSchema: "users(user_id, user_name, status)",
//     correctQuery:
//       "SELECT user_id, user_name FROM users WHERE status = 'active';",
//     setupSQL:
//       "CREATE TABLE users (user_id INT, user_name TEXT, status TEXT); INSERT INTO users VALUES (1, 'Alice', 'active'), (2, 'Bob', 'inactive'), (3, 'Charlie', 'active');",
//     hint: "Use a simple WHERE condition filtering values exactly equal to 'active'.",
//   },
//   {
//     id: "se2",
//     title: "Count Issues by Type",
//     difficulty: "Easy",
//     company: "Jira",
//     tags: ["Aggregation", "Group By"],
//     scenario: "Count the number of issues for each `issue_type`.",
//     tableSchema: "issues(issue_id, issue_type)",
//     correctQuery:
//       "SELECT issue_type, COUNT(issue_id) AS issue_count FROM issues GROUP BY issue_type;",
//     setupSQL:
//       "CREATE TABLE issues (issue_id INT, issue_type TEXT); INSERT INTO issues VALUES (101, 'Bug'), (102, 'Feature'), (103, 'Bug'), (104, 'Task');",
//     hint: "Combine the COUNT aggregates with a GROUP BY clause on the issue_type column.",
//   },
//   {
//     id: "se3",
//     title: "Find Projects with No Issues",
//     difficulty: "Easy",
//     company: "Bitbucket",
//     tags: ["Left Join", "Null Handling"],
//     scenario: "Identify all projects that have no issues reported in them.",
//     tableSchema:
//       "projects(project_id, project_name)\nissues(issue_id, project_id)",
//     correctQuery:
//       "SELECT p.project_id, p.project_name FROM projects p LEFT JOIN issues i ON p.project_id = i.project_id WHERE i.issue_id IS NULL;",
//     setupSQL:
//       "CREATE TABLE projects (project_id INT, project_name TEXT); CREATE TABLE issues (issue_id INT, project_id INT); INSERT INTO projects VALUES (1, 'Jira'), (2, 'Confluence'), (3, 'Bitbucket'); INSERT INTO issues VALUES (101, 1), (102, 3);",
//     hint: "Perform a LEFT JOIN from projects to issues, filtering for records where the issue identifier IS NULL.",
//   },
//   {
//     id: "se4",
//     title: "Find Recent Comments",
//     difficulty: "Easy",
//     company: "Confluence",
//     tags: ["Dates", "Filtering"],
//     scenario: "Retrieve all comments created on or after '2025-08-01'.",
//     tableSchema: "comments(comment_id, comment_text, created_at)",
//     correctQuery: "SELECT * FROM comments WHERE created_at >= '2025-08-01';",
//     setupSQL:
//       "CREATE TABLE comments (comment_id INT, comment_text TEXT, created_at TEXT); INSERT INTO comments VALUES (1, 'First comment', '2025-07-31'), (2, 'Second comment', '2025-08-01'), (3, 'Third comment', '2025-08-02');",
//     hint: "Apply a standard comparison operator (>=) within your filter clause against the calendar literal value.",
//   },
//   {
//     id: "se5",
//     title: "Users with a Specific Email Domain",
//     difficulty: "Easy",
//     company: "Google",
//     tags: ["Pattern Matching", "LIKE"],
//     scenario: "Find all users whose email address ends with '@example.com'.",
//     tableSchema: "users(user_id, user_name, email)",
//     correctQuery:
//       "SELECT user_id, user_name FROM users WHERE email LIKE '%@example.com';",
//     setupSQL:
//       "CREATE TABLE users (user_id INT, user_name TEXT, email TEXT); INSERT INTO users VALUES (1, 'Alice', 'alice@example.com'), (2, 'Bob', 'bob@work.com'), (3, 'Charlie', 'charlie@example.com');",
//     hint: "Utilize the LIKE text pattern operator alongside a wild card character (%) tracking the specific suffix value.",
//   },
//   {
//     id: "se6",
//     title: "Count Comments per Issue",
//     difficulty: "Easy",
//     company: "Atlassian",
//     tags: ["Aggregation", "Group By"],
//     scenario: "For each issue, count the total number of comments.",
//     tableSchema: "comments(comment_id, issue_id)",
//     correctQuery:
//       "SELECT issue_id, COUNT(comment_id) AS comment_count FROM comments GROUP BY issue_id;",
//     setupSQL:
//       "CREATE TABLE comments (comment_id INT, issue_id INT); INSERT INTO comments VALUES (1, 101), (2, 101), (3, 102), (4, 101);",
//     hint: "Group target entries by the common structural element id field while tallying rows with COUNT.",
//   },
//   {
//     id: "se7",
//     title: "Find Critical Priority Issues",
//     difficulty: "Easy",
//     company: "Jira",
//     tags: ["Filtering"],
//     scenario: "Select all issues that have a 'Critical' priority.",
//     tableSchema: "issues(issue_id, summary, priority)",
//     correctQuery: "SELECT * FROM issues WHERE priority = 'Critical';",
//     setupSQL:
//       "CREATE TABLE issues (issue_id INT, summary TEXT, priority TEXT); INSERT INTO issues VALUES (1, 'UI Glitch', 'Medium'), (2, 'System Crash', 'Critical'), (3, 'Typo in docs', 'Low');",
//     hint: "Run a simple conditional expression validation asserting exact string parameter matching configuration.",
//   },
//   {
//     id: "se8",
//     title: "List Unique Project Statuses",
//     difficulty: "Easy",
//     company: "Linear",
//     tags: ["Distinct"],
//     scenario: "Get a list of all unique statuses a project can have.",
//     tableSchema: "projects(project_id, status)",
//     correctQuery: "SELECT DISTINCT status FROM projects;",
//     setupSQL:
//       "CREATE TABLE projects (project_id INT, status TEXT); INSERT INTO projects VALUES (1, 'Active'), (2, 'On Hold'), (3, 'Active'), (4, 'Archived');",
//     hint: "Prepend your target attribute with the unique processing keyword identifier modifier.",
//   },
//   {
//     id: "se9",
//     title: "Find a Specific User",
//     difficulty: "Easy",
//     company: "Slack",
//     tags: ["Filtering"],
//     scenario: "Retrieve all information for the user named 'Bob'.",
//     tableSchema: "users(user_id, user_name, email)",
//     correctQuery: "SELECT * FROM users WHERE user_name = 'Bob';",
//     setupSQL:
//       "CREATE TABLE users (user_id INT, user_name TEXT, email TEXT); INSERT INTO users VALUES (1, 'Alice', 'a@a.com'), (2, 'Bob', 'b@b.com');",
//     hint: "Extract wild-card components where string column structures strictly equate with your target user definition configuration.",
//   },
//   {
//     id: "se10",
//     title: "Issues Assigned to a User",
//     difficulty: "Easy",
//     company: "Asana",
//     tags: ["Filtering"],
//     scenario: "Find all issues assigned to the user with `assignee_id` = 1.",
//     tableSchema: "issues(issue_id, summary, assignee_id)",
//     correctQuery: "SELECT issue_id, summary FROM issues WHERE assignee_id = 1;",
//     setupSQL:
//       "CREATE TABLE issues (issue_id INT, summary TEXT, assignee_id INT); INSERT INTO issues VALUES (101, 'Fix login', 1), (102, 'Update docs', 2), (103, 'Deploy fix', 1);",
//     hint: "Filter fields down with matching assignments utilizing structural equal sign evaluations.",
//   },

//   {
//     id: "se1",
//     title: "Find All Active Users",
//     difficulty: "Easy",
//     company: "Atlassian",
//     tags: ["Filtering", "Basic Syntax"],
//     scenario:
//       "Retrieve the `user_id` and `user_name` of all users with an 'active' status.",
//     tableSchema: "users(user_id, user_name, status)",
//     correctQuery:
//       "SELECT user_id, user_name FROM users WHERE status = 'active';",
//     setupSQL:
//       "CREATE TABLE users (user_id INT, user_name TEXT, status TEXT); INSERT INTO users VALUES (1, 'Alice', 'active'), (2, 'Bob', 'inactive'), (3, 'Charlie', 'active');",
//     hint: "Use a simple WHERE condition filtering values exactly equal to 'active'.",
//   },
//   {
//     id: "se2",
//     title: "Count Issues by Type",
//     difficulty: "Easy",
//     company: "Jira",
//     tags: ["Aggregation", "Group By"],
//     scenario: "Count the number of issues for each `issue_type`.",
//     tableSchema: "issues(issue_id, issue_type)",
//     correctQuery:
//       "SELECT issue_type, COUNT(issue_id) AS issue_count FROM issues GROUP BY issue_type;",
//     setupSQL:
//       "CREATE TABLE issues (issue_id INT, issue_type TEXT); INSERT INTO issues VALUES (101, 'Bug'), (102, 'Feature'), (103, 'Bug'), (104, 'Task');",
//     hint: "Combine the COUNT aggregates with a GROUP BY clause on the issue_type column.",
//   },
//   {
//     id: "se3",
//     title: "Find Projects with No Issues",
//     difficulty: "Easy",
//     company: "Bitbucket",
//     tags: ["Left Join", "Null Handling"],
//     scenario: "Identify all projects that have no issues reported in them.",
//     tableSchema:
//       "projects(project_id, project_name)\nissues(issue_id, project_id)",
//     correctQuery:
//       "SELECT p.project_id, p.project_name FROM projects p LEFT JOIN issues i ON p.project_id = i.project_id WHERE i.issue_id IS NULL;",
//     setupSQL:
//       "CREATE TABLE projects (project_id INT, project_name TEXT); CREATE TABLE issues (issue_id INT, project_id INT); INSERT INTO projects VALUES (1, 'Jira'), (2, 'Confluence'), (3, 'Bitbucket'); INSERT INTO issues VALUES (101, 1), (102, 3);",
//     hint: "Perform a LEFT JOIN from projects to issues, filtering for records where the issue identifier IS NULL.",
//   },
//   {
//     id: "se4",
//     title: "Find Recent Comments",
//     difficulty: "Easy",
//     company: "Confluence",
//     tags: ["Dates", "Filtering"],
//     scenario: "Retrieve all comments created on or after '2025-08-01'.",
//     tableSchema: "comments(comment_id, comment_text, created_at)",
//     correctQuery: "SELECT * FROM comments WHERE created_at >= '2025-08-01';",
//     setupSQL:
//       "CREATE TABLE comments (comment_id INT, comment_text TEXT, created_at TEXT); INSERT INTO comments VALUES (1, 'First comment', '2025-07-31'), (2, 'Second comment', '2025-08-01'), (3, 'Third comment', '2025-08-02');",
//     hint: "Apply a standard comparison operator (>=) within your filter clause against the calendar literal value.",
//   },
//   {
//     id: "se5",
//     title: "Users with a Specific Email Domain",
//     difficulty: "Easy",
//     company: "Google",
//     tags: ["Pattern Matching", "LIKE"],
//     scenario: "Find all users whose email address ends with '@example.com'.",
//     tableSchema: "users(user_id, user_name, email)",
//     correctQuery:
//       "SELECT user_id, user_name FROM users WHERE email LIKE '%@example.com';",
//     setupSQL:
//       "CREATE TABLE users (user_id INT, user_name TEXT, email TEXT); INSERT INTO users VALUES (1, 'Alice', 'alice@example.com'), (2, 'Bob', 'bob@work.com'), (3, 'Charlie', 'charlie@example.com');",
//     hint: "Utilize the LIKE text pattern operator alongside a wild card character (%) tracking the specific suffix value.",
//   },
//   {
//     id: "se6",
//     title: "Count Comments per Issue",
//     difficulty: "Easy",
//     company: "Atlassian",
//     tags: ["Aggregation", "Group By"],
//     scenario: "For each issue, count the total number of comments.",
//     tableSchema: "comments(comment_id, issue_id)",
//     correctQuery:
//       "SELECT issue_id, COUNT(comment_id) AS comment_count FROM comments GROUP BY issue_id;",
//     setupSQL:
//       "CREATE TABLE comments (comment_id INT, issue_id INT); INSERT INTO comments VALUES (1, 101), (2, 101), (3, 102), (4, 101);",
//     hint: "Group target entries by the common structural element id field while tallying rows with COUNT.",
//   },
//   {
//     id: "se7",
//     title: "Find Critical Priority Issues",
//     difficulty: "Easy",
//     company: "Jira",
//     tags: ["Filtering"],
//     scenario: "Select all issues that have a 'Critical' priority.",
//     tableSchema: "issues(issue_id, summary, priority)",
//     correctQuery: "SELECT * FROM issues WHERE priority = 'Critical';",
//     setupSQL:
//       "CREATE TABLE issues (issue_id INT, summary TEXT, priority TEXT); INSERT INTO issues VALUES (1, 'UI Glitch', 'Medium'), (2, 'System Crash', 'Critical'), (3, 'Typo in docs', 'Low');",
//     hint: "Run a simple conditional expression validation asserting exact string parameter matching configuration.",
//   },
//   {
//     id: "se8",
//     title: "List Unique Project Statuses",
//     difficulty: "Easy",
//     company: "Linear",
//     tags: ["Distinct"],
//     scenario: "Get a list of all unique statuses a project can have.",
//     tableSchema: "projects(project_id, status)",
//     correctQuery: "SELECT DISTINCT status FROM projects;",
//     setupSQL:
//       "CREATE TABLE projects (project_id INT, status TEXT); INSERT INTO projects VALUES (1, 'Active'), (2, 'On Hold'), (3, 'Active'), (4, 'Archived');",
//     hint: "Prepend your target attribute with the unique processing keyword identifier modifier.",
//   },
//   {
//     id: "se9",
//     title: "Find a Specific User",
//     difficulty: "Easy",
//     company: "Slack",
//     tags: ["Filtering"],
//     scenario: "Retrieve all information for the user named 'Bob'.",
//     tableSchema: "users(user_id, user_name, email)",
//     correctQuery: "SELECT * FROM users WHERE user_name = 'Bob';",
//     setupSQL:
//       "CREATE TABLE users (user_id INT, user_name TEXT, email TEXT); INSERT INTO users VALUES (1, 'Alice', 'a@a.com'), (2, 'Bob', 'b@b.com');",
//     hint: "Extract wild-card components where string column structures strictly equate with your target user definition configuration.",
//   },
//   {
//     id: "se10",
//     title: "Issues Assigned to a User",
//     difficulty: "Easy",
//     company: "Asana",
//     tags: ["Filtering"],
//     scenario: "Find all issues assigned to the user with `assignee_id` = 1.",
//     tableSchema: "issues(issue_id, summary, assignee_id)",
//     correctQuery: "SELECT issue_id, summary FROM issues WHERE assignee_id = 1;",
//     setupSQL:
//       "CREATE TABLE issues (issue_id INT, summary TEXT, assignee_id INT); INSERT INTO issues VALUES (101, 'Fix login', 1), (102, 'Update docs', 2), (103, 'Deploy fix', 1);",
//     hint: "Filter fields down with matching assignments utilizing structural equal sign evaluations.",
//   },

//   // =========================================================================
//   // MEDIUM QUESTIONS
//   // =========================================================================
//   {
//     id: "sm1",
//     title: "Users Who Commented on Their Own Issues",
//     difficulty: "Medium",
//     company: "GitHub",
//     tags: ["Joins", "Distinct"],
//     scenario:
//       "Identify users who have commented on an issue they also reported. Return the `user_id` and `user_name`.",
//     tableSchema:
//       "users(user_id, user_name)\nissues(issue_id, reporter_id)\ncomments(comment_id, issue_id, author_id)",
//     correctQuery:
//       "SELECT DISTINCT u.user_id, u.user_name FROM users u JOIN issues i ON u.user_id = i.reporter_id JOIN comments c ON i.issue_id = c.issue_id AND u.user_id = c.author_id;",
//     setupSQL:
//       "CREATE TABLE users (user_id INT, user_name TEXT); CREATE TABLE issues (issue_id INT, reporter_id INT); CREATE TABLE comments (comment_id INT, issue_id INT, author_id INT); INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'); INSERT INTO issues VALUES (101, 1), (102, 2); INSERT INTO comments VALUES (1, 101, 1), (2, 101, 2), (3, 102, 1);",
//     hint: "Join tables using both the issue references and structural matches checking where user metrics point to overlapping roles.",
//   },
//   {
//     id: "sm2",
//     title: "Average Comments Before Closure",
//     difficulty: "Medium",
//     company: "Linear",
//     tags: ["CTEs", "Aggregation"],
//     scenario:
//       "Calculate the average number of comments an issue receives before it is marked 'Closed'.",
//     tableSchema:
//       "comments(comment_id, issue_id)\nissue_history(history_id, issue_id, status)",
//     correctQuery:
//       "WITH CommentCounts AS (SELECT issue_id, COUNT(comment_id) as num_comments FROM comments GROUP BY issue_id), ClosedIssues AS (SELECT DISTINCT issue_id FROM issue_history WHERE status = 'Closed') SELECT AVG(cc.num_comments) FROM CommentCounts cc JOIN ClosedIssues ci ON cc.issue_id = ci.issue_id;",
//     setupSQL:
//       "CREATE TABLE comments (comment_id INT, issue_id INT); CREATE TABLE issue_history (history_id INT, issue_id INT, status TEXT); INSERT INTO comments VALUES (1, 101), (2, 101), (3, 102); INSERT INTO issue_history VALUES (1, 101, 'Closed'), (2, 102, 'Closed'), (3, 103, 'Open');",
//     hint: "Write an aggregate Common Table Expression (CTE) to pre-calculate total items prior to computing execution results across joined rows.",
//   },
//   {
//     id: "sm3",
//     title: "Second Most Recent Comment",
//     difficulty: "Medium",
//     company: "Meta",
//     tags: ["Window Functions", "Row Number"],
//     scenario: "For each user, find their second most recent comment.",
//     tableSchema: "comments(user_id, comment_text, created_at)",
//     correctQuery:
//       "WITH RankedComments AS (SELECT user_id, comment_text, ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY created_at DESC) as rn FROM comments) SELECT user_id, comment_text FROM RankedComments WHERE rn = 2;",
//     setupSQL:
//       "CREATE TABLE comments (user_id INT, comment_text TEXT, created_at TEXT); INSERT INTO comments VALUES (1, 'First', '2025-01-01'), (1, 'Second', '2025-01-02'), (1, 'Third', '2025-01-03'), (2, 'A', '2025-01-04'), (2, 'B', '2025-01-05');",
//     hint: "Leverage advanced analytical window evaluation components like ROW_NUMBER() grouping items via PARTITION BY definitions.",
//   },
//   {
//     id: "sm4",
//     title: "Inactive Users",
//     difficulty: "Medium",
//     company: "Google",
//     tags: ["Union All", "Date Math", "Left Join"],
//     scenario:
//       "Find users who have not created an issue or a comment in the last 90 days (relative to '2025-08-11').",
//     tableSchema:
//       "users(user_id, user_name)\nissues(reporter_id, created_at)\ncomments(author_id, created_at)",
//     correctQuery:
//       "WITH LastActivity AS (SELECT user_id, MAX(activity_date) as last_date FROM (SELECT reporter_id as user_id, created_at as activity_date FROM issues UNION ALL SELECT author_id, created_at FROM comments) AS AllActivity GROUP BY user_id) SELECT u.user_id, u.user_name FROM users u LEFT JOIN LastActivity la ON u.user_id = la.user_id WHERE la.last_date IS NULL OR la.last_date < DATE('2025-08-11', '-90 days');",
//     setupSQL:
//       "CREATE TABLE users(user_id INT, user_name TEXT); CREATE TABLE issues(reporter_id INT, created_at TEXT); CREATE TABLE comments(author_id INT, created_at TEXT); INSERT INTO users VALUES (1, 'Active User'), (2, 'Inactive User'); INSERT INTO issues VALUES (1, '2025-08-01'); INSERT INTO comments VALUES (1, '2025-08-02');",
//     hint: "Consolidate chronological metrics across separate entity lists using UNION ALL prior to evaluating dates.",
//   },
//   {
//     id: "sm5",
//     title: "Projects and Their User Count",
//     difficulty: "Medium",
//     company: "Notion",
//     tags: ["Aggregation", "Count Distinct"],
//     scenario:
//       "List each project and the number of unique users who have commented on it.",
//     tableSchema:
//       "projects(project_id, project_name)\ncomments(project_id, user_id)",
//     correctQuery:
//       "SELECT p.project_name, COUNT(DISTINCT c.user_id) as user_count FROM projects p LEFT JOIN comments c ON p.project_id = c.project_id GROUP BY p.project_name;",
//     setupSQL:
//       "CREATE TABLE projects(project_id INT, project_name TEXT); CREATE TABLE comments(project_id INT, user_id INT); INSERT INTO projects VALUES (1, 'Jira'), (2, 'Confluence'); INSERT INTO comments VALUES (1, 1), (1, 2), (1, 1), (2, 3);",
//     hint: "Utilize COUNT(DISTINCT user_id) to accurately map unique engagement values across project aggregations.",
//   },
//   {
//     id: "sm6",
//     title: "Monthly Active Users (MAU)",
//     difficulty: "Medium",
//     company: "Twitter",
//     tags: ["Date Formatting", "Count Distinct"],
//     scenario:
//       "Calculate the number of unique active users for each month in 2025.",
//     tableSchema: "activity_log(user_id, event_date)",
//     correctQuery:
//       "SELECT STRFTIME('%Y-%m', event_date) as month, COUNT(DISTINCT user_id) as mau FROM activity_log WHERE STRFTIME('%Y', event_date) = '2025' GROUP BY month;",
//     setupSQL:
//       "CREATE TABLE activity_log(user_id INT, event_date TEXT); INSERT INTO activity_log VALUES (1, '2025-01-10'), (2, '2025-01-15'), (1, '2025-01-20'), (3, '2025-02-05'), (1, '2025-02-10');",
//     hint: "Employ date format functions like STRFTIME to convert timestamp values into monthly string blocks.",
//   },
//   {
//     id: "sm7",
//     title: "Issues with No Comments",
//     difficulty: "Medium",
//     company: "Jira",
//     tags: ["Left Join", "Null Handling"],
//     scenario: "Find all issues that have not received any comments.",
//     tableSchema: "issues(issue_id, summary)\ncomments(comment_id, issue_id)",
//     correctQuery:
//       "SELECT i.issue_id, i.summary FROM issues i LEFT JOIN comments c ON i.issue_id = c.issue_id WHERE c.comment_id IS NULL;",
//     setupSQL:
//       "CREATE TABLE issues(issue_id INT, summary TEXT); CREATE TABLE comments(comment_id INT, issue_id INT); INSERT INTO issues VALUES (101, 'Bug A'), (102, 'Feature B'); INSERT INTO comments VALUES (1, 101);",
//     hint: "Isolate unmatched mappings after performing an outer join operations layout.",
//   },
//   {
//     id: "sm8",
//     title: "User with Most Bug Reports",
//     difficulty: "Medium",
//     company: "Asana",
//     tags: ["Sorting", "Limit", "Aggregation"],
//     scenario: "Find the user who has reported the most 'Bug' type issues.",
//     tableSchema: "users(user_id, user_name)\nissues(reporter_id, issue_type)",
//     correctQuery:
//       "SELECT u.user_name FROM users u JOIN issues i ON u.user_id = i.reporter_id WHERE i.issue_type = 'Bug' GROUP BY u.user_name ORDER BY COUNT(i.issue_id) DESC LIMIT 1;",
//     setupSQL:
//       "CREATE TABLE users(user_id INT, user_name TEXT); CREATE TABLE issues(reporter_id INT, issue_type TEXT); INSERT INTO users VALUES(1, 'Alice'), (2, 'Bob'); INSERT INTO issues VALUES (1, 'Bug'), (1, 'Bug'), (2, 'Feature'), (2, 'Bug');",
//     hint: "Organize calculations via structural counts sorted in descending sequence layouts with a LIMIT value.",
//   },
//   {
//     id: "sm9",
//     title: "Average Time to First Comment",
//     difficulty: "Medium",
//     company: "Zendesk",
//     tags: ["CTEs", "Date Calculations", "Aggregation"],
//     scenario:
//       "Calculate the average time (in hours) between an issue's creation and its first comment.",
//     tableSchema: "issues(issue_id, created_at)\ncomments(issue_id, created_at)",
//     correctQuery:
//       "WITH FirstComments AS (SELECT issue_id, MIN(created_at) as first_comment_time FROM comments GROUP BY issue_id) SELECT AVG((JULIANDAY(fc.first_comment_time) - JULIANDAY(i.created_at)) * 24) as avg_hours_to_comment FROM issues i JOIN FirstComments fc ON i.issue_id = fc.issue_id;",
//     setupSQL:
//       "CREATE TABLE issues(issue_id INT, created_at TEXT); CREATE TABLE comments(issue_id INT, created_at TEXT); INSERT INTO issues VALUES (101, '2025-08-01 10:00:00'); INSERT INTO comments VALUES (101, '2025-08-01 12:30:00');",
//     hint: "Compute baseline timestamps values using standard SQL day conversion functions multiplied across hourly periods.",
//   },
//   {
//     id: "sm10",
//     title: "Subscription Plan Breakdown",
//     difficulty: "Medium",
//     company: "Netflix",
//     tags: ["Aggregation", "Joins"],
//     scenario: "Count the number of users on each subscription plan.",
//     tableSchema: "users(user_id, plan_id)\nplans(plan_id, plan_name)",
//     correctQuery:
//       "SELECT p.plan_name, COUNT(u.user_id) as user_count FROM plans p JOIN users u ON p.plan_id = u.plan_id GROUP BY p.plan_name;",
//     setupSQL:
//       "CREATE TABLE users(user_id INT, plan_id INT); CREATE TABLE plans(plan_id INT, plan_name TEXT); INSERT INTO plans VALUES (1, 'Free'), (2, 'Premium'); INSERT INTO users VALUES (1, 1), (2, 2), (3, 1), (4, 2), (5, 2);",
//     hint: "Join structural map files checking where plan properties intersect categorical identifiers.",
//   },
// ];
