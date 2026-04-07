import React, { useState, useEffect, useRef } from 'react';

const percentageIcon = require('./assets/percentage-icon.svg').default;
const priceWeekIcon = require('./assets/price-week-icon.svg').default;
const durationIcon = require('./assets/duration-icon.svg').default;
const priceChangeIcon = require('./assets/price-change-icon.svg').default;
const yoyIcon = require('./assets/yoy-icon.svg').default;

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

// ─── CHART 1: MEDIAN VS AVERAGE WEEKLY PRICE TREND ──────────────────────────

const medianAvgData = {
  months: [
    'Dec 2023','Jan 2024','Feb 2024','Mar 2024','Apr 2024','May 2024',
    'Jun 2024','Jul 2024','Aug 2024','Sep 2024','Oct 2024','Nov 2024',
    'Dec 2024','Jan 2025','Feb 2025','Mar 2025','Apr 2025','May 2025',
    'Jun 2025','Jul 2025','Aug 2025','Sep 2025','Oct 2025','Nov 2025',
    'Dec 2025','Jan 2026','Feb 2026'
  ],
  median: [175,172,160,158,160,160,162,168,165,152,168,172,178,180,180,182,185,190,195,200,195,188,182,178,170,180,195],
  average: [228,224,215,218,218,220,220,222,218,212,216,220,225,230,232,235,238,240,242,248,245,242,238,232,225,235,242],
};

function MedianAvgChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const chartH = 300;
  const yMin = 100;
  const yMax = 300;
  const ySteps = [300, 250, 200, 150, 100];
  const count = medianAvgData.months.length;
  const leftPad = 50;
  const rightPad = 40;

  const toY = (val) => chartH - ((val - yMin) / (yMax - yMin)) * chartH;

  // Build SVG paths
  const medianPts = medianAvgData.median.map((v, i) => [i * (1024 / (count - 1)), toY(v)]);
  const avgPts = medianAvgData.average.map((v, i) => [i * (1024 / (count - 1)), toY(v)]);
  const medianPath = medianPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const avgPath = avgPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  // 25th-75th percentile band: extends above average and below median
  const bandOffset = 20; // px offset to widen the band
  const upperBand = avgPts.map(p => [p[0], Math.max(0, p[1] - bandOffset)]);
  const lowerBand = medianPts.map(p => [p[0], Math.min(chartH, p[1] + bandOffset)]);
  const bandPath = upperBand.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
    + lowerBand.slice().reverse().map(p => ` L${p[0]},${p[1]}`).join('') + ' Z';

  const xLabels = ['Dec 2023','Mar 2024','Jun 2024','Sep 2024','Dec 2024','Mar 2025','Jun 2025','Sep 2025','Dec 2025','Feb 2026'];

  return (
    <div style={{ position: 'relative', height: chartH + 40, overflow: 'visible' }}>
      {/* Y-axis labels + grid */}
      {ySteps.map((val, i) => {
        const top = (i / (ySteps.length - 1)) * chartH;
        return (
          <React.Fragment key={val}>
            <span style={{
              position: 'absolute', left: 0, width: 42, textAlign: 'right',
              top, transform: 'translateY(-50%)',
              fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252'
            }}>{`\u00A3${val}`}</span>
            <div style={{
              position: 'absolute', left: leftPad, right: 0, top,
              height: 1, background: 'rgba(0,0,0,0.04)'
            }} />
          </React.Fragment>
        );
      })}

      {/* SVG */}
      <svg viewBox={`0 0 1024 ${chartH}`} preserveAspectRatio="none"
        style={{ position: 'absolute', left: leftPad, top: 0, width: `calc(100% - ${leftPad + rightPad}px)`, height: chartH }}>
        <path d={bandPath} fill="#6366f1" fillOpacity="0.08" />
        <path d={avgPath} fill="none" stroke="#bfbfbf" strokeWidth="2" strokeDasharray="6 4" />
        <path d={medianPath} fill="none" stroke="#6366f1" strokeWidth="2.5" />
      </svg>

      {/* Points overlay (separate SVG to keep circles round) */}
      <svg style={{ position: 'absolute', left: leftPad, top: 0, width: `calc(100% - ${leftPad + rightPad}px)`, height: chartH, pointerEvents: 'none', overflow: 'visible' }}>
        {/* Average points (open circles) */}
        {medianAvgData.average.map((v, i) => {
          const cx = `${(i / (count - 1)) * 100}%`;
          const cy = toY(v);
          return <circle key={`a${i}`} cx={cx} cy={cy} r="4.5" fill="white" stroke="#bfbfbf" strokeWidth="2" />;
        })}
        {/* Median points (filled circles) */}
        {medianAvgData.median.map((v, i) => {
          const cx = `${(i / (count - 1)) * 100}%`;
          const cy = toY(v);
          return <circle key={`m${i}`} cx={cx} cy={cy} r="5" fill="white" stroke="#6366f1" strokeWidth="2" />;
        })}
      </svg>

      {/* Hover zones */}
      {medianAvgData.months.map((month, i) => {
        const xPct = (i / (count - 1)) * 100;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `calc(${leftPad}px + (100% - ${leftPad + rightPad}px) * ${xPct / 100} - ${100 / count / 2}%)`,
            top: 0, width: `${100 / count}%`, height: chartH, cursor: 'pointer', zIndex: 2
          }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {hoveredIdx === i && (
              <div style={{
                position: 'absolute', left: '50%', transform: 'translate(-50%, -100%)',
                top: toY(medianAvgData.average[i]) - 8,
                background: '#171717', color: 'white', borderRadius: 10,
                padding: '10px 14px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{month}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  Median: {`\u00A3${medianAvgData.median[i]}`}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  Average: {`\u00A3${medianAvgData.average[i]}`}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* X-axis labels */}
      {xLabels.map(label => {
        const idx = medianAvgData.months.indexOf(label);
        if (idx === -1) return null;
        const pct = (idx / (count - 1)) * 100;
        return (
          <span key={label} style={{
            position: 'absolute',
            left: `calc(${leftPad}px + (100% - ${leftPad + rightPad}px) * ${pct / 100})`,
            top: chartH + 24, transform: 'translateX(-50%)',
            fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252',
            whiteSpace: 'nowrap'
          }}>{label}</span>
        );
      })}
    </div>
  );
}

// ─── CHART 2: MOM AVG PRICE TREND BY ROOM TYPE ─────────────────────────────

const momData = {
  months: ['Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026'],
  studio:    [325, 338, 318, 300, 280, 252],
  ensuite:   [210, 212, 205, 200, 192, 178],
  nonEnsuite:[180, 175, 175, 175, 182, 175],
};

function MomPriceTrendChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const chartH = 420;
  const yMin = 160;
  const yMax = 340;
  const ySteps = [340, 320, 300, 280, 260, 240, 220, 200, 180, 160];
  const count = momData.months.length;
  const leftPad = 50;
  const rightPad = 40;
  const svgW = 1024;

  const toY = (val) => chartH - ((val - yMin) / (yMax - yMin)) * chartH;

  const lines = [
    { key: 'studio', data: momData.studio, color: '#6366f1', label: 'Studio' },
    { key: 'ensuite', data: momData.ensuite, color: '#06b6d4', label: 'Ensuite' },
    { key: 'nonEnsuite', data: momData.nonEnsuite, color: '#f59e0b', label: 'Non Ensuite' },
  ];

  const buildPath = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (count - 1)) * svgW},${toY(v)}`).join(' ');

  return (
    <div style={{ position: 'relative', height: chartH + 40, overflow: 'visible' }}>
      {/* Y-axis labels and grid lines */}
      {ySteps.map((val, i) => {
        const top = (i / (ySteps.length - 1)) * chartH;
        return (
          <React.Fragment key={val}>
            <span style={{
              position: 'absolute', right: `calc(100% - ${leftPad - 8}px)`, width: 42, textAlign: 'right',
              top, transform: 'translateY(-50%)',
              fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252'
            }}>{`\u00A3${val}`}</span>
            <div style={{
              position: 'absolute', left: leftPad, right: 0, top,
              height: 1, background: '#f1f5f9'
            }} />
          </React.Fragment>
        );
      })}

      {/* SVG lines */}
      <svg viewBox={`0 0 ${svgW} ${chartH}`} preserveAspectRatio="none"
        style={{ position: 'absolute', left: leftPad, top: 0, width: `calc(100% - ${leftPad + rightPad}px)`, height: chartH }}>
        {lines.map(l => (
          <path key={l.key} d={buildPath(l.data)} fill="none" stroke={l.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>

      {/* Points (separate SVG to keep circles round) */}
      <svg style={{ position: 'absolute', left: leftPad, top: 0, width: `calc(100% - ${leftPad + rightPad}px)`, height: chartH, pointerEvents: 'none', overflow: 'visible' }}>
        {lines.map(l => l.data.map((v, i) => (
          <circle key={`${l.key}-${i}`} cx={`${(i / (count - 1)) * 100}%`} cy={toY(v)} r="5" fill="white" stroke={l.color} strokeWidth="2.5" />
        )))}
      </svg>

      {/* Hover zones */}
      {momData.months.map((month, i) => {
        const xPct = (i / (count - 1)) * 100;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `calc(${leftPad}px + (100% - ${leftPad + rightPad}px) * ${xPct / 100})`,
            top: 0, width: `${100 / count}%`, height: chartH,
            cursor: 'pointer', zIndex: 2, transform: 'translateX(-50%)'
          }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {hoveredIdx === i && (
              <div style={{
                position: 'absolute', left: '50%', transform: 'translate(-50%, 0)', top: -8,
                background: '#171717', color: 'white', borderRadius: 10,
                padding: '10px 14px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{month}</div>
                {lines.map(l => (
                  <div key={l.key} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                    {l.label}: {`\u00A3${l.data[i]}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* X-axis labels */}
      {momData.months.map((label, i) => {
        const pct = (i / (count - 1)) * 100;
        return (
          <span key={label} style={{
            position: 'absolute',
            left: `calc(${leftPad}px + (100% - ${leftPad + rightPad}px) * ${pct / 100})`,
            top: chartH + 24, transform: 'translateX(-50%)',
            fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252',
            whiteSpace: 'nowrap'
          }}>{label}</span>
        );
      })}
    </div>
  );
}

