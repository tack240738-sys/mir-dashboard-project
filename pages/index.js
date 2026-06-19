import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

// --- CONSTANTS & DATA ---
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
  { date: "Jun 17", orange: 2, red: 0 }, { date: "Jun 18", orange: 0, red: 0 },
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
const TIRE_PRESSURE = [
  { tire: "Front Left", avg: 2.83 }, { tire: "Front Right", avg: 2.73 },
  { tire: "Rear Left", avg: 2.89 }, { tire: "Rear Right", avg: 2.79 }
];

const TRANSLATIONS = {
  th: {
    title: "รายงานสรุปผู้บริหาร MiR Robot",
    subtitle: "สถานะล้อเครื่องจักร · อัปเดตล่าสุด: 18 มิ.ย. 2569",
    share: "📋 วิธีแชร์รายงานนี้",
    shareDesc: "คัดลอกโค้ด React -> Deploy บน Vercel/Netlify -> ได้ลิงก์แชร์ฟรี",
    total: "เครื่องทั้งหมด", problem: "เครื่องมีปัญหา",
    critical: "วิกฤต (แดง)", warning: "เตือน (ส้ม)",
    topIssue: "เครื่องที่ต้องดูแลเร่งด่วน",
    recommendations: [
      "🔴 เครื่อง MP2_B035 มี Red Count สูงสุด (4) ควรซ่อมบำรุงทันที",
      "🏭 P1/P2 มีอัตราปัญหา 51.4% สูงกว่า P4 (50%) ควรเพิ่มความถี่การตรวจสอบ",
      "🔧 Kasemsak Moonkham ดูแลเครื่องมากที่สุด (18 เครื่อง) ควรกระจายงาน",
      "⚙️ ล้อหลังซ้ายมีค่าสึกหรอเฉลี่ยสูงสุด (2.89 mm) ควรตรวจสอบเป็นพิเศษ"
    ]
  },
  en: {
    title: "MiR Robot Executive Report",
    subtitle: "Wheel Wear Status · Last Updated: Jun 18, 2026",
    share: "📋 How to Share This Report",
    shareDesc: "Copy React code -> Deploy on Vercel/Netlify -> Get a free shareable link",
    total: "Total Machines", problem: "Problem Machines",
    critical: "Critical (Red)", warning: "Warning (Orange)",
    topIssue: "Machines Requiring Urgent Attention",
    recommendations: [
      "🔴 MP2_B035 has highest Red Count (4) -- immediate maintenance required",
      "🏭 P1/P2 problem rate 51.4% vs P4 50% -- increase inspection frequency",
      "🔧 Kasemsak Moonkham handles most machines (18) -- consider workload distribution",
      "⚙️ Rear Left wheel has highest avg wear (2.89 mm) -- special attention needed"
    ]
  }
};

// --- MAIN COMPONENT ---
export default function RenderAnalysis() {
  const [activePage, setActivePage] = useState("dashboard");
  const [lang, setLang] = useState("th");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("Date");
  const [sortDir, setSortDir] = useState("desc");

  const t = TRANSLATIONS[lang];

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
      let av = a[sortKey];
      let bv = b[sortKey];
      // ปรับปรุงให้ Sort ตัวเลขได้ถูกต้อง
      if (sortKey === "Orange_Count" || sortKey === "Red_Count") {
        av = Number(av); bv = Number(bv);
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pagedData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "Arial, sans-serif", paddingBottom: 40 }}>
      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#131314", padding: "12px 24px", borderBottom: "1px solid #222" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setActivePage("dashboard")} style={{ background: activePage === "dashboard" ? "#2266FF" : "transparent", color: "#FFF", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: 600 }}>📊 Dashboard</button>
          <button onClick={() => setActivePage("report")} style={{ background: activePage === "report" ? "#2563EB" : "transparent", color: "#FFF", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: 600 }}>🏢 Report</button>
        </div>
        {activePage === "report" && (
          <div style={{ display: "flex", gap: 6 }}>
            {["th", "en"].map(lng => (
              <button key={lng} onClick={() => setLang(lng)} style={{ background: lang === lng ? "#2563EB" : "#1E293B", color: "#FFF", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer" }}>{lng.toUpperCase()}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "24px" }}>
        {activePage === "dashboard" ? (
          <div>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 28 }}>
              {STATS_CONFIG.map((c, i) => (
                <div key={i} style={{ background: "#131314", borderRadius: 10, padding: "16px", borderTop: `3px solid ${c.color}` }}>
                  <div style={{ fontSize: 20 }}>{c.icon}</div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{c.value}</div>
                </div>
              ))}
            </div>

            {/* Main Content Dashboard code goes here... (Shortened for space, logic remains same) */}
            <div style={{ background: "#131314", borderRadius: 10, padding: 20 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14 }}>📋 Machine Records</h3>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." style={{ background: "#1F1F1F", border: "1px solid #333", padding: "8px", color: "#fff", width: "100%", borderRadius: 6, marginBottom: 10 }} />
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #333" }}>
                            {["Machine", "Building", "Date", "Shift", "Category", "Orange_Count", "Red_Count"].map(col => (
                                <th key={col} onClick={() => handleSort(col)} style={{ padding: 10, textAlign: "left", cursor: "pointer" }}>{col} ⇅</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pagedData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #222" }}>
                                <td style={{ padding: 10 }}>{row.Machine}</td>
                                <td>{row.Building}</td>
                                <td>{row.Date}</td>
                                <td>{row.Shift}</td>
                                <td>{row.Category}</td>
                                <td>{row.Orange_Count}</td>
                                <td>{row.Red_Count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 800, margin: "0 auto", background: "#131314", padding: 40, borderRadius: 12 }}>
            <h1 style={{ textAlign: "center" }}>{t.title}</h1>
            <h3 style={{ marginTop: 40 }}>💡 {t.topIssue}</h3>
            <ul style={{ lineHeight: 2 }}>{t.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}