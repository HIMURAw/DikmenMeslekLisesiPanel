import Link from "next/link"

export default function Sidebar() {

  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-6">

      <h2 className="text-xl font-bold mb-6">
        Okul Panel
      </h2>

      <nav className="space-y-4">

        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/admin">
          Admin
        </Link>

      </nav>

    </div>
  )
}