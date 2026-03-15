"use client";

import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  Bell,
  Shield,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  CalendarDays,
  MapPin,
  Megaphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonStatus = "done" | "active" | "next" | "upcoming";

interface Lesson {
  time: string;
  end: string;
  lesson: string;
  teacher: string;
  class: string;
  room: string;
  status: LessonStatus;
}

interface Announcement {
  title: string;
  desc: string;
  type: string;
  icon: string;
}

interface DutyOfficer {
  name: string;
  area: string;
  shift: string;
  active: boolean;
}

interface StatItem {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  gradient: string;
  shadowColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats: StatItem[] = [
  {
    label: "Öğrenciler",
    value: "1.248",
    sub: "Toplam Kayıtlı",
    icon: Users,
    gradient: "from-violet-500 to-violet-700",
    shadowColor: "shadow-violet-500/20",
  },
  {
    label: "Öğretmenler",
    value: "86",
    sub: "Aktif Personel",
    icon: GraduationCap,
    gradient: "from-cyan-500 to-cyan-700",
    shadowColor: "shadow-cyan-500/20",
  },
  {
    label: "Sınıflar",
    value: "42",
    sub: "12 Şube · 6 Bölüm",
    icon: School,
    gradient: "from-amber-500 to-amber-700",
    shadowColor: "shadow-amber-500/20",
  },
  {
    label: "Aktif Duyurular",
    value: "7",
    sub: "2 Yeni Bugün",
    icon: Bell,
    gradient: "from-rose-500 to-rose-700",
    shadowColor: "shadow-rose-500/20",
  },
];

const todaysLessons: Lesson[] = [
  { time: "08:00", end: "08:45", lesson: "Matematik",  teacher: "Ayşe Kaya",    class: "11-A", room: "D201",  status: "done"     },
  { time: "08:55", end: "09:40", lesson: "Türkçe",     teacher: "Mehmet Demir", class: "10-B", room: "A101",  status: "done"     },
  { time: "09:50", end: "10:35", lesson: "Fizik",      teacher: "Can Arslan",   class: "12-C", room: "Lab-1", status: "active"   },
  { time: "10:45", end: "11:30", lesson: "Tarih",      teacher: "Selin Çelik",  class: "9-D",  room: "B305",  status: "next"     },
  { time: "11:40", end: "12:25", lesson: "Kimya",      teacher: "Fatma Yıldız", class: "11-B", room: "Lab-2", status: "upcoming" },
  { time: "13:10", end: "13:55", lesson: "İngilizce",  teacher: "Tom Wilson",   class: "10-A", room: "C204",  status: "upcoming" },
  { time: "14:05", end: "14:50", lesson: "Biyoloji",   teacher: "Merve Koç",    class: "9-A",  room: "B104",  status: "upcoming" },
];

const announcements: Announcement[] = [
  { title: "Veli Toplantısı",   desc: "20 Mart'ta tüm veliler saat 18:00'de davetlidir.",    type: "Önemli",  icon: "📢" },
  { title: "Spor Salonu Bakım", desc: "15–18 Mart arası spor salonu kapalıdır.",              type: "Bilgi",   icon: "🏋️" },
  { title: "YKS Deneme Sınavı", desc: "22 Mart Cumartesi saat 09:00'da yapılacaktır.",        type: "Sınav",   icon: "📝" },
  { title: "Kitap Bağışı",      desc: "Kütüphanemize kitap bağışı kabul edilmektedir.",       type: "Etkinlik",icon: "📚" },
  { title: "Bahar Şenliği",     desc: "25 Mart'ta okul bahçesinde kutlanacak.",               type: "Etkinlik",icon: "🌸" },
];

const dutyOfficers: DutyOfficer[] = [
  { name: "Hasan Öztürk", area: "Giriş Kapısı", shift: "08:00–12:00", active: true  },
  { name: "Zeynep Aydın", area: "Kantin",        shift: "08:00–12:00", active: true  },
  { name: "Emre Kılıç",   area: "Bahçe",         shift: "12:00–16:00", active: false },
  { name: "Nalan Şahin",  area: "Koridor A",     shift: "12:00–16:00", active: false },
  { name: "Kemal Arslan", area: "Otopark",        shift: "08:00–16:00", active: true  },
];

const typeStyles: Record<string, string> = {
  Önemli:  "bg-rose-500/10 text-rose-400 border-rose-500/25",
  Bilgi:   "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
  Sınav:   "bg-amber-500/10 text-amber-400 border-amber-500/25",
  Etkinlik:"bg-violet-500/10 text-violet-400 border-violet-500/25",
};

// ─── Calendar Constants ───────────────────────────────────────────────────────

const MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const DAYS   = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
const EVENT_DAYS: Record<number, { label: string; color: string }> = {
  20: { label: "Veli Toplantısı", color: "rose"   },
  22: { label: "YKS Denemesi",    color: "amber"  },
  25: { label: "Bahar Şenliği",   color: "violet" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState(new Date(2026, 2, 15, 13, 34, 47));
  useEffect(() => {
    const t = setInterval(() => setTime(d => new Date(d.getTime() + 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dayNames = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
  return (
    <div className="text-right select-none">
      <p className="text-4xl font-black text-white tabular-nums tracking-tight leading-none" style={{ fontFamily: "var(--font-geist-mono)" }}>
        {pad(time.getHours())}
        <span className="text-violet-400 mx-0.5 animate-pulse">:</span>
        {pad(time.getMinutes())}
        <span className="text-slate-600 mx-0.5 text-3xl">:</span>
        <span className="text-2xl text-slate-400">{pad(time.getSeconds())}</span>
      </p>
      <p className="text-[12px] text-slate-500 mt-1 tracking-wide">
        15 Mart 2026,&nbsp;{dayNames[time.getDay()]}
      </p>
    </div>
  );
}

function LessonStatusBadge({ status }: { status: LessonStatus }) {
  if (status === "active")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Devam Ediyor
      </span>
    );
  if (status === "next")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Sıradaki
      </span>
    );
  if (status === "done")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800/50 text-slate-600 border border-slate-700/30 uppercase tracking-widest">
        Tamamlandı
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-700/20 text-slate-500 border border-slate-700/20 uppercase tracking-widest">
      Bekliyor
    </span>
  );
}

function CalendarWidget() {
  const today = new Date(2026, 2, 15);
  const [current, setCurrent] = useState(today);
  const year  = current.getFullYear();
  const month = current.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const isToday = (d: number) =>
    year === today.getFullYear() && month === today.getMonth() && d === today.getDate();

  return (
    <div className="flex flex-col">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/8 transition-colors text-slate-500 hover:text-white"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-bold text-white">{MONTHS[month]} {year}</span>
        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/8 transition-colors text-slate-500 hover:text-white"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1.5">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-slate-600 uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const ev      = EVENT_DAYS[day];
          const todayDay = isToday(day);
          return (
            <div
              key={day}
              className={`relative flex items-center justify-center h-8 w-8 mx-auto rounded-full text-[12px] font-medium cursor-default transition-all
                ${todayDay
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/40 font-bold"
                  : ev
                    ? `text-${ev.color}-300 hover:bg-white/5`
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}
            >
              {day}
              {ev && !todayDay && (
                <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-${ev.color}-500`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Event legend */}
      <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
        {Object.entries(EVENT_DAYS).map(([d, ev]) => (
          <div key={d} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full bg-${ev.color}-500 shrink-0`} />
            <span className="text-[11px] text-slate-500">
              <span className="text-slate-300 font-semibold">{d} Mart</span> — {ev.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Duplicated for seamless marquee loop
const tickerItems = [...announcements, ...announcements];
const carouselItems = [...announcements, ...announcements];

function AnnouncementTicker() {
  return (
    <div className="shrink-0 flex items-center h-10 bg-[#07101e] border-b border-white/[0.06] overflow-hidden">
      {/* Label badge */}
      <div className="shrink-0 flex items-center gap-2 px-4 h-full bg-violet-600 z-10">
        <Megaphone className="w-3.5 h-3.5 text-white" style={{ animation: "none" }} />
        <span className="text-[11px] font-extrabold text-white uppercase tracking-widest whitespace-nowrap">
          Duyurular
        </span>
      </div>
      <div className="w-px h-6 bg-violet-500/40 shrink-0" />

      {/* Scrolling strip */}
      <div className="flex-1 overflow-hidden relative">
        <div className="pointer-events-none absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-[#07101e] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#07101e] to-transparent z-10" />
        <div
          className="flex items-center animate-ticker whitespace-nowrap hover:[animation-play-state:paused]"
        >
          {tickerItems.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-5 text-[12.5px]">
              <span className="text-[14px]">{a.icon}</span>
              <span className="font-semibold text-slate-200">{a.title}</span>
              <span className="text-slate-600">—</span>
              <span className="text-slate-400">{a.desc}</span>
              <span className="text-slate-700 mx-2 text-base">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnnouncementsCarousel() {
  return (
    <div className="rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
          <Bell className="w-4 h-4 text-rose-400" />
        </div>
        <h2 className="text-[15px] font-bold text-white">Aktif Duyurular</h2>
        <span className="w-5 h-5 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center">
          {announcements.length}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Canlı</span>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden py-4">
        <div className="pointer-events-none absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#0c1829] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#0c1829] to-transparent z-10" />
        <div
          className="flex gap-4 px-5 animate-announcement-carousel hover:[animation-play-state:paused]"
          style={{ width: "max-content" }}
        >
          {carouselItems.map((a, i) => (
            <div
              key={i}
              className="w-72 shrink-0 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] flex flex-col gap-3 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl leading-none">{a.icon}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${typeStyles[a.type] ?? typeStyles["Bilgi"]}`}>
                  {a.type}
                </span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-white leading-snug">{a.title}</p>
                <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div className="h-screen bg-[#07101e] text-white flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <header className="shrink-0 px-8 py-4 flex items-center justify-between border-b border-white/[0.06] bg-[#07101e]/95 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center shadow-xl shadow-violet-600/30">
              <School className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-[2.5px] border-[#07101e] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>
          <div>
            <h1 className="text-[17px] font-black text-white tracking-tight leading-none">
              Dikmen Mesleki Teknik Anadolu Lisesi
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-widest font-medium">
              Bilgi Paneli · Herkese Açık Ekran
            </p>
          </div>
        </div>
        <LiveClock />
      </header>

      {/* ── Ticker ── */}
      <AnnouncementTicker />

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden p-5 space-y-5">

        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map(({ label, value, sub, icon: Icon, gradient, shadowColor }) => (
            <div
              key={label}
              className={`group relative rounded-2xl bg-[#0c1829] border border-white/[0.06] p-5 shadow-xl ${shadowColor} flex items-center gap-4 overflow-hidden hover:border-white/[0.10] transition-colors`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.04] pointer-events-none`} />
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shrink-0`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-3xl font-black text-white leading-none tabular-nums">{value}</p>
                <p className="text-[13px] font-semibold text-white/80 mt-0.5">{label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{sub}</p>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 self-start opacity-70" />
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-12 gap-5">

          {/* Bugünkü Dersler — 7 cols */}
          <div className="col-span-7 rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="text-[15px] font-bold text-white">Bugünkü Dersler</h2>
              </div>
              <span className="text-[11px] text-slate-500 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.05]">
                {todaysLessons.length} ders planlandı
              </span>
            </div>
            <div className="overflow-y-auto scrollbar-hidden flex-1">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.02]">
                    {["Saat", "Ders", "Öğretmen", "Sınıf", "Derslik", "Durum"].map(h => (
                      <TableHead
                        key={h}
                        className="text-slate-500 font-semibold uppercase tracking-widest text-[10px] px-5 py-3"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todaysLessons.map((row, i) => (
                    <TableRow
                      key={i}
                      className={`border-white/[0.04] transition-colors
                        ${row.status === "active"
                          ? "bg-emerald-500/[0.05] hover:bg-emerald-500/[0.08]"
                          : row.status === "next"
                          ? "bg-amber-500/[0.05] hover:bg-amber-500/[0.08]"
                          : "hover:bg-white/[0.02]"}`}
                    >
                      <TableCell className="px-5 py-3.5 whitespace-nowrap" style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "#94a3b8" }}>
                        {row.time}<span className="opacity-40 mx-0.5">–</span>{row.end}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 font-bold text-white text-[13px]">{row.lesson}</TableCell>
                      <TableCell className="px-5 py-3.5 text-slate-300 text-[13px]">{row.teacher}</TableCell>
                      <TableCell className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-slate-200 text-[11px] font-bold tracking-wider">
                          {row.class}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-slate-400 text-[12px]">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-600" />
                          {row.room}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-3.5">
                        <LessonStatusBadge status={row.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right column — 5 cols */}
          <div className="col-span-5 flex flex-col gap-5">

            {/* Nöbetçiler */}
            <div className="rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <h2 className="text-[15px] font-bold text-white">Bugünkü Nöbetçiler</h2>
              </div>
              <div className="space-y-2">
                {dutyOfficers.map((o, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                      ${o.active
                        ? "bg-emerald-500/[0.05] border-emerald-500/15"
                        : "bg-white/[0.02] border-white/[0.05]"}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-black shrink-0
                        ${o.active ? "bg-amber-500/20 text-amber-400" : "bg-slate-700/40 text-slate-500"}`}
                    >
                      {o.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white leading-tight truncate">{o.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{o.area}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                      <span className="text-[10px] text-slate-500 font-mono">{o.shift}</span>
                      {o.active
                        ? <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                            Görevde
                          </span>
                        : <span className="text-[10px] text-slate-600">Bekliyor</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Takvim */}
            <div className="rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-xl p-5 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-violet-400" />
                </div>
                <h2 className="text-[15px] font-bold text-white">Takvim</h2>
              </div>
              <CalendarWidget />
            </div>

          </div>
        </div>

        {/* ── Announcements Carousel ── */}
        <AnnouncementsCarousel />

      </div>
    </div>
  );
}
