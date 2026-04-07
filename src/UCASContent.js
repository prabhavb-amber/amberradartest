import React, { useState } from 'react';

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

// TOP 10 SOURCE COUNTRIES - Horizontal bar chart
const sourceCountriesData = [
  { name: 'England', accepted: 858.8, total: 381.36 },
  { name: 'Scotland', accepted: 55.37, total: 29.38 },
  { name: 'China', accepted: 42.38, total: 23.73 },
  { name: 'Wales', accepted: 38.42, total: 21.47 },
  { name: 'Northern Ireland', accepted: 29.38, total: 16.39 },
  { name: 'India', accepted: 24.86, total: 14.13 },
  { name: 'United States of America', accepted: 18.08, total: 10.17 },
  { name: 'Hong Kong', accepted: 15.82, total: 9.04 },
  { name: 'Ireland', accepted: 12.43, total: 6.78 },
  { name: 'Nigeria', accepted: 10.17, total: 5.37 },
];

function SourceCountriesChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <div style={{ position: 'relative', height: 480, overflow: 'visible' }}>
      {/* Grid lines */}
      {[192, 305, 418, 531, 644, 757, 870, 983, 1096].map(left => (
        <div key={left} style={{ position: 'absolute', left, top: 0, width: 1, height: 420, background: '#f1f5f9' }} />
      ))}

      {/* Bars */}
      {sourceCountriesData.map((d, i) => {
        const top = i * 42;
        const isHovered = hoveredIdx === i;
        const isDimmed = hoveredIdx !== null && !isHovered;
        return (
          <div key={d.name} style={{
            position: 'absolute', top, height: 24, left: 0, right: 0,
            display: 'flex', alignItems: 'center', cursor: 'pointer'
          }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div style={{
              width: 192, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12,
              color: '#525252', textAlign: 'right', paddingRight: 12, whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0, lineHeight: '24px'
            }}>{d.name}</div>
            <div style={{ height: 24, background: '#a78bfa', borderRadius: 4, width: d.accepted, transition: 'filter 0.15s ease', filter: isDimmed ? 'opacity(0.4)' : isHovered ? 'brightness(1.1)' : 'none' }} />
            <div style={{ height: 24, background: '#e5e5e5', borderRadius: '0 4px 4px 0', width: d.total, transition: 'filter 0.15s ease', filter: isDimmed ? 'opacity(0.4)' : isHovered ? 'brightness(1.05)' : 'none' }} />
            {isHovered && (
              <div style={{
                position: 'absolute', left: 192 + d.accepted + d.total + 8, top: '50%',
                transform: 'translateY(-50%)', background: '#171717', color: 'white',
                borderRadius: 10, padding: '10px 14px', whiteSpace: 'nowrap', zIndex: 5
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, lineHeight: '18px' }}>{d.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '16px', color: 'rgba(255,255,255,0.7)' }}>
                  Accepted: {Math.round(d.accepted * 15000).toLocaleString()}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '16px', color: 'rgba(255,255,255,0.7)' }}>
                  Total: {Math.round((d.accepted + d.total) * 15000).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* X-axis labels — positioned to align with grid lines */}
      {['0', '2M', '4M', '6M', '8M', '10M', '12M', '14M', '16M'].map((label, i) => {
        const gridPositions = [192, 305, 418, 531, 644, 757, 870, 983, 1096];
        return (
          <span key={label} style={{
            position: 'absolute', top: 448, left: gridPositions[i],
            transform: 'translateX(-50%)',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 11,
            color: '#525252', textAlign: 'center', whiteSpace: 'nowrap',
          }}>{label}</span>
        );
      })}
    </div>
  );
}

// APPLICATIONS VS ACCEPTED - Grouped bar chart
const appVsAcceptedData = [
  { year: '2022', applicants: 372, accepted: 264 },
  { year: '2023', applicants: 377.76, accepted: 270 },
  { year: '2024', applicants: 336, accepted: 252 },
  { year: '2025', applicants: 324, accepted: 276 },
];

function ApplicationsVsAcceptedChart() {
  const [hoveredYear, setHoveredYear] = useState(null);
  const chartHeight = 420;
  const yLabels = ['3.5M', '3M', '2.5M', '2M', '1.5M', '1M', '500K', '0'];
  const gridTops = [0, 60, 120, 180, 240, 300, 360, 420];
  const tooltipData = {
    '2022': { applicants: '3.1M', accepted: '2.2M' },
    '2023': { applicants: '3.15M', accepted: '2.25M' },
    '2024': { applicants: '2.8M', accepted: '2.1M' },
    '2025': { applicants: '2.7M', accepted: '2.3M' },
  };

  return (
    <div style={{ position: 'relative', height: 470 }}>
      {/* Y-axis labels and grid lines */}
      {yLabels.map((label, i) => (
        <React.Fragment key={label}>
          <div style={{
            position: 'absolute', left: 0, width: 50, textAlign: 'right',
            top: gridTops[i] - 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#525252'
          }}>{label}</div>
          <div style={{
            position: 'absolute', left: 62, right: 0, top: gridTops[i],
            height: 1, background: '#f1f5f9'
          }} />
        </React.Fragment>
      ))}

      {/* Bar groups */}
      {appVsAcceptedData.map((d, i) => {
        const groupCenterX = 189.75 + i * 257;
        const barWidth = 60;
        const isHovered = hoveredYear === d.year;

        return (
          <div key={d.year}
            onMouseEnter={() => setHoveredYear(d.year)}
            onMouseLeave={() => setHoveredYear(null)}
            style={{
              position: 'absolute',
              left: groupCenterX - barWidth - 2,
              width: barWidth * 2 + 4,
              top: 0,
              height: chartHeight,
              cursor: 'pointer',
            }}
          >
            {/* Applicants bar (blue) */}
            <div style={{
              position: 'absolute', left: 0, width: barWidth,
              height: d.applicants, top: chartHeight - d.applicants,
              background: '#1375e4', borderRadius: '4px 4px 0 0',
              transition: 'filter 0.15s ease',
              filter: hoveredYear !== null && !isHovered ? 'opacity(0.4)' : 'none'
            }} />
            {/* Accepted bar (light blue) */}
            <div style={{
              position: 'absolute', left: barWidth + 4, width: barWidth,
              height: d.accepted, top: chartHeight - d.accepted,
              background: '#a1c8f4', borderRadius: '4px 4px 0 0',
              transition: 'filter 0.15s ease',
              filter: hoveredYear !== null && !isHovered ? 'opacity(0.4)' : 'none'
            }} />
            {/* Tooltip */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                left: '50%', transform: 'translateX(-50%)',
                top: Math.min(chartHeight - d.applicants, chartHeight - d.accepted) - 68,
                background: '#171717', color: 'white', borderRadius: 10,
                padding: '10px 14px', whiteSpace: 'nowrap', zIndex: 5, textAlign: 'left'
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, lineHeight: '18px' }}>{d.year}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '16px', color: 'rgba(255,255,255,0.7)' }}>
                  Applicants: {tooltipData[d.year].applicants}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '16px', color: 'rgba(255,255,255,0.7)' }}>
                  Accepted: {tooltipData[d.year].accepted}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Year labels */}
      {appVsAcceptedData.map((d, i) => {
        const groupCenterX = 189.75 + i * 257;
        return (
          <div key={`label-${d.year}`} style={{
            position: 'absolute', left: groupCenterX, transform: 'translateX(-50%)',
            top: 432, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, color: '#525252', textAlign: 'center'
          }}>{d.year}</div>
        );
      })}
    </div>
  );
}

