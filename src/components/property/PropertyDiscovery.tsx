"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Property } from "@/lib/types";
import { PropertyCard } from "@/components/property/PropertyCard";
import Link from "next/link";

interface PropertyDiscoveryProps {
  initialProperties: Property[];
}

export function PropertyDiscovery({ initialProperties }: PropertyDiscoveryProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedPurpose, setSelectedPurpose] = useState(searchParams.get("purpose") || "all");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("type") || "all");
  const [selectedType, setSelectedType] = useState(searchParams.get("propType") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get("featured") === "true");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state with URL params when they change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const purpose = searchParams.get("purpose") || "all";
    const type = searchParams.get("type") || "all";
    const propType = searchParams.get("propType") || "";
    const location = searchParams.get("location") || "";
    const minP = searchParams.get("minPrice") || "";
    const maxP = searchParams.get("maxPrice") || "";
    const beds = searchParams.get("bedrooms") || "";
    const feat = searchParams.get("featured") === "true";

    setSearchQuery(q);
    setSelectedPurpose(purpose);
    setSelectedCategory(type);
    setSelectedType(propType);
    setSelectedLocation(location);
    setMinPrice(minP);
    setMaxPrice(maxP);
    setBedrooms(beds);
    setFeaturedOnly(feat);
  }, [searchParams]);

  // Extract unique locations from data
  const locationsList = useMemo(() => {
    const locs = new Set<string>();
    initialProperties.forEach((p) => {
      const mainLoc = p.location.split(",")[0].trim();
      if (mainLoc) locs.add(mainLoc);
    });
    return Array.from(locs).sort();
  }, [initialProperties]);

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return initialProperties
      .filter((p) => {
        // Text Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(query);
          const matchLoc = p.location.toLowerCase().includes(query);
          const matchDesc = p.shortDescription.toLowerCase().includes(query);
          if (!matchTitle && !matchLoc && !matchDesc) return false;
        }

        // Category (home vs land)
        if (selectedCategory === "home" && p.category !== "home") return false;
        if (selectedCategory === "land" && p.category !== "land") return false;

        // Purpose (sale, rent, invest, land)
        if (selectedPurpose !== "all") {
          if (selectedPurpose === "land" && p.category !== "land") return false;
          if (selectedPurpose === "sale" && p.purpose !== "sale") return false;
          if (selectedPurpose === "rent" && p.purpose !== "rent") return false;
        }

        // Property Type
        if (selectedType && p.type !== selectedType) return false;

        // Location match
        if (selectedLocation && !p.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }

        // Price range
        if (minPrice && p.price !== null && p.price < Number(minPrice)) return false;
        if (maxPrice && p.price !== null && p.price > Number(maxPrice)) return false;

        // Bedrooms
        if (bedrooms && (p.bedrooms ?? 0) < Number(bedrooms)) return false;

        // Featured
        if (featuredOnly && !p.featured) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return (a.price ?? 0) - (b.price ?? 0);
        }
        if (sortBy === "price-desc") {
          return (b.price ?? 0) - (a.price ?? 0);
        }
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Default: Featured first, then newest
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    initialProperties,
    searchQuery,
    selectedCategory,
    selectedPurpose,
    selectedType,
    selectedLocation,
    minPrice,
    maxPrice,
    bedrooms,
    featuredOnly,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPurpose("all");
    setSelectedCategory("all");
    setSelectedType("");
    setSelectedLocation("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setFeaturedOnly(false);
    router.push("/properties");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedPurpose !== "all" ||
    selectedCategory !== "all" ||
    selectedType ||
    selectedLocation ||
    minPrice ||
    maxPrice ||
    bedrooms ||
    featuredOnly;

  return (
    <div className="space-y-8">
      {/* Top Filter Bar & Search Input */}
      <div className="rounded-2xl border border-brand-sand bg-brand-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-12 md:items-center">
          {/* Search bar */}
          <div className="relative md:col-span-5">
            <label htmlFor="properties-search-input" className="sr-only">
              Search properties
            </label>
            <svg
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="properties-search-input"
              type="text"
              placeholder="Search Lekki duplex, Ikoyi, plot size, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-brand-stone/60 bg-brand-sand/10 pl-10 pr-4 py-2.5 text-sm text-brand-forest placeholder:text-brand-muted focus:border-brand-gold focus:bg-brand-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
            />
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 md:col-span-4 md:justify-center">
            {[
              { id: "all", label: "All" },
              { id: "home", label: "Homes" },
              { id: "land", label: "Land" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  selectedCategory === cat.id
                    ? "bg-brand-forest text-brand-gold-light shadow-xs"
                    : "border border-brand-stone/40 bg-brand-white text-brand-forest hover:bg-brand-sand/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort & View Mode Controls */}
          <div className="flex items-center justify-between gap-3 md:col-span-3 md:justify-end">
            <div className="flex items-center gap-2">
              {/* Grid / List Toggle */}
              <div className="hidden items-center rounded-xl border border-brand-stone/60 bg-brand-white p-0.5 sm:flex">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid View"
                  className={`rounded-lg p-1.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-brand-forest text-brand-gold-light"
                      : "text-brand-muted hover:text-brand-forest"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List View"
                  className={`rounded-lg p-1.5 transition-colors ${
                    viewMode === "list"
                      ? "bg-brand-forest text-brand-gold-light"
                      : "text-brand-muted hover:text-brand-forest"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <label htmlFor="sort-properties" className="sr-only">
                Sort Properties
              </label>
              <select
                id="sort-properties"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-xl border border-brand-stone/60 bg-brand-white px-3 py-2 text-xs font-medium text-brand-forest focus:border-brand-gold focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Mobile Filter Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-brand-forest/20 bg-brand-sand/30 px-3.5 py-2 text-xs font-semibold text-brand-forest md:hidden"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Detailed Filters Expandable Panel */}
        <div className={`mt-5 border-t border-brand-sand/60 pt-4 ${mobileFiltersOpen ? "block" : "hidden md:block"}`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Location */}
            <div>
              <label htmlFor="filter-location" className="block text-xs font-semibold text-brand-forest">
                Location / Neighborhood
              </label>
              <select
                id="filter-location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-white px-3 py-2 text-xs text-brand-forest focus:border-brand-gold focus:outline-none"
              >
                <option value="">All Locations</option>
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="filter-type" className="block text-xs font-semibold text-brand-forest">
                Property Structure
              </label>
              <select
                id="filter-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-white px-3 py-2 text-xs text-brand-forest focus:border-brand-gold focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="duplex">Duplex</option>
                <option value="apartment">Apartment</option>
                <option value="terrace">Terrace</option>
                <option value="bungalow">Bungalow</option>
                <option value="villa">Villa</option>
                <option value="residential-land">Residential Land</option>
                <option value="commercial-land">Commercial Land</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-semibold text-brand-forest">Budget Range (₦)</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-xl border border-brand-stone/60 bg-brand-white px-2.5 py-1.5 text-xs text-brand-forest focus:border-brand-gold focus:outline-none"
                />
                <span className="text-xs text-brand-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-xl border border-brand-stone/60 bg-brand-white px-2.5 py-1.5 text-xs text-brand-forest focus:border-brand-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label htmlFor="filter-bedrooms" className="block text-xs font-semibold text-brand-forest">
                Minimum Bedrooms
              </label>
              <select
                id="filter-bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-white px-3 py-2 text-xs text-brand-forest focus:border-brand-gold focus:outline-none"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1+ Bedrooms</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <p className="font-semibold text-brand-forest">
          Showing <span className="text-brand-gold-dark">{filteredProperties.length}</span> verified properties
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 font-semibold text-brand-gold-dark hover:underline"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset All Filters
          </button>
        )}
      </div>

      {/* Results Grid / List */}
      {filteredProperties.length === 0 ? (
        <div className="rounded-2xl border border-brand-sand bg-brand-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-sand/40 text-brand-forest">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="mt-4 font-serif text-xl font-semibold text-brand-forest">
            No properties match your exact criteria
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            Try adjusting your search terms or resetting filters. Our advisory desk can also source offline listings specifically tailored to your needs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={resetFilters} className="btn-secondary !px-5 !py-2.5 text-xs sm:text-sm">
              Reset Filters
            </button>
            <Link href="/consultation" className="btn-primary !px-5 !py-2.5 text-xs sm:text-sm">
              Request Sourcing Consultation
            </Link>
          </div>
        </div>
      ) : (
        <ul className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7" : "grid gap-4 grid-cols-1"}>
          {filteredProperties.map((property, index) => (
            <li key={property.id} className="list-none">
              <PropertyCard property={property} priority={index < 3} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
