"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ChevronLeft,
  Filter,
  MapPin,
  Phone,
  Search,
  X,
  ArrowRight,
  Check,
  Brain,
  Pill,
} from "lucide-react"
import { facilities, getServiceInfo as getServiceInfoFromLib } from "@/lib/facility-data"

const mentalHealthData = {
  "Type of Care": [
    { code: "SA", name: "Substance use treatment" },
    { code: "MH", name: "Mental health treatment" },
    { code: "SUMH", name: "Treatment for co-occurring substance use plus serious mental health illness" },
  ],
  "Service Setting": [
    { code: "HI", name: "Hospital inpatient/24-hour hospital inpatient" },
    { code: "OP", name: "Outpatient" },
    { code: "PHDT", name: "Partial hospitalization/day treatment" },
    { code: "RES", name: "Residential/24-hour residential" },
  ],
  "Facility Type": [
    { code: "CMHC", name: "Community mental health center" },
    { code: "CBHC", name: "Certified Community Behavioral Health Clinic" },
    { code: "MSMH", name: "Multi-setting mental health facility" },
    { code: "OMH", name: "Outpatient mental health facility" },
    { code: "ORES", name: "Other residential treatment facility" },
    { code: "PH", name: "Partial hospitalization/day treatment" },
    { code: "PSY", name: "Psychiatric hospital" },
    { code: "RTCA", name: "Residential treatment center (RTC) for adults" },
    { code: "RTCC", name: "Residential treatment center (RTC) for children" },
    { code: "IPSY", name: "Separate inpatient psychiatric unit of a general hospital" },
    { code: "SHP", name: "State hospital" },
    { code: "VAHC", name: "Veterans Affairs Medical Center or other VA healthcare facility" },
  ],
  "Treatment Approaches": [
    { code: "AT", name: "Activity therapy" },
    { code: "CBT", name: "Cognitive behavioral therapy" },
    { code: "CRT", name: "Cognitive remediation therapy" },
    { code: "CFT", name: "Couples/family therapy" },
    { code: "DBT", name: "Dialectical behavior therapy" },
    { code: "ECT", name: "Electroconvulsive therapy" },
    { code: "EMDR", name: "Eye Movement Desensitization and Reprocessing therapy" },
    { code: "GT", name: "Group therapy" },
    { code: "IDD", name: "Integrated Mental and Substance Use Disorder treatment" },
    { code: "IPT", name: "Individual psychotherapy" },
    { code: "KIT", name: "Ketamine Infusion Therapy" },
    { code: "TMS", name: "Transcranial Magnetic Stimulation" },
    { code: "TELE", name: "Telemedicine/telehealth therapy" },
    { code: "AIM", name: "Abnormal involuntary movement scale" },
  ],
  Pharmacotherapies: [
    { code: "CHLOR", name: "Chlorpromazine" },
    { code: "DROPE", name: "Droperidol" },
    { code: "FLUPH", name: "Fluphenazine" },
    { code: "HALOP", name: "Haloperidol" },
    { code: "LOXAP", name: "Loxapine" },
    { code: "PERPH", name: "Perphenazine" },
    { code: "PIMOZ", name: "Pimozide" },
    { code: "PROCH", name: "Prochlorperazine" },
    { code: "THIOT", name: "Thiothixene" },
    { code: "THIOR", name: "Thioridazine" },
    { code: "TRIFL", name: "Trifluoperazine" },
    { code: "ARIPI", name: "Aripiprazole" },
    { code: "ASENA", name: "Asenapine" },
    { code: "BREXP", name: "Brexpiprazole" },
    { code: "CARIP", name: "Cariprazine" },
    { code: "CLOZA", name: "Clozapine" },
    { code: "ILOPE", name: "Iloperidone" },
    { code: "LURAS", name: "Lurasidone" },
    { code: "OLANZ", name: "Olanzapine" },
    { code: "OLANZF", name: "Olanzapine/Fluoxetine combination" },
    { code: "PALIP", name: "Paliperidone" },
    { code: "QUETI", name: "Quetiapine" },
    { code: "RISPE", name: "Risperidone" },
    { code: "ZIPRA", name: "Ziprasidone" },
    { code: "NRT", name: "Nicotine replacement" },
    { code: "NSC", name: "Non-nicotine smoking/tobacco cessation" },
    { code: "ANTPYCH", name: "Antipsychotics used in treatment of SMI" },
  ],
  "Emergency Services": [
    { code: "CIT", name: "Crisis intervention team" },
    { code: "PEON", name: "Psychiatric emergency onsite services" },
    { code: "PEOFF", name: "Psychiatric emergency mobile/off-site services" },
    { code: "WI", name: "Psychiatric emergency walk-in services" },
  ],
  "Facility Operation": [
    { code: "DDF", name: "Department of Defense" },
    { code: "LCCG", name: "Local, county, or community government" },
    { code: "IH", name: "Indian Health Services" },
    { code: "PVTP", name: "Private for-profit organization" },
    { code: "PVTN", name: "Private non-profit organization" },
    { code: "STG", name: "State government" },
    { code: "TBG", name: "Tribal government" },
    { code: "FED", name: "Federal Government" },
    { code: "VAMC", name: "U.S. Department of Veterans Affairs" },
  ],
  "License/Certification/Accreditation": [
    { code: "FQHC", name: "Federally Qualified Health Center" },
    { code: "MHC", name: "Mental health clinic or mental health center" },
  ],
  "Payment Accepted": [
    { code: "CLF", name: "County or local government funds" },
    { code: "CMHG", name: "Community Mental Health Block Grants" },
    { code: "CSBG", name: "Community Service Block Grants" },
    { code: "FG", name: "Federal Grants" },
    { code: "ITU", name: "IHS/Tribal/Urban (ITU) funds" },
    { code: "MC", name: "Medicare" },
    { code: "MD", name: "Medicaid" },
    { code: "MI", name: "Federal military insurance (TRICARE)" },
    { code: "OSF", name: "Other State funds" },
    { code: "PI", name: "Private health insurance" },
    { code: "PCF", name: "Private or Community foundation" },
    { code: "SCJJ", name: "State corrections or juvenile justice funds" },
    { code: "SEF", name: "State education agency funds" },
    { code: "SF", name: "Cash or self-payment" },
    { code: "SI", name: "State-financed health insurance plan other than Medicaid" },
    { code: "SMHA", name: "State mental health agency funds" },
    { code: "SWFS", name: "State welfare or child and family services funds" },
    { code: "VAF", name: "U.S. Department of VA funds" },
  ],
  "Payment Assistance": [
    { code: "PA", name: "Payment assistance (check with facility for details)" },
    { code: "SS", name: "Sliding fee scale (fee is based on income and other factors)" },
  ],
  "Special Programs": [
    { code: "TAY", name: "Young adults" },
    { code: "SE", name: "Seniors or older adults" },
    { code: "GL", name: "Lesbian, gay, bisexual, transgender, or queer/questioning (LGBTQ)" },
    { code: "VET", name: "Veterans" },
    { code: "ADM", name: "Active duty military" },
    { code: "MF", name: "Members of military families" },
    { code: "CJ", name: "Criminal justice (other than DUI/DWI)/Forensic clients" },
    { code: "CO", name: "Clients with co-occurring mental and substance use disorders" },
    { code: "HV", name: "Clients with HIV or AIDS" },
    { code: "DV", name: "Clients who have experienced intimate partner violence, domestic violence" },
    { code: "TRMA", name: "Clients who have experienced trauma" },
    { code: "TBI", name: "Persons with traumatic brain injury (TBI)" },
    { code: "ALZ", name: "Persons with Alzheimer's or dementia" },
    { code: "PED", name: "Persons with eating disorders" },
    { code: "PEFP", name: "Persons experiencing first-episode psychosis" },
    { code: "PTSD", name: "Persons with post-traumatic stress disorder (PTSD)" },
    { code: "SED", name: "Children/adolescents with serious emotional disturbance (SED)" },
    { code: "SMI", name: "Persons 18 and older with serious mental illness (SMI)" },
  ],
  "Assessment/Pre-treatment": [{ code: "STU", name: "Screening for tobacco use" }],
  Testing: [
    { code: "HIVT", name: "HIV testing" },
    { code: "STDT", name: "STD testing" },
    { code: "TBS", name: "TB screening" },
    { code: "MST", name: "Metabolic syndrome monitoring" },
    { code: "HBT", name: "Testing for Hepatitis B (HBV)" },
    { code: "HCT", name: "Testing for Hepatitis C (HCV)" },
    { code: "LABT", name: "Laboratory testing" },
  ],
  "Ancillary Services": [
    { code: "HS", name: "Housing services" },
    { code: "PEER", name: "Mentoring/peer support" },
    { code: "TCC", name: "Smoking/vaping/tobacco cessation counseling" },
    { code: "ACT", name: "Assertive community treatment" },
    { code: "AOT", name: "Assisted Outpatient Treatment" },
    { code: "CDM", name: "Chronic disease/illness management" },
    { code: "COOT", name: "Court-ordered outpatient treatment" },
    { code: "DEC", name: "Diet and exercise counseling" },
    { code: "FPSY", name: "Family psychoeducation" },
    { code: "ICM", name: "Intensive case management" },
    { code: "IMR", name: "Illness management and recovery" },
    { code: "LAD", name: "Legal advocacy" },
    { code: "PRS", name: "Psychosocial rehabilitation services" },
    { code: "SEMP", name: "Supported employment" },
    { code: "SH", name: "Supported housing" },
    { code: "TPC", name: "Therapeutic foster care" },
    { code: "VRS", name: "Vocational rehabilitation services" },
    { code: "CM", name: "Case management service" },
    { code: "IPC", name: "Integrated primary care services" },
    { code: "SPS", name: "Suicide prevention services" },
    { code: "ES", name: "Education services" },
  ],
  "Age Groups": [
    { code: "CHLD", name: "Children/Adolescents" },
    { code: "YAD", name: "Young Adults" },
    { code: "ADLT", name: "Adults" },
    { code: "SNR", name: "Seniors" },
  ],
  "Language Services": [
    { code: "SP", name: "Spanish" },
    { code: "AH", name: "Sign language services for the deaf and hard of hearing" },
    { code: "NX", name: "American Indian or Alaska Native languages" },
    { code: "FX", name: "Other languages (excluding Spanish)" },
    { code: "F4", name: "Arabic" },
    { code: "F17", name: "Any Chinese Language" },
    { code: "F19", name: "Creole" },
    { code: "F25", name: "Farsi" },
    { code: "F28", name: "French" },
    { code: "F30", name: "German" },
    { code: "F31", name: "Greek" },
    { code: "F35", name: "Hebrew" },
    { code: "F36", name: "Hindi" },
    { code: "F37", name: "Hmong" },
    { code: "F42", name: "Italian" },
    { code: "F43", name: "Japanese" },
    { code: "F47", name: "Korean" },
    { code: "F66", name: "Polish" },
    { code: "F67", name: "Portuguese" },
    { code: "F70", name: "Russian" },
    { code: "F81", name: "Tagalog" },
    { code: "F92", name: "Vietnamese" },
    { code: "N24", name: "Ojibwa" },
    { code: "N40", name: "Yupik" },
  ],
  "Facility Smoking Policy": [
    { code: "SMON", name: "Smoking not permitted" },
    { code: "SMOP", name: "Smoking permitted without restriction" },
    { code: "SMPD", name: "Smoking permitted in designated area" },
  ],
}

