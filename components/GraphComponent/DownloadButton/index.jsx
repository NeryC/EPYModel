import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import * as d3 from "d3";
import { saveAs } from "file-saver";

export const DownloadButton = ({ type }) => {
  const { t } = useTranslation("common");

  const [values, setValues] = useState({
    isMenuOpen: false,
  });

  const openMenu = () => {
    setValues((state) => ({
      ...state,
      isMenuOpen: !state.isMenuOpen,
    }));
  };

  const downloadGraph = (format) => {
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(
      d3.select(`#${type}`).node()
    );
    const baseImage = "data:image/svg+xml;base64,";
    const imgData = baseImage + Buffer.from(xmlString).toString("base64");
    saveAs(imgData, `${type}.svg`);
  };

  const DonwloadOption = ({ text }) => (
    <li
      className="dropdown-item hover:bg-blue-100 px-4 py-1"
      onClick={() => downloadGraph(text)}
    >
      {text}
    </li>
  );

  return (
    <div className="flex justify-center text-base font-medium">
      <div className="dropdown relative text-deep-blue">
        <button
          onClick={openMenu}
          className={`
            flex 
            items-center 
            ${values.isMenuOpen ? "bg-gray-200" : "bg-transparent"} 
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
              ${!values.isMenuOpen && "hidden"}
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
