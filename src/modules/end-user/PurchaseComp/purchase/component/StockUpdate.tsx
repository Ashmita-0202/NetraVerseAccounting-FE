// import { useEffect, useState } from "react";
// import { HubConnectionBuilder } from "@microsoft/signalr";

// interface StockUpdate {
//   itemId: any;
//   quantity: any;
// }

// const StockUpdateComponent = () => {
//   const [stockUpdates, setStockUpdates] = useState<StockUpdate[]>([]);
//   const [connecionStatus, setConnectionStatus] = useState("Disconnected");
//   //const [connection, setConnection] = useState<HubConnection | null>(null);

//   const token = localStorage.getItem("token");
//   useEffect(() => {
//     const newConnection = new HubConnectionBuilder()
//       .withUrl("https://localhost:44314/StockHub", {
//         headers: {
//           // Optional: Add authorization headers if required
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .build();

//     console.log("TEst", newConnection);

//     newConnection
//       .start()
//       .then(() => {
//         console.log("Connected to SignalR");
//         setConnectionStatus("Connected");
//       })
//       .catch((error) => {
//         console.error("Error connecting to SignalR: ", error);
//         setConnectionStatus("Failed to connect");
//       });

//     // Set up message receiving from the SignalR hub
//     newConnection.on("ReceiveStockUpdate", (itemId, quantity) => {
//       console.log(`Stock updated for ItemId: ${itemId}, Quantity: ${quantity}`);
//       setStockUpdates((prevUpdates) => [...prevUpdates, { itemId, quantity }]);
//     });

//     // Set the connection object in the state
//     //setConnection(newConnection);

//     // Cleanup connection on component unmount
//     return () => {
//       if (newConnection) {
//         newConnection.stop();
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <h1>Stock Updates</h1>
//       <p>Status: {connecionStatus}</p>
//       <ul>
//         {stockUpdates.map((update, index) => (
//           <li key={index}>
//             Item ID: {update.itemId} - Quantity: {update.quantity}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default StockUpdateComponent;
