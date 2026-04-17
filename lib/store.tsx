"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { SchoolData } from "@/types/dashboard";

const DEFAULT_DATA: SchoolData = {
  schoolName: "Dikmen Mesleki Teknik Anadolu Lisesi",
  stats: [
    { id: "1", label: "Öğrenciler", value: "1.248", sub: "Toplam Kayıtlı", iconName: "Users", gradient: "from-violet-500 to-violet-700", shadowColor: "shadow-violet-500/20", visible: true },
    { id: "2", label: "Öğretmenler", value: "88", sub: "Aktif Personel", iconName: "GraduationCap", gradient: "from-cyan-500 to-cyan-700", shadowColor: "shadow-cyan-500/20", visible: true },
    { id: "3", label: "Sınıflar", value: "42", sub: "12 Şube · 6 Bölüm", iconName: "School", gradient: "from-amber-500 to-amber-700", shadowColor: "shadow-amber-500/20", visible: true },
    { id: "4", label: "Aktif Duyurular", value: "7", sub: "2 Yeni Bugün", iconName: "Bell", gradient: "from-rose-500 to-rose-700", shadowColor: "shadow-rose-500/20", visible: true },
  ],
  lessons: [],
  announcements: [],
  dutyOfficers: [],
  calendarEvents: [],
  departments: [],
  teachers: [
    { id: "t1", name: "Fatma BOZKUŞ", role: "Sayman" },
    { id: "t2", name: "Nazım YILDIZ", role: "Elektrik-Elektronik Teknolojisi Öğretmeni-MEB Görevlendirme" },
    { id: "t3", name: "Yasemin KOCAOĞLU ERCAN", role: "Felsefe-MEB Görevlendirme" },
    { id: "t4", name: "Esma NAMOĞLU", role: "Pazarlama ve Perakende-MEB Görevlendirme" },
    { id: "t5", name: "Burak ÖKSÜZ", role: "Beden Eğitimi Öğretmeni Görevlendirme" },
    { id: "t6", name: "Nazlı GÜZEL BALTA", role: "Konaklama ve Seyahat Hizmetleri-MEB Görevlendirme" },
    { id: "t7", name: "Merzuf Fatma SONGÜL", role: "Büro Yönetimi Öğretmeni Görevlendirme" },
    { id: "t8", name: "Nuray DİNÇER YAZAR", role: "Büro Yönetimi Öğretmeni Görevlendirme" },
    { id: "t9", name: "Bilal DEMİR", role: "Müzik Öğretmeni" },
    { id: "t10", name: "Ramazan DEMİREL", role: "Okul Müdürü" },
    { id: "t11", name: "Tamer TAŞDEMİR", role: "Müdür Yardımcısı" },
    { id: "t12", name: "Ayşe DÜZGÜN", role: "Müdür Yardımcısı" },
    { id: "t13", name: "Menekşe BAŞER", role: "Müdür Yardımcısı" },
    { id: "t14", name: "Nuri TOSUN", role: "Müdür Yardımcısı" },
    { id: "t15", name: "Ceyda KOVANCI", role: "Müdür Yardımcısı" },
    { id: "t16", name: "Mehmet YILMAZ", role: "Müdür Yardımcısı" },
    { id: "t17", name: "Ebru ÜNER", role: "Rehber Öğretmen" },
    { id: "t18", name: "Ayla ŞENER TAŞ", role: "Rehber Öğretmen" },
    { id: "t19", name: "Tuğrul ANDAÇ", role: "Rehber Öğretmen" },
    { id: "t20", name: "Kadir ÇAYAN", role: "Bilişim Teknolojileri Alan Şefi" },
    { id: "t21", name: "Esma ÖZKAN", role: "Bilişim Teknolojileri Atölye Şefi" },
    { id: "t22", name: "Esin KALAY YİĞİT", role: "Bilişim Teknolojileri Atölye Şefi" },
    { id: "t23", name: "Figen TAŞDELEN", role: "Bilişim Teknolojileri Atölye Şefi" },
    { id: "t24", name: "Fuat YÜRÜK", role: "Bilişim Teknolojileri Atölye Şefi" },
    { id: "t25", name: "Birgül AKSOYOĞLU", role: "Bilişim Teknolojileri Atölye Şefi" },
    { id: "t26", name: "Fatma GÜVEN", role: "Bilişim Teknolojileri Öğretmeni" },
    { id: "t27", name: "Ertuğrul ERDOĞDU", role: "Elektrik-Elektronik Teknolojisi Alan Şefi" },
    { id: "t28", name: "Güven HAFÇI", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi" },
    { id: "t29", name: "Kemal KILIÇ", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi" },
    { id: "t30", name: "Tolga TURGUT", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi" },
    { id: "t31", name: "Soner Cenk YÜRÜT", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi" },
    { id: "t32", name: "Serkan KALE", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi" },
    { id: "t33", name: "Nusret BÖLÜK", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi" },
    { id: "t34", name: "Nazan YÜRÜT", role: "Elektrik-Elektronik Teknolojisi Öğretmeni" },
    { id: "t35", name: "Nigar Zeliha ÖZEL", role: "Elektrik-Elektronik Teknolojisi Öğretmeni" },
    { id: "t36", name: "Burhan YILDIZ", role: "Elektrik-Elektronik Teknolojisi Öğretmeni" },
    { id: "t37", name: "Ömür AYAZ", role: "Elektrik-Elektronik Teknolojisi Öğretmeni" },
    { id: "t38", name: "Kazım KARAGÖZ", role: "Elektrik-Elektronik Teknolojisi Öğretmeni" },
    { id: "t39", name: "Nevzat ÇETİNPOLAT", role: "Makine Teknolojisi Alan Şefi" },
    { id: "t40", name: "Şehmuz YÜCEDAĞ", role: "Makine Teknolojisi Atölye Şefi" },
    { id: "t41", name: "Necmi TOPÇU", role: "Makine Teknolojisi Atölye Şefi" },
    { id: "t42", name: "Doğan KÖMÜRCÜ", role: "Makine Teknolojisi Öğretmeni" },
    { id: "t43", name: "Ersin ALTUNTAŞ", role: "Makine Teknolojisi Öğretmeni" },
    { id: "t44", name: "Serap ALPAY KEVRAN", role: "Makine Teknolojisi Öğretmeni" },
    { id: "t45", name: "Nilgün DEMİRCİOĞLU", role: "Makine Teknolojisi Öğretmeni" },
    { id: "t46", name: "Esin OCAKTAN", role: "Makine Teknolojisi Öğretmeni" },
    { id: "t47", name: "Mehmet KÜÇÜK", role: "Makine Teknolojisi Öğretmeni" },
    { id: "t48", name: "Ahmet SUBAŞIAY", role: "Metal Teknolojisi Alan Şefi" },
    { id: "t49", name: "Erkan DOĞAN", role: "Metal Teknolojisi Atölye Şefi" },
    { id: "t50", name: "Salih YENER", role: "Metal Teknolojisi Atölye Şefi" },
    { id: "t51", name: "Abdülhamit ÖZ", role: "Metal Teknolojisi Öğretmeni" },
    { id: "t52", name: "Ramazan ÇAKMAK", role: "Metal Teknolojisi Öğretmeni" },
    { id: "t53", name: "Kamber GÜNEL", role: "Motorlu Araçlar Teknolojisi Alan Şefi" },
    { id: "t54", name: "Abdüsselam KORKMAZ", role: "Motorlu Araçlar Teknolojisi Atölye Şefi" },
    { id: "t55", name: "Altan YILMAZ", role: "Motorlu Araçlar Teknolojisi Öğretmeni" },
    { id: "t56", name: "Ömer ÖZTÜRK", role: "Motorlu Araçlar Teknolojisi Öğretmeni" },
    { id: "t57", name: "Özcan MUTLU", role: "Motorlu Araçlar Teknolojisi Öğretmeni" },
    { id: "t58", name: "Sevgi KAYMAKCAN", role: "Güzellik ve Saç Bakım Hizmetleri" },
    { id: "t59", name: "Ayşe BARUTLU", role: "Yiyecek İçecek Hizmetleri Öğretmeni" },
    { id: "t60", name: "Recep CEYLAN", role: "Muhasebe ve Finansman Öğretmeni" },
    { id: "t61", name: "Ayşin ÇİĞDEM ÇELİK", role: "Muhasebe ve Finansman Öğretmeni" },
    { id: "t62", name: "Sema KARATAŞ", role: "Konaklama ve Seyahat Hizmetleri" },
    { id: "t63", name: "Emine ALKAN", role: "Giyim Üretim Teknolojisi" },
    { id: "t64", name: "Metin ÇETİN", role: "Türk Dili ve Edebiyatı Öğretmeni" },
    { id: "t65", name: "Şeyda GÖKTAŞ", role: "Türk Dili ve Edebiyatı Öğretmeni" },
    { id: "t66", name: "Nergis NACİ", role: "Türk Dili ve Edebiyatı Öğretmeni" },
    { id: "t67", name: "Müslüm KABADAYI", role: "Türk Dili ve Edebiyatı Öğretmeni" },
    { id: "t68", name: "Enise KILIÇ ZENGİN", role: "Türk Dili ve Edebiyatı Öğretmeni" },
    { id: "t69", name: "Yüksel DURUSOY", role: "Türk Dili ve Edebiyatı Öğretmeni" },
    { id: "t70", name: "Tayfun USLU", role: "Türk Dili ve Edebiyatı Öğretmeni" },
    { id: "t71", name: "Birnur USLU", role: "Türk Dili ve Edebiyatı Öğretmeni" },
    { id: "t72", name: "Fadime ÇETİN", role: "Türk Dili ve Edebiyatı Öğretmeni" },
    { id: "t73", name: "Filiz TÜMER", role: "Matematik Öğretmeni" },
    { id: "t74", name: "BANU KOLAMAZ", role: "Matematik Öğretmeni" },
    { id: "t75", name: "Berrin BUÇUKOĞLU", role: "Matematik Öğretmeni" },
    { id: "t76", name: "Mukaddes SEZGİN", role: "Matematik Öğretmeni" },
    { id: "t77", name: "Yunus ÖZBEK", role: "Biyoloji Öğretmeni" },
    { id: "t78", name: "Doğu Serhat ÇELİK", role: "Kimya Öğretmeni" },
    { id: "t79", name: "Fatma ÖKTEN", role: "Fizik Öğretmeni" },
    { id: "t80", name: "Dilber ÇOBAN", role: "Yabancı Dil Öğretmeni" },
    { id: "t81", name: "Bilgen CİNASAL", role: "Yabancı Dil Öğretmeni" },
    { id: "t82", name: "Arife GÜLTEN", role: "Tarih Öğretmeni" },
    { id: "t83", name: "Abdülkadir EKE", role: "Tarih Öğretmeni" },
    { id: "t84", name: "Cengiz ERBEN", role: "Tarih Öğretmeni" },
    { id: "t85", name: "Türkan KAVUN", role: "Coğrafya Öğretmeni" },
    { id: "t86", name: "Sümeyye KÖSEOĞLU", role: "Din Kültürü ve Ahlâk Bilgisi Öğretmeni" },
    { id: "t87", name: "Büşra KARAKÜLLEOĞLU", role: "Din Kültürü ve Ahlâk Bilgisi Öğretmeni" },
    { id: "t88", name: "Rukiye CANKURT", role: "Din Kültürü ve Ahlâk Bilgisi Öğretmeni" },
  ],
  classes: ["9-A", "9-B", "10-A", "10-B", "11-A", "11-B", "12-A", "12-B"],
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
        const parsed = JSON.parse(saved);
        setDataState({ ...DEFAULT_DATA, ...parsed });
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