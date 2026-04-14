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
  const [activeTab, setActiveTab] = useState<string>("stats");

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
    { id: "stats", label: "İstatistikler", icon: LucideIcons.TrendingUp },
    { id: "announcements", label: "Duyurular", icon: LucideIcons.Bell },
    { id: "lessons", label: "Dersler", icon: LucideIcons.BookOpen },
    { id: "duty", label: "Nöbetçiler", icon: LucideIcons.Shield },
    { id: "calendar", label: "Takvim", icon: LucideIcons.CalendarDays },
    { id: "departments", label: "Bölümler", icon: LucideIcons.LayoutGrid },
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
          {activeTab === "stats" && <StatsEditor data={data.stats} onUpdate={(val) => updateData("stats", val)} />}
          {activeTab === "announcements" && <AnnouncementsEditor data={data.announcements} onUpdate={(val) => updateData("announcements", val)} />}
          {activeTab === "lessons" && <LessonsEditor data={data.lessons} onUpdate={(val) => updateData("lessons", val)} />}
          {activeTab === "duty" && <DutyEditor data={data.dutyOfficers} onUpdate={(val) => updateData("dutyOfficers", val)} />}
          {activeTab === "departments" && <DepartmentsEditor data={data.departments} onUpdate={(val) => updateData("departments", val)} />}
          {activeTab === "calendar" && <CalendarEditor data={data.calendarEvents} onUpdate={(val) => updateData("calendarEvents", val)} />}
        </main>
      </div>
    </div>
  );
}

// ─── Editors ──────────────────────────────────────────────────────────────────

