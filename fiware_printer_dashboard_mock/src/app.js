
const grid = document.getElementById("printer-grid");
const summary = document.getElementById("summary");
const kpiGrid = document.getElementById("kpi-grid");
const statusBars = document.getElementById("status-bars");
const authDonut = document.getElementById("auth-donut");
const authPercent = document.getElementById("auth-percent");
const weeklyChart = document.getElementById("weekly-chart");
const alertList = document.getElementById("alert-list");
const liveTime = document.getElementById("live-time");

const totalPrinters = printers.length;
const printingPrinters = printers.filter((p) => p.printing).length;
const freePrinters = totalPrinters - printingPrinters;
const authorizedPrinting = printers.filter((p) => p.printing && p.authorized).length;
const unauthorizedPrinting = printingPrinters - authorizedPrinting;

const utilization = totalPrinters === 0 ? 0 : Math.round((printingPrinters / totalPrinters) * 100);
const authorizedShare = printingPrinters === 0 ? 0 : Math.round((authorizedPrinting / printingPrinters) * 100);

summary.textContent = `${printingPrinters} active printers - ${freePrinters} idle - ${unauthorizedPrinting} jobs need review`;

const kpis = [
    { label: "Total printers", value: totalPrinters, trend: `${freePrinters} idle now` },
    { label: "Active jobs", value: printingPrinters, trend: `${authorizedPrinting} authorized` },
    { label: "Utilization", value: `${utilization}%`, trend: utilization > 70 ? "High load" : "Moderate load" },
    { label: "Unauthorized jobs", value: unauthorizedPrinting, trend: unauthorizedPrinting ? "Needs review" : "All clear" },
];

kpis.forEach((kpi, index) => {
    const card = document.createElement("div");
    card.className = "kpi-card";
    card.style.animationDelay = `${0.1 + index * 0.08}s`;
    card.innerHTML = `
        <div class="kpi-label">${kpi.label}</div>
        <div class="kpi-value">${kpi.value}</div>
        <div class="kpi-trend">${kpi.trend}</div>
    `;
    kpiGrid.appendChild(card);
});

const statusData = [
    { label: "Free", value: freePrinters, color: "var(--free)" },
    { label: "Authorized", value: authorizedPrinting, color: "var(--authorized)" },
    { label: "Unauthorized", value: unauthorizedPrinting, color: "var(--unauthorized)" },
];

statusData.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    const percent = totalPrinters === 0 ? 0 : Math.round((item.value / totalPrinters) * 100);
    row.innerHTML = `
        <div>${item.label}</div>
        <div class="bar-track">
            <div class="bar-fill" style="width:${percent}%; background:${item.color};"></div>
        </div>
        <div>${percent}%</div>
    `;
    row.style.animationDelay = `${0.2 + index * 0.08}s`;
    statusBars.appendChild(row);
});

const donutRadius = 62;
const donutCirc = 2 * Math.PI * donutRadius;
const authorizedOffset = donutCirc - (authorizedShare / 100) * donutCirc;

authDonut.innerHTML = `
    <circle cx="80" cy="80" r="${donutRadius}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="16"></circle>
    <circle cx="80" cy="80" r="${donutRadius}" fill="none" stroke="var(--authorized)" stroke-width="16"
        stroke-dasharray="${donutCirc}" stroke-dashoffset="${authorizedOffset}" stroke-linecap="round"
        transform="rotate(-90 80 80)"></circle>
    <circle cx="80" cy="80" r="${donutRadius - 18}" fill="none" stroke="var(--unauthorized)" stroke-width="8"
        stroke-dasharray="${donutCirc}" stroke-dashoffset="${donutCirc - ((100 - authorizedShare) / 100) * donutCirc}"
        stroke-linecap="round" transform="rotate(-90 80 80)"></circle>
`;

authPercent.textContent = `${authorizedShare}%`;

const weeklyValues = [12, 16, 10, 18, 14, 20, 17];
const weeklySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
weeklySvg.setAttribute("viewBox", "0 0 600 200");
weeklySvg.setAttribute("width", "100%");
weeklySvg.setAttribute("height", "200");

const maxVal = Math.max(...weeklyValues, 1);
const padding = 30;
const points = weeklyValues.map((val, i) => {
    const x = padding + (i * (600 - padding * 2)) / (weeklyValues.length - 1);
    const y = 180 - (val / maxVal) * 120;
    return [x, y];
});

const linePath = points.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt[0]} ${pt[1]}`).join(" ");
const areaPath = `${linePath} L ${points[points.length - 1][0]} 180 L ${points[0][0]} 180 Z`;

const area = document.createElementNS("http://www.w3.org/2000/svg", "path");
area.setAttribute("d", areaPath);
area.setAttribute("fill", "rgba(95, 167, 255, 0.18)");

const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
line.setAttribute("d", linePath);
line.setAttribute("fill", "none");
line.setAttribute("stroke", "var(--accent-strong)");
line.setAttribute("stroke-width", "3");
line.setAttribute("stroke-linecap", "round");

weeklySvg.appendChild(area);
weeklySvg.appendChild(line);

points.forEach((point) => {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", point[0]);
    dot.setAttribute("cy", point[1]);
    dot.setAttribute("r", "4");
    dot.setAttribute("fill", "var(--accent)");
    weeklySvg.appendChild(dot);
});

weeklyChart.appendChild(weeklySvg);

printers.forEach((printer, index) => {
    const card = document.createElement("div");
    card.classList.add("printer-card");

    const statusLabel = printer.printing ? "Printing" : "Idle";
    const statusColor = printer.printing
        ? printer.authorized
            ? "var(--authorized)"
            : "var(--unauthorized)"
        : "var(--free)";
    const progress = printer.printing ? 35 + (index * 13) % 60 : 0;

    card.innerHTML = `
        <div class="printer-title">${printer.name}</div>
        <div class="status-pill">
            <span class="pill-dot" style="background:${statusColor};"></span>
            ${statusLabel}
        </div>
        <div class="printer-meta">
            Booking: ${printer.authorized ? "Authorized" : "Not Authorized"}<br/>
            Queue: ${printer.printing ? "Job in progress" : "Awaiting tasks"}
        </div>
        <div class="progress-track">
            <div class="progress-fill" style="width:${progress}%; background:${statusColor};"></div>
        </div>
    `;

    grid.appendChild(card);
});

const alerts = printers
    .filter((printer) => printer.printing && !printer.authorized)
    .map((printer) => ({
        title: `Unauthorized print detected on ${printer.name}`,
        time: "Within last 45 minutes",
    }));

if (alerts.length === 0) {
    const alert = document.createElement("div");
    alert.className = "alert-item";
    alert.textContent = "No critical alerts. All jobs are authorized.";
    alertList.appendChild(alert);
} else {
    alerts.forEach((alert) => {
        const item = document.createElement("div");
        item.className = "alert-item";
        item.innerHTML = `${alert.title}<span>${alert.time}</span>`;
        alertList.appendChild(item);
    });
}

const panels = document.querySelectorAll(".panel");
panels.forEach((panel, index) => {
    panel.style.animationDelay = `${0.15 + index * 0.07}s`;
});

const updateTime = () => {
    const now = new Date();
    liveTime.textContent = now.toLocaleString(undefined, {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "2-digit",
    });
};

updateTime();
setInterval(updateTime, 60000);
