// Tag type from API
export interface Tag {
    slug: string;
    display_name: string;
    icon: string;
    color: string;
    category_specific: string[] | null;
}

// All valid tag slugs
export type TagSlug =
    | 'verified' | '5_star' | '24x7' | 'upi_accepted'
    | 'free_delivery' | 'veg_only' | 'home_cooked'
    | 'same_day' | 'insured' | 'govt_certified' | 'emergency_available'
    | 'mbbs' | 'video_consult' | 'home_visit'
    | 'icu_equipped' | 'oxygen';

// Tag colors for badges (Tailwind CSS)
// Tag colors for badges (Premium Palette)
export const tagColors: Record<string, string> = {
    // Universal
    verified: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    '5_star': 'bg-amber-50 text-amber-700 border border-amber-200/60',
    '24x7': 'bg-blue-50 text-blue-700 border border-blue-200/60',
    upi_accepted: 'bg-violet-50 text-violet-700 border border-violet-200/60',

    // Food
    free_delivery: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
    veg_only: 'bg-green-50 text-green-600 border border-green-200/60',
    home_cooked: 'bg-orange-50 text-orange-600 border border-orange-200/60',

    // Services
    same_day: 'bg-sky-50 text-sky-600 border border-sky-200/60',
    insured: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
    govt_certified: 'bg-teal-50 text-teal-700 border border-teal-200/60',
    emergency_available: 'bg-rose-50 text-rose-600 border border-rose-200/60',

    // Doctors
    mbbs: 'bg-slate-100 text-slate-700 border border-slate-200',
    video_consult: 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200/60',
    home_visit: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',

    // Ambulance
    icu_equipped: 'bg-rose-50 text-rose-600 border border-rose-200/60',
    oxygen: 'bg-cyan-50 text-cyan-600 border border-cyan-200/60',
};

// Tag display names (fallback if API doesn't return display_name)
// Tag display names (Clean, professional text only)
export const tagDisplayNames: Record<string, string> = {
    verified: 'Verified',
    '5_star': '5-Star Rated',
    '24x7': '24/7 Support',
    upi_accepted: 'UPI Payment',
    free_delivery: 'Free Delivery',
    veg_only: 'Pure Veg', // "Pure Veg" sounds more professional than "Veg Only"
    home_cooked: 'Home Cooked',
    same_day: 'Same Day',
    insured: 'Insured Work',
    govt_certified: 'Govt. Certified',
    emergency_available: 'Emergency Svc',
    mbbs: 'MBBS Doctor', // Explicit
    video_consult: 'Video Consult',
    home_visit: 'Home Visit',
    icu_equipped: 'ICU Support',
    oxygen: 'Oxygen',
};

// Tags by category (for filtering) - 'verified' removed since all displayed providers are APPROVED
export const tagsByCategory: Record<string, TagSlug[]> = {
    'Food': ['5_star', '24x7', 'upi_accepted', 'free_delivery', 'veg_only', 'home_cooked'],
    'Tiffin': ['5_star', '24x7', 'upi_accepted', 'free_delivery', 'veg_only', 'home_cooked'],
    'Grocery': ['5_star', '24x7', 'upi_accepted', 'free_delivery'],
    'Plumbing': ['5_star', '24x7', 'upi_accepted', 'same_day', 'insured', 'govt_certified', 'emergency_available'],
    'Electrician': ['5_star', '24x7', 'upi_accepted', 'same_day', 'insured', 'govt_certified', 'emergency_available'],
    'AC Repair': ['5_star', '24x7', 'upi_accepted', 'same_day', 'insured', 'emergency_available'],
    'Doctors': ['5_star', '24x7', 'upi_accepted', 'mbbs', 'video_consult', 'home_visit'],
    'Ambulance': ['5_star', '24x7', 'upi_accepted', 'icu_equipped', 'oxygen'],
    'Cleaning': ['5_star', '24x7', 'upi_accepted', 'same_day', 'insured'],
    'Painting': ['5_star', 'upi_accepted', 'insured'],
    'Car Service': ['5_star', '24x7', 'upi_accepted'],
};

// Universal tags shown for all categories - 'verified' removed
export const universalTags: TagSlug[] = ['5_star', '24x7', 'upi_accepted'];
