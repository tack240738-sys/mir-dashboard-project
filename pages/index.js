import { useState, useMemo } from 'react';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('Report');

  // ตัวอย่างข้อมูลสำหรับแสดงผล
  const data = useMemo(() => ({
    title: activePage === 'Report' ? 'MiR Wheel Status Report' : 'รายการสถานะล้อ MiR',
    // เพิ่ม logic หรือส่วนประกอบหน้าจอของคุณที่นี่
  }), [activePage]);

  return (
    <div className="p-4">
      <nav className="mb-4">
        <button onClick={() => setActivePage('Report')} className="mr-2 p-2 bg-blue-500 text-white">Report</button>
        <button onClick={() => setActivePage('Checklist')} className="p-2 bg-green-500 text-white">Checklist</button>
      </nav>
      <h1 className="text-2xl font-bold">{data.title}</h1>
    </div>
  );
}