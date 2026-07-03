"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

export default function Header() {
  const { totalItems } = useCart();
  const { t, language, toggleLanguage, dir } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (e) {
        console.error("خطأ بالبحث", e);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setShowSearchBox(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearchBox) {
      searchInputRef.current?.focus();
    }
  }, [showSearchBox]);

  const toggleSearchBox = () => {
    setShowSearchBox((prev) => !prev);
  };

  return (
    <header dir={dir} className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between min-h-[90px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px]">
        {/* يمين: السلة */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/cart" className="relative p-2" aria-label={t("aria_cart")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" className="sm:w-6 sm:h-6">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 006 17h12M9 21a1 1 0 100-2 1 1 0 000 2zM20 21a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -left-1 bg-[#d4637d] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* الوسط: اللوقو */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
        >
          <Image
            src="/logo-wordmark.png"
            alt="ورد الياسمين للهدايا"
            width={741}
            height={539}
            className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>

        {/* يسار: البحث + اللغة */}
        <div ref={containerRef} className="flex-shrink-0 flex items-center gap-1 relative">
          <button
            type="button"
            aria-label={t("aria_search")}
            onClick={toggleSearchBox}
            className="p-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" className="sm:w-[22px] sm:h-[22px]">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button
            type="button"
            aria-label={t("aria_language")}
            onClick={toggleLanguage}
            className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" className="sm:w-[22px] sm:h-[22px]">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
            </svg>
            <span className="text-[11px] font-black text-gray-600">
              {language === "ar" ? "EN" : "AR"}
            </span>
          </button>

          {/* مربع البحث المنسدل */}
          {showSearchBox && (
            <div
              className="absolute top-full mt-2 w-72 sm:w-80 max-w-[92vw] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              style={{ [dir === "rtl" ? "right" : "left"]: 0 }}
            >
              <div className="p-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  dir={dir}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                  placeholder={t("search_placeholder")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4637d] transition-colors"
                />
              </div>

              {showDropdown && (
                <div className="max-h-96 overflow-y-auto border-t border-gray-50">
                  {loading && <p className="p-4 text-sm text-gray-400 text-center">{t("searching")}</p>}
                  {!loading && results.length === 0 && (
                    <p className="p-4 text-sm text-gray-400 text-center">{t("no_results")}</p>
                  )}
                  {!loading &&
                    results.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.id}`}
                        onClick={() => {
                          setShowDropdown(false);
                          setShowSearchBox(false);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.image_url && (
                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-sm font-bold text-gray-800">{item.name}</p>
                          <p className="text-xs text-[#d4637d] font-bold">{item.price} {t("currency")}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
