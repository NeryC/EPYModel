import axios from 'axios';
import { linesDescriptions } from './descriptions';

export const dateField = 'fechaFormateada';

export const dinamicColorStyle = (type, atribute, name) => {
  return findLine(type, name).color ? { [atribute]: findLine(type, name).color } : {};
};

export const hiddableLines = (type, value = true) => {
  return linesDescriptions(type).filter((line) => {
    return value ? line.hiddable : !line.hiddable;
  });
};

export const defaultVisibleLines = (type) => {
  return linesDescriptions(type).filter((line) => {
    return line.hiddable && line.default;
  });
};

export const filterLines = (type, names) => {
  return linesDescriptions(type).filter((line) => {
    return names.includes(line.name);
  });
};

const findLine = (type, name) => {
  return linesDescriptions(type).find((line) => {
    return line.name === name;
  });
};

export const checkLine = (lines, name) => {
  return lines.some((elem) => {
    return elem.name === name;
  });
};

export const setNewSelectedLines = (selectedLines, item) => {
  if (selectedLines.some((element) => element.label === item.label)) {
    return [...selectedLines.filter((e) => e.label !== item.label)];
  } else {
    selectedLines.push(item);
    return [...selectedLines];
  }
};

export const axiosInstance = axios.create({
  baseURL: 'http://epymodel.uaa.edu.py/api'
});
