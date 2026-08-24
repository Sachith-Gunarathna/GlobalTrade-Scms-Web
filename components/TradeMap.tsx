'use client';

import React, { useState } from 'react';
import { Navigation, Truck, Activity, ArrowRight, ShieldCheck, Layers, Eye } from 'lucide-react';

/* ── Sri Lanka 9 Provinces (SVG Path definitions in 0 0 350 450 coordinates) ── */
interface Province {
  id: string;
  name: string;
  sinhalaName: string;
  path: string;
  color: string;
  center: { x: number; y: number };
  activeRoutes: number;
  shipmentVolume: string;
}

const PROVINCES: Province[] = [
  {
    id: 'northern',
    name: 'Northern Province',
    sinhalaName: 'උතුරු පළාත',
    path: 'M 140 24 C 118 28 92 38 75 48 C 65 56 78 68 105 66 C 95 86 78 108 68 122 C 62 131 72 138 90 136 C 115 148 145 152 168 146 C 188 138 205 121 212 98 C 195 68 168 41 140 24 Z',
    color: '#3b82f6',
    center: { x: 135, y: 90 },
    activeRoutes: 4,
    shipmentVolume: '240 TEU/day',
  },
  {
    id: 'north-central',
    name: 'North Central Province',
    sinhalaName: 'උතුරු මැද පළාත',
    path: 'M 90 136 C 115 148 145 152 168 146 C 188 138 205 121 212 98 C 215 116 220 141 228 171 C 235 196 230 221 220 244 C 198 248 175 246 152 238 C 128 234 108 216 94 181 C 88 161 88 146 90 136 Z',
    color: '#10b981',
    center: { x: 165, y: 190 },
    activeRoutes: 6,
    shipmentVolume: '480 TEU/day',
  },
  {
    id: 'north-western',
    name: 'North Western Province',
    sinhalaName: 'වයඹ පළාත',
    path: 'M 68 122 C 60 151 56 181 64 211 C 68 234 72 258 78 278 C 95 281 115 280 132 274 C 145 264 148 248 152 238 C 128 234 108 216 94 181 C 88 161 88 146 90 136 C 72 138 62 131 68 122 Z',
    color: '#06b6d4',
    center: { x: 98, y: 224 },
    activeRoutes: 5,
    shipmentVolume: '360 TEU/day',
  },
  {
    id: 'eastern',
    name: 'Eastern Province',
    sinhalaName: 'නැගෙනහිර පළාත',
    path: 'M 212 98 C 225 121 238 146 248 171 C 265 198 284 231 288 264 C 290 291 282 316 274 334 C 255 326 240 311 232 286 C 225 261 220 244 220 244 C 230 221 235 196 228 171 C 220 141 215 116 212 98 Z',
    color: '#8b5cf6',
    center: { x: 252, y: 216 },
    activeRoutes: 5,
    shipmentVolume: '310 TEU/day',
  },
  {
    id: 'central',
    name: 'Central Province',
    sinhalaName: 'මධ්‍යම පළාත',
    path: 'M 152 238 C 175 246 198 248 220 244 C 220 244 215 268 208 291 C 202 311 190 324 175 328 C 158 318 148 298 142 281 C 145 264 148 248 152 238 Z',
    color: '#f59e0b',
    center: { x: 178, y: 280 },
    activeRoutes: 7,
    shipmentVolume: '520 TEU/day',
  },
  {
    id: 'western',
    name: 'Western Province',
    sinhalaName: 'බස්නාහිර පළාත',
    path: 'M 78 278 C 78 301 80 324 84 346 C 88 358 94 368 98 371 C 108 364 118 346 120 331 C 122 314 124 294 132 274 C 115 280 95 281 78 278 Z',
    color: '#ec4899',
    center: { x: 100, y: 320 },
    activeRoutes: 9,
    shipmentVolume: '1,420 TEU/day',
  },
  {
    id: 'sabaragamuwa',
    name: 'Sabaragamuwa Province',
    sinhalaName: 'සබරගමුව පළාත',
    path: 'M 132 274 C 124 294 122 314 120 331 C 118 346 108 364 98 371 C 112 374 135 376 152 370 C 168 364 178 348 182 334 C 175 328 158 318 142 281 C 138 278 135 276 132 274 Z',
    color: '#14b8a6',
    center: { x: 144, y: 330 },
    activeRoutes: 4,
    shipmentVolume: '280 TEU/day',
  },
  {
    id: 'uva',
    name: 'Uva Province',
    sinhalaName: 'ඌව පළාත',
    path: 'M 208 291 C 215 268 220 244 220 244 C 225 261 232 286 232 286 C 240 311 255 326 274 334 C 255 348 232 364 208 368 C 195 361 186 348 182 334 C 190 324 202 311 208 291 Z',
    color: '#eab308',
    center: { x: 224, y: 320 },
    activeRoutes: 4,
    shipmentVolume: '210 TEU/day',
  },
  {
    id: 'southern',
    name: 'Southern Province',
    sinhalaName: 'දකුණු පළාත',
    path: 'M 98 371 C 110 391 125 408 145 412 C 172 414 202 401 235 384 C 255 368 268 348 274 334 C 255 348 232 364 208 368 C 195 361 168 364 152 370 C 135 376 112 374 98 371 Z',
    color: '#f97316',
    center: { x: 180, y: 390 },
    activeRoutes: 6,
    shipmentVolume: '620 TEU/day',
  },
];

