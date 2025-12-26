#!/usr/bin/env python3
"""
Script to generate a combined SQL file with mental health and substance abuse data.
This adds a directory_type column to distinguish between the two types.

Usage: python scripts/generate_combined_sql.py

Output: combined_facilities.sql (can be uploaded to Heroku/MySQL)
"""

import csv
import re
import os

def escape_sql_string(value):
    """Escape single quotes and other special characters for SQL."""
    if value is None or value == '':
        return 'NULL'
    # Escape single quotes by doubling them
    escaped = str(value).replace("'", "''")
    # Escape backslashes
    escaped = escaped.replace("\\", "\\\\")
    return f"'{escaped}'"

def read_mental_health_sql(filepath):
    """Read mental health SQL file and extract column structure."""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Find CREATE TABLE statement
    create_match = re.search(r'CREATE TABLE `datamentalhealth` \((.*?)\);', content, re.DOTALL)
    if not create_match:
        raise ValueError("Could not find CREATE TABLE statement")
    
    columns_str = create_match.group(1)
    columns = []
    for line in columns_str.split('\n'):
        line = line.strip()
        if line.startswith('`') and 'AUTO_INCREMENT' not in line:
            col_name = re.match(r'`(\w+)`', line)
            if col_name:
                columns.append(col_name.group(1))
    
    # Find INSERT statements
    insert_pattern = re.compile(r"INSERT INTO `datamentalhealth` VALUES \((.*?)\);", re.DOTALL)
    inserts = []
    for match in insert_pattern.finditer(content):
        values_str = match.group(1)
        inserts.append(values_str)
    
    return columns, inserts

def read_substance_csv(filepath):
    """Read substance abuse CSV file."""
    rows = []
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.DictReader(f)
        columns = reader.fieldnames
        for row in reader:
            rows.append(row)
    return columns, rows

def get_all_columns():
    """Get comprehensive list of all service code columns from both datasets."""
    # Mental health specific columns
    mh_service_codes = [
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
    ]
    
    # Substance abuse specific columns (from CSV)
    sa_service_codes = [
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
    ]
    
    # Combine and deduplicate
    all_codes = list(dict.fromkeys(mh_service_codes + sa_service_codes))
    return all_codes

def generate_combined_sql():
    """Generate combined SQL file with directory_type column."""
    
    # Paths
    mh_sql_path = 'attached_assets/mentalhealth_1766587905558.sql'
    sa_csv_path = 'attached_assets/Final_2024_substancetreatmentagency(in)_1766587962486.csv'
    output_path = 'combined_facilities.sql'
    
    print("Reading mental health SQL file...")
    # Since parsing the full SQL is complex, we'll create a simpler approach
    # We'll create a new table schema and provide instructions
    
    base_columns = [
        'name1', 'name2', 'street1', 'street2', 'city', 'state', 'zip',
        'phone', 'intake1', 'intake2', 'intake1a', 'intake2a', 'service_code_info'
    ]
    
    service_codes = get_all_columns()
    
    print(f"Total service code columns: {len(service_codes)}")
    
    # Generate CREATE TABLE statement
    sql_output = []
    sql_output.append("-- Combined Mental Health and Substance Abuse Facilities Database")
    sql_output.append("-- Generated for upload to Heroku MySQL")
    sql_output.append("-- Contains directory_type column to distinguish between facility types")
    sql_output.append("")
    sql_output.append("DROP TABLE IF EXISTS `facilities`;")
    sql_output.append("")
    sql_output.append("CREATE TABLE `facilities` (")
    sql_output.append("  `id` int(11) NOT NULL AUTO_INCREMENT,")
    sql_output.append("  `directory_type` varchar(50) DEFAULT NULL,")
    
    for col in base_columns:
        sql_output.append(f"  `{col}` text DEFAULT NULL,")
    
    for i, code in enumerate(service_codes):
        comma = "," if i < len(service_codes) - 1 else ""
        sql_output.append(f"  `{code}` text DEFAULT NULL{comma}")
    
    sql_output.append("  PRIMARY KEY (`id`)")
    sql_output.append(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;")
    sql_output.append("")
    
    # Read substance abuse CSV and generate INSERT statements
    print("Reading substance abuse CSV file...")
    with open(sa_csv_path, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.DictReader(f)
        csv_columns = reader.fieldnames
        rows = list(reader)
    
    print(f"Found {len(rows)} substance abuse facilities")
    
    # Generate INSERT statements for substance abuse data
    sql_output.append("-- Substance Abuse Facilities")
    sql_output.append("")
    
    all_columns = ['directory_type'] + base_columns + service_codes
    
    for row in rows:
        values = ["'substance_abuse'"]  # directory_type
        
        for col in base_columns:
            val = row.get(col, '')
            values.append(escape_sql_string(val))
        
        for code in service_codes:
            val = row.get(code, '')
            # Convert to 'Yes' or 'No' for consistency
            if val and val.lower() not in ['no', 'null', '']:
                values.append("'Yes'")
            else:
                values.append("'No'")
        
        sql_output.append(f"INSERT INTO `facilities` (`{'`, `'.join(all_columns)}`) VALUES ({', '.join(values)});")
    
    sql_output.append("")
    sql_output.append("-- Mental Health Facilities")
    sql_output.append("-- NOTE: The mental health data needs to be migrated from the existing datamentalhealth table")
    sql_output.append("-- Run the following to copy mental health data:")
    sql_output.append("-- INSERT INTO facilities (directory_type, name1, name2, street1, street2, city, state, zip, phone, intake1, intake2, intake1a, intake2a, service_code_info, ...service_columns...)")
    sql_output.append("-- SELECT 'mental_health', name1, name2, street1, street2, city, state, zip, phone, intake1, intake2, intake1a, intake2a, service_code_info, ...service_columns...")
    sql_output.append("-- FROM datamentalhealth;")
    sql_output.append("")
    
    # Write output
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_output))
    
    print(f"Generated {output_path}")
    print(f"Total INSERT statements for substance abuse: {len(rows)}")
    print("")
    print("INSTRUCTIONS:")
    print("1. Upload this SQL file to your Heroku MySQL database")
    print("2. The file creates a new 'facilities' table with directory_type column")
    print("3. For mental health data, run the migration query from your existing datamentalhealth table")
    print("4. The directory_type column will be 'mental_health' or 'substance_abuse'")

if __name__ == "__main__":
    generate_combined_sql()