const MH_SERVICE_CATEGORIES = {
  "Type of Care": [
    { code: "SA", name: "Substance use treatment" },
    { code: "MH", name: "Mental health treatment" },
    { code: "DT", name: "Detoxification" },
    { code: "HH", name: "Transitional housing, halfway house, or sober home" },
    { code: "SUMH", name: "Co-occurring substance use plus serious mental health illness" },
  ],
  "Service Setting": [
    { code: "HI", name: "Hospital inpatient/24-hour hospital inpatient" },
    { code: "OP", name: "Outpatient" },
    { code: "PHDT", name: "Partial hospitalization/day treatment" },
    { code: "RES", name: "Residential/24-hour residential" },
  ],
  "Facility Type": [
    { code: "CMHC", name: "Community mental health center" },
    { code: "CBHC", name: "Certified Community Behavioral Health Clinic" },
    { code: "MSMH", name: "Multi-setting mental health facility" },
    { code: "OMH", name: "Outpatient mental health facility" },
    { code: "ORES", name: "Other residential treatment facility" },
    { code: "PH", name: "Partial hospitalization/day treatment" },
    { code: "PSY", name: "Psychiatric hospital" },
    { code: "RTCA", name: "Residential treatment center (RTC) for adults" },
    { code: "RTCC", name: "Residential treatment center (RTC) for children" },
    { code: "IPSY", name: "Separate inpatient psychiatric unit of a general hospital" },
    { code: "SHP", name: "State hospital" },
    { code: "VAHC", name: "Veterans Affairs Medical Center or other VA healthcare facility" },
  ],
  "Treatment Approaches": [
    { code: "AT", name: "Activity therapy" },
    { code: "ANG", name: "Anger management" },
    { code: "BIA", name: "Brief intervention" },
    { code: "CBT", name: "Cognitive behavioral therapy" },
    { code: "CMI", name: "Contingency management/motivational incentives" },
    { code: "CRT", name: "Cognitive remediation therapy" },
    { code: "CRV", name: "Community reinforcement plus vouchers" },
    { code: "CFT", name: "Couples/family therapy" },
    { code: "DBT", name: "Dialectical behavior therapy" },
    { code: "ECT", name: "Electroconvulsive therapy" },
    { code: "EMDR", name: "Eye Movement Desensitization and Reprocessing therapy" },
    { code: "GT", name: "Group therapy" },
    { code: "IDD", name: "Integrated Mental and Substance Use Disorder treatment" },
    { code: "IPT", name: "Individual psychotherapy" },
    { code: "KIT", name: "Ketamine Infusion Therapy" },
    { code: "MOTI", name: "Motivational interviewing" },
    { code: "MXM", name: "Matrix Model" },
    { code: "RELP", name: "Relapse prevention" },
    { code: "SACA", name: "Substance use disorder counseling" },
    { code: "TMS", name: "Transcranial Magnetic Stimulation" },
    { code: "TRC", name: "Trauma-related counseling" },
    { code: "TELE", name: "Telemedicine/telehealth therapy" },
    { code: "TWFA", name: "12-step facilitation" },
  ],
  Pharmacotherapies: [
    { code: "AMED", name: "Medications for addiction (general)" },
    { code: "METH", name: "Methadone" },
    { code: "BUP", name: "Buprenorphine" },
    { code: "NALTR", name: "Naltrexone" },
    { code: "DSLF", name: "Disulfiram" },
    { code: "ACAM", name: "Acamprosate" },
    { code: "MD", name: "Psychiatric medications" },
  ],
  "Emergency Services": [
    { code: "CIT", name: "Crisis intervention team" },
    { code: "PEON", name: "Psychiatric emergency onsite services" },
    { code: "PEOFF", name: "Psychiatric emergency mobile/off-site services" },
    { code: "WI", name: "Psychiatric emergency walk-in services" },
  ],
  "Facility Operation": [
    { code: "PR", name: "Private for-profit organization" },
    { code: "PNP", name: "Private non-profit organization" },
    { code: "LGV", name: "Local, county, or community government" },
    { code: "SGV", name: "State government" },
    { code: "FGV", name: "Federal government" },
    { code: "TB", name: "Tribal government" },
  ],
  "Licenses/Certs": [
    { code: "FQHC", name: "Federally Qualified Health Center" },
    { code: "MHC", name: "Mental health clinic or mental health center" },
    { code: "JCAH", name: "Joint Commission accreditation" },
    { code: "CARF", name: "CARF accreditation" },
    { code: "COLA", name: "COLA accreditation" },
    { code: "NCQA", name: "NCQA accreditation" },
    { code: "SLIC", name: "State license" },
    { code: "DHHS", name: "HHS certification" },
    { code: "AOA", name: "AOA Healthcare Facilities accreditation" },
  ],
  "Payment Accepted": [
    { code: "CLF", name: "County or local government funds" },
    { code: "CMHG", name: "Community Mental Health Block Grants" },
    { code: "FSA", name: "Federal/government funding for substance use programs" },
    { code: "ITU", name: "IHS/Tribal/Urban (ITU) funds" },
    { code: "MC", name: "Medicare" },
    { code: "MD", name: "Medicaid" },
    { code: "MI", name: "Federal military insurance (TRICARE)" },
    { code: "PI", name: "Private health insurance" },
    { code: "SF", name: "Cash or self-payment" },
    { code: "SI", name: "State-financed health insurance plan other than Medicaid" },
    { code: "SS", name: "Sliding fee scale" },
    { code: "SAMF", name: "SAMHSA funding/block grants" },
    { code: "PA", name: "Payment assistance" },
    { code: "VAF", name: "U.S. Department of VA funds" },
  ],
  "Payment Assistance": [
    { code: "SS", name: "Sliding fee scale" },
    { code: "PA", name: "Payment assistance available" },
    { code: "NF", name: "No fee/Free treatment" },
  ],
  "Special Programs": [
    { code: "AD", name: "Adolescents" },
    { code: "TAY", name: "Young adults" },
    { code: "WN", name: "Adult women" },
    { code: "PW", name: "Pregnant/postpartum women" },
    { code: "MN", name: "Adult men" },
    { code: "SE", name: "Seniors or older adults" },
    { code: "GL", name: "LGBTQ" },
    { code: "VET", name: "Veterans" },
    { code: "ADM", name: "Active duty military" },
    { code: "CJ", name: "Criminal justice/Forensic clients" },
    { code: "CO", name: "Co-occurring mental and substance use disorders" },
    { code: "COPSU", name: "Co-occurring pain and substance use disorders" },
    { code: "HV", name: "Clients with HIV or AIDS" },
    { code: "DV", name: "Domestic violence" },
    { code: "TRMA", name: "Clients who have experienced trauma" },
    { code: "PTSD", name: "Post-traumatic stress disorder (PTSD)" },
    { code: "SED", name: "Children/adolescents with serious emotional disturbance" },
    { code: "SMI", name: "Persons 18+ with serious mental illness" },
  ],
  Assessment: [
    { code: "COMP", name: "Comprehensive mental health assessment" },
    { code: "DIAG", name: "Diagnostic evaluation" },
    { code: "SCRN", name: "Screening for mental health disorders" },
    { code: "SBIRT", name: "SBIRT screening" },
    { code: "LSI", name: "Lab testing/screening/intake" },
    { code: "DRUG", name: "Drug or alcohol urine screening" },
    { code: "STD", name: "STD testing" },
    { code: "TB", name: "TB screening" },
    { code: "HIV", name: "HIV testing" },
    { code: "HEPC", name: "Hepatitis C testing" },
    { code: "HEPB", name: "Hepatitis B testing" },
  ],
  Testing: [
    { code: "DRUG", name: "Drug or alcohol urine screening" },
    { code: "STD", name: "STD testing" },
    { code: "TB", name: "TB screening" },
    { code: "HIV", name: "HIV testing" },
    { code: "HEPC", name: "Hepatitis C testing" },
    { code: "HEPB", name: "Hepatitis B testing" },
  ],
  "Ancillary Services": [
    { code: "SHG", name: "Self-help groups" },
    { code: "HS", name: "Housing services" },
    { code: "AOSS", name: "Assistance with obtaining social services" },
    { code: "RC", name: "Recovery coach" },
    { code: "PEER", name: "Mentoring/peer support" },
    { code: "EMP", name: "Employment counseling or training" },
    { code: "TCC", name: "Smoking/vaping/tobacco cessation counseling" },
    { code: "CM", name: "Case management" },
    { code: "SC", name: "Social skills development" },
    { code: "EDU", name: "Education services" },
    { code: "TRANS", name: "Transportation assistance" },
    { code: "CHILD", name: "Childcare services" },
  ],
  "Age Groups": [
    { code: "CHLD", name: "Children/Adolescents" },
    { code: "YAD", name: "Young Adults" },
    { code: "ADLT", name: "Adults" },
    { code: "SNR", name: "Seniors" },
  ],
  "Language Services": [
    { code: "SP", name: "Spanish" },
    { code: "ASL", name: "American Sign Language (ASL)" },
    { code: "OL", name: "Other Languages" },
  ],
  "Smoking Policy": [
    { code: "SNP", name: "Smoking not permitted" },
    { code: "SDA", name: "Smoking permitted in designated areas" },
    { code: "SPO", name: "Smoking permitted without restriction" },
  ],
}

