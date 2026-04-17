import { LucideIcon } from "lucide-react";

export type LessonStatus = "done" | "active" | "next" | "upcoming";

export interface Lesson {
  id: string;
  time: string;
  end: string;
  lesson: string;
  teacher: string;
  class: string;
  room: string;
  status: LessonStatus;
}

export interface Announcement {
  id: string;
  title: string;
  desc: string;
  type: "Önemli" | "Bilgi" | "Sınav" | "Etkinlik";
  icon: string;
  date: string;
}

export interface DutyOfficer {
  id: string;
  name: string;
  area: string;
  shift: string;
  active: boolean;
  date: string; // YYYY-MM-DD format
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  sub: string;
  iconName: string; // Dynamic icon name to be mapped
  gradient: string;
  shadowColor: string;
}

export interface CalendarEvent {
  id: string;
  day: number;
  month: number;
  year: number;
  label: string;
  color: "rose" | "amber" | "violet" | "cyan";
}

export interface Department {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
}

export interface SchoolData {
  stats: StatItem[];
  lessons: Lesson[];
  announcements: Announcement[];
  dutyOfficers: DutyOfficer[];
  calendarEvents: CalendarEvent[];
  departments: Department[];
  teachers: Teacher[];
  schoolName: string;
}

