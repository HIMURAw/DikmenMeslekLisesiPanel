"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { SchoolData, Lesson, Announcement, DutyOfficer, StatItem, CalendarEvent, Department } from "@/types/dashboard";

const DEFAULT_DATA: SchoolData = {
  schoolName: "Dikmen Mesleki Teknik Anadolu Lisesi",
  stats: [
    { id: "1", label: "Öğrenciler", value: "1.248", sub: "Toplam Kayıtlı", iconName: "Users", gradient: "from-violet-500 to-violet-700", shadowColor: "shadow-violet-500/20" },
    { id: "2", label: "Öğretmenler", value: "86", sub: "Aktif Personel", iconName: "GraduationCap", gradient: "from-cyan-500 to-cyan-700", shadowColor: "shadow-cyan-500/20" },
    { id: "3", label: "Sınıflar", value: "42", sub: "12 Şube · 6 Bölüm", iconName: "School", gradient: "from-amber-500 to-amber-700", shadowColor: "shadow-amber-500/20" },
    { id: "4", label: "Aktif Duyurular", value: "7", sub: "2 Yeni Bugün", iconName: "Bell", gradient: "from-rose-500 to-rose-700", shadowColor: "shadow-rose-500/20" },
  ],
  lessons: [
    { id: "l1", time: "08:00", end: "08:45", lesson: "Matematik", teacher: "Ayşe Kaya", class: "11-A", room: "D201", status: "done" },
    { id: "l2", time: "08:55", end: "09:40", lesson: "Türkçe", teacher: "Mehmet Demir", class: "10-B", room: "A101", status: "done" },
    { id: "l3", time: "09:50", end: "10:35", lesson: "Fizik", teacher: "Can Arslan", class: "12-C", room: "Lab-1", status: "active" },
    { id: "l4", time: "10:45", end: "11:30", lesson: "Tarih", teacher: "Selin Çelik", class: "9-D", room: "B305", status: "next" },
    { id: "l5", time: "11:40", end: "12:25", lesson: "Kimya", teacher: "Fatma Yıldız", class: "11-B", room: "Lab-2", status: "upcoming" },
  ],
  announcements: [
    { id: "a1", title: "Veli Toplantısı", desc: "20 Mart'ta tüm veliler saat 18:00'de davetlidir.", type: "Önemli", icon: "📢", date: "2026-03-20" },
    { id: "a2", title: "Spor Salonu Bakım", desc: "15–18 Mart arası spor salonu kapalıdır.", type: "Bilgi", icon: "🏋️", date: "2026-03-15" },
    { id: "a3", title: "YKS Deneme Sınavı", desc: "22 Mart Cumartesi saat 09:00'da yapılacaktır.", type: "Sınav", icon: "📝", date: "2026-03-22" },
  ],
  dutyOfficers: [
    { id: "d1", name: "Hasan Öztürk", area: "Giriş Kapısı", shift: "08:00–12:00", active: true },
    { id: "d2", name: "Zeynep Aydın", area: "Kantin", shift: "08:00–12:00", active: true },
  ],
  calendarEvents: [
    { id: "e1", day: 20, month: 2, year: 2026, label: "Veli Toplantısı", color: "rose" },
    { id: "e2", day: 22, month: 2, year: 2026, label: "YKS Denemesi", color: "amber" },
  ],
  departments: [
    { id: "dep1", name: "Bilişim Teknolojileri", description: "Yazılım, Donanım ve Ağ sistemleri eğitimi.", iconName: "Monitor" },
    { id: "dep2", name: "Elektrik-Elektronik", description: "Endüstriyel otomasyon ve elektrik sistemleri.", iconName: "Zap" },
  ],
};

interface StoreContextType {
  data: SchoolData;
  setData: (data: SchoolData) => void;
  updateData: (key: keyof SchoolData, value: any) => void;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<SchoolData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("dikmen_mtal_data");
    if (saved) {
      try {
        setDataState(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading data from localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  const setData = (newData: SchoolData) => {
    setDataState(newData);
    localStorage.setItem("dikmen_mtal_data", JSON.stringify(newData));
  };

  const updateData = (key: keyof SchoolData, value: any) => {
    const newData = { ...data, [key]: value };
    setData(newData);
  };

  return (
    <StoreContext.Provider value= {{ data, setData, updateData, isLoading }
}>
  { children }
  </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
