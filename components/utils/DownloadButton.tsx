import * as d3 from "d3";
import Image from "next/image";
import React, { memo, MouseEvent, useCallback, useRef, useState } from "react";
import { baseURL } from "../../utils/constants";
import { CSVLink } from "react-csv";
import { DataPoint } from "../../store/reducers/graphInfoSlice";
import { saveAs } from "file-saver";
import { useTranslation } from "next-i18next";
import {
  MainSubtitleType,
  SimulationSubtitleType,
} from "../../utils/descriptions";

const getDownloadPath = {
  reported: "/get-projection-r",
  hospitalized: "/get-projection-h",
  ICU: "/get-projection-u",
  deceases: "/get-projection-f",
};

interface DownloadButtonProps {
  page: "main" | "simulation";
  type: MainSubtitleType | SimulationSubtitleType;
  data?: DataPoint[];
}

interface DownloadOptionProps {
  text: string;
  onClick: (e: MouseEvent<HTMLSpanElement>) => void;
}

const csvHeaders = (type: string) => [
  { label: "day", key: "day" },
  { label: type, key: "value" },
];

function DownloadButtonComponent({ page, type, data }: DownloadButtonProps) {
  const { t } = useTranslation("common");
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  const downloadGraph = useCallback(() => {
    const serializer = new XMLSerializer();
    const node = d3.select(`#${type}`).node();
    if (!node) return;
    const xmlString = serializer.serializeToString(node as Node);
    const baseImage = "data:image/svg+xml;base64,";
    const imgData = baseImage + Buffer.from(xmlString).toString("base64");
    saveAs(imgData, `${type}.svg`);
  }, [type]);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 1000);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const DownloadOption = useCallback(
    ({ text, onClick }: DownloadOptionProps) => (
      <li className="dropdown-item hover:bg-blue-100 px-5 md:px-4 py-3 md:py-1">
        <span className="block cursor-pointer" onClick={onClick}>
          {text}
        </span>
      </li>
    ),
    []
  );

  const DownloadCSVOption = useCallback(() => {
    if (page === "main") {
      return (
        <DownloadOption
          text="csv"
          onClick={() => {
            const link = document.createElement("a");
            link.href = `${baseURL}${getDownloadPath[type]}`;
            link.download = "renamed";
            link.click();
          }}
        />
      );
    } else if (data) {
      return (
        <CSVLink
          headers={csvHeaders(type)}
          data={data}
          filename={`${type}.csv`}
          className="block dropdown-item hover:bg-blue-100 px-4 py-1"
          target="_blank"
        >
          csv
        </CSVLink>
      );
    }
    return null;
  }, [page, type, data, DownloadOption]);

  return (
    <div
      className="flex justify-center text-base font-medium items-center"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className="dropdown relative text-deep-blue w-16 md:w-auto">
        <button
          onClick={openMenu}
          className={`
            flex 
            items-center 
            ${showDropdown ? "bg-gray-200" : "bg-transparent"} 
            font-semibold 
            py-3
            md:py-1
            px-3 
            border 
            border-gray-theme 
            rounded-3xl
          `}
        >
          <div className="md:mr-2 flex w-max">
            <Image
              src="/assets/icons/download.svg"
              height={20}
              width={20}
              alt="Download Icon"
            />
          </div>
          <span className="font-bold hidden md:block">
            {t("download-graph")}
          </span>
        </button>
        <ul
          className={`
            w-full
            dropdown-menu
            absolute
            bg-white
            z-50
            py-2
            list-none
            rounded-lg
            shadow-complete-box
            ${!showDropdown && "hidden"}
            my-2
            bg-clip-padding
            border-none
          `}
        >
          <DownloadOption text="svg" onClick={() => downloadGraph()} />
          <DownloadCSVOption />
        </ul>
      </div>
    </div>
  );
}

export const DownloadButton = memo(DownloadButtonComponent);
