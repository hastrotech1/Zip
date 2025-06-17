import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MapPin, ArrowLeft, X, Star, Phone, Loader2 } from "lucide-react";
import {
  ViewState,
  Driver,
  Coordinates,
  Suggest,
} from "../../../../../helper/types";
import { vehicleData } from "../Constants/vehicles";
import { haversineKm } from "../../../../../utils/calculations";
import { isValidNGPhone } from "../../../../../utils/phoneValidation";
import { handlePaystackPayment } from "../Services/paymentService";
import { fetchNearbyDrivers } from "../Services/driversServices";
import { useMapbox } from "../../../../hooks/useMapbox";
import MobileHeader from "../MobileHeader/MobileHeader";

export default function PlaceOrderPage() {
  const [view, setView] = useState<ViewState>("form");
  const [selectedVehicle, setVehicle] = useState(vehicleData[0].type);

  const [pickupText, setPickupText] = useState("");
  const [dropoffText, setDropText] = useState("");
  const [pickup, setPickup] = useState<Coordinates | null>(null);
  const [dropoff, setDropoff] = useState<Coordinates | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [fare, setFare] = useState<number | null>(null);

  const [receiverSelf, setReceiverSelf] = useState(true);
  const [receiverPhone, setReceiverPhone] = useState("");

  const [loadingDrivers, setLD] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selDriver, setSelDriver] = useState<Driver | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use our custom hook for map logic
  const { mapWrap } = useMapbox(pickup, dropoff, (location, text) => {
    setPickupText(text);
    setPickup(location);
  });

  // Calculate fare when locations change
  // useEffect(() => {
  //   if (!pickup || !dropoff) {
  //     setDistanceKm(null);
  //     setFare(null);
  //     return;
  //   }
  //   const calculatedFare = calculateFare(
  //     pickup,
  //     dropoff,
  //     selectedVehicle,
  //     vehicleData
  //   );
  //   setFare(calculatedFare);
  // }, [pickup, dropoff, selectedVehicle]);

  useEffect(() => {
    if (!pickup || !dropoff) {
      setDistanceKm(null);
      setFare(null);
      return;
    }
    const km = haversineKm(pickup, dropoff);
    setDistanceKm(km);

    const perKm = 1000;
    const base = vehicleData.find((v) => v.type === selectedVehicle)?.fare || 0;
    setFare(base + km * perKm);
  }, [pickup, dropoff, selectedVehicle]);

  // Handle location selection
  const choose = (s: Suggest, role: "pick" | "drop") => {
    if (role === "pick") {
      setPickupText(s.place_name);
      setPickup({ lng: s.center[0], lat: s.center[1] });
    } else {
      setDropText(s.place_name);
      setDropoff({ lng: s.center[0], lat: s.center[1] });
    }
  };

  // Find drivers
  const onFindDrivers = async () => {
    if (!fare || !pickup || !dropoff) return;
    try {
      setLD(true);
      const driverData = await fetchNearbyDrivers(pickup, dropoff);
      setDrivers(driverData);
      setView("drivers");
    } catch {
      toast.error("Failed to fetch drivers, please retry.");
    } finally {
      setLD(false);
    }
  };

  // Select driver
  const onSelectDriver = (d: Driver) => {
    setSelDriver(d);
    setView("selected");
    toast.success(`You selected ${d.name}`, { position: "bottom-center" });
  };

  // Handle payment
  const handlePayment = () => {
    if (!fare) return;
    const user_mail = localStorage.getItem("user_mail") || "guest@example.com";

    setIsProcessing(true);
    handlePaystackPayment({
      fare,
      user_mail,
      receiverPhone,
      onSuccess: () => {
        setIsProcessing(false);
        setView("form");
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });
  };

  const ready =
    !!pickup &&
    !!dropoff &&
    !!fare &&
    (receiverSelf || isValidNGPhone(receiverPhone || ""));
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100">
      <div ref={mapWrap} className="absolute inset-0 z-0" />
      <MobileHeader />

      {/* bottom sheet */}
      <div className="absolute bottom-0 w-full z-10 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto touch-auto">
        <div className="p-4 space-y-4">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />

          {view === "form" && (
            <>
              {/* VEHICLES */}
              <div className="flex gap-2">
                {vehicleData.map((v) => (
                  <motion.div
                    key={v.type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVehicle(v.type)}
                    className={cn(
                      "flex-1 p-4 rounded-xl border cursor-pointer flex flex-col items-center",
                      selectedVehicle === v.type
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white border-gray-300"
                    )}
                  >
                    <img src={v.image} alt={v.type} className="w-14 h-14" />
                    <span className="text-sm font-semibold mt-1">{v.type}</span>
                    <span className="text-xs text-gray-500">
                      ₦{v.fare.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* LOCATIONS */}
              <LocationInput
                label="Pickup location"
                value={pickupText}
                onChange={setPickupText}
                onSelect={(s) => choose(s, "pick")}
                iconColor="text-green-500"
              />
              <LocationInput
                label="Delivery location"
                value={dropoffText}
                onChange={setDropText}
                onSelect={(s) => choose(s, "drop")}
                iconColor="text-red-500"
              />

              {/* RECEIVER toggle */}
              <div className="flex justify-between items-center">
                <Label>Are you the receiver?</Label>
                <Switch
                  checked={receiverSelf}
                  onCheckedChange={setReceiverSelf}
                />
              </div>
              {!receiverSelf && (
                <Input
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  placeholder="Receiver's phone no."
                  className="bg-gray-100"
                />
              )}

              {/* FARE */}
              {fare && (
                <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-bold text-indigo-900">
                        ₦{fare.toLocaleString()}
                      </p>
                      <p className="text-sm text-indigo-700">Estimated fare</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-indigo-900">
                        {distanceKm} km
                      </p>
                      <p className="text-xs text-indigo-700">Distance</p>
                    </div>
                  </div>
                </div>
              )}

              {/* FIND DRIVER BTN */}
              <button
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2",
                  ready ? "bg-indigo-900 hover:bg-indigo-800" : "bg-gray-400"
                )}
                disabled={!ready || loadingDrivers}
                onClick={onFindDrivers}
              >
                {loadingDrivers && <Loader2 className="h-4 w-4 animate-spin" />}
                {loadingDrivers ? "Finding…" : "Find driver"}
              </button>
            </>
          )}

          {/* DRIVERS list */}
          {view === "drivers" && (
            <>
              <Header
                title="Available drivers"
                onBack={() => setView("form")}
              />
              {loadingDrivers && (
                <p className="text-center text-sm text-gray-500">
                  Loading drivers…
                </p>
              )}
              {drivers.map((d) => (
                <DriverRow
                  key={d.id}
                  d={d}
                  onSelect={() => onSelectDriver(d)}
                />
              ))}
            </>
          )}

          {/* SELECTED driver */}
          {view === "selected" && selDriver && (
            <>
              <Header
                title="Driver details"
                onBack={() => setView("drivers")}
              />
              <SelectedDriverCard d={selDriver} />
              {/* trip summary */}
              <TripSummary pickup={pickupText} dropoff={dropoffText} />

              {fare && (
                <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-bold text-indigo-900">
                        ₦{fare.toLocaleString()}
                      </p>
                      <p className="text-sm text-indigo-700">Total fare</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-indigo-900">
                        {distanceKm} km
                      </p>
                      <p className="text-xs text-indigo-700">Distance</p>
                    </div>
                  </div>
                </div>
              )}

              {/* buttons */}
              <button
                disabled={isProcessing}
                onClick={handlePayment}
                className={`w-full py-4 font-bold rounded-xl transition-colors ${
                  isProcessing
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-indigo-900 hover:bg-indigo-800 text-white"
                }`}
              >
                {isProcessing ? "Processing..." : "Zip It"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* SUB-COMPONENTS --------------------------------------------------- */
/* ----------------------------------------------------------------- */
function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-gray-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <h2 className="font-bold text-lg">{title}</h2>
      <button onClick={onBack} className="text-red-600 flex items-center gap-1">
        <X className="w-4 h-4" />
        Cancel
      </button>
    </div>
  );
}

function DriverRow({ d, onSelect }: { d: Driver; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
    >
      <img
        src={d.profile_pic}
        onError={(e) =>
          (e.currentTarget.src =
            "https://ui-avatars.com/api/?name=Driver&background=777&color=fff")
        }
        alt={d.name}
        className="w-12 h-12 rounded-full shrink-0"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{d.name}</h3>
        <p className="text-xs text-gray-600">{d.vehicle}</p>
        <p className="text-xs text-blue-500">
          {d.eta_minutes} mins • {d.distance_km} km
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
        <span className="text-sm font-medium">{d.rating}</span>
      </div>
    </div>
  );
}

function SelectedDriverCard({ d }: { d: Driver }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <img
        src={d.profile_pic}
        alt={d.name}
        className="w-16 h-16 rounded-full shrink-0"
      />
      <div className="flex-1">
        <h3 className="font-bold">{d.name}</h3>
        <p className="text-sm text-gray-600">{d.vehicle}</p>
        <div className="flex items-center gap-1 text-xs">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span>{d.rating}</span>
          <span className="mx-1">•</span>
          <span className="text-blue-600">
            {d.eta_minutes} mins • {d.distance_km} km
          </span>
        </div>
      </div>
      <button
        onClick={() => (window.location.href = `tel:${d.phone}`)}
        className="inline-flex items-center justify-center w-1/4 py-3 bg-green-600 text-white rounded-xl font-semibold gap-2 mt-4"
      >
        <Phone className="w-4 h-4" />
        Call
      </button>
    </div>
  );
}

function TripSummary({ pickup, dropoff }: { pickup: string; dropoff: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl mb-4">
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Pickup</p>
            <p className="text-sm">{pickup}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Delivery</p>
            <p className="text-sm">{dropoff}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* location input with async suggestions --------------------------- */
function LocationInput({
  label,
  value,
  onChange,
  onSelect,
  iconColor,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  onSelect: (s: { place_name: string; center: [number, number] }) => void;
  iconColor: string;
}) {
  const [suggest, setSuggest] = useState<
    { place_name: string; center: [number, number] }[]
  >([]);

  const fetchSuggest = async (q: string) => {
    if (q.length < 3) return setSuggest([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&addressdetails=1&limit=5&countrycodes=ng`
      );
      const data = await res.json();
      interface OSMResponse {
        display_name: string;
        lon: string;
        lat: string;
      }
      const arr = data.map((d: OSMResponse) => ({
        place_name: d.display_name,
        center: [parseFloat(d.lon), parseFloat(d.lat)] as [number, number],
      }));
      setSuggest(arr);
    } catch {
      setSuggest([]);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchSuggest(value), 300);
    return () => clearTimeout(id);
  }, [value]);

  const iconCls = cn(
    "absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4",
    iconColor
  );

  return (
    <div>
      <Label className="text-xs text-gray-500 mb-1 block">{label}</Label>
      <div className="relative">
        <Input
          className="bg-gray-100 pl-10 pr-4"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
        />
        <MapPin className={iconCls} />

        {suggest.length > 0 && (
          <div className="absolute z-30 w-full bg-white mt-1 rounded-md shadow-lg border max-h-60 overflow-auto">
            {suggest.map((s) => (
              <div
                key={s.place_name}
                onClick={() => {
                  onSelect(s);
                  setSuggest([]);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
              >
                {s.place_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
