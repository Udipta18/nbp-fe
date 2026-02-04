"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Users,
    CheckCircle,
    XCircle,
    Clock,
    LogOut,
    Trash2,
    Eye,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Award,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/lib/auth";
import { providerService } from "@/lib/provider-service";
import type { Provider, AdminStats } from "@/types/api";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [pendingProviders, setPendingProviders] = useState<Provider[]>([]);
    const [approvedProviders, setApprovedProviders] = useState<Provider[]>([]);
    const [rejectedProviders, setRejectedProviders] = useState<Provider[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

    useEffect(() => {
        checkAuth();
        loadData();
    }, []);

    const checkAuth = async () => {
        const user = await authService.getCurrentUser();
        if (!user || user.role !== "admin") {
            router.push("/login");
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);

            // Load stats
            try {
                const statsResponse = await providerService.getAdminStats();
                if (statsResponse.success && statsResponse.data) {
                    setStats(statsResponse.data);
                }
            } catch (e) {
                console.log("Failed to load stats");
            }

            // Load pending providers
            try {
                const pendingResponse = await providerService.getPendingProviders({ limit: 50 });
                if (pendingResponse.success && pendingResponse.data) {
                    setPendingProviders(pendingResponse.data);
                }
            } catch (e) {
                console.log("Failed to load pending providers");
            }

            // Load approved providers
            try {
                const approvedResponse = await providerService.getAdminProviders({
                    status: "APPROVED",
                    limit: 50,
                });
                if (approvedResponse.success && approvedResponse.data) {
                    setApprovedProviders(approvedResponse.data);
                }
            } catch (e) {
                console.log("Failed to load approved providers");
            }

            // Load rejected providers
            try {
                const rejectedResponse = await providerService.getAdminProviders({
                    status: "REJECTED",
                    limit: 50,
                });
                if (rejectedResponse.success && rejectedResponse.data) {
                    setRejectedProviders(rejectedResponse.data);
                }
            } catch (e) {
                console.log("Failed to load rejected providers");
            }
        } catch (err: any) {
            console.error("Failed to load data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setActionLoading(id);
        try {
            const response = await providerService.approveProvider(id);
            if (response.success) {
                await loadData();
            } else {
                alert(response.error?.message || "Failed to approve provider");
            }
        } catch (err: any) {
            alert(err.message || "An error occurred");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Are you sure you want to reject this provider?")) return;

        setActionLoading(id);
        try {
            const response = await providerService.rejectProvider(id);
            if (response.success) {
                await loadData();
            } else {
                alert(response.error?.message || "Failed to reject provider");
            }
        } catch (err: any) {
            alert(err.message || "An error occurred");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this provider? This action cannot be undone.")) return;

        setActionLoading(id);
        try {
            const response = await providerService.deleteProvider(id);
            if (response.success) {
                await loadData();
            } else {
                alert(response.error?.message || "Failed to delete provider");
            }
        } catch (err: any) {
            alert(err.message || "An error occurred");
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        router.push("/login");
    };

    const ProviderCard = ({ provider }: { provider: Provider }) => (
        <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200 overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                    {/* Left: Image & Identity */}
                    <div className="p-5 sm:w-48 flex flex-col items-center sm:items-start border-b sm:border-b-0 sm:border-r border-slate-100 bg-slate-50/50">
                        <div className="relative mb-3">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm ring-4 ring-white">
                                {provider.image_url ? (
                                    <img
                                        src={provider.image_url}
                                        alt={provider.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                        <Users className="h-10 w-10 text-slate-400" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2">
                                <Badge
                                    className={`shadow-sm border-2 border-white ${provider.status === "APPROVED" ? "bg-green-500 hover:bg-green-600" :
                                            provider.status === "REJECTED" ? "bg-red-500 hover:bg-red-600" :
                                                "bg-yellow-500 hover:bg-yellow-600"
                                        }`}
                                >
                                    {provider.status === "APPROVED" ? <CheckCircle className="h-3 w-3" /> :
                                        provider.status === "REJECTED" ? <XCircle className="h-3 w-3" /> :
                                            <Clock className="h-3 w-3" />}
                                </Badge>
                            </div>
                        </div>
                        <div className="text-center sm:text-left w-full">
                            <h3 className="font-bold text-slate-900 truncate mb-1">{provider.name}</h3>
                            <Badge variant="outline" className="bg-white">{provider.category}</Badge>
                        </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4">
                            <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                                    <Phone className="h-3.5 w-3.5" />
                                </div>
                                <span className="font-medium">{provider.phone}</span>
                            </div>

                            {provider.email && (
                                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
                                        <Mail className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="truncate">{provider.email}</span>
                                </div>
                            )}

                            {(provider.city || provider.state) && (
                                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                                        <MapPin className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="truncate">{[provider.city, provider.state].filter(Boolean).join(", ")}</span>
                                </div>
                            )}

                            {provider.experience_years && (
                                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
                                        <Award className="h-3.5 w-3.5" />
                                    </div>
                                    <span>{provider.experience_years} Years Exp.</span>
                                </div>
                            )}
                        </div>

                        {/* Description Quote */}
                        {provider.description && (
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                                <p className="text-sm text-slate-600 italic line-clamp-2">
                                    "{provider.description}"
                                </p>
                            </div>
                        )}

                        {/* Action Bar */}
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                            <div className="flex-1 flex gap-2">
                                {provider.status === "PENDING" && (
                                    <>
                                        <Button
                                            size="sm"
                                            onClick={() => handleApprove(provider.id)}
                                            disabled={actionLoading === provider.id}
                                            className="bg-green-600 hover:bg-green-700 h-9 px-4"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleReject(provider.id)}
                                            disabled={actionLoading === provider.id}
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 h-9"
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                                {provider.status === "APPROVED" && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReject(provider.id)}
                                        disabled={actionLoading === provider.id}
                                        className="text-orange-600 hover:bg-orange-50 border-orange-200 h-9 ml-auto sm:ml-0"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Revoke Approval
                                    </Button>
                                )}
                                {provider.status === "REJECTED" && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleApprove(provider.id)}
                                        disabled={actionLoading === provider.id}
                                        className="text-green-600 hover:bg-green-50 border-green-200 h-9"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Re-Approve
                                    </Button>
                                )}
                            </div>

                            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-auto">
                                {provider.website && (
                                    <Button size="icon" variant="ghost" asChild className="h-9 w-9 text-slate-500">
                                        <a href={provider.website} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(provider.id)}
                                    disabled={actionLoading === provider.id}
                                    className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="container px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2 group">
                                <span className="font-bold text-xl text-blue-600">LocalServe</span>
                                <span className="text-slate-400 hidden sm:inline">|</span>
                                <span className="text-slate-700 hidden sm:inline">Admin Dashboard</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link href="/">
                                <Button variant="outline" size="sm" className="hidden sm:flex">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Site
                                </Button>
                                <Button variant="outline" size="icon" className="flex sm:hidden">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleLogout} className="flex sm:hidden">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Pending Approval
                            </CardTitle>
                            <Clock className="h-5 w-5 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">
                                {stats?.providers.pending || 0}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Awaiting review</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Approved Providers
                            </CardTitle>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">
                                {stats?.providers.approved || 0}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Active on platform</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Rejected
                            </CardTitle>
                            <XCircle className="h-5 w-5 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">
                                {stats?.providers.rejected || 0}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Not approved</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Providers Tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Provider Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as "pending" | "approved" | "rejected")}>
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="pending" className="gap-2">
                                    <Clock className="h-4 w-4" />
                                    Pending ({pendingProviders.length})
                                </TabsTrigger>
                                <TabsTrigger value="approved" className="gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Approved ({approvedProviders.length})
                                </TabsTrigger>
                                <TabsTrigger value="rejected" className="gap-2">
                                    <XCircle className="h-4 w-4" />
                                    Rejected ({rejectedProviders.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="pending" className="space-y-4">
                                {pendingProviders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500">No pending applications</p>
                                    </div>
                                ) : (
                                    pendingProviders.map((provider) => (
                                        <ProviderCard key={provider.id} provider={provider} />
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="approved" className="space-y-4">
                                {approvedProviders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500">No approved providers</p>
                                    </div>
                                ) : (
                                    approvedProviders.map((provider) => (
                                        <ProviderCard key={provider.id} provider={provider} />
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="rejected" className="space-y-4">
                                {rejectedProviders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <XCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500">No rejected providers</p>
                                    </div>
                                ) : (
                                    rejectedProviders.map((provider) => (
                                        <ProviderCard key={provider.id} provider={provider} />
                                    ))
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
