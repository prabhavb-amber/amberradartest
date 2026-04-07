import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import UCASContent from './UCASContent';
import KeywordContent from './KeywordContent';
import PricingContent from './PricingContent';
import OccupancyContent from './OccupancyContent';

import avatar from './assets/avatar.png';
import chevronDown from './assets/chevron-down.svg';
import userIcon from './assets/user-icon.svg';
import moneyIcon from './assets/money-icon.svg';
import buildingIcon from './assets/building-icon.svg';
import documentIcon from './assets/document-icon.svg';
import approveIcon from './assets/approve-icon.svg';
import percentageIcon from './assets/percentage-icon.svg';
import logo from './assets/logo.svg';
import dropdownArrow from './assets/dropdown-arrow.svg';
import gradientFill from './assets/gradient-fill.svg';
import yoyLine from './assets/yoy-line.svg';
import pointOuter from './assets/point-outer.svg';
import pointInner from './assets/point-inner.svg';
import pointInnerAlt from './assets/point-inner-alt.svg';
import chartFill from './assets/chart-fill.svg';
import chartLine from './assets/chart-line.svg';
import hoverPoint from './assets/hover-point.svg';

// Data
const quarterlyData = [
  { year: 2022, q: 'Q1', total: 5000, accepted: 75000 },
  { year: 2022, q: 'Q2', total: 5000, accepted: 60000 },
  { year: 2022, q: 'Q3', total: 20000, accepted: 530000 },
  { year: 2022, q: 'Q4', total: 20000, accepted: 100000 },
  { year: 2023, q: 'Q1', total: 5000, accepted: 50000 },
  { year: 2023, q: 'Q2', total: 10000, accepted: 80000 },
  { year: 2023, q: 'Q3', total: 30000, accepted: 450000 },
  { year: 2023, q: 'Q4', total: 10000, accepted: 65000 },
  { year: 2024, q: 'Q1', total: 5000, accepted: 45000 },
  { year: 2024, q: 'Q2', total: 5000, accepted: 40000 },
  { year: 2024, q: 'Q3', total: 10000, accepted: 65000 },
  { year: 2024, q: 'Q4', total: 8000, accepted: 52000 },
  { year: 2025, q: 'Q1', total: 10000, accepted: 60000 },
  { year: 2025, q: 'Q2', total: 10000, accepted: 70000 },
  { year: 2025, q: 'Q3', total: 240000, accepted: 260000 },
  { year: 2025, q: 'Q4', total: 8000, accepted: 42000 },
];

const regionData = [
  { name: 'South Asia', accepted: 459246, total: 932000 },
  { name: 'East Asia', accepted: 317420, total: 634840 },
  { name: 'Sub-Saharan Africa', accepted: 135072, total: 270145 },
  { name: 'SE Asia', accepted: 54029, total: 101304 },
  { name: 'North America', accepted: 60783, total: 94551 },
  { name: 'Middle East', accepted: 50652, total: 87797 },
  { name: 'EU 14', accepted: 47275, total: 81043 },
  { name: 'Europe (Other)', accepted: 37145, total: 67536 },
  { name: 'Central & South', accepted: 16884, total: 27014 },
  { name: 'North Africa', accepted: 12157, total: 20261 },
  { name: 'Central Asia', accepted: 8104, total: 13507 },
  { name: 'EU 8', accepted: 3917, total: 4917 },
  { name: 'Oceania', accepted: 3039, total: 4039 },
  { name: 'EU Other', accepted: 2000, total: 3000 },
  { name: 'EU 2', accepted: 2000, total: 3000 },
  { name: 'Other', accepted: 2000, total: 3000 },
];

const academicYears = ['All Years', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];
const sourceRegions = ['All Region', 'South Asia', 'East Asia', 'Sub-Saharan Africa', 'SE Asia', 'North America', 'Middle East'];
const sourceCountries = ['All Countries', 'India', 'China', 'Nigeria', 'Pakistan', 'USA', 'Saudi Arabia'];

function HeroCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = 1920;
    c.height = 1080;

    const fg = [255, 255, 255];
    const bg = [0, 51, 255];

    function rgbStr(col) { return 'rgb(' + col[0] + ',' + col[1] + ',' + col[2] + ')'; }
    function rgbaStr(col, a) { return 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + a + ')'; }

    const colors = { fg, bg };
    let t = 0;

    function draw() {
      t += 0.016 * 0.7;
      const w = 1920, h = 1080;
      const intensity = 45, scale = 4;

      ctx.fillStyle = rgbStr(colors.bg);
      ctx.fillRect(0, 0, w, h);

      const chars = '0123456789ABCDEF';
      const cellSize = Math.max(20, scale * 8);
      const cols = Math.ceil(w / cellSize);
      const rows = Math.ceil(h / cellSize);
      const amp = intensity / 50;
      const fontSize = Math.floor(cellSize * 0.5);
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const x = col * cellSize + cellSize / 2;
          const y = r * cellSize + cellSize / 2;
          const phase = Math.floor(t * 3 * amp + r * 0.5 + col * 0.3);
          const charIdx = ((phase + r * 7 + col * 13) % chars.length + chars.length) % chars.length;
          const wave = Math.sin(t * 2 + r * 0.4 + col * 0.3) * 0.5 + 0.5;
          const alpha = 0.2 + wave * 0.6;

          if (wave > 0.7) {
            ctx.fillStyle = rgbaStr(colors.fg, (wave - 0.7) * 0.3);
            ctx.fillRect(col * cellSize + 1, r * cellSize + 1, cellSize - 2, cellSize - 2);
          }

          ctx.fillStyle = rgbaStr(colors.fg, alpha);
          ctx.fillText(chars[charIdx], x, y);
        }
      }

      ctx.strokeStyle = rgbaStr(colors.fg, 0.08);
      ctx.lineWidth = 1;
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * cellSize); ctx.lineTo(w, r * cellSize); ctx.stroke();
      }
      for (let col = 0; col <= cols; col++) {
        ctx.beginPath(); ctx.moveTo(col * cellSize, 0); ctx.lineTo(col * cellSize, h); ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" />;
}

function ChartIconBars() {
  return (
    <div className="chart-icon">
      <div className="chart-icon-bar" />
      <div className="chart-icon-bar" />
      <div className="chart-icon-bar" />
      <div className="chart-icon-bar" />
    </div>
  );
}

