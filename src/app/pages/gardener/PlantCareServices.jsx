import { useState } from "react";
import { ArrowLeft, MapPin, Star, DollarSign, Calendar, Clock, Plus, Minus, Navigation } from "lucide-react";
import { Link } from "react-router";

// Mock map component — no API key needed
function MockMap({ city }) {
  const stores = [
    { id: 1, name: "Green Haven Plant Care", x: "28%", y: "35%", rating: 4.8 },
    { id: 2, name: "Urban Jungle Services",  x: "55%", y: "55%", rating: 4.6 },
    { id: 3, name: "Plant Doctor Mobile",    x: "70%", y: "30%", rating: 4.9 },
  ];

  return (
      <div className="relative w-full h-64 bg-[#e8f0e8] rounded-xl overflow-hidden border border-gray-200">
        {/* Grid lines to simulate map */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          {[...Array(8)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="#4CAF50" strokeWidth="1" />
          ))}
          {[...Array(10)].map((_, i) => (
              <line key={`v${i}`} x1={`${(i + 1) * 10}%`} y1="0" x2={`${(i + 1) * 10}%`} y2="100%" stroke="#4CAF50" strokeWidth="1" />
          ))}
        </svg>

        {/* Fake roads */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="45%" x2="100%" y2="45%" stroke="white" strokeWidth="6" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="white" strokeWidth="4" />
          <line x1="35%" y1="0" x2="35%" y2="100%" stroke="white" strokeWidth="6" />
          <line x1="65%" y1="0" x2="65%" y2="100%" stroke="white" strokeWidth="4" />
          <line x1="10%" y1="20%" x2="90%" y2="60%" stroke="white" strokeWidth="3" />
        </svg>

        {/* Green areas */}
        <div className="absolute bg-green-200 rounded-lg opacity-50" style={{ left: "5%", top: "10%", width: "18%", height: "25%" }} />
        <div className="absolute bg-green-200 rounded-lg opacity-50" style={{ left: "75%", top: "55%", width: "20%", height: "30%" }} />
        <div className="absolute bg-blue-200 rounded opacity-40" style={{ left: "42%", top: "15%", width: "15%", height: "20%" }} />

        {/* Store pins */}
        {stores.map((store) => (
            <div
                key={store.id}
                className="absolute transform -translate-x-1/2 -translate-y-full group cursor-pointer"
                style={{ left: store.x, top: store.y }}
            >
              <div className="bg-[#4CAF50] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-2 text-xs whitespace-nowrap hidden group-hover:block z-10 border border-gray-100">
                <p className="font-semibold text-gray-800">{store.name}</p>
                <p className="text-yellow-500">★ {store.rating}</p>
              </div>
            </div>
        ))}

        {/* User location pin */}
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "50%" }}>
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
        </div>

        {/* Map label */}
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-[#4CAF50]" />
          {city ? `Services near ${city}` : "Plant care services near you"}
        </div>

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <button className="w-7 h-7 bg-white rounded shadow text-gray-700 flex items-center justify-center hover:bg-gray-50 font-bold text-sm">+</button>
          <button className="w-7 h-7 bg-white rounded shadow text-gray-700 flex items-center justify-center hover:bg-gray-50 font-bold text-sm">−</button>
        </div>
      </div>
  );
}

