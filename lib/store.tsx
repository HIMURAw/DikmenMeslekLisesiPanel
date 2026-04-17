"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { SchoolData } from "@/types/dashboard";

const DEFAULT_DATA: SchoolData = {
  schoolName: "Dikmen Mesleki Teknik Anadolu Lisesi",
  stats: [
    { id: "1", label: "Öğrenciler", value: "1.248", sub: "Toplam Kayıtlı", iconName: "Users", gradient: "from-violet-500 to-violet-700", shadowColor: "shadow-violet-500/20" },
    { id: "2", label: "Öğretmenler", value: "86", sub: "Aktif Personel", iconName: "GraduationCap", gradient: "from-cyan-500 to-cyan-700", shadowColor: "shadow-cyan-500/20" },
    { id: "3", label: "Sınıflar", value: "42", sub: "12 Şube · 6 Bölüm", iconName: "School", gradient: "from-amber-500 to-amber-700", shadowColor: "shadow-amber-500/20" },
    { id: "4", label: "Aktif Duyurular", value: "7", sub: "2 Yeni Bugün", iconName: "Bell", gradient: "from-rose-500 to-rose-700", shadowColor: "shadow-rose-500/20" },
  ],
  lessons: [],
  announcements: [],
  dutyOfficers: [],
  calendarEvents: [],
  departments: [],
};

interface StoreContextType {
  data: SchoolData;
  setData: (data: SchoolData) => void;
  updateData: <K extends keyof SchoolData>(key: K, value: SchoolData[K]) => void;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<SchoolData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("dikmen_mtal_data");

    if (saved) {
      try {
        setDataState(JSON.parse(saved));
      } catch (e) {
        console.error("LocalStorage parse hatası:", e);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("dikmen_mtal_data", JSON.stringify(data));
    }
  }, [data, isLoading]);

  const setData = (newData: SchoolData) => {
    setDataState(newData);
  };

  const updateData = <K extends keyof SchoolData>(key: K, value: SchoolData[K]) => {
    setDataState((prev: SchoolData) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <StoreContext.Provider value={{ data, setData, updateData, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return context;
}