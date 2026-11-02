// import React, { useState, useEffect } from "react";
// import { useGetAllSalesReturnDetail, useGetSalesDetailById } from "../hooks";

// type Props = {
//   onClose: () => void;
//   onFilter: (filters: { id: string }) => void;
// };

// const SalesReturnFilter: React.FC<Props> = ({ onFilter, onClose }) => {
//   const {
//     data: salesData,
//     isLoading,
//     isError,
//   } = useGetAllSalesReturnDetail("");
//   const [selectedId, setSelectedId] = useState("");
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   const {
//     data: detailsData,
//     isLoading: isDetailsLoading,
//     isError: isDetailsError,
//     refetch: refetchDetails,
//   } = useGetSalesDetailById(selectedId);

//   useEffect(() => {
//     if (showDetailsModal && selectedId) {
//       refetchDetails();
//     }
//   }, [showDetailsModal, selectedId, refetchDetails]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedId) return;

//     onFilter({ id: selectedId });
//     setShowDetailsModal(true);
//   };

//   const handleReset = () => {
//     setSelectedId("");
//     onFilter({ id: "" });
//     setShowDetailsModal(false);
//   };

//   const closeDetailsModal = () => {
//     setShowDetailsModal(false);
//     onClose();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-red-500">
//           Failed to load sales data. Please try again later.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <form onSubmit={handleSearch} className="flex items-center gap-3 mb-4">
//         <select
//           value={selectedId}
//           onChange={(e) => setSelectedId(e.target.value)}
//           disabled={isLoading || isError || !salesData?.Items?.length}
//           className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//         >
//           <option value="">Select Sales Return ID</option>
//           {salesData?.Items?.map((item) => (
//             <option key={item.id} value={item.id}>
//               {item.id}
//             </option>
//           ))}
//         </select>

//         <button
//           type="submit"
//           disabled={!selectedId || isLoading}
//           className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-400 disabled:bg-teal-300"
//           onClick={handleSearch}
//         >
//           Filter
//         </button>

//         <button
//           type="button"
//           onClick={handleReset}
//           className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-200"
//         >
//           Reset
//         </button>
//       </form>

//       {!isLoading && !isError && salesData?.Items?.length === 0 && (
//         <p className="text-gray-500">No sales returns available</p>
//       )}

//       {showDetailsModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto relative">
//             <button
//               onClick={closeDetailsModal}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
//               aria-label="Close modal"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>

//             {isDetailsLoading ? (
//               <div className="flex justify-center items-center h-32">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//               </div>
//             ) : isDetailsError ? (
//               <div className="text-red-500 p-4 bg-red-50 rounded-md">
//                 Error loading sales details. Please try again.
//                 <button
//                   onClick={() => refetchDetails()}
//                   className="ml-2 text-teal-600 hover:text-teal-800"
//                 >
//                   Retry
//                 </button>
//               </div>
//             ) : detailsData ? (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-500">
//                       Reference Number
//                     </label>
//                     <p className="mt-1 font-medium">
//                       {detailsData.referenceNumber || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-500">
//                       Return Date
//                     </label>
//                     <p className="mt-1 font-medium">
//                       {detailsData.returnDate || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-500">
//                       Reference Number
//                     </label>
//                     <p className="mt-1 font-medium">
//                       {detailsData.referenceNumber || "N/A"}
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-medium text-lg mb-3">Returned Items</h3>
//                   <div className="overflow-x-auto border border-gray-200 rounded-lg">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-100">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Item ID
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Quantity
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Unit Price (Rs.)
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Total (Rs.)
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {detailsData.salesItems?.length > 0 ? (
//                           detailsData.salesItems.map((item, index) => (
//                             <tr
//                               key={index}
//                               className={
//                                 index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                               }
//                             >
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                 {item.id}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {item.quantity}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {item.price?.toFixed(2)}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                 {(item.quantity * item.price)?.toFixed(2)}
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td
//                               colSpan={4}
//                               className="px-6 py-4 text-center text-sm text-gray-500"
//                             >
//                               No items found in this return
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-md">
//                 No details available for this sales return
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SalesReturnFilter;
