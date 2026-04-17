"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import * as LucideIcons from "lucide-react";
import { type LessonStatus } from "@/types/dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getIcon = (name: string) => {
  const Icon = (LucideIcons as any)[name];
  return Icon || LucideIcons.HelpCircle;
};

const typeStyles: Record<string, string> = {
  Önemli:  "bg-rose-500/10 text-rose-400 border-rose-500/25",
  Bilgi:   "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
  Sınav:   "bg-amber-500/10 text-amber-400 border-amber-500/25",
  Etkinlik:"bg-violet-500/10 text-violet-400 border-violet-500/25",
};

// ─── Calendar Constants ───────────────────────────────────────────────────────

const MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const DAYS   = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];

// ─── Sub-components ───────────────────────────────────────────────────────────

// ─── Sub-components ───────────────────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState(new Date());
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
        {time.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })},&nbsp;{dayNames[time.getDay()]}
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
  const { data } = useStore();
  const today = new Date();
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

  const getEventForDay = (day: number) => {
    return data.calendarEvents.find(e => e.day === day && e.month === month && e.year === year);
  };

  return (
    <div className="flex flex-col">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/8 transition-colors text-slate-500 hover:text-white"
        >
          <LucideIcons.ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-bold text-white">{MONTHS[month]} {year}</span>
        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/8 transition-colors text-slate-500 hover:text-white"
        >
          <LucideIcons.ChevronRight className="w-3.5 h-3.5" />
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
          const ev      = getEventForDay(day);
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
        {data.calendarEvents.filter(e => e.month === month && e.year === year).map((ev) => (
          <div key={ev.id} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full bg-${ev.color}-500 shrink-0`} />
            <span className="text-[11px] text-slate-500">
              <span className="text-slate-300 font-semibold">{ev.day} {MONTHS[ev.month]}</span> — {ev.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnouncementTicker() {
  const { data } = useStore();
  const tickerItems = [...data.announcements, ...data.announcements];
  
  return (
    <div className="shrink-0 flex items-center h-10 bg-[#07101e] border-b border-white/[0.06] overflow-hidden">
      {/* Label badge */}
      <div className="shrink-0 flex items-center gap-2 px-4 h-full bg-violet-600 z-10">
        <LucideIcons.Megaphone className="w-3.5 h-3.5 text-white" style={{ animation: "none" }} />
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
  const { data } = useStore();
  const carouselItems = [...data.announcements, ...data.announcements];

  return (
    <div className="rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
          <LucideIcons.Bell className="w-4 h-4 text-rose-400" />
        </div>
        <h2 className="text-[15px] font-bold text-white">Aktif Duyurular</h2>
        <span className="w-5 h-5 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center">
          {data.announcements.length}
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



function TeachersCarousel() {
  const { data } = useStore();
  const carouselItems = [...data.teachers, ...data.teachers];

  return (
    <div className="rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
          <LucideIcons.GraduationCap className="w-4 h-4 text-violet-400" />
        </div>
        <h2 className="text-[15px] font-bold text-white">Öğretmen Kadromuz</h2>
        <span className="w-5 h-5 rounded-full bg-violet-500 text-[10px] font-black text-white flex items-center justify-center">
          {data.teachers.length}
        </span>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden py-4">
        <div className="pointer-events-none absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#0c1829] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#0c1829] to-transparent z-10" />
        <div
          className="flex gap-4 px-5 animate-announcement-carousel hover:[animation-play-state:paused]"
          style={{ width: "max-content" }}
        >
          {carouselItems.map((t, i) => (
            <div
              key={i}
              className="w-64 shrink-0 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-4 hover:bg-white/[0.05] transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-violet-800/20 text-violet-400 flex items-center justify-center font-black text-lg border border-violet-500/10">
                {t.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-white leading-tight truncate">{t.name}</p>
                <p className="text-[11px] text-slate-500 mt-1 truncate">{t.role}</p>
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
  const { data, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="h-screen bg-[#07101e] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <LucideIcons.Loader2 className="w-10 h-10 animate-spin text-violet-500" />
          <p className="text-slate-400 font-medium animate-pulse">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  const getLocalDateString = (date: Date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString();
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrowObj);

  return (
    <div className="h-screen bg-[#07101e] text-white flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <header className="shrink-0 px-8 py-4 flex items-center justify-between border-b border-white/[0.06] bg-[#07101e]/95 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center shadow-xl shadow-violet-600/30">
              <LucideIcons.School className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-[2.5px] border-[#07101e] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[17px] font-black text-white tracking-tight leading-none">
                {data.schoolName}
              </h1>
              <a 
                href="/admin" 
                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-tighter"
              >
                Yönetim
              </a>
            </div>
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
          {data.stats.map(({ label, value, sub, iconName, gradient, shadowColor }) => {
            const Icon = getIcon(iconName);
            return (
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
                <LucideIcons.TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 self-start opacity-70" />
              </div>
            );
          })}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-12 gap-5">

          {/* Bugünkü Dersler — 7 cols */}
          <div className="col-span-7 rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                  <LucideIcons.BookOpen className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="text-[15px] font-bold text-white">Bugünkü Dersler</h2>
              </div>
              <span className="text-[11px] text-slate-500 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.05]">
                {data.lessons.length} ders planlandı
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
                  {data.lessons.map((row) => (
                    <TableRow
                      key={row.id}
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
                          <LucideIcons.MapPin className="w-3 h-3 text-slate-600" />
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                    <LucideIcons.Shield className="w-4 h-4 text-amber-400" />
                  </div>
                  <h2 className="text-[15px] font-bold text-white">Nöbetçi Çizelgesi</h2>
                </div>
              </div>

              <div className="space-y-6">
                {/* ── Bugün ── */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className="w-1.5 h-3 rounded-full bg-violet-500" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Bugün</h3>
                    <span className="text-[10px] text-slate-600 font-medium ml-auto">
                      {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {data.dutyOfficers
                      .filter(o => o.date === todayStr)
                      .map((o) => (
                      <div
                        key={o.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border bg-emerald-500/[0.03] border-emerald-500/10 transition-all`}
                      >
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[13px] font-black shrink-0">
                          {o.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-white leading-tight truncate">{o.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{o.area}</p>
                        </div>
                        <div className="flex flex-col items-end shrink-0 gap-0.5">
                          <span className="text-[10px] text-slate-500 font-mono">{o.shift}</span>
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                            Görevde
                          </span>
                        </div>
                      </div>
                    ))}
                    {data.dutyOfficers.filter(o => o.date === todayStr).length === 0 && (
                      <div className="p-4 rounded-xl border border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600">
                        <LucideIcons.UserX className="w-5 h-5 mb-1 opacity-20" />
                        <span className="text-[10px] font-medium">Bugün için nöbetçi atanmadı</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Yarın ── */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className="w-1.5 h-3 rounded-full bg-slate-700" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Yarın</h3>
                    <span className="text-[10px] text-slate-700 font-medium ml-auto">
                      {new Date(tomorrowStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  
                  <div className="space-y-2 opacity-60 grayscale-[0.5]">
                    {data.dutyOfficers
                      .filter(o => o.date === tomorrowStr)
                      .map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center gap-3 p-3 rounded-xl border bg-white/[0.02] border-white/[0.05]"
                      >
                        <div className="w-9 h-9 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-[13px] font-black shrink-0">
                          {o.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-white leading-tight truncate">{o.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{o.area}</p>
                        </div>
                        <div className="flex flex-col items-end shrink-0 gap-0.5">
                          <span className="text-[10px] text-slate-500 font-mono">{o.shift}</span>
                          <span className="text-[10px] text-slate-600 font-bold italic">Planlandı</span>
                        </div>
                      </div>
                    ))}
                    {data.dutyOfficers.filter(o => o.date === tomorrowStr).length === 0 && (
                      <div className="p-4 rounded-xl border border-dashed border-white/5 flex flex-col items-center justify-center text-slate-700/50">
                        <span className="text-[10px] font-medium text-center">Yarın henüz planlanmadı</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Takvim */}
            <div className="rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-xl p-5 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                  <LucideIcons.CalendarDays className="w-4 h-4 text-violet-400" />
                </div>
                <h2 className="text-[15px] font-bold text-white">Takvim</h2>
              </div>
              <CalendarWidget />
            </div>

          </div>
        </div>

        {/* ── Departments Section (Added) ── */}
        <div className="grid grid-cols-2 gap-5">
           {data.departments.map((dept) => {
             const Icon = getIcon(dept.iconName);
             return (
               <div key={dept.id} className="rounded-2xl bg-[#0c1829] border border-white/[0.06] p-5 flex items-center gap-4 hover:border-violet-500/30 transition-all">
                 <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                   <Icon className="w-6 h-6 text-violet-400" />
                 </div>
                 <div>
                   <h3 className="text-white font-bold text-sm tracking-tight">{dept.name}</h3>
                   <p className="text-slate-500 text-[11px] mt-1 line-clamp-2">{dept.description}</p>
                 </div>
               </div>
             )
           })}
        </div>

        {/* ── Teachers Carousel (Added) ── */}
        <TeachersCarousel />

        {/* ── Announcements Carousel ── */}
        <AnnouncementsCarousel />

      </div>
    </div>
  );
}