function StatsEditor({ data, onUpdate }: { data: StatItem[], onUpdate: (data: StatItem[]) => void }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {data.map((item, idx) => (
        <div key={item.id} className="bg-[#0c1829] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
               <LucideIcons.Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg">{item.label}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Değer</label>
              <input 
                type="text" 
                value={item.value} 
                onChange={(e) => {
                  const newData = [...data];
                  newData[idx] = { ...item, value: e.target.value };
                  onUpdate(newData);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Alt Bilgi</label>
              <input 
                type="text" 
                value={item.sub} 
                onChange={(e) => {
                  const newData = [...data];
                  newData[idx] = { ...item, sub: e.target.value };
                  onUpdate(newData);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnnouncementsEditor({ data, onUpdate }: { data: Announcement[], onUpdate: (data: Announcement[]) => void }) {
  const [newItem, setNewItem] = useState<Partial<Announcement>>({ title: "", desc: "", type: "Bilgi", icon: "📢" });

  const addItem = () => {
    if (newItem.title && newItem.desc) {
      onUpdate([...data, { ...newItem, id: Date.now().toString() } as Announcement]);
      setNewItem({ title: "", desc: "", type: "Bilgi", icon: "📢" });
    }
  };

  const removeItem = (id: string) => {
    onUpdate(data.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Add New */}
      <div className="bg-[#0c1829] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="font-bold mb-4">Yeni Duyuru Ekle</h3>
        <div className="grid grid-cols-2 gap-4">
          <input 
            placeholder="Duyuru Başlığı" 
            value={newItem.title} 
            onChange={e => setNewItem({...newItem, title: e.target.value})}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500" 
          />
          <select 
            value={newItem.type} 
            onChange={e => setNewItem({...newItem, type: e.target.value as any})}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
          >
            <option value="Önemli">Önemli</option>
            <option value="Bilgi">Bilgi</option>
            <option value="Sınav">Sınav</option>
            <option value="Etkinlik">Etkinlik</option>
          </select>
          <textarea 
            placeholder="Açıklama" 
            value={newItem.desc} 
            onChange={e => setNewItem({...newItem, desc: e.target.value})}
            className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500"
          />
          <button 
            onClick={addItem}
            className="col-span-2 bg-violet-600 hover:bg-violet-500 py-3 rounded-xl font-bold transition-all"
          >
            Ekle
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {data.map(item => (
          <div key={item.id} className="bg-[#0c1829] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            </div>
            <button onClick={() => removeItem(item.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
              <LucideIcons.Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonsEditor({ data, onUpdate }: { data: Lesson[], onUpdate: (data: Lesson[]) => void }) {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="bg-[#0c1829] border border-white/[0.06] rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Saat</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Ders</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Öğretmen</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Sınıf</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Durum</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {data.map((item, idx) => (
            <tr key={item.id}>
              <td className="px-6 py-4 text-xs font-mono text-slate-400">{item.time} - {item.end}</td>
              <td className="px-6 py-4 font-bold text-sm">
                <input 
                   className="bg-transparent border-none focus:ring-0 w-full" 
                   value={item.lesson} 
                   onChange={e => {
                     const newData = [...data];
                     newData[idx] = {...item, lesson: e.target.value};
                     onUpdate(newData);
                   }}
                />
              </td>
              <td className="px-6 py-4 text-sm text-slate-300">
                <input 
                   className="bg-transparent border-none focus:ring-0 w-full" 
                   value={item.teacher} 
                   onChange={e => {
                     const newData = [...data];
                     newData[idx] = {...item, teacher: e.target.value};
                     onUpdate(newData);
                   }}
                />
              </td>
              <td className="px-6 py-4 text-sm">
                 <input 
                   className="bg-transparent border-none focus:ring-0 w-32" 
                   value={item.class} 
                   onChange={e => {
                     const newData = [...data];
                     newData[idx] = {...item, class: e.target.value};
                     onUpdate(newData);
                   }}
                />
              </td>
              <td className="px-6 py-4">
                <select 
                  className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs"
                  value={item.status}
                  onChange={e => {
                    const newData = [...data];
                    newData[idx] = {...item, status: e.target.value as LessonStatus};
                    onUpdate(newData);
                  }}
                >
                  <option value="done">Tamamlandı</option>
                  <option value="active">Devam Ediyor</option>
                  <option value="next">Sıradaki</option>
                  <option value="upcoming">Bekliyor</option>
                </select>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => onUpdate(data.filter(li => li.id !== item.id))}
                  className="text-rose-500 hover:text-rose-400"
                >
                  <LucideIcons.Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => onUpdate([...data, { id: Date.now().toString(), time: "08:00", end: "08:45", lesson: "Yeni Ders", teacher: "-", class: "-", room: "-", status: "upcoming" }])}
          className="w-full py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold text-xs"
        >
          + Yeni Ders Ekle
        </button>
      </div>
    </div>
  );
}

function DutyEditor({ data, onUpdate }: { data: DutyOfficer[], onUpdate: (data: DutyOfficer[]) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {data.map((item, idx) => (
        <div key={item.id} className="bg-[#0c1829] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
          <div className="flex-1 space-y-3">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
                 {item.name[0]}
               </div>
               <input 
                 className="bg-transparent font-bold text-white border-none focus:ring-0 flex-1" 
                 value={item.name} 
                 onChange={e => {
                   const newData = [...data];
                   newData[idx] = {...item, name: e.target.value};
                   onUpdate(newData);
                 }}
               />
             </div>
             <div className="flex gap-4">
                <input 
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 w-full" 
                  value={item.area} 
                  onChange={e => {
                    const newData = [...data];
                    newData[idx] = {...item, area: e.target.value};
                    onUpdate(newData);
                  }}
                />
                <input 
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 w-32 font-mono" 
                  value={item.shift} 
                  onChange={e => {
                    const newData = [...data];
                    newData[idx] = {...item, shift: e.target.value};
                    onUpdate(newData);
                  }}
                />
             </div>
          </div>
          <div className="flex flex-col items-center gap-3 ml-4">
             <button 
               onClick={() => {
                 const newData = [...data];
                 newData[idx] = {...item, active: !item.active};
                 onUpdate(newData);
               }}
               className={`w-12 h-6 rounded-full relative transition-all ${item.active ? 'bg-emerald-500' : 'bg-slate-700'}`}
             >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.active ? 'left-7' : 'left-1'}`} />
             </button>
             <button onClick={() => onUpdate(data.filter(o => o.id !== item.id))} className="text-rose-500 p-2">
                <LucideIcons.XCircle className="w-5 h-5" />
             </button>
          </div>
        </div>
      ))}
      <button 
        onClick={() => onUpdate([...data, { id: Date.now().toString(), name: "Yeni Nöbetçi", area: "Görev Yeri", shift: "08:00-16:00", active: true }])}
        className="bg-white/5 border border-white/0.06 border-dashed rounded-2xl p-5 flex items-center justify-center gap-2 text-slate-500 hover:text-white hover:border-violet-500/50 transition-all font-bold"
      >
        <LucideIcons.Plus className="w-5 h-5" />
        Nöbetçi Ekle
      </button>
    </div>
  );
}

function DepartmentsEditor({ data, onUpdate }: { data: Department[], onUpdate: (data: Department[]) => void }) {
  return (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <div key={item.id} className="bg-[#0c1829] border border-white/[0.06] rounded-2xl p-6 flex gap-6">
          <div className="w-16 h-16 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
             <LucideIcons.Hexagon className="w-8 h-8 text-violet-400" />
          </div>
          <div className="flex-1 space-y-4">
             <div className="flex items-center justify-between">
               <input 
                 className="bg-transparent text-xl font-black text-white border-none focus:ring-0 w-full" 
                 value={item.name} 
                 onChange={e => {
                    const newData = [...data];
                    newData[idx] = {...item, name: e.target.value};
                    onUpdate(newData);
                 }}
               />
               <button onClick={() => onUpdate(data.filter(d => d.id !== item.id))} className="text-rose-500 p-2">
                 <LucideIcons.Trash2 className="w-5 h-5" />
               </button>
             </div>
             <textarea 
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-400 focus:outline-none focus:border-violet-500 leading-relaxed"
               rows={3}
               value={item.description}
               onChange={e => {
                  const newData = [...data];
                  newData[idx] = {...item, description: e.target.value};
                  onUpdate(newData);
               }}
             />
          </div>
        </div>
      ))}
      <button 
        onClick={() => onUpdate([...data, { id: Date.now().toString(), name: "Yeni Bölüm", description: "Bölüm açıklaması buraya gelecek.", iconName: "Monitor" }])}
        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 font-black hover:text-violet-400 hover:border-violet-500/40 transition-all"
      >
        + YENİ BÖLÜM EKLE
      </button>
    </div>
  );
}

function CalendarEditor({ data, onUpdate }: { data: CalendarEvent[], onUpdate: (data: CalendarEvent[]) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#0c1829] border border-white/[0.06] rounded-2xl p-6">
         <h3 className="font-bold mb-4">Etkinlik Listesi</h3>
         <div className="space-y-3">
            {data.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-mono">
                  {item.day} / {item.month + 1} / {item.year}
                </div>
                <input 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold" 
                  value={item.label} 
                  onChange={e => {
                    const newData = [...data];
                    newData[idx] = {...item, label: e.target.value};
                    onUpdate(newData);
                  }}
                />
                <select 
                   className="bg-black/20 border-none rounded text-[10px] font-bold uppercase"
                   value={item.color}
                   onChange={e => {
                     const newData = [...data];
                     newData[idx] = {...item, color: e.target.value as any};
                     onUpdate(newData);
                   }}
                >
                  <option value="rose">Kırmızı</option>
                  <option value="amber">Turuncu</option>
                  <option value="violet">Mor</option>
                  <option value="cyan">Mavi</option>
                </select>
                <button onClick={() => onUpdate(data.filter(e => e.id !== item.id))} className="text-rose-500">
                   <LucideIcons.Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
         </div>
      </div>
      
      <button 
        onClick={() => onUpdate([...data, { id: Date.now().toString(), day: 1, month: 2, year: 2026, label: "Yeni Etkinlik", color: "violet" }])}
        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 font-black hover:text-white transition-all"
      >
        FEN BİLGİSİ ETKİNLİĞİ EKLE
      </button>
    </div>
  );
}