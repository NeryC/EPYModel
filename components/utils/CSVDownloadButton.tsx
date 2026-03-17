import { memo, useCallback } from "react";
import { saveAs } from "file-saver";
import { DataPoint } from "../../store/reducers/graphInfoSlice";

interface CSVDownloadButtonProps {
  type: string;
  data: DataPoint[];
}

const csvHeaders = (type: string) => [
  { label: "day", key: "day" },
  { label: type, key: "value" },
];

const CSVDownloadButton = memo(({ type, data }: CSVDownloadButtonProps) => {
  const downloadCSV = useCallback(() => {
    if (!data) return;
    
    const headers = csvHeaders(type);
    const csvContent = [
      headers.map(h => h.label).join(','),
      ...data.map(row => 
        headers.map(h => row[h.key as keyof DataPoint]).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${type}.csv`);
  }, [data, type]);

  return (
    <li className="dropdown-item hover:bg-blue-100 px-5 md:px-4 py-3 md:py-1">
      <span className="block cursor-pointer" onClick={downloadCSV}>
        csv
      </span>
    </li>
  );
});

CSVDownloadButton.displayName = "CSVDownloadButton";

export default CSVDownloadButton;
