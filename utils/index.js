import axios from "axios";
import { linesDescriptions } from "./descriptions";
import { baseURL } from "./constants.js";

export const dinamicColorStyle = (type, atribute, name) =>
  findLine(type, name).color ? { [atribute]: findLine(type, name).color } : {};

export const hiddableLines = (type, value = true) =>
  linesDescriptions(type).filter((line) =>
    value ? line.hiddable : !line.hiddable
  );

export const defaultVisibleLines = (type) =>
  linesDescriptions(type).filter((line) => line.hiddable && line.default);

export const filterLines = (type, names) =>
  linesDescriptions(type).filter((line) => names.includes(line.name));

const findLine = (type, name) =>
  linesDescriptions(type).find((line) => line.name === name);

export const checkLine = (lines, name) =>
  lines.some((elem) => elem.name === name);

export const setNewSelectedLines = (selectedLines, item) => {
  if (selectedLines.some((element) => element.label === item.label)) {
    return selectedLines.filter((e) => e.label !== item.label);
  } else {
    selectedLines.push(item);
    return [...selectedLines];
  }
};

export const axiosInstance = axios.create({
  baseURL: baseURL,
});
