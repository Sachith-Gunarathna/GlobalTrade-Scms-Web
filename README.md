# GlobalTrade SCMS

A premium dark-mode Global Trade & Supply Chain Management dashboard built with **Next.js 14 App Router**, **TypeScript**, **Vanilla CSS**, **Recharts**, and **Lucide React**.

## Modules

- Dashboard with KPIs, shipment trend, recent orders, trade routes, and operational alerts
- Shipments with search, status/origin/destination/date filters, progress, and detail modal
- Orders with status filtering, search, totals, and detail modal
- Inventory with category filtering, stock health, progress bars, and low-stock alerts
- Suppliers with region filtering, ratings, reliability metrics, country badges, and contacts
- Analytics with revenue, regional shipment volume, fulfillment donut, and supplier rankings
- Responsive collapsible navigation, global workspace search, notifications, loading skeletons, and empty states

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production validation

```bash
npm run typecheck
npm run build
npm start
```

## Project structure

```text
app/                 App Router pages and global styles
components/          Shared UI and page client components
data/                Static JSON mock datasets
public/              Static assets
types/               Shared TypeScript domain models
```

The application is intentionally backend-free. Replace the JSON imports with API/database calls later without changing the visual component structure.
