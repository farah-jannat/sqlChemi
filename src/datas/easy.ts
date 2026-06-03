import { SQLQuestion } from "@/types/quiz";

export const easyQuestions: SQLQuestion[] = [
  {
    id: "g_e1",
    title: "Google Workspace: Active Account Verification",
    difficulty: "Easy",
    company: "Google",
    tags: ["Filtering", "Logical Operators"],
    scenario: "Google accounts security team wants to audit active accounts. Find all users where the account status is 'active' and the login region is 'Asia'.",
    tableSchema: "users(user_id INT, status VARCHAR, region VARCHAR)",
    correctQuery: "SELECT user_id FROM users WHERE status = 'active' AND region = 'Asia';",
    setupSQL: "CREATE TABLE users (user_id INT, status TEXT, region TEXT); INSERT INTO users VALUES (1, 'active', 'Asia'), (2, 'inactive', 'US'), (3, 'active', 'Europe'), (4, 'active', 'Asia');",
    hint: "Combine text parameters using standard equality conditions linked with an AND operator."
  },
  {
    id: "m_e1",
    title: "Instagram: Fetch Unlinked Business Profiles",
    difficulty: "Easy",
    company: "Meta",
    tags: ["Left Join", "Null Handling"],
    scenario: "Identify all Instagram business profiles that have never launched a promotional campaign (meaning their profile lacks any entries in the ad ledger).",
    tableSchema: "profiles(profile_id INT, username VARCHAR)\nad_campaigns(campaign_id INT, profile_id INT)",
    correctQuery: "SELECT p.profile_id FROM profiles p LEFT JOIN ad_campaigns c ON p.profile_id = c.profile_id WHERE c.campaign_id IS NULL;",
    setupSQL: "CREATE TABLE profiles (profile_id INT, username TEXT); CREATE TABLE ad_campaigns (campaign_id INT, profile_id INT); INSERT INTO profiles VALUES (1, 'shop_bd'), (2, 'tech_hub'); INSERT INTO ad_campaigns VALUES (101, 1);",
    hint: "Use an outer LEFT JOIN and look for structural elements on the right table that resolve to IS NULL."
  },
  {
    id: "a_e1",
    title: "Amazon Logistics: Damaged Packages Rate",
    difficulty: "Easy",
    company: "Amazon",
    tags: ["Aggregation", "Count"],
    scenario: "Amazon fulfillment centers need to flag severe shipping errors. Calculate the total count of order shipments that were flagged with a delivery status of 'Damaged'.",
    tableSchema: "shipments(shipment_id INT, order_id INT, status VARCHAR)",
    correctQuery: "SELECT COUNT(shipment_id) AS damaged_count FROM shipments WHERE status = 'Damaged';",
    setupSQL: "CREATE TABLE shipments (shipment_id INT, order_id INT, status TEXT); INSERT INTO shipments VALUES (1, 501, 'Delivered'), (2, 502, 'Damaged'), (3, 503, 'Damaged');",
    hint: "Run a simple horizontal COUNT aggregation alongside a basic text filter clause."
  },
  {
    id: "n_e1",
    title: "Netflix Streaming: Filter Family Profiles",
    difficulty: "Easy",
    company: "Netflix",
    tags: ["Basic Filtering", "Numeric Evaluation"],
    scenario: "To audit concurrent streaming behavior, retrieve all customer accounts that have set up more than 3 distinct viewing profiles.",
    tableSchema: "accounts(account_id INT, plan_type VARCHAR, profile_count INT)",
    correctQuery: "SELECT account_id FROM accounts WHERE profile_count > 3;",
    setupSQL: "CREATE TABLE accounts (account_id INT, plan_type TEXT, profile_count INT); INSERT INTO accounts VALUES (1, 'Premium', 5), (2, 'Basic', 1), (3, 'Standard', 4);",
    hint: "Write a direct quantitative constraint using the traditional greater-than symbol (>)."
  },
  {
    id: "u_e1",
    title: "Uber Freight: Low Capacity Alerts",
    difficulty: "Easy",
    company: "Uber",
    tags: ["Sorting", "Limit"],
    scenario: "Isolate logistics vehicles with small holding bays. Find the top 2 trucks with the lowest volumetric carrying capacity, sorted from lowest to highest.",
    tableSchema: "trucks(truck_id INT, license_plate VARCHAR, capacity_cf INT)",
    correctQuery: "SELECT truck_id, capacity_cf FROM trucks ORDER BY capacity_cf ASC LIMIT 2;",
    setupSQL: "CREATE TABLE trucks (truck_id INT, license_plate TEXT, capacity_cf INT); INSERT INTO trucks VALUES (1, 'DK-11', 400), (2, 'DK-22', 1200), (3, 'DK-33', 350);",
    hint: "Sort the target column using ASC to sort ascending, and cap output rows using a LIMIT suffix."
  }
];