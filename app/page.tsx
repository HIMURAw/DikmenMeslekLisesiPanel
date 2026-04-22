"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import * as LucideIcons from "lucide-react";
import { type Teacher, type LessonStatus, type VicePrincipal } from "@/types/dashboard";

const Footer = ({ text }: { text: string }) => {
  return (
    <footer className="h-10 bg-card/80 backdrop-blur-md border-t border-border flex items-center overflow-hidden relative">
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
        <div className="marquee-content px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          {text}
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 px-6 bg-gradient-to-l from-card via-card to-transparent flex items-center gap-3 z-10">
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

// Colored glow on hover per stat gradient
const hoverGlowMap: Record<string, string> = {
  "from-violet-500 to-violet-700": "hover:shadow-[0_0_42px_rgba(139,92,246,0.38)] hover:border-violet-500/30",
  "from-cyan-500 to-cyan-700": "hover:shadow-[0_0_42px_rgba(6,182,212,0.38)]   hover:border-cyan-500/30",
  "from-amber-500 to-amber-700": "hover:shadow-[0_0_42px_rgba(245,158,11,0.38)]  hover:border-amber-500/30",
  "from-rose-500 to-rose-700": "hover:shadow-[0_0_42px_rgba(244,63,94,0.38)]   hover:border-rose-500/30",
  "from-emerald-500 to-emerald-700": "hover:shadow-[0_0_42px_rgba(16,185,129,0.38)] hover:border-emerald-500/30",
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
    <div className="flex flex-col items-start select-none group">
      <p className="text-[48px] font-black text-foreground tabular-nums tracking-tighter leading-none" style={{ fontFamily: "var(--font-mono)" }}>
        {pad(time.getHours())}
        <span className="text-primary mx-0.5 animate-pulse">:</span>
        {pad(time.getMinutes())}
        <span className="text-muted-foreground/30 mx-0.5 text-3xl">:</span>
        <span className="text-3xl text-muted-foreground font-black">{pad(time.getSeconds())}</span>
      </p>
      <p className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-[0.4em] font-black opacity-40 group-hover:opacity-100 transition-opacity">Canlı Veri Akışı</p>
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
    <div className="text-right select-none pr-4 border-r-2 border-primary/40 py-1">
      <p className="text-[42px] font-black text-foreground tracking-tighter leading-none uppercase">
        {time.getDate()} {MONTHS[time.getMonth()].toUpperCase()}
      </p>
      <p className="text-[20px] font-black text-primary mt-1.5 tracking-[0.2em] uppercase opacity-80">
        {dayNames[time.getDay()]} {time.getFullYear()}
      </p>
    </div>
  );
}

function LessonStatusBadge({ status }: { status: LessonStatus }) {
  if (status === "active")
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 uppercase tracking-widest shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
        Ders İşleniyor
      </span>
    );
  if (status === "upcoming")
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/25 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Sıradaki Ders
      </span>
    );
  if (status === "finished")
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black bg-muted/30 text-muted-foreground border border-border uppercase tracking-widest opacity-50">
        Tamamlandı
      </span>
    );
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black bg-muted/10 text-muted-foreground/40 border border-border/10 uppercase tracking-widest">
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
    <div className="shrink-0 flex items-center h-12 bg-background/80 border-b border-white/5 overflow-hidden">
      {/* Label badge */}
      <div className="shrink-0 flex items-center gap-3 px-6 h-full bg-primary z-10 shadow-[4px_0_24px_rgba(var(--primary),0.2)]">
        <LucideIcons.Megaphone className="w-4 h-4 text-primary-foreground" />
        <span className="text-[10px] font-black text-primary-foreground uppercase tracking-[0.2em] whitespace-nowrap">
          Duyurular
        </span>
      </div>

      {/* Scrolling strip */}
      <div className="flex-1 overflow-hidden relative">
        <div className="pointer-events-none absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div
          className="flex items-center animate-ticker whitespace-nowrap hover:[animation-play-state:paused]"
        >
          {tickerItems.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-10 text-[13px]">
              <span className="text-primary opacity-60 text-lg">{a.icon}</span>
              <span className="font-black text-foreground uppercase tracking-tight">{a.title}</span>
              <span className="text-muted-foreground/30 font-bold text-sm">—</span>
              <span className="text-muted-foreground font-bold opacity-60 italic">{a.desc}</span>
              <span className="text-muted-foreground/10 mx-6 text-lg">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


function AtaturkCorner() {
  const { data } = useStore();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quotes = data.ataturkQuotes && data.ataturkQuotes.length > 0 
    ? data.ataturkQuotes 
    : ["Hayatta en hakiki mürşit ilimdir."];

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <div className="rounded-2xl bg-card border border-white/5 shadow-2xl overflow-hidden h-full flex flex-col relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between shrink-0 bg-foreground/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <LucideIcons.Star className="w-4 h-4 text-amber-500" />
          </div>
          <h2 className="text-[12px] font-black text-foreground uppercase tracking-widest">Atatürk Köşesi</h2>
        </div>
      </div>

      <div className="flex-1 min-h-0 p-6 flex flex-col gap-6 items-center text-center relative">
        {/* Atatürk Portrait - Improved scaling */}
        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group/img bg-[#080c14] shrink-0">
          <img
            src={data.ataturkImages[0] || "/ataturk_portrait_premium.png"}
            alt="Mustafa Kemal Atatürk"
            className="w-full h-full object-cover object-top transition-all duration-1000 group-hover/img:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Famous Quote Box - Guaranteed visibility */}
        <div className="w-full min-h-[160px] bg-[#0c1420] rounded-3xl border border-amber-500/30 p-8 flex flex-col items-center justify-center relative group/quote shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          <LucideIcons.Quote className="w-10 h-10 text-amber-500/10 absolute top-4 left-4" />

          <p className="text-[17px] font-black text-amber-400 leading-snug relative z-10 italic drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
            "{quotes[quoteIndex]}"
          </p>

          <div className="mt-6 flex items-center gap-4 opacity-50">
            <div className="h-px w-6 bg-amber-500" />
            <p className="text-[11px] text-amber-500 font-black uppercase tracking-[0.4em]">K. ATATÜRK</p>
            <div className="h-px w-6 bg-amber-500" />
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
    <div className="rounded-2xl bg-card border border-white/5 shadow-2xl overflow-hidden h-full flex flex-col group/teachers">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between shrink-0 bg-foreground/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <LucideIcons.GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-[12px] font-black text-foreground uppercase tracking-widest">Öğretmenler</h2>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-black text-primary uppercase tracking-widest">
          {teachers.length} PERSONEL
        </span>
      </div>

      {/* Marquee area */}
      <div className="flex-1 relative overflow-hidden bg-[#080c14]/30 h-[408px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-card to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent z-10" />

        <div className="animate-vertical-scroll hover:[animation-play-state:paused] p-4 space-y-3">
          {marqueeItems.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 h-[85px] rounded-xl bg-foreground/[0.02] border border-white/5 hover:border-primary/30 transition-all group/teacher-item"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/10 group-hover/teacher-item:bg-primary group-hover/teacher-item:text-primary-foreground transition-all shrink-0">
                {t.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[18px] font-black text-foreground leading-tight truncate uppercase tracking-tight">{t.name}</p>
                <p className="text-[12px] text-muted-foreground mt-1.5 truncate uppercase tracking-widest font-black opacity-40 leading-none">{t.role}</p>
              </div>
              <LucideIcons.ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover/teacher-item:text-primary transition-colors" />
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
  const [currentTime, setCurrentTime] = useState(new Date());

  const parseTime = (value: string) => {
    const parts = value.split(":").map((part) => Number(part));
    if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
    return parts[0] * 60 + parts[1];
  };

  const awayIntervals = (data.vicePrincipalsAwayIntervals && data.vicePrincipalsAwayIntervals.length > 0)
    ? data.vicePrincipalsAwayIntervals
    : [{ from: data.vicePrincipalsAwayFrom || "13:00", to: data.vicePrincipalsAwayTo || "13:40" }];

  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const isTimeInInterval = (interval: { from: string; to: string }) => {
    const from = parseTime(interval.from) ?? 13 * 60;
    const to = parseTime(interval.to) ?? 13 * 60 + 40;
    return from <= to
      ? nowMinutes >= from && nowMinutes <= to
      : nowMinutes >= from || nowMinutes <= to;
  };

  const activeAwayIntervals = awayIntervals.filter(isTimeInInterval);
  const awayIntervalLabel = activeAwayIntervals.length > 0
    ? activeAwayIntervals.map((interval) => `${interval.from} - ${interval.to}`).join(" / ")
    : awayIntervals.map((interval) => `${interval.from} - ${interval.to}`).join(" / ");
  const isAwayTime = activeAwayIntervals.length > 0;
  const showVicePrincipalsCard = data.lessonsVisible !== false || data.vicePrincipalsVisible !== false || isAwayTime;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center text-foreground relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.08] blur-3xl pointer-events-none animate-glow-pulse" />
        {/* Loader */}
        <div className="relative flex flex-col items-center gap-8 animate-fade-up">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "2.5s" }} />
            <div className="absolute inset-1 rounded-full border-2 border-t-primary border-primary/10 animate-ring-spin" />
            <div className="absolute inset-4 rounded-full border border-accent/20 animate-ring-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <LucideIcons.School className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <p className="text-foreground font-black text-xl uppercase tracking-[0.25em]">
              {data.schoolName || "Yükleniyor..."}
            </p>
            <p className="text-muted-foreground text-[11px] uppercase tracking-[0.4em] font-black animate-pulse">
              Sistem Hazırlanıyor
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-64 h-1.5 bg-foreground/5 rounded-full overflow-hidden border border-border/50 p-0.5">
            <div className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-shimmer rounded-full" />
          </div>
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
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden relative font-sans">

      {/* ── Decorative Background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Violet orbs */}
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-primary/[0.08] blur-[120px] animate-glow-pulse" />
        <div className="absolute -bottom-48 -right-32 w-[500px] h-[500px] rounded-full bg-accent/[0.06] blur-[100px] animate-glow-pulse" style={{ animationDelay: "2.5s" }} />
        {/* Dot grid */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/80" />
      </div>

      {/* ── Header ── */}
      <header className="relative shrink-0 px-10 py-6 flex items-center justify-between border-b border-white/5 bg-background/40 backdrop-blur-3xl z-20">
        <div className="flex items-center gap-12">
          <TimeDisplay />

          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-md" />
              <div className="relative w-12 h-12 rounded-2xl bg-card border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden p-1.5">
                {data.logo ? (
                  <img src={data.logo} alt="School Logo" className="w-full h-full object-contain" />
                ) : (
                  <LucideIcons.School className="w-6 h-6 text-primary" />
                )}
              </div>
            </div>
            <div>
              <h1 className="text-[38px] font-bold text-foreground tracking-tighter leading-none uppercase" style={{ fontFamily: "var(--font-serif)" }}>
                {data.schoolName}
              </h1>
              <p className="text-[14px] text-muted-foreground mt-2 uppercase tracking-[0.5em] font-black opacity-40">
                Dijital Bilgilendirme Merkezi
              </p>
            </div>
          </div>
        </div>

        <DateDisplay />
      </header>

      {/* ── Ticker ── */}
      <AnnouncementTicker />

      {/* ── Main Dashboard ── */}
      <div className="flex-1 overflow-hidden p-6 flex flex-col gap-6 relative z-10">

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6">
          {data.stats
            .filter(s => s.visible !== false)
            .map((stat) => {
              let displayValue = stat.value;
              let displaySub = stat.sub;
              let shouldHide = false;

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
                  className={`group relative rounded-2xl bg-card border border-white/5 p-4 shadow-xl transition-all duration-500 hover:border-primary/20 overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity`} />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[34px] font-black text-foreground leading-none tabular-nums tracking-tighter">{displayValue}</p>
                      <p className="text-[13px] font-black text-foreground/70 mt-1 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 truncate font-black opacity-40 uppercase tracking-[0.1em]">{displaySub}</p>
                    </div>
                  </div>
                  {/* Watermark icon like snapshot */}
                  <div className="absolute -bottom-1 -right-1 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110">
                    <Icon className="w-14 h-14" />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Content Grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">

          {/* Left: Ataturk Corner */}
          {data.ataturkCornerVisible !== false && (
            <div className="col-span-3 h-full">
              <AtaturkCorner />
            </div>
          )}

          {/* Center: Schedule / VPs */}
          {showVicePrincipalsCard && (
            <div className="col-span-3 h-full rounded-2xl bg-card border border-white/5 shadow-2xl overflow-hidden flex flex-col relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
              
              {(() => {
                const awayMessage = data.vicePrincipalsAwayMessage?.trim() || "Müdür yardımcılarımız şu an odalarında bulunmamaktadır.";
                const isBreakTime = isAwayTime;
                const vicePrincipalsEnabled = data.vicePrincipalsVisible !== false;

                const dayNames: { [key: number]: keyof VicePrincipal["availability"] } = {
                  0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday"
                };
                const todayKey = dayNames[currentTime.getDay()];
                const isWeekend = todayKey === 'saturday' || todayKey === 'sunday';
                const visibleVPs = isWeekend ? [] : (todayKey ? (data.vicePrincipals || []).filter(vp => {
                  const isAvailable = !!(vp.availability as any)[todayKey];
                  return isAvailable && vp.visible !== false;
                }) : []);

                if (isAwayTime) {
                  return (
                    <>
                      <div className="px-5 py-3.5 border-b border-white/5 bg-foreground/[0.02] relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <LucideIcons.UserCheck className="w-5 h-5 text-primary" />
                          </div>
                          <h2 className="text-[14px] font-black text-foreground uppercase tracking-widest">Müsait Müdür Yardımcıları</h2>
                        </div>
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-center text-center relative z-10">
                        <div className="relative z-10 space-y-10 max-w-[280px] mx-auto">
                          <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 relative">
                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                            <LucideIcons.Clock className="w-12 h-12 text-primary relative z-10" />
                          </div>
                          <div className="space-y-6 pt-6 border-t border-white/10 relative">
                            <LucideIcons.Quote className="w-8 h-8 text-primary/10 absolute -top-4 left-1/2 -translate-x-1/2 bg-transparent px-2" />
                            <p className="text-[19px] sm:text-[22px] font-black text-foreground leading-[1.4] uppercase tracking-tight italic drop-shadow-2xl">
                              "{awayMessage}"
                            </p>
                            <div className="h-1 w-16 bg-primary/60 mx-auto rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                            <div className="pt-2">
                              <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-80">
                                DİJİTAL BİLGİLENDİRME SİSTEMİ
                              </p>
                              <p className="text-[9px] text-muted-foreground font-bold mt-2 opacity-30">© DİKMEN MTAL</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-8 px-8 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl shadow-2xl inline-flex mx-auto">
                          <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            SAAT ARALIĞI: {awayIntervalLabel}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                }

                if (vicePrincipalsEnabled) {
                  return (
                    <>
                      <div className="px-5 py-3.5 border-b border-white/5 bg-foreground/[0.02] relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <LucideIcons.UserCheck className="w-5 h-5 text-primary" />
                          </div>
                          <h2 className="text-[14px] font-black text-foreground uppercase tracking-widest">Müsait Müdür Yardımcıları</h2>
                        </div>
                      </div>
                      <div className="overflow-y-auto scrollbar-hidden flex-1 p-0 relative z-10 flex flex-col">
                        {visibleVPs.length === 0 ? (
                          <div className="flex-1 flex flex-col p-4 h-full relative group">
                            <div className="flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
                              <div className="relative z-10 space-y-10 max-w-[280px] mx-auto">
                                <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 relative">
                                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                                  <LucideIcons.Clock className="w-12 h-12 text-primary relative z-10" />
                                </div>
                                <div className="space-y-6 pt-6 border-t border-white/10 relative">
                                  <LucideIcons.Quote className="w-8 h-8 text-primary/10 absolute -top-4 left-1/2 -translate-x-1/2 bg-transparent px-2" />
                                  <p className="text-[19px] sm:text-[22px] font-black text-foreground leading-[1.4] uppercase tracking-tight italic drop-shadow-2xl">
                                    "{awayMessage}"
                                  </p>
                                  <div className="h-1 w-16 bg-primary/60 mx-auto rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                  <div className="pt-2">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-80">
                                      DİJİTAL BİLGİLENDİRME SİSTEMİ
                                    </p>
                                    <p className="text-[9px] text-muted-foreground font-bold mt-2 opacity-30">© DİKMEN MTAL</p>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-8 px-8 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl shadow-2xl inline-flex mx-auto">
                                <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                  SAAT ARALIĞI: {awayFrom} - {awayTo}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 space-y-3 bg-[#080c14]/30 flex-1">
                            {visibleVPs.map((vp) => (
                              <div key={vp.id} className="p-4 rounded-xl bg-card border border-white/5 flex items-center gap-4 hover:border-primary/30 transition-all group/vp">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover/vp:scale-105 transition-transform">
                                  <LucideIcons.User className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[17px] font-black text-foreground truncate uppercase tracking-tight">{vp.name}</p>
                                  <p className="text-[12px] text-emerald-400 font-black uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Şu An Odasında
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  );
                }

                return (
                  <>
                    <div className="px-6 py-5 border-b border-border bg-foreground/[0.02]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                          <LucideIcons.Calendar className="w-4 h-4 text-cyan-400" />
                        </div>
                        <h2 className="text-[15px] font-black text-foreground uppercase tracking-wider">Ders Akışı</h2>
                      </div>
                    </div>
                    <div className="overflow-y-auto scrollbar-hidden flex-1 p-5 space-y-4">
                      {isBreakTime ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                           <LucideIcons.Coffee className="w-10 h-10 text-cyan-500 mb-6 opacity-40 animate-pulse" />
                           <h3 className="text-xl font-black text-cyan-500 uppercase tracking-tighter mb-2">Öğle Tatili</h3>
                           <p className="text-[12px] font-black text-muted-foreground uppercase tracking-widest">Eğitime kısa bir ara verildi.</p>
                        </div>
                      ) : data.lessons.filter(l => l.visible !== false).length > 0 ? (
                        data.lessons.filter(l => l.visible !== false).map((row) => (
                          <div
                            key={row.id}
                            className={`p-5 rounded-2xl border transition-all duration-300 ${row.status === "active"
                              ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/10"
                              : "bg-foreground/[0.02] border-border hover:bg-foreground/[0.04]"
                              }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[14px] font-black font-mono text-muted-foreground tabular-nums tracking-widest">{row.time} – {row.end}</span>
                              <LessonStatusBadge status={row.status} />
                            </div>
                            <h3 className="text-[20px] font-black text-foreground leading-tight mb-2 uppercase tracking-tight">{row.lesson}</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-[14px] text-muted-foreground font-black uppercase tracking-widest truncate max-w-[140px] opacity-70">{row.teacher}</span>
                              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[12px] font-black uppercase">{row.class}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-20 gap-4 py-20 grayscale">
                          <LucideIcons.FileSearch className="w-14 h-14" />
                          <p className="text-[12px] font-black uppercase tracking-[0.3em]">Aktif Ders Yok</p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Right: Duty Schedule & Teachers */}
          <div className={`${(data.ataturkCornerVisible === false && data.lessonsVisible === false && !data.vicePrincipalsVisible) ? 'col-span-12' : (data.ataturkCornerVisible === false || (data.lessonsVisible === false && !data.vicePrincipalsVisible)) ? 'col-span-9' : 'col-span-6'} flex flex-col gap-6 h-full`}>

            {/* Nöbetçiler - Back to Top */}
            <div className="rounded-2xl bg-card border border-white/5 shadow-2xl p-6 relative overflow-hidden group/duty shrink-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <LucideIcons.ShieldCheck className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-black text-foreground uppercase tracking-tight">Günün Nöbetçileri</h2>
                    <p className="text-[12px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">Güvenlik ve Düzen Çizelgesi</p>
                  </div>
                </div>
                <div className="bg-foreground/[0.03] px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Bugün */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Aktif Görevliler</h3>
                  </div>

                  <div className="space-y-3">
                    {data.dutyOfficers
                      .filter(o => o.date === todayStr && o.visible !== false)
                      .map((o) => (
                        <div
                          key={o.id}
                          className="flex items-center gap-4 p-4 rounded-xl border bg-foreground/[0.02] border-white/5 hover:border-emerald-500/30 transition-all group/item"
                        >
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl font-black shrink-0 border border-amber-500/10">
                            {o.name[0].toLowerCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[18px] font-black text-foreground truncate uppercase">{o.name}</p>
                            <p className="text-[12px] text-muted-foreground font-black mt-1.5 uppercase tracking-widest opacity-60">{o.area}</p>
                          </div>
                          <div className="flex flex-col items-end shrink-0 gap-1.5">
                            <span className="text-[9px] text-muted-foreground font-black bg-foreground/5 py-1 px-2 rounded-md border border-white/5">{o.shift}</span>
                            <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                              Çalışıyor
                            </span>
                          </div>
                        </div>
                      ))}
                    {data.dutyOfficers.filter(o => o.date === todayStr && o.visible !== false).length === 0 && (
                      <div className="py-10 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center text-muted-foreground/20 gap-3">
                        <LucideIcons.UserX className="w-8 h-8 opacity-40" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Kayıt Yok</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Yarın */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-30">Yarınki Plan</h3>
                  </div>

                  <div className="space-y-3 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {data.dutyOfficers
                      .filter(o => o.date === tomorrowStr && o.visible !== false)
                      .map((o) => (
                        <div
                          key={o.id}
                          className="flex items-center gap-4 p-4 rounded-xl border bg-foreground/[0.01] border-white/5"
                        >
                          <div className="w-12 h-12 rounded-xl bg-muted text-muted-foreground flex items-center justify-center text-xl font-black shrink-0">
                            {o.name[0].toLowerCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[18px] font-black text-foreground truncate uppercase">{o.name}</p>
                            <p className="text-[12px] text-muted-foreground font-black mt-1.5 uppercase tracking-widest">{o.area}</p>
                          </div>
                          <div className="flex flex-col items-end shrink-0 gap-1.5">
                            <span className="text-[9px] text-muted-foreground font-black bg-foreground/5 py-1 px-2 rounded-md border border-white/5">{o.shift}</span>
                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-30">Beklemede</span>
                          </div>
                        </div>
                      ))}
                    {data.dutyOfficers.filter(o => o.date === tomorrowStr && o.visible !== false).length === 0 && (
                      <div className="py-10 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center text-muted-foreground/10">
                        <span className="text-[9px] font-black uppercase tracking-widest">Planlanmadı</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Marquee - Back to Bottom */}
            <div className="flex-1 min-h-0">
              <TeachersVerticalMarquee />
            </div>

          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <Footer text={data.footerText} />

    </div>
  );
}
