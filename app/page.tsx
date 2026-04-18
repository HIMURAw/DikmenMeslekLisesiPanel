"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import * as LucideIcons from "lucide-react";
import { type Teacher, type LessonStatus } from "@/types/dashboard";

const Footer = ({ text }: { text: string }) => {
  return (
    <footer className="h-10 bg-[#0c1829]/80 backdrop-blur-md border-t border-white/[0.06] flex items-center overflow-hidden relative">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 40s linear infinite;
        }
      `}</style>
      <div className="w-full relative flex items-center">
        <div className="marquee-content px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          {text}
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 px-6 bg-gradient-to-l from-[#0c1829] via-[#0c1829] to-transparent flex items-center gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Sistem Çevrimiçi</span>
        </div>
      </div>
    </footer>
  );
};
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
  if (status === "upcoming")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Sıradaki
      </span>
    );
  if (status === "finished")
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

const ATATURK_QUOTES = [
  "Hayatta en hakiki mürşit ilimdir.",
  "Milletin bağrından temiz bir kuşak yetişiyor. Bu eseri ona bırakacağım ve gözüm arkamda kalmayacak!",
  "Gençliği yetiştiriniz. Onlara ilim ve irfanın müspet fikirlerini veriniz.",
  "Eğitimdir ki, bir milleti ya özgür, bağımsız, şanlı, yüksek bir topluluk halinde yaşatır ya da esarete ve sefalete terk eder.",
  "Okul genç beyinlere; insanlığa hürmeti, millet ve memleket sevgisini, şerefi, bağımsızlığı öğretir.",
  "Cumhuriyeti biz kurduk, onu yükseltecek ve yaşatacak olan sizlersiniz."
];

function AtaturkCorner() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ATATURK_QUOTES.length);
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-2xl overflow-hidden h-full flex flex-col relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between shrink-0 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
            <LucideIcons.Star className="w-4 h-4 text-amber-500" />
          </div>
          <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">Atatürk Köşesi</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hidden p-5 flex flex-col gap-6 items-center text-center">
        {/* Atatürk Portrait */}
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shrink-0">
          <img
            src="/ataturk_portrait_premium.png"
            alt="Mustafa Kemal Atatürk"
            className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0 scale-110 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1829] via-transparent to-transparent opacity-60" />
        </div>

        {/* Famous Quote */}
        <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/10 w-full min-h-[70px] flex flex-col justify-center">
          <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest leading-relaxed">
            "{ATATURK_QUOTES[quoteIndex]}"
          </p>
          <p className="text-[9px] text-slate-500 mt-1 font-bold uppercase tracking-[0.2em]">K. Atatürk</p>
        </div>

        {/* Quotes / Texts */}
        <div className="space-y-8 px-4 w-full pb-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-amber-500 uppercase tracking-tighter leading-none">İstiklal Marşı</h3>
            <p className="text-[13px] text-slate-300 font-medium italic leading-relaxed opacity-90">
              Korkma, sönmez bu şafaklarda yüzen al sancak;<br />
              Sönmeden yurdumun üstünde tüten en son ocak.<br />
              O benim milletimin yıldızıdır, parlayacak;<br />
              O benimdir, o benim milletimindir ancak.
            </p>
          </div>

          <div className="w-16 h-px bg-white/10 mx-auto" />

          <div className="space-y-3">
            <h3 className="text-2xl font-black text-violet-400 uppercase tracking-tighter leading-none">Gençliğe Hitabe</h3>
            <p className="text-[13px] text-slate-300 font-medium italic leading-relaxed opacity-90">
              Ey Türk gençliği! Birinci vazifen; Türk istiklâlini, Türk cumhuriyetini, ilelebet muhafaza ve müdafaa etmektir. Mevcudiyetinin ve istikbalinin yegâne temeli budur. Bu temel, senin en kıymetli hazinendir.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-sm font-black text-white uppercase tracking-[0.2em] bg-white/5 py-3 px-6 rounded-xl border border-white/10 inline-block shadow-lg shadow-black/20">
              Ne Mutlu Türküm Diyene!
            </p>
          </div>
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
          <h2 className="text-[15px] font-bold text-white">Öğretmenler</h2>
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center shadow-2xl shadow-violet-600/40 border border-white/10 overflow-hidden">
                {data.logo ? (
                  <img src={data.logo} alt="School Logo" className="w-full h-full object-contain p-1.5" />
                ) : (
                  <LucideIcons.School className="w-6 h-6 text-white" />
                )}
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
      <div className="flex-1 overflow-hidden p-5 pb-2 flex flex-col gap-4">

        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-4">
          {data.stats
            .filter(s => s.visible !== false)
            .map((stat) => {
              let displayValue = stat.value;
              let displaySub = stat.sub;
              let shouldHide = false;

              // Dinamik Değerler
              if (stat.label === "Öğretmenler") {
                const count = (data.teachers || []).filter(t => t.visible !== false).length;
                displayValue = count.toString();
                displaySub = `${count} Aktif Personel`;
                if (count === 0) shouldHide = true;
              } else if (stat.label === "Sınıflar") {
                const count = (data.classes || []).length;
                displayValue = count.toString();
                displaySub = `${count} Şube Mevcut`;
                if (count === 0) shouldHide = true;
              } else if (stat.label === "Aktif Duyurular") {
                const visibleAnnouncements = (data.announcements || []).filter(a => a.visible !== false).length;
                const visibleEvents = (data.calendarEvents || []).filter(e => e.visible !== false).length;
                const total = visibleAnnouncements + visibleEvents;
                displayValue = total.toString();
                displaySub = `${visibleAnnouncements} Duyuru · ${visibleEvents} Etkinlik`;
                if (total === 0) shouldHide = true;
              }

              if (shouldHide) return null;

              const Icon = getIcon(stat.iconName);
              return (
                <div
                  key={stat.id}
                  className={`group relative rounded-2xl bg-[#0c1829] border border-white/[0.06] p-5 shadow-xl ${stat.shadowColor} flex items-center gap-4 overflow-hidden hover:border-white/[0.10] transition-colors`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.04] pointer-events-none`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-3xl font-black text-white leading-none tabular-nums">{displayValue}</p>
                    <p className="text-[13px] font-semibold text-white/80 mt-0.5">{stat.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{displaySub}</p>
                  </div>
                  <LucideIcons.TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 self-start opacity-70" />
                </div>
              );
            })}
        </div>

        {/* ── Main Grid (Fills remaining space) ── */}
        <div className="flex-1 grid grid-cols-12 gap-5 min-h-0">

          {/* Atatürk Köşesi */}
          {data.ataturkCornerVisible !== false && (
            <div className="col-span-3 h-full">
              <AtaturkCorner />
            </div>
          )}

          {/* Bugünkü Dersler */}
          {data.lessonsVisible !== false && (
            <div className={`col-span-3 h-full rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-xl overflow-hidden flex flex-col`}>
              <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                    <LucideIcons.BookOpen className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">Bugün</h2>
                </div>
              </div>
              <div className="overflow-y-auto scrollbar-hidden flex-1">
                <div className="p-4 space-y-3">
                  {data.lessons.filter(l => l.visible !== false).length > 0 ? (
                    data.lessons.filter(l => l.visible !== false).map((row) => (
                      <div
                        key={row.id}
                        className={`p-4 rounded-xl border transition-all ${row.status === "active"
                          ? "bg-emerald-500/10 border-emerald-500/20"
                          : "bg-white/[0.02] border-white/[0.05]"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-slate-500">{row.time} – {row.end}</span>
                          <LessonStatusBadge status={row.status} />
                        </div>
                        <h3 className="text-base font-black text-white leading-tight mb-1">{row.lesson}</h3>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-bold uppercase tracking-widest">{row.teacher}</span>
                          <span className="text-cyan-400 font-black">{row.class}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-10 gap-2 py-20">
                      <LucideIcons.CalendarOff className="w-12 h-12" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-center">Plan Yok</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right column — Dinamik Genişleme */}
          <div className={`${(data.ataturkCornerVisible === false && data.lessonsVisible === false) ? 'col-span-12' : (data.ataturkCornerVisible === false || data.lessonsVisible === false) ? 'col-span-9' : 'col-span-6'} flex flex-col gap-5 h-full`}>

            {/* Nöbetçiler */}
            <div className="rounded-2xl bg-[#0c1829] border border-white/[0.06] shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                    <LucideIcons.Shield className="w-6 h-6 text-amber-400" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">Nöbetçi Çizelgesi</h2>
                </div>
                <div className="bg-white/[0.04] px-4 py-2 rounded-xl border border-white/[0.05] text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* ── Bugün ── */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1 mb-2">
                    <span className="w-2 h-4 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Şu An Görevde</h3>
                  </div>

                  <div className="space-y-3">
                    {data.dutyOfficers
                      .filter(o => o.date === todayStr && o.visible !== false)
                      .map((o) => (
                        <div
                          key={o.id}
                          className="flex items-center gap-5 p-5 rounded-2xl border bg-emerald-500/[0.05] border-emerald-500/20 transition-all hover:bg-emerald-500/[0.08]"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl font-black shrink-0 shadow-lg">
                            {o.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xl font-black text-white leading-tight truncate">{o.name}</p>
                            <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-wider">{o.area}</p>
                          </div>
                          <div className="flex flex-col items-end shrink-0 gap-1">
                            <span className="text-xs text-slate-500 font-mono font-bold bg-white/5 py-1 px-2 rounded-lg">{o.shift}</span>
                            <span className="text-[10px] text-emerald-400 font-black flex items-center gap-1.5 uppercase tracking-widest">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                              Aktif
                            </span>
                          </div>
                        </div>
                      ))}
                    {data.dutyOfficers.filter(o => o.date === todayStr && o.visible !== false).length === 0 && (
                      <div className="py-12 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 gap-3">
                        <LucideIcons.UserX className="w-10 h-10 opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest opacity-40">Kayıt Bulunamadı</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Yarın ── */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1 mb-2">
                    <span className="w-2 h-4 rounded-full bg-slate-700" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Yarınki Plan</h3>
                  </div>

                  <div className="space-y-3 opacity-60">
                    {data.dutyOfficers
                      .filter(o => o.date === tomorrowStr && o.visible !== false)
                      .map((o) => (
                        <div
                          key={o.id}
                          className="flex items-center gap-5 p-5 rounded-2xl border bg-white/[0.02] border-white/[0.05]"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center text-2xl font-black shrink-0">
                            {o.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xl font-black text-white leading-tight truncate">{o.name}</p>
                            <p className="text-sm text-slate-500 font-medium mt-1 uppercase tracking-wider">{o.area}</p>
                          </div>
                          <div className="flex flex-col items-end shrink-0 gap-1">
                            <span className="text-xs text-slate-600 font-mono font-bold">{o.shift}</span>
                            <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest italic">Planlı</span>
                          </div>
                        </div>
                      ))}
                    {data.dutyOfficers.filter(o => o.date === tomorrowStr && o.visible !== false).length === 0 && (
                      <div className="py-12 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center text-slate-800/40">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-30">Planlanmadı</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Öğretmenler */}
            <div className="flex-1 min-h-0">
              <TeachersVerticalMarquee />
            </div>

          </div>
        </div>

      </div>

      {/* ── Footer (Outside content area) ── */}
      <Footer text={data.footerText} />

    </div>
  );
}