/* ── Sri Lanka City Hubs ─────────────────────────────────────────────────── */
export interface CityHub {
  id: string;
  name: string;
  sinhala: string;
  province: string;
  x: number;
  y: number;
  type: 'hq' | 'port' | 'depot' | 'junction';
  status: 'Active' | 'Optimal' | 'Heavy Flow';
  activeShipments: number;
  connections: string[];
}

const CITY_HUBS: CityHub[] = [
  {
    id: 'colombo',
    name: 'Colombo',
    sinhala: 'කොළඹ',
    province: 'Western',
    x: 82,
    y: 318,
    type: 'hq',
    status: 'Heavy Flow',
    activeShipments: 42,
    connections: ['galle', 'kandy', 'kurunegala', 'ratnapura', 'anuradhapura'],
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    sinhala: 'අනුරාධපුරය',
    province: 'North Central',
    x: 140,
    y: 180,
    type: 'depot',
    status: 'Optimal',
    activeShipments: 19,
    connections: ['jaffna', 'polonnaruwa', 'kurunegala', 'trincomalee'],
  },
  {
    id: 'polonnaruwa',
    name: 'Polonnaruwa',
    sinhala: 'පොළොන්නරුව',
    province: 'North Central',
    x: 206,
    y: 215,
    type: 'depot',
    status: 'Optimal',
    activeShipments: 14,
    connections: ['anuradhapura', 'trincomalee', 'batticaloa', 'kandy'],
  },
  {
    id: 'kandy',
    name: 'Kandy',
    sinhala: 'මහනුවර',
    province: 'Central',
    x: 168,
    y: 278,
    type: 'depot',
    status: 'Optimal',
    activeShipments: 23,
    connections: ['colombo', 'kurunegala', 'badulla', 'polonnaruwa'],
  },
  {
    id: 'galle',
    name: 'Galle',
    sinhala: 'ගාල්ල',
    province: 'Southern',
    x: 118,
    y: 392,
    type: 'port',
    status: 'Active',
    activeShipments: 18,
    connections: ['colombo', 'hambantota', 'matara'],
  },
  {
    id: 'hambantota',
    name: 'Hambantota',
    sinhala: 'හම්බන්තොට',
    province: 'Southern',
    x: 218,
    y: 384,
    type: 'port',
    status: 'Active',
    activeShipments: 28,
    connections: ['galle', 'ratnapura', 'badulla', 'batticaloa'],
  },
  {
    id: 'jaffna',
    name: 'Jaffna',
    sinhala: 'යාපනය',
    province: 'Northern',
    x: 108,
    y: 44,
    type: 'depot',
    status: 'Active',
    activeShipments: 12,
    connections: ['anuradhapura', 'mannar', 'vavuniya'],
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    sinhala: 'ත්‍රිකුණාමලය',
    province: 'Eastern',
    x: 232,
    y: 152,
    type: 'port',
    status: 'Optimal',
    activeShipments: 16,
    connections: ['anuradhapura', 'polonnaruwa', 'batticaloa'],
  },
  {
    id: 'kurunegala',
    name: 'Kurunegala',
    sinhala: 'කුරුණෑගල',
    province: 'North Western',
    x: 135,
    y: 260,
    type: 'junction',
    status: 'Heavy Flow',
    activeShipments: 27,
    connections: ['colombo', 'anuradhapura', 'kandy', 'puttalam'],
  },
  {
    id: 'batticaloa',
    name: 'Batticaloa',
    sinhala: 'මඩකලපුව',
    province: 'Eastern',
    x: 280,
    y: 238,
    type: 'depot',
    status: 'Active',
    activeShipments: 11,
    connections: ['polonnaruwa', 'trincomalee', 'hambantota'],
  },
  {
    id: 'badulla',
    name: 'Badulla',
    sinhala: 'බදුල්ල',
    province: 'Uva',
    x: 210,
    y: 308,
    type: 'depot',
    status: 'Optimal',
    activeShipments: 9,
    connections: ['kandy', 'hambantota', 'ratnapura'],
  },
  {
    id: 'ratnapura',
    name: 'Ratnapura',
    sinhala: 'රත්නපුර',
    province: 'Sabaragamuwa',
    x: 142,
    y: 338,
    type: 'junction',
    status: 'Active',
    activeShipments: 15,
    connections: ['colombo', 'badulla', 'hambantota'],
  },
];

