import React, { useState } from "react";
import Swal from "sweetalert2";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { FileText, FileSpreadsheet, ChevronDown } from "lucide-react";

interface ExportButtonProps {
  tableRef: React.RefObject<HTMLTableElement>;
  fileName?: string;
  setPagination: (value: boolean) => void; // New prop to control pagination
}

const ExportButton: React.FC<ExportButtonProps> = ({
  tableRef,
  fileName = "exported_data",
  setPagination,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const showLoading = () => {
    Swal.fire({
      title: "Exporting...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.isLoading();
      },
    });
  };

  const handleExportPDF = async () => {
    if (!tableRef.current) {
      Swal.fire("Error", "Table not found!", "error");
      return;
    }

    Swal.fire({
      title: "Export as PDF?",
      text: "Do you want to download the data as a PDF file?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, export it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setPagination(false); // Disable pagination before export
        await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay to update UI

        showLoading();
        await html2pdf().from(tableRef.current).save(`${fileName}.pdf`);

        setPagination(true); // Re-enable pagination after export
        Swal.close();
      }
    });
  };

  const handleExportExcel = async () => {
    if (!tableRef.current) {
      Swal.fire("Error", "Table not found!", "error");
      return;
    }

    Swal.fire({
      title: "Export as Excel?",
      text: "Do you want to download the data as an Excel file?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, export it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setPagination(false);
        await new Promise((resolve) => setTimeout(resolve, 500));

        showLoading();
        if (tableRef.current) {
          const rows = Array.from(tableRef.current.querySelectorAll("tr")).map(
            (tr) =>
              Array.from(tr.querySelectorAll("td, th")).map(
                (cell) => cell.textContent
              )
          );

          const ws = XLSX.utils.aoa_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
          XLSX.writeFile(wb, `${fileName}.xlsx`);

          setPagination(true); // Re-enable pagination after export
          Swal.close();
        }
      }
    });
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Export <ChevronDown size={16} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FileText size={16} /> Export as PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FileSpreadsheet size={16} /> Export as Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
