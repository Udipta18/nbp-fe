"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Upload, CheckCircle, AlertCircle, Loader2, X, MapPin, Briefcase, User, Mail, Globe, Phone as PhoneIcon, Building, FileText, Image as ImageIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { providerService } from "@/lib/provider-service";
import { LocationPicker } from "@/components/features/LocationPicker";
import type { CreateProviderData } from "@/types/api";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from "framer-motion";

export default function BecomeProviderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // 1. Form Validation
        if (formRef.current && !formRef.current.checkValidity()) {
            const firstInvalid = formRef.current.querySelector(':invalid') as HTMLElement;
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
            formRef.current.reportValidity();
            return false;
        }

        setLoading(true);
        setProgress(0);
        setError(null);

        // Simulate progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + 10;
            });
        }, 500);

        try {
            const response = await providerService.createProvider(formData);

            clearInterval(interval);
            setProgress(100);

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/");
                }, 3000);
                return true;
            } else {
                setError(response.error?.message || "Failed to submit application");
                setLoading(false);
                return false;
            }
        } catch (err: any) {
            clearInterval(interval);
            setError(err.message || "An error occurred");
            setLoading(false);
            return false;
        }
    };

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
        "Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry",
        "AC Repair", "Ambulance", "Car Service", "Car Wash", "Pharmacy", "Grocery",
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
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Gallery state - Single source of truth to prevent desync
    const [galleryItems, setGalleryItems] = useState<{ id: string; file: File; preview: string }[]>([]);

    const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const filesArray = Array.from(selectedFiles);
        const currentCount = galleryItems.length;

        if (currentCount + filesArray.length > 6) {
            setError(`Maximum 6 images allowed. You can add ${6 - currentCount} more.`);
            if (e.target) e.target.value = "";
            return;
        }

        setError(null);

        try {
            const newItems = await Promise.all(
                filesArray.map(file =>
                    new Promise<{ id: string; file: File; preview: string }>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve({
                            id: Math.random().toString(36).substring(7),
                            file,
                            preview: reader.result as string
                        });
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    })
                )
            );

            // Update state with new items
            const updatedGallery = [...galleryItems, ...newItems];
            setGalleryItems(updatedGallery);

            // Sync form data directly from the unified state
            setFormData(prev => ({
                ...prev,
                gallery_images: updatedGallery.map(item => item.file)
            }));

        } catch (err) {
            console.error("Error reading gallery files:", err);
            setError("Failed to load images. Please try again.");
        } finally {
            if (e.target) e.target.value = "";
        }
    };

    const removeGalleryImage = (index: number) => {
        const updatedGallery = galleryItems.filter((_, i) => i !== index);
        setGalleryItems(updatedGallery);
        setFormData(prev => ({
            ...prev,
            gallery_images: updatedGallery.map(item => item.file)
        }));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-slate-50 border border-slate-100"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-200"
                    >
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Application Sent!</h2>
                        <p className="text-slate-500 mt-2 text-lg">We'll review your details and get back to you shortly.</p>
                    </div>
                    <Link href="/" className="block">
                        <Button className="w-full h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-lg">
                            Back to Home
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header - Sticky on Mobile */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Back</span>
                    </Link>
                    <h1 className="font-bold text-slate-900 hidden md:block">Provider Application</h1>
                    <div className="w-8 md:hidden" /> {/* Spacer for centering if needed */}
                </div>
                {/* Progress Line */}
                {loading && (
                    <motion.div
                        className="absolute bottom-0 left-0 h-[2px] bg-blue-600 z-50"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                    />
                )}
            </header>

            <main className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Hero Section */}
                    <motion.div variants={itemVariants} className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Join <span className="text-blue-600">LocalServe</span> as a Pro.
                        </h1>
                        <p className="mt-4 text-xl text-slate-500 max-w-2xl">
                            Expand your business reach. Connect with thousands of local customers looking for your services.
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div variants={itemVariants} className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <p className="font-medium text-sm">{error}</p>
                        </motion.div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 relative">
                        {/* 1. Basic Info */}
                        <Section title="Basic Information" icon={User} description="Tell us about yourself and your business">
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Building} label="Business Name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. Rapid Plumbing Services" />
                                <InputField icon={PhoneIcon} label="Phone Number" name="phone" required type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" />
                                <InputField icon={Mail} label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="contact@business.com" />
                                <InputField icon={Globe} label="Website (Optional)" name="website" type="url" value={formData.website} onChange={handleInputChange} placeholder="https://..." />
                            </div>
                        </Section>

                        {/* 2. Service Details */}
                        <Section title="Service Details" icon={Briefcase} description="What kind of services do you offer?">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <SelectField label="Category" name="category" required value={formData.category} onChange={handleInputChange} options={categories} />
                                <InputField icon={Briefcase} label="Years of Experience" name="experience_years" type="number" value={formData.experience_years || ""} onChange={handleInputChange} placeholder="e.g. 5" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Description</label>
                                <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none text-slate-900 placeholder:text-slate-400 shadow-sm" placeholder="Describe your services, expertise, and what makes you unique..." />
                            </div>
                        </Section>

                        {/* 3. Location */}
                        <Section title="Coverage Area" icon={MapPin} description="Where are you located?">
                            <div className="space-y-6">
                                <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                                    <LocationPicker
                                        value={formData.latitude && formData.longitude ? { lat: formData.latitude, lng: formData.longitude } : undefined}
                                        onChange={(lat, lng) => {
                                            setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                                            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`).then(res => res.json()).then(data => {
                                                if (data.address) {
                                                    const city = data.address.city || data.address.town || "";
                                                    const zip = data.address.postcode || "";
                                                    setFormData(prev => ({ ...prev, address: data.display_name.split(",")[0], city, zip_code: zip }));
                                                }
                                            });
                                        }}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <SelectField label="Ward Number" name="ward_number" required value={formData.ward_number || ""} onChange={handleInputChange} options={Array.from({ length: 20 }, (_, i) => `Ward ${i + 1}`)} optionValues={Array.from({ length: 20 }, (_, i) => i + 1)} />
                                    <InputField icon={MapPin} label="Street Address" name="address" value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                                    <InputField label="State" name="state" value={formData.state} onChange={handleInputChange} required />
                                    <InputField label="ZIP Code" name="zip_code" value={formData.zip_code} onChange={handleInputChange} required />
                                </div>
                            </div>
                        </Section>

                        {/* 4. Media */}
                        <Section title="Photos & Verification" icon={ImageIcon} description="Add photos to build trust">
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Profile Photo */}
                                <div className="lg:col-span-1 space-y-4">
                                    <label className="block text-sm font-semibold text-slate-700">Profile Photo</label>
                                    <div className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-blue-500 bg-blue-50/20' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
                                        {imagePreview ? (
                                            <div className="absolute inset-0 p-2">
                                                <img src={imagePreview} className="w-full h-full object-cover rounded-xl shadow-sm" alt="Profile" />
                                                <button type="button" onClick={() => { setImagePreview(null); setFormData(p => ({ ...p, image: undefined })); }} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-slate-700 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer text-center p-6 w-full h-full flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400"><User className="h-6 w-6" /></div>
                                                <span className="text-sm font-medium text-slate-600">Upload Photo</span>
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Gallery */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-semibold text-slate-700">Work Gallery <span className="text-slate-400 font-normal">({galleryItems.length}/6)</span></label>
                                    </div>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        <AnimatePresence>
                                            {galleryItems.map((item, idx) => (
                                                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group shadow-sm">
                                                    <img src={item.preview} className="w-full h-full object-cover" alt="Gallery" />
                                                    <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"><X className="h-3 w-3" /></button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {galleryItems.length < 6 && (
                                            <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-slate-50 transition-all flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-blue-500">
                                                <Upload className="h-6 w-6 mb-1" />
                                                <span className="text-[10px] font-bold uppercase tracking-wide">Add</span>
                                                <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Submit Area - STATIC on Mobile, FLOATING on Desktop */}
                        <div className="pt-8 pb-4 md:pb-0">
                            {/* Mobile Layout: Slide to Submit */}
                            <div className="md:hidden space-y-6 pt-4 pb-8">
                                <SlideToSubmit onConfirm={() => handleSubmit()} isLoading={loading} progress={progress} />
                                <button type="button" onClick={() => router.push('/')} className="w-full text-center text-slate-400 font-medium text-sm py-2">
                                    Cancel Application
                                </button>
                            </div>

                            {/* Desktop Layout: Floating Command Bar */}
                            <div className="hidden md:flex fixed bottom-10 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-full p-2 pl-8 items-center gap-8 pr-2 ring-1 ring-slate-200/50">
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                            <span>Syncing data... <span className="text-slate-900 font-bold">{progress}%</span></span>
                                        </>
                                    ) : (
                                        <span>Ready to launch your business?</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button type="button" variant="ghost" onClick={() => router.push('/')} className="rounded-full px-5 text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 font-medium transition-colors">
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-full px-8 py-6 bg-slate-900 text-white font-bold text-base shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 ring-1 ring-white/10"
                                    >
                                        {loading ? "Processing..." : "Submit Application"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}

// Sub-components for cleaner code
function Section({ title, icon: Icon, description, children }: { title: string, icon: any, description: string, children: React.ReactNode }) {
    return (
        <motion.section
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100/50"
        >
            <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{description}</p>
                </div>
            </div>
            {children}
        </motion.section>
    );
}

function InputField({ label, icon: Icon, className, ...props }: any) {
    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-semibold text-slate-700">{label} {props.required && <span className="text-red-500">*</span>}</label>
            <div className="relative group">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />}
                <input
                    {...props}
                    className={`
                        w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-xl 
                        bg-white border border-slate-200 
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                        transition-all outline-none 
                        text-slate-900 placeholder:text-slate-400 
                        shadow-sm group-hover:border-slate-300
                    `}
                />
            </div>
        </div>
    );
}

function SlideToSubmit({ onConfirm, isLoading, progress }: { onConfirm: () => Promise<boolean>, isLoading: boolean, progress: number }) {
    const controls = useAnimation();
    const x = useMotionValue(0);
    const [constraints, setConstraints] = useState({ width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Animations mapped to drag position
    const backgroundOpacity = useTransform(x, [0, constraints.width - 70], [1, 0]);
    const trackColor = useTransform(x, [0, constraints.width - 70], ["#0f172a", "#2563eb"]); // slate-900 to blue-600
    const textScale = useTransform(x, [0, constraints.width / 2], [1, 0.9]);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateConstraints = () => {
            if (containerRef.current) {
                setConstraints({ width: containerRef.current.offsetWidth });
            }
        };

        // Initial measurement
        updateConstraints();

        // Observe resize for responsive layouts
        const resizeObserver = new ResizeObserver(updateConstraints);
        resizeObserver.observe(containerRef.current);

        // Window resize fallback
        window.addEventListener('resize', updateConstraints);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateConstraints);
        };
    }, []);

    const handleDragEnd = async () => {
        if (x.get() > constraints.width - 80) { // Threshold to trigger
            const success = await onConfirm();
            if (!success) {
                controls.start({ x: 0 }); // Snap back on validation failure
            }
        } else {
            controls.start({ x: 0 }); // Snap back if threshold not met
        }
    };

    return (
        <div className="relative h-20 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-slate-900/5 select-none touch-none" ref={containerRef}>
            {/* Background Track */}
            <motion.div
                style={{ backgroundColor: trackColor }}
                className="absolute inset-0 flex items-center justify-center transition-colors"
            >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        {/* Progress Bar Background */}
                        <div className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />

                        {/* Text */}
                        <span className="text-white font-bold text-lg tracking-widest relative z-10 drop-shadow-sm">
                            {progress < 100 ? `SYNCING ${progress}%` : "COMPLETE"}
                        </span>
                    </motion.div>
                ) : (
                    <motion.span
                        style={{ opacity: backgroundOpacity, scale: textScale }}
                        className="text-white/40 font-bold text-lg tracking-[0.2em] uppercase ml-12"
                    >
                        Slide to Submit &gt;&gt;
                    </motion.span>
                )}
            </motion.div>

            {/* Draggable Handle */}
            <motion.div
                drag={isLoading ? false : "x"} // Disable drag when loading
                dragConstraints={{ left: 0, right: Math.max(0, constraints.width - 76) }}
                dragElastic={0.05}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x }}
                whileTap={{ scale: 1.05, cursor: "grabbing" }}
                className={`absolute left-2 top-2 bottom-2 w-[72px] bg-white rounded-[2rem] flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.2)] cursor-grab z-20 group touch-none ${isLoading ? 'cursor-wait' : ''}`}
            >
                {isLoading ? (
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" />
                        <Loader2 className="animate-spin text-blue-600 h-6 w-6 relative z-10" />
                    </div>
                ) : (
                    <ChevronRight className="h-8 w-8 text-slate-900 group-hover:text-blue-600 transition-colors" />
                )}
            </motion.div>
        </div>
    );
}

function SelectField({ label, options, optionValues, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">{label} {props.required && <span className="text-red-500">*</span>}</label>
            <div className="relative">
                <select
                    {...props}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-900 shadow-sm appearance-none"
                >
                    <option value="">Select...</option>
                    {options.map((opt: string, i: number) => (
                        <option key={opt} value={optionValues ? optionValues[i] : opt}>{opt}</option>
                    ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 rotate-90 pointer-events-none" />
            </div>
        </div>
    );
}
