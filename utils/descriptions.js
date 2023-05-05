export const graphDescriptions = {
  ICU: true,
  deceases: true,
};

export const simulationDescriptions = {
  uci: true,
  susceptible: true,
  cumulative: true,
  cumulative_deaths: true,
  exposed: true,
  immune: true,
  infectious: true,
  hospitalized: true,
};

export const dotFields = {
  reported: "Reportados",
  hospitalized: "Hospitalizados",
  ICU: "UTI",
  deceases: "Fallecidos",
};

export const linesDescriptions = (type) => {
  switch (type) {
    case "reported":
      return linesDescriptionReported;
    case "hospitalized":
      return linesDescriptionHospitalized;
    case "ICU":
      return linesDescriptionICU;
    case "deceases":
      return linesDescriptionDeceases;

    default:
      return [];
  }
};
const linesDescriptionReported = [
  {
    name: "dailyR_sin_subRegistro",
    label: "simulated",
    color: "#564CFA",
    default: false,
    hiddable: false,
    style: "line",
  },
  {
    name: "dailyR",
    label: "estimated",
    color: "#00ccff",
    default: false,
    hiddable: true,
    style: "line",
  },
  {
    name: "proy",
    label: "proyected",
    color: "#564CFA",
    default: false,
    hiddable: false,
    style: "dashed",
  },
  {
    name: "q75",
    label: "percentile75",
    color: "#ff0000",
    default: true,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "q25",
    label: "percentile25",
    color: "#FD9100",
    default: true,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X10p",
    label: "10increase",
    color: "#97008f",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X20p",
    label: "20reduction",
    color: "#009719",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "eq",
    label: "plateau",
    color: "#039bb6",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X2w",
    label: "lastMonth",
    color: "#c50000",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "Reportados",
    label: "reported",
    color: "#FFFFFF",
    default: false,
    hiddable: false,
    style: "dot",
  },
];

const linesDescriptionHospitalized = [
  {
    name: "H",
    label: "simulated",
    color: "#564CFA",
    default: false,
    hiddable: false,
    style: "line",
  },
  {
    name: "proy",
    label: "proyected",
    color: "#564CFA",
    default: false,
    hiddable: false,
    style: "dashed",
  },
  {
    name: "q75",
    label: "percentile75",
    color: "#ff0000",
    default: true,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "q25",
    label: "percentile25",
    color: "#FD9100",
    default: true,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X10p",
    label: "10increase",
    color: "#97008f",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X20p",
    label: "20reduction",
    color: "#009719",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "eq",
    label: "plateau",
    color: "#039bb6",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X2w",
    label: "lastMonth",
    color: "#c50000",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "Hospitalizados",
    label: "hospitalized",
    color: "#FFFFFF",
    default: false,
    hiddable: false,
    style: "dot",
  },
];

const linesDescriptionICU = [
  {
    name: "U",
    label: "simulated",
    color: "#564CFA",
    default: false,
    hiddable: false,
    style: "line",
  },
  {
    name: "proy",
    label: "proyected",
    color: "#564CFA",
    default: false,
    hiddable: false,
    style: "dashed",
  },
  {
    name: "q75",
    label: "percentile75",
    color: "#ff0000",
    default: true,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "q25",
    label: "percentile25",
    color: "#FD9100",
    default: true,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X10p",
    label: "10increase",
    color: "#97008f",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X20p",
    label: "20reduction",
    color: "#009719",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "eq",
    label: "plateau",
    color: "#039bb6",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X2w",
    label: "lastMonth",
    color: "#c50000",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "UTI",
    label: "UTI",
    color: "#FFFFFF",
    default: false,
    hiddable: false,
    style: "dot",
  },
];
const linesDescriptionDeceases = [
  {
    name: "dailyF",
    label: "simulated",
    color: "#564CFA",
    default: false,
    hiddable: false,
    style: "line",
  },
  {
    name: "proy",
    label: "proyected",
    color: "#564CFA",
    default: false,
    hiddable: false,
    style: "dashed",
  },
  {
    name: "q75",
    label: "percentile75",
    color: "#ff0000",
    default: true,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "q25",
    label: "percentile25",
    color: "#FD9100",
    default: true,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X10p",
    label: "10increase",
    color: "#97008f",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X20p",
    label: "20reduction",
    color: "#009719",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "eq",
    label: "plateau",
    color: "#039bb6",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "X2w",
    label: "lastMonth",
    color: "#c50000",
    default: false,
    hiddable: true,
    style: "dashed",
  },
  {
    name: "Fallecidos",
    label: "deceases",
    color: "#FFFFFF",
    default: false,
    hiddable: false,
    style: "dot",
  },
];
