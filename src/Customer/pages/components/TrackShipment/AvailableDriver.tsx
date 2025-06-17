// import { useState } from "react";

// interface Driver {
//   id: string;
//   name: string;
//   vehicle: string;
//   eta_minutes: number;
//   distance_km: number;
//   rating: number;
//   profile_pic: string;
// }

// const AvailableDrivers = () => {
//   const [drivers, setDrivers] = useState<Driver[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showPanel, setShowPanel] = useState(false);

//   const fetchDrivers = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/available-drivers");
//       const data = await res.json();
//       setDrivers(data);
//       setShowPanel(true);
//     } catch (err) {
//       console.error("Error fetching drivers:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRequestDriver = async (driverId: string) => {
//     try {
//       await fetch(`/api/request-driver/${driverId}`, { method: "POST" });
//       alert("Driver requested!");
//     } catch (err) {
//       console.error("Failed to request driver", err);
//     }
//   };

//   return (
//     <>
//       <button
//         className="bg-blue-800 text-white px-4 py-2 rounded-lg mt-4"
//         onClick={fetchDrivers}
//         disabled={loading}
//       >
//         {loading ? "Finding Drivers..." : "Find Drivers"}
//       </button>

//       {showPanel && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-2xl max-h-[70vh] overflow-y-auto z-50">
//           <div className="flex justify-between mb-3">
//             <h2 className="text-lg font-bold text-center w-full">
//               Available Drivers
//             </h2>
//             <button
//               onClick={() => setShowPanel(false)}
//               className="text-red-600 text-sm"
//             >
//               Cancel Ride
//             </button>
//           </div>

//           {drivers.map((driver) => (
//             <div
//               key={driver.id}
//               className="flex justify-between items-center border-b py-3"
//             >
//               <div className="flex items-center gap-3">
//                 <img
//                   src={driver.profile_pic}
//                   alt={driver.name}
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <div>
//                   <h3 className="font-semibold">{driver.name}</h3>
//                   <p className="text-sm text-gray-600">{driver.vehicle}</p>
//                   <p className="text-xs text-blue-500">
//                     {driver.eta_minutes} mins, {driver.distance_km} km
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-yellow-500 text-sm">⭐ {driver.rating}</p>
//                 <button
//                   className="bg-blue-800 text-white px-3 py-1 mt-1 text-sm rounded-full"
//                   onClick={() => handleRequestDriver(driver.id)}
//                 >
//                   Request Driver
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// export default AvailableDrivers;

import { useState } from "react";

interface Driver {
  id: string;
  name: string;
  vehicle: string;
  eta_minutes: number;
  distance_km: number;
  rating: number;
  profile_pic: string;
}

const dummyDrivers: Driver[] = [
  {
    id: "driver_001",
    name: "Adam Wale",
    vehicle: "Korope, white mini bus",
    eta_minutes: 3,
    distance_km: 4.5,
    rating: 3.5,
    profile_pic: "https://ui-avatars.com/api/?name=Adam+Wale",
  },
  {
    id: "driver_002",
    name: "Jane Doe",
    vehicle: "Sienna, black",
    eta_minutes: 5,
    distance_km: 6.1,
    rating: 4.0,
    profile_pic: "https://ui-avatars.com/api/?name=Jane+Doe",
  },
  {
    id: "driver_003",
    name: "Daniel Obi",
    vehicle: "Truck, white heavy duty",
    eta_minutes: 8,
    distance_km: 7.3,
    rating: 4.2,
    profile_pic: "https://ui-avatars.com/api/?name=Daniel+Obi",
  },
];

const AvailableDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);

    try {
      // TODO: Replace this with real API call
      // const res = await fetch("/api/available-drivers");
      // const data = await res.json();
      // setDrivers(data);

      // TEMP: Use dummy data
      setTimeout(() => {
        setDrivers(dummyDrivers);
        setShowPanel(true);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setLoading(false);
    }
  };

  const handleRequestDriver = async (driverId: string) => {
    try {
      // TODO: Replace with real API call
      // await fetch(`/api/request-driver/${driverId}`, { method: "POST" });

      alert(`Driver ${driverId} requested!`);
    } catch (err) {
      console.error("Failed to request driver", err);
    }
  };

  return (
    <>
      <button
        className="bg-blue-800 text-white px-4 py-2 rounded-lg mt-4"
        onClick={fetchDrivers}
        disabled={loading}
      >
        {loading ? "Finding Drivers..." : "Find Drivers"}
      </button>

      {showPanel && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-2xl max-h-[70vh] overflow-y-auto z-50">
          <div className="flex justify-between mb-3">
            <h2 className="text-lg font-bold text-center w-full">
              Available Drivers
            </h2>
            <button
              onClick={() => setShowPanel(false)}
              className="text-red-600 text-sm"
            >
              Cancel Ride
            </button>
          </div>

          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="flex justify-between items-center border-b py-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={driver.profile_pic}
                  alt={driver.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{driver.name}</h3>
                  <p className="text-sm text-gray-600">{driver.vehicle}</p>
                  <p className="text-xs text-blue-500">
                    {driver.eta_minutes} mins, {driver.distance_km} km
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-500 text-sm">⭐ {driver.rating}</p>
                <button
                  className="bg-blue-800 text-white px-3 py-1 mt-1 text-sm rounded-full"
                  onClick={() => handleRequestDriver(driver.id)}
                >
                  Request Driver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AvailableDrivers;