// ─── CHART 3: PRICE DISTRIBUTION BY ROOM TYPE (BOX PLOT) ────────────────────

const boxPlotData = [
  { label: 'Studio', color: '#6366f1', min: 50, q1: 240, median: 320, q3: 400, max: 750 },
  { label: 'Ensuite', color: '#06b6d4', min: 100, q1: 175, median: 210, q3: 260, max: 370 },
  { label: 'Non Ensuite', color: '#f59e0b', min: 20, q1: 115, median: 145, q3: 185, max: 320 },
];

function BoxPlotChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const chartH = 380;
  const yMin = 0;
  const yMax = 800;
  const ySteps = [800, 700, 600, 500, 400, 300, 200, 100, 0];
  const leftPad = 50;

  const toY = (val) => chartH - ((val - yMin) / (yMax - yMin)) * chartH;

  // Each box plot centered in its third of the chart
  const sectionPct = [1/6, 3/6, 5/6]; // center of each third

  return (
    <div style={{ position: 'relative', height: chartH + 50, overflow: 'visible' }}>
      {/* Y-axis labels and grid lines */}
      {ySteps.map((val, i) => {
        const top = (i / (ySteps.length - 1)) * chartH;
        return (
          <React.Fragment key={val}>
            <span style={{
              position: 'absolute', left: 0, width: 42, textAlign: 'right',
              top, transform: 'translateY(-50%)',
              fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252'
            }}>{`\u00A3${val}`}</span>
            <div style={{
              position: 'absolute', left: leftPad, right: 0, top,
              height: 1, background: '#f1f5f9'
            }} />
          </React.Fragment>
        );
      })}

      {/* Box plots using divs for responsive positioning */}
      {boxPlotData.map((d, i) => {
        const isDimmed = hoveredIdx !== null && hoveredIdx !== i;
        const centerPct = sectionPct[i] * 100;
        const boxW = 22; // percentage of chart width
        const capW = 20;

        return (
          <div key={d.label} style={{
            position: 'absolute',
            left: `calc(${leftPad}px + (100% - ${leftPad}px) * ${centerPct / 100})`,
            top: 0, width: 0, height: chartH,
            opacity: isDimmed ? 0.35 : 1, transition: 'opacity 0.15s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Whisker line (vertical) — centered */}
            <div style={{
              position: 'absolute', left: -0.75, width: 1.5, background: d.color,
              top: toY(d.max), height: toY(d.min) - toY(d.max)
            }} />
            {/* Top whisker cap */}
            <div style={{
              position: 'absolute', left: -capW / 2, width: capW, height: 1.5, background: d.color,
              top: toY(d.max)
            }} />
            {/* Bottom whisker cap */}
            <div style={{
              position: 'absolute', left: -capW / 2, width: capW, height: 1.5, background: d.color,
              top: toY(d.min)
            }} />
            {/* Box (Q1 to Q3) — uses vw-relative width, centered on whisker */}
            <div style={{
              position: 'absolute',
              left: `calc(-${boxW / 2}vw)`, width: `${boxW}vw`,
              top: toY(d.q3), height: toY(d.q1) - toY(d.q3),
              background: d.color + '20', border: `1.5px solid ${d.color}`, borderRadius: 2
            }} />
            {/* Median line */}
            <div style={{
              position: 'absolute',
              left: `calc(-${boxW / 2}vw)`, width: `${boxW}vw`, height: 1.5, background: d.color,
              top: toY(d.median)
            }} />
            {/* Median dot */}
            <div style={{
              position: 'absolute', left: -7, top: toY(d.median) - 7,
              width: 14, height: 14, borderRadius: '50%',
              background: '#c0c0c0', border: '2.5px solid white',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.08)'
            }} />

            {/* Tooltip */}
            {hoveredIdx === i && (
              <div style={{
                position: 'absolute', left: 0, transform: 'translate(-50%, -100%)',
                top: toY(d.max) - 8,
                background: '#171717', color: 'white', borderRadius: 10,
                padding: '10px 14px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{d.label}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  Max: {`\u00A3${d.max}`} | Q3: {`\u00A3${d.q3}`}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  Median: {`\u00A3${d.median}`} | Q1: {`\u00A3${d.q1}`}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  Min: {`\u00A3${d.min}`}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* X-axis labels */}
      {boxPlotData.map((d, i) => (
        <span key={d.label} style={{
          position: 'absolute',
          left: `calc(${leftPad}px + (100% - ${leftPad}px) * ${sectionPct[i]})`,
          top: chartH + 24, transform: 'translateX(-50%)',
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#525252',
          whiteSpace: 'nowrap'
        }}>{d.label}</span>
      ))}
    </div>
  );
}

// ─── CHART 4: % SPLIT BY PRICE BAND (DONUT CHARTS) ─────────────────────────

function DonutChart({ title, data, size = 160, thickness = 36 }) {
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

    return { ...d, path, index: i, percentage: ((d.value / total) * 100).toFixed(0) };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: '#525252',
        marginBottom: 12, textAlign: 'center'
      }}>{title}</div>
      <div style={{ position: 'relative', width: size, height: size }}>
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
                transform: hoveredIndex === s.index ? 'scale(1.06)' : 'scale(1)',
                transformOrigin: `${cx}px ${cy}px`,
                transition: 'transform 0.2s ease',
                filter: hoveredIndex !== null && hoveredIndex !== s.index ? 'opacity(0.5)' : 'none'
              }}
              onMouseEnter={() => setHoveredIndex(s.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>
        {hoveredIndex !== null && (
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#171717', color: 'white', borderRadius: 10,
            padding: '8px 12px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5, textAlign: 'center'
          }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{slices[hoveredIndex].label}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              {slices[hoveredIndex].percentage}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const donutConfigs = [
  { title: 'Overall Config Split', data: [
    { label: 'Studio', value: 45, color: '#1e3a5f' },
    { label: 'Ensuite', value: 35, color: '#3b82f6' },
    { label: 'Non Ensuite', value: 20, color: '#bfdbfe' },
  ]},
  { title: 'Studio', data: [
    { label: 'Budget', value: 15, color: '#bbf7d0' },
    { label: 'Mid', value: 45, color: '#4ade80' },
    { label: 'Premium', value: 40, color: '#166534' },
  ]},
  { title: 'Ensuite', data: [
    { label: 'Budget', value: 10, color: '#bbf7d0' },
    { label: 'Mid', value: 55, color: '#4ade80' },
    { label: 'Premium', value: 35, color: '#166534' },
  ]},
  { title: 'Non Ensuite', data: [
    { label: 'Budget', value: 8, color: '#bbf7d0' },
    { label: 'Mid', value: 42, color: '#4ade80' },
    { label: 'Premium', value: 50, color: '#166534' },
  ]},
];

const donutLegend = [
  { label: 'Studio', color: '#1e3a5f' },
  { label: 'Ensuite', color: '#3b82f6' },
  { label: 'Non Ensuite', color: '#bfdbfe' },
  { label: 'Budget', color: '#bbf7d0' },
  { label: 'Mid', color: '#4ade80' },
  { label: 'Premium', color: '#166534' },
];

function PriceBandDonuts() {
  return (
    <div>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'space-around', marginBottom: 24 }}>
        {donutConfigs.map(cfg => (
          <DonutChart key={cfg.title} title={cfg.title} data={cfg.data} size={180} thickness={40} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        {donutLegend.map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12, color: '#525252' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHART 5: STUDENT BOOKING % BY CONFIG x PRICE BAND YOY ─────────────────

const yoyBarData = [
  { label: 'Ensuite \u2014 Budget', y2025: 34, y2026: 12 },
  { label: 'Ensuite \u2014 Mid', y2025: 42, y2026: 48 },
  { label: 'Ensuite \u2014 Premium', y2025: 20, y2026: 9 },
  { label: 'Non Ensuite \u2014 Budget', y2025: 28, y2026: 15 },
  { label: 'Non Ensuite \u2014 Mid', y2025: 38, y2026: 32 },
  { label: 'Non Ensuite \u2014 Premium', y2025: 30, y2026: 20 },
  { label: 'Studio \u2014 Budget', y2025: 15, y2026: 18 },
  { label: 'Studio \u2014 Mid', y2025: 48, y2026: 50 },
  { label: 'Studio \u2014 Premium', y2025: 17, y2026: 10 },
];

function YoyBookingChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const barH = 18;
  const rowH = 44;
  const labelW = 170;
  const xSteps = [100, 80, 60, 40, 20, 0, 20, 40, 60, 80, 100];

  return (
    <div style={{ position: 'relative', height: yoyBarData.length * rowH + 60, overflow: 'visible' }}>
      {/* Grid lines — 11 evenly spaced from left to right */}
      {xSteps.map((_, i) => {
        const pct = (i / (xSteps.length - 1)) * 100;
        return (
          <div key={i} style={{
            position: 'absolute', left: `calc(${labelW}px + (100% - ${labelW}px) * ${pct / 100})`,
            top: 0, width: 1, height: yoyBarData.length * rowH, background: '#f1f5f9'
          }} />
        );
      })}

      {/* Center line (0%) — slightly thicker */}
      <div style={{
        position: 'absolute', left: `calc(${labelW}px + (100% - ${labelW}px) * 0.5)`,
        top: 0, width: 1, height: yoyBarData.length * rowH, background: '#d4d4d4'
      }} />

      {/* Rows */}
      {yoyBarData.map((d, i) => {
        const isDimmed = hoveredIdx !== null && hoveredIdx !== i;
        return (
          <div key={d.label} style={{
            position: 'absolute', top: i * rowH, left: 0, right: 0, height: rowH,
            display: 'flex', alignItems: 'center', cursor: 'pointer',
            transition: 'opacity 0.15s ease', opacity: isDimmed ? 0.35 : 1
          }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Label */}
            <div style={{
              width: labelW, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12,
              color: '#525252', textAlign: 'right', paddingRight: 12, whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0
            }}>{d.label}</div>
            {/* Bar area */}
            <div style={{ position: 'relative', flex: 1, height: rowH }}>
              {/* 2025 bar — extends LEFT from center */}
              <div style={{
                position: 'absolute', top: (rowH - barH) / 2,
                right: '50%', height: barH, borderRadius: 10,
                width: `${d.y2025 / 2}%`, background: '#bfbfbf'
              }} />
              {/* 2026 bar — extends RIGHT from center */}
              <div style={{
                position: 'absolute', top: (rowH - barH) / 2,
                left: '50%', height: barH, borderRadius: 10,
                width: `${d.y2026 / 2}%`, background: '#6366f1'
              }} />
            </div>
            {/* Tooltip */}
            {hoveredIdx === i && (
              <div style={{
                position: 'absolute', left: '50%', transform: 'translate(-50%, -100%)',
                top: -4, background: '#171717', color: 'white', borderRadius: 10,
                padding: '10px 14px', whiteSpace: 'nowrap', zIndex: 5
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{d.label}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>2025: {d.y2025}%</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>2026: {d.y2026}%</div>
              </div>
            )}
          </div>
        );
      })}

      {/* X-axis labels */}
      {xSteps.map((val, i) => (
        <span key={i} style={{
          position: 'absolute',
          left: `calc(${labelW}px + (100% - ${labelW}px) * ${(i / (xSteps.length - 1)) * 100 / 100})`,
          top: yoyBarData.length * rowH + 8,
          transform: 'translateX(-50%)',
          fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252',
          whiteSpace: 'nowrap'
        }}>{val}%</span>
      ))}

      {/* Axis direction labels */}
      <div style={{
        position: 'absolute', top: yoyBarData.length * rowH + 40,
        left: labelW, right: 0, display: 'flex', justifyContent: 'center', gap: 24
      }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#64748b' }}>{'\u2190'} Previous Year</span>
        <span style={{ color: '#94a3b8' }}>|</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#64748b' }}>Current Year {'\u2192'}</span>
      </div>
    </div>
  );
}

// ─── CHART 6: DEMAND ELASTICITY CURVE ───────────────────────────────────────

const elasticityData = {
  xLabels: ['£100', '£200', '£300', '£400', '£500', '£600', '£700', '£800'],
  studio:     [0.8, 0.95, 0.6, 0.15, 1.1, 1.65, 1.2, 0.5],
  ensuite:    [1.4, 0.8, 0.6, 1.1, 1.7, 1.4, 0.3, 0.25],
  nonEnsuite: [0.35, 0.6, 1.0, 0.9, 1.3, 0.9, 0.15, 0.05],
};

function DemandElasticityChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const chartH = 320;
  const yMin = 0.0;
  const yMax = 1.8;
  const ySteps = [1.8, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.0];
  const count = elasticityData.xLabels.length;
  const leftPad = 60;
  const rightPad = 20;
  const svgW = 1024;

  const toY = (val) => chartH - ((val - yMin) / (yMax - yMin)) * chartH;

  // Build smooth cubic bezier paths
  const buildSmoothPath = (arr) => {
    const pts = arr.map((v, i) => [i * (svgW / (count - 1)), toY(v)]);
    let path = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const cur = pts[i];
      const cpx1 = prev[0] + (cur[0] - prev[0]) * 0.4;
      const cpx2 = cur[0] - (cur[0] - prev[0]) * 0.4;
      path += ` C${cpx1},${prev[1]} ${cpx2},${cur[1]} ${cur[0]},${cur[1]}`;
    }
    return path;
  };

  const lines = [
    { key: 'studio', data: elasticityData.studio, color: '#6366f1', label: 'Studio' },
    { key: 'ensuite', data: elasticityData.ensuite, color: '#06b6d4', label: 'Ensuite' },
    { key: 'nonEnsuite', data: elasticityData.nonEnsuite, color: '#f59e0b', label: 'Non Ensuite' },
  ];

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#94a3bd', fontWeight: 700, letterSpacing: 0.88 }}>YEAR</span>
          <div style={{
            padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0',
            background: 'white', boxShadow: '0px 1px 4px rgba(0,0,0,0.06)',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: '#171717'
          }}>2026</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#94a3bd', fontWeight: 700, letterSpacing: 0.88 }}>MONTH</span>
          <div style={{
            padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0',
            background: 'white', boxShadow: '0px 1px 4px rgba(0,0,0,0.06)',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: '#171717'
          }}>February</div>
        </div>
      </div>
      <div style={{ height: 16 }} />

      <div style={{ position: 'relative', height: chartH + 60, overflow: 'visible', display: 'flex' }}>
        {/* Y-axis rotated label */}
        <div style={{
          position: 'absolute', left: -8, top: chartH / 2, transform: 'rotate(-90deg) translateX(-50%)',
          transformOrigin: '0 0',
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#64748b', whiteSpace: 'nowrap'
        }}>Booking Velocity</div>

        <div style={{ flex: 1, position: 'relative' }}>
          {/* Y-axis labels and grid lines */}
          {ySteps.map((val, i) => {
            const top = (i / (ySteps.length - 1)) * chartH;
            return (
              <React.Fragment key={val}>
                <span style={{
                  position: 'absolute', left: 16, width: 36, textAlign: 'right',
                  top, transform: 'translateY(-50%)',
                  fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252'
                }}>{val.toFixed(1)}</span>
                <div style={{
                  position: 'absolute', left: leftPad, right: rightPad, top,
                  height: 1, background: '#f1f5f9'
                }} />
              </React.Fragment>
            );
          })}

          {/* SVG smooth lines */}
          <svg viewBox={`0 0 ${svgW} ${chartH}`} preserveAspectRatio="none"
            style={{ position: 'absolute', left: leftPad, top: 0, width: `calc(100% - ${leftPad + rightPad}px)`, height: chartH }}>
            {lines.map(l => (
              <path key={l.key} d={buildSmoothPath(l.data)} fill="none" stroke={l.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </svg>

          {/* Points */}
          <svg style={{ position: 'absolute', left: leftPad, top: 0, width: `calc(100% - ${leftPad + rightPad}px)`, height: chartH, pointerEvents: 'none', overflow: 'visible' }}>
            {lines.map(l => l.data.map((v, i) => (
              <circle key={`${l.key}-${i}`} cx={`${(i / (count - 1)) * 100}%`} cy={toY(v)} r="5" fill="white" stroke={l.color} strokeWidth="2" />
            )))}
          </svg>

          {/* Hover zones */}
          {elasticityData.xLabels.map((label, i) => {
            const xPct = (i / (count - 1)) * 100;
            return (
              <div key={i} style={{
                position: 'absolute',
                left: `calc(${leftPad}px + (100% - ${leftPad + rightPad}px) * ${xPct / 100})`,
                top: 0, width: `${100 / count}%`, height: chartH,
                cursor: 'pointer', zIndex: 2, transform: 'translateX(-50%)'
              }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {hoveredIdx === i && (
                  <div style={{
                    position: 'absolute', left: '50%', transform: 'translate(-50%, 0)', top: -8,
                    background: '#171717', color: 'white', borderRadius: 10,
                    padding: '10px 14px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5
                  }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
                      Price: {label}
                    </div>
                    {lines.map(l => (
                      <div key={l.key} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                        {l.label}: {l.data[i].toFixed(2)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
          );
        })}

          {/* X-axis labels */}
          {elasticityData.xLabels.map((label, i) => {
            const pct = (i / (count - 1)) * 100;
            return (
              <span key={label} style={{
                position: 'absolute',
                left: `calc(${leftPad}px + (100% - ${leftPad + rightPad}px) * ${pct / 100})`,
                top: chartH + 12, transform: 'translateX(-50%)',
                fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252',
                whiteSpace: 'nowrap'
              }}>{label}</span>
            );
          })}

          {/* X-axis title */}
          <div style={{
            position: 'absolute', left: '50%', top: chartH + 48,
            transform: 'translateX(-50%)',
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#64748b'
          }}>Weekly Price ({'\u00A3'})</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function PricingContent({ activePricingSection, onSectionChange, scrollTarget }) {
  const sectionRefs = useRef({});

  // Scroll to section only when scrollTarget changes (user clicked sidebar)
  useEffect(() => {
    if (!scrollTarget) return;
    const section = scrollTarget.split(':').slice(1).join(':');
    if (section && sectionRefs.current[section]) {
      sectionRefs.current[section].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [scrollTarget]);

  // Scroll spy — update sidebar active section on scroll
  useEffect(() => {
    const sections = ['Pricing Power', 'Room Trend', 'Distribution', 'Price Split', 'YoY Comparison', 'Elasticity'];
    const handleScroll = () => {
      let closest = sections[0];
      let closestDist = Infinity;
      for (const name of sections) {
        const el = sectionRefs.current[name];
        if (el) {
          const rect = el.getBoundingClientRect();
          const dist = Math.abs(rect.top - 150);
          if (dist < closestDist) {
            closestDist = dist;
            closest = name;
          }
        }
      }
      if (onSectionChange && closest !== activePricingSection) {
        onSectionChange(closest);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePricingSection, onSectionChange]);

  return (
    <>
      {/* Section Title */}
      <div className="section-title">Pricing Analysis</div>

      {/* KPI Funnel */}
      <div className="kpi-funnel">
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={priceWeekIcon} alt="" />
            <span className="kpi-label">AVG PRICE / WEEK</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>54.3%</div>
        </div>
        <div className="kpi-divider" />
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={durationIcon} alt="" />
            <span className="kpi-label">AVG DURATION (WEEKS)</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>43.0</div>
        </div>
        <div className="kpi-divider" />
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={priceChangeIcon} alt="" />
            <span className="kpi-label">AVG PRICE CHANGE MOM</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>-2.9%</div>
        </div>
        <div className="kpi-divider" />
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={yoyIcon} alt="" />
            <span className="kpi-label">YOY CHANGE MOM</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>-0.8%</div>
        </div>
      </div>

      {/* MEDIAN VS AVERAGE WEEKLY PRICE TREND */}
      <div className="chart-card" ref={el => sectionRefs.current['Pricing Power'] = el}>
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3>MEDIAN VS AVERAGE WEEKLY PRICE TREND &mdash; PRICING POWER</h3>
              <p>Shows price distribution dynamics. Shaded band represents the core market range (25th&ndash;75th percentile).</p>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#6366f1' }} />
              <span className="legend-label">Median</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#bfbfbf' }} />
              <span className="legend-label">Average</span>
            </div>
          </div>
        </div>
        <div className="chart-divider" />
        <MedianAvgChart />
      </div>

      {/* MOM AVG PRICE TREND BY ROOM TYPE */}
      <div className="chart-card" ref={el => sectionRefs.current['Room Trend'] = el}>
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3>MOM AVG PRICE TREND BY ROOM TYPE</h3>
              <p>Month-over-month average price trend segmented by room type.</p>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#6366f1' }} />
              <span className="legend-label">Studio</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#06b6d4' }} />
              <span className="legend-label">Ensuite</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#f59e0b' }} />
              <span className="legend-label">Non Ensuite</span>
            </div>
          </div>
        </div>
        <div className="chart-divider" />
        <MomPriceTrendChart />
      </div>

      {/* PRICE DISTRIBUTION BY ROOM TYPE */}
      <div className="chart-card" ref={el => sectionRefs.current['Distribution'] = el}>
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3>PRICE DISTRIBUTION BY ROOM TYPE</h3>
              <p>Distribution of weekly prices across room types showing quartile ranges.</p>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#6366f1' }} />
              <span className="legend-label">Studio</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#06b6d4' }} />
              <span className="legend-label">Ensuite</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#f59e0b' }} />
              <span className="legend-label">Non Ensuite</span>
            </div>
          </div>
        </div>
        <div className="chart-divider" />
        <BoxPlotChart />
      </div>

      {/* % SPLIT BY PRICE BAND */}
      <div className="chart-card" ref={el => sectionRefs.current['Price Split'] = el}>
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3>% SPLIT BY PRICE BAND (BOOKINGS) &mdash; BY CONFIG TYPE</h3>
              <p>Booking share breakdown by price band for each configuration type.</p>
            </div>
          </div>
        </div>
        <div className="chart-divider" />
        <PriceBandDonuts />
      </div>

      {/* STUDENT BOOKING % BY CONFIG x PRICE BAND YOY */}
      <div className="chart-card" ref={el => sectionRefs.current['YoY Comparison'] = el}>
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3>STUDENT BOOKING % BY CONFIG {'\u00D7'} PRICE BAND &mdash; YOY</h3>
              <p>Compares booking share year-over-year highlighting shifts in demand mix.</p>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#bfbfbf' }} />
              <span className="legend-label">2025</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#6366f1' }} />
              <span className="legend-label">2026</span>
            </div>
          </div>
        </div>
        <div className="chart-divider" />
        <YoyBookingChart />
      </div>

      {/* DEMAND ELASTICITY CURVE */}
      <div className="chart-card" ref={el => sectionRefs.current['Elasticity'] = el}>
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3>DEMAND ELASTICITY CURVE</h3>
              <p>Relationship between pricing levels and booking demand across room types.</p>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#6366f1' }} />
              <span className="legend-label">Studio</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#06b6d4' }} />
              <span className="legend-label">Ensuite</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#f59e0b' }} />
              <span className="legend-label">Non Ensuite</span>
            </div>
          </div>
        </div>
        <div className="chart-divider" />
        <DemandElasticityChart />
      </div>

      {/* Bottom spacer */}
      <div style={{ height: 60 }} />
    </>
  );
}
