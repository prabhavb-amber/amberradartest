import React, { useState } from 'react';
import arrowDownRed from './assets/arrow-down-red.svg';
import arrowUpGreen from './assets/arrow-up-green.svg';
import searchVolIcon from './assets/search-vol-icon.svg';
import top10Icon from './assets/top10-icon.svg';
import monthGrowthIcon from './assets/month-growth-icon.svg';
import yoyGrowthIcon from './assets/yoy-growth-icon.svg';

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

// Reuse DonutChart from UCASContent pattern
function DonutChart({ data, size = 280, thickness = 60 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - thickness) / 2;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = angle > 180 ? 1 : 0;
    const outerR = radius + thickness / 2;
    const innerR = radius - thickness / 2;
    const path = [
      `M ${cx + outerR * Math.cos(startRad)} ${cy + outerR * Math.sin(startRad)}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${cx + outerR * Math.cos(endRad)} ${cy + outerR * Math.sin(endRad)}`,
      `L ${cx + innerR * Math.cos(endRad)} ${cy + innerR * Math.sin(endRad)}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${cx + innerR * Math.cos(startRad)} ${cy + innerR * Math.sin(startRad)}`,
      'Z'
    ].join(' ');
    return { ...d, path, percentage: ((d.value / total) * 100).toFixed(1), index: i };
  });

  return (
    <div style={{ position: 'relative', width: size + 24, height: size + 24, padding: 12 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {slices.map(s => (
          <path key={s.index} d={s.path} fill={s.color} stroke="white" strokeWidth="2"
            style={{
              cursor: 'pointer',
              transform: hoveredIndex === s.index ? 'scale(1.04)' : 'scale(1)',
              transformOrigin: `${cx}px ${cy}px`,
              transition: 'transform 0.2s ease',
              filter: hoveredIndex !== null && hoveredIndex !== s.index ? 'opacity(0.6)' : 'none'
            }}
            onMouseEnter={() => setHoveredIndex(s.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </svg>
      {hoveredIndex !== null && (
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          background: '#171717', color: 'white', borderRadius: 10, padding: '10px 14px',
          whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5, textAlign: 'center'
        }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, lineHeight: '18px' }}>{slices[hoveredIndex].label}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{slices[hoveredIndex].percentage}%</div>
        </div>
      )}
    </div>
  );
}

// KPI Cards
function KPICards() {
  const kpis = [
    { icon: searchVolIcon, label: 'TOTAL SEARCH VOLUME', value: '271.8L' },
    { icon: top10Icon, label: 'TOP 10 KEYWORDS %', value: '43.4%' },
    { icon: monthGrowthIcon, label: 'MONTH GROWTH', value: '-11.1%' },
    { icon: yoyGrowthIcon, label: 'YOY GROWTH', value: '+7.9%' },
  ];

  return (
    <div className="kpi-funnel">
      {kpis.map((kpi, i) => (
        <React.Fragment key={kpi.label}>
          <div className="kpi-item">
            <div className="kpi-label-row">
              <img src={kpi.icon} alt="" style={{ width: 20, height: 20 }} />
              <span className="kpi-label">{kpi.label}</span>
            </div>
            <div className="kpi-value" style={{ color: kpi.valueColor || '#2b2b2b' }}>{kpi.value}</div>
          </div>
          {i < kpis.length - 1 && <div className="kpi-divider" />}
        </React.Fragment>
      ))}
    </div>
  );
}

// Cities Losing/Gaining
const losingCities = [
  { name: 'Wrexham', value: '67%' },
  { name: 'Belfast', value: '59%' },
  { name: 'Watford', value: '56%' },
  { name: 'Hull', value: '56%' },
  { name: 'Rochester', value: '56%' },
];

const gainingCities = [
  { name: 'Egham', value: '58%' },
  { name: 'Hatfield', value: '58%' },
  { name: 'Northampton', value: '58%' },
  { name: 'Chester', value: '24%' },
  { name: 'Glasgow', value: '1.8%' },
];

function CityCard({ title, cities, isGaining }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <div className="chart-card" style={{ width: 'calc(50% - 12px)', display: 'inline-flex', flexDirection: 'column', margin: 0 }}>
      <div className="chart-header" style={{ justifyContent: 'flex-start' }}>
        <div className="chart-title-section" style={{ flex: 1 }}>
          <ChartIconBars />
          <div className="chart-title-text">
            <h3>{title}</h3>
            <p className="subtitle-gray">Year-over-year trend of visa issuance rate (issued / total decisions).</p>
          </div>
        </div>
      </div>
      <div className="chart-divider" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {cities.map((city, i) => (
          <div key={city.name}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              height: 47.5, borderBottom: i < cities.length - 1 ? '1px solid #f1f5f9' : 'none',
              cursor: 'pointer', transition: 'background 0.15s ease',
              background: hoveredIdx === i ? '#f9fafb' : 'transparent',
              paddingLeft: 0, paddingRight: 0,
            }}
          >
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, color: '#1e293b' }}>{city.name}</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <img
                src={isGaining ? arrowUpGreen : arrowDownRed}
                alt=""
                width={18}
                height={14}
                style={{ display: 'block' }}
              />
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontStyle: 'normal', fontSize: 14, color: isGaining ? '#16a34a' : '#ef4444' }}>
                {city.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// City Demand Concentration - Pareto Chart (from Figma node 2478:5801)
// Bar heights extracted from Figma inset percentages, cum % from dot positions
const cityDemandData = [
  { city: 'London', volume: 3650000, cum: 17.9 },
  { city: 'Edinburgh', volume: 1980000, cum: 26.9 },
  { city: 'St Andrews', volume: 1920000, cum: 35.6 },
  { city: 'Oxford', volume: 1800000, cum: 43.8 },
  { city: 'Manchester', volume: 1420000, cum: 50.3 },
  { city: 'Cambridge', volume: 1180000, cum: 55.7 },
  { city: 'Birmingham', volume: 1180000, cum: 61.0 },
  { city: 'Glasgow', volume: 1180000, cum: 66.4 },
  { city: 'Durham', volume: 640000, cum: 69.3 },
  { city: 'Leicester', volume: 620000, cum: 72.2 },
  { city: 'Leeds', volume: 600000, cum: 74.9 },
  { city: 'Bristol', volume: 580000, cum: 77.5 },
  { city: 'Cardiff', volume: 540000, cum: 80.0 },
  { city: 'Sheffield', volume: 520000, cum: 82.4 },
  { city: 'Nottingham', volume: 510000, cum: 84.7 },
  { city: 'Coventry', volume: 500000, cum: 87.0 },
  { city: 'Aberdeen', volume: 480000, cum: 89.1 },
  { city: 'Dundee', volume: 420000, cum: 91.1 },
  { city: 'Liverpool', volume: 380000, cum: 92.8 },
  { city: 'Exeter', volume: 350000, cum: 94.4 },
  { city: 'Brighton', volume: 340000, cum: 95.9 },
  { city: 'Newcastle', volume: 320000, cum: 97.4 },
  { city: 'Southampton', volume: 300000, cum: 98.8 },
  { city: 'York', volume: 260000, cum: 100 },
  { city: 'Canterbury', volume: 240000, cum: 100 },
];

function CityDemandChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const chartHeight = 360;
  const maxVolume = 4000000;
  const yLabels = ['4M', '3.5M', '3M', '2.5M', '2M', '1.5M', '1M', '500K', '0'];
  const cumLabels = ['100%', '87.5%', '75%', '62.5%', '50%', '37.5%', '25%', '12.5%', '0%'];
  const barCount = cityDemandData.length;

  // cumPoints will be calculated in render based on actual width

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title-section" style={{ flex: 1 }}>
          <ChartIconBars />
          <div className="chart-title-text">
            <h3>CITY DEMAND CONCENTRATION</h3>
            <p>Shows which cities drive 80% of search demand — helps prioritize expansion.</p>
          </div>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#a78bfa' }} />
            <span className="legend-label" style={{ color: '#64748b', fontWeight: 500 }}>Search Volume</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#e5e5e5' }} />
            <span className="legend-label" style={{ color: '#64748b', fontWeight: 500 }}>Cumulative %</span>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: 1, background: '#f1f5f9' }} />
      <div style={{ display: 'flex', width: '100%', marginTop: 16 }}>
        {/* Y-axis left */}
        <div style={{ width: 70, position: 'relative', height: chartHeight, flexShrink: 0 }}>
          {yLabels.map((l, i) => (
            <span key={l} style={{
              position: 'absolute', right: 8, top: (i / (yLabels.length - 1)) * chartHeight,
              transform: 'translateY(-50%)',
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#525252', textAlign: 'right'
            }}>{l}</span>
          ))}
        </div>

        {/* Chart area - use fixed 1000px viewBox for SVG alignment */}
        <div style={{ flex: 1, position: 'relative', height: chartHeight + 90, minWidth: 0 }}>
          {/* Grid lines */}
          {yLabels.map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: 0, right: 0, top: (i / (yLabels.length - 1)) * chartHeight,
              height: 1, background: '#f1f5f9'
            }} />
          ))}

          {/* Bars + Cumulative as single aligned SVG */}
          <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: chartHeight, overflow: 'visible' }}
            viewBox={`0 0 ${barCount * 40} ${chartHeight}`} preserveAspectRatio="none">
            {/* Bars */}
            {cityDemandData.map((d, i) => {
              const barH = (d.volume / maxVolume) * chartHeight;
              return (
                <rect key={`bar-${i}`}
                  x={i * 40 + 1} y={chartHeight - barH}
                  width={38} height={barH}
                  rx={3} fill="#a78bfa"
                  style={{
                    cursor: 'pointer',
                    opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.35 : 1,
                    transition: 'opacity 0.15s ease'
                  }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
            {/* Cumulative line */}
            <polyline
              points={cityDemandData.map((d, i) => `${i * 40 + 20},${chartHeight - (d.cum / 100) * chartHeight}`).join(' ')}
              fill="none" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Cumulative dots - separate SVG to keep circles round */}
          <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: chartHeight, pointerEvents: 'none', overflow: 'visible' }}>
            {cityDemandData.map((d, i) => {
              const xPct = ((i * 40 + 20) / (barCount * 40)) * 100;
              const cy = chartHeight - (d.cum / 100) * chartHeight;
              return (
                <circle key={i} cx={`${xPct}%`} cy={cy} r="5" fill="white" stroke="#d4d4d4" strokeWidth="2" />
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredIdx !== null && (() => {
            const d = cityDemandData[hoveredIdx];
            const barH = (d.volume / maxVolume) * chartHeight;
            return (
              <div style={{
                position: 'absolute',
                left: `${((hoveredIdx * 40 + 20) / (barCount * 40)) * 100}%`,
                top: chartHeight - barH - 50,
                transform: 'translateX(-50%)',
                background: '#171717', color: 'white', borderRadius: 10,
                padding: '8px 12px', whiteSpace: 'nowrap', zIndex: 5,
                pointerEvents: 'none'
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{d.city}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  Vol: {(d.volume / 1000000).toFixed(1)}M | Cum: {d.cum}%
                </div>
              </div>
            );
          })()}

          {/* X-axis labels */}
          <div style={{
            position: 'absolute', top: chartHeight + 28, left: 0, right: 0,
          }}>
            {cityDemandData.map((d, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${((i * 40 + 20) / (barCount * 40)) * 100 - 2}%`,
                transform: 'translateX(-50%)',
                textAlign: 'center'
              }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12,
                  color: '#525252', whiteSpace: 'nowrap',
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'top center',
                  display: 'block',
                }}>{d.city}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Y-axis right (cumulative) */}
        <div style={{ width: 50, position: 'relative', height: chartHeight, flexShrink: 0, paddingLeft: 8 }}>
          {cumLabels.map((l, i) => (
            <span key={l} style={{
              position: 'absolute', left: 8, top: (i / (cumLabels.length - 1)) * chartHeight,
              transform: 'translateY(-50%)',
              fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252', whiteSpace: 'nowrap'
            }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// YOY Search Volume Change
function YOYSearchVolumeChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const data = [
    { month: 'Jan 2025', value: 7, color: '#2563eb' },
    { month: 'Feb 2025', value: 8, color: '#bfdbfe' },
  ];
  const maxVal = 9;
  const chartHeight = 360;
  const yLabels = ['+9%', '+8%', '+7%', '+6%', '+5%', '+4%', '+3%', '+2%', '+1%', '+0%'];
  const steps = yLabels.length - 1; // 9

  return (
    <div className="chart-card" style={{ width: 'calc(50% - 12px)', display: 'inline-flex', flexDirection: 'column', margin: 0 }}>
      <div className="chart-header" style={{ justifyContent: 'flex-start' }}>
        <div className="chart-title-section" style={{ flex: 1 }}>
          <ChartIconBars />
          <div className="chart-title-text">
            <h3>YOY SEARCH VOLUME CHANGE</h3>
            <p className="subtitle-gray">Year-over-year trend of visa issuance rate (issued / total decisions).</p>
          </div>
        </div>
      </div>
      <div className="chart-divider" />
      <div style={{ position: 'relative', height: chartHeight + 40, display: 'flex', gap: 6 }}>
        {/* Y-axis labels */}
        <div style={{ width: 36, position: 'relative', height: chartHeight, flexShrink: 0 }}>
          {yLabels.map((l, i) => (
            <span key={l} style={{
              position: 'absolute', right: 0, top: (i / steps) * chartHeight,
              transform: 'translateY(-50%)',
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#525252', textAlign: 'right'
            }}>{l}</span>
          ))}
        </div>
        <div style={{ flex: 1, position: 'relative', height: chartHeight + 40 }}>
          {/* Grid lines */}
          {yLabels.map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: 0, right: 0, top: (i / steps) * chartHeight,
              height: 1, background: '#f1f5f9'
            }} />
          ))}
          {/* Bars - extend from 0% (bottom) up to value */}
          {data.map((d, i) => {
            const barH = (d.value / maxVal) * chartHeight;
            const barTop = chartHeight - barH;
            const isHovered = hoveredIdx === i;
            return (
              <div key={d.month}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position: 'absolute',
                  left: `${10 + i * 48}%`,
                  width: '34%',
                  height: barH,
                  top: barTop,
                  background: d.color,
                  borderRadius: '4px 4px 0 0',
                  cursor: 'pointer',
                  filter: hoveredIdx !== null && !isHovered ? 'opacity(0.4)' : 'none',
                  transition: 'filter 0.15s ease'
                }}
              >
                {isHovered && (
                  <div style={{
                    position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                    background: '#171717', color: 'white', borderRadius: 10,
                    padding: '8px 12px', whiteSpace: 'nowrap', zIndex: 5, marginBottom: 4
                  }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{d.month}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Change: +{d.value}%</div>
                  </div>
                )}
              </div>
            );
          })}
          {/* X labels */}
          {data.map((d, i) => (
            <div key={d.month} style={{
              position: 'absolute',
              top: chartHeight + 8,
              left: `${10 + i * 48 + 17}%`,
              transform: 'translateX(-50%)',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12, color: '#525252'
            }}>{d.month}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Keyword Categories Donut
function KeywordCategoriesChart() {
  const data = [
    { color: '#4338ca', label: 'University Brand', value: 35 },
    { color: '#6366f1', label: 'Specific Properties', value: 28 },
    { color: '#818cf8', label: 'City Accommodation', value: 18 },
    { color: '#a5b4fc', label: 'University Accommodation', value: 12 },
    { color: '#c7d2fe', label: 'Near Place Accommodation', value: 7 },
  ];

  return (
    <div className="chart-card" style={{ width: 'calc(50% - 12px)', display: 'inline-flex', flexDirection: 'column', margin: 0 }}>
      <div className="chart-header" style={{ justifyContent: 'flex-start' }}>
        <div className="chart-title-section" style={{ flex: 1 }}>
          <ChartIconBars />
          <div className="chart-title-text">
            <h3>KEYWORD CATEGORIES</h3>
            <p className="subtitle-gray">Year-over-year trend of visa issuance rate (issued / total decisions).</p>
          </div>
        </div>
      </div>
      <div className="chart-divider" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '16px 0 4px' }}>
        <DonutChart data={data} size={300} thickness={66} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', justifyContent: 'center', width: '100%', padding: '4px 16px' }}>
          {data.map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12, color: '#525252', whiteSpace: 'nowrap' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function KeywordContent() {
  return (
    <>
      <div className="section-title">Keyword Analysis</div>

      <KPICards />

      {/* Cities Losing / Gaining */}
      <div style={{ display: 'flex', gap: 24, margin: '24px 32px' }}>
        <CityCard title="CITIES LOSING SEARCH DEMAND" cities={losingCities} isGaining={false} />
        <CityCard title="CITIES GAINING SEARCH DEMAND" cities={gainingCities} isGaining={true} />
      </div>

      {/* City Demand Concentration */}
      <CityDemandChart />

      {/* Bottom row */}
      <div style={{ display: 'flex', gap: 24, margin: '24px 32px' }}>
        <KeywordCategoriesChart />
        <YOYSearchVolumeChart />
      </div>

      <div style={{ height: 60 }} />
    </>
  );
}
