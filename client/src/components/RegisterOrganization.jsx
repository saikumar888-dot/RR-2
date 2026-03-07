import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/RegisterOrganization.css";
import axios from 'axios';
/* ─────────────────────────────────────────────
   RevenueRadar — ORGANIZATION SETUP PAGE
   Aesthetic: Ultra-luxury dark editorial
   Fonts: Cormorant Garamond + DM Sans + DM Mono
────────────────────────────────────────────── */

const INDUSTRIES = [
  'Finance & Banking', 'Technology', 'Healthcare',
  'Real Estate', 'Legal & Compliance', 'Manufacturing',
  'Consulting', 'Media & Entertainment', 'Energy & Resources', 'Other'
]

const SIZES = [
  { v:'1-10', l:'1–10', sub:'Startup' },
  { v:'11-50', l:'11–50', sub:'Small' },
  { v:'51-200', l:'51–200', sub:'Mid-Market' },
  { v:'201-500', l:'201–500', sub:'Enterprise' },
  { v:'501+', l:'501+', sub:'Global' },
]

export default function RegisterOrganization() {
  const navigate = useNavigate()

  const [phase, setPhase] = useState(0)
  const [orgName, setOrgName] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const [industryOpen, setIndustryOpen] = useState(false)

  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const lerpRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef(null)
  const [mouseX, setMouseX] = useState(0.5)
  const [mouseY, setMouseY] = useState(0.5)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 450)
    const t3 = setTimeout(() => setPhase(3), 800)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
    }
    window.addEventListener('mousemove', onMove)
    const loop = () => {
      lerpRef.current.x += (mouseRef.current.x - lerpRef.current.x) * 0.04
      lerpRef.current.y += (mouseRef.current.y - lerpRef.current.y) * 0.04
      setMouseX(lerpRef.current.x); setMouseY(lerpRef.current.y)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [])

  useEffect(() => {
    const close = () => setIndustryOpen(false)
    if (industryOpen) window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [industryOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/organization/createorganization", {
        name: orgName,
        industry
      }, {
        withCredentials: true
      });

      console.log(res.data);
      navigate('/register')
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }
  const v = (p) => phase >= p
  const px = (mouseX - 0.5) * 14
  const py = (mouseY - 0.5) * 8

  return (
    <>
      <div className="op">
        <div className="op-bg-radial"/><div className="op-bg-grid"/><div className="op-bg-vignette"/>

        {/* ── LEFT PANEL ── */}
        <div className="op-left">
          <div className="op-left-glow"/>
          <div className="op-orb op-orb-1"/><div className="op-orb op-orb-2"/>

          <div className={`op-brand ${v(1)?'in':''}`} onClick={()=>navigate('/')}>
            <div className="op-brand-mark">R</div>
            <div className="op-brand-name">RevenueRadar</div>
          </div>

          <div className="op-center">
            <h2 className={`op-tagline ${v(2)?'in':''}`}>
              Your command<br/>center is <span className="op-tagline-em">almost<br/>ready.</span>
            </h2>
            <p className={`op-desc ${v(2)?'in':''}`}>
              One final step. Tell us about your organization so we can configure your dashboard with the right benchmarks, KPIs, and industry insights.
            </p>

            {/* Setup progress list */}
            <div className={`op-setup-steps ${v(3)?'in':''}`}>
              {[
                { ico:'✓', cls:'op-setup-ico-done', step:'done', lbl:'Account Created', sub:'Personal credentials saved', badge:'Complete', bcls:'op-setup-badge-done' },
                { ico:'◎', cls:'op-setup-ico-active', step:'active', lbl:'Organization Setup', sub:'Configure your command center', badge:'In Progress', bcls:'op-setup-badge-active' },
                { ico:'○', cls:'op-setup-ico-idle', step:'idle', lbl:'Dashboard Activation', sub:'Live in under 60 seconds', badge:'Next', bcls:'op-setup-badge-idle' },
              ].map((s,i)=>(
                <div key={i} className={`op-setup-step ${s.step}`}>
                  <div className={`op-setup-ico ${s.cls}`}>{s.ico}</div>
                  <div>
                    <div className="op-setup-lbl">{s.lbl}</div>
                    <div className="op-setup-sub">{s.sub}</div>
                  </div>
                  <div className={`op-setup-badge ${s.bcls}`}>{s.badge}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard preview */}
          <div className={`op-preview ${v(3)?'in':''}`}>
            <div className="op-preview-inner">
              <div className="op-preview-ttl">Your dashboard preview</div>
              <div className="op-preview-kpis">
                {[
                  {v:'$—.—M', l:'Revenue'},
                  {v:'—%', l:'Satisfaction'},
                  {v:'—,—', l:'Users'},
                ].map((k,i)=>(
                  <div key={i} className="op-preview-kpi">
                    <div className="op-preview-kv">{k.v}</div>
                    <div className="op-preview-kl">{k.l}</div>
                  </div>
                ))}
              </div>
              <div className="op-preview-soon">
                <div className="op-preview-pill">
                  <div className="op-soon-dot"/>
                  Activates after setup
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="op-right">
          <div
            className={`op-card ${v(2)?'in':''}`}
            style={{
              transform: v(2)
                ? `perspective(900px) rotateY(${px*0.02}deg) rotateX(${py*0.015}deg)`
                : 'translateY(28px)'
            }}
          >
            <div className="op-card-eyebrow">
              <div className="op-card-pill">Organization</div>
              <span className="op-card-step">Step 3 of 3</span>
            </div>
            <h1 className="op-card-h">Set up your <strong>organization.</strong></h1>
            <p className="op-card-sub">This powers your dashboard's industry benchmarks, KPI templates, and automated reporting.</p>

            <form className="op-form" onSubmit={handleSubmit} noValidate>

              {/* Organization name */}
              <div className="op-field">
                <label className="op-label">Organization Name</label>
                <div className="op-input-wrap">
                  <div className={`op-input-icon ${focusedField==='org'?'active':''}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M4.5 4V3a2.5 2.5 0 0 1 5 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <rect x="5.5" y="7" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  </div>
                  <input className={`op-input ${error&&!orgName?'err':''}`}
                    type="text" placeholder="Meridian Capital Group"
                    value={orgName} onChange={e=>setOrgName(e.target.value)}
                    onFocus={()=>setFocusedField('org')} onBlur={()=>setFocusedField(null)}
                    autoComplete="organization"/>
                </div>
              </div>

              {/* Industry + Role */}
              <div className="op-field-row">
                <div className="op-field">
                  <label className="op-label">Industry</label>
                  <div className="op-dropdown" onClick={e=>e.stopPropagation()}>
                    <div className={`op-input-icon ${industryOpen?'active':''}`} style={{zIndex:1,pointerEvents:'none'}}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="9" width="3" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.1"/>
                        <rect x="5.5" y="6" width="3" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.1"/>
                        <rect x="10" y="3" width="3" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.1"/>
                      </svg>
                    </div>
                    <button type="button"
                      className={`op-dropdown-btn ${!industry?'placeholder':''} ${industryOpen?'open':''} ${error&&!industry?'err':''}`}
                      onClick={()=>setIndustryOpen(!industryOpen)}>
                      {industry || 'Select…'}
                    </button>
                    <div className={`op-dropdown-arrow ${industryOpen?'open':''}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    {industryOpen && (
                      <div className="op-dropdown-menu">
                        {INDUSTRIES.map(ind=>(
                          <div key={ind}
                            className={`op-dropdown-item ${industry===ind?'selected':''}`}
                            onClick={()=>{ setIndustry(ind); setIndustryOpen(false) }}>
                            {ind}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Error */}
              {error && (
                <div className="op-error">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="#E88888" strokeWidth="1.2"/><path d="M6.5 4v3M6.5 9h.01" stroke="#E88888" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  {error}
                </div>
              )}

              <button className="op-submit" type="submit" disabled={loading} onClick={handleSubmit}>
                {loading ? (
                  <><div className="op-spinner"/>Forwarding To…</>
                ) : (
                  <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>Sign in</>
                )}
              </button>
            </form>

            <div className="op-footer">
              <div className="op-secure">
                <div className="op-secure-dot"/>
                Your data is encrypted · Never shared · Delete anytime
              </div>
              <div className="op-skip" onClick={()=>navigate('/login')}>
                Skip for now — I'll complete this later
              </div>
            </div>
          </div>
        </div>

        {/* Scene */}
        <div className={`op-scene ${v(1)?'in':''}`}>
          <svg viewBox="0 0 1440 110" preserveAspectRatio="xMidYMax meet"
            style={{position:'absolute',bottom:0,left:0,width:'100%',height:'100%'}}>
            <defs>
              <linearGradient id="osb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111827"/><stop offset="100%" stopColor="#060810"/>
              </linearGradient>
            </defs>
            {[[0,38,50],[44,28,38],[78,48,70],[140,24,36],[175,36,56],[232,32,48],
              [270,54,82],[348,26,40],[382,46,66],[442,34,54],[498,52,78],[568,30,46],
              [604,42,62],[660,60,92],[740,34,56],[796,48,74],[858,36,60],[916,56,84],
              [996,28,44],[1040,46,70],[1098,52,80],[1164,36,58],[1220,26,40],[1290,44,66]
            ].map(([x,w,h],i)=>(
              <rect key={i} x={x} y={110-h} width={w} height={h} fill="url(#osb)" opacity="0.62"/>
            ))}
            {Array.from({length:44},(_,i)=>{
              const wx=8+(i*103)%1428, wy=5+(i*59)%88
              return <rect key={'ow'+i} x={wx} y={wy} width={2.5} height={3.5}
                fill={i%6===0?'#BFA054':'#E0E8F0'} opacity={0.025+(i%5)*0.04} rx="0.3"/>
            })}
            <rect x="0" y="102" width="1440" height="8" fill="#080C14"/>
            <line x1="0" y1="102.5" x2="1440" y2="102.5" stroke="rgba(191,160,84,0.1)" strokeWidth="0.5"/>
          </svg>
        </div>
      </div>
    </>
  )
}