/* ── Active Domestic Trade Routes ────────────────────────────────────────── */
interface TradeRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  d: string;
  color: string;
  duration: string;
  highway: string;
}

const TRADE_ROUTES: TradeRoute[] = [
  {
    id: 'r-cm-kn',
    name: 'Central Expressway Corridor',
    from: 'colombo',
    to: 'kandy',
    d: 'M 82 318 Q 120 295 168 278',
    color: '#3b82f6',
    duration: '2.5 hrs',
    highway: 'E04 / A1',
  },
  {
    id: 'r-cm-kr',
    name: 'North Western Trunk Line',
    from: 'colombo',
    to: 'kurunegala',
    d: 'M 82 318 Q 102 285 135 260',
    color: '#06b6d4',
    duration: '1.8 hrs',
    highway: 'E04 / A6',
  },
  {
    id: 'r-kr-ap',
    name: 'Rajarata Freight Link',
    from: 'kurunegala',
    to: 'anuradhapura',
    d: 'M 135 260 Q 132 220 140 180',
    color: '#10b981',
    duration: '2.0 hrs',
    highway: 'A28 / A9',
  },
  {
    id: 'r-ap-jf',
    name: 'A9 Northern Express Corridor',
    from: 'anuradhapura',
    to: 'jaffna',
    d: 'M 140 180 Q 122 105 108 44',
    color: '#60a5fa',
    duration: '3.5 hrs',
    highway: 'A9 Northern',
  },
  {
    id: 'r-ap-pl',
    name: 'North Central Connector',
    from: 'anuradhapura',
    to: 'polonnaruwa',
    d: 'M 140 180 Q 170 193 206 215',
    color: '#10b981',
    duration: '1.5 hrs',
    highway: 'A11',
  },
  {
    id: 'r-pl-tr',
    name: 'Eastern Harbor Supply Route',
    from: 'polonnaruwa',
    to: 'trincomalee',
    d: 'M 206 215 Q 220 180 232 152',
    color: '#8b5cf6',
    duration: '1.8 hrs',
    highway: 'A15 / A6',
  },
  {
    id: 'r-pl-bt',
    name: 'East Coast Distribution Lane',
    from: 'polonnaruwa',
    to: 'batticaloa',
    d: 'M 206 215 Q 245 227 280 238',
    color: '#a855f7',
    duration: '2.1 hrs',
    highway: 'A11 / A4',
  },
  {
    id: 'r-cm-gl',
    name: 'Southern Expressway E01',
    from: 'colombo',
    to: 'galle',
    d: 'M 82 318 Q 95 358 118 392',
    color: '#f59e0b',
    duration: '1.2 hrs',
    highway: 'E01 Expressway',
  },
  {
    id: 'r-gl-hb',
    name: 'Southern Port Belt Expressway',
    from: 'galle',
    to: 'hambantota',
    d: 'M 118 392 Q 168 408 218 384',
    color: '#f97316',
    duration: '1.4 hrs',
    highway: 'E01 Ext / A2',
  },
  {
    id: 'r-cm-rp',
    name: 'Sabaragamuwa Commodity Line',
    from: 'colombo',
    to: 'ratnapura',
    d: 'M 82 318 Q 112 330 142 338',
    color: '#14b8a6',
    duration: '2.0 hrs',
    highway: 'A4 Highway',
  },
  {
    id: 'r-kn-bd',
    name: 'Highland Produce Route',
    from: 'kandy',
    to: 'badulla',
    d: 'M 168 278 Q 192 290 210 308',
    color: '#eab308',
    duration: '2.8 hrs',
    highway: 'A5 / A26',
  },
  {
    id: 'r-hb-bt',
    name: 'South-East Agro-Maritime Link',
    from: 'hambantota',
    to: 'batticaloa',
    d: 'M 218 384 Q 262 310 280 238',
    color: '#ec4899',
    duration: '4.0 hrs',
    highway: 'A4 / Coastal',
  },
];

