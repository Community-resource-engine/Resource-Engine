#!/usr/bin/env node
/**
 * Script to generate a combined SQL file with mental health and substance abuse data.
 * This adds a directory_type column to distinguish between the two types.
 *
 * Usage: node scripts/generate_combined_sql.js
 *
 * Output: combined_facilities.sql (can be uploaded to Heroku/MySQL)
 */

import fs from 'fs';
import path from 'path';

function escapeSqlString(value) {
  if (value === null || value === undefined || value === '') {
    return 'NULL';
  }
  const escaped = String(value).replace(/'/g, "''").replace(/\\/g, "\\\\");
  return `'${escaped}'`;
}

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    rows.push(row);
  }
  
  return { headers, rows };
}

function getAllServiceCodes() {
  const mhServiceCodes = [
    'SA', 'MH', 'SUMH', 'HI', 'OP', 'PHDT', 'RES', 'CMHC', 'CBHC', 'MSMH', 'OMH',
    'ORES', 'PH', 'PSY', 'RTCA', 'RTCC', 'IPSY', 'SHP', 'VAHC', 'CHLOR', 'DROPE',
    'FLUPH', 'HALOP', 'LOXAP', 'PERPH', 'PIMOZ', 'PROCH', 'THIOT', 'THIOR', 'TRIFL',
    'ARIPI', 'ASENA', 'BREXP', 'CARIP', 'CLOZA', 'ILOPE', 'LURAS', 'OLANZ', 'OLANZF',
    'PALIP', 'QUETI', 'RISPE', 'ZIPRA', 'NRT', 'NSC', 'ANTPYCH', 'AT', 'CBT', 'CRT',
    'CFT', 'DBT', 'ECT', 'EMDR', 'GT', 'IDD', 'IPT', 'KIT', 'TMS', 'TELE', 'AIM',
    'CIT', 'PEON', 'PEOFF', 'WI', 'DDF', 'LCCG', 'IH', 'PVTP', 'PVTN', 'STG', 'TBG',
    'FED', 'VAMC', 'FQHC', 'MHC', 'CLF', 'CMHG', 'CSBG', 'FG', 'ITU', 'MC', 'MD',
    'MI', 'OSF', 'PI', 'PCF', 'SCJJ', 'SEF', 'SF', 'SI', 'SMHA', 'SWFS', 'VAF',
    'PA', 'SS', 'TAY', 'SE', 'GL', 'VET', 'ADM', 'MF', 'CJ', 'CO', 'HV', 'DV',
    'TRMA', 'TBI', 'ALZ', 'PED', 'PEFP', 'PTSD', 'SED', 'SMI', 'STU', 'HIVT',
    'STDT', 'TBS', 'MST', 'HBT', 'HCT', 'LABT', 'HS', 'PEER', 'TCC', 'SMON',
    'SMOP', 'SMPD', 'CHLD', 'YAD', 'ADLT', 'SNR', 'SP', 'AH', 'NX', 'FX',
    'ACT', 'AOT', 'CDM', 'COOT', 'DEC', 'FPSY', 'ICM', 'IMR', 'LAD', 'PRS',
    'SEMP', 'SH', 'TPC', 'VRS', 'CM', 'IPC', 'SPS', 'ES'
  ];
  
  const saServiceCodes = [
    'DT', 'HH', 'HID', 'HIT', 'OD', 'ODT', 'OIT', 'OMB', 'ORT', 'RD', 'RL', 'RS',
    'GH', 'PSYH', 'MU', 'BU', 'NU', 'INPE', 'RPE', 'PC', 'NAUT', 'NMAUT', 'ACMA',
    'PMAT', 'AUINPE', 'AURPE', 'AUPC', 'DB', 'BUM', 'OTP', 'DM', 'MM', 'UB', 'UN',
    'RPN', 'PAIN', 'MOA', 'NMOA', 'DLC', 'NOOP', 'MWS', 'ACM', 'DSF', 'METH',
    'BSDM', 'BWN', 'BWON', 'BERI', 'NXN', 'VTRL', 'MHIV', 'MHCV', 'LFXD', 'CLND',
    'MMD', 'MPEP', 'ANG', 'BIA', 'CMI', 'CRV', 'MOTI', 'MXM', 'RELP', 'SACA', 'TRC',
    'TWFA', 'STAG', 'STMH', 'STDH', 'CARF', 'COA', 'HFAP', 'HLA', 'JC', 'NCQA',
    'SOTP', 'DEA', 'FSA', 'NP', 'SAMF', 'AD', 'WN', 'PW', 'MN', 'COPSU', 'XA',
    'CMHA', 'CSAA', 'ISC', 'OPC', 'MHPA', 'SSA', 'SMHD', 'PIEC', 'BABA', 'DAOF',
    'DAUT', 'ACC', 'DP', 'NOE', 'OFD', 'SHG', 'AOSS', 'RC', 'EMP', 'TGD', 'TOD',
    'ADTX', 'BDTX', 'CDTX', 'MDTX', 'ODTX', 'MDET', 'HAEC', 'TAEC', 'HEOH', 'SAE',
    'ICO', 'GCO', 'FCO', 'MCO', 'VOC', 'HAV', 'HBV', 'FEM', 'MALE', 'DU', 'DUO',
    'AUDO', 'OUDO', 'F4', 'F17', 'F19', 'F25', 'F28', 'F30', 'F31', 'F35', 'F36',
    'F37', 'F42', 'F43', 'F47', 'F66', 'F67', 'F70', 'F81', 'F92', 'N24', 'N40',
    'VAPN', 'VAPP', 'VPPD', 'ACU', 'BC', 'CCC', 'DVFP', 'EIH', 'MHS', 'SSD', 'TA'
  ];
  
  const allCodes = [...new Set([...mhServiceCodes, ...saServiceCodes])];
  return allCodes;
}

