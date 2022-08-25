export const graphDescriptions = {
  reported: {
    title: 'Projection of possible new Infected/Daily reported',
    description: ''
  },
  hospitalized: {
    title: 'Daily death projection',
    description: ''
  },
  ICU: {
    title: 'EFFECTIVE REPRODUCTION NUMBER',
    description: `The graph shows the evolution of the proportions of positive cases that pass to be hospitalized, intensive care unit and deceased cases`
  },
  deceases: {
    title: 'PROPORTIONS',
    description: `The effective reproduction number, R, represents the number of new cases that is generated from a positive case, according to cases reported by the Ministry of Public Health and Social Welfare of Paraguay.
    When R = 1, each positive case infects only one more person and in this case the epidemic remains stable, observing a plateau in the number of cases.
    When R is greater than 1, each positive case infects more than one person and in this case the epidemic is expanding and increases positive cases.
    When R is less than 1, each positive case infects (on average) less than one person, and in this case the epidemic is in contraction and decreases positive cases.`
  }
};

export const linesDescriptions = (type) => {
  switch (type) {
    case 'reported':
      return linesDescriptionReported;
    case 'hospitalized':
      return linesDescriptionHospitalized;

    default:
      return [];
  }
};
const linesDescriptionReported = [
  {
    name: 'dailyR_sin_subRegistro',
    label: 'Simulated',
    description: '',
    color: '#1900ff',
    default: false,
    hiddable: false,
    style: 'line'
  },
  {
    name: 'dailyR',
    label: 'Estimated',
    description:
      'This curve shows the daily estimated infections after correcting for bias due to the testing rate.',
    color: '#00ccff',
    default: false,
    hiddable: true,
    style: 'line'
  },
  {
    name: 'proy',
    label: 'Proyected',
    description: 'Projection using the last value of the transmissibility.',
    color: '#1900ff',
    default: false,
    hiddable: false,
    style: 'dashed'
  },
  {
    name: 'q75',
    label: 'Percentil 75',
    description:
      'Scenario using the historical representative high contagion rate in Paraguay.',
    color: '#ff0000',
    default: true,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'q25',
    label: 'Percentil 25',
    description:
      'Scenario using the representative low contagion rate history in Paraguay.',
    color: '#009719',
    default: true,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'X10p',
    label: '10% Increase',
    description:
      'Scenario assuming that the measures are relaxed by 10% with respect to the last month.',
    color: '#97008f',
    default: false,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'X20p',
    label: '20% Reduction',
    description:
      'Scenario assuming that the measures are tightened by 20% with respect to the last month.',
    color: '#e134f8',
    default: false,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'eq',
    label: 'Plateau',
    description: 'Scenario for the plateau (Replay number equal to unity).',
    color: '#039bb6',
    default: false,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'X2w',
    label: 'Last Month',
    description:
      'Scenario using the average transmissibility of the last month.',
    color: '#c50000',
    default: false,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'Reportados',
    label: 'Reported',
    description:
      'Reported number of daily infected according to data provided by the MSPyBS.',
    color: '#000000',
    default: false,
    hiddable: false,
    style: 'dot'
  }
];

const linesDescriptionHospitalized = [
  {
    name: 'dailyR_sin_subRegistro',
    label: 'Simulated',
    description: '',
    color: '#1900ff',
    default: false,
    hiddable: false,
    style: 'line'
  },
  {
    name: 'dailyR',
    label: 'Estimated',
    description:
      'This curve shows the daily estimated infections after correcting for bias due to the testing rate.',
    color: '#00ccff',
    default: false,
    hiddable: true,
    style: 'line'
  },
  {
    name: 'proy',
    label: 'Proyected',
    description: 'Projection using the last value of the transmissibility.',
    color: '#1900ff',
    default: false,
    hiddable: false,
    style: 'dashed'
  },
  {
    name: 'q75',
    label: 'Percentil 75',
    description:
      'Scenario using the historical representative high contagion rate in Paraguay.',
    color: '#ff0000',
    default: true,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'q25',
    label: 'Percentil 25',
    description:
      'Scenario using the representative low contagion rate history in Paraguay.',
    color: '#009719',
    default: true,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'X10p',
    label: '10% Increase',
    description:
      'Scenario assuming that the measures are relaxed by 10% with respect to the last month.',
    color: '#97008f',
    default: false,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'X20p',
    label: '20% Reduction',
    description:
      'Scenario assuming that the measures are tightened by 20% with respect to the last month.',
    color: '#e134f8',
    default: false,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'eq',
    label: 'Plateau',
    description: 'Scenario for the plateau (Replay number equal to unity).',
    color: '#039bb6',
    default: false,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'X2w',
    label: 'Last Month',
    description:
      'Scenario using the average transmissibility of the last month.',
    color: '#c50000',
    default: false,
    hiddable: true,
    style: 'dashed'
  },
  {
    name: 'Reportados',
    label: 'Reported',
    description:
      'Reported number of daily hospitalized according to data provided by the MSPyBS.',
    color: '#000000',
    default: false,
    hiddable: false,
    style: 'dot'
  }
];
