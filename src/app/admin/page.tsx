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
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex gap-4">
                    {/* Provider Image */}
                    <div className="flex-shrink-0">
                        {provider.image_url ? (
                            <img
                                src={provider.image_url}
                                alt={provider.name}
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-lg bg-slate-200 flex items-center justify-center">
                                <Users className="h-12 w-12 text-slate-400" />
                            </div>
                        )}
                    </div>

                    {/* Provider Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 truncate">
                                    {provider.name}
                                </h3>
                                <Badge className="mt-1">{provider.category}</Badge>
                            </div>
                            <Badge
                                variant={
                                    provider.status === "APPROVED"
                                        ? "default"
                                        : provider.status === "REJECTED"
                                            ? "destructive"
                                            : "secondary"
                                }
                            >
                                {provider.status}
                            </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-slate-600 mb-3">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{provider.phone}</span>
                            </div>
                            {provider.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{provider.email}</span>
                                </div>
                            )}
                            {(provider.city || provider.state) && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                        {[provider.city, provider.state].filter(Boolean).join(", ")}
                                    </span>
                                </div>
                            )}
                            {provider.experience_years && (
                                <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    <span>{provider.experience_years} years experience</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Applied: {new Date(provider.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {provider.description && (
                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                {provider.description}
                            </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                            {provider.status === "PENDING" && (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() => handleApprove(provider.id)}
                                        disabled={actionLoading === provider.id}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleReject(provider.id)}
                                        disabled={actionLoading === provider.id}
                                    >
                                        <XCircle className="h-4 w-4 mr-1" />
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
                                >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                </Button>
                            )}
                            {provider.status === "REJECTED" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApprove(provider.id)}
                                    disabled={actionLoading === provider.id}
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(provider.id)}
                                disabled={actionLoading === provider.id}
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                            </Button>
                            {provider.website && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                >
                                    <a href={provider.website} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        Website
                                    </a>
                                </Button>
                            )}
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
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-700">Admin Dashboard</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Site
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
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
