# Melexis Lead Finder (React + Vite)

A clickable frontend that simulates an AI agent to:
1) **Find companies** likely working on applications where a Melexis semiconductor fits.
2) **Identify decision-makers** to contact.

Includes region filters (EU, **China**, North America), evidence sources, and roadmap/timeline sections per company, plus an outreach shortlist with CSV export.

## Quick start
```bash
npm install
npm run dev
# open http://localhost:5173
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- This demo uses mock data only. Wire real sources (Crunchbase, Clearbit, People Data Labs, SERP, patents) in `src/App.tsx` where the `simulateSearch` & `simulatePeopleSearch` stubs live.
- No Tailwind or shadcn/ui to keep the bundle simple.
- If you want a Tailwind/shadcn version, ask and I’ll generate a second zip.
