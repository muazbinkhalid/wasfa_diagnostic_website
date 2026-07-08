# WASFA Diagnostic Center — Portfolio Website

A modern portfolio website for **WASFA Diagnostic Center** with an integrated patient portal for accessing diagnostic reports. Built as a separate project from the main Diagnostic LMS app.

## Features

- **Modern marketing site** — Home, Services, About, and Contact pages
- **Light pink theme** — Elegant, warm aesthetic throughout
- **GSAP animations** — Hero reveals, scroll-triggered animations, magnetic buttons, animated stats
- **Patient portal** — MRN-based login connected to the same Supabase backend as the patient app
- **Report downloads** — Secure signed URLs for PDF report access

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [GSAP](https://gsap.com/) + [@gsap/react](https://gsap.com/docs/v3/Plugins/React/)
- [Supabase](https://supabase.com/) (Auth, Database, Storage)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.local.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://pilicztkqptaijhisvwu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Use the same Supabase project as the Diagnostic LMS and patient app.

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Patient Portal

Patients sign in with:
- **Login ID:** MRN (printed on receipt)
- **Password:** Set by the diagnostic center (default: `wasfa` + last 4 phone digits)

The portal uses the same Supabase Auth and RLS policies as `wasfa_patient_app`.

## Project Structure

```
wasfa-website/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   │   ├── animations/   # GSAP animation wrappers
│   │   ├── home/         # Homepage sections
│   │   ├── layout/       # Header, Footer
│   │   └── portal/       # Login & reports
│   └── lib/              # Supabase, auth, config
└── public/               # Static assets (logo)
```

## Related Repositories

- **diagnostic_lms** — Staff/admin Flutter app for patient management and report creation
- **wasfa_patient_app** — Mobile patient portal (Flutter)

## License

Private — WASFA Diagnostic Center
