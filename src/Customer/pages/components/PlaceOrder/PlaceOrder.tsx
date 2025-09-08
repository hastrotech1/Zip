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
import { getVehicles } from "../../components/Constants/vehicles";
import { vehicleImageByName } from "../Constants/vehicles";
import { vehicleData } from "../Constants/vehicles";
import { haversineKm } from "../../../../../utils/calculations";
import { isValidNGPhone } from "../../../../../utils/phoneValidation";
import {createShipment} from "../../../../../helper/createShipment"
import { handlePaystackPayment } from "../Services/paymentService";
import { fetchNearbyDrivers, selectDriverForOrder } from "../Services/driversServices";
import { useMapbox } from "../../../../hooks/useMapbox";
import MobileMenu from "../MobileHeader/MobileHeader";

/* ----------------------------------------------------------------- */
/* MAIN COMPONENT -------------------------------------------------- */
/* ----------------------------------------------------------------- */

export default function PlaceOrderPage() {
  const [view, setView] = useState<ViewState>("form");
  const [selectedVehicle, setVehicle] = useState(vehicleData[0].name);

  const [backendVehicles, setBackendVehicles] = useState(vehicleData);

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

  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const { mapWrap } = useMapbox(pickup, dropoff, (location: Coordinates, text: string) => {
    setPickupText(text);
    setPickup(location);
  });


  const vehiclesWithImages = backendVehicles.map((v) => ({
    ...v,
    image: vehicleImageByName(v.name),
  }));

    useEffect(() => {
      if (!pickup || !dropoff) {
        setDistanceKm(null);
        setFare(null);
        return;
      }
      const km = haversineKm(pickup, dropoff);
      setDistanceKm(km);

      const base =
        vehiclesWithImages.find((v) => v.name === selectedVehicle)?.price || 0;
      const perKm = 1000;
      setFare(base + km * perKm);
    }, [pickup, dropoff, selectedVehicle, vehiclesWithImages]);

  const choose = (s: Suggest, role: "pick" | "drop") => {
    if (role === "pick") {
      setPickupText(s.place_name);
      setPickup({ lng: s.center[0], lat: s.center[1] });
    } else {
      setDropText(s.place_name);
      setDropoff({ lng: s.center[0], lat: s.center[1] });
    }
  };

    useEffect(() => {
    const loadVehicles = async () => {
      try {
        console.log("Loading vehicles from backend...");
        const vehicles = await getVehicles();
        console.log("Raw vehicles data:", vehicles);
        
        if (vehicles && vehicles.length > 0) {
          const mappedVehicles = vehicles.map((v) => ({
            id: v.id,
            name: v.name,
            price: typeof v.price === 'string' ? parseFloat(v.price) : v.price, // Handle string prices
            image: vehicleImageByName(v.name),
          }));
          
          console.log("Mapped vehicles:", mappedVehicles);
          setBackendVehicles(mappedVehicles);
        } else {
          console.log("No vehicles returned from backend, using defaults");
          setBackendVehicles(vehicleData);
        }
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        toast.error("Failed to load vehicles, using defaults");
        setBackendVehicles(vehicleData); // Fallback to default vehicles
      }
    };

    loadVehicles();
  }, []);

  // Find drivers
  const onFindDrivers = async () => {
    try {
      setLD(true);
      const driverData = await fetchNearbyDrivers();
      setDrivers(driverData);
      setView("drivers");
    } catch {
      toast.error("Failed to fetch drivers, please retry.");
    } finally {
      setLD(false);
    }
  };

  const onSelectDriver = async (d: Driver) => {
    setSelDriver(d);
    setView("selected");
    toast.success(`You selected ${d.name}`, { position: "bottom-center" });

    if (orderNumber) {
      try {
        await selectDriverForOrder(d.id, orderNumber);
        toast.success("Driver assigned to your order!");
      } catch {
        toast.error("Failed to assign driver.");
      }
    }
  };
  

  const handleZipIt = async () => {
    if (!pickupText || !dropoffText || !fare) return;

    const selectedVehicleObj = backendVehicles.find(
      (v) => v.name === selectedVehicle
    );
    if (!selectedVehicleObj) {
      toast.error("Please select a vehicle.");
      return;
    }

    const user_mail = localStorage.getItem("user_mail") || "guest@example.com";
    setIsProcessing(true);

    handlePaystackPayment({
      fare,
      user_mail,
      receiverPhone,
      onSuccess: async () => {
        try {
          const shipment = await createShipment({
            pickup_location: pickupText,
            delivery_location: dropoffText,
            receiver_phone: receiverSelf ? "" : receiverPhone,
            estimate_fee: fare,
            selected_vehicle: selectedVehicleObj.id,
          });
          setOrderNumber(shipment.data.customer_order_id);
          toast.success("Shipment created!");
          setView("form");
        } catch (e) {
          toast.error("Failed to create shipment.");
        } finally {
          setIsProcessing(false);
        }
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
    <div className="relative h-screen w-full overflow-hidden bg-gray-100 max-auto">
      {/* Floating menu button */}
      <div className="fixed top-4 left-4 z-50">
        <MobileMenu floating />
      </div>
      {/* Add top padding so content isn't hidden under the menu button */}
      <div ref={mapWrap} className="absolute inset-0 z-0 p-0 pt-20 md:pt-0" />
      {/* bottom sheet */}
      <div className="absolute bottom-0 w-full z-10 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto touch-auto">
        <div className="p-4 md:p-8 space-y-4">
          {view === "form" && (
            <>
              {/* VEHICLES */}
              <div className="flex gap-2">
                {vehiclesWithImages.map((v) => (
                  <motion.div
                    key={v.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVehicle(v.name)}
                    className={cn(
                      "flex-1 p-4 rounded-xl border cursor-pointer flex flex-col items-center",
                      selectedVehicle === v.name
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white border-gray-300"
                    )}
                  >
                    <img src={v.image} alt={v.name} className="w-14 h-14" />
                    <span className="text-sm font-semibold mt-1">{v.name}</span>
                    <span className="text-xs text-gray-500">
                      ₦{v.price.toLocaleString()}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Header
                title="Available drivers"
                onBack={() => setView("form")}
              />
              {loadingDrivers && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Finding the best drivers for you...
                  </p>
                </div>
              )}
              <div className="space-y-3">
                {drivers.map((d, index) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DriverRow d={d} onSelect={() => onSelectDriver(d)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
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
                onClick={handleZipIt}
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
    <div className="sticky top-0 pt-3 z-10 bg-white border-b border-border">
      {/* Top divider bar inside the sticky container */}
      <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />

      {/* Header content */}
      <div className="flex justify-between items-center pb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-xl bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        <h2 className="font-bold text-xl text-foreground">{title}</h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors p-2 rounded-xl bg-destructive/10"
        >
          <X className="w-5 h-5" />
          <span className="text-sm font-medium">Close</span>
        </motion.button>
      </div>
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
        src={d.profile_image}
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
        src={d.profile_image}
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
        onClick={() => (window.location.href = `tel:${d.phone_number}`)}
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
