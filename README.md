# Lab Printer Command Center (Mock)

This is a mock dashboard for visualizing Bambu Lab 3D printer usage in a lab environment.
It is designed to be FIWARE-ready and suitable for 24/7 lobby display on a large screen.

## Highlights
- Hero summary with KPIs (total printers, active jobs, utilization, unauthorized jobs)
- Fleet status distribution bars
- Authorization donut and weekly throughput line chart
- Live printer floor cards with status and progress
- Alerts panel and live time display
- Responsive layout for large screens and tablets

## Project Structure
- `index.html` - Dashboard layout and sections
- `src/styles.css` - Visual system, layout, and animations
- `src/app.js` - KPI math and chart rendering
- `src/data/mockData.js` - Mock printer data

## Run Locally
- Open `index.html` in a browser

## Next Steps
- Replace mock data with FIWARE API calls
- Add rotating summary/analytics pages for long-running displays
- Connect alerts to real authorization workflows
