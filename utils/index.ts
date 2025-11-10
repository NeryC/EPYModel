import axios from "axios";
import { linesDescriptions } from "./descriptions";
import { baseURL } from "./constants";

interface LineItem {
  label: string;
  name: string;
  color?: string;
  hiddable?: boolean;
  default?: boolean;
  style?: "line" | "dashed" | "dot";
  description?: string;
}

export const dinamicColorStyle = (type: string, atribute: string, name: string): Record<string, string> =>
  findLine(type, name).color ? { [atribute]: findLine(type, name).color } : {};

export const hiddableLines = (type: string, value: boolean = true): LineItem[] =>
  linesDescriptions(type as any).filter((line: LineItem) =>
    value ? line.hiddable : !line.hiddable
  );

export const defaultVisibleLines = (type: string): LineItem[] =>
  linesDescriptions(type as any).filter((line: LineItem) => line.hiddable && line.default);

export const filterLines = (type: string, names: string[]): LineItem[] =>
  linesDescriptions(type as any).filter((line: LineItem) => names.includes(line.name));

const findLine = (type: string, name: string): LineItem =>
  linesDescriptions(type as any).find((line: LineItem) => line.name === name);

export const checkLine = (lines: LineItem[], name: string): boolean =>
  lines.some((elem: LineItem) => elem.name === name);

export const setNewSelectedLines = (selectedLines: LineItem[], item: LineItem): LineItem[] => {
  if (selectedLines.some((element: LineItem) => element.label === item.label)) {
    return selectedLines.filter((e: LineItem) => e.label !== item.label);
  } else {
    selectedLines.push(item);
    return [...selectedLines];
  }
};

// Legacy axios instance for backward compatibility
// Note: Consider migrating to the new ApiService for better error handling
export const axiosInstance = axios.create({
  baseURL: baseURL,
});
