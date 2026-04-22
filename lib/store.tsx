"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { SchoolData } from "@/types/dashboard";

const DEFAULT_DATA: SchoolData = {
  schoolName: "Okul Adı...",
  stats: [
    { id: "1", label: "Öğrenciler", value: "0", sub: "Yükleniyor...", iconName: "Users", gradient: "from-violet-500 to-violet-700", shadowColor: "shadow-violet-500/20", visible: true },
    { id: "2", label: "Öğretmenler", value: "0", sub: "Yükleniyor...", iconName: "GraduationCap", gradient: "from-cyan-500 to-cyan-700", shadowColor: "shadow-cyan-500/20", visible: true },
    { id: "3", label: "Sınıflar", value: "0", sub: "Yükleniyor...", iconName: "School", gradient: "from-amber-500 to-amber-700", shadowColor: "shadow-amber-500/20", visible: true },
    { id: "4", label: "Aktif Duyurular", value: "0", sub: "Yükleniyor...", iconName: "Bell", gradient: "from-rose-500 to-rose-700", shadowColor: "shadow-rose-500/20", visible: true },
  ],
  lessons: [],
  announcements: [],
  dutyOfficers: [],
  calendarEvents: [],
  departments: [],
  teachers: [],
  classes: [],
  logo: "",
  lessonsVisible: true,
  vicePrincipalsVisible: true,
  ataturkCornerVisible: true,
  footerText: "Alt bilgi buraya gelecek...",
  ataturkImages: [],
  ataturkInterval: 300,
  ataturkQuotes: [],
  vicePrincipalsAwayMessage: "Müdür yardımcılarımız şu an odalarında bulunmamaktadır.",
  vicePrincipalsAwayIntervals: [{ from: "13:00", to: "13:40" }],
  vicePrincipalsAwayFrom: "13:00",
  vicePrincipalsAwayTo: "13:40",
  vicePrincipals: []
};


interface StoreContextType {
  data: SchoolData;
  setData: (data: SchoolData) => Promise<boolean>;
  updateData: <K extends keyof SchoolData>(key: K, value: SchoolData[K]) => void;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<SchoolData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const syncToBackend = useCallback(async (newData: SchoolData): Promise<boolean> => {
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Sunucu hatası");
      }
      return true;
    } catch (e: any) {
      console.error("Sync error:", e);
      return false;
    }
  }, []);

  const fetchFromBackend = useCallback(async () => {
    try {
      const res = await fetch("/api/data");
      if (res.ok) {
        const result = await res.json();
        setDataState(result);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Fetch error:", e);
      return false;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchFromBackend();
      setIsLoading(false);
    };

    init();

    // Live refresh every 5 seconds
    const interval = setInterval(fetchFromBackend, 5000);

    // Refresh instantly when window is focused
    window.addEventListener("focus", fetchFromBackend);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", fetchFromBackend);
    };
  }, [fetchFromBackend]);

  const setData = async (newData: SchoolData): Promise<boolean> => {
    setDataState(newData);
    const success = await syncToBackend(newData);
    return success;
  };

  const updateData = <K extends keyof SchoolData>(key: K, value: SchoolData[K]) => {
    setDataState((prev: SchoolData) => {
      const newData = { ...prev, [key]: value };
      syncToBackend(newData);
      return newData;
    });
  };

  return (
    <StoreContext.Provider value={{ data, setData, updateData, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}