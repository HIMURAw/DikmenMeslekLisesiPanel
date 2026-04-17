"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import * as LucideIcons from "lucide-react";
import { 
  Announcement, 
  Lesson, 
  DutyOfficer, 
  StatItem, 
  CalendarEvent, 
  Department,
  Teacher,
  LessonStatus
} from "@/types/dashboard";

// ─── Login Component ──────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "utku0655") {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07101e] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0c1829] border border-white/[0.06] rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center shadow-xl mb-4">
            <LucideIcons.ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Yönetim Paneli</h1>
          <p className="text-slate-500 text-sm mt-1">Lütfen devam etmek için şifreyi girin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-white/[0.03] border ${error ? 'border-rose-500' : 'border-white/[0.08]'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-all`}
                placeholder="••••••••"
                autoFocus
              />
              {error && <LucideIcons.AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-rose-500 animate-bounce" />}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-600/20 transition-all active:scale-[0.98]"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Admin Content ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data, updateData, isLoading } = useStore();
  const [activeTab, setActiveTab] = useState<string>("general");

  // Check session
  useEffect(() => {
    const session = sessionStorage.getItem("admin_session");
    if (session === "true") setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem("admin_session", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_session");
  };

  if (isLoading) return null;
  if (!isLoggedIn) return <AdminLogin onLogin={handleLogin} />;

  const tabs = [
    { id: "general", label: "Genel", icon: LucideIcons.Settings },
    { id: "stats", label: "İstatistikler", icon: LucideIcons.BarChart3 },
    { id: "lessons", label: "Ders Programı", icon: LucideIcons.BookOpen },
    { id: "classes", label: "Sınıflar", icon: LucideIcons.Hash },
    { id: "announcements", label: "Duyurular", icon: LucideIcons.Megaphone },
    { id: "duty", label: "Nöbetçiler", icon: LucideIcons.ShieldCheck },
    { id: "calendar", label: "Etkinlik Takvimi", icon: LucideIcons.CalendarDays },
    { id: "departments", label: "Bölümlerimiz", icon: LucideIcons.LayoutGrid },
    { id: "teachers", label: "Öğretmenler", icon: LucideIcons.GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#07101e] text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-[#0c1829] border-r border-white/[0.06] flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <LucideIcons.School className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-sm leading-none">Dikmen MTAL</h2>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Admin Paneli</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm font-bold">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all font-bold text-sm"
          >
            <LucideIcons.LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p className="text-slate-500 text-sm mt-1">Okul verilerini buradan güncelleyebilirsiniz.</p>
          </div>
          <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">
            <LucideIcons.ExternalLink className="w-4 h-4" />
            Siteyi Görüntüle
          </a>
        </header>

        <main className="space-y-6">
          {activeTab === "general" && <GeneralEditor schoolName={data.schoolName} onUpdate={(val) => updateData("schoolName", val)} />}
          {activeTab === "stats" && <StatsEditor data={data.stats || []} onUpdate={(val) => updateData("stats", val)} />}
          {activeTab === "announcements" && <AnnouncementsEditor data={data.announcements || []} onUpdate={(val) => updateData("announcements", val)} />}
          {activeTab === "lessons" && <LessonsEditor data={data.lessons || []} onUpdate={(val) => updateData("lessons", val)} />}
          {activeTab === "classes" && <ClassesEditor data={data.classes || []} onUpdate={(val) => updateData("classes", val)} />}
          {activeTab === "duty" && <DutyEditor data={data.dutyOfficers || []} onUpdate={(val) => updateData("dutyOfficers", val)} />}
          {activeTab === "departments" && <DepartmentsEditor data={data.departments || []} onUpdate={(val) => updateData("departments", val)} />}
          {activeTab === "calendar" && <CalendarEditor data={data.calendarEvents || []} onUpdate={(val) => updateData("calendarEvents", val)} />}
          {activeTab === "teachers" && <TeachersEditor data={data.teachers || []} onUpdate={(val) => updateData("teachers", val)} />}
        </main>
      </div>
    </div>
  );
}

// ─── Editors ──────────────────────────────────────────────────────────────────

function GeneralEditor({ schoolName, onUpdate }: { schoolName: string, onUpdate: (val: string) => void }) {
  return (
    <div className="bg-[#0c1829] border border-white/[0.06] rounded-3xl p-8 max-w-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[100px] -mr-32 -mt-32" />
      <h3 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
        <LucideIcons.Settings className="w-5 h-5 text-violet-500" />
        Okul Ayarları
      </h3>
      <div className="space-y-4 relative z-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Okul Adı</label>
          <input 
            value={schoolName}
            onChange={e => onUpdate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-violet-500 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function StatsEditor({ data, onUpdate }: { data: StatItem[], onUpdate: (data: StatItem[]) => void }) {
  const gradients = [
    { label: "Mor", value: "from-violet-500 to-violet-700", shadow: "shadow-violet-500/20" },
    { label: "Mavi", value: "from-cyan-500 to-cyan-700", shadow: "shadow-cyan-500/20" },
    { label: "Turuncu", value: "from-amber-500 to-amber-700", shadow: "shadow-amber-500/20" },
    { label: "Kırmızı", value: "from-rose-500 to-rose-700", shadow: "shadow-rose-500/20" },
    { label: "Yeşil", value: "from-emerald-500 to-emerald-700", shadow: "shadow-emerald-500/20" },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {data.map((item, idx) => (
        <div key={item.id} className={`bg-[#0c1829] border border-white/[0.06] rounded-3xl p-6 space-y-5 shadow-xl relative overflow-hidden group transition-all ${!item.visible ? 'opacity-40 grayscale' : ''}`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-[0.02] pointer-events-none`} />
          
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                 <LucideIcons.Activity className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <input 
                  className="bg-transparent font-black text-xl text-white border-none focus:ring-0 p-0 w-full" 
                  value={item.label} 
                  onChange={e => {
                    const newData = [...data];
                    newData[idx] = { ...item, label: e.target.value };
                    onUpdate(newData);
                  }}
                />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">İstatistik Başlığı</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const newData = [...data];
                newData[idx] = { ...item, visible: !item.visible };
                onUpdate(newData);
              }}
              className={`p-2 rounded-xl transition-all ${item.visible ? 'text-violet-400 bg-violet-400/10' : 'text-slate-600 bg-white/5'}`}
            >
              {item.visible ? <LucideIcons.Eye className="w-5 h-5" /> : <LucideIcons.EyeOff className="w-5 h-5" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Değer</label>
              <input 
                type="text" 
                value={item.value} 
                onChange={(e) => {
                  const newData = [...data];
                  newData[idx] = { ...item, value: e.target.value };
                  onUpdate(newData);
                }}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white font-black text-lg focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Alt Bilgi</label>
              <input 
                type="text" 
                value={item.sub} 
                onChange={(e) => {
                  const newData = [...data];
                  newData[idx] = { ...item, sub: e.target.value };
                  onUpdate(newData);
                }}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 relative z-10">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">İkon (Lucide)</label>
                <input 
                  type="text" 
                  value={item.iconName} 
                  onChange={(e) => {
                    const newData = [...data];
                    newData[idx] = { ...item, iconName: e.target.value };
                    onUpdate(newData);
                  }}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none focus:border-violet-500 font-mono"
                  placeholder="örn: Users, Bell..."
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Renk Teması</label>
                <select 
                  value={item.gradient}
                  onChange={(e) => {
                    const selected = gradients.find(g => g.value === e.target.value);
                    if (selected) {
                      const newData = [...data];
                      newData[idx] = { ...item, gradient: selected.value, shadowColor: selected.shadow };
                      onUpdate(newData);
                    }
                  }}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none focus:border-violet-500"
                >
                  {gradients.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const VOCATIONAL_LESSONS = [
  "Bilişim Teknolojileri Temelleri", "Programlama Temelleri", "Web Tasarım ve Programlama", 
  "Robotik ve Kodlama", "Grafik ve Animasyon", "Veritabanı Yönetimi", "Nesne Tabanlı Programlama", 
  "Elektrik-Elektronik Esasları", "Ölçme Tekniği ve Laboratuvar", "Bilgisayarlı Destekli Tasarım", 
  "Endüstriyel Kontrol Sistemleri", "Zayıf Akım Tesisleri", "Elektrik Makineleri ve Kontrol", 
  "Makine Teknolojisi", "Teknik Resim", "Temel İmalat İşlemleri", "Bilgisayarlı Makine İmalatı", 
  "Metal Teknolojisi", "Kaynak Teknolojisi", "Motorlu Araçlar Teknolojisi", "Araç Teknolojisi", 
  "Muhasebe ve Finansman", "Ofis Uygulamaları", "Pazarlama ve Perakende", "Güzellik ve Saç Bakım Hizmetleri", 
  "Yiyecek İçecek Hizmetleri", "Konaklama ve Seyahat Hizmetleri", "Türk Dili ve Edebiyatı", 
  "Matematik", "Fizik", "Kimya", "Biyoloji", "Tarih", "Coğrafya", "Felsefe", "Yabancı Dil (İngilizce)", 
  "Din Kültürü ve Ahlâk Bilgisi", "Beden Eğitimi ve Spor", "Görsel Sanatlar / Müzik", "Rehberlik"
];

function LessonsEditor({ data, onUpdate }: { data: Lesson[], onUpdate: (data: Lesson[]) => void }) {
  const { data: storeData } = useStore();

  return (
    <div className="bg-[#0c1829] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
      <table className="w-full text-left">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Saat</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ders</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Öğretmen</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Sınıf</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Durum / İşlem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {data.map((item, idx) => (
            <tr key={item.id} className={`hover:bg-white/[0.02] transition-colors group ${!item.visible ? 'opacity-40 grayscale' : ''}`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <input type="time" className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white" value={item.time} onChange={e => {
                    const newData = [...data]; newData[idx] = {...item, time: e.target.value}; onUpdate(newData);
                  }} />
                  <input type="time" className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-400" value={item.end} onChange={e => {
                    const newData = [...data]; newData[idx] = {...item, end: e.target.value}; onUpdate(newData);
                  }} />
                </div>
              </td>
              <td className="px-6 py-4">
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none" value={item.lesson} onChange={e => {
                  const newData = [...data]; newData[idx] = {...item, lesson: e.target.value}; onUpdate(newData);
                }}>
                  <option value="">Ders Seçin...</option>
                  {VOCATIONAL_LESSONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </td>
              <td className="px-6 py-4">
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none" value={item.teacher} onChange={e => {
                  const newData = [...data]; newData[idx] = {...item, teacher: e.target.value}; onUpdate(newData);
                }}>
                  <option value="">Öğretmen Seçin...</option>
                  {(storeData.teachers || []).map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </td>
              <td className="px-6 py-4">
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none" value={item.class} onChange={e => {
                  const newData = [...data]; newData[idx] = {...item, class: e.target.value}; onUpdate(newData);
                }}>
                  <option value="">Sınıf Seçin...</option>
                  {(storeData.classes || []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => {
                    const newData = [...data]; newData[idx] = { ...item, visible: !item.visible }; onUpdate(newData);
                  }} className={`p-2 rounded-lg transition-all ${item.visible ? 'text-violet-400 bg-violet-400/10' : 'text-slate-600 bg-white/5'}`}>
                    {item.visible ? <LucideIcons.Eye className="w-4 h-4" /> : <LucideIcons.EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => onUpdate(data.filter(li => li.id !== item.id))} className="p-2 text-rose-500/30 hover:text-rose-500 transition-all">
                    <LucideIcons.Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 bg-white/5 border-t border-white/10 flex justify-center">
        <button onClick={() => onUpdate([...data, { id: Date.now().toString(), time: "08:15", end: "08:55", lesson: "", teacher: "", class: "", room: "Derslik", status: "upcoming", visible: true }])} className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg">
          + Yeni Ders Satırı Ekle
        </button>
      </div>
    </div>
  );
}

