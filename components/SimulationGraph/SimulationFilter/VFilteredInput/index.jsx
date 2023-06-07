import { useTranslation } from "next-i18next";

function VFilteredInput({ vFiltered, handleVFilteredChange }) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col md:flex-row items-center w-auto mx-auto">
      <label
        htmlFor="filtered"
        className="md:text-sm dark:text-white font-bold"
      >
        {t("v_filtered")}
      </label>
      <input
        type="number"
        id="filtered"
        min="0"
        max="5000"
        value={vFiltered}
        onChange={handleVFilteredChange}
        className="flex h-10 justify-center rounded-xl border p-3 md:text-sm outline-none border-gray-200 mt-2 md:mt-0 md:ml-3"
      />
    </div>
  );
}

export default VFilteredInput;
