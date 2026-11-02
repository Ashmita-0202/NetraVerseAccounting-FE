// import { InputElement } from "@/components/FormComponents/input";
// import { IFilterPurchaseByDate } from "../types/Ipurchase";
// import { UseFormReturn } from "react-hook-form";
// import { ThemeProvider, createTheme } from "@fluentui/react";
// import { ButtonElement } from "@/components/FormComponents/Button";
// import { useGetAllLedgers } from "../../account/ledger/hooks";
// import { useState, useEffect, useRef } from "react";
// import LedgerGroupName from "./LedgerGroupName";
// type Props = {
//   form: UseFormReturn<IFilterPurchaseByDate>;
//   setFormData: (data: IFilterPurchaseByDate) => void;
// };

// const FilterPurchaseForm = ({ form, setFormData }: Props) => {
//   const customTheme = createTheme({ palette: { themePrimary: "#14b8a6" } });
//   const { data: allLedger } = useGetAllLedgers();
//   const validLedgerGroupIds = [
//     "a1d2f3b4-c5e6-7890-a123-b456c789d012",
//     "d4b5c6f7-a890-1234-d567-e890f123g456",
//     "z6t7u8v9-a012-3456-z789-a012b345c678",
//   ];

//   const ledger = allLedger?.Items.filter((group) =>
//     validLedgerGroupIds.includes(group.ledgerGroupId)
//   );
//   const { handleSubmit, getValues, reset } = form;
//   const [searchTerm, setSearchTerm] = useState("");
//   const filteredLedgerGroups = ledger?.filter((group) =>
//     group.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const onSubmit = () => {
//     const formData = getValues();
//     setFormData(formData);
//   };

//   const handleClear = () => {
//     setFormData({
//       startDate: "",
//       endDate: "",
//       ledgerId: "",
//     });
//     reset({
//       startDate: "",
//       endDate: "",
//       ledgerId: "",
//     });
//     setSearchTerm("");
//   };
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLUListElement>(null);
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//   const handleSelectLedger = (ledgerId: string) => {
//     form.setValue("ledgerId", ledgerId);
//   };

//   return (
//     <div className="">
//       <form onSubmit={handleSubmit(onSubmit)} className="flex">
//         <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full  gap-4 w-[87%] mb-4 mr-2">
//           <InputElement
//             layout="column"
//             form={form}
//             inputType="date"
//             name="startDate"
//             placeholder="Enter Start Date"
//           />
//           <InputElement
//             form={form}
//             inputType="date"
//             name="endDate"
//             placeholder="Enter End Date"
//           />
//           <div className="">
//             <input
//               type="text"
//               placeholder="Search Ledger ..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onClick={() => setIsDropdownOpen(true)}
//               onFocus={() => setIsDropdownOpen(true)}
//               className="w-full border rounded px-2 py-2 mb-1"
//             />

//             {isDropdownOpen &&
//               filteredLedgerGroups &&
//               filteredLedgerGroups.length > 0 && (
//                 <ul
//                   ref={dropdownRef}
//                   className="absolute  w-[25.3rem] bg-white border rounded shadow z-10 max-h-40 overflow-y-auto py-1"
//                 >
//                   {filteredLedgerGroups.map((group) => (
//                     <li
//                       key={group.id}
//                       className="mx-2 px-2 py-1 cursor-pointer rounded-sm hover:bg-gray-100 flex justify-start"
//                       onClick={() => {
//                         setSearchTerm(group.name);
//                         setIsDropdownOpen(false);
//                         handleSelectLedger(group.id);
//                       }}
//                     >
//                       <div className="flex justify-between w-full">
//                         <div className="flex justify-start ">{group.name}</div>
//                         <div>
//                           {" "}
//                           <LedgerGroupName
//                             ledgerGroupId={group.ledgerGroupId}
//                           />
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}

//             {isDropdownOpen &&
//               filteredLedgerGroups &&
//               filteredLedgerGroups.length === 0 && (
//                 <p className="text-gray-500 mb-2">No matching Ledger found</p>
//               )}
//           </div>
//         </div>

//         <div className="flex justify-center items-center  h-full mt-1">
//           <ThemeProvider theme={customTheme}>
//             <ButtonElement
//               className="flex "
//               style={{
//                 backgroundColor: customTheme.palette.themePrimary,
//                 padding: "5px 0",
//                 borderRadius: "8px",
//               }}
//               type="submit"
//               text="Submit"
//             />
//           </ThemeProvider>
//           <ThemeProvider theme={customTheme} className="ml-4">
//             <ButtonElement
//               className="flex "
//               style={{
//                 backgroundColor: customTheme.palette.themePrimary,
//                 padding: "5px 0",
//                 borderRadius: "8px",
//               }}
//               onClick={handleClear}
//               type="button"
//               text="Clear"
//             />
//           </ThemeProvider>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FilterPurchaseForm;
