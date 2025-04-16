import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-100 p-4 shadow-md">
      <h2 className="text-xl font-bold mb-6">DevLogs</h2>
      <nav className="flex flex-col gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/profile">Profile</Link>
      </nav>
    </div>
  );
}

