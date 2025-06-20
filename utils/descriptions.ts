interface LineDescription {
  name: string;
  label: string;
  color: string;
  default: boolean;
  hiddable: boolean;
  style: "line" | "dashed" | "dot";
}

interface DescriptionsConfig {
  main: {
    reported: boolean;
    hospitalized: boolean;
    ICU: boolean;
    deceases: boolean;
  };
  simulation: {
    uci: boolean;
    susceptible: boolean;
    cumulative: boolean;
    cumulative_deaths: boolean;
    exposed: boolean;
    immune: boolean;
    infectious: boolean;
    hospitalized: boolean;
  };
}

interface DotFields {
  reported: string;
  hospitalized: string;
  ICU: string;
  deceases: string;
}

export const descriptions: DescriptionsConfig = {
  main: { reported: true, hospitalized: true, ICU: true, deceases: true },
  simulation: {
    uci: true,
    susceptible: true,
    cumulative: true,
    cumulative_deaths: true,
    exposed: true,
    immune: true,
    infectious: true,
    hospitalized: true,
  },
};

export const dotFields: DotFields = {
  reported: "Reportados",
  hospitalized: "Hospitalizados",
  ICU: "UTI",
  deceases: "Fallecidos",
};

export const linesDescriptions = (type: keyof DotFields): LineDescription[] => {
  const descriptionMap: Record<keyof DotFields, LineDescription[]> = {
    reported: linesDescriptionReported,
    hospitalized: linesDescriptionHospitalized,
    ICU: linesDescriptionICU,
    deceases: linesDescriptionDeceases,
  };

  return descriptionMap[type] || [];
};

const linesDescriptionReported: LineDescription[] = [
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

const linesDescriptionHospitalized: LineDescription[] = [
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

const linesDescriptionICU: LineDescription[] = [
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

const linesDescriptionDeceases: LineDescription[] = [
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
