"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providerService } from "@/lib/provider-service";
import { LocationPicker } from "@/components/features/LocationPicker";
import type { CreateProviderData } from "@/types/api";

export default function BecomeProviderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateProviderData>({
        name: "",
        phone: "",
        category: "",
        description: "",
        email: "",
        website: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        ward_number: 0,
    });

    const categories = [
        "Plumbing",
        "Electrical",
        "Cleaning",
        "Painting",
        "Carpentry",
        "AC Repair",
        "Ambulance",
        "Car Service",
        "Car Wash",
        "Pharmacy",
        "Grocery",
    ];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const numericFields = ['experience_years', 'latitude', 'longitude', 'ward_number'];

        setFormData((prev) => ({
            ...prev,
            [name]: numericFields.includes(name) ? parseFloat(value) || undefined : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await providerService.createProvider(formData);

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } else {
                setError(response.error?.message || "Failed to submit application");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center">
                    <CardContent className="pt-12 pb-8">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            Application Submitted!
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Your provider application has been submitted successfully. Our team will review it and get back to you soon.
                        </p>
                        <Link href="/">
                            <Button>Return to Home</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="container px-4 py-4 flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span className="font-bold text-xl text-blue-600">LocalServe</span>
                    </Link>
                </div>
            </header>

            {/* Form */}
            <div className="container max-w-2xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Become a Service Provider
                    </h1>
                    <p className="text-slate-600">
                        Join our platform and connect with customers in New Barrackpore
                    </p>
                </div>

                {error ? (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                            <p className="font-semibold text-red-900">Error</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                ) : null}

                <Card>
                    <CardHeader>
                        <CardTitle>Provider Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Business Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                    Business Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Amit's Super Electric"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+91 98000 00000"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                                    Service Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Ward Number */}
                            <div>
                                <label htmlFor="ward_number" className="block text-sm font-medium text-slate-700 mb-2">
                                    Ward Number <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="ward_number"
                                    name="ward_number"
                                    required
                                    value={formData.ward_number || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select your ward</option>
                                    {Array.from({ length: 20 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            Ward {i + 1}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-1">
                                    Select the ward where your business is located
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Tell customers about your services and experience..."
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="your@email.com"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-2">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Shop 12, Main Market"
                                />
                            </div>

                            {/* City, State, ZIP in a grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="New Barrackpore"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="West Bengal"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="zip_code" className="block text-sm font-medium text-slate-700 mb-2">
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        id="zip_code"
                                        name="zip_code"
                                        value={formData.zip_code}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="700131"
                                    />
                                </div>
                            </div>

                            {/* Location Picker */}
                            <div>
                                <LocationPicker
                                    value={formData.latitude && formData.longitude ? { lat: formData.latitude, lng: formData.longitude } : undefined}
                                    onChange={(lat, lng) => {
                                        // Update coordinates
                                        setFormData(prev => ({
                                            ...prev,
                                            latitude: lat,
                                            longitude: lng
                                        }));

                                        // Reverse geocoding to get address details
                                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data.address) {
                                                    // Extract address components
                                                    const street = data.address.road || data.address.pedestrian || data.address.suburb || "";
                                                    const houseNumber = data.address.house_number || "";
                                                    const fullStreet = [houseNumber, street].filter(Boolean).join(" ");

                                                    const city = data.address.city || data.address.town || data.address.village || data.address.county || "";
                                                    const state = data.address.state || "";
                                                    const zip = data.address.postcode || "";

                                                    setFormData(prev => ({
                                                        ...prev,
                                                        address: fullStreet || data.display_name.split(",")[0],
                                                        city: city,
                                                        state: state,
                                                        zip_code: zip
                                                    }));
                                                }
                                            })
                                            .catch(err => console.error("Reverse geocoding failed", err));
                                    }}
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Tip: Pinning your location will automatically fill your address details.
                                </p>
                            </div>

                            {/* Experience Years */}
                            <div>
                                <label htmlFor="experience_years" className="block text-sm font-medium text-slate-700 mb-2">
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    id="experience_years"
                                    name="experience_years"
                                    min="0"
                                    step="1"
                                    value={formData.experience_years || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="10"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Profile Image
                                </label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                    {imagePreview ? (
                                        <div className="space-y-4">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="mx-auto h-32 w-32 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setFormData((prev) => ({ ...prev, image: undefined }));
                                                }}
                                            >
                                                Remove Image
                                            </Button>
                                        </div>
                                    ) : (
                                        <label htmlFor="image" className="cursor-pointer">
                                            <Upload className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-600 mb-1">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                                            <input
                                                type="file"
                                                id="image"
                                                name="image"
                                                accept="image/jpeg,image/png"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Link href="/" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Your application will be reviewed by our team</li>
                        <li>• We'll verify your credentials and contact information</li>
                        <li>• Once approved, you'll be listed on our platform</li>
                        <li>• Start receiving bookings from customers!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
