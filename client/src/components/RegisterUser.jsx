import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Register.css'
/* ─────────────────────────────────────────────
   RevenueRadar — REGISTER PAGE
   Aesthetic: Ultra-luxury dark editorial
   Fonts: Cormorant Garamond + DM Sans + DM Mono
────────────────────────────────────────────── */

export default function Register() {
  const navigate = useNavigate()

  const [phase, setPhase] = useState(0)
  const [step, setStep] = useState(1) // 1 = personal, 2 = security
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agree, setAgree] = useState(false)

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
      setMouseX(lerpRef.current.x)
      setMouseY(lerpRef.current.y)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [])

  const pwStrength = (pw) => {
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
  }
  const strength = pwStrength(password)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#E05252', '#E2A84C', '#3DBA7E', '#3DBA7E'][strength]

  const handleStep1 = (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter your full name.')
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.')
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password) return setError('Please enter a password.')
    if (strength < 2) return setError('Password is too weak. Add uppercase, numbers, or symbols.')
    if (password !== confirm) return setError('Passwords do not match.')
    if (!agree) return setError('Please accept the Terms of Service to continue.')
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    navigate('/home');
  }

  const v = (p) => phase >= p
  const px = (mouseX - 0.5) * 18
  const py = (mouseY - 0.5) * 10

  return (
    <>
      <div className="rp">
        <div className="rp-bg-radial"/><div className="rp-bg-grid"/><div className="rp-bg-vignette"/>

        {/* ── LEFT PANEL ── */}
        <div className="rp-left">
          <div className="rp-left-glow"/>
          <div className="rp-orb rp-orb-1"/><div className="rp-orb rp-orb-2"/>

          <div className={`rp-brand ${v(1)?'in':''}`} onClick={()=>navigate('/')}>
            <div className="rp-brand-mark">R</div>
            <div className="rp-brand-name">RevenueRadar</div>
          </div>

          <div className="rp-center">
            <h2 className={`rp-tagline ${v(2)?'in':''}`}>
              Your seat at the<br/>table starts <span className="rp-tagline-em">here.</span>
            </h2>
            <p className={`rp-desc ${v(2)?'in':''}`}>
              Join 3,200+ executives using RevenueRadar to command their organizations with unprecedented clarity.
              Set up takes under 3 minutes.
            </p>

            <div className={`rp-benefits ${v(3)?'in':''}`}>
              {[
                { ico:'⚡', cls:'rp-benefit-ico-g', ttl:'Instant Onboarding', sub:'Live dashboard in under 3 minutes. Zero technical setup required.' },
                { ico:'🔒', cls:'rp-benefit-ico-b', ttl:'Enterprise Security', sub:'SOC 2 Type II certified. End-to-end encryption. 99.99% uptime SLA.' },
                { ico:'📊', cls:'rp-benefit-ico-gr', ttl:'Board-Ready Insights', sub:'Auto-generated reports that impress investors and close decisions.' },
              ].map((b,i)=>(
                <div className="rp-benefit" key={i}>
                  <div className={`rp-benefit-ico ${b.cls}`}>{b.ico}</div>
                  <div>
                    <div className="rp-benefit-ttl">{b.ttl}</div>
                    <div className="rp-benefit-sub">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rp-proof ${v(3)?'in':''}`}>
            <div className="rp-proof-avs">
              {['SR','MK','JL','AT','RC'].map((a,i)=>(
                <div key={i} className="rp-proof-av" style={{background:`linear-gradient(135deg,hsl(${42+i*18},70%,45%),hsl(${42+i*18},50%,28%))`}}>{a}</div>
              ))}
            </div>
            <div className="rp-proof-txt">
              <span className="rp-proof-num">3,200+</span> executives onboarded<br/>
              <span style={{fontSize:9}}>⭐⭐⭐⭐⭐ Rated 4.9 / 5 across 800+ reviews</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="rp-right">
          <div
            className={`rp-card ${v(2)?'in':''}`}
            style={{
              transform: v(2)
                ? `perspective(900px) rotateY(${px*0.025}deg) rotateX(${py*0.015}deg)`
                : 'translateY(28px)'
            }}
          >
            {/* Progress */}
            <div className="rp-progress">
              {[
                { n:1, lbl:'Account' },
                { n:2, lbl:'Security' },
              ].map((s,i)=>(
                <React.Fragment key={i}>
                  {i > 0 && (
                    <div className={`rp-step-line ${step > s.n-1 ? 'rp-step-line-done' : ''}`}/>
                  )}
                  <div className="rp-step" onClick={()=>{ if(s.n < step) setStep(s.n) }}>
                    <div className={`rp-step-num ${step===s.n?'rp-step-num-active':step>s.n?'rp-step-num-done':'rp-step-num-idle'}`}>
                      {step > s.n ? '✓' : s.n}
                    </div>
                    <span className={`rp-step-lbl ${step===s.n?'rp-step-lbl-active':step>s.n?'rp-step-lbl-done':'rp-step-lbl-idle'}`}>
                      {s.lbl}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <div className="rp-card-eyebrow">
                  <div className="rp-card-pill">New Member</div>
                  <span className="rp-step-badge">Step 1 of 2</span>
                </div>
                <h1 className="rp-card-h">Create your <strong>account.</strong></h1>
                <p className="rp-card-sub">Start with your personal details. You'll set up your organization next.</p>

                <form className="rp-form" onSubmit={handleStep1} noValidate>
                  <div className="rp-field">
                    <label className="rp-label">Full Name</label>
                    <div className="rp-input-wrap">
                      <div className={`rp-input-icon ${focusedField==='name'?'active':''}`}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="4.5" r="2.8" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M1.5 12.5C1.5 10.015 4.01 8 7 8s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <input className={`rp-input ${error?'err':''}`} type="text"
                        placeholder="Richard Caldwell"
                        value={name} onChange={e=>setName(e.target.value)}
                        onFocus={()=>setFocusedField('name')} onBlur={()=>setFocusedField(null)}
                        autoComplete="name"/>
                    </div>
                  </div>

                  <div className="rp-field">
                    <label className="rp-label">Work Email</label>
                    <div className="rp-input-wrap">
                      <div className={`rp-input-icon ${focusedField==='email'?'active':''}`}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M1 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <input className={`rp-input ${error?'err':''}`} type="email"
                        placeholder="richard@meridian.com"
                        value={email} onChange={e=>setEmail(e.target.value)}
                        onFocus={()=>setFocusedField('email')} onBlur={()=>setFocusedField(null)}
                        autoComplete="email"/>
                    </div>
                  </div>

                  {error && (
                    <div className="rp-error">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="#E88888" strokeWidth="1.2"/><path d="M6.5 4v3M6.5 9h.01" stroke="#E88888" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      {error}
                    </div>
                  )}

                  <button className="rp-submit" type="submit">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Continue to Security
                  </button>
                </form>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <button className="rp-back" onClick={()=>{setStep(1);setError('')}}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 6.5H2M5 2.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Back
                </button>
                <div className="rp-card-eyebrow">
                  <div className="rp-card-pill">Secure Access</div>
                  <span className="rp-step-badge">Step 2 of 2</span>
                </div>
                <h1 className="rp-card-h">Secure your <strong>account.</strong></h1>
                <p className="rp-card-sub">Create a strong password to protect your executive dashboard.</p>

                <form className="rp-form" onSubmit={handleSubmit} noValidate>
                  <div className="rp-field">
                    <label className="rp-label">Password</label>
                    <div className="rp-input-wrap">
                      <div className={`rp-input-icon ${focusedField==='pw'?'active':''}`}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      </div>
                      <input className={`rp-input ${error?'err':''}`}
                        type={showPass?'text':'password'}
                        placeholder="Create a strong password"
                        value={password} onChange={e=>setPassword(e.target.value)}
                        onFocus={()=>setFocusedField('pw')} onBlur={()=>setFocusedField(null)}
                        autoComplete="new-password" style={{paddingRight:38}}/>
                      <div className="rp-input-right" onClick={()=>setShowPass(!showPass)}>
                        {showPass
                          ? <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 7.5C2 7.5 4 3 7.5 3S13 7.5 13 7.5 11 12 7.5 12 2 7.5 2 7.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/><line x1="2" y1="2" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                          : <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 7.5C2 7.5 4 3 7.5 3S13 7.5 13 7.5 11 12 7.5 12 2 7.5 2 7.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/></svg>
                        }
                      </div>
                    </div>
                    {password.length > 0 && (
                      <div className="rp-strength-row">
                        <div className="rp-strength-bars">
                          {[1,2,3,4].map(i=>(
                            <div key={i} className={`rp-str ${strength>=i?'lit':''}`}
                              style={strength>=i?{background:strengthColor}:{}}/>
                          ))}
                        </div>
                        <span className="rp-str-lbl" style={{color:strengthColor}}>{strengthLabel}</span>
                      </div>
                    )}
                  </div>

                  <div className="rp-field">
                    <label className="rp-label">Confirm Password</label>
                    <div className="rp-input-wrap">
                      <div className={`rp-input-icon ${focusedField==='cf'?'active':''}`}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5 9.5l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <input className={`rp-input ${error&&password!==confirm?'err':''}`}
                        type={showConfirm?'text':'password'}
                        placeholder="Repeat your password"
                        value={confirm} onChange={e=>setConfirm(e.target.value)}
                        onFocus={()=>setFocusedField('cf')} onBlur={()=>setFocusedField(null)}
                        autoComplete="new-password" style={{paddingRight:38}}/>
                      <div className="rp-input-right" onClick={()=>setShowConfirm(!showConfirm)}>
                        {showConfirm
                          ? <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 7.5C2 7.5 4 3 7.5 3S13 7.5 13 7.5 11 12 7.5 12 2 7.5 2 7.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/><line x1="2" y1="2" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                          : <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 7.5C2 7.5 4 3 7.5 3S13 7.5 13 7.5 11 12 7.5 12 2 7.5 2 7.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/></svg>
                        }
                      </div>
                    </div>
                    {confirm.length > 0 && password === confirm && (
                      <div style={{display:'flex',alignItems:'center',gap:5,marginTop:5,fontSize:10,color:'var(--green)'}}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="5" stroke="currentColor" strokeWidth="1.1"/><path d="M3 5.5l1.8 1.8 2.8-2.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Passwords match
                      </div>
                    )}
                  </div>

                  <div className="rp-agree" onClick={()=>setAgree(!agree)}>
                    <div className={`rp-checkbox ${agree?'checked':''}`}>
                      {agree && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke="#BFA054" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div className="rp-agree-txt">
                      I agree to the <span className="rp-link">Terms of Service</span> and <span className="rp-link">Privacy Policy</span>.
                      I confirm I am authorized to create an account on behalf of my organization.
                    </div>
                  </div>

                  {error && (
                    <div className="rp-error">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="#E88888" strokeWidth="1.2"/><path d="M6.5 4v3M6.5 9h.01" stroke="#E88888" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      {error}
                    </div>
                  )}

                  <button className="rp-submit" type="submit" disabled={loading}>
                    {loading ? (
                      <><div className="rp-spinner"/>Creating Account…</>
                    ) : (
                      <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>Create Account</>
                    )}
                  </button>
                </form>
              </>
            )}

            <div className="rp-footer">
              <div className="rp-login">
                Already have an account?{' '}
                <span className="rp-login-link" onClick={()=>navigate('/login')}>Sign in →</span>
              </div>
              <div className="rp-secure">
                <div className="rp-secure-dot"/>
                256-bit SSL · SOC 2 Type II · GDPR Compliant
              </div>
            </div>
          </div>
        </div>

        {/* Scene */}
        <div className={`rp-scene ${v(1)?'in':''}`}>
          <svg viewBox="0 0 1440 130" preserveAspectRatio="xMidYMax meet"
            style={{position:'absolute',bottom:0,left:0,width:'100%',height:'100%'}}>
            <defs>
              <linearGradient id="rsb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111827"/><stop offset="100%" stopColor="#060810"/>
              </linearGradient>
            </defs>
            {[[0,40,58],[48,30,44],[85,52,78],[148,25,40],[186,38,62],[248,33,55],
              [285,58,88],[362,28,46],[398,48,72],[460,36,60],[520,54,84],[592,32,52],
              [630,43,68],[688,62,98],[762,36,60],[820,50,78],[884,38,64],[942,58,90],
              [1020,30,50],[1064,48,76],[1124,53,84],[1192,38,62],[1250,28,46],[1320,44,70]
            ].map(([x,w,h],i)=>(
              <rect key={i} x={x} y={130-h} width={w} height={h} fill="url(#rsb)" opacity="0.65"/>
            ))}
            {Array.from({length:48},(_,i)=>{
              const wx=8+(i*101)%1428, wy=6+(i*57)%105
              return <rect key={'rw'+i} x={wx} y={wy} width={2.8} height={4} fill={i%6===0?'#BFA054':'#E0E8F0'} opacity={0.03+(i%5)*0.04} rx="0.3"/>
            })}
            <rect x="0" y="120" width="1440" height="10" fill="#080C14"/>
            <line x1="0" y1="120.5" x2="1440" y2="120.5" stroke="rgba(191,160,84,0.12)" strokeWidth="0.5"/>
          </svg>
        </div>
      </div>
    </>
  )
}