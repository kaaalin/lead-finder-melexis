import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Search, Settings, MapPin, Link as LinkIcon, Users, Loader2, Mail, Plus, Trash2, Database, Clock, CheckCircle2, AlertTriangle, X, Download } from 'lucide-react'

type SourceInsight = { source: string; excerpt: string; reliability: number }
type RoadmapItem = { milestone: string; quarter: string; confidence: number }
type Company = {
  id: string
  name: string
  description: string
  website?: string
  hq?: string
  industries: string[]
  applications: string[]
  techSignals: string[]
  size?: string
  stage?: string
  score?: number
  sources?: SourceInsight[]
  roadmap?: RoadmapItem[]
}
type Persona = {
  id: string
  name: string
  title: string
  seniority: 'Director' | 'VP' | 'C-level' | 'Manager' | 'Lead'
  dept: string
  location?: string
  linkedin?: string
  emailStatus?: 'unknown' | 'pattern' | 'verified'
  likelihood: number
}

const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'E-Motion Robotics',
    description: 'Designs autonomous mobile robots and AGV drive modules using BLDC motors and integrated position sensing.',
    website: 'https://example.com/emotion',
    hq: 'Munich, DE',
    industries: ['Robotics', 'Industrial Automation'],
    applications: ['Motor control', 'Position sensing', 'Battery management'],
    techSignals: ['BLDC', 'FOC', 'Hall', 'Position Sensor', 'SIL'],
    size: '200-500',
    stage: 'Growth',
    sources: [
      { source: 'Crunchbase', excerpt: 'Funding note cites expansion of AGV drive systems.', reliability: 0.9 },
      { source: 'LinkedIn', excerpt: 'Job posts for Motor Control Engineer (BLDC).', reliability: 0.8 },
      { source: 'Company site', excerpt: 'Brochure references Hall-based commutation feedback.', reliability: 0.85 }
    ],
    roadmap: [
      { milestone: 'Prototype BLDC module Gen2 (EVT)', quarter: 'Q4 2025', confidence: 0.9 },
      { milestone: 'AGV platform scale-up (DVT/Pilot)', quarter: 'Q2 2026', confidence: 0.7 }
    ]
  },
  {
    id: '2',
    name: 'NovaDrive E-Mobility',
    description: 'Tier-1 supplier of e-axle subsystems for light EVs; heavy use of PMSM, BMS, and functional safety MCUs.',
    website: 'https://example.com/novadrive',
    hq: 'Turin, IT',
    industries: ['Automotive', 'e-Mobility'],
    applications: ['Motor control', 'Inverter', 'BMS'],
    techSignals: ['PMSM', 'Hall', 'LIN', 'CAN-FD', 'ISO 26262'],
    size: '500-1000',
    stage: 'Series',
    sources: [
      { source: 'Press release', excerpt: 'Announced new integrated inverter program.', reliability: 0.9 },
      { source: 'Patent filings', excerpt: 'Hall-effect rotor position sensing patent.', reliability: 0.95 }
    ],
    roadmap: [
      { milestone: 'SOP: e-axle inverter', quarter: 'Q3 2025', confidence: 0.85 },
      { milestone: 'R&D: next-gen current sensors', quarter: 'Q1 2026', confidence: 0.7 }
    ]
  },
  {
    id: '3',
    name: 'AeroSense UAV Systems',
    description: 'Develops flight controllers and gimbal actuators for commercial drones with precision current sensing.',
    website: 'https://example.com/aerosense',
    hq: 'Toulouse, FR',
    industries: ['Aerospace', 'Drones'],
    applications: ['Current sensing', 'Position sensing', 'Motor control'],
    techSignals: ['Hall', '3D Magnetometer', 'BLDC', 'CAN'],
    size: '50-200',
    stage: 'Scale-up',
    sources: [
      { source: 'Tech media', excerpt: 'Series-A to expand UAV motor controllers.', reliability: 0.85 },
      { source: 'Company blog', excerpt: 'Mentions Melexis Hall sensor family as eval reference.', reliability: 0.9 }
    ],
    roadmap: [
      { milestone: 'Pilot: gimbal control board', quarter: 'Q2 2025', confidence: 0.9 },
      { milestone: 'Commercial rollout', quarter: 'Q1 2026', confidence: 0.75 }
    ]
  },
  {
    id: '4',
    name: 'PolarCool HVAC',
    description: 'Smart HVAC compressors and brushless fan modules for residential and commercial buildings.',
    website: 'https://example.com/polarcool',
    hq: 'Gdańsk, PL',
    industries: ['HVAC', 'Appliances'],
    applications: ['Motor control', 'Position sensing'],
    techSignals: ['BLDC', 'Hall', 'Temp Sensor', 'LIN'],
    size: '200-500',
    stage: 'Profitably scaling',
    sources: [
      { source: 'LinkedIn', excerpt: 'Hiring spree for BLDC control engineers.', reliability: 0.8 },
      { source: 'Trade fair', excerpt: 'Showcased compressor using Hall-based sensing.', reliability: 0.85 }
    ],
    roadmap: [
      { milestone: 'Integrate magnetic position sensor (DVT)', quarter: 'Q3 2025', confidence: 0.9 },
      { milestone: 'HVAC controller Gen3 launch', quarter: 'Q1 2026', confidence: 0.8 }
    ]
  },
  // China examples
  {
    id: '5',
    name: 'ShenMotion Robotics',
    description: 'AMR drive-train modules and cobot joints using BLDC motors with Hall/3D magnetic sensing for commutation and position.',
    website: 'https://example.com/shenmotion',
    hq: 'Shenzhen, CN',
    industries: ['Robotics', 'Industrial Automation'],
    applications: ['Motor control', 'Position sensing'],
    techSignals: ['BLDC', 'FOC', 'Hall', '3D Magnetometer', 'CAN'],
    size: '200-500',
    stage: 'Scale-up',
    sources: [
      { source: 'Company WeChat/News', excerpt: 'Announced AMR joint module with Hall-based commutation.', reliability: 0.85 },
      { source: 'Job posts (BOSS直聘)', excerpt: 'Hiring BLDC 控制算法工程师.', reliability: 0.8 },
      { source: 'Trade show (CIIF)', excerpt: 'Demoed AMR with magnetic position feedback.', reliability: 0.8 }
    ],
    roadmap: [
      { milestone: 'EVT: joint module Gen2', quarter: 'Q1 2026', confidence: 0.85 },
      { milestone: 'DVT: AMR platform', quarter: 'Q3 2026', confidence: 0.7 }
    ]
  },
  {
    id: '6',
    name: 'Hangzhou CoolAir',
    description: 'High-efficiency BLDC fan and compressor controls for residential & commercial HVAC.',
    website: 'https://example.com/coolair',
    hq: 'Hangzhou, CN',
    industries: ['HVAC', 'Appliances'],
    applications: ['Motor control', 'Position sensing'],
    techSignals: ['BLDC', 'Hall', 'Temp Sensor', 'LIN'],
    size: '500-1000',
    stage: 'Growth',
    sources: [
      { source: 'Alibaba News', excerpt: 'Listed as supplier of BLDC HVAC modules.', reliability: 0.75 },
      { source: 'LinkedIn/脉脉', excerpt: 'Multiple hires for BLDC control & sensing.', reliability: 0.75 }
    ],
    roadmap: [
      { milestone: 'Integrate magnetic position sensor (DVT)', quarter: 'Q4 2025', confidence: 0.85 },
      { milestone: 'Gen3 smart HVAC controller launch', quarter: 'Q2 2026', confidence: 0.75 }
    ]
  },
  {
    id: '7',
    name: 'Shanghai E-Drive Systems',
    description: 'Traction inverter and e-axle control units for light EVs with rotor position sensing.',
    website: 'https://example.com/sh-edrive',
    hq: 'Shanghai, CN',
    industries: ['Automotive', 'e-Mobility'],
    applications: ['Inverter', 'Motor control', 'Position sensing'],
    techSignals: ['PMSM', 'Hall', 'Resolver', 'CAN-FD', 'ISO 26262'],
    size: '1000+',
    stage: 'Series',
    sources: [
      { source: 'Press release', excerpt: 'Awarded SOP for domestic OEM e-axle inverter.', reliability: 0.9 },
      { source: 'Patent filings (CNIPA)', excerpt: 'Hall-based rotor angle estimation methods.', reliability: 0.95 }
    ],
    roadmap: [
      { milestone: 'SOP: e-axle inverter program', quarter: 'Q2 2026', confidence: 0.8 },
      { milestone: 'Next-gen current sensing R&D', quarter: 'Q1 2027', confidence: 0.6 }
    ]
  }
]

