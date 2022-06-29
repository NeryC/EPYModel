export const linesDescription = [
  {
    name: "dailyR_sin_subRegistro",
    label: "Simulated",
    description: "",
    color: "#1900ff",
    default: false,
    hiddable: false,
    type: "line",
  },
  {
    name: "dailyR",
    label: "Estimated",
    description:
      "This curve shows the daily estimated infections after correcting for bias due to the testing rate.",
    color: "#00ccff",
    default: false,
    hiddable: true,
    type: "line",
  },
  {
    name: "proy",
    label: "Proyected",
    description: "Projection using the last value of the transmissibility.",
    color: "#1900ff",
    default: false,
    hiddable: false,
    type: "dashed",
  },
  {
    name: "q75",
    label: "Percentil 75",
    description:
      "Scenario using the historical representative high contagion rate in Paraguay.",
    color: "#ff0000",
    default: true,
    hiddable: true,
    type: "dashed",
  },
  {
    name: "q25",
    label: "Percentil 25",
    description:
      "Scenario using the representative low contagion rate history in Paraguay.",
    color: "#009719",
    default: true,
    hiddable: true,
    type: "dashed",
  },
  {
    name: "X10p",
    label: "10% Increase",
    description:
      "Scenario assuming that the measures are relaxed by 10% with respect to the last month.",
    color: "#97008f",
    default: false,
    hiddable: true,
    type: "dashed",
  },
  {
    name: "X20p",
    label: "20% Reduction",
    description:
      "Scenario assuming that the measures are tightened by 20% with respect to the last month.",
    color: "#e134f8",
    default: false,
    hiddable: true,
    type: "dashed",
  },
  {
    name: "eq",
    label: "Plateau",
    description: "Scenario for the plateau (Replay number equal to unity).",
    color: "#039bb6",
    default: false,
    hiddable: true,
    type: "dashed",
  },
  {
    name: "X2w",
    label: "Last Month",
    description:
      "Scenario using the average transmissibility of the last month.",
    color: "#c50000",
    default: false,
    hiddable: true,
    type: "dashed",
  },
  {
    name: "Reportados",
    label: "Reported",
    description: "Daily reported according to data provided by the MSPyBS.",
    color: "",
    default: false,
    hiddable: false,
    type: "dot",
  },
];

export const dinamicColorStyle = (atribute, name) => {
  return findLine(name).color ? { [atribute]: findLine(name).color } : {};
};

export const hiddableLines = (value = true) => {
  return linesDescription.filter((line) => {
    return value ? line.hiddable : !line.hiddable;
  });
};

export const defaultVisibleLines = () => {
  return linesDescription.filter((line) => {
    return line.hiddable && line.default;
  });
};

export const filterLines = (names) => {
  return linesDescription.filter((line) => {
    return names.includes(line.name);
  });
};

const findLine = (name) => {
  return linesDescription.find((line) => {
    return line.name === name;
  });
};

export const checkLine = (lines, name) => {
  return lines.some((elem) => {
    return elem.name === name;
  });
};