export function TradeMap() {
  const [selectedHub, setSelectedHub] = useState<CityHub | null>(CITY_HUBS[0]);
  const [hoveredProvince, setHoveredProvince] = useState<Province | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'expressway' | 'port' | 'depot'>('all');

  const filteredRoutes = TRADE_ROUTES.filter((r) => {
    if (filterType === 'expressway') return r.highway.includes('E01') || r.highway.includes('E04');
    if (filterType === 'port') return r.from === 'colombo' || r.to === 'colombo' || r.to === 'trincomalee' || r.to === 'hambantota' || r.to === 'galle';
    if (filterType === 'depot') return r.from === 'anuradhapura' || r.from === 'polonnaruwa' || r.from === 'kandy';
    return true;
  });

  return (
    <div className="sl-trade-map-container">
      {/* Top Filter Buttons */}
      <div className="sl-map-toolbar">
        <div className="sl-filter-pills">
          <button
            type="button"
            className={`sl-pill ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Corridors ({TRADE_ROUTES.length})
          </button>
          <button
            type="button"
            className={`sl-pill ${filterType === 'expressway' ? 'active' : ''}`}
            onClick={() => setFilterType('expressway')}
          >
            Expressways (E01/E04)
          </button>
          <button
            type="button"
            className={`sl-pill ${filterType === 'port' ? 'active' : ''}`}
            onClick={() => setFilterType('port')}
          >
            Ports
          </button>
          <button
            type="button"
            className={`sl-pill ${filterType === 'depot' ? 'active' : ''}`}
            onClick={() => setFilterType('depot')}
          >
            Regional Depots
          </button>
        </div>
      </div>

      {/* Main Map Box */}
      <div className="sl-map-viewport">
        {/* Background Grid Lines & Island Atmosphere */}
        <div className="sl-grid-overlay" />
        <div className="sl-radial-glow" />

        <svg
          viewBox="0 0 350 440"
          preserveAspectRatio="xMidYMid meet"
          className="sl-svg"
          aria-label="Sri Lanka Provincial Distribution and Trade Map"
        >
          <defs>
            <filter id="sl-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── 1. PROVINCE POLYGONS & BOUNDARIES ── */}
          <g className="sl-provinces-layer">
            {PROVINCES.map((prov) => {
              const isHovered = hoveredProvince?.id === prov.id;
              const isHubProvince = selectedHub?.province.toLowerCase().includes(prov.id.split('-')[0]);

              return (
                <g key={prov.id} className="sl-province-group">
                  <path
                    d={prov.path}
                    className={`sl-province-path ${isHovered ? 'hovered' : ''} ${isHubProvince ? 'active-hub-prov' : ''}`}
                    style={{
                      fill: isHovered
                        ? `${prov.color}35`
                        : isHubProvince
                        ? `${prov.color}20`
                        : `${prov.color}0e`,
                      stroke: isHovered ? prov.color : `${prov.color}40`,
                    }}
                    onMouseEnter={() => setHoveredProvince(prov)}
                    onMouseLeave={() => setHoveredProvince(null)}
                  />
                  {/* Province label */}
                  <text
                    x={prov.center.x}
                    y={prov.center.y}
                    className="sl-province-label"
                    textAnchor="middle"
                  >
                    {prov.name.replace(' Province', '')}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── 2. ANIMATED TRADE ROUTES / HIGHWAY LANES ── */}
          <g className="sl-routes-layer">
            {filteredRoutes.map((route, idx) => {
              const isHighlighted =
                selectedHub?.id === route.from || selectedHub?.id === route.to;

              return (
                <g key={route.id} className={`sl-route-group ${isHighlighted ? 'highlighted' : ''}`}>
                  {/* Route outer background glow */}
                  <path
                    d={route.d}
                    fill="none"
                    stroke={route.color}
                    strokeWidth={isHighlighted ? 3.5 : 2}
                    strokeOpacity={isHighlighted ? 0.35 : 0.12}
                    strokeLinecap="round"
                  />
                  {/* Route dashed cargo stream */}
                  <path
                    d={route.d}
                    fill="none"
                    stroke={route.color}
                    strokeWidth={isHighlighted ? 1.6 : 1.0}
                    strokeOpacity={isHighlighted ? 1.0 : 0.75}
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    className="sl-cargo-stream"
                    style={{
                      animationDuration: `${12 + (idx % 4) * 2}s`,
                    }}
                  />
                </g>
              );
            })}
          </g>

          {/* ── 3. CITY HUBS / LOGISTICS CENTERS ── */}
          <g className="sl-hubs-layer">
            {CITY_HUBS.map((hub) => {
              const isSelected = selectedHub?.id === hub.id;
              const isConnected = selectedHub?.connections.includes(hub.id);

              return (
                <g
                  key={hub.id}
                  className={`sl-hub-node ${isSelected ? 'selected' : ''} ${isConnected ? 'connected' : ''}`}
                  onClick={() => setSelectedHub(hub)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Radar pulse for Colombo HQ & Selected Hub */}
                  {(hub.type === 'hq' || isSelected) && (
                    <>
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isSelected ? 10 : 8}
                        className="sl-radar-ring"
                        style={{ stroke: hub.type === 'hq' ? '#10b981' : '#3b82f6' }}
                      />
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isSelected ? 6 : 5}
                        className="sl-radar-ring-2"
                        style={{ stroke: hub.type === 'hq' ? '#34d399' : '#60a5fa' }}
                      />
                    </>
                  )}

                  {/* Hub Halo */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isSelected ? 5.5 : 3.8}
                    className="sl-hub-halo"
                    style={{
                      fill:
                        hub.type === 'hq'
                          ? 'rgba(16,185,129,0.25)'
                          : hub.type === 'port'
                          ? 'rgba(59,130,246,0.25)'
                          : 'rgba(245,158,11,0.2)',
                    }}
                  />

                  {/* Hub Center Dot */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isSelected ? 3 : 2}
                    className="sl-hub-dot"
                    style={{
                      fill:
                        hub.type === 'hq'
                          ? '#10b981'
                          : hub.type === 'port'
                          ? '#3b82f6'
                          : hub.type === 'junction'
                          ? '#f59e0b'
                          : '#a855f7',
                    }}
                  />

                  {/* City Label */}
                  <text
                    x={hub.x > 190 ? hub.x + 7 : hub.x < 110 ? hub.x - 7 : hub.x}
                    y={
                      hub.y < 60
                        ? hub.y - 7
                        : hub.y > 380
                        ? hub.y + 11
                        : hub.x < 110
                        ? hub.y + 3
                        : hub.x > 190
                        ? hub.y + 3
                        : hub.y - 7
                    }
                    textAnchor={hub.x > 190 ? 'start' : hub.x < 110 ? 'end' : 'middle'}
                    className={`sl-hub-name ${isSelected ? 'selected' : ''} ${hub.type === 'hq' ? 'hq' : ''}`}
                  >
                    {hub.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Province Hover Callout (Top Right) */}
        {hoveredProvince && (
          <div className="sl-province-tooltip glass-panel">
            <strong>{hoveredProvince.name}</strong>
            <small>{hoveredProvince.sinhalaName}</small>
            <div className="sl-prov-stats">
              <span>{hoveredProvince.activeRoutes} Active Lanes</span>
              <span>•</span>
              <span>{hoveredProvince.shipmentVolume}</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Hub Card (Cleanly Placed Below Viewport - Zero Overlapping!) */}
      {selectedHub && (
        <div className="sl-hub-card-bottom glass-panel">
          <div className="sl-card-header">
            <div className="sl-card-title-group">
              <span className={`sl-hub-badge ${selectedHub.type}`}>
                {selectedHub.type === 'hq'
                  ? 'HQ Port'
                  : selectedHub.type === 'port'
                  ? 'Maritime Port'
                  : selectedHub.type === 'junction'
                  ? 'Junction'
                  : 'Depot'}
              </span>
              <h4>
                {selectedHub.name} <small>{selectedHub.sinhala}</small>
              </h4>
            </div>
            <span className="sl-hub-status-pill">
              <i /> {selectedHub.status}
            </span>
          </div>

          <div className="sl-card-stats-row">
            <div className="sl-card-stat">
              <span className="sl-stat-label">
                <Truck size={11} /> Shipments
              </span>
              <strong>{selectedHub.activeShipments} Trucks Active</strong>
            </div>
            <div className="sl-card-stat">
              <span className="sl-stat-label">
                <Navigation size={11} /> Province
              </span>
              <strong>{selectedHub.province}</strong>
            </div>
          </div>

          <div className="sl-card-connections">
            <span className="sl-conn-label">Connected Routes:</span>
            <div className="sl-conn-tags">
              {selectedHub.connections.map((cId) => {
                const target = CITY_HUBS.find((h) => h.id === cId);
                return (
                  <button
                    key={cId}
                    type="button"
                    className="sl-conn-tag"
                    onClick={() => target && setSelectedHub(target)}
                  >
                    {target?.name || cId} <ArrowRight size={9} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Map Footer / Key Legend */}
      <div className="sl-map-footer">
        <div className="sl-legend-items">
          <span className="sl-legend-item">
            <i className="sl-legend-dot hq" /> Colombo (HQ)
          </span>
          <span className="sl-legend-item">
            <i className="sl-legend-dot port" /> Ports (Galle / Hambantota / Trincomalee)
          </span>
          <span className="sl-legend-item">
            <i className="sl-legend-dot depot" /> Regional Depots (Anuradhapura, Polonnaruwa, Kandy...)
          </span>
        </div>
        <div className="sl-live-tag">
          <Activity size={11} /> Live Dispatch Network
        </div>
      </div>
    </div>
  );
}