const substanceAbuseData = {
  "Type of Care": [
    { code: "SA", name: "Substance use treatment" },
    { code: "DT", name: "Detoxification" },
    { code: "HH", name: "Transitional housing, halfway house, or sober home" },
    { code: "SUMH", name: "Treatment for co-occurring substance use plus serious mental health illness" },
  ],
  "Service Setting": [
    { code: "HI", name: "Hospital inpatient/24-hour hospital inpatient" },
    { code: "OP", name: "Outpatient" },
    { code: "RES", name: "Residential/24-hour residential" },
    { code: "HID", name: "Hospital inpatient detoxification" },
    { code: "HIT", name: "Hospital inpatient treatment" },
    { code: "OD", name: "Outpatient detoxification" },
    { code: "ODT", name: "Outpatient day treatment or partial hospitalization" },
    { code: "OIT", name: "Intensive outpatient treatment" },
    { code: "OMB", name: "Outpatient methadone/buprenorphine or naltrexone treatment" },
    { code: "ORT", name: "Regular outpatient treatment" },
    { code: "RD", name: "Residential detoxification" },
    { code: "RL", name: "Long-term residential" },
    { code: "RS", name: "Short-term residential" },
  ],
  Hospitals: [
    { code: "GH", name: "General Hospital (including VA hospital)" },
    { code: "PSYH", name: "Psychiatric hospital" },
  ],
  "Opioid Medications used in Treatment": [
    { code: "MU", name: "Methadone used in Treatment" },
    { code: "BU", name: "Buprenorphine used in Treatment" },
    { code: "NU", name: "Naltrexone used in Treatment" },
  ],
  "External Opioid Medications Source": [
    { code: "INPE", name: "In-network prescribing entity" },
    { code: "RPE", name: "Other contracted prescribing entity" },
    { code: "PC", name: "No formal relationship with prescribing entity" },
  ],
  "Type of Alcohol Use Disorder Treatment": [
    { code: "NAUT", name: "Does not treat alcohol use disorder" },
    { code: "NMAUT", name: "Does not use medication assisted treatment for alcohol use disorder" },
    {
      code: "ACMA",
      name: "Accepts clients using medication assisted treatment for alcohol use disorder but prescribed elsewhere",
    },
    { code: "PMAT", name: "This facility administers/prescribes medication for alcohol use disorder" },
  ],
  "External Source of Medications for Alcohol Use Disorder Treatment": [
    { code: "AUINPE", name: "In-network prescribing entity" },
    { code: "AURPE", name: "Other contracted prescribing entity" },
    { code: "AUPC", name: "No formal relationship with prescribing entity" },
  ],
  "Type of Opioid Treatment": [
    { code: "DB", name: "Buprenorphine detoxification" },
    { code: "BUM", name: "Buprenorphine maintenance" },
    { code: "OTP", name: "Federally-certified Opioid Treatment Program" },
    { code: "DM", name: "Methadone detoxification" },
    { code: "MM", name: "Methadone maintenance" },
    { code: "UB", name: "Prescribes buprenorphine" },
    { code: "UN", name: "Prescribes naltrexone" },
    { code: "RPN", name: "Relapse prevention with naltrexone" },
    { code: "PAIN", name: "Use methadone/buprenorphine for pain management or emergency dosing" },
    { code: "MOA", name: "Accepts clients using MAT but prescribed elsewhere" },
    { code: "NMOA", name: "Does not use MAT for opioid use disorders" },
    { code: "DLC", name: "Lofexidine or Clonidine detoxification" },
    { code: "NOOP", name: "Does not treat opioid use disorders" },
    { code: "MWS", name: "Maintenance service with medically supervised withdrawal after stabilization" },
  ],
  Pharmacotherapies: [
    { code: "ACM", name: "Acamprosate (Campral®)" },
    { code: "DSF", name: "Disulfiram" },
    { code: "METH", name: "Methadone" },
    { code: "BSDM", name: "Buprenorphine sub-dermal implant" },
    { code: "BWN", name: "Buprenorphine with naloxone" },
    { code: "BWON", name: "Buprenorphine without naloxone" },
    { code: "BERI", name: "Buprenorphine (extended-release, injectable)" },
    { code: "NXN", name: "Naltrexone (oral)" },
    { code: "VTRL", name: "Naltrexone (extended-release, injectable)" },
    { code: "MHIV", name: "Medications for HIV treatment" },
    { code: "MHCV", name: "Medications for Hepatitis C treatment" },
    { code: "LFXD", name: "Lofexidine" },
    { code: "CLND", name: "Clonidine" },
    { code: "MMD", name: "Medication for mental disorders" },
    { code: "MPEP", name: "Medications for pre-exposure to prophylaxis" },
    { code: "NRT", name: "Nicotine replacement" },
    { code: "NSC", name: "Non-nicotine smoking/tobacco cessation" },
  ],
  "Treatment Approaches": [
    { code: "ANG", name: "Anger management" },
    { code: "BIA", name: "Brief intervention" },
    { code: "CBT", name: "Cognitive behavioral therapy" },
    { code: "CMI", name: "Contingency management/motivational incentives" },
    { code: "CRV", name: "Community reinforcement plus vouchers" },
    { code: "MOTI", name: "Motivational interviewing" },
    { code: "MX", name: "Matrix Model" },
    { code: "RELP", name: "Relapse prevention" },
    { code: "SACA", name: "Substance use disorder counseling" },
    { code: "TRC", name: "Trauma-related counseling" },
    { code: "TELE", name: "Telemedicine/telehealth therapy" },
    { code: "TWFA", name: "12-step facilitation" },
  ],
  "Facility Operation": [
    { code: "LCCG", name: "Local, county, or community government" },
    { code: "DDF", name: "Department of Defense" },
    { code: "IH", name: "Indian Health Services" },
    { code: "PVTP", name: "Private for-profit organization" },
    { code: "PVTN", name: "Private non-profit organization" },
    { code: "STG", name: "State government" },
    { code: "TBG", name: "Tribal government" },
    { code: "FED", name: "Federal Government" },
    { code: "VAMC", name: "U.S. Department of Veterans Affairs" },
  ],
  "License/Certification/Accreditation": [
    { code: "STAG", name: "State Substance use treatment agency" },
    { code: "STMH", name: "State mental health department" },
    { code: "STDH", name: "State department of health" },
    { code: "CARF", name: "Commission on Accreditation of Rehabilitation Facilities (CARF)" },
    { code: "COA", name: "Council on Accreditation (COA)" },
    { code: "HFAP", name: "Healthcare Facilities Accreditation Program (HFAP)" },
    { code: "HLA", name: "Hospital licensing authority" },
    { code: "JC", name: "The Joint Commission" },
    { code: "NCQA", name: "National Committee for Quality Assurance (NCQA)" },
    { code: "FQHC", name: "Federally Qualified Health Center" },
    { code: "SOTP", name: "SAMHSA certification for opioid treatment program (OTP)" },
    { code: "DEA", name: "Drug Enforcement Agency (DEA)" },
  ],
  "Payment Accepted": [
    { code: "FSA", name: "Federal, or any government funding for substance use treatment programs" },
    { code: "ITU", name: "IHS/Tribal/Urban (ITU) funds" },
    { code: "MC", name: "Medicare" },
    { code: "MD", name: "Medicaid" },
    { code: "MI", name: "Federal military insurance (e.g., TRICARE)" },
    { code: "NP", name: "No payment accepted" },
    { code: "PI", name: "Private health insurance" },
    { code: "SF", name: "Cash or self-payment" },
    { code: "SI", name: "State-financed health insurance plan other than Medicaid" },
    { code: "SAMF", name: "SAMHSA funding/block grants" },
  ],
  "Payment Assistance": [
    { code: "PA", name: "Payment assistance (check with facility for details)" },
    { code: "SS", name: "Sliding fee scale (fee is based on income and other factors)" },
  ],
  "Special Programs": [
    { code: "AD", name: "Adolescents" },
    { code: "TAY", name: "Young adults" },
    { code: "WN", name: "Adult women" },
    { code: "PW", name: "Pregnant/postpartum women" },
    { code: "MN", name: "Adult men" },
    { code: "SE", name: "Seniors or older adults" },
    { code: "GL", name: "Lesbian, gay, bisexual, transgender, or queer/questioning (LGBTQ)" },
    { code: "VET", name: "Veterans" },
    { code: "ADM", name: "Active duty military" },
    { code: "MF", name: "Members of military families" },
    { code: "CJ", name: "Criminal justice (other than DUI/DWI)/Forensic clients" },
    { code: "CO", name: "Clients with co-occurring mental and substance use disorders" },
    { code: "COPSU", name: "Clients with co-occurring pain and substance use disorders" },
    { code: "HV", name: "Clients with HIV or AIDS" },
    { code: "XA", name: "Clients who have experienced sexual abuse" },
    { code: "DV", name: "Clients who have experienced intimate partner violence, domestic violence" },
    { code: "TRMA", name: "Clients who have experienced trauma" },
  ],
  "Assessment/Pre-treatment": [
    { code: "CMHA", name: "Comprehensive mental health assessment" },
    { code: "CSAA", name: "Comprehensive substance use assessment" },
    { code: "ISC", name: "Interim services for clients" },
    { code: "OPC", name: "Outreach to persons in the community" },
    { code: "MHPA", name: "Complete medical history/physical exam" },
    { code: "STU", name: "Screening for tobacco use" },
    { code: "SSA", name: "Screening for substance use" },
    { code: "SMHD", name: "Screening for mental disorders" },
    { code: "PIEC", name: "Professional interventionist/educational consultant" },
  ],
  Testing: [
    { code: "BABA", name: "Breathalyzer or blood alcohol testing" },
    { code: "DAOF", name: "Drug and alcohol oral fluid testing" },
    { code: "DAUT", name: "Drug or alcohol urine screening" },
    { code: "HIVT", name: "HIV testing" },
    { code: "STDT", name: "STD testing" },
    { code: "TBS", name: "TB screening" },
    { code: "MST", name: "Metabolic syndrome monitoring" },
    { code: "HBT", name: "Testing for Hepatitis B (HBV)" },
    { code: "HCT", name: "Testing for Hepatitis C (HCV)" },
  ],
  "Transitional Services": [
    { code: "ACC", name: "Aftercare/continuing care" },
    { code: "DP", name: "Discharge Planning" },
    { code: "NOE", name: "Naloxone and overdose education" },
    { code: "OFD", name: "Outcome follow-up after discharge" },
  ],
  "Recovery Support Services": [
    { code: "SHG", name: "Self-help groups" },
    { code: "HS", name: "Housing services" },
    { code: "AOSS", name: "Assistance with obtaining social services" },
    { code: "RC", name: "Recovery coach" },
    { code: "PEER", name: "Mentoring/peer support" },
    { code: "EMP", name: "Employment counseling or training" },
  ],
  "Education and Counseling Services": [
    { code: "HAEC", name: "HIV or AIDS education, counseling, or support" },
    { code: "TAEC", name: "Hepatitis education, counseling, or support" },
    { code: "HEO", name: "Health education services other than HIV/AIDS or hepatitis" },
    { code: "SAE", name: "Substance use disorder education" },
    { code: "TCC", name: "Smoking/vaping/tobacco cessation counseling" },
    { code: "ICO", name: "Individual counseling" },
    { code: "GCO", name: "Group counseling" },
    { code: "FCO", name: "Family counseling" },
    { code: "MCO", name: "Marital/couples counseling" },
    { code: "VOC", name: "Vocational training or educational support" },
  ],
  "Medical Services": [
    { code: "HAV", name: "Hepatitis A (HAV) vaccination" },
    { code: "HBV", name: "Hepatitis B (HBV) vaccination" },
  ],
  "Other Services": [
    { code: "TGD", name: "Treatment for gambling disorder" },
    { code: "TOD", name: "Treatment for other addiction disorder" },
  ],
  "Detoxification Services": [
    { code: "ADTX", name: "Alcohol Detoxification" },
    { code: "BDTX", name: "Benzodiazepines Detoxification" },
    { code: "CDTX", name: "Cocaine Detoxification" },
    { code: "MDTX", name: "Methamphetamines detoxification" },
    { code: "ODTX", name: "Opioids detoxification" },
    { code: "MDET", name: "Medication routinely used during detoxification" },
  ],
  "Ancillary Services": [
    { code: "ACU", name: "Acupuncture" },
    { code: "BC", name: "Residential beds for clients' children" },
    { code: "CM", name: "Case management service" },
    { code: "CCC", name: "Child care for clients' children" },
    { code: "DVFP", name: "Domestic violence services, including family or partner" },
    { code: "EIH", name: "Early intervention for HIV" },
    { code: "MHS", name: "Mental health services" },
    { code: "SSD", name: "Social skills development" },
    { code: "TA", name: "Transportation assistance" },
    { code: "IPC", name: "Integrated primary care services" },
    { code: "SPS", name: "Suicide prevention services" },
  ],
  "Age Groups": [
    { code: "CHLD", name: "Children/Adolescents" },
    { code: "YAD", name: "Young Adults" },
    { code: "ADLT", name: "Adults" },
    { code: "SNR", name: "Seniors" },
  ],
  "Gender Accepted": [
    { code: "FEM", name: "Female" },
    { code: "MALE", name: "Male" },
  ],
  "Exclusive Services": [
    { code: "DU", name: "Specially designed program for DUI/DWI clients" },
    { code: "DUO", name: "Serves only DUI/DWI clients" },
    { code: "AUDO", name: "Alcohol use disorder clients only" },
    { code: "OUDO", name: "Opioid use disorder clients only" },
  ],
  "Language Services": [
    { code: "SP", name: "Spanish" },
    { code: "AH", name: "Sign language services for the deaf and hard of hearing" },
    { code: "NX", name: "American Indian or Alaska Native languages" },
    { code: "FX", name: "Other languages (excluding Spanish)" },
    { code: "F4", name: "Arabic" },
    { code: "F17", name: "Any Chinese Language" },
    { code: "F19", name: "Creole" },
    { code: "F25", name: "Farsi" },
    { code: "F28", name: "French" },
    { code: "F30", name: "German" },
    { code: "F31", name: "Greek" },
    { code: "F35", name: "Hebrew" },
    { code: "F36", name: "Hindi" },
    { code: "F37", name: "Hmong" },
    { code: "F42", name: "Italian" },
    { code: "F43", name: "Japanese" },
    { code: "F47", name: "Korean" },
    { code: "F66", name: "Polish" },
    { code: "F67", name: "Portuguese" },
    { code: "F70", name: "Russian" },
    { code: "F81", name: "Tagalog" },
    { code: "F92", name: "Vietnamese" },
    { code: "N24", name: "Ojibwa" },
    { code: "N40", name: "Yupik" },
  ],
  "Facility Smoking Policy": [
    { code: "SMON", name: "Smoking not permitted" },
    { code: "SMOP", name: "Smoking permitted without restriction" },
    { code: "SMPD", name: "Smoking permitted in designated area" },
  ],
  "Facility Vaping Policy": [
    { code: "VAPN", name: "Vaping not permitted" },
    { code: "VAPP", name: "Vaping permitted without restriction" },
    { code: "VPPD", name: "Vaping permitted in designated area" },
  ],
}