function generateCombinedSQL() {
  const saCsvPath = 'attached_assets/Final_2024_substancetreatmentagency(in)_1766587962486.csv';
  const outputPath = 'combined_facilities.sql';
  
  console.log('Reading substance abuse CSV file...');
  
  const baseColumns = [
    'name1', 'name2', 'street1', 'street2', 'city', 'state', 'zip',
    'phone', 'intake1', 'intake2', 'intake1a', 'intake2a', 'service_code_info'
  ];
  
  const serviceCodes = getAllServiceCodes();
  console.log(`Total service code columns: ${serviceCodes.length}`);
  
  const sqlOutput = [];
  sqlOutput.push('-- Combined Mental Health and Substance Abuse Facilities Database');
  sqlOutput.push('-- Generated for upload to Heroku MySQL');
  sqlOutput.push('-- Contains directory_type column to distinguish between facility types');
  sqlOutput.push('');
  sqlOutput.push('DROP TABLE IF EXISTS `facilities`;');
  sqlOutput.push('');
  sqlOutput.push('CREATE TABLE `facilities` (');
  sqlOutput.push('  `id` int(11) NOT NULL AUTO_INCREMENT,');
  sqlOutput.push('  `directory_type` varchar(50) DEFAULT NULL,');
  
  baseColumns.forEach(col => {
    sqlOutput.push(`  \`${col}\` text DEFAULT NULL,`);
  });
  
  serviceCodes.forEach((code, i) => {
    const comma = i < serviceCodes.length - 1 ? ',' : '';
    sqlOutput.push(`  \`${code}\` text DEFAULT NULL${comma}`);
  });
  
  sqlOutput.push('  ,PRIMARY KEY (`id`)');
  sqlOutput.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;');
  sqlOutput.push('');
  
  const csvContent = fs.readFileSync(saCsvPath, 'utf-8');
  const { rows } = parseCSV(csvContent);
  
  console.log(`Found ${rows.length} substance abuse facilities`);
  
  sqlOutput.push('-- Substance Abuse Facilities');
  sqlOutput.push('');
  
  const allColumns = ['directory_type', ...baseColumns, ...serviceCodes];
  
  rows.forEach(row => {
    const values = ["'substance_abuse'"];
    
    baseColumns.forEach(col => {
      values.push(escapeSqlString(row[col] || ''));
    });
    
    serviceCodes.forEach(code => {
      const val = row[code] || '';
      if (val && val.toLowerCase() !== 'no' && val !== 'NULL' && val !== '') {
        values.push("'Yes'");
      } else {
        values.push("'No'");
      }
    });
    
    sqlOutput.push(`INSERT INTO \`facilities\` (\`${allColumns.join('`, `')}\`) VALUES (${values.join(', ')});`);
  });
  
  sqlOutput.push('');
  sqlOutput.push('-- Mental Health Facilities');
  sqlOutput.push('-- NOTE: To add mental health data, run this migration query from your existing datamentalhealth table:');
  sqlOutput.push('--');
  sqlOutput.push("-- INSERT INTO facilities (directory_type, name1, name2, street1, street2, city, state, zip, phone, intake1, intake2, intake1a, intake2a, service_code_info, SA, MH, SUMH, ...)");
  sqlOutput.push("-- SELECT 'mental_health', name1, name2, street1, street2, city, state, zip, phone, intake1, intake2, intake1a, intake2a, service_code_info, SA, MH, SUMH, ...");
  sqlOutput.push('-- FROM datamentalhealth;');
  sqlOutput.push('');
  
  fs.writeFileSync(outputPath, sqlOutput.join('\n'));
  
  console.log(`Generated ${outputPath}`);
  console.log(`Total INSERT statements for substance abuse: ${rows.length}`);
  console.log('');
  console.log('INSTRUCTIONS:');
  console.log('1. Upload this SQL file to your Heroku MySQL database');
  console.log('2. The file creates a new "facilities" table with directory_type column');
  console.log('3. For mental health data, run the migration query from your existing datamentalhealth table');
  console.log('4. The directory_type column will be "mental_health" or "substance_abuse"');
}

generateCombinedSQL();
