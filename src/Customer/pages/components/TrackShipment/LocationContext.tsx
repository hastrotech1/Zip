// // src/contexts/LocationContext.tsx
// import React, { createContext, useContext, useState, ReactNode } from "react";
// import { Location } from "../../../../../helper/pricing.types";

// interface LocationContextType {
//   pickupLocation: Location;
//   setPickupLocation: React.Dispatch<React.SetStateAction<Location>>;
//   dropoffLocation: Location;
//   setDropoffLocation: React.Dispatch<React.SetStateAction<Location>>;
// }

// const LocationContext = createContext<LocationContextType | undefined>(
//   undefined
// );

// export const LocationProvider = ({ children }: { children: ReactNode }) => {
//   const [pickupLocation, setPickupLocation] = useState<Location>({
//     lat: 0,
//     lng: 0,
//     address: "",
//   });
//   const [dropoffLocation, setDropoffLocation] = useState<Location>({
//     lat: 0,
//     lng: 0,
//     address: "",
//   });

//   return (
//     <LocationContext.Provider
//       value={{
//         pickupLocation,
//         setPickupLocation,
//         dropoffLocation,
//         setDropoffLocation,
//       }}
//     >
//       {children}
//     </LocationContext.Provider>
//   );
// };

// export const useLocation = () => {
//   const context = useContext(LocationContext);
//   if (!context) {
//     throw new Error("useLocation must be used within a LocationProvider");
//   }
//   return context;
// };

import React, { createContext, useState, useContext } from "react";

interface Location {
  lat: number;
  lng: number;
  address: string;
  state: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface LocationContextType {
  pickupLocation: Location;
  dropoffLocation: Location;
  setPickupLocation: (location: Location) => void;
  setDropoffLocation: (location: Location) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pickupLocation, setPickupLocation] = useState<Location>(
    {} as Location
  );
  const [dropoffLocation, setDropoffLocation] = useState<Location>(
    {} as Location
  );

  return (
    <LocationContext.Provider
      value={{
        pickupLocation,
        dropoffLocation,
        setPickupLocation,
        setDropoffLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
