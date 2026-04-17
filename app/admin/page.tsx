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
          {activeTab === "general" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header Card */}
              <div className="bg-[#0c1829] border border-white/[0.06] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[100px] -mr-32 -mt-32" />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                    <LucideIcons.Settings className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Genel Ayarlar & Özet</h2>
                </div>
                
                <div className="grid grid-cols-3 gap-8 items-start">
                  <div className="col-span-2 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Okul Tam Adı</label>
                      <input 
                        type="text" 
                        value={data.schoolName}
                        onChange={(e) => updateData("schoolName", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xl focus:outline-none focus:border-pink-500 transition-all shadow-inner"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Panel Durumu</p>
                        <p className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Sistem Aktif
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Veri Kaynak</p>
                        <p className="text-sm font-bold text-slate-300">Yerel Depolama (Live)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-white/10 rounded-3xl p-6 space-y-4">
                    <h3 className="font-black text-white uppercase tracking-wider text-[11px] opacity-60">İstatistik Özeti</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Duyurular</span>
                        <span className="text-xs font-black text-white">{data.announcements.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Nöbetçiler</span>
                        <span className="text-xs font-black text-white">{data.dutyOfficers.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Dersler</span>
                        <span className="text-xs font-black text-white">{data.lessons.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Öğretmenler</span>
                        <span className="text-xs font-black text-white">{data.teachers.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick View Content */}
              <div className="grid grid-cols-2 gap-6">
                {/* Active Announcements */}
                <div className="bg-[#0c1829] border border-white/[0.06] rounded-[2rem] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
                      <LucideIcons.Bell className="w-4 h-4 text-rose-500" />
                      Son Duyurular
                    </h3>
                    <button onClick={() => setActiveTab("announcements")} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors">Yönet</button>
                  </div>
                  <div className="space-y-3">
                    {data.announcements.slice(0, 3).map(a => (
                      <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-slate-400">📢</div>
                        <p className="text-xs font-bold text-slate-300 truncate">{a.title}</p>
                      </div>
                    ))}
                    {data.announcements.length === 0 && <p className="text-[10px] text-slate-600 text-center py-4">Duyuru bulunmuyor</p>}
                  </div>
                </div>

                {/* Today's Duty */}
                <div className="bg-[#0c1829] border border-white/[0.06] rounded-[2rem] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
                      <LucideIcons.ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Bugünkü Nöbetçiler
                    </h3>
                    <button onClick={() => setActiveTab("duty")} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors">Yönet</button>
                  </div>
                  <div className="space-y-3">
                    {data.dutyOfficers.filter(o => o.date === new Date().toISOString().split('T')[0]).map(o => (
                      <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-black">{o.name[0]}</div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-300 truncate">{o.name}</p>
                          <p className="text-[9px] text-slate-500 truncate">{o.area}</p>
                        </div>
                      </div>
                    ))}
                    {data.dutyOfficers.filter(o => o.date === new Date().toISOString().split('T')[0]).length === 0 && (
                      <p className="text-[10px] text-slate-600 text-center py-4">Bugün için görevli atanmadı</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "stats" && <StatsEditor data={data.stats} onUpdate={(val) => updateData("stats", val)} />}
          {activeTab === "announcements" && <AnnouncementsEditor data={data.announcements} onUpdate={(val) => updateData("announcements", val)} />}
          {activeTab === "lessons" && <LessonsEditor data={data.lessons} onUpdate={(val) => updateData("lessons", val)} />}
          {activeTab === "duty" && <DutyEditor data={data.dutyOfficers} onUpdate={(val) => updateData("dutyOfficers", val)} />}
          {activeTab === "departments" && <DepartmentsEditor data={data.departments} onUpdate={(val) => updateData("departments", val)} />}
          {activeTab === "calendar" && <CalendarEditor data={data.calendarEvents} onUpdate={(val) => updateData("calendarEvents", val)} />}
          {activeTab === "teachers" && <TeachersEditor data={data.teachers} onUpdate={(val) => updateData("teachers", val)} />}
        </main>
      </div>
    </div>
  );
}

// ─── Editors ──────────────────────────────────────────────────────────────────

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
        <div key={item.id} className="bg-[#0c1829] border border-white/[0.06] rounded-3xl p-6 space-y-5 shadow-xl relative overflow-hidden group">
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-[0.02] pointer-events-none`} />
          
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
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
  const getLocalDateString = (date: Date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getLocalDateString();
  const [selectedDate, setSelectedDate] = useState(today);

  const filteredData = data.filter(item => item.date === selectedDate);
  const futureData = data.filter(item => item.date > today).sort((a,b) => a.date.localeCompare(b.date));
  const pastData = data.filter(item => item.date < today).sort((a,b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8">
      {/* Date Selection & Quick Actions */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Planlanacak Tarihi Seç</label>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#0c1829] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-violet-500 transition-all appearance-none cursor-pointer pr-12 shadow-xl"
              />
              <LucideIcons.Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500 pointer-events-none group-hover:scale-110 transition-transform" />
            </div>
            {selectedDate !== today && (
              <button 
                onClick={() => setSelectedDate(today)}
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all"
              >
                Bugüne Dön
              </button>
            )}
          </div>
        </div>

        <div className="bg-violet-600/10 border border-violet-500/20 rounded-2xl px-5 py-3 flex items-center gap-3">
          <LucideIcons.Info className="w-5 h-5 text-violet-400" />
          <p className="text-[11px] text-violet-200 font-medium">
            <span className="font-black border-b border-violet-500/50 mr-1">{new Date(selectedDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span> için planlama yapıyorsunuz.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-violet-600 rounded-full" />
          {selectedDate === today ? 'Bugünkü Nöbetçiler' : 'Seçili Tarih Nöbetçileri'}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredData.map((item) => {
            const originalIndex = data.findIndex(d => d.id === item.id);
            return (
              <div key={item.id} className="bg-[#0c1829] border border-white/[0.06] rounded-3xl p-6 flex items-center justify-between shadow-xl hover:border-white/10 transition-all group">
                <div className="flex-1 space-y-4">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xl shadow-inner border border-amber-500/20">
                       {item.name[0]}
                     </div>
                     <div className="flex-1">
                        <input 
                          className="bg-transparent font-black text-lg text-white border-none focus:ring-0 w-full p-0" 
                          value={item.name} 
                          onChange={e => {
                            const newData = [...data];
                            newData[originalIndex] = {...item, name: e.target.value};
                            onUpdate(newData);
                          }}
                        />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Görevli Adı</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Görev Yeri</label>
                        <input 
                          className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-300 w-full focus:bg-white/10 focus:border-violet-500/50 transition-all" 
                          value={item.area} 
                          onChange={e => {
                            const newData = [...data];
                            newData[originalIndex] = {...item, area: e.target.value};
                            onUpdate(newData);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Nöbet Saati</label>
                        <input 
                          className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-300 w-full font-mono focus:bg-white/10 focus:border-violet-500/50 transition-all" 
                          value={item.shift} 
                          onChange={e => {
                            const newData = [...data];
                            newData[originalIndex] = {...item, shift: e.target.value};
                            onUpdate(newData);
                          }}
                        />
                      </div>
                   </div>
                </div>
                <div className="flex flex-col items-center gap-4 ml-6 pl-6 border-l border-white/5">
                   <button 
                     onClick={() => {
                       const newData = [...data];
                       newData[originalIndex] = {...item, active: !item.active};
                       onUpdate(newData);
                     }}
                     className={`w-14 h-7 rounded-full relative transition-all shadow-inner ${item.active ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-slate-800'}`}
                   >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all ${item.active ? 'left-8' : 'left-1'}`} />
                   </button>
                   <button 
                    onClick={() => onUpdate(data.filter(o => o.id !== item.id))} 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition-all group-hover:scale-110"
                   >
                      <LucideIcons.Trash2 className="w-5 h-5" />
                   </button>
                </div>
              </div>
            );
          })}
          
          <button 
            onClick={() => onUpdate([...data, { id: Date.now().toString(), name: "Yeni Nöbetçi", area: "Görev Yeri", shift: "08:00-16:00", active: true, date: selectedDate }])}
            className="bg-white/5 border-2 border-white/[0.05] border-dashed rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/[0.02] transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-violet-500/20 transition-all">
              <LucideIcons.Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
            </div>
            <div className="text-center">
              <p className="font-black text-sm uppercase tracking-widest">Nöbetçi Ekle</p>
              <p className="text-[10px] opacity-60 font-medium px-2 py-0.5 rounded-full bg-white/5 mt-1">{new Date(selectedDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} için</p>
            </div>
          </button>
        </div>
      </div>

      {/* Gelecek Planlaması */}
      {futureData.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-white/5">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-amber-500 rounded-full" />
            Gelecek Planlaması
          </h3>
          <div className="grid grid-cols-3 gap-6">
            {Array.from(new Set(futureData.map(d => d.date))).map(date => (
              <div key={date} className="bg-[#0c1829] border border-white/[0.06] rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <p className="text-sm font-black text-amber-500 uppercase tracking-widest">
                    {new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <button 
                    onClick={() => setSelectedDate(date)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                  >
                    <LucideIcons.Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {futureData.filter(d => d.date === date).map(officer => (
                    <div key={officer.id} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-violet-500/20 transition-all">
                        {officer.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">{officer.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{officer.area}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Arşiv */}
      {pastData.length > 0 && (
        <div className="pt-8 border-t border-white/5">
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-all">
            <LucideIcons.History className="w-3.5 h-3.5" />
            Geçmiş Nöbetçiler ({pastData.length})
          </button>
          <div className="grid grid-cols-4 gap-4 mt-4 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            {pastData.map(item => (
              <div key={item.id} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold truncate text-slate-300">{item.name}</p>
                  <p className="text-[9px] text-slate-500 font-medium">{new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</p>
                </div>
                <button onClick={() => onUpdate(data.filter(o => o.id !== item.id))} className="text-rose-500/30 hover:text-rose-500 p-1 transition-colors">
                  <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
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

function TeachersEditor({ data, onUpdate }: { data: Teacher[], onUpdate: (data: Teacher[]) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState({ name: "", role: "" });

  const filtered = data.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = () => {
    if (newItem.name && newItem.role) {
      onUpdate([{ ...newItem, id: Date.now().toString() }, ...data]);
      setNewItem({ name: "", role: "" });
    }
  };

  const removeItem = (id: string) => {
    onUpdate(data.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Search and Add */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#0c1829] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <LucideIcons.Search className="w-4 h-4 text-violet-500" />
            Öğretmen Ara
          </h3>
          <input 
            placeholder="İsim veya branş ile ara..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-all"
          />
        </div>
        <div className="bg-[#0c1829] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <LucideIcons.UserPlus className="w-4 h-4 text-emerald-500" />
            Yeni Ekle
          </h3>
          <div className="space-y-3">
            <input 
              placeholder="Ad Soyad" 
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
            />
            <input 
              placeholder="Görevi / Branşı" 
              value={newItem.role}
              onChange={e => setNewItem({...newItem, role: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
            />
            <button 
              onClick={addItem}
              className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg font-bold text-xs transition-all"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-[#0c1829] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto scrollbar-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Öğretmen Bilgisi</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Görevi</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs">
                        {item.name[0]}
                      </div>
                      <input 
                        className="bg-transparent border-none focus:ring-0 font-bold text-sm w-full p-0" 
                        value={item.name} 
                        onChange={e => {
                          const newData = [...data];
                          const realIdx = data.findIndex(t => t.id === item.id);
                          newData[realIdx] = {...item, name: e.target.value};
                          onUpdate(newData);
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      className="bg-transparent border-none focus:ring-0 text-slate-400 text-sm w-full p-0" 
                      value={item.role} 
                      onChange={e => {
                        const newData = [...data];
                        const realIdx = data.findIndex(t => t.id === item.id);
                        newData[realIdx] = {...item, role: e.target.value};
                        onUpdate(newData);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <LucideIcons.Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-600 text-sm">
                    Aranan kriterlere uygun öğretmen bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}