export default function PlantCareServices() {
  const [step, setStep]                         = useState("location");
  const [selectedStore, setSelectedStore]       = useState(null);
  const [toast, setToast]                       = useState(null);
  const [serviceType, setServiceType]           = useState("");
  const [selectedDate, setSelectedDate]         = useState("");
  const [selectedTime, setSelectedTime]         = useState("");
  const [plantCount, setPlantCount]             = useState(1);
  const [notes, setNotes]                       = useState("");
  const [address, setAddress]                   = useState("");
  const [contactMethod, setContactMethod]       = useState("phone");
  const [pickupPreference, setPickupPreference] = useState(false);
  const [errors, setErrors]                     = useState({});
  const [userCity, setUserCity]                 = useState("");

  const stores = [
    { id: "1", name: "Green Haven Plant Care", rating: 4.8, distance: "0.5 km", services: ["Plant Care", "Pest Control", "Consultation"],          priceRange: "$$",  reviews: 127 },
    { id: "2", name: "Urban Jungle Services",  rating: 4.6, distance: "1.2 km", services: ["Watering", "Repotting", "Plant Sitting"],               priceRange: "$$$", reviews: 89  },
    { id: "3", name: "Plant Doctor Mobile",    rating: 4.9, distance: "2.1 km", services: ["Plant Health Check", "Disease Treatment", "Fertilization"], priceRange: "$$", reviews: 203 },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!serviceType)  newErrors.serviceType  = "Please select a service type";
    if (!selectedDate) newErrors.selectedDate = "Please select a date";
    if (selectedDate && new Date(selectedDate) < new Date()) newErrors.selectedDate = "Date cannot be in the past";
    if (!selectedTime) newErrors.selectedTime = "Please select a time";
    if (!address)      newErrors.address      = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitBooking = () => {
    if (validateForm()) {
      setStep("confirmation");
      showToast("Booking request submitted successfully!");
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
      <div className="max-w-4xl mx-auto">
        <Link to="/gardener" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /><span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Plant Care Services</h1>
          <p className="text-gray-600">Find and book nearby plant care professionals</p>
        </div>

        {/* Location Step */}
        {step === "location" && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-[#4CAF50]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Find Services Near You</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Enter your city to find plant care services in your area.</p>
              <div className="max-w-sm mx-auto space-y-3">
                <input
                    type="text"
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setStep("stores")}
                    placeholder="Enter your city (e.g. Riyadh)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
                <button onClick={() => setStep("stores")}
                        className="w-full px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors font-medium">
                  Find Services
                </button>
                <button onClick={() => setStep("stores")}
                        className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
                  Use My Current Location
                </button>
              </div>
            </div>
        )}

        {/* Stores Step */}
        {step === "stores" && (
            <div>
              {/* Mock Map */}
              <div className="mb-6">
                <MockMap city={userCity} />
              </div>

              <div className="space-y-4">
                {stores.map((store) => (
                    <div key={store.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{store.rating}</span>
                              <span>({store.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /><span>{store.distance}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" /><span>{store.priceRange}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {store.services.map((service) => (
                                <span key={service} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">{service}</span>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => { setSelectedStore(store); setStep("booking"); }}
                                className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors whitespace-nowrap">
                          Book Now
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* Booking Step */}
        {step === "booking" && selectedStore && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Book Service</h2>
                <p className="text-gray-600">{selectedStore.name}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type <span className="text-red-500">*</span></label>
                  <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] ${errors.serviceType ? "border-red-500" : "border-gray-300"}`}>
                    <option value="">Select a service</option>
                    {selectedStore.services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setErrors((prev) => ({ ...prev, selectedDate: "" })); }} min={getTomorrowDate()}
                             className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] ${errors.selectedDate ? "border-red-500" : "border-gray-300"}`} />
                    </div>
                    {errors.selectedDate && <p className="text-red-500 text-sm mt-1">{errors.selectedDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time <span className="text-red-500">*</span></label>
                    <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => { setSelectedTime(e.target.value); setErrors((prev) => ({ ...prev, selectedTime: "" })); }}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] ${errors.selectedTime ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.selectedTime && <p className="text-red-500 text-sm mt-1">{errors.selectedTime}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Plants</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setPlantCount(Math.max(1, plantCount - 1))} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-medium w-12 text-center">{plantCount}</span>
                    <button onClick={() => setPlantCount(plantCount + 1)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Address <span className="text-red-500">*</span></label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address"
                         className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] ${errors.address ? "border-red-500" : "border-gray-300"}`} />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                  <div className="flex gap-4">
                    {["phone", "email"].map((method) => (
                        <label key={method} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value={method} checked={contactMethod === method} onChange={(e) => setContactMethod(e.target.value)}
                                 className="w-4 h-4 text-[#4CAF50] border-gray-300 focus:ring-[#4CAF50]" />
                          <span className="capitalize">{method}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={pickupPreference} onChange={(e) => setPickupPreference(e.target.checked)}
                           className="mt-1 w-5 h-5 text-[#4CAF50] border-gray-300 rounded focus:ring-[#4CAF50]" />
                    <div>
                      <span className="font-medium text-gray-900">Plant Pickup Service</span>
                      <p className="text-sm text-gray-600">I'd like the service to pick up my plants</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
                            placeholder="Any special requirements or information..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => setStep("stores")} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Back to Stores</button>
                  <button onClick={handleSubmitBooking} className="flex-1 px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors font-medium">Submit Booking Request</button>
                </div>
              </div>
            </div>
        )}

        {/* Confirmation Step */}
        {step === "confirmation" && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✓</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Booking Request Submitted!</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your request has been sent to {selectedStore?.name}. They will contact you shortly to confirm.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">Pending</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reference ID:</span>
                  <span className="font-mono text-sm">#BK{Date.now().toString().slice(-6)}</span>
                </div>
              </div>
              <div className="flex gap-3 max-w-md mx-auto">
                <button onClick={() => { setStep("location"); setSelectedStore(null); setServiceType(""); setSelectedDate(""); setSelectedTime(""); setAddress(""); setPlantCount(1); setNotes(""); setUserCity(""); }}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Book Another
                </button>
                <Link to="/gardener" className="flex-1 px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors text-center">
                  Back to Home
                </Link>
              </div>
            </div>
        )}

        {toast && (
            <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
              {toast}
            </div>
        )}
      </div>
  );
}