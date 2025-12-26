/**
 * Script to generate a combined SQL file with both Mental Health and Substance Abuse facilities
 * Adds a directory_type column to distinguish between the two datasets
 * 
 * Run: node scripts/generate_combined_sql_v2.js
 */

const fs = require('fs');
const path = require('path');

// Read both SQL files
const mentalHealthSqlPath = path.join(__dirname, '../attached_assets/mentalhealth_1766587905558.sql');
const substanceAbuseSqlPath = path.join(__dirname, '../attached_assets/Subtance_2024_1766717654324.sql');

console.log('Reading Mental Health SQL file...');
const mentalHealthSql = fs.readFileSync(mentalHealthSqlPath, 'utf8');

console.log('Reading Substance Abuse SQL file...');
const substanceAbuseSql = fs.readFileSync(substanceAbuseSqlPath, 'utf8');

// Extract columns from Mental Health table
const mentalHealthColumns = [];
const mhTableMatch = mentalHealthSql.match(/CREATE TABLE `datamentalhealth`[\s\S]*?\) ENGINE/);
if (mhTableMatch) {
  const columnMatches = mhTableMatch[0].matchAll(/`(\w+)`\s+(?:text|int|varchar)/g);
  for (const match of columnMatches) {
    if (match[1] !== 'id') {
      mentalHealthColumns.push(match[1]);
    }
  }
}
console.log(`Found ${mentalHealthColumns.length} columns in Mental Health table`);

// Extract columns from Substance Abuse table
const substanceAbuseColumns = [];
const saTableMatch = substanceAbuseSql.match(/CREATE TABLE `final_2024_substancetreatmentagency`[\s\S]*?\) ENGINE/);
if (saTableMatch) {
  const columnMatches = saTableMatch[0].matchAll(/`([^`]+)`\s+(?:text|int|varchar)/g);
  for (const match of columnMatches) {
    // Handle BOM character in first column
    let colName = match[1].replace(/ï»¿/g, '').replace(/\ufeff/g, '');
    substanceAbuseColumns.push(colName);
  }
}
console.log(`Found ${substanceAbuseColumns.length} columns in Substance Abuse table`);

// Get all unique columns
const allColumns = new Set(['id', 'directory_type', ...mentalHealthColumns, ...substanceAbuseColumns]);
console.log(`Total unique columns: ${allColumns.size}`);

// Generate the combined table structure
let combinedSql = `-- Combined Mental Health and Substance Abuse Facilities Database
-- Generated: ${new Date().toISOString()}
-- Contains directory_type column to distinguish between facility types
-- 'mental' = Mental Health Services
-- 'substance' = Substance Abuse Treatment

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS \`facilities\`;

CREATE TABLE \`facilities\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`directory_type\` varchar(50) DEFAULT NULL,
`;

// Add all columns
const columnArray = Array.from(allColumns).filter(c => c !== 'id' && c !== 'directory_type');
for (const col of columnArray) {
  combinedSql += `  \`${col}\` text DEFAULT NULL,\n`;
}
combinedSql += `  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

`;

// Function to extract INSERT data and convert to new format
function extractInsertData(sql, tableName, directoryType, columns) {
  const insertStatements = [];
  const insertRegex = new RegExp(`INSERT INTO \`${tableName}\` VALUES \\(([^;]+?)\\);`, 'g');
  
  let match;
  while ((match = insertRegex.exec(sql)) !== null) {
    const valuesStr = match[1];
    insertStatements.push({ values: valuesStr, directoryType });
  }
  
  return insertStatements;
}

// Extract Mental Health data
console.log('Extracting Mental Health facility data...');
const mhInserts = [];
const mhInsertMatches = mentalHealthSql.matchAll(/INSERT INTO `datamentalhealth` VALUES \(([^)]+(?:\([^)]*\)[^)]*)*)\)/g);
for (const match of mhInsertMatches) {
  mhInserts.push(match[1]);
}
console.log(`Found ${mhInserts.length} Mental Health INSERT statements`);

// Extract Substance Abuse data  
console.log('Extracting Substance Abuse facility data...');
const saInserts = [];
const saInsertMatches = substanceAbuseSql.matchAll(/INSERT INTO `final_2024_substancetreatmentagency` VALUES \(([^)]+(?:\([^)]*\)[^)]*)*)\)/g);
for (const match of saInsertMatches) {
  saInserts.push(match[1]);
}
console.log(`Found ${saInserts.length} Substance Abuse INSERT statements`);

// Generate INSERT statements for Mental Health (with directory_type = 'mental')
combinedSql += `-- Mental Health Facilities\n`;
combinedSql += `-- Total: ${mhInserts.length} facilities\n\n`;

let id = 1;
for (const values of mhInserts) {
  // Remove the id from the original values (first value) and add our own id + directory_type
  const valuesWithoutId = values.replace(/^\d+,\s*/, '');
  combinedSql += `INSERT INTO \`facilities\` VALUES (${id},'mental',${valuesWithoutId});\n`;
  id++;
}

combinedSql += `\n-- Substance Abuse Facilities\n`;
combinedSql += `-- Total: ${saInserts.length} facilities\n\n`;

for (const values of saInserts) {
  // Substance abuse table doesn't have an id column, so we just add id + directory_type at the start
  combinedSql += `INSERT INTO \`facilities\` VALUES (${id},'substance',${values});\n`;
  id++;
}

combinedSql += `\nSET FOREIGN_KEY_CHECKS = 1;\n`;

// Write the combined SQL file
const outputPath = path.join(__dirname, '../combined_facilities_v2.sql');
fs.writeFileSync(outputPath, combinedSql, 'utf8');

console.log(`\nCombined SQL file generated successfully!`);
console.log(`Output: ${outputPath}`);
console.log(`Total facilities: ${id - 1}`);
console.log(`  - Mental Health: ${mhInserts.length}`);
console.log(`  - Substance Abuse: ${saInserts.length}`);