const MOCK_PERSONAS: Record<string, Persona[]> = {
  '1': [
    { id: 'p1', name: 'Klara Weiss', title: 'Head of Motor Control Engineering', seniority: 'Director', dept: 'Hardware', location: 'Munich, DE', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'pattern', likelihood: 0.84 },
    { id: 'p2', name: 'Jonas Kühn', title: 'VP Sourcing & Supplier Development', seniority: 'VP', dept: 'Procurement', location: 'Berlin, DE', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'unknown', likelihood: 0.71 }
  ],
  '2': [
    { id: 'p3', name: 'Giulia Romano', title: 'Chief Platform Architect, Electrified Powertrain', seniority: 'C-level', dept: 'R&D', location: 'Turin, IT', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'pattern', likelihood: 0.78 },
    { id: 'p4', name: 'Marco Vitale', title: 'Director, Motor Inverter Systems', seniority: 'Director', dept: 'Hardware', location: 'Turin, IT', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'unknown', likelihood: 0.81 }
  ],
  '3': [
    { id: 'p5', name: 'Camille Bernard', title: 'Lead Controls Engineer', seniority: 'Lead', dept: 'Hardware', location: 'Toulouse, FR', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'unknown', likelihood: 0.69 }
  ],
  '4': [
    { id: 'p6', name: 'Piotr Nowak', title: 'Director of Advanced Motor Platforms', seniority: 'Director', dept: 'R&D', location: 'Gdańsk, PL', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'pattern', likelihood: 0.73 }
  ],
  '5': [
    { id: 'p7', name: 'Liang Chen', title: 'Director of Motor Control', seniority: 'Director', dept: 'Hardware', location: 'Shenzhen, CN', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'pattern', likelihood: 0.8 },
    { id: 'p8', name: 'Yue Wang', title: 'VP Supply Chain', seniority: 'VP', dept: 'Procurement', location: 'Shenzhen, CN', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'unknown', likelihood: 0.72 }
  ],
  '6': [
    { id: 'p9', name: 'Zhi Zhao', title: 'R&D Director, Motor Drives', seniority: 'Director', dept: 'R&D', location: 'Hangzhou, CN', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'pattern', likelihood: 0.76 }
  ],
  '7': [
    { id: 'p10', name: 'Mei Lin', title: 'Chief Engineer, Traction Inverters', seniority: 'Lead', dept: 'Hardware', location: 'Shanghai, CN', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'unknown', likelihood: 0.79 },
    { id: 'p11', name: 'Hao Sun', title: 'Director, E-Drive Programs', seniority: 'Director', dept: 'R&D', location: 'Shanghai, CN', linkedin: 'https://linkedin.com/in/placeholder', emailStatus: 'pattern', likelihood: 0.82 }
  ]
}

