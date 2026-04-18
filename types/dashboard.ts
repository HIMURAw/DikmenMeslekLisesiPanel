export interface Announcement {
  id: string;
  title: string;
  desc: string;
  date: string;
  icon: string;
  type: "Bilgi" | "Önemli" | "Sınav" | "Etkinlik";
  visible?: boolean;
}

export interface Lesson {
  id: string;
  time: string;
  end: string;
  lesson: string;
  teacher: string;
  class: string;
  room: string;
  status: "active" | "upcoming" | "finished";
  visible?: boolean;
}

export interface DutyOfficer {
  id: string;
  name: string;
  area: string;
  shift: string;
  active: boolean;
  date: string;
  visible?: boolean;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  sub: string;
  iconName: string;
  gradient: string;
  shadowColor: string;
  visible?: boolean;
}

export interface CalendarEvent {
  id: string;
  day: number;
  month: number;
  year: number;
  label: string;
  color: string;
  visible?: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  iconName: string;
  visible: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  visible: boolean;
}

export type LessonStatus = "active" | "upcoming" | "finished";

export interface VicePrincipal {
  id: string;
  name: string;
  visible?: boolean;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

export interface SchoolData {
  stats: StatItem[];
  lessons: Lesson[];
  announcements: Announcement[];
  dutyOfficers: DutyOfficer[];
  calendarEvents: CalendarEvent[];
  departments: Department[];
  teachers: Teacher[];
  classes: string[];
  schoolName: string;
  logo?: string;
  lessonsVisible: boolean;
  vicePrincipalsVisible: boolean;
  ataturkCornerVisible: boolean;
  footerText: string;
  ataturkImages: string[];
  ataturkInterval: number;
  vicePrincipals: VicePrincipal[];
}