// YOY ACCEPTANCE RATE for UCAS
function UCASYoyChart() {
  const yLabels = ['72%', '71.5%', '71%', '70.5%', '70%', '69.5%'];
  // From Figma: points relative to canvas container (1028x260)
  // Point centers (left + 7, top + 7): (7, 124.8), (345, 176.8), (683, 22.25), (1021, 0)
  const dataPoints = [
    { year: 2022, cx: 7, cy: 131.8, rate: '70.9%' },
    { year: 2023, cx: 345, cy: 183.8, rate: '70.4%' },
    { year: 2024, cx: 683, cy: 29.25, rate: '71.8%' },
    { year: 2025, cx: 1021, cy: 7, rate: '72%' },
  ];

  const lineColor = '#22c55e';
  const linePath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.cx},${p.cy}`).join(' ');
  const fillPath = linePath + ` L${dataPoints[3].cx},268 L${dataPoints[0].cx},268 Z`;

  return (
    <>
      <div className="yoy-chart">
        <div className="yoy-y-axis" style={{ width: 44 }}>
          {yLabels.map(l => (
            <span key={l} style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 11,
              color: '#525252', textAlign: 'right'
            }}>{l}</span>
          ))}
        </div>
        <div className="yoy-canvas" style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          {[0, 52, 104, 156, 208, 260].map((top, i) => (
            <div key={i} className="yoy-grid-line" style={{ top }} />
          ))}

          {/* SVG chart - viewBox matches Figma's 1028x268 */}
          <svg viewBox="0 0 1028 268" preserveAspectRatio="none"
            style={{ position: 'absolute', left: 0, top: -4, width: '100%', height: 'calc(100% + 8px)' }}>
            <defs>
              <linearGradient id="ucasYoyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0.01" />
              </linearGradient>
            </defs>
            <path d={fillPath} fill="url(#ucasYoyGradient)" />
            <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Points - positioned by percentage for responsiveness */}
          {dataPoints.map(p => (
            <div key={p.year} className="yoy-point"
              style={{
                left: `calc(${(p.cx / 1028) * 100}% - 7px)`,
                top: `calc(${(p.cy / 268) * 100}% - 7px + -4px)`
              }}>
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="5.75" fill="white" stroke={lineColor} strokeWidth="2.5" />
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

// Interactive Donut Chart
function DonutChart({ data, size = 280, thickness = 60 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - thickness) / 2;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let currentAngle = -90; // start from top

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

    const x1o = cx + outerR * Math.cos(startRad);
    const y1o = cy + outerR * Math.sin(startRad);
    const x2o = cx + outerR * Math.cos(endRad);
    const y2o = cy + outerR * Math.sin(endRad);
    const x1i = cx + innerR * Math.cos(endRad);
    const y1i = cy + innerR * Math.sin(endRad);
    const x2i = cx + innerR * Math.cos(startRad);
    const y2i = cy + innerR * Math.sin(startRad);

    const path = [
      `M ${x1o} ${y1o}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`,
      `L ${x1i} ${y1i}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2i} ${y2i}`,
      'Z'
    ].join(' ');

    // Tooltip position (middle of arc)
    const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
    const tooltipR = radius;
    const tx = cx + tooltipR * Math.cos(midAngle);
    const ty = cy + tooltipR * Math.sin(midAngle);

    return { ...d, path, tx, ty, percentage: ((d.value / total) * 100).toFixed(1), index: i };
  });

  return (
    <div style={{ position: 'relative', width: size + 24, height: size + 24, padding: 12 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {slices.map((s) => (
          <path
            key={s.index}
            d={s.path}
            fill={s.color}
            stroke="white"
            strokeWidth="2"
            style={{
              cursor: 'pointer',
              transform: hoveredIndex === s.index ? `scale(1.04)` : 'scale(1)',
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
          position: 'absolute',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#171717',
          color: 'white',
          borderRadius: 10,
          padding: '10px 14px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 5,
          textAlign: 'center'
        }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, lineHeight: '18px' }}>
            {slices[hoveredIndex].label}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, lineHeight: '16px', color: 'rgba(255,255,255,0.7)' }}>
            {slices[hoveredIndex].percentage}%
          </div>
        </div>
      )}
    </div>
  );
}

// Donut chart components
function AgeGroupDistribution() {
  const data = [
    { color: '#15803d', label: '18', value: 28 },
    { color: '#16a34a', label: '21 - 24', value: 18 },
    { color: '#22c55e', label: '19', value: 15 },
    { color: '#4ade80', label: '35 and over', value: 10 },
    { color: '#86efac', label: '20', value: 10 },
    { color: '#bbf7d0', label: '30 - 34', value: 7 },
    { color: '#dcfce7', label: '25 - 29', value: 7 },
    { color: '#f0fdf4', label: '17 and under', value: 5 },
  ];

  return (
    <div className="chart-card" style={{ width: 'calc(50% - 12px)', display: 'inline-flex', flexDirection: 'column', verticalAlign: 'top', margin: 0 }}>
      <div className="chart-header" style={{ justifyContent: 'flex-start' }}>
        <div className="chart-title-section" style={{ flex: 1 }}>
          <ChartIconBars />
          <div className="chart-title-text">
            <h3>AGE GROUP DISTRIBUTION</h3>
            <p className="subtitle-gray">Year-over-year trend of visa issuance rate (issued / total decisions).</p>
          </div>
        </div>
      </div>
      <div className="chart-divider" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '16px 0 12px' }}>
        <DonutChart data={data} size={340} thickness={75} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', width: '100%', padding: '0 16px' }}>
          {data.map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 10, width: 'calc(25% - 6px)' }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12, color: '#525252', whiteSpace: 'nowrap' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GenderDistribution() {
  const data = [
    { color: '#1e3a8a', label: 'Woman', value: 45 },
    { color: '#2563eb', label: 'Man', value: 40 },
    { color: '#60a5fa', label: 'I prefer not to say', value: 10 },
    { color: '#bfdbfe', label: 'I use another term', value: 5 },
  ];

  return (
    <div className="chart-card" style={{ width: 'calc(50% - 12px)', display: 'inline-flex', flexDirection: 'column', verticalAlign: 'top', margin: 0 }}>
      <div className="chart-header" style={{ justifyContent: 'flex-start' }}>
        <div className="chart-title-section" style={{ flex: 1 }}>
          <ChartIconBars />
          <div className="chart-title-text">
            <h3>GENDER DISTRIBUTION</h3>
            <p className="subtitle-gray">Year-over-year trend of visa issuance rate (issued / total decisions).</p>
          </div>
        </div>
      </div>
      <div className="chart-divider" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '16px 0 12px' }}>
        <DonutChart data={data} size={340} thickness={75} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', justifyContent: 'center' }}>
          {data.map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12, color: '#525252' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UCASContent() {
  return (
    <>
      {/* Section Title */}
      <div className="section-title">UCAS Analysis</div>

      {/* KPI Funnel - same as Visa */}
      <div className="kpi-funnel">
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={require('./assets/document-icon.svg').default} alt="" />
            <span className="kpi-label">TOTAL APPLICATIONS</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>1,796,473</div>
        </div>
        <div className="kpi-divider" />
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={require('./assets/approve-icon.svg').default} alt="" />
            <span className="kpi-label">ISSUED (ACCEPTED)</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>1,740,544</div>
        </div>
        <div className="kpi-divider" />
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={require('./assets/percentage-icon.svg').default} alt="" />
            <span className="kpi-label">ACCEPTANCE RATE</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>96.45%</div>
        </div>
      </div>

      {/* TOP 10 SOURCE COUNTRIES */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3 style={{ letterSpacing: '0.8px' }}>TOP 10 SOURCE COUNTRIES</h3>
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
        <SourceCountriesChart />
      </div>

      {/* APPLICATIONS VS ACCEPTED */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3 style={{ letterSpacing: '0.8px' }}>APPLICATIONS VS ACCEPTED</h3>
              <p>Shows price distribution dynamics. Shaded band represents the core market range (25th-75th percentile).</p>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#a1c8f4' }} />
              <span className="legend-label">Accepted</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#1375e4' }} />
              <span className="legend-label">Total Application</span>
            </div>
          </div>
        </div>
        <div className="chart-divider" />
        <ApplicationsVsAcceptedChart />
      </div>

      {/* YOY ACCEPTANCE RATE */}
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
        <UCASYoyChart />
      </div>

      {/* Bottom row: Age Group + Gender Distribution */}
      <div style={{ display: 'flex', gap: 24, margin: '0 32px 24px' }}>
        <AgeGroupDistribution />
        <GenderDistribution />
      </div>

      <div style={{ height: 60 }} />
    </>
  );
}
