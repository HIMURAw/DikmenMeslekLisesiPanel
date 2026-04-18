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
    { id: "t1", name: "Fatma BOZKUŞ", role: "Sayman", visible: true },
    { id: "t2", name: "Nazım YILDIZ", role: "Elektrik-Elektronik Teknolojisi Öğretmeni-MEB Görevlendirme", visible: true },
    { id: "t3", name: "Yasemin KOCAOĞLU ERCAN", role: "Felsefe-MEB Görevlendirme", visible: true },
    { id: "t4", name: "Esma NAMOĞLU", role: "Pazarlama ve Perakende-MEB Görevlendirme", visible: true },
    { id: "t5", name: "Burak ÖKSÜZ", role: "Beden Eğitimi Öğretmeni Görevlendirme", visible: true },
    { id: "t6", name: "Nazlı GÜZEL BALTA", role: "Konaklama ve Seyahat Hizmetleri-MEB Görevlendirme", visible: true },
    { id: "t7", name: "Merzuf Fatma SONGÜL", role: "Büro Yönetimi Öğretmeni Görevlendirme", visible: true },
    { id: "t8", name: "Nuray DİNÇER YAZAR", role: "Büro Yönetimi Öğretmeni Görevlendirme", visible: true },
    { id: "t9", name: "Bilal DEMİR", role: "Müzik Öğretmeni", visible: true },
    { id: "t10", name: "Ramazan DEMİREL", role: "Okul Müdürü", visible: true },
    { id: "t11", name: "Tamer TAŞDEMİR", role: "Müdür Yardımcısı", visible: true },
    { id: "t12", name: "Ayşe DÜZGÜN", role: "Müdür Yardımcısı", visible: true },
    { id: "t13", name: "Menekşe BAŞER", role: "Müdür Yardımcısı", visible: true },
    { id: "t14", name: "Nuri TOSUN", role: "Müdür Yardımcısı", visible: true },
    { id: "t15", name: "Ceyda KOVANCI", role: "Müdür Yardımcısı", visible: true },
    { id: "t16", name: "Mehmet YILMAZ", role: "Müdür Yardımcısı", visible: true },
    { id: "t17", name: "Ebru ÜNER", role: "Rehber Öğretmen", visible: true },
    { id: "t18", name: "Ayla ŞENER TAŞ", role: "Rehber Öğretmen", visible: true },
    { id: "t19", name: "Tuğrul ANDAÇ", role: "Rehber Öğretmen", visible: true },
    { id: "t20", name: "Kadir ÇAYAN", role: "Bilişim Teknolojileri Alan Şefi", visible: true },
    { id: "t21", name: "Esma ÖZKAN", role: "Bilişim Teknolojileri Atölye Şefi", visible: true },
    { id: "t22", name: "Esin KALAY YİĞİT", role: "Bilişim Teknolojileri Atölye Şefi", visible: true },
    { id: "t23", name: "Figen TAŞDELEN", role: "Bilişim Teknolojileri Atölye Şefi", visible: true },
    { id: "t24", name: "Fuat YÜRÜK", role: "Bilişim Teknolojileri Atölye Şefi", visible: true },
    { id: "t25", name: "Birgül AKSOYOĞLU", role: "Bilişim Teknolojileri Atölye Şefi", visible: true },
    { id: "t26", name: "Fatma GÜVEN", role: "Bilişim Teknolojileri Öğretmeni", visible: true },
    { id: "t27", name: "Ertuğrul ERDOĞDU", role: "Elektrik-Elektronik Teknolojisi Alan Şefi", visible: true },
    { id: "t28", name: "Güven HAFÇI", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi", visible: true },
    { id: "t29", name: "Kemal KILIÇ", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi", visible: true },
    { id: "t30", name: "Tolga TURGUT", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi", visible: true },
    { id: "t31", name: "Soner Cenk YÜRÜT", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi", visible: true },
    { id: "t32", name: "Serkan KALE", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi", visible: true },
    { id: "t33", name: "Nusret BÖLÜK", role: "Elektrik-Elektronik Teknolojisi Atölye Şefi", visible: true },
    { id: "t34", name: "Nazan YÜRÜT", role: "Elektrik-Elektronik Teknolojisi Öğretmeni", visible: true },
    { id: "t35", name: "Nigar Zeliha ÖZEL", role: "Elektrik-Elektronik Teknolojisi Öğretmeni", visible: true },
    { id: "t36", name: "Burhan YILDIZ", role: "Elektrik-Elektronik Teknolojisi Öğretmeni", visible: true },
    { id: "t37", name: "Ömür AYAZ", role: "Elektrik-Elektronik Teknolojisi Öğretmeni", visible: true },
    { id: "t38", name: "Kazım KARAGÖZ", role: "Elektrik-Elektronik Teknolojisi Öğretmeni", visible: true },
    { id: "t39", name: "Nevzat ÇETİNPOLAT", role: "Makine Teknolojisi Alan Şefi", visible: true },
    { id: "t40", name: "Şehmuz YÜCEDAĞ", role: "Makine Teknolojisi Atölye Şefi", visible: true },
    { id: "t41", name: "Necmi TOPÇU", role: "Makine Teknolojisi Atölye Şefi", visible: true },
    { id: "t42", name: "Doğan KÖMÜRCÜ", role: "Makine Teknolojisi Öğretmeni", visible: true },
    { id: "t43", name: "Ersin ALTUNTAŞ", role: "Makine Teknolojisi Öğretmeni", visible: true },
    { id: "t44", name: "Serap ALPAY KEVRAN", role: "Makine Teknolojisi Öğretmeni", visible: true },
    { id: "t45", name: "Nilgün DEMİRCİOĞLU", role: "Makine Teknolojisi Öğretmeni", visible: true },
    { id: "t46", name: "Esin OCAKTAN", role: "Makine Teknolojisi Öğretmeni", visible: true },
    { id: "t47", name: "Mehmet KÜÇÜK", role: "Makine Teknolojisi Öğretmeni", visible: true },
    { id: "t48", name: "Ahmet SUBAŞIAY", role: "Metal Teknolojisi Alan Şefi", visible: true },
    { id: "t49", name: "Erkan DOĞAN", role: "Metal Teknolojisi Atölye Şefi", visible: true },
    { id: "t50", name: "Salih YENER", role: "Metal Teknolojisi Atölye Şefi", visible: true },
    { id: "t51", name: "Abdülhamit ÖZ", role: "Metal Teknolojisi Öğretmeni", visible: true },
    { id: "t52", name: "Ramazan ÇAKMAK", role: "Metal Teknolojisi Öğretmeni", visible: true },
    { id: "t53", name: "Kamber GÜNEL", role: "Motorlu Araçlar Teknolojisi Alan Şefi", visible: true },
    { id: "t54", name: "Abdüsselam KORKMAZ", role: "Motorlu Araçlar Teknolojisi Atölye Şefi", visible: true },
    { id: "t55", name: "Altan YILMAZ", role: "Motorlu Araçlar Teknolojisi Öğretmeni", visible: true },
    { id: "t56", name: "Ömer ÖZTÜRK", role: "Motorlu Araçlar Teknolojisi Öğretmeni", visible: true },
    { id: "t57", name: "Özcan MUTLU", role: "Motorlu Araçlar Teknolojisi Öğretmeni", visible: true },
    { id: "t58", name: "Sevgi KAYMAKCAN", role: "Güzellik ve Saç Bakım Hizmetleri", visible: true },
    { id: "t59", name: "Ayşe BARUTLU", role: "Yiyecek İçecek Hizmetleri Öğretmeni", visible: true },
    { id: "t60", name: "Recep CEYLAN", role: "Muhasebe ve Finansman Öğretmeni", visible: true },
    { id: "t61", name: "Ayşin ÇİĞDEM ÇELİK", role: "Muhasebe ve Finansman Öğretmeni", visible: true },
    { id: "t62", name: "Sema KARATAŞ", role: "Konaklama ve Seyahat Hizmetleri", visible: true },
    { id: "t63", name: "Emine ALKAN", role: "Giyim Üretim Teknolojisi", visible: true },
    { id: "t64", name: "Metin ÇETİN", role: "Türk Dili ve Edebiyatı Öğretmeni", visible: true },
    { id: "t65", name: "Şeyda GÖKTAŞ", role: "Türk Dili ve Edebiyatı Öğretmeni", visible: true },
    { id: "t66", name: "Nergis NACİ", role: "Türk Dili ve Edebiyatı Öğretmeni", visible: true },
    { id: "t67", name: "Müslüm KABADAYI", role: "Türk Dili ve Edebiyatı Öğretmeni", visible: true },
    { id: "t68", name: "Enise KILIÇ ZENGİN", role: "Türk Dili ve Edebiyatı Öğretmeni", visible: true },
    { id: "t69", name: "Yüksel DURUSOY", role: "Türk Dili ve Edebiyatı Öğretmeni", visible: true },
    { id: "t70", name: "Tayfun USLU", role: "Türk Dili ve Edebiyatı Öğretmeni", visible: true },
    { id: "t71", name: "Birnur USLU", role: "Türk Dili ve Edebiyatı Öğretmeni", visible: true },
    { id: "t72", name: "Fadime ÇETİN", role: "Türk Dili ve Edebiyatı Öğretmeni", visible: true },
    { id: "t73", name: "Filiz TÜMER", role: "Matematik Öğretmeni", visible: true },
    { id: "t74", name: "BANU KOLAMAZ", role: "Matematik Öğretmeni", visible: true },
    { id: "t75", name: "Berrin BUÇUKOĞLU", role: "Matematik Öğretmeni", visible: true },
    { id: "t76", name: "Mukaddes SEZGİN", role: "Matematik Öğretmeni", visible: true },
    { id: "t77", name: "Yunus ÖZBEK", role: "Biyoloji Öğretmeni", visible: true },
    { id: "t78", name: "Doğu Serhat ÇELİK", role: "Kimya Öğretmeni", visible: true },
    { id: "t79", name: "Fatma ÖKTEN", role: "Fizik Öğretmeni", visible: true },
    { id: "t80", name: "Dilber ÇOBAN", role: "Yabancı Dil Öğretmeni", visible: true },
    { id: "t81", name: "Bilgen CİNASAL", role: "Yabancı Dil Öğretmeni", visible: true },
    { id: "t82", name: "Arife GÜLTEN", role: "Tarih Öğretmeni", visible: true },
    { id: "t83", name: "Abdülkadir EKE", role: "Tarih Öğretmeni", visible: true },
    { id: "t84", name: "Cengiz ERBEN", role: "Tarih Öğretmeni", visible: true },
    { id: "t85", name: "Türkan KAVUN", role: "Coğrafya Öğretmeni", visible: true },
    { id: "t86", name: "Sümeyye KÖSEOĞLU", role: "Din Kültürü ve Ahlâk Bilgisi Öğretmeni", visible: true },
    { id: "t87", name: "Büşra KARAKÜLLEOĞLU", role: "Din Kültürü ve Ahlâk Bilgisi Öğretmeni", visible: true },
    { id: "t88", name: "Rukiye CANKURT", role: "Din Kültürü ve Ahlâk Bilgisi Öğretmeni", visible: true },
  ],
  classes: ["9-A", "9-B", "10-A", "10-B", "11-A", "11-B", "12-A", "12-B"],
  logo: "",
  lessonsVisible: true,
  vicePrincipalsVisible: false,
  ataturkCornerVisible: true,
  footerText: "© 2026 Dikmen Mesleki ve Teknik Anadolu Lisesi | Eğitimde Kalitenin Adresi | Tüm Hakları Saklıdır",
  ataturkImages: ["/ataturk_portrait_premium.png"],
  ataturkInterval: 300,
  vicePrincipals: []
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