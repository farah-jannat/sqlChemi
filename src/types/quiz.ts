export interface SQLQuestion {
  /** Accepts string IDs like 'se1' from seeds or numbers like 3 from Gemini */
  id: string | number;

  title: string;

  difficulty: "Easy" | "Medium" | "Hard";

  /** The specific target company asking the interview question */
  company?: string;

  /** Keywords or topics tested in the query for filtering optimization */
  tags?: string[];

  /** The problem description / task statement */
  scenario: string;

  /** Description of the tables and columns involved */
  tableSchema: string;

  /** A helpful guidance prompt for the user */
  hint: string;

  /** The standard SQL answer statement to check against */
  correctQuery: string;

  /** Optional raw SQL DDL/DML statements to spin up database state */
  setupSQL?: string;

  /** * Determines if the validator should enforce strict row ordering.
   * If true, the user result must match the golden result row-by-row.
   * If false, the validator will sort both datasets before comparing.
   */
  enforceOrder: boolean;
}
