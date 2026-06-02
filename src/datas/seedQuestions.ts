import { SQLQuestion } from "@/types/quiz";

// export const seedQuestions: SQLQuestion[] = [

export const themedQuestionBanks: Record<
  string,
  {
    Easy: SQLQuestion[];
    Medium: SQLQuestion[];
    Hard: SQLQuestion[];
  }
> = {
  saas: {
    Easy: [
      {
        id: "se1",
        title: "Find All Active Users",
        difficulty: "Easy",
        scenario:
          "Retrieve the `user_id` and `user_name` of all users at {companyName} with an 'active' status.",
        tableSchema: "users(user_id, user_name, status)",
        correctQuery:
          "SELECT user_id, user_name FROM users WHERE status = 'active';",
        setupSQL:
          "CREATE TABLE users (user_id INT, user_name TEXT, status TEXT); INSERT INTO users VALUES (1, 'Alice', 'active'), (2, 'Bob', 'inactive'), (3, 'Charlie', 'active');",
        hint: "Use a simple WHERE condition filtering values exactly equal to 'active'.",
      },
      {
        id: "se2",
        title: "Count Issues by Type",
        difficulty: "Easy",
        scenario: "Count the number of issues for each `issue_type`.",
        tableSchema: "issues(issue_id, issue_type)",
        correctQuery:
          "SELECT issue_type, COUNT(issue_id) AS issue_count FROM issues GROUP BY issue_type;",
        setupSQL:
          "CREATE TABLE issues (issue_id INT, issue_type TEXT); INSERT INTO issues VALUES (101, 'Bug'), (102, 'Feature'), (103, 'Bug'), (104, 'Task');",
        hint: "Combine the COUNT aggregates with a GROUP BY clause on the issue_type column.",
      },
      {
        id: "se3",
        title: "Find Projects with No Issues",
        difficulty: "Easy",
        scenario: "Identify all projects that have no issues reported in them.",
        tableSchema:
          "projects(project_id, project_name)\nissues(issue_id, project_id)",
        correctQuery:
          "SELECT p.project_id, p.project_name FROM projects p LEFT JOIN issues i ON p.project_id = i.project_id WHERE i.issue_id IS NULL;",
        setupSQL:
          "CREATE TABLE projects (project_id INT, project_name TEXT); CREATE TABLE issues (issue_id INT, project_id INT); INSERT INTO projects VALUES (1, 'Jira'), (2, 'Confluence'), (3, 'Bitbucket'); INSERT INTO issues VALUES (101, 1), (102, 3);",
        hint: "Perform a LEFT JOIN from projects to issues, filtering for records where the issue identifier IS NULL.",
      },
      {
        id: "se4",
        title: "Find Recent Comments",
        difficulty: "Easy",
        scenario: "Retrieve all comments created on or after '2025-08-01'.",
        tableSchema: "comments(comment_id, comment_text, created_at)",
        correctQuery:
          "SELECT * FROM comments WHERE created_at >= '2025-08-01';",
        setupSQL:
          "CREATE TABLE comments (comment_id INT, comment_text TEXT, created_at TEXT); INSERT INTO comments VALUES (1, 'First comment', '2025-07-31'), (2, 'Second comment', '2025-08-01'), (3, 'Third comment', '2025-08-02');",
        hint: "Apply a standard comparison operator (>=) within your filter clause against the calendar literal value.",
      },
      {
        id: "se5",
        title: "Users with a Specific Email Domain",
        difficulty: "Easy",
        scenario:
          "Find all users whose email address ends with '@example.com'.",
        tableSchema: "users(user_id, user_name, email)",
        correctQuery:
          "SELECT user_id, user_name FROM users WHERE email LIKE '%@example.com';",
        setupSQL:
          "CREATE TABLE users (user_id INT, user_name TEXT, email TEXT); INSERT INTO users VALUES (1, 'Alice', 'alice@example.com'), (2, 'Bob', 'bob@work.com'), (3, 'Charlie', 'charlie@example.com');",
        hint: "Utilize the LIKE text pattern operator alongside a wild card character (%) tracking the specific suffix value.",
      },
      {
        id: "se6",
        title: "Count Comments per Issue",
        difficulty: "Easy",
        scenario: "For each issue, count the total number of comments.",
        tableSchema: "comments(comment_id, issue_id)",
        correctQuery:
          "SELECT issue_id, COUNT(comment_id) AS comment_count FROM comments GROUP BY issue_id;",
        setupSQL:
          "CREATE TABLE comments (comment_id INT, issue_id INT); INSERT INTO comments VALUES (1, 101), (2, 101), (3, 102), (4, 101);",
        hint: "Group target entries by the common structural element id field while tallying rows with COUNT.",
      },
      {
        id: "se7",
        title: "Find Critical Priority Issues",
        difficulty: "Easy",
        scenario: "Select all issues that have a 'Critical' priority.",
        tableSchema: "issues(issue_id, summary, priority)",
        correctQuery: "SELECT * FROM issues WHERE priority = 'Critical';",
        setupSQL:
          "CREATE TABLE issues (issue_id INT, summary TEXT, priority TEXT); INSERT INTO issues VALUES (1, 'UI Glitch', 'Medium'), (2, 'System Crash', 'Critical'), (3, 'Typo in docs', 'Low');",
        hint: "Run a simple conditional expression validation asserting exact string parameter matching configuration.",
      },
      {
        id: "se8",
        title: "List Unique Project Statuses",
        difficulty: "Easy",
        scenario: "Get a list of all unique statuses a project can have.",
        tableSchema: "projects(project_id, status)",
        correctQuery: "SELECT DISTINCT status FROM projects;",
        setupSQL:
          "CREATE TABLE projects (project_id INT, status TEXT); INSERT INTO projects VALUES (1, 'Active'), (2, 'On Hold'), (3, 'Active'), (4, 'Archived');",
        hint: "Prepend your target attribute with the unique processing keyword identifier modifier.",
      },
      {
        id: "se9",
        title: "Find a Specific User",
        difficulty: "Easy",
        scenario: "Retrieve all information for the user named 'Bob'.",
        tableSchema: "users(user_id, user_name, email)",
        correctQuery: "SELECT * FROM users WHERE user_name = 'Bob';",
        setupSQL:
          "CREATE TABLE users (user_id INT, user_name TEXT, email TEXT); INSERT INTO users VALUES (1, 'Alice', 'a@a.com'), (2, 'Bob', 'b@b.com');",
        hint: "Extract wild-card components where string column structures strictly equate with your target user definition configuration.",
      },
      {
        id: "se10",
        title: "Issues Assigned to a User",
        difficulty: "Easy",
        scenario:
          "Find all issues assigned to the user with `assignee_id` = 1.",
        tableSchema: "issues(issue_id, summary, assignee_id)",
        correctQuery:
          "SELECT issue_id, summary FROM issues WHERE assignee_id = 1;",
        setupSQL:
          "CREATE TABLE issues (issue_id INT, summary TEXT, assignee_id INT); INSERT INTO issues VALUES (101, 'Fix login', 1), (102, 'Update docs', 2), (103, 'Deploy fix', 1);",
        hint: "Filter fields down with matching assignments utilizing structural equal sign evaluations.",
      },
    ],
    Medium: [
      {
        id: "sm1",
        title: "Users Who Commented on Their Own Issues",
        difficulty: "Medium",
        scenario:
          "Identify users from {companyName} who have commented on an issue they also reported. Return the `user_id` and `user_name`.",
        tableSchema:
          "users(user_id, user_name)\nissues(issue_id, reporter_id)\ncomments(comment_id, issue_id, author_id)",
        correctQuery:
          "SELECT DISTINCT u.user_id, u.user_name FROM users u JOIN issues i ON u.user_id = i.reporter_id JOIN comments c ON i.issue_id = c.issue_id AND u.user_id = c.author_id;",
        setupSQL:
          "CREATE TABLE users (user_id INT, user_name TEXT); CREATE TABLE issues (issue_id INT, reporter_id INT); CREATE TABLE comments (comment_id INT, issue_id INT, author_id INT); INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'); INSERT INTO issues VALUES (101, 1), (102, 2); INSERT INTO comments VALUES (1, 101, 1), (2, 101, 2), (3, 102, 1);",
        hint: "Join tables using both the issue references and structural matches checking where user metrics point to overlapping roles.",
      },
      {
        id: "sm2",
        title: "Average Comments Before Closure",
        difficulty: "Medium",
        scenario:
          "Calculate the average number of comments an issue receives before it is marked 'Closed'.",
        tableSchema:
          "comments(comment_id, issue_id)\nissue_history(history_id, issue_id, status)",
        correctQuery:
          "WITH CommentCounts AS (SELECT issue_id, COUNT(comment_id) as num_comments FROM comments GROUP BY issue_id), ClosedIssues AS (SELECT DISTINCT issue_id FROM issue_history WHERE status = 'Closed') SELECT AVG(cc.num_comments) FROM CommentCounts cc JOIN ClosedIssues ci ON cc.issue_id = ci.issue_id;",
        setupSQL:
          "CREATE TABLE comments (comment_id INT, issue_id INT); CREATE TABLE issue_history (history_id INT, issue_id INT, status TEXT); INSERT INTO comments VALUES (1, 101), (2, 101), (3, 102); INSERT INTO issue_history VALUES (1, 101, 'Closed'), (2, 102, 'Closed'), (3, 103, 'Open');",
        hint: "Write an aggregate Common Table Expression (CTE) to pre-calculate total items prior to computing execution results across joined rows.",
      },
      {
        id: "sm3",
        title: "Second Most Recent Comment",
        difficulty: "Medium",
        scenario: "For each user, find their second most recent comment.",
        tableSchema: "comments(user_id, comment_text, created_at)",
        correctQuery:
          "WITH RankedComments AS (SELECT user_id, comment_text, ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY created_at DESC) as rn FROM comments) SELECT user_id, comment_text FROM RankedComments WHERE rn = 2;",
        setupSQL:
          "CREATE TABLE comments (user_id INT, comment_text TEXT, created_at TEXT); INSERT INTO comments VALUES (1, 'First', '2025-01-01'), (1, 'Second', '2025-01-02'), (1, 'Third', '2025-01-03'), (2, 'A', '2025-01-04'), (2, 'B', '2025-01-05');",
        hint: "Leverage advanced analytical window evaluation components like ROW_NUMBER() grouping items via PARTITION BY definitions.",
      },
      {
        id: "sm4",
        title: "Inactive Users",
        difficulty: "Medium",
        scenario:
          "Find users who have not created an issue or a comment in the last 90 days (relative to '2025-08-11').",
        tableSchema:
          "users(user_id, user_name)\nissues(reporter_id, created_at)\ncomments(author_id, created_at)",
        correctQuery:
          "WITH LastActivity AS (SELECT user_id, MAX(activity_date) as last_date FROM (SELECT reporter_id as user_id, created_at as activity_date FROM issues UNION ALL SELECT author_id, created_at FROM comments) AS AllActivity GROUP BY user_id) SELECT u.user_id, u.user_name FROM users u LEFT JOIN LastActivity la ON u.user_id = la.user_id WHERE la.last_date IS NULL OR la.last_date < DATE('2025-08-11', '-90 days');",
        setupSQL:
          "CREATE TABLE users(user_id INT, user_name TEXT); CREATE TABLE issues(reporter_id INT, created_at TEXT); CREATE TABLE comments(author_id INT, created_at TEXT); INSERT INTO users VALUES (1, 'Active User'), (2, 'Inactive User'); INSERT INTO issues VALUES (1, '2025-08-01'); INSERT INTO comments VALUES (1, '2025-08-02');",
        hint: "Consolidate chronological metrics across separate entity lists using UNION ALL prior to evaluating dates.",
      },
      {
        id: "sm5",
        title: "Projects and Their User Count",
        difficulty: "Medium",
        scenario:
          "List each project and the number of unique users who have commented on it.",
        tableSchema:
          "projects(project_id, project_name)\ncomments(project_id, user_id)",
        correctQuery:
          "SELECT p.project_name, COUNT(DISTINCT c.user_id) as user_count FROM projects p LEFT JOIN comments c ON p.project_id = c.project_id GROUP BY p.project_name;",
        setupSQL:
          "CREATE TABLE projects(project_id INT, project_name TEXT); CREATE TABLE comments(project_id INT, user_id INT); INSERT INTO projects VALUES (1, 'Jira'), (2, 'Confluence'); INSERT INTO comments VALUES (1, 1), (1, 2), (1, 1), (2, 3);",
        hint: "Utilize COUNT(DISTINCT user_id) to accurately map unique engagement values across project aggregations.",
      },
      {
        id: "sm6",
        title: "Monthly Active Users (MAU)",
        difficulty: "Medium",
        scenario:
          "Calculate the number of unique active users for each month in 2025.",
        tableSchema: "activity_log(user_id, event_date)",
        correctQuery:
          "SELECT STRFTIME('%Y-%m', event_date) as month, COUNT(DISTINCT user_id) as mau FROM activity_log WHERE STRFTIME('%Y', event_date) = '2025' GROUP BY month;",
        setupSQL:
          "CREATE TABLE activity_log(user_id INT, event_date TEXT); INSERT INTO activity_log VALUES (1, '2025-01-10'), (2, '2025-01-15'), (1, '2025-01-20'), (3, '2025-02-05'), (1, '2025-02-10');",
        hint: "Employ date format functions like STRFTIME to convert timestamp values into monthly string blocks.",
      },
      {
        id: "sm7",
        title: "Issues with No Comments",
        difficulty: "Medium",
        scenario: "Find all issues that have not received any comments.",
        tableSchema:
          "issues(issue_id, summary)\ncomments(comment_id, issue_id)",
        correctQuery:
          "SELECT i.issue_id, i.summary FROM issues i LEFT JOIN comments c ON i.issue_id = c.issue_id WHERE c.comment_id IS NULL;",
        setupSQL:
          "CREATE TABLE issues(issue_id INT, summary TEXT); CREATE TABLE comments(comment_id INT, issue_id INT); INSERT INTO issues VALUES (101, 'Bug A'), (102, 'Feature B'); INSERT INTO comments VALUES (1, 101);",
        hint: "Isolate unmatched mappings after performing an outer join operations layout.",
      },
      {
        id: "sm8",
        title: "User with Most Bug Reports",
        difficulty: "Medium",
        scenario: "Find the user who has reported the most 'Bug' type issues.",
        tableSchema:
          "users(user_id, user_name)\nissues(reporter_id, issue_type)",
        correctQuery:
          "SELECT u.user_name FROM users u JOIN issues i ON u.user_id = i.reporter_id WHERE i.issue_type = 'Bug' GROUP BY u.user_name ORDER BY COUNT(i.issue_id) DESC LIMIT 1;",
        setupSQL:
          "CREATE TABLE users(user_id INT, user_name TEXT); CREATE TABLE issues(reporter_id INT, issue_type TEXT); INSERT INTO users VALUES(1, 'Alice'), (2, 'Bob'); INSERT INTO issues VALUES (1, 'Bug'), (1, 'Bug'), (2, 'Feature'), (2, 'Bug');",
        hint: "Organize calculations via structural counts sorted in descending sequence layouts with a LIMIT value.",
      },
      {
        id: "sm9",
        title: "Average Time to First Comment",
        difficulty: "Medium",
        scenario:
          "Calculate the average time (in hours) between an issue's creation and its first comment.",
        tableSchema:
          "issues(issue_id, created_at)\ncomments(issue_id, created_at)",
        correctQuery:
          "WITH FirstComments AS (SELECT issue_id, MIN(created_at) as first_comment_time FROM comments GROUP BY issue_id) SELECT AVG((JULIANDAY(fc.first_comment_time) - JULIANDAY(i.created_at)) * 24) as avg_hours_to_comment FROM issues i JOIN FirstComments fc ON i.issue_id = fc.issue_id;",
        setupSQL:
          "CREATE TABLE issues(issue_id INT, created_at TEXT); CREATE TABLE comments(issue_id INT, created_at TEXT); INSERT INTO issues VALUES (101, '2025-08-01 10:00:00'); INSERT INTO comments VALUES (101, '2025-08-01 12:30:00');",
        hint: "Compute baseline timestamps values using standard SQL day conversion functions multiplied across hourly periods.",
      },
      {
        id: "sm10",
        title: "Subscription Plan Breakdown",
        difficulty: "Medium",
        scenario: "Count the number of users on each subscription plan.",
        tableSchema: "users(user_id, plan_id)\nplans(plan_id, plan_name)",
        correctQuery:
          "SELECT p.plan_name, COUNT(u.user_id) as user_count FROM plans p JOIN users u ON p.plan_id = u.plan_id GROUP BY p.plan_name;",
        setupSQL:
          "CREATE TABLE users(user_id INT, plan_id INT); CREATE TABLE plans(plan_id INT, plan_name TEXT); INSERT INTO plans VALUES (1, 'Free'), (2, 'Premium'); INSERT INTO users VALUES (1, 1), (2, 2), (3, 1), (4, 2), (5, 2);",
        hint: "Join structural map files checking where plan properties intersect categorical identifiers.",
      },
    ],
    Hard: [], // Ready for your hard questions later!
  },
};