function FilterSelect({ label, value, options, onChange, compact }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`filter-select ${open ? 'open' : ''}`} ref={ref} onClick={() => setOpen(!open)}
      style={compact ? { width: 210, minWidth: 0 } : undefined}>
      <div className="filter-select-content" style={compact ? { width: 'auto' } : undefined}>
        <span className="filter-label">{label}</span>
        <span className="filter-value">{value}</span>
      </div>
      <img className="filter-chevron" src={chevronDown} alt="" />
      {open && (
        <div className="filter-dropdown">
          {options.map(opt => (
            <div
              key={opt}
              className={`filter-dropdown-item ${opt === value ? 'selected' : ''}`}
              onClick={(e) => { e.stopPropagation(); onChange(opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ activeTab, onTabChange, activeMainTab, activePricingSection, onPricingSectionChange, activeOccupancySection, onOccupancySectionChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const tabs = ['Visa Analysis', 'UCAS Analysis', 'Keyword Analysis'];
  const pricingSections = ['Pricing Power', 'Room Trend', 'Distribution', 'Price Split', 'YoY Comparison', 'Elasticity'];
  const occupancySections = ['Occupancy Rate', 'YoY Comparison', 'Top Cities'];
  const showPricingNav = activeMainTab === 'Pricing';
  const showOccupancyNav = activeMainTab === 'Occupancy';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="amberRadar" />
      </div>
      <div className="sidebar-nav">
        {showPricingNav ? (
          <div className="sidebar-section">
            {pricingSections.map(section => (
              <button
                key={section}
                className={`sidebar-item ${activePricingSection === section ? 'active' : ''}`}
                onClick={() => onPricingSectionChange(section)}
              >
                {section}
              </button>
            ))}
          </div>
        ) : showOccupancyNav ? (
          <div className="sidebar-section">
            {occupancySections.map(section => (
              <button
                key={section}
                className={`sidebar-item ${activeOccupancySection === section ? 'active' : ''}`}
                onClick={() => onOccupancySectionChange(section)}
              >
                {section}
              </button>
            ))}
          </div>
        ) : (
          <div className="sidebar-section">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`sidebar-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => onTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="sidebar-footer" ref={menuRef}>
        <div className="sidebar-footer-content" onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer' }}>
          <div className="sidebar-avatar">
            <img src={avatar} alt="Admin" />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Admin</div>
            <div className="sidebar-user-email">arthur@alignui.com</div>
          </div>
          <img className="sidebar-dropdown-icon" src={dropdownArrow} alt="" />
        </div>
        {menuOpen && (
          <div className="sidebar-menu">
            <button className="sidebar-menu-item" onClick={() => { setMenuOpen(false); alert('Profile'); }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="#525252" strokeWidth="1.2"/><path d="M2.5 14C2.5 11.24 4.96 9 8 9C11.04 9 13.5 11.24 13.5 14" stroke="#525252" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Profile
            </button>
            <button className="sidebar-menu-item" onClick={() => { setMenuOpen(false); alert('Site Actions'); }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H6M10 4H14M2 8H8M12 8H14M2 12H4M8 12H14" stroke="#525252" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="4" r="2" stroke="#525252" strokeWidth="1.2"/><circle cx="10" cy="8" r="2" stroke="#525252" strokeWidth="1.2"/><circle cx="6" cy="12" r="2" stroke="#525252" strokeWidth="1.2"/></svg>
              Site Actions
            </button>
            <button className="sidebar-menu-item" onClick={() => { setMenuOpen(false); window.open('https://amberstudent.com', '_blank'); }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5Z" stroke="#525252" strokeWidth="1.2"/><path d="M1.5 8H14.5" stroke="#525252" strokeWidth="1.2"/><path d="M8 1.5C9.66 3.31 10.61 5.6 10.68 8C10.61 10.4 9.66 12.69 8 14.5C6.34 12.69 5.39 10.4 5.32 8C5.39 5.6 6.34 3.31 8 1.5Z" stroke="#525252" strokeWidth="1.2"/></svg>
              Visit Amber Student
            </button>
            <div className="sidebar-menu-divider" />
            <button className="sidebar-menu-item sidebar-menu-logout" onClick={() => { setMenuOpen(false); alert('Logged out'); }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3.5C3.1 14 2.72 13.84 2.44 13.56C2.16 13.28 2 12.9 2 12.5V3.5C2 3.1 2.16 2.72 2.44 2.44C2.72 2.16 3.1 2 3.5 2H6" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.5 11.5L14 8L10.5 4.5" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 8H6" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuarterlyBarChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const maxVal = 600000;
  const chartHeight = 250;
  const yLabels = ['600K', '500K', '400K', '300K', '200K', '100K', '0'];
  const barWidth = 32;

  // Bar positions from Figma
  const barPositions = [
    62.34, 129.03, 195.72, 262.41, 329.09, 395.78, 462.47, 529.16,
    595.84, 662.53, 729.22, 795.91, 862.59, 929.28, 995.97, 1062.66
  ];

  // Heights from Figma (in px, chart area = 250px for 600K)
  const barHeights = [
    { total: 2.08, accepted: 31.25 },
    { total: 2.08, accepted: 25 },
    { total: 8.33, accepted: 220.83 },
    { total: 8.33, accepted: 41.67 },
    { total: 2.08, accepted: 20.83 },
    { total: 4.17, accepted: 33.33 },
    { total: 12.5, accepted: 187.5 },
    { total: 4.17, accepted: 27.08 },
    { total: 2.08, accepted: 18.75 },
    { total: 2.08, accepted: 16.67 },
    { total: 4.17, accepted: 27.08 },
    { total: 3.33, accepted: 21.67 },
    { total: 4.17, accepted: 25 },
    { total: 4.17, accepted: 29.17 },
    { total: 100, accepted: 108.33 },
    { total: 3.33, accepted: 17.5 },
  ];

  const yearPositions = [
    { left: 154.38, label: '2022' },
    { left: 420.38, label: '2023' },
    { left: 686.38, label: '2024' },
    { left: 953.38, label: '2025' },
  ];

  return (
    <div className="bar-chart-area">
      {/* Y-axis labels and grid lines */}
      {yLabels.map((label, i) => {
        const topPct = (i / (yLabels.length - 1)) * chartHeight;
        return (
          <React.Fragment key={label}>
            <div style={{
              position: 'absolute', left: 0, width: 35, textAlign: 'right',
              top: topPct + 9, fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252',
              transform: 'translateY(-50%)'
            }}>{label}</div>
            <div style={{
              position: 'absolute', left: 45, right: 0, top: topPct + 9,
              height: 1,
              background: 'repeating-linear-gradient(to right, #d4d4d4 0, #d4d4d4 2px, transparent 2px, transparent 6px)'
            }} />
          </React.Fragment>
        );
      })}

      {/* Bars */}
      {quarterlyData.map((d, i) => {
        const totalH = barHeights[i].total;
        const acceptedH = barHeights[i].accepted;
        const barBaseline = chartHeight + 9; // 0-line position (259px)

        return (
          <div
            key={i}
            className="bar-group"
            style={{
              left: barPositions[i],
              width: barWidth,
              height: totalH + acceptedH,
              position: 'absolute',
              top: barBaseline - totalH - acceptedH,
              filter: hoveredIdx !== null && hoveredIdx !== i ? 'opacity(0.35)' : 'none',
              transition: 'filter 0.15s ease',
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="bar-tooltip" style={{ opacity: hoveredIdx === i ? 1 : 0 }}>
              <div className="bar-tooltip-title">{d.year} {d.q}</div>
              <div className="bar-tooltip-row">Total: {(d.total + d.accepted).toLocaleString()}</div>
              <div className="bar-tooltip-row">Accepted: {d.accepted.toLocaleString()}</div>
            </div>
            <div className="bar-total" style={{ height: totalH }} />
            <div className="bar-accepted" style={{ height: acceptedH }} />
          </div>
        );
      })}

      {/* X-axis quarter labels */}
      {quarterlyData.map((d, i) => (
        <div key={`x-${i}`} style={{
          position: 'absolute',
          left: barPositions[i] + barWidth / 2,
          transform: 'translateX(-50%)',
          top: 274 + 9,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: 12,
          color: '#525252',
          textAlign: 'center',
        }}>{d.q}</div>
      ))}

      {/* Year badges */}
      {yearPositions.map(y => (
        <div key={y.label} style={{ position: 'absolute', left: y.left, top: 314 + 9 }}>
          <span className="year-badge">{y.label}</span>
        </div>
      ))}
    </div>
  );
}

function RegionBarChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className="h-bar-chart" style={{ overflow: 'visible' }}>
      {/* Grid lines */}
      {[160, 346, 533, 719, 906, 1092].map(left => (
        <div key={left} className="h-bar-grid-line" style={{ left }} />
      ))}

      {/* Bars */}
      {regionData.map((d, i) => {
        // Use exact Figma widths
        const figmaWidths = [
          { accepted: 459.25, remaining: 472.75 },
          { accepted: 317.42, remaining: 317.42 },
          { accepted: 135.07, remaining: 135.07 },
          { accepted: 54.03, remaining: 47.28 },
          { accepted: 60.78, remaining: 33.77 },
          { accepted: 50.65, remaining: 37.14 },
          { accepted: 47.28, remaining: 33.77 },
          { accepted: 37.14, remaining: 30.39 },
          { accepted: 16.88, remaining: 10.13 },
          { accepted: 12.16, remaining: 8.10 },
          { accepted: 8.10, remaining: 5.40 },
          { accepted: 3.92, remaining: 1 },
          { accepted: 3.04, remaining: 1 },
          { accepted: 2, remaining: 1 },
          { accepted: 2, remaining: 1 },
          { accepted: 2, remaining: 1 },
        ];

        return (
          <div key={d.name} className="h-bar-row" style={{
            top: i * 32,
            filter: hoveredIdx !== null && hoveredIdx !== i ? 'opacity(0.35)' : 'none',
            transition: 'filter 0.15s ease',
          }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="h-bar-label">{d.name}</div>
            <div className="h-bar-accepted" style={{ width: figmaWidths[i].accepted, filter: hoveredIdx === i ? 'brightness(1.1)' : 'none' }} />
            <div className="h-bar-remaining" style={{ width: figmaWidths[i].remaining }} />
            {hoveredIdx === i && (() => {
              const totalBarWidth = figmaWidths[i].accepted + figmaWidths[i].remaining;
              const isWide = totalBarWidth > 500;
              return (
              <div style={isWide ? {
                position: 'absolute', right: 0,
                top: '100%', marginTop: 6,
                background: '#171717', color: 'white', borderRadius: 10,
                padding: '10px 14px', whiteSpace: 'nowrap', zIndex: 5
              } : {
                position: 'absolute', left: 160 + totalBarWidth + 8,
                top: '50%', transform: 'translateY(-50%)',
                background: '#171717', color: 'white', borderRadius: 10,
                padding: '10px 14px', whiteSpace: 'nowrap', zIndex: 5
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, lineHeight: '18px' }}>{d.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '16px', color: 'rgba(255,255,255,0.7)' }}>Accepted: {d.accepted.toLocaleString()}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '16px', color: 'rgba(255,255,255,0.7)' }}>Total: {d.total.toLocaleString()}</div>
              </div>
              );
            })()}
          </div>
        );
      })}

      {/* X-axis labels — positioned to align with grid lines */}
      {['0', '276K', '552K', '828K', '1.1M', '1.4M'].map((label, i) => {
        const gridPositions = [160, 346, 533, 719, 906, 1092];
        return (
          <span key={label} style={{
            position: 'absolute',
            bottom: 12,
            left: gridPositions[i],
            transform: 'translateX(-50%)',
            fontFamily: i === 0 ? "'DM Sans', sans-serif" : "'DM Mono', monospace",
            fontWeight: 400, fontSize: 12, color: '#525252', textAlign: 'center',
            whiteSpace: 'nowrap',
          }}>{label}</span>
        );
      })}
    </div>
  );
}

function YOYAcceptanceChart() {
  const yLabels = ['99%', '98%', '97%', '96%', '95%', '94%'];
  // Points in SVG coordinate space (1044 x 260)
  const dataPoints = [
    { year: 2022, x: 0, y: 34.67, rate: '98.7%' },
    { year: 2023, x: 348, y: 147.33, rate: '97.1%' },
    { year: 2024, x: 696, y: 203.67, rate: '96.2%' },
    { year: 2025, x: 1044, y: 216.67, rate: '96.0%' },
  ];

  const lineColor = '#16A34A';

  // Build SVG path
  const linePath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  // Gradient fill path (close at bottom)
  const fillPath = linePath + ` L${dataPoints[dataPoints.length - 1].x},260 L${dataPoints[0].x},260 Z`;

  return (
    <>
      <div className="yoy-chart">
        <div className="yoy-y-axis">
          {yLabels.map(l => <span key={l} className="yoy-y-label">{l}</span>)}
        </div>
        <div className="yoy-canvas">
          {/* Grid lines */}
          {[260, 216.67, 173.33, 130, 86.67, 43.33].map((top, i) => (
            <div key={i} className="yoy-grid-line" style={{ top }} />
          ))}

          {/* SVG chart */}
          <svg
            viewBox="0 0 1044 260"
            preserveAspectRatio="none"
            style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
          >
            <defs>
              <linearGradient id="yoyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {/* Gradient fill */}
            <path d={fillPath} fill="url(#yoyGradient)" />
            {/* Line */}
            <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Points with tooltips */}
          {dataPoints.map(p => (
            <div
              key={p.year}
              className="yoy-point"
              style={{ left: `calc(${(p.x / 1044) * 100}% - 7px)`, top: `calc(${(p.y / 260) * 100}% - 7px)` }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="7" fill={lineColor} />
                <circle cx="7" cy="7" r="3.5" fill="white" />
              </svg>
              <div className="yoy-point-tooltip">
                <div className="bar-tooltip-title">{p.year}</div>
                <div className="bar-tooltip-row">Rate: {p.rate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="yoy-x-axis">
        <div className="yoy-x-spacer" />
        <div className="yoy-x-labels">
          {['2022', '2023', '2024', '2025'].map(y => (
            <span key={y} className="yoy-x-label">{y}</span>
          ))}
        </div>
      </div>
    </>
  );
}

function MonthlyShareChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const canvasRef = useRef(null);
  const yLabels = ['90%', '80%', '70%', '60%', '50%', '40%', '30%', '20%', '10%', '0%'];
  const xLabels = ['Jan 2022', 'Aug 2022', 'Mar 2023', 'Oct 2023', 'May 2024', 'Dec 2024', 'Jul 2025', 'Feb 2026'];

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // Data points extracted from chart-line.svg path (svgX, svgY) — viewBox 0 0 1066 270.625
  const svgPoints = [
    [1,262.923],[22.7145,252.923],[44.4288,239.59],[66.1431,246.256],[87.8574,256.256],
    [109.572,262.923],[131.286,266.256],[153,196.256],[174.715,186.256],[196.429,229.59],
    [218.143,246.256],[239.857,252.923],[261.572,259.59],[283.286,262.923],[305,252.923],
    [326.715,206.256],[348.429,186.256],[370.143,179.59],[391.857,219.59],[413.572,246.256],
    [435.286,252.923],[457,259.59],[478.715,262.923],[500.429,266.256],[522.143,262.923],
    [543.857,256.256],[565.572,246.256],[587.286,252.923],[609,196.256],[630.715,199.59],
    [652.429,239.59],[674.143,252.923],[695.857,259.59],[717.572,262.923],[739.286,266.256],
    [761,269.59],[782.715,262.923],[804.429,252.923],[826.143,239.59],[847.857,196.256],
    [869.572,179.59],[891.286,186.256],[913,206.256],[934.715,229.59],[956.429,246.256],
    [978.143,46.256],[999.857,6.256],[1021.572,196.256],[1043.286,229.59],[1065,239.59],
  ];

  // Build month labels and share values from SVG data
  const dataPoints = svgPoints.map(([svgX, svgY], i) => {
    const monthIdx = (0 + i) % 12; // starts Jan 2022
    const year = 2022 + Math.floor((0 + i) / 12);
    const label = `${monthNames[monthIdx]} ${year}`;
    const share = Math.round((1 - svgY / 270.625) * 1000) / 10;
    const xPct = svgX / 1066 * 100; // percentage across canvas
    const yPx = 24.08 + (svgY / 270.625) * 268.63; // pixel top in canvas
    return { label, share, xPct, yPx };
  });

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseXPct = ((e.clientX - rect.left) / rect.width) * 100;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < dataPoints.length; i++) {
      const dist = Math.abs(dataPoints[i].xPct - mouseXPct);
      if (dist < minDist) { minDist = dist; closest = i; }
    }
    setHoveredIdx(closest);
  };

  const pt = hoveredIdx !== null ? dataPoints[hoveredIdx] : null;

  return (
    <>
      <div className="monthly-chart">
        <div className="monthly-y-axis">
          {yLabels.map(l => <span key={l} className="monthly-y-label">{l}</span>)}
        </div>
        <div
          ref={canvasRef}
          className="monthly-canvas"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Grid lines */}
          {[300, 266.67, 233.33, 200, 166.67, 133.33, 100, 66.67, 33.33, 0].map((top, i) => (
            <div key={i} className="monthly-grid-line" style={{ top }} />
          ))}

          {/* Chart fill */}
          <div className="monthly-fill" style={{ top: 24.08, height: 278.59 }}>
            <img src={chartFill} alt="" />
          </div>

          {/* Chart line */}
          <div className="monthly-line" style={{ top: 24.08, height: 268.63 }}>
            <img src={chartLine} alt="" />
          </div>

          {/* Hover point - follows nearest data point */}
          {pt && (
            <div
              className="monthly-hover-point"
              style={{ left: `calc(${pt.xPct}% - 6px)`, top: pt.yPx - 6, opacity: 1, transition: 'left 0.1s ease, top 0.1s ease' }}
            >
              <img src={hoverPoint} alt="" />
            </div>
          )}

          {/* Tooltip - aligned at the data point tip */}
          {pt && (
            <div
              className="monthly-tooltip"
              style={{
                left: `${pt.xPct}%`,
                top: pt.yPx - 8,
                transform: 'translate(-100%, -100%)',
                opacity: 1,
                transition: 'left 0.1s ease, top 0.1s ease',
              }}
            >
              <div className="monthly-tooltip-title">{pt.label}</div>
              <div className="monthly-tooltip-value">Share: {pt.share}%</div>
            </div>
          )}
        </div>
      </div>
      <div className="monthly-x-axis">
        <div className="monthly-x-spacer" />
        <div className="monthly-x-labels">
          {xLabels.map(l => <span key={l} className="monthly-x-label">{l}</span>)}
        </div>
      </div>
    </>
  );
}

function App() {
  const [sidebarTab, setSidebarTab] = useState('Visa Analysis');
  const [activeMainTab, setActiveMainTab] = useState('Demand');
  const [academicYear, setAcademicYear] = useState('All Years');
  const [sourceRegion, setSourceRegion] = useState('All Region');
  const [sourceCountry, setSourceCountry] = useState('All Countries');
  const [kwMonth, setKwMonth] = useState('All Months');
  const [kwRegionType, setKwRegionType] = useState('All Region');
  const [kwCity, setKwCity] = useState('All Cities');
  const [activePricingSection, setActivePricingSection] = useState('Pricing Power');
  const [pricingScrollTarget, setPricingScrollTarget] = useState(null);
  const [activeOccupancySection, setActiveOccupancySection] = useState('Occupancy Rate');
  const [occupancyScrollTarget, setOccupancyScrollTarget] = useState(null);
  const [ocCity, setOcCity] = useState('All Cities');
  const [ocMonth, setOcMonth] = useState('All Months');
  const [prCity, setPrCity] = useState('All Cities');
  const [prMonth, setPrMonth] = useState('All Months');
  const [prDuration, setPrDuration] = useState('All Durations');
  const [prRoomType, setPrRoomType] = useState('All Types');
  const [prPriceBand, setPrPriceBand] = useState('All Band');

  const kwMonths = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June'];
  const kwRegionTypes = ['All Region', 'England', 'Scotland', 'Wales', 'Northern Ireland'];
  const kwCities = ['All Cities', 'London', 'Edinburgh', 'Manchester', 'Oxford', 'Cambridge', 'Birmingham'];

  const prCities = ['All Cities', 'London', 'Edinburgh', 'Manchester', 'Oxford', 'Cambridge', 'Birmingham'];
  const prMonths = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const prDurations = ['All Durations', '6 Months', '12 Months', '24 Months', '36 Months'];
  const prRoomTypes = ['All Types', 'Studio', 'Ensuite', 'Non Ensuite'];
  const prPriceBands = ['All Band', 'Budget', 'Mid', 'Premium'];

  const ocCities = ['All Cities', 'London', 'Edinburgh', 'Manchester', 'Oxford', 'Cambridge', 'Birmingham', 'Coventry', 'Durham', 'Newcastle', 'Exeter', 'Nottingham'];
  const ocMonths = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [stickyFilters, setStickyFilters] = useState(false);
  const filterPanelRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (filterPanelRef.current) {
        const rect = filterPanelRef.current.getBoundingClientRect();
        setStickyFilters(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const filterContent = (
    <>
      {sidebarTab === 'Keyword Analysis' ? (
        <>
          <FilterSelect label="Year" value={academicYear} options={academicYears} onChange={setAcademicYear} compact />
          <FilterSelect label="Month" value={kwMonth} options={kwMonths} onChange={setKwMonth} compact />
          <FilterSelect label="Region Type" value={kwRegionType} options={kwRegionTypes} onChange={setKwRegionType} compact />
          <FilterSelect label="City" value={kwCity} options={kwCities} onChange={setKwCity} compact />
        </>
      ) : activeMainTab === 'Occupancy' ? (
        <>
          <FilterSelect label="Academic Year" value={academicYear} options={academicYears} onChange={setAcademicYear} />
          <FilterSelect label="City" value={ocCity} options={ocCities} onChange={setOcCity} />
          <FilterSelect label="Month" value={ocMonth} options={ocMonths} onChange={setOcMonth} />
        </>
      ) : activeMainTab === 'Pricing' ? (
        <>
          <FilterSelect label="Academic Year" value={academicYear} options={academicYears} onChange={setAcademicYear} compact />
          <FilterSelect label="City" value={prCity} options={prCities} onChange={setPrCity} compact />
          <FilterSelect label="Month" value={prMonth} options={prMonths} onChange={setPrMonth} compact />
          <FilterSelect label="Duration Band" value={prDuration} options={prDurations} onChange={setPrDuration} compact />
          <FilterSelect label="Room Type" value={prRoomType} options={prRoomTypes} onChange={setPrRoomType} compact />
          <FilterSelect label="Price Band" value={prPriceBand} options={prPriceBands} onChange={setPrPriceBand} compact />
        </>
      ) : (
        <>
          <FilterSelect label="Academic Year" value={academicYear} options={academicYears} onChange={setAcademicYear} />
          <FilterSelect label="Source Region" value={sourceRegion} options={sourceRegions} onChange={setSourceRegion} />
          <FilterSelect label="Source Country" value={sourceCountry} options={sourceCountries} onChange={setSourceCountry} />
        </>
      )}
    </>
  );

  return (
    <div className="app-layout">
      <Sidebar activeTab={sidebarTab} onTabChange={setSidebarTab} activeMainTab={activeMainTab} activePricingSection={activePricingSection} onPricingSectionChange={(s) => { setActivePricingSection(s); setPricingScrollTarget(Date.now() + ':' + s); }} activeOccupancySection={activeOccupancySection} onOccupancySectionChange={(s) => { setActiveOccupancySection(s); setOccupancyScrollTarget(Date.now() + ':' + s); }} />

      <div className="main-content">
        {/* Nav Bar */}
        <div className="navbar" />

        {/* Hero + Tabs + Filter Area */}
        <div className="hero-filter-area">
          <div className="hero-section">
            <HeroCanvas />
            <div className="hero-overlay" />
            <div className="hero-content">
              <h1 className="hero-title">Discover Student Housing Trend across the UK</h1>
              <p className="hero-subtitle">amberRadar delivers real-time demand, pricing, and supply insights for smart decisions</p>
            </div>
          </div>

          {/* Tab List - positioned outside hero to avoid overflow clip */}
          <div className="tab-list">
            {[
              { id: 'Demand', icon: userIcon },
              { id: 'Pricing', icon: moneyIcon },
              { id: 'Occupancy', icon: buildingIcon },
            ].map(tab => (
              <button
                key={tab.id}
                className={`tab-item ${activeMainTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveMainTab(tab.id)}
              >
                <img src={tab.icon} alt="" />
                {tab.id}
              </button>
            ))}
          </div>

          {/* Filter Panel */}
          <div className="filter-panel" ref={filterPanelRef}>
            <div className="filter-panel-inner">
              {filterContent}
            </div>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className={`sticky-filter-bar ${stickyFilters ? 'visible' : ''}`}>
          <div className="sticky-filter-inner">
            {filterContent}
          </div>
        </div>

        {/* Page Content - switches based on sidebar tab */}
        {activeMainTab === 'Occupancy' ? (
          <OccupancyContent activeOccupancySection={activeOccupancySection} onSectionChange={setActiveOccupancySection} scrollTarget={occupancyScrollTarget} />
        ) : sidebarTab === 'UCAS Analysis' ? (
          <UCASContent />
        ) : sidebarTab === 'Keyword Analysis' ? (
          <KeywordContent />
        ) : activeMainTab === 'Pricing' ? (
          <PricingContent activePricingSection={activePricingSection} onSectionChange={setActivePricingSection} scrollTarget={pricingScrollTarget} />
        ) : (
        <>
        {/* Section Title */}
        <div className="section-title">UK Visa Analysis</div>

        {/* KPI Funnel */}
        <div className="kpi-funnel">
          <div className="kpi-item">
            <div className="kpi-label-row">
              <img src={documentIcon} alt="" />
              <span className="kpi-label">TOTAL APPLICATIONS</span>
            </div>
            <div className="kpi-value" style={{ color: '#2b2b2b' }}>1,796,473</div>
          </div>
          <div className="kpi-divider" />
          <div className="kpi-item">
            <div className="kpi-label-row">
              <img src={approveIcon} alt="" />
              <span className="kpi-label">ISSUED (ACCEPTED)</span>
            </div>
            <div className="kpi-value" style={{ color: '#2b2b2b' }}>1,740,544</div>
          </div>
          <div className="kpi-divider" />
          <div className="kpi-item">
            <div className="kpi-label-row">
              <img src={percentageIcon} alt="" />
              <span className="kpi-label">ACCEPTANCE RATE</span>
            </div>
            <div className="kpi-value" style={{ color: '#2b2b2b' }}>96.45%</div>
          </div>
        </div>

        {/* Quarterly Visa Applications Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-section">
              <ChartIconBars />
              <div className="chart-title-text">
                <h3>Quarterly Visa Applications</h3>
                <p>Shows price distribution dynamics. Shaded band represents the core market range (25th-75th percentile).</p>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#a78bfa' }} />
                <span className="legend-label">Accepted</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#e5e5e5' }} />
                <span className="legend-label">Total Application</span>
              </div>
            </div>
          </div>
          <div className="chart-divider" />
          <QuarterlyBarChart />
        </div>

        {/* Application by Region Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-section" style={{ flex: 1 }}>
              <ChartIconBars />
              <div className="chart-title-text">
                <h3>Application by Region</h3>
                <p>Shows price distribution dynamics. Shaded band represents the core market range (25th-75th percentile).</p>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#1375e4' }} />
                <span className="legend-label">Accepted</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#a1c8f4' }} />
                <span className="legend-label">Total Application</span>
              </div>
            </div>
          </div>
          <div className="chart-divider" />
          <RegionBarChart />
        </div>

        {/* YOY Acceptance Rate */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-section" style={{ flex: 1 }}>
              <ChartIconBars />
              <div className="chart-title-text">
                <h3>YOY ACCEPTANCE RATE</h3>
                <p className="subtitle-gray">Year-over-year trend of visa issuance rate (issued / total decisions).</p>
              </div>
            </div>
          </div>
          <div className="chart-divider" />
          <YOYAcceptanceChart />
        </div>

        {/* Monthly Share % */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-section" style={{ flex: 1 }}>
              <ChartIconBars />
              <div className="chart-title-text">
                <h3>Monthly share %</h3>
                <p className="subtitle-gray">Year-over-year trend of visa issuance rate (issued / total decisions).</p>
              </div>
            </div>
          </div>
          <div className="chart-divider" />
          <MonthlyShareChart />
        </div>

        {/* Bottom spacer */}
        <div style={{ height: 60 }} />
        </>
        )}
      </div>
    </div>
  );
}

export default App;
