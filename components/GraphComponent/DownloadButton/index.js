import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import * as d3 from "d3";
import { saveAs } from "file-saver";
import { baseURL, getDownloadPath } from "../../../utils/constants.js";

export const DownloadButton = ({ type }) => {
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
        <li className="dropdown-item hover:bg-blue-100 px-4 py-1">
          <span className="block cursor-pointer" onClick={downloadGraph}>
            {text}
          </span>
        </li>
      );
    if (text === "csv")
      return (
        <li className="dropdown-item hover:bg-blue-100 px-4 py-1">
          <a
            className="block cursor-pointer"
            href={`${baseURL}${getDownloadPath[type]}`}
            download="renamed"
          >
            {text}
          </a>
        </li>
      );
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
      className="flex justify-center text-base font-medium"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className="dropdown relative text-deep-blue">
        <button
          onClick={openMenu}
          className={`
            flex 
            items-center 
            ${showDropdown ? "bg-gray-200" : "bg-transparent"} 
            font-semibold 
            py-1
            px-3 
            border 
          border-gray-theme 
            rounded-3xl
          `}
        >
          <div className="mr-2 flex">
            <Image
              src="/assets/icons/download.svg"
              height={15}
              width={15}
              alt="Download Icon"
            />
          </div>
          <span className="font-bold">{t("download-graph")}</span>
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
