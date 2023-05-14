import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import * as d3 from "d3";
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import { MAIN_GRAPH, baseURL, getDownloadPath } from "../../utils/constants.js";

export const DownloadButton = ({ page, type, data }) => {
  const { t } = useTranslation("common");

  const [showDropdown, setShowDropdown] = useState(false);

  let timeoutControler;

  const openMenu = () => {
    setShowDropdown(!showDropdown);
  };

  const downloadGraph = () => {
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(
      d3.select(`#${type}`).node()
    );
    const baseImage = "data:image/svg+xml;base64,";
    const imgData = baseImage + Buffer.from(xmlString).toString("base64");
    saveAs(imgData, `${type}.svg`);
  };

  const DonwloadOption = ({ text }) => {
    if (text === "svg")
      return (
        <li className="dropdown-item hover:bg-blue-100 px-5 md:px-4 py-3 md:py-1">
          <span className="block cursor-pointer" onClick={downloadGraph}>
            {text}
          </span>
        </li>
      );
    if (text === "csv") {
      if (page == MAIN_GRAPH) {
        return (
          <li className="dropdown-item hover:bg-blue-100 px-5 md:px-4 py-3 md:py-1">
            <a
              className="block cursor-pointer"
              href={`${baseURL}${getDownloadPath[type]}`}
              download="renamed"
            >
              {text}
            </a>
          </li>
        );
      } else {
        const headers = [
          { label: "day", key: "day" },
          { label: type, key: "value" },
        ];
        return (
          <CSVLink
            headers={headers}
            data={data}
            filename={`${type}.csv`}
            className="block dropdown-item hover:bg-blue-100 px-4 py-1"
            target="_blank"
          >
            {text}
          </CSVLink>
        );
      }
    }
  };

  const handleMouseLeave = () => {
    timeoutControler = setTimeout(() => {
      setShowDropdown(false);
    }, 1000);
  };
  const handleMouseEnter = () => {
    timeoutControler && clearTimeout(timeoutControler);
  };

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
          <DonwloadOption text={"svg"} />
          <DonwloadOption text={"csv"} />
        </ul>
      </div>
    </div>
  );
};