const SETTINGS_KEY = 'melexis-lead-finder-settings'

function useSettings() {
  const [settings, setSettings] = useState(() => {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : { apis: { crunchbase: '', clearbit: '', ppld: '', serp: '' }, geography: ['EU'], defaultSeniority: ['Director','VP','C-level'] }
  })
  useEffect(() => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)) }, [settings])
  return { settings, setSettings } as const
}

function scoreCompany(c: Company, query: string, melexisPart: string, minSignalWeight: number) {
  const t = (query + ' ' + melexisPart).toLowerCase().split(/[^a-z0-9+]+/g).filter(Boolean)
  const hay = (c.description + ' ' + c.industries.join(' ') + ' ' + c.applications.join(' ') + ' ' + c.techSignals.join(' ')).toLowerCase()
  const tf = t.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0)
  const signal = c.techSignals.reduce((acc, s) => acc + (t.includes(s.toLowerCase()) ? 1 : 0), 0)
  const appOverlap = c.applications.reduce((acc, a) => acc + (t.includes(a.toLowerCase()) ? 1 : 0), 0)
  const score = tf * 0.4 + signal * 0.4 + appOverlap * 0.2 + (c.industries.includes('Automotive') ? 0.15 : 0)
  return Math.max(minSignalWeight, Math.min(1, score / 3))
}