function ClassesEditor({ data, onUpdate }: { data: string[], onUpdate: (data: string[]) => void }) {
  const [newClass, setNewClass] = useState("");
  const addClass = () => { if (newClass && !data.includes(newClass)) { onUpdate([...data, newClass].sort()); setNewClass(""); } };

  return (
    <div className="space-y-6">
      <div className="bg-[#0c1829] border border-white/[0.06] rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-pink-600" />
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500"><LucideIcons.Hash className="w-8 h-8" /></div>
        <div className="text-center">
          <h2 className="text-xl font-black text-white">Sınıf Listesi Yönetimi</h2>
          <p className="text-slate-500 text-xs mt-1">Ektediğiniz sınıflar ders programında seçenek olarak görünecektir.</p>
        </div>
        <div className="flex w-full max-w-md gap-2">
          <input placeholder="Örn: 9-A, 10-C Bilişim..." value={newClass} onChange={e => setNewClass(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white outline-none font-bold" />
          <button onClick={addClass} className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase transition-all">Ekle</button>
        </div>
        <div className="w-full grid grid-cols-4 gap-4 pt-6 border-t border-white/5">
          {data.map((c, idx) => (
            <div key={idx} className="group flex items-center justify-between bg-white/[0.03] border border-white/5 px-4 py-3 rounded-xl hover:border-violet-500/30 transition-all">
              <span className="text-sm font-black text-slate-200">{c}</span>
              <button onClick={() => onUpdate(data.filter(item => item !== c))} className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><LucideIcons.XCircle className="w-4 h-4" /></button>
            </div>
          ))}
          {data.length === 0 && <div className="col-span-4 py-12 text-center text-slate-600 font-bold uppercase tracking-widest opacity-40 text-xs">Henüz sınıf tanımlanmadı</div>}
        </div>
      </div>
    </div>
  );
}

function DutyEditor({ data, onUpdate }: { data: DutyOfficer[], onUpdate: (data: DutyOfficer[]) => void }) {
  const getLocalDateString = (date: Date = new Date()) => { 
    const year = date.getFullYear(); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`; 
  };
  const today = getLocalDateString();
  const [selectedDate, setSelectedDate] = useState(today);
  const filteredData = data.filter(item => item.date === selectedDate);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Planlanacak Tarihi Seç</label>
          <div className="flex items-center gap-3">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-[#0c1829] border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-violet-500 outline-none" />
            {selectedDate !== today && <button onClick={() => setSelectedDate(today)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">Bugüne Dön</button>}
          </div>
        </div>
        <button onClick={() => onUpdate([...data, { id: Date.now().toString(), name: "Yeni Nöbetçi", area: "Görev Yeri", shift: "08:00-16:00", active: true, visible: true, date: selectedDate }])} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase transition-all shadow-lg flex items-center gap-2">
          <LucideIcons.UserPlus className="w-4 h-4" /> Nöbetçi Ekle
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredData.map((item) => {
          const originalIndex = data.findIndex(d => d.id === item.id);
          return (
            <div key={item.id} className={`bg-[#0c1829] border border-white/[0.06] rounded-3xl p-6 flex items-center justify-between shadow-xl transition-all ${!item.visible ? 'opacity-40 grayscale' : 'hover:border-white/10'}`}>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xl shrink-0">{item.name[0]}</div>
                  <div className="flex-1">
                    <input className="bg-transparent font-black text-lg text-white border-none focus:ring-0 p-0 w-full" value={item.name} onChange={e => {
                      const newData = [...data]; newData[originalIndex] = {...item, name: e.target.value}; onUpdate(newData);
                    }} />
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Görevli Adı</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-300 w-full font-bold outline-none" value={item.area} onChange={e => {
                    const newData = [...data]; newData[originalIndex] = {...item, area: e.target.value}; onUpdate(newData);
                  }} />
                  <input className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-300 w-full font-mono outline-none" value={item.shift} onChange={e => {
                    const newData = [...data]; newData[originalIndex] = {...item, shift: e.target.value}; onUpdate(newData);
                  }} />
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 ml-6 pl-6 border-l border-white/5">
                <button onClick={() => { const newData = [...data]; newData[originalIndex] = { ...item, visible: !item.visible }; onUpdate(newData); }} className={`p-2 rounded-xl transition-all ${item.visible ? 'text-violet-400 bg-violet-400/10' : 'text-slate-600 bg-white/5'}`}>
                  {item.visible ? <LucideIcons.Eye className="w-5 h-5" /> : <LucideIcons.EyeOff className="w-5 h-5" />}
                </button>
                <button onClick={() => { const newData = [...data]; newData[originalIndex] = {...item, active: !item.active}; onUpdate(newData); }} className={`w-12 h-6 rounded-full relative transition-all ${item.active ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${item.active ? 'left-6' : 'left-1'}`} />
                </button>
                <button onClick={() => onUpdate(data.filter(o => o.id !== item.id))} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><LucideIcons.Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnnouncementsEditor({ data, onUpdate }: { data: Announcement[], onUpdate: (data: Announcement[]) => void }) {
  const [newItem, setNewItem] = useState({ title: "", desc: "", type: "Bilgi" as any });
  const addItem = () => { if (newItem.title && newItem.desc) { onUpdate([{ ...newItem, id: Date.now().toString(), date: new Date().toISOString(), icon: "📢", visible: true } as Announcement, ...data]); setNewItem({ title: "", desc: "", type: "Bilgi" }); } };

  return (
    <div className="space-y-6">
      <div className="bg-[#0c1829] border border-white/[0.06] rounded-3xl p-8 space-y-6 shadow-2xl">
        <h3 className="text-xl font-black text-white flex items-center gap-2"><LucideIcons.Megaphone className="w-6 h-6 text-violet-500" /> Yeni Duyuru Ekle</h3>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Duyuru Başlığı" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none font-bold" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
          <select className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value as any})}><option value="Bilgi">Bilgi</option><option value="Önemli">Önemli</option><option value="Sınav">Sınav</option><option value="Etkinlik">Etkinlik</option></select>
          <textarea placeholder="Duyuru Detayı..." className="col-span-2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none h-32" value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})} />
          <button onClick={addItem} className="col-span-2 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase py-4 rounded-2xl shadow-lg transition-all">Duyuruyu Yayınla</button>
        </div>
      </div>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={item.id} className={`bg-[#0c1829] border border-white/[0.06] rounded-2xl p-6 flex items-center justify-between group transition-all ${!item.visible ? 'opacity-40 grayscale' : 'hover:border-white/10'}`}>
            <div className="flex-1">
              <input className="bg-transparent font-bold text-lg text-white border-none focus:ring-0 p-0 w-full" value={item.title} onChange={e => { const newData = [...data]; newData[idx] = {...item, title: e.target.value}; onUpdate(newData); }} />
              <input className="bg-transparent text-sm text-slate-500 border-none focus:ring-0 p-0 w-full" value={item.desc} onChange={e => { const newData = [...data]; newData[idx] = {...item, desc: e.target.value}; onUpdate(newData); }} />
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={() => { const newData = [...data]; newData[idx] = { ...item, visible: !item.visible }; onUpdate(newData); }} className={`p-2 rounded-xl transition-all ${item.visible ? 'text-violet-400 bg-violet-400/10' : 'text-slate-600 bg-white/5'}`}><LucideIcons.Eye className="w-5 h-5" /></button>
              <button onClick={() => onUpdate(data.filter(a => a.id !== item.id))} className="p-2 text-rose-500/30 hover:text-rose-500 transition-all"><LucideIcons.Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepartmentsEditor({ data, onUpdate }: { data: Department[], onUpdate: (data: Department[]) => void }) {
  return (
    <div className="space-y-6">
      {data.map((item, idx) => (
        <div key={item.id} className={`bg-[#0c1829] border border-white/[0.06] rounded-[2rem] p-8 flex gap-8 items-start transition-all ${!item.visible ? 'opacity-40 grayscale' : 'hover:border-white/10'}`}>
          <div className="w-20 h-20 rounded-3xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0 border border-violet-500/20"><LucideIcons.LayoutGrid className="w-10 h-10" /></div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <input className="bg-transparent font-black text-2xl text-white border-none focus:ring-0 p-0 w-full" value={item.name} onChange={e => { const newData = [...data]; newData[idx] = {...item, name: e.target.value}; onUpdate(newData); }} />
              <div className="flex items-center gap-2">
                <button onClick={() => { const newData = [...data]; newData[idx] = { ...item, visible: !item.visible }; onUpdate(newData); }} className={`p-2 rounded-xl transition-all ${item.visible ? 'text-violet-400 bg-violet-400/10' : 'text-slate-600 bg-white/5'}`}><LucideIcons.Eye className="w-5 h-5" /></button>
                <button onClick={() => onUpdate(data.filter(d => d.id !== item.id))} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><LucideIcons.Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
            <textarea className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full text-slate-400 outline-none" rows={3} value={item.description} onChange={e => { const newData = [...data]; newData[idx] = {...item, description: e.target.value}; onUpdate(newData); }} />
          </div>
        </div>
      ))}
      <button onClick={() => onUpdate([...data, { id: Date.now().toString(), name: "Yeni Bölüm", description: "Bölüm açıklaması...", iconName: "Layout", visible: true }])} className="w-full py-6 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-500 font-black hover:text-white hover:border-violet-500/50 transition-all uppercase tracking-widest text-sm">+ YENİ BÖLÜM EKLE</button>
    </div>
  );
}

