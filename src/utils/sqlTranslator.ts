// src/utils/sqlTranslator.ts

const DIALECT_KEYWORDS_MAP: Record<string, string> = {
  "ifnull": "COALESCE",
  "nvl": "COALESCE",
  "sysdate": "NOW()",
  "curdate()": "CURRENT_DATE",
};

export const transpileToPostgres = (userQuery: string): string => {
  if (!userQuery) return "";

  // Split the code string by spaces, commas, and parentheses to isolate individual words
  let tokens = userQuery.split(/(\s+|\(|\)|,)/); 
  
  tokens = tokens.map(token => {
    const cleanToken = token.toLowerCase().trim();
    
    // Swap MySQL words to their Postgres equivalent if they exist in our map
    if (DIALECT_KEYWORDS_MAP[cleanToken]) {
      return DIALECT_KEYWORDS_MAP[cleanToken];
    }
    return token;
  });

  let processed = tokens.join("");

  // Fix the tricky MySQL interval syntax: INTERVAL 30 DAY -> INTERVAL '30 days'
  processed = processed.replace(/INTERVAL\s+(\d+)\s+DAY/gi, "INTERVAL '$1 days'");

  return processed;
};