const Tag = ({ children }: { children: React.ReactNode }) => <span className='badge'>{children}</span>

function Diagnostics() {
  const issues: string[] = []
  try { JSON.stringify(MOCK_COMPANIES); JSON.stringify(MOCK_PERSONAS); } catch { issues.push('JSON serialization failed for mocks.') }
  const cnCompanies = MOCK_COMPANIES.filter(c => /CN|China|Shenzhen|Shanghai|Beijing|Hangzhou|Guangzhou/i.test(c.hq || ''))
  if (cnCompanies.length < 3) issues.push('Expected at least 3 CN companies in mocks.')
  return (
    <div style={{display:'flex', gap:8, fontSize:12}}>
      {issues.length === 0 ? <span style={{color:'var(--ok)'}}><CheckCircle2 size={14}/> Self-tests passed</span> : <span style={{color:'var(--warn)'}}><AlertTriangle size={14}/> {issues.length} issue(s) detected</span>}
    </div>
  )
}

export default function App() {
  const { settings, setSettings } = useSettings()
  const [query, setQuery] = useState('motor control hall sensor BLDC')
  const [melexisPart, setMelexisPart] = useState('MLX90393 (3D magnetometer)')
  const [regionEU, setRegionEU] = useState(true)
  const [regionCN, setRegionCN] = useState(false)
  const [regionNA, setRegionNA] = useState(false)
  const [minScore, setMinScore] = useState(0.5)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Company[]>([])
  const [activeCompany, setActiveCompany] = useState<Company | null>(null)
  const [people, setPeople] = useState<Persona[]>([])
  const [shortlist, setShortlist] = useState<Persona[]>([])
  const [showSettings, setShowSettings] = useState(false)

  const filtered = useMemo(() => {
    const inEU = (hq?: string) => /(AT|BE|BG|HR|CY|CZ|DE|DK|EE|ES|FI|FR|GR|HU|IE|IT|LT|LU|LV|MT|NL|PL|PT|RO|SE|SI|SK|EU|Europe)/i.test(hq || '')
    const inCN = (hq?: string) => /(CN|China|Shenzhen|Shanghai|Beijing|Hangzhou|Guangzhou)/i.test(hq || '')
    const inNA = (hq?: string) => /(US|USA|United States|CA|Canada)/i.test(hq || '')
    const regionFilter = (c: Company) => {
      const okEU = regionEU && inEU(c.hq)
      const okCN = regionCN && inCN(c.hq)
      const okNA = regionNA && inNA(c.hq)
      const anySelected = regionEU || regionCN || regionNA
      return anySelected ? (okEU || okCN || okNA) : true
    }
    return MOCK_COMPANIES
      .map(c => ({ ...c, score: scoreCompany(c, query, melexisPart, 0.1) }))
      .filter(regionFilter)
      .filter(c => (c.score ?? 0) >= minScore)
      .sort((a,b) => (b.score ?? 0) - (a.score ?? 0))
  }, [query, melexisPart, regionEU, regionCN, regionNA, minScore])

  function simulateSearch() {
    setLoading(true)
    setResults([]); setPeople([]); setActiveCompany(null)
    setTimeout(() => { setResults(filtered); setLoading(false) }, 800)
  }

  function simulatePeopleSearch(company: Company) {
    setLoading(true); setActiveCompany(company); setPeople([])
    setTimeout(() => { setPeople(MOCK_PERSONAS[company.id] || []); setLoading(false) }, 700)
  }

  function toggleShortlist(p: Persona) {
    setShortlist(prev => (prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]))
  }

  function exportCSV() {
    const header = ['Company','Name','Title','Seniority','Dept','Location','LinkedIn','Likelihood','EmailStatus']
    const rows = shortlist.map(p => [activeCompany?.name || '(various)', p.name, p.title, p.seniority, p.dept, p.location || '', p.linkedin || '', p.likelihood.toFixed(2), p.emailStatus || 'unknown'])
    const csv = [header, ...rows].map(r => r.map(x => '"' + (x ?? '').toString().replace(/"/g,'""') + '"').join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'melexis_decision_makers.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className='header'>
        <div className='header-inner container'>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div className='logo' style={{background:'var(--accent-2)', color:'#fff'}}><Building2 size={18}/></div>
            <div>
              <div className='app-title'>Melexis Lead Finder</div>
              <div className='sub'>Find companies & the right decision makers for Melexis parts</div>
            </div>
          </div>
          <button className='btn btn-outline btn-icon' onClick={()=>setShowSettings(!showSettings)}><Settings size={16}/> Settings</button>
        </div>
      </div>

      <div className='container row' style={{marginTop:16}}>
        <div className='space-y-6'>
          <div className='card'>
            <div className='card-header'><div className='card-title'>Search criteria</div></div>
            <div className='card-content'>
              <div className='grid2'>
                <div className='field'>
                  <div className='label'>Application keywords</div>
                  <input className='input' value={query} onChange={e=>setQuery(e.target.value)} placeholder='e.g., motor control, Hall sensor, BLDC fan' />
                </div>
                <div className='field'>
                  <div className='label'>Melexis part / family</div>
                  <input className='input' value={melexisPart} onChange={e=>setMelexisPart(e.target.value)} placeholder='e.g., MLX90393, MLX91230, MLX92232' />
                </div>
                <div className='field'>
                  <div className='label'>Regions</div>
                  <div style={{display:'flex', gap:18, alignItems:'center'}}>
                    <label><input className='checkbox' type='checkbox' checked={regionEU} onChange={e=>setRegionEU(e.target.checked)}/> EU</label>
                    <label><input className='checkbox' type='checkbox' checked={regionCN} onChange={e=>setRegionCN(e.target.checked)}/> China</label>
                    <label><input className='checkbox' type='checkbox' checked={regionNA} onChange={e=>setRegionNA(e.target.checked)}/> North America</label>
                  </div>
                </div>
                <div className='field'>
                  <div className='label'>Minimum match score: {minScore.toFixed(2)}</div>
                  <input className='slider' type='range' min='0' max='1' step='0.05' value={minScore} onChange={(e)=>setMinScore(parseFloat(e.target.value))} />
                </div>
              </div>
              <div style={{display:'flex', gap:8, marginTop:8}}>
                <button className='btn btn-icon' onClick={simulateSearch}><Search size={16}/> Find companies</button>
                <button className='btn btn-outline' onClick={()=>{ setResults([]); setPeople([]); setActiveCompany(null); }}>Clear</button>
              </div>
              <div style={{marginTop:8}}><Diagnostics/></div>
            </div>
          </div>

          <div className='card'>
            <div className='card-header'>
              <div className='card-title'>Companies ({results.length})</div>
              {loading && <div className='sub' style={{display:'flex', alignItems:'center', gap:6}}><Loader2 size={16}/> Loading…</div>}
            </div>
            <div className='card-content' style={{display:'grid', gap:12}}>
              <AnimatePresence>
                {results.map(c => (
                  <motion.div key={c.id} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}}>
                    <div className='company'>
                      <div>
                        <div className='company-head'>
                          <div className='logo'>{c.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                          <div>
                            <div style={{fontWeight:600}}>{c.name}</div>
                            <div className='sub' style={{display:'flex', gap:8, alignItems:'center'}}>
                              <MapPin size={12}/> {c.hq || '—'} • {c.size || ''} {c.stage ? `• ${c.stage}` : ''}
                            </div>
                          </div>
                        </div>
                        <p style={{fontSize:14, marginTop:8}}>{c.description}</p>
                        <div style={{display:'flex', flexWrap:'wrap', gap:8, marginTop:6}}>
                          {c.industries.map(i => <Tag key={i}>{i}</Tag>)}
                          {c.applications.slice(0,3).map(a => <Tag key={a}>{a}</Tag>)}
                          {c.techSignals.slice(0,3).map(s => <Tag key={s}>{s}</Tag>)}
                        </div>
                        <div style={{display:'flex', gap:8, alignItems:'center', marginTop:6}}>
                          <span className='badge badge-secondary'>Match score: {(c.score ?? 0).toFixed(2)}</span>
                          {c.website && <a href={c.website} target='_blank' className='sub' style={{display:'inline-flex', alignItems:'center', gap:6, color:'#2563eb', textDecoration:'none'}}><LinkIcon size={12}/> Website</a>}
                        </div>

                        {c.sources && c.sources.length>0 && (
                          <div className='section-title'><Database size={14}/> Evidence sources</div>
                        )}
                        {c.sources && c.sources.map((s, idx) => (
                          <div key={idx} className='evidence'>
                            <span className='badge badge-outline'>{s.source}</span>
                            <span style={{flex:1}}>{s.excerpt}</span>
                            <span className='badge badge-secondary'>Reliability {Math.round((s.reliability ?? 0) * 100)}%</span>
                          </div>
                        ))}

                        {c.roadmap && c.roadmap.length>0 && (
                          <div className='section-title'><Clock size={14}/> Roadmap & timeline</div>
                        )}
                        {c.roadmap && c.roadmap.map((r, idx) => (
                          <div key={idx} className='roadmap'>
                            <strong>{r.milestone}</strong>
                            <span className='badge badge-outline'>{r.quarter}</span>
                            <span className='badge badge-secondary'>Confidence {Math.round((r.confidence ?? 0) * 100)}%</span>
                          </div>
                        ))}
                      </div>
                      <div style={{display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end'}}>
                        <button className='btn btn-outline' onClick={()=>setActiveCompany(c)}>View profile</button>
                        <button className='btn btn-icon' onClick={()=>simulatePeopleSearch(c)}><Users size={16}/> Find decision makers</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {!results.length && !loading && <div className='sub'>No results yet. Enter criteria and click <strong>Find companies</strong>.</div>}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='card'>
            <div className='card-header'><div className='card-title'>Decision makers {activeCompany ? `— ${activeCompany.name}` : ''}</div></div>
            <div className='card-content' style={{display:'grid', gap:10}}>
              {loading && <div className='sub' style={{display:'flex', alignItems:'center', gap:6}}><Loader2 size={16}/> Loading…</div>}
              {!loading && people.length===0 && <div className='sub'>Select a company and click <strong>Find decision makers</strong>.</div>}
              {people.map(p => (
                <div key={p.id} className='person'>
                  <div>
                    <div style={{fontWeight:600}}>{p.name}</div>
                    <div className='sub'>{p.title} • {p.dept} • {p.location || ''}</div>
                    <div style={{display:'flex', gap:8, alignItems:'center', marginTop:4, flexWrap:'wrap'}}>
                      <span className='badge badge-secondary'>Likelihood {(p.likelihood * 100).toFixed(0)}%</span>
                      <span className='badge badge-outline'>{p.seniority}</span>
                      {p.linkedin && <a href={p.linkedin} target='_blank' className='sub' style={{display:'inline-flex', alignItems:'center', gap:6, color:'#2563eb', textDecoration:'none'}}><LinkIcon size={12}/> LinkedIn</a>}
                      <span className='sub' style={{display:'inline-flex', alignItems:'center', gap:6}}><Mail size={12}/> {p.emailStatus === 'verified' ? 'Verified' : p.emailStatus === 'pattern' ? 'Pattern match' : 'Unknown'}</span>
                    </div>
                  </div>
                  <div style={{display:'flex', gap:8}}>
                    <button className='btn btn-outline btn-icon' onClick={()=>toggleShortlist(p)}>{shortlist.find(x=>x.id===p.id)? <Trash2 size={16}/> : <Plus size={16}/>}{shortlist.find(x=>x.id===p.id)? ' Remove' : ' Add'}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='card'>
            <div className='card-header'>
              <div className='card-title'>Outreach shortlist ({shortlist.length})</div>
              {!!shortlist.length && <button className='btn btn-outline btn-icon' onClick={exportCSV}><Download size={16}/> Export CSV</button>}
            </div>
            <div className='card-content' style={{display:'grid', gap:10}}>
              {!shortlist.length && <div className='sub'>Add decision makers to build your outreach list.</div>}
              {shortlist.map(p => (
                <div key={p.id} className='company' style={{gridTemplateColumns:'1fr auto'}}>
                  <div>
                    <div style={{fontWeight:600, fontSize:14}}>{p.name}</div>
                    <div className='sub'>{p.title} • {p.dept}</div>
                  </div>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <span className='badge badge-secondary'>{Math.round(p.likelihood * 100)}%</span>
                    <button className='btn btn-outline' onClick={()=>toggleShortlist(p)}><X size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='container footer'>
        <span>Demo only — wire APIs to make it live. Respect each data source's Terms of Service.</span>
      </div>
    </div>
  )
}
