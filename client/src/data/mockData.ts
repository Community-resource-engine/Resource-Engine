export interface Resource {
  id: number;
  name1: string;
  name2: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website?: string;
  service_code_info: string[];
  intake1?: string;
  intake2?: string;
}

export const resources: Resource[] = [
  {
    id: 1,
    name1: 'SpectraCare Health Systems',
    name2: 'Henry County Clinic',
    street1: '219 Dothan Road',
    street2: '',
    city: 'Abbeville',
    state: 'AL',
    zip: "36310",
    phone: '800-951-4357',
    service_code_info: ['SA', 'MH', 'SUMH', 'OP', 'CMHC', 'TELE', 'CBT', 'CFT', 'GT', 'IDD', 'IPT'],
  },
  {
    id: 392,
    name1: 'Arizona Addiction Center',
    name2: '',
    street1: '- - -',
    street2: '',
    city: 'Scottsdale',
    state: 'AZ',
    zip: "85266",
    phone: '480-579-3319',
    service_code_info: ['SA', 'MH', 'SUMH', 'RES', 'RTCA', 'AT', 'CBT', 'CFT', 'DBT', 'GT', 'IDD', 'IPT', 'TELE'],
  },
  {
    id: 778,
    name1: 'Oasis Community Services',
    name2: '',
    street1: '81557 Dr Carreon Boulevard',
    street2: 'Suite C-9',
    city: 'Indio',
    state: 'CA',
    zip: "92201",
    phone: '760-391-6999',
    service_code_info: ['MH', 'SUMH', 'OP', 'OMH', 'CBT', 'CFT', 'DBT', 'GT', 'IDD', 'IPT', 'TELE'],
  },
  {
    id: 1195,
    name1: 'Ventura County Behavioral Health Dept',
    name2: 'Simi Valley Adult Clinic',
    street1: '1227 East Los Angeles Avenue',
    street2: '',
    city: 'Simi Valley',
    state: 'CA',
    zip: "93065",
    phone: '805-582-4075',
    service_code_info: ['SA', 'MH', 'SUMH', 'OP', 'OMH', 'AT', 'CBT', 'DBT', 'GT', 'IDD', 'IPT', 'TELE'],
  },
  {
    id: 1569,
    name1: 'Delaware Psychiatric Center',
    name2: '',
    street1: '- - -',
    street2: '',
    city: 'New Castle',
    state: 'DE',
    zip: "19720",
    phone: '302-255-2700',
    service_code_info: ['MH', 'SUMH', 'HI', 'PSY', 'AT', 'CBT', 'DBT', 'GT', 'IDD', 'IPT'],
  },
  {
    id: 1955,
    name1: 'Avita Community Partners',
    name2: 'Dahlonega MH/SA Clinic',
    street1: '150 Johnson Street',
    street2: 'Suite A',
    city: 'Dahlonega',
    state: 'GA',
    zip: "30533",
    phone: '706-864-6822',
    service_code_info: ['SA', 'MH', 'SUMH', 'OP', 'OMH', 'CBT', 'CFT', 'DBT', 'GT', 'IDD', 'IPT', 'TELE'],
  },
  {
    id: 2332,
    name1: 'ComWell',
    name2: 'Red Bud Office',
    street1: '10257 State Route 3',
    street2: '',
    city: 'Red Bud',
    state: 'IL',
    zip: "62278",
    phone: '618-282-6233',
    service_code_info: ['SA', 'MH', 'SUMH', 'OP', 'CBHC', 'CBT', 'CFT', 'DBT', 'GT', 'IDD', 'IPT', 'TELE'],
  },
  {
    id: 2694,
    name1: 'Eyerly Ball CMHS',
    name2: 'Indianola Office',
    street1: '1007 South Jefferson Way',
    street2: '',
    city: 'Indianola',
    state: 'IA',
    zip: "50125",
    phone: '515-241-0982',
    service_code_info: ['MH', 'OP', 'CMHC', 'AT', 'CBT', 'CRT', 'CFT', 'DBT', 'EMDR', 'GT', 'IPT', 'TELE'],
  },
  {
    id: 3051,
    name1: 'Imperial Calcasieu Human Services',
    name2: 'Authority Jefferson Davis',
    street1: '437 North Market Street',
    street2: '',
    city: 'Jennings',
    state: 'LA',
    zip: "70546",
    phone: '337-246-7325',
    service_code_info: ['SA', 'MH', 'SUMH', 'OP', 'OMH', 'CBT', 'IDD', 'IPT', 'TELE'],
  },
  {
    id: 3453,
    name1: 'Walden Behavioral Care LLC',
    name2: 'Inpatient',
    street1: '10 Carematrix Drive',
    street2: '',
    city: 'Dedham',
    state: 'MA',
    zip: "2026",
    phone: '781-647-6585',
    service_code_info: ['MH', 'SUMH', 'HI', 'RES', 'PSY', 'AT', 'CBT', 'CFT', 'DBT', 'GT', 'IDD', 'IPT', 'TELE'],
  },
  {
    id: 3839,
    name1: 'Northern Pines Mental Health Center',
    name2: 'Aitkin Outpatient Office',
    street1: '13 3rd Street NE',
    street2: '',
    city: 'Aitkin',
    state: 'MN',
    zip: "56431",
    phone: '320-639-2025',
    service_code_info: ['SA', 'MH', 'SUMH', 'OP', 'CBHC', 'CBT', 'CFT', 'DBT', 'EMDR', 'GT', 'IDD', 'IPT', 'TELE'],
  }
];

export const SERVICE_LABELS: Record<string, string> = {
  SA: "Substance Abuse",
  MH: "Mental Health",
  SUMH: "Substance Use & Mental Health",
  OP: "Outpatient",
  CMHC: "Community Mental Health Center",
  TELE: "Telemedicine",
  CBT: "Cognitive Behavioral Therapy",
  CFT: "Couples/Family Therapy",
  GT: "Group Therapy",
  IDD: "Integrated Dual Disorder",
  IPT: "Interpersonal Therapy",
  RES: "Residential",
  RTCA: "Residential Treatment Center (Adults)",
  DBT: "Dialectical Behavior Therapy",
  OMH: "Outpatient Mental Health",
  HI: "Hospital Inpatient",
  PSY: "Psychiatric",
  CBHC: "Community Behavioral Health Center",
  AT: "Activity Therapy",
  CRT: "Cognitive Remediation Therapy",
  EMDR: "Eye Movement Desensitization and Reprocessing"
};
