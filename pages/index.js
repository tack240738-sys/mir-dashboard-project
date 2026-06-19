import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

// --- CONSTANTS & CONFIGURATIONS ---
const PAGE_SIZE = 10;
const PIE_COLORS = ["#2266FF", "#FF8C00", "#00E5D1"];
const SHIFT_COLORS = ["#2266FF", "#9B59B6"];
const STATS_CONFIG = [
  { label: "Total Machines", value: "55", color: "#2266FF", icon: "🤖" },
  { label: "Total Inspections", value: "55", color: "#00E5D1", icon: "🔍" },
  { label: "实时 Orange Alerts", value: "35", color: "#FF8C00", icon: "⚠️" },
  { label: "🚨 Red Alerts", value: "18", color: "#FF4444", icon: "🚨" },
  { label: "Machines w/ Orange", value: "23", color: "#FF8C00", icon: "📊" },
  { label: "Machines w/ Red", value: "10", color: "#FF4444", icon: "📛" },
];

// --- STATIC DATA OUTSIDE COMPONENT ---
const TABLE_DATA = [
  { "Machine": "MP2_B039", "Building": "P1/P2", "Date": "2026-06-18", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Niwat Namsri", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B024", "Building": "P1/P2", "Date": "2026-06-17", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Jutithep Intayat", "Orange_Count": 1, "Red_Count": 0 },
  { "Machine": "MP2_B025", "Building": "P1/P2", "Date": "2026-06-17", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Sinlapachai Ruksili", "Orange_Count": 1, "Red_Count": 0 },
  { "Machine": "MP2_B015", "Building": "P1/P2", "Date": "2026-06-16", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Oot Sintaphat", "Orange_Count": 3, "Red_Count": 0 },
  { "Machine": "MP2_B023", "Building": "P1/P2", "Date": "2026-06-16", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Phongphak Saengkunchot", "Orange_Count": 1, "Red_Count": 0 },
  { "Machine": "MP2_B006", "Building": "P1/P2", "Date": "2026-06-16", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Thanic Chaonaphue", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B014", "Building": "P1/P2", "Date": "2026-06-15", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Jutithep Intayat", "Orange_Count": 2, "Red_Count": 0 },
  { "Machine": "MP2_B013", "Building": "P1/P2", "Date": "2026-06-15", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Jutithep Intayat", "Orange_Count": 2, "Red_Count": 0 },
  { "Machine": "MP2_B052", "Building": "P1/P2", "Date": "2026-06-15", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Sinlapachai Ruksili", "Orange_Count": 1, "Red_Count": 2 },
  { "Machine": "MP2_B026", "Building": "P1/P2", "Date": "2026-06-14", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Sinlapachai Ruksili", "Orange_Count": 1, "Red_Count": 3 },
  { "Machine": "MP2_B046", "Building": "P1/P2", "Date": "2026-06-13", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Niwat Namsri", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B044", "Building": "P1/P2", "Date": "2026-06-13", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Sinlapachai Ruksili", "Orange_Count": 2, "Red_Count": 2 },
  { "Machine": "MP2_B034", "Building": "P1/P2", "Date": "2026-06-12", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Sinlapachai Ruksili", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B007", "Building": "P1/P2", "Date": "2026-06-12", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Phongphak Saengkunchot", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B048", "Building": "P1/P2", "Date": "2026-06-12", "Shift": "E", "Category": "Corrective Maintenance", "Name Action": "Thanic Chaonachue", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B020", "Building": "P1/P2", "Date": "2026-06-12", "Shift": "E", "Category": "Corrective Maintenance", "Name Action": "Thanic Chaonachue", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B027", "Building": "P1/P2", "Date": "2026-06-11", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Niwat Namsri", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B031", "Building": "P1/P2", "Date": "2026-06-11", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Sinlapachai Ruksili", "Orange_Count": 1, "Red_Count": 1 },
  { "Machine": "MP2_B049", "Building": "P1/P2", "Date": "2026-06-10", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Thanic Chaonachue", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B018", "Building": "P1/P2", "Date": "2026-06-10", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Jutithep Intayat", "Orange_Count": 2, "Red_Count": 0 },
  { "Machine": "MP2_B003", "Building": "P1/P2", "Date": "2026-06-08", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Sinlapachai Ruksili", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B012", "Building": "P1/P2", "Date": "2026-06-08", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Jutithep Intayat", "Orange_Count": 1, "Red_Count": 0 },
  { "Machine": "MP2_B001", "Building": "P1/P2", "Date": "2026-06-07", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Jutithep Intayat", "Orange_Count": 2, "Red_Count": 0 },
  { "Machine": "MP2_B050", "Building": "P1/P2", "Date": "2026-06-07", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Niwat Namsri", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B021", "Building": "P1/P2", "Date": "2026-06-07", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Jutithep Intayat", "Orange_Count": 2, "Red_Count": 0 },
  { "Machine": "MP2_B004", "Building": "P1/P2", "Date": "2026-06-05", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Niwat Namsri", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B029", "Building": "P1/P2", "Date": "2026-06-02", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Somboonsap Raksa", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B038", "Building": "P1/P2", "Date": "2026-06-01", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Niwat Namsri", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B002", "Building": "P1/P2", "Date": "2026-06-01", "Shift": "D", "Category": "Preventive Maintenance", "Name Action": "Sinlapachai Ruksili", "Orange_Count": 2, "Red_Count": 0 },
  { "Machine": "MP2_B028", "Building": "P1/P2", "Date": "2026-05-29", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Sinlapachai Ruksili", "Orange_Count": 1, "Red_Count": 1 },
  { "Machine": "MP2_B030", "Building": "P1/P2", "Date": "2026-05-24", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Pattrawoot Opak", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B019", "Building": "P1/P2", "Date": "2026-05-22", "Shift": "D", "Category": "Breakdown Maintenance", "Name Action": "Somboonsap Raksa", "Orange_Count": 1, "Red_Count": 0 },
  { "Machine": "MP2_B035", "Building": "P1/P2", "Date": "2026-05-12", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Jutithep Intayat", "Orange_Count": 0, "Red_Count": 4 },
  { "Machine": "MP2_B056", "Building": "P1/P2", "Date": "2026-05-09", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Niwat Namsri", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B040", "Building": "P1/P2", "Date": "2026-05-07", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Thanic Chaonachue", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP2_B037", "Building": "P1/P2", "Date": "2026-05-03", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Sinlapachai Ruksili", "Orange_Count": 1, "Red_Count": 0 },
  { "Machine": "MP2_B011", "Building": "P1/P2", "Date": "2026-04-05", "Shift": "E", "Category": "Preventive Maintenance", "Name Action": "Suradech Chuennaichit", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP4_B042", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 1 },
  { "Machine": "MP5_B009", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 2 },
  { "Machine": "MP4_B016", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 1, "Red_Count": 0 },
  { "Machine": "MP4_B036", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP4_B045", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP4_B022", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP4_B051", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 1 },
  { "Machine": "MP4_B008", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 2, "Red_Count": 0 },
  { "Machine": "MP4_B041", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP5_B005", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 1 },
  { "Machine": "MP5_B043", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP5_B017", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 2, "Red_Count": 0 },
  { "Machine": "MP5_B032", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP5_B047", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP5_B054", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP5_B055", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 1, "Red_Count": 0 },
  { "Machine": "MP5_B057", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 0, "Red_Count": 0 },
  { "Machine": "MP5_B058", "Building": "P4", "Date": "2026-03-26", "Shift": "D", "Category": "Corrective Maintenance", "Name Action": "Kasemsak Moonkham", "Orange_Count": 2, "Red_Count": 0 }
];

const DAILY_TREND = [
  { date: "Mar 26", orange: 8, red: 5 }, { date: "Apr 05", orange: 0, red: 0 }, { date: "May 03", orange: 1, red: 0 },
  { date: "May 07", orange: 0, red: 0 }, { date: "May 09", orange: 0, red: 0 }, { date: "May 12", orange: 0, red: 4 },
  { date: "May 22", orange: 1, red: 0 }, { date: "May 24", orange: 0, red: 0 }, { date: "May 29", orange: 1, red: 1 },
  { date: "Jun 01", orange: 2, red: 0 }, { date: "Jun 02", orange: 0, red: 0 }, { date: "Jun 05", orange: 0, red: 0 },
  { date: "Jun 07", orange: 4, red: 0 }, { date: "Jun 08", orange: 1, red: 0 }, { date: "Jun 10", orange: 2, red: 0 },
  { date: "Jun 11", orange: 1, red: 1 }, { date: "Jun 12", orange: 0, red: 0 }, { date: "Jun 13", orange: 2, red: 2 },
  { date: "Jun 14", orange: 1, red: 3 }, { date: "Jun 15", orange: 5, red: 2 }, { date: "Jun 16", orange: 4, red: 0 },
  { date: "Jun 17", orange: 2, red: 0 }, { date: "Jun 18", orange: 0, red: 0 }
];

const CATEGORY_DATA = [
  { name: "Preventive", value: 33 }, { name: "Corrective", value: 21 }, { name: "Breakdown", value: 1 }
];
const BUILDING_DATA_MAIN = [
  { building: "P1/P2", orange: 27, red: 13 }, { building: "P4", orange: 8, red: 5 }
];
const SHIFT_DATA = [
  { shift: "Day (D)", count: 36 }, { shift: "Evening (E)", count: 19 }
];

// --- REPORT PAGE CONFIG ---
const TRANSLATIONS = {
  th: {
    title: "รายงานสรุปผู้บริหาร MiR Robot",
    subtitle: "สถานะล้อเครื่องจักร · อัปเดตล่าสุด: 18 มิ.ย. 2569",
    share: "📋 วิธีแชร์รายงานนี้",
    shareDesc: "คัดลอกโค้ด React -> Deploy บน Vercel/Netlify -> ได้ลิงก์แชร์ฟรี",
    total: "เครื่องทั้งหมด", problem: "เครื่องมีปัญหา", critical: "วิกฤต (แดง)", warning: "เตือน (ส้ม)",
    building: "สรุปตามอาคาร", statusDist: "การกระจายสถานะ", topIssue: "เครื่องที่ต้องดูแลเร่งด่วน",
    machine: "เครื่อง", date: "วันที่", red: "แดง", orange: "ส้ม", status: "สถานะ",
    recommendations: [
      "🔴 เครื่อง MP2_B035 มี Red Count สูงสุด (4) ควรซ่อมบำรุงทันที",
      "🏭 P1/P2 มีอัตราปัญหา 51.4% สูงกว่า P4 (50%) ควรเพิ่มความถี่การตรวจสอบ",
      "🔧 Kasemsak Moonkham ดูแลเครื่องมากที่สุด (18 เครื่อง) ควรกระจายงาน",
      "⚙️ ล้อหุ่นยนต์มีค่าสึกหรอสะสมเฉลี่ยในโซนพีค ควรตรวจสอบเป็นพิเศษ"
    ]
  },
  en: {
    title: "MiR Robot Executive Report",
    subtitle: "Wheel Wear Status · Last Updated: Jun 18, 2026",
    share: "📋 How to Share This Report",
    shareDesc: "Copy React code -> Deploy on Vercel/Netlify -> Get a free shareable link",
    total: "Total Machines", problem: "Problem Machines", critical: "Critical (Red)", warning: "Warning (Orange)",
    building: "Building Summary", statusDist: "Status Distribution", topIssue: "Machines Requiring Urgent Attention",
    machine: "Machine", date: "Date", red: "Red", orange: "Orange", status: "Status",
    recommendations: [
      "🔴 MP2_B035 has highest Red Count (4) -- immediate maintenance required",
      "🏭 P1/P2 problem rate 51.4% vs P4 50% -- increase inspection frequency",
      "🔧 Kasemsak Moonkham handles most machines (18) -- consider workload distribution",
      "⚙️ Robot wheels are indicating peak wear accumulations -- special attention needed"
    ]
  }
};

const PIE_COLORS_REPORT = { NORMAL: "#22C55E", WARNING: "#FB923C", CRITICAL: "#EF4444" };
const STATUS_PIE_DATA = [
  { name: "NORMAL", value: 27 }, { name: "WARNING", value: 18 }, { name: "CRITICAL", value: 10 }
];
const BUILDING_DATA_REPORT = [
  { name: "P1/P2", total: 37, problem: 19, rate: 51.4 }, { name: "P4", total: 18, problem: 9, rate: 50.0 }
];
const URGENT_MACHINES = [
  { Machine: "MP2_B035", Date: "2026-05-12", Orange: 0, Red: 4, Status: "CRITICAL" },
  { Machine: "MP2_B026", Date: "2026-06-14", Orange: 1, Red: 3, Status: "CRITICAL" },
  { Machine: "MP2_B044", Date: "2026-06-13", Orange: 2, Red: 2, Status: "CRITICAL" },
  { Machine: "MP2_B052", Date: "2026-06-15", Orange: 1, Red: 2, Status: "CRITICAL" },
  { Machine: "MP5_B009", Date: "2026-03-26", Orange: 0, Red: 2, Status: "CRITICAL" }
];

// --- MAIN WRAPPER COMPONENT ---
export default function RenderAnalysis() {
  const [activePage, setActivePage] = useState("dashboard");
  const [lang, setLang] = useState("th");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("Date");
  const [sortDir, setSortDir] = useState("desc");
  const t = TRANSLATIONS[lang];

  // --- Logic สำหรับหน้า Dashboard ---
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return TABLE_DATA.filter(r =>
      r.Machine.toLowerCase().includes(s) ||
      r.Building.toLowerCase().includes(s) ||
      r.Category.toLowerCase().includes(s) ||
      r["Name Action"].toLowerCase().includes(s)
    );
  }, [search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pagedData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return " ⇅";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  const kpisReport = [
    { label: t.total, value: 55, color: "#60A5FA", icon: "🤖", sub: "P1/P2: 37 | P4: 18" },
    { label: t.problem, value: 28, color: "#FBBF24", icon: "⚠️", sub: "51% of total" },
    { label: t.critical, value: 18, color: "#F87171", icon: "🔴", sub: "Needs immediate action" },
    { label: t.warning, value: 35, color: "#FB923C", icon: "🟠", sub: "Monitor closely" },
  ];

  return (
    <div style={{ background: "#0F172A", color: "#F8FAFC", minHeight: "100vh", padding: "20px", fontFamily: "sans-serif" }}>
      {/* Navigation Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "12px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setActivePage("dashboard")} style={{ background: activePage === "dashboard" ? "#2266FF" : "transparent", color: "#FFF", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            📊 Main Dashboard
          </button>
          <button onClick={() => setActivePage("report")} style={{ background: activePage === "report" ? "#2563EB" : "transparent", color: "#FFF", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            🏢 Executive Report
          </button>
        </div>

        {activePage === "report" && (
          <div style={{ display: "flex", gap: "6px" }}>
            {["th", "en"].map((lng) => (
              <button key={lng} onClick={() => setLang(lng)} style={{ background: lang === lng ? "#2563EB" : "#1E293B", color: "#FFF", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                {lng === "th" ? "🇹🇭 TH" : "🇬🇧 EN"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= PAGE 1: MAIN DASHBOARD ================= */}
      {activePage === "dashboard" && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 4px 0" }}>🤖 MiR Dashboard</h1>
            <p style={{ color: "#94A3B8", fontSize: "13px", margin: 0 }}>Mobile Industrial Robot -- Maintenance Monitor | Mar-Jun 2026</p>
          </div>

          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "15px", marginBottom: "25px" }}>
            {STATS_CONFIG.map((c, i) => (
              <div key={i} style={{ background: "#1E293B", borderLeft: `4px solid ${c.color}`, padding: "15px", borderRadius: "8px" }}>
                <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "4px" }}>{c.icon} {c.label}</div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: "#F8FAFC" }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* Row 1 Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "20px", marginBottom: "25px" }}>
            <div style={{ background: "#1E293B", padding: "15px", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "14px", margin: "0 0 15px 0", color: "#94A3B8" }}>📈 Daily Alert Trend (Orange & Red)</h3>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={DAILY_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155" }} />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="orange" stroke="#FF8C00" name="Orange Alert" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="red" stroke="#FF4444" name="Red Alert" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: "#1E293B", padding: "15px", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "14px", margin: "0 0 15px 0", color: "#94A3B8" }}>🏭 Alerts by Building</h3>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={BUILDING_DATA_MAIN}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="building" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155" }} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="orange" fill="#FF8C00" name="Orange Count" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="red" fill="#FF4444" name="Red Count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: Charts Trio */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "25px" }}>
            <div style={{ background: "#1E293B", padding: "15px", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "14px", margin: "0 0 15px 0", color: "#94A3B8" }}>🔧 Maintenance Category</h3>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {CATEGORY_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: "#1E293B", padding: "15px", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "14px", margin: "0 0 15px 0", color: "#94A3B8" }}>🕐 Shift Distribution</h3>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={SHIFT_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="count" label={({ shift, count }) => `${shift}: ${count}`}>
                      {SHIFT_DATA.map((_, i) => <Cell key={i} fill={SHIFT_COLORS[i % SHIFT_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div style={{ background: "#1E293B", padding: "20px", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ fontSize: "16px", margin: 0, color: "#F8FAFC" }}>📋 Machine Inspection Records ({filtered.length} records)</h3>
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="🔍 Search machine, building, category..." style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 6, padding: "6px 12px", color: "#fff", fontSize: 12, width: 280, outline: "none" }} />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #334155" }}>
                    {["Machine", "Building", "Date", "Shift", "Category", "Name Action", "Orange_Count", "Red_Count"].map(col => (
                      <th key={col} onClick={() => handleSort(col)} style={{ padding: "10px", textAlign: "left", color: "#94A3B8", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" }}>
                        {col === "Orange_Count" ? "🟠 Orange" : col === "Red_Count" ? "🔴 Red" : col}
                        <SortIcon col={col} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #334155", background: i % 2 === 0 ? "#1E293B" : "#162238" }}>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{row.Machine}</td>
                      <td style={{ padding: "10px" }}>{row.Building}</td>
                      <td style={{ padding: "10px", color: "#94A3B8" }}>{row.Date}</td>
                      <td style={{ padding: "10px" }}>{row.Shift === "D" ? "Day" : "Evening"}</td>
                      <td style={{ padding: "10px" }}>{row.Category.replace(" Maintenance", "")}</td>
                      <td style={{ padding: "10px", color: "#CBD5E1" }}>{row.Name Action}</td>
                      <td style={{ padding: "10px", color: row.Orange_Count > 0 ? "#FF8C00" : "#64748B", fontWeight: row.Orange_Count > 0 ? "bold" : "normal" }}>{row.Orange_Count > 0 ? row.Orange_Count : "--"}</td>
                      <td style={{ padding: "10px", color: row.Red_Count > 0 ? "#FF4444" : "#64748B", fontWeight: row.Red_Count > 0 ? "bold" : "normal" }}>{row.Red_Count > 0 ? row.Red_Count : "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px", pt: "10px", borderTop: "1px solid #334155", fontSize: "12px", color: "#94A3B8" }}>
              <div>Page {page} of {totalPages} ({sorted.length} rows)</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: "#0F172A", border: "1px solid #334155", color: page === 1 ? "#475569" : "#fff", padding: "4px 12px", borderRadius: 5, cursor: page === 1 ? "default" : "pointer" }}>← Prev</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} style={{ background: "#0F172A", border: "1px solid #334155", color: page === totalPages ? "#475569" : "#fff", padding: "4px 12px", borderRadius: 5, cursor: page === totalPages ? "default" : "pointer" }}>Next →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAGE 2: EXECUTIVE REPORT ================= */}
      {activePage === "report" && (
        <div>
          <div style={{ marginBottom: "25px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "bold", margin: "0 0 6px 0", color: "#F8FAFC" }}>🤖 {t.title}</h1>
            <p style={{ color: "#94A3B8", fontSize: "14px", margin: 0 }}>{t.subtitle}</p>
          </div>

          {/* Share Banner */}
          <div style={{ background: "linear-gradient(90deg, #1E3A8A, #2563EB)", padding: "15px", borderRadius: "8px", marginBottom: "25px", display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ fontSize: "24px" }}>🔗</div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", color: "#FFF", fontSize: "14px" }}>{t.share}</h4>
              <p style={{ margin: 0, color: "#BFDBFE", fontSize: "12px" }}>{t.shareDesc}</p>
            </div>
          </div>

          {/* KPI Blocks */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" }}>
            {kpisReport.map((k, idx) => (
              <div key={idx} style={{ background: "#1E293B", padding: "20px", borderRadius: "10px", borderTop: `4px solid ${k.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 500 }}>{k.label}</span>
                  <span style={{ fontSize: "18px" }}>{k.icon}</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }}>{k.value}</div>
                <div style={{ fontSize: "11px", color: "#64748B" }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Charts Split Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "25px", marginBottom: "30px" }}>
            <div style={{ background: "#1E293B", padding: "20px", borderRadius: "10px" }}>
              <h3 style={{ fontSize: "15px", margin: "0 0 20px 0", fontWeight: 600 }}>📊 {t.statusDist}</h3>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: 180 }}>
                <div style={{ width: "50%", height: "100%" }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={STATUS_PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                        {STATUS_PIE_DATA.map((entry, idx) => (
                          <Cell key={idx} fill={PIE_COLORS_REPORT[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ width: "45%", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {STATUS_PIE_DATA.map((x, idx) => (
                    <div key={idx} style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: PIE_COLORS_REPORT[x.name], display: "inline-block" }}></span>
                      <span style={{ color: "#CBD5E1", fontWeight: 500 }}>{x.name}:</span>
                      <span style={{ fontWeight: "bold" }}>{x.value} ({Math.round((x.value / 55) * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: "#1E293B", padding: "20px", borderRadius: "10px" }}>
              <h3 style={{ fontSize: "15px", margin: "0 0 15px 0", fontWeight: 600 }}>🏭 {t.building}</h3>
              <div style={{ width: "100%", height: 180 }}>
                <ResponsiveContainer>
                  <BarChart data={BUILDING_DATA_REPORT} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155" }} />
                    <Legend />
                    <Bar dataKey="total" fill="#4B5563" name="Total Inspected" radius={[0, 4, 4, 0]} barSize={16} />
                    <Bar dataKey="problem" fill="#EF4444" name="Has Issues" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommendations & Critical Table Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "25px" }}>
            <div style={{ background: "#1E293B", padding: "20px", borderRadius: "10px" }}>
              <h3 style={{ fontSize: "15px", margin: "0 0 15px 0", color: "#F87171", fontWeight: 600 }}>⚠️ {t.topIssue}</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #475569", textAlign: "left", color: "#94A3B8" }}>
                    <th style={{ padding: "8px" }}>{t.machine}</th>
                    <th style={{ padding: "8px" }}>{t.date}</th>
                    <th style={{ padding: "8px" }}>{t.orange}</th>
                    <th style={{ padding: "8px" }}>{t.red}</th>
                    <th style={{ padding: "8px" }}>{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {URGENT_MACHINES.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #334155", background: idx % 2 === 0 ? "transparent" : "#162238" }}>
                      <td style={{ padding: "8px", fontWeight: "bold" }}>{m.Machine}</td>
                      <td style={{ padding: "8px", color: "#94A3B8" }}>{m.Date}</td>
                      <td style={{ padding: "8px", color: "#FB923C" }}>{m.Orange || "-"}</td>
                      <td style={{ padding: "8px", color: "#EF4444", fontWeight: "bold" }}>{m.Red}</td>
                      <td style={{ padding: "8px" }}><span style={{ background: "#451A03", color: "#FDBA74", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>{m.Status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: "#1E293B", padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "15px", margin: "0 0 15px 0", color: "#34D399", fontWeight: 600 }}>💡 {lang === "th" ? "ข้อเสนอแนะเชิงกลยุทธ์" : "Strategic Recommendations"}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {t.recommendations.map((rec, i) => (
                    <div key={i} style={{ fontSize: "13px", color: "#E2E8F0", padding: "10px", background: "#0F172A", borderRadius: "6px", borderLeft: "3px solid #34D399" }}>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "15px", textAlign: "right" }}>
                💡 วิธีแชร์: Screenshot หน้านี้ หรือ Copy โค้ดไป Deploy บน Vercel ฟรี
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}