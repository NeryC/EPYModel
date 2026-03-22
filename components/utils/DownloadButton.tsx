import * as d3 from "d3";
import Image from "next/image";
import { memo, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { DataPoint } from "../../store/reducers/graphInfoSlice";
import { selectRawData } from "../../store/reducers/graphInfoSlice";
import { saveAs } from "file-saver";
import { useTranslation } from "next-i18next";
import {
  MainSubtitleType,
  SimulationSubtitleType,
} from "../../utils/descriptions";

// Dynamic import for client-side only component
const CSVDownloadButton = dynamic(
  () => import("./CSVDownloadButton"),
  { ssr: false }
);

interface DownloadButtonProps {
  page: "main" | "simulation";
  type: MainSubtitleType | SimulationSubtitleType;
  data?: DataPoint[];
}

interface DownloadOptionProps {
  text: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}


function DownloadButtonComponent({ page, type, data }: DownloadButtonProps) {
  const { t } = useTranslation("common");
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get data from Redux store for main page projections
  const projectionData = useSelector(
    selectRawData(type as 'reported' | 'hospitalized' | 'ICU' | 'deceases')
  );

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDropdown(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const DownloadOption = useCallback(
    ({ text, onClick }: DownloadOptionProps) => (
      <li role="none">
        <button
          type="button"
          role="menuitem"
          className="block w-full text-left px-5 md:px-4 py-3 md:py-2 hover:bg-blue-100"
          onClick={onClick}
        >
          {text}
        </button>
      </li>
    ),
    []
  );

  /**
   * Generate and download CSV from projection data
   * Uses data from Redux store to generate CSV client-side
   */
  const handleDownloadCSV = useCallback(() => {
    if (page === "main") {
      try {
        // Validate that type is a valid projection type
        const validProjectionTypes = ['reported', 'hospitalized', 'ICU', 'deceases'] as const;
        if (!validProjectionTypes.includes(type as typeof validProjectionTypes[number])) {
          console.error(`Invalid projection type: ${type}`);
          return;
        }

        // Get data from Redux store
        const dataToExport = projectionData || [];
        
        if (dataToExport.length === 0) {
          console.error('No data available to export');
          return;
        }

        // Generate CSV content
        // Get all unique keys from data points for headers
        const allKeys = new Set<string>();
        dataToExport.forEach((point) => {
          Object.keys(point).forEach((key) => allKeys.add(key));
        });
        
        const headers = Array.from(allKeys);
        const csvRows = [
          headers.join(','),
          ...dataToExport.map((point) =>
            headers.map((header) => {
              const value = point[header];
              // Handle values that might contain commas or quotes
              if (value === null || value === undefined) return '';
              const stringValue = String(value);
              // Escape quotes and wrap in quotes if contains comma or quote
              if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
              }
              return stringValue;
            }).join(',')
          ),
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${type}.csv`);
      } catch (error) {
        console.error('Failed to download CSV:', error);
        // You could add a toast notification here for user feedback
      }
    }
  }, [page, type, projectionData]);

  const DownloadCSVOption = useCallback(() => {
    if (page === "main") {
      return (
        <DownloadOption
          text="csv"
          onClick={handleDownloadCSV}
        />
      );
    } else if (data) {
      return <CSVDownloadButton type={type} data={data} />;
    }
    return null;
  }, [page, type, data, DownloadOption, handleDownloadCSV]);

  return (
    <div
      className="flex justify-center text-base font-medium items-center"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className="dropdown relative text-deep-blue w-16 md:w-auto">
        <button
          onClick={openMenu}
          aria-label={t("download-graph")}
          aria-expanded={showDropdown}
          aria-haspopup="menu"
          className={`
            flex
            items-center
            ${showDropdown ? "bg-gray-200" : "bg-transparent"}
            font-semibold
            py-3
            md:py-2
            min-h-[44px]
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
              alt=""
              aria-hidden="true"
            />
          </div>
          <span className="font-bold hidden md:block">
            {t("download-graph")}
          </span>
        </button>
        <ul
          role="menu"
          aria-label={t("download-graph")}
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
