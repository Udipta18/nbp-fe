# LocalServe - Hyperlocal Services Marketplace

A modern, mobile-first web app for booking daily essential services in New Barrackpur. Built with Next.js 14, Tailwind CSS, and ShadCN UI concepts.

## 🚀 Getting Started

### 1. Install Dependencies
Make sure you are in the project directory:
```bash
cd nbp-fe
npm install
# or
yarn install
# or
pnpm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app`: App Router pages
  - `/`: Landing page
  - `/services`: Service listing with filters
  - `/provider/[id]`: Provider details
  - `/booking`: Booking flow
  - `/dashboard`: User booking history
  - `/admin`: Admin panel
- `src/components`: Reusable UI components
- `src/data`: Mock JSON data for categories and providers

## 🎨 Features
- **Mobile-First Design**: Optimized for touch interfaces.
- **Search & Filter**: Find providers by category or keyword.
- **Booking System**: Select date/time and confirm.
- **Mock Data**: Pre-populated with local service providers.

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod (ready for integration)
