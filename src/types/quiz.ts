// export interface SQLQuestion {
//   id: string | number;
//   title: string;
//   difficulty: "Easy" | "Medium" | "Hard";
//   scenario: string;
//   tableSchema: string;
//   expectedOutput: string;
//   hint: string;
//   correctQuery: string;
// }
// export interface SQLQuestion {
//   id: string | number; // 👈 Change this from number to string | number
//   title: string;
//   difficulty: 'Easy' | 'Medium' | 'Hard';
//   scenario: string;
//   tableSchema: string;
//   expectedOutput: string;
//   hint: string;
//   correctQuery: string;
//   setupSQL?: string; // Optional field for your sandbox seed setups
// }

export interface SQLQuestion {
  /** Accepts string IDs like 'se1' from seeds or numbers like 3 from Gemini */
  id: string | number;
  
  title: string;
  
  difficulty: 'Easy' | 'Medium' | 'Hard';
  
  /** The problem description / task statement */
  scenario: string;
  
  /** Description of the tables and columns involved */
  tableSchema: string;
  
  /** What the resulting rows/columns should look like */
  // expectedOutput: string;
  
  /** A helpful guidance prompt for the user */
  hint: string;
  
  /** The standard SQL answer statement to check against */
  correctQuery: string;
  
  /** Optional raw SQL DDL/DML statements to spin up database state */
  setupSQL?: string;
}