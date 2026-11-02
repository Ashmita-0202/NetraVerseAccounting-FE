// import SalesReturnFilter from "../component/FilterSalesReturn";
// import { useState, useEffect } from "react";
// import { ISalesDetails, ISalesReturnDetails } from "../types/ISalesReturn";
// import { useGetAllSalesDetail } from "../hooks";

// interface Props {
//   visible: boolean;
//   onClose: () => void;
// }

// const Filter = ({ visible, onClose }: Props) => {
//   const { data } = useGetAllSalesDetail();
//   const [allSalesData, setAllSalesData] = useState<ISalesReturnDetails[]>([]);
//   const [, setFilteredData] = useState<ISalesReturnDetails[]>([]);

//   useEffect(() => {
//     if (data?.Items) {
//       const salesData = data.Items.map((item: ISalesDetails) => ({
//         ...item,
//         ...{
//           salesDetailsId: item.id,
//           totalReturnAmount: 0,
//           taxAdjustment: 0,
//           netReturnAmount: 0,
//           reason: "",
//         },
//       }));
//       setAllSalesData(salesData);
//       setFilteredData(salesData);
//     }
//   }, [data]);

//   const handleFilter = (filters: { id: string }) => {
//     const { id } = filters;
//     const filtered = id
//       ? allSalesData.filter((item) => item.salesDetailsId === id)
//       : allSalesData;
//     setFilteredData(filtered);
//   };

//   if (!visible) return null;

//   return (
//     <div className="fixed inset-0 bg-black  bg-opacity-40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl  max-w-md p-6 relative">
//         <button
//           className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
//           onClick={onClose}
//         >
//           ✕
//         </button>
//         <h2 className="text-lg font-bold mb-4">Filter Sales Return</h2>
//         <SalesReturnFilter onFilter={handleFilter} onClose={onClose} />
//       </div>
//     </div>
//   );
// };

// export default Filter;
