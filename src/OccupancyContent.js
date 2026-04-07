import React, { useState, useEffect, useRef } from 'react';

const percentageIcon = require('./assets/percentage-icon.svg').default;
const occupancyIcon = require('./assets/occupancy-icon.svg').default;
const monthChangeIcon = require('./assets/month-change-icon.svg').default;
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

// ─── DATA ──────────────────────────────────────────────────────────────────────

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const monthsShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const occupancyRateData = [72,70,68,65,60,55,58,62,75,70,80,54];

const yoyData = {
  '2025-26': [72,75,68,65,62,58,60,65,78,75,80,70],
  '2026-27': [70,72,65,62,60,55,58,62,75,70,78,65],
};

const topCitiesData = {
  Coventry:   [85,88,82,80,78,75,80,85,90,88,92,85],
  Durham:     [80,82,78,75,72,70,72,78,85,82,88,80],
  Newcastle:  [70,65,68,72,75,78,82,80,78,82,75,72],
  Exeter:     [75,72,70,68,65,62,65,70,75,78,80,75],
  Nottingham: [65,60,58,55,52,50,55,60,68,72,70,62],
};

const topCitiesColors = {
  Coventry:   '#6366f1',
  Durham:     '#3b82f6',
  Newcastle:  '#f59e0b',
  Exeter:     '#22c55e',
  Nottingham: '#ef4444',
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function buildSmoothPath(pts) {
  let path = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const cpx1 = prev[0] + (cur[0] - prev[0]) * 0.4;
    const cpx2 = cur[0] - (cur[0] - prev[0]) * 0.4;
    path += ` C${cpx1},${prev[1]} ${cpx2},${cur[1]} ${cur[0]},${cur[1]}`;
  }
  return path;
}

function buildAreaPath(pts, chartH) {
  const linePath = buildSmoothPath(pts);
  return linePath + ` L${pts[pts.length - 1][0]},${chartH} L${pts[0][0]},${chartH} Z`;
}

// ─── CHART 1: OCCUPANCY RATE (MONTHLY) ─────────────────────────────────────────

function OccupancyRateChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const chartH = 300;
  const yMin = 0;
  const yMax = 100;
  const ySteps = [100,90,80,70,60,50,40,30,20,10,0];
  const count = 12;
  const leftPad = 50;
  const rightPad = 10;
  const svgW = 1024;

  const toY = (val) => chartH - ((val - yMin) / (yMax - yMin)) * chartH;

  const pts = occupancyRateData.map((v, i) => [i * (svgW / (count - 1)), toY(v)]);
  const linePath = buildSmoothPath(pts);
  const areaPath = buildAreaPath(pts, chartH);

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
            }}>{val}%</span>
            <div style={{
              position: 'absolute', left: leftPad, right: 0, top,
              height: 1, background: '#f1f5f9'
            }} />
          </React.Fragment>
        );
      })}

      {/* SVG area + line */}
      <svg viewBox={`0 0 ${svgW} ${chartH}`} preserveAspectRatio="none"
        style={{ position: 'absolute', left: leftPad, top: 0, width: `calc(100% - ${leftPad + rightPad}px)`, height: chartH }}>
        <defs>
          <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#occupancyGradient)" />
        <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2.5" />
      </svg>

      {/* Points overlay */}
      <svg style={{ position: 'absolute', left: leftPad, top: 0, width: `calc(100% - ${leftPad + rightPad}px)`, height: chartH, pointerEvents: 'none', overflow: 'visible' }}>
        {occupancyRateData.map((v, i) => {
          const cx = `${(i / (count - 1)) * 100}%`;
          const cy = toY(v);
          return <circle key={i} cx={cx} cy={cy} r="5" fill="white" stroke="#6366f1" strokeWidth="2" />;
        })}
      </svg>

      {/* Hover zones */}
      {months.map((month, i) => {
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
                position: 'absolute', left: '50%', transform: 'translate(-50%, -100%)',
                top: toY(occupancyRateData[i]) - 8,
                background: '#171717', color: 'white', borderRadius: 10,
                padding: '10px 14px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{month}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  Occupancy: {occupancyRateData[i]}%
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* X-axis labels */}
      {monthsShort.map((label, i) => {
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

// ─── CHART 2: YOY COMPARISON ───────────────────────────────────────────────────

function YoyComparisonChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const chartH = 300;
  const yMin = 50;
  const yMax = 90;
  const ySteps = [90,85,80,75,70,65,60,55,50];
  const count = 12;
  const leftPad = 50;
  const rightPad = 10;
  const svgW = 1024;

  const toY = (val) => chartH - ((val - yMin) / (yMax - yMin)) * chartH;

  const pts2526 = yoyData['2025-26'].map((v, i) => [i * (svgW / (count - 1)), toY(v)]);
  const pts2627 = yoyData['2026-27'].map((v, i) => [i * (svgW / (count - 1)), toY(v)]);
  const path2526 = buildSmoothPath(pts2526);
  const path2627 = buildSmoothPath(pts2627);

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
            }}>{val}%</span>
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
        <path d={path2526} fill="none" stroke="#bfbfbf" strokeWidth="2" strokeDasharray="6 4" />
        <path d={path2627} fill="none" stroke="#6366f1" strokeWidth="2.5" />
      </svg>

      {/* Points overlay */}
      <svg style={{ position: 'absolute', left: leftPad, top: 0, width: `calc(100% - ${leftPad + rightPad}px)`, height: chartH, pointerEvents: 'none', overflow: 'visible' }}>
        {yoyData['2025-26'].map((v, i) => (
          <circle key={`a${i}`} cx={`${(i / (count - 1)) * 100}%`} cy={toY(v)} r="4.5" fill="white" stroke="#bfbfbf" strokeWidth="2" />
        ))}
        {yoyData['2026-27'].map((v, i) => (
          <circle key={`b${i}`} cx={`${(i / (count - 1)) * 100}%`} cy={toY(v)} r="5" fill="white" stroke="#6366f1" strokeWidth="2" />
        ))}
      </svg>

      {/* Hover zones */}
      {months.map((month, i) => {
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
                position: 'absolute', left: '50%', transform: 'translate(-50%, -100%)',
                top: toY(Math.max(yoyData['2025-26'][i], yoyData['2026-27'][i])) - 8,
                background: '#171717', color: 'white', borderRadius: 10,
                padding: '10px 14px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{month}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  2025-26: {yoyData['2025-26'][i]}%
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  2026-27: {yoyData['2026-27'][i]}%
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* X-axis labels */}
      {monthsShort.map((label, i) => {
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

// ─── CHART 3: TOP 5 CITIES BY OCCUPANCY % ──────────────────────────────────────

function TopCitiesChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const chartH = 300;
  const yMin = 50;
  const yMax = 100;
  const ySteps = [100,90,80,70,60,50];
  const count = 12;
  const leftPad = 50;
  const rightPad = 10;
  const svgW = 1024;

  const toY = (val) => chartH - ((val - yMin) / (yMax - yMin)) * chartH;

  const cities = Object.keys(topCitiesData);
  const lines = cities.map(city => ({
    key: city,
    data: topCitiesData[city],
    color: topCitiesColors[city],
    pts: topCitiesData[city].map((v, i) => [i * (svgW / (count - 1)), toY(v)]),
  }));

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
            }}>{val}%</span>
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
          <path key={l.key} d={buildSmoothPath(l.pts)} fill="none" stroke={l.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>

      {/* Points overlay */}
      <svg style={{ position: 'absolute', left: leftPad, top: 0, width: `calc(100% - ${leftPad + rightPad}px)`, height: chartH, pointerEvents: 'none', overflow: 'visible' }}>
        {lines.map(l => l.data.map((v, i) => (
          <circle key={`${l.key}-${i}`} cx={`${(i / (count - 1)) * 100}%`} cy={toY(v)} r="4" fill="white" stroke={l.color} strokeWidth="1.5" />
        )))}
      </svg>

      {/* Hover zones */}
      {months.map((month, i) => {
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
                position: 'absolute', left: '50%', transform: 'translate(-50%, -100%)',
                top: -8,
                background: '#171717', color: 'white', borderRadius: 10,
                padding: '10px 14px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 5
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{month}</div>
                {cities.map(city => (
                  <div key={city} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                    {city}: {topCitiesData[city][i]}%
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* X-axis labels */}
      {monthsShort.map((label, i) => {
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

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function OccupancyContent({ activeOccupancySection, onSectionChange, scrollTarget }) {
  const sectionRefs = useRef({});
  const isFirstRender = useRef(true);
  const [activeToggle, setActiveToggle] = useState('Monthly');

  // Scroll to section only when scrollTarget changes (user clicked sidebar)
  useEffect(() => {
    if (!scrollTarget) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const section = scrollTarget.split(':').slice(1).join(':');
    if (section && sectionRefs.current[section]) {
      sectionRefs.current[section].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [scrollTarget]);

  // Scroll spy — update sidebar active section on scroll
  useEffect(() => {
    const sections = ['Occupancy Rate', 'YoY Comparison', 'Top Cities'];
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
      if (onSectionChange && closest !== activeOccupancySection) {
        onSectionChange(closest);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeOccupancySection, onSectionChange]);

  return (
    <>
      {/* Section Title + Monthly/Weekly Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '64px 32px 24px 32px' }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18, lineHeight: '24px', color: '#000' }}>Occupancy Analysis</div>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden' }}>
          <button
            onClick={() => setActiveToggle('Monthly')}
            style={{
              padding: '8px 20px',
              background: activeToggle === 'Monthly' ? '#171717' : '#f5f5f5',
              color: activeToggle === 'Monthly' ? 'white' : '#525252',
              border: activeToggle === 'Monthly' ? 'none' : '1px solid #e5e5e5',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              borderRadius: '8px 0 0 8px',
            }}
          >Monthly</button>
          <button
            onClick={() => setActiveToggle('Weekly')}
            style={{
              padding: '8px 20px',
              background: activeToggle === 'Weekly' ? '#171717' : '#f5f5f5',
              color: activeToggle === 'Weekly' ? 'white' : '#525252',
              border: activeToggle === 'Weekly' ? 'none' : '1px solid #e5e5e5',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              borderRadius: '0 8px 8px 0',
            }}
          >Weekly</button>
        </div>
      </div>

      {/* KPI Funnel */}
      <div className="kpi-funnel">
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={occupancyIcon} alt="" />
            <span className="kpi-label">OCCUPANCY - DECEMBER</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>54.3%</div>
        </div>
        <div className="kpi-divider" />
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={occupancyIcon} alt="" />
            <span className="kpi-label">OCCUPANCY - NOVEMBER</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>79.8%</div>
        </div>
        <div className="kpi-divider" />
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={monthChangeIcon} alt="" />
            <span className="kpi-label">MONTH CHANGE</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>-25.5pp</div>
        </div>
        <div className="kpi-divider" />
        <div className="kpi-item">
          <div className="kpi-label-row">
            <img src={yoyIcon} alt="" />
            <span className="kpi-label">YOY CHANGE</span>
          </div>
          <div className="kpi-value" style={{ color: '#2b2b2b' }}>-5.2pp</div>
        </div>
      </div>

      {/* CHART 1: OCCUPANCY RATE (MONTHLY) */}
      <div className="chart-card" ref={el => sectionRefs.current['Occupancy Rate'] = el}>
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3>OCCUPANCY RATE (MONTHLY)</h3>
              <p>Monthly occupancy rate trend across all properties.</p>
            </div>
          </div>
        </div>
        <div className="chart-divider" />
        <OccupancyRateChart />
      </div>

      {/* CHART 2: YOY COMPARISON */}
      <div className="chart-card" ref={el => sectionRefs.current['YoY Comparison'] = el}>
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3>OCCUPANCY RATE &mdash; YEAR ON YEAR COMPARISON (MONTHLY)</h3>
              <p>Compares occupancy rates year-over-year to identify seasonal patterns.</p>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#bfbfbf' }} />
              <span className="legend-label">2025-26</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#6366f1' }} />
              <span className="legend-label">2026-27</span>
            </div>
          </div>
        </div>
        <div className="chart-divider" />
        <YoyComparisonChart />
      </div>

      {/* CHART 3: TOP 5 CITIES BY OCCUPANCY % */}
      <div className="chart-card" ref={el => sectionRefs.current['Top Cities'] = el}>
        <div className="chart-header">
          <div className="chart-title-section" style={{ flex: 1 }}>
            <ChartIconBars />
            <div className="chart-title-text">
              <h3>TOP 5 CITIES BY OCCUPANCY %</h3>
              <p>Occupancy rates for the top 5 performing cities.</p>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#6366f1' }} />
              <span className="legend-label">Coventry</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#3b82f6' }} />
              <span className="legend-label">Durham</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#f59e0b' }} />
              <span className="legend-label">Newcastle</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#22c55e' }} />
              <span className="legend-label">Exeter</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#ef4444' }} />
              <span className="legend-label">Nottingham</span>
            </div>
          </div>
        </div>
        <div className="chart-divider" />
        <TopCitiesChart />
      </div>
    </>
  );
}