const CATEGORY_COLORS: Record<string, string> = {
  "Type of Care": "bg-blue-50 text-blue-700 border-blue-200",
  "Service Setting": "bg-violet-50 text-violet-700 border-violet-200",
  "Facility Type": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Treatment Approaches": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Opioid Treatment": "bg-amber-50 text-amber-700 border-amber-200",
  "Emergency Services": "bg-rose-50 text-rose-700 border-rose-200",
  "Payment Accepted": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Special Programs": "bg-purple-50 text-purple-700 border-purple-200",
  "Age Groups": "bg-orange-50 text-orange-700 border-orange-200",
  "Language Services": "bg-green-50 text-green-700 border-green-200",
  "Detoxification Services": "bg-red-50 text-red-700 border-red-200",
  Hospitals: "bg-slate-50 text-slate-700 border-slate-200",
  Pharmacotherapies: "bg-pink-50 text-pink-700 border-pink-200",
  Testing: "bg-teal-50 text-teal-700 border-teal-200",
  "Ancillary Services": "bg-lime-50 text-lime-700 border-lime-200",
  "Facility Operation": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "License/Certification/Accreditation": "bg-sky-50 text-sky-700 border-sky-200",
  "Payment Assistance": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Assessment/Pre-treatment": "bg-gray-50 text-gray-700 border-gray-200",
  "Transitional Services": "bg-orange-50 text-orange-700 border-orange-200",
  "Recovery Support Services": "bg-red-50 text-red-700 border-red-200",
  "Education and Counseling Services": "bg-blue-50 text-blue-700 border-blue-200",
  "Medical Services": "bg-violet-50 text-violet-700 border-violet-200",
  "Other Services": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Gender Accepted": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Exclusive Services": "bg-amber-50 text-amber-700 border-amber-200",
  "Facility Smoking Policy": "bg-rose-50 text-rose-700 border-rose-200",
  "Facility Vaping Policy": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Licenses/Certs": "bg-sky-50 text-sky-700 border-sky-200", // Added color for new category
  Assessment: "bg-gray-50 text-gray-700 border-gray-200", // Added color for new category
  "Smoking Policy": "bg-rose-50 text-rose-700 border-rose-200", // Added color for new category
}

