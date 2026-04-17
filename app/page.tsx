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
  Önemli: "bg-rose-500/10 text-rose-400 border-rose-500/25",
  Bilgi: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
  Sınav: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  Etkinlik: "bg-violet-500/10 text-violet-400 border-violet-500/25",
};

// ─── Calendar Constants ───────────────────────────────────────────────────────

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// ─── Sub-components ───────────────────────────────────────────────────────────

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimeDisplay() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex flex-col items-start select-none">
      <p className="text-5xl font-black text-white tabular-nums tracking-tighter leading-none" style={{ fontFamily: "var(--font-geist-mono)" }}>
        {pad(time.getHours())}
        <span className="text-violet-400 mx-0.5 animate-pulse">:</span>
        {pad(time.getMinutes())}
        <span className="text-slate-600 mx-0.5 text-4xl">:</span>
        <span className="text-3xl text-slate-400">{pad(time.getSeconds())}</span>
      </p>
      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-bold">Canlı Dijital Zaman</p>
    </div>
  );
}

function DateDisplay() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000 * 60);
    return () => clearInterval(t);
  }, []);
  const dayNames = ["PAZAR", "PAZARTESİ", "SALI", "ÇARŞAMBA", "PERŞEMBE", "CUMA", "CUMARTESİ"];
  return (
    <div className="text-right select-none pr-2">
      <p className="text-4xl font-black text-white tracking-tighter leading-none uppercase">
        {time.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
      </p>
      <p className="text-xl font-bold text-violet-400 mt-1 tracking-[0.1em] uppercase">
        {dayNames[time.getDay()]} {time.getFullYear()}
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



function AnnouncementTicker() {
  const { data } = useStore();
  const announcements = (data.announcements || []).filter(a => a.visible !== false);
  const events = (data.calendarEvents || [])
    .filter(e => e.visible !== false)
    .map(e => ({
      id: `ev-${e.id}`,
      title: e.label,
      desc: `${e.day} ${MONTHS[e.month]} ${e.year} tarihinde olacak`,
      icon: "📅",
      type: "Etkinlik" as const
    }));

  const allItems = [...announcements, ...events];
  const tickerItems = [...allItems, ...allItems];

  return (
    <div className="shrink-0 flex items-center h-14 bg-[#07101e] border-b border-white/[0.06] overflow-hidden">
      {/* Label badge */}
      <div className="shrink-0 flex items-center gap-3 px-6 h-full bg-violet-600 z-10 shadow-[4px_0_24px_rgba(124,58,237,0.3)]">
        <LucideIcons.Megaphone className="w-5 h-5 text-white" style={{ animation: "none" }} />
        <span className="text-[13px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">
          Duyurular
        </span>
      </div>
      <div className="w-px h-8 bg-violet-500/40 shrink-0" />

      {/* Scrolling strip */}
      <div className="flex-1 overflow-hidden relative">
        <div className="pointer-events-none absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-[#07101e] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-[#07101e] to-transparent z-10" />
        <div
          className="flex items-center animate-ticker whitespace-nowrap hover:[animation-play-state:paused]"
        >
          {tickerItems.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-8 text-[16px]">
              <span className="text-[20px]">{a.icon}</span>
              <span className="font-black text-white uppercase tracking-tight">{a.title}</span>
              <span className="text-slate-600 font-bold text-lg">—</span>
              <span className="text-slate-400 font-bold">{a.desc}</span>
              <span className="text-slate-800 mx-4 text-xl">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeachersVerticalMarquee() {
  const { data } = useStore();
  const teachers = (data.teachers || []).filter(t => t.visible !== false);
  const marqueeItems = [...teachers, ...teachers]; // Double for seamless -50% loop

  return (
    <div className="rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-2xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <LucideIcons.GraduationCap className="w-4 h-4 text-violet-400" />
          </div>
          <h2 className="text-[15px] font-bold text-white">Öğretmenlerimiz</h2>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
          {teachers.length} Personel
        </span>
      </div>

      {/* Marquee area */}
      <div className="flex-1 relative overflow-hidden bg-[#0a121e]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#0a121e] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a121e] to-transparent z-10" />

        <div className="animate-vertical-scroll hover:[animation-play-state:paused] p-4 space-y-3">
          {marqueeItems.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-violet-800/20 text-violet-400 flex items-center justify-center font-black text-lg border border-violet-500/10 group-hover:scale-110 transition-transform">
                {t.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-black text-white leading-tight truncate">{t.name}</p>
                <p className="text-[11px] text-slate-500 mt-1 truncate uppercase tracking-widest font-bold opacity-60">{t.role}</p>
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
      <header className="shrink-0 px-8 py-5 flex items-center justify-between border-b border-white/[0.06] bg-[#07101e]/95 backdrop-blur-xl z-20">
        <div className="flex items-center gap-8">
          {/* Time on the Left */}
          <TimeDisplay />

          <div className="w-px h-10 bg-white/10 hidden md:block" />

          {/* Logo & School Name */}
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center shadow-2xl shadow-violet-600/40 border border-white/10">
                <LucideIcons.School className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-[22px] font-black text-white tracking-tighter leading-none uppercase">
                {data.schoolName}
              </h1>
              <p className="text-[11px] text-slate-500 mt-1.5 uppercase tracking-[0.3em] font-black opacity-40">
                Dijital Bilgilendirme Sistemi
              </p>
            </div>
          </div>
        </div>

        {/* Large Date on the Right */}
        <DateDisplay />
      </header>

      {/* ── Ticker ── */}
      <AnnouncementTicker />

      {/* ── Main Content Area (Fixed Height, No Page Scroll) ── */}
      <div className="flex-1 overflow-hidden p-5 flex flex-col gap-4">

        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-4">
          {data.stats.filter(s => s.visible !== false).map(({ label, value, sub, iconName, gradient, shadowColor }) => {
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

        {/* ── Main Grid (Fills remaining space) ── */}
        <div className="flex-1 grid grid-cols-12 gap-5 min-h-0">

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
                  {data.lessons.filter(l => l.visible !== false).length > 0 ? (
                    data.lessons.filter(l => l.visible !== false).map((row) => (
                      <TableRow
                        key={row.id}
                        className={`border-white/[0.04] transition-colors
                        ${row.status === "active"
                            ? "bg-emerald-500/[0.05] hover:bg-emerald-500/[0.08]"
                            : row.status === "next"
                              ? "bg-amber-500/[0.05] hover:bg-amber-500/[0.08]"
                              : "hover:bg-white/[0.02]"}`}
                      >
                        <TableCell className="px-5 py-4 whitespace-nowrap" style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "#94a3b8" }}>
                          {row.time}<span className="opacity-40 mx-0.5">–</span>{row.end}
                        </TableCell>
                        <TableCell className="px-5 py-4 font-black text-white text-[14px]">{row.lesson}</TableCell>
                        <TableCell className="px-5 py-4 text-slate-300 font-semibold text-[14px]">{row.teacher}</TableCell>
                        <TableCell className="px-5 py-4">
                          <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-slate-200 text-[12px] font-black tracking-widest">
                            {row.class}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-slate-400 text-[13px]">
                          <span className="flex items-center gap-2">
                            <LucideIcons.MapPin className="w-3.5 h-3.5 text-slate-600" />
                            {row.room}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-right">
                          <LessonStatusBadge status={row.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent border-none">
                      <TableCell colSpan={6} className="h-96 text-center">
                        <div className="flex flex-col items-center justify-center gap-4 opacity-10">
                          <LucideIcons.CalendarOff className="w-20 h-20" />
                          <p className="text-lg font-black uppercase tracking-[0.4em]">Bugün İçin Ders Planlanmadı</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
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
                      .filter(o => o.date === todayStr && o.visible !== false)
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
                      <div className="h-48 rounded-xl border border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 gap-3">
                        <LucideIcons.UserX className="w-10 h-10 opacity-20" />
                        <span className="text-[12px] font-black uppercase tracking-widest opacity-40">Bugün için nöbetçi atanmadı</span>
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
                      .filter(o => o.date === tomorrowStr && o.visible !== false)
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

            {/* Öğretmenler (Replaced Takvim) */}
            <div className="flex-1 min-h-0">
              <TeachersVerticalMarquee />
            </div>

          </div>
        </div>

      </div>





    </div>
  );
}

