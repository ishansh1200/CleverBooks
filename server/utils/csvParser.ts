import { parse } from 'csv-parse';

/**
 * Parses a raw CSV buffer into an array of JavaScript objects.
 * Automatically extracts headers, trims whitespace, and casts numeric values.
 */
export const parseCsvBuffer = (buffer: Buffer): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    parse(
      buffer,
      {
        columns: true,          // Uses the first row as object keys (headers)
        skip_empty_lines: true, // Ignores blank lines at the end of the file
        trim: true,             // Trims whitespace from keys and values
        cast: true,             // Automatically attempts to cast strings to Numbers/Booleans where applicable
      },
      (error, records) => {
        if (error) {
          console.error('CSV Parsing Error:', error);
          reject(new Error('Failed to parse CSV file. Ensure the format is correct.'));
        } else {
          resolve(records);
        }
      }
    );
  });
};