console.log("[v0] Facilities loaded:", facilities?.length || 0)

const mockResults = facilities.map((f) => ({
  id: f.id,
  name1: f.name1,
  name2: f.name2,
  street1: f.street1,
  street2: f.street2,
  city: f.city,
  state: f.state,
  zip: f.zip,
  phone: f.phone,
  services: f.services,
}))

console.log("[v0] Mock results created:", mockResults?.length || 0)

function MultiSelectDropdown({
  label,
  options,
  selected,
  onToggle,
  categoryColor,
}: {
  label: string
  options: { code: string; name: string }[]
  selected: string[]
  onToggle: (code: string) => void
  categoryColor: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedCount = selected.filter((s) => options.some((o) => o.code === s)).length

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:border-primary/50 hover:bg-gray-50 transition-all cursor-pointer"
      >
        <span className="text-sm text-gray-700 truncate pr-2">
          {selectedCount > 0 ? `${selectedCount} selected` : `All ${label}`}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h4 className="font-semibold text-gray-900 text-sm">{label}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{options.length} options available</p>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {options.map((option) => {
              const isSelected = selected.includes(option.code)
              return (
                <label
                  key={option.code}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(option.code)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors ${
                      isSelected ? "bg-primary border-primary" : "border-2 border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${categoryColor}`}>{option.code}</span>
                  <span className="text-sm text-gray-700 flex-1 leading-tight">{option.name}</span>
                </label>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">{selectedCount} selected</span>
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  options.forEach((o) => {
                    if (selected.includes(o.code)) onToggle(o.code)
                  })
                }}
                className="text-xs text-primary font-medium hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ResultCard({
  result,
  getServiceInfo,
}: {
  result: (typeof mockResults)[0]
  getServiceInfo: (code: string) => { code: string; name: string; category: string; color: string }
}) {
  const [expanded, setExpanded] = useState(false)
  const visibleServices = expanded ? result.services : result.services.slice(0, 3)
  const hasMore = result.services.length > 3

  const addressParts = [result.street1, result.street2].filter(Boolean).join(", ")
  const cityStateZip = `${result.city}, ${result.state} ${result.zip}`

  return (
    <Link href={`/facility/${result.id}`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
              {result.name1}
            </h3>
            {result.name2 && <p className="text-base text-gray-500 mb-4">{result.name2}</p>}
            {!result.name2 && <div className="mb-4" />}

            {/* Address & Phone */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-600">
                  <p>{addressParts}</p>
                  <p>{cityStateZip}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{result.phone}</span>
              </div>
            </div>

            {/* Services */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Services Offered</p>
              <div className="flex flex-wrap gap-2">
                {visibleServices.map((code) => {
                  const info = getServiceInfo(code)
                  return (
                    <span
                      key={code}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border ${info.color}`}
                    >
                      {info.name}
                    </span>
                  )
                })}
                {hasMore && !expanded && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setExpanded(true)
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    +{result.services.length - 3} more
                  </button>
                )}
                {expanded && hasMore && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setExpanded(false)
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Show less
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

type DirectoryType = "mental" | "substance" | null

export function SearchInterface() {
  const [step, setStep] = useState<"directory" | "search">("directory")
  const [directory, setDirectory] = useState<DirectoryType>(null)
  const [state, setState] = useState("AZ")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [showAllFilters, setShowAllFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 10

  const categories = directory === "mental" ? mentalHealthData : substanceAbuseData
  const categoriesForDisplay = directory === "mental" ? MH_SERVICE_CATEGORIES : substanceAbuseData // Use the updated categories

  const toggleFilter = (code: string) => {
    setSelectedFilters((prev) => (prev.includes(code) ? prev.filter((f) => f !== code) : [...prev, code]))
  }

  const removeFilter = (code: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== code))
  }

  const getServiceInfo = (code: string): { code: string; name: string; category: string; color: string } => {
    const serviceInfo = getServiceInfoFromLib(code)
    if (serviceInfo) {
      // Use the correct category name for color lookup
      const categoryNameForColor =
        serviceInfo.category === "License/Certification/Accreditation"
          ? "Licenses/Certs"
          : serviceInfo.category === "Assessment/Pre-treatment"
            ? "Assessment"
            : serviceInfo.category === "Facility Smoking Policy"
              ? "Smoking Policy"
              : serviceInfo.category
      const color = CATEGORY_COLORS[categoryNameForColor] || "bg-gray-50 text-gray-700 border-gray-200"
      return { ...serviceInfo, color }
    }

    return { code, name: code, category: "Unknown", color: "bg-gray-50 text-gray-700 border-gray-200" }
  }

  const handleSearch = () => {
    setHasSearched(true)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSelectedFilters([])
    setSearchQuery("")
    setCurrentPage(1)
  }

  if (step === "directory") {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center py-24">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose a Directory</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Select the type of services you are looking for to begin your search
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto w-full px-8">
          <button
            type="button"
            onClick={() => {
              setDirectory("mental")
              setStep("search")
            }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-12 text-left hover:border-primary hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300">
              <Brain className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
              National Directory of Mental Health Services
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Find mental health treatment facilities, psychiatric hospitals, community mental health centers, and
              counseling services.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setDirectory("substance")
              setStep("search")
            }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-12 text-left hover:border-primary hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
              <Pill className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
              National Directory of Substance Abuse and Alcohol Treatment
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Find substance use treatment programs, detoxification services, opioid treatment programs, and recovery
              support services.
            </p>
          </button>
        </div>
      </div>
    )
  }

  const categoryEntries = Object.entries(categoriesForDisplay)
  const visibleCategories = showAllFilters ? categoryEntries : categoryEntries.slice(0, 4)

  // Filter results based on search query and selected filters
  const filteredResults = mockResults.filter((result) => {
    const matchesSearchQuery =
      result.name1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.state.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilters =
      selectedFilters.length === 0 || selectedFilters.every((filterCode) => result.services.includes(filterCode))

    return matchesSearchQuery && matchesFilters
  })

  const totalResults = filteredResults.length
  const totalPages = Math.ceil(totalResults / resultsPerPage)
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = startIndex + resultsPerPage
  const paginatedResults = filteredResults.slice(startIndex, endIndex)

  return (
    <div className="max-w-6xl mx-auto px-8 lg:px-12">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => {
          setStep("directory")
          setDirectory(null)
          setSelectedFilters([])
          setHasSearched(false)
          setCurrentPage(1)
        }}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Directory Selection</span>
      </button>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {directory === "mental"
            ? "National Directory of Mental Health Services"
            : "National Directory of Substance Abuse and Alcohol Treatment"}
        </h1>
        <p className="text-gray-600 text-lg">Search verified treatment facilities in your area</p>
      </div>

      {/* Search Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-10 mb-12 shadow-sm">
        {/* Basic Filters Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-3">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
            >
              <option value="AZ">Arizona</option>
              <option value="CA">California</option>
              <option value="NV">Nevada</option>
              <option value="NM">New Mexico</option>
              <option value="TX">Texas</option>
            </select>
          </div>
          <div className="lg:col-span-9">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Name or City</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by facility name or city..."
                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="border-t border-gray-100 pt-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-gray-900">Filter by Category & Services</span>
            </div>
            {categoryEntries.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllFilters(!showAllFilters)}
                className="text-sm text-primary font-medium hover:underline"
              >
                {showAllFilters ? "Show less" : `Show all ${categoryEntries.length} categories`}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleCategories.map(([categoryName, services]) => (
              <div key={categoryName}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {categoryName}
                </label>
                <MultiSelectDropdown
                  label={categoryName}
                  options={services}
                  selected={selectedFilters}
                  onToggle={toggleFilter}
                  categoryColor={CATEGORY_COLORS[categoryName] || "bg-gray-50 text-gray-700 border-gray-200"}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Selected Filters */}
        {selectedFilters.length > 0 && (
          <div className="border-t border-gray-100 pt-8 mt-10">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Active Filters</p>
            <div className="flex flex-wrap gap-3">
              {selectedFilters.map((code) => {
                const info = getServiceInfo(code)
                return (
                  <span
                    key={code}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border ${info.color}`}
                  >
                    <span className="font-semibold">{info.name}</span>
                    <span className="opacity-60">·</span>
                    <span className="opacity-70 text-xs">{info.category}</span>
                    <button
                      type="button"
                      onClick={() => removeFilter(code)}
                      className="ml-1 hover:opacity-70 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-8 mt-10 flex items-center justify-between">
          <p className="text-sm text-gray-500">Data sourced from SAMHSA Treatment Locator</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              Reset filters
            </button>
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="mb-16">
          <p className="text-gray-600 mb-10 text-lg">
            Found <span className="font-bold text-gray-900">{totalResults}</span> results
            {totalResults > resultsPerPage && (
              <span className="text-gray-500">
                {" "}
                (showing {startIndex + 1}-{Math.min(endIndex, totalResults)})
              </span>
            )}
          </p>
          <div className="flex flex-col gap-6">
            {paginatedResults.map((result) => (
              <ResultCard key={result.id} result={result} getServiceInfo={getServiceInfo} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasSearched && (
        <div className="text-center py-24">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-8">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to search</h3>
          <p className="text-gray-600 max-w-lg mx-auto text-lg">
            Use the filters above to find treatment facilities that match your criteria, then click Search to view
            results.
          </p>
        </div>
      )}
    </div>
  )
}
