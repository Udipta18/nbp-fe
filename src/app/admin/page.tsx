import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import providers from "@/data/providers.json";
import Link from "next/link";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col p-6">
                <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-4">
                    <a href="#" className="block py-2 px-4 bg-slate-800 rounded">Providers</a>
                    <a href="#" className="block py-2 px-4 hover:bg-slate-800 rounded opacity-70">Bookings</a>
                    <a href="#" className="block py-2 px-4 hover:bg-slate-800 rounded opacity-70">Users</a>
                    <a href="#" className="block py-2 px-4 hover:bg-slate-800 rounded opacity-70">Settings</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Manage Providers</h1>
                    <Button>+ Add New Provider</Button>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Approved Providers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-muted-foreground uppercase">
                                        <tr>
                                            <th className="px-6 py-3">Name</th>
                                            <th className="px-6 py-3">Category</th>
                                            <th className="px-6 py-3">Rating</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {providers.map((p) => (
                                            <tr key={p.id} className="border-b hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium">{p.name}</td>
                                                <td className="px-6 py-4">{p.category}</td>
                                                <td className="px-6 py-4">{p.rating} ⭐</td>
                                                <td className="px-6 py-4">
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button variant="ghost" size="sm">Edit</Button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="border-b bg-yellow-50/50">
                                            <td className="px-6 py-4 font-medium">New Plumber Request</td>
                                            <td className="px-6 py-4">Plumbing</td>
                                            <td className="px-6 py-4">-</td>
                                            <td className="px-6 py-4"><Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge></td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700">Approve</Button>
                                                <Button size="sm" variant="destructive" className="h-8">Reject</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