function CalendarEditor({ data, onUpdate }: { data: CalendarEvent[], onUpdate: (data: CalendarEvent[]) => void }) {
  return (
    <div className="bg-[#0c1829] border border-white/[0.06] rounded-3xl p-8 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2"><LucideIcons.CalendarDays className="w-6 h-6 text-violet-500" /> Yıllık Etkinlikler</h3>
        <button onClick={() => { const today = new Date(); onUpdate([...data, { id: Date.now().toString(), day: today.getDate(), month: today.getMonth(), year: today.getFullYear(), label: "Yeni Etkinlik", color: "violet", visible: true }]); }} className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase transition-all">Yeni Ekle</button>
      </div>
      <div className="space-y-3">
        {data.map((item, idx) => {
          const dateVal = `${item.year}-${String(item.month+1).padStart(2,'0')}-${String(item.day).padStart(2,'0')}`;
          return (
            <div key={item.id} className={`flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl transition-all ${!item.visible ? 'opacity-40 grayscale' : 'hover:border-white/10'}`}>
              <input type="date" className="bg-[#07101e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none" value={dateVal} onChange={e => {
                const [y, m, d] = e.target.value.split('-').map(Number);
                const newData = [...data]; newData[idx] = { ...item, year: y, month: m-1, day: d }; onUpdate(newData);
              }} />
              <input className="flex-1 bg-transparent font-bold text-white border-none focus:ring-0 p-0" value={item.label} onChange={e => { const newData = [...data]; newData[idx] = { ...item, label: e.target.value }; onUpdate(newData); }} />
              <div className="flex items-center gap-2">
                <button onClick={() => { const newData = [...data]; newData[idx] = { ...item, visible: !item.visible }; onUpdate(newData); }} className={`p-2 rounded-xl transition-all ${item.visible ? 'text-violet-400 bg-violet-400/10' : 'text-slate-600 bg-white/5'}`}><LucideIcons.Eye className="w-4 h-4" /></button>
                <button onClick={() => onUpdate(data.filter(e => e.id !== item.id))} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><LucideIcons.Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeachersEditor({ data, onUpdate }: { data: Teacher[], onUpdate: (data: Teacher[]) => void }) {
  const [search, setSearch] = useState("");
  const [newTeacher, setNewTeacher] = useState({ name: "", role: "" });
  const filtered = data.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.role.toLowerCase().includes(search.toLowerCase()));
  const add = () => { if (newTeacher.name && newTeacher.role) { onUpdate([{ ...newTeacher, id: Date.now().toString(), visible: true }, ...data]); setNewTeacher({ name: "", role: "" }); } };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#0c1829] border border-white/[0.06] rounded-3xl p-6 space-y-4 shadow-xl">
           <h3 className="font-bold flex items-center gap-2"><LucideIcons.Search className="w-4 h-4 text-violet-500" /> Öğretmen Ara</h3>
           <input placeholder="İsim veya branş..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white outline-none" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="bg-[#0c1829] border border-white/[0.06] rounded-3xl p-6 space-y-4 shadow-xl">
           <h3 className="font-bold flex items-center gap-2"><LucideIcons.UserPlus className="w-4 h-4 text-emerald-500" /> Yeni Kayıt</h3>
           <div className="flex gap-2">
             <input placeholder="Ad Soyad" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
             <input placeholder="Branş" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" value={newTeacher.role} onChange={e => setNewTeacher({...newTeacher, role: e.target.value})} />
             <button onClick={add} className="bg-emerald-600 hover:bg-emerald-500 p-3 rounded-xl transition-all"><LucideIcons.Check className="w-5 h-5 text-white" /></button>
           </div>
        </div>
      </div>
      <div className="bg-[#0c1829] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Öğretmen Bilgisi</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Durum / İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((item, idx) => (
              <tr key={item.id} className={`hover:bg-white/[0.02] transition-colors group ${!item.visible ? 'opacity-40 grayscale' : ''}`}>
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-black">{item.name[0]}</div>
                  <div>
                    <input className="bg-transparent font-bold text-white border-none focus:ring-0 p-0 w-full" value={item.name} onChange={e => {
                      const newData = [...data]; const realIdx = data.findIndex(t => t.id === item.id); newData[realIdx] = {...item, name: e.target.value}; onUpdate(newData);
                    }} />
                    <input className="bg-transparent text-xs text-slate-500 border-none focus:ring-0 p-0 w-full" value={item.role} onChange={e => {
                      const newData = [...data]; const realIdx = data.findIndex(t => t.id === item.id); newData[realIdx] = {...item, role: e.target.value}; onUpdate(newData);
                    }} />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-right">
                    <button onClick={() => { const newData = [...data]; const realIdx = data.findIndex(t => t.id === item.id); newData[realIdx] = { ...item, visible: !item.visible }; onUpdate(newData); }} className={`p-2 rounded-xl transition-all ${item.visible ? 'text-violet-400 bg-violet-400/10' : 'text-slate-600 bg-white/5'}`}><LucideIcons.Eye className="w-5 h-5" /></button>
                    <button onClick={() => onUpdate(data.filter(t => t.id !== item.id))} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><LucideIcons.Trash2 className="w-5 h-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}