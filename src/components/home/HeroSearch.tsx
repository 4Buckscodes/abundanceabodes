"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const locations = [
  "All Locations",
  "Lekki Phase 1, Lagos",
  "Ikoyi, Lagos",
  "Victoria Island, Lagos",
  "Ibeju-Lekki, Lagos",
  "Ikeja, Lagos",
  "Epe, Lagos",
  "Ibadan, Oyo",
  "Abuja, FCT",
  "Mowe / Shimawa, Ogun",
];

const propertyTypes = [
  { label: "All Property Types", value: "" },
  { label: "Duplex", value: "duplex" },
  { label: "Apartment", value: "apartment" },
  { label: "Terrace", value: "terrace" },
  { label: "Bungalow", value: "bungalow" },
  { label: "Villa", value: "villa" },
  { label: "Residential Land", value: "residential-land" },
  { label: "Commercial Land", value: "commercial-land" },
  { label: "Estate Allocation", value: "estate-allocation" },
];

const priceRanges = [
  { label: "Any Price Range", value: "" },
  { label: "Under ₦50 Million", value: "0-50000000" },
  { label: "₦50M - ₦150M", value: "50000000-150000000" },
  { label: "₦150M - ₦300M", value: "150000000-300000000" },
  { label: "Above ₦300M", value: "300000000-999999999999" },
];

export function HeroSearch() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<"all" | "sale" | "rent" | "invest" | "land">("all");
  const [location, setLocation] = useState("All Locations");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (purpose !== "all") params.set("purpose", purpose);
    if (location !== "All Locations") params.set("location", location);
    if (type) params.set("type", type);
    if (price) {
      const [min, max] = price.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-brand-sand bg-brand-white p-4 shadow-xl sm:p-6 lg:p-7">
      {/* Purpose Tabs */}
      <div className="flex border-b border-brand-sand/60 pb-3">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {[
            { id: "all", label: "All Properties" },
            { id: "sale", label: "Buy Home" },
            { id: "rent", label: "Rent" },
            { id: "invest", label: "Invest" },
            { id: "land", label: "Buy Land" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPurpose(tab.id as typeof purpose)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                purpose === tab.id
                  ? "bg-brand-forest text-brand-gold-light shadow-xs"
                  : "text-brand-muted hover:bg-brand-sand/50 hover:text-brand-forest"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Inputs */}
      <form onSubmit={handleSearch} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Location dropdown */}
        <div>
          <label htmlFor="hero-location" className="block text-xs font-semibold text-brand-forest">
            Location
          </label>
          <select
            id="hero-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-sand/20 px-3.5 py-2.5 text-sm text-brand-forest focus:border-brand-gold focus:bg-brand-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type dropdown */}
        <div>
          <label htmlFor="hero-type" className="block text-xs font-semibold text-brand-forest">
            Property Type
          </label>
          <select
            id="hero-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-sand/20 px-3.5 py-2.5 text-sm text-brand-forest focus:border-brand-gold focus:bg-brand-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
          >
            {propertyTypes.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range dropdown */}
        <div>
          <label htmlFor="hero-price" className="block text-xs font-semibold text-brand-forest">
            Price Budget
          </label>
          <select
            id="hero-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-sand/20 px-3.5 py-2.5 text-sm text-brand-forest focus:border-brand-gold focus:bg-brand-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
          >
            {priceRanges.map((pr) => (
              <option key={pr.value} value={pr.value}>
                {pr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="btn-primary w-full justify-center !py-2.5 text-sm font-semibold shadow-md"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search Properties
          </button>
        </div>
      </form>
    </div>
  );
}
