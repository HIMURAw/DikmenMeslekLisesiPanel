import DutyCard from "@/components/duty-card"
import LessonTable from "@/components/lesson-table"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Okul Paneli
      </h1>

      <DutyCard />

      <LessonTable />

    </div>
  )
}