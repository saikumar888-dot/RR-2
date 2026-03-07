import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import axios from 'axios';

/* ─────────────────────────────────────────────
   RevenueRadar — LOGIN PAGE
   Aesthetic: Ultra-luxury dark editorial
   Fonts: Cormorant Garamond + DM Sans + DM Mono
   Mirrors the exact visual language of HomePage
────────────────────────────────────────────── */

export default function Login() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const [mouseX, setMouseX] = useState(0.5)
  const [mouseY, setMouseY] = useState(0.5)

  const rafRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const lerpRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 500)
    const t3 = setTimeout(() => setPhase(3), 850)
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

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: email,
        password: password
      },
      {
        withCredentials: true // required if backend sends cookies
      }
    )

      const data = response.data

      if(data.token) {
        localStorage.setItem("token", data.token)
      }

      window.dispatchEvent(
        new CustomEvent("flash" , {
          detail: {
            type: "success",
            message: "Login Successfull"
          }
        })
      )

      console.log(data.user.role)

      if(data.user.role === "CEO") {
        navigate("/dashboard")
      }

      if(data.user.role === "ADMIN") {
        navigate("/admin-panel")
      }

      if(data.user.role === "HOD") {
        navigate("/headofdepartmentpage")
      }
      
    } catch (error) {
        const message =
          error.response?.data?.message || "Login failed"

        setError(message)

        // Error flashcard
        window.dispatchEvent(
          new CustomEvent("flash", {
            detail: {
            type: "error",
            message: message
          }
        })
      )
    }
    finally {
      setLoading(false)
    }
  }

  const v = (p) => phase >= p
  const px = (mouseX - 0.5) * 22
  const py = (mouseY - 0.5) * 12

  return (
    <>
      <div className="lp">

        <div className="lp-bg-radial"/>
        <div className="lp-bg-grid"/>
        <div className="lp-bg-vignette"/>

        {/* LEFT PANEL */}
        <div className="lp-left">

          <div className="lp-left-glow"/>

          <div className="lp-lines">
            <div className="lp-line" style={{top:'28%'}}/>
            <div className="lp-line" style={{top:'62%'}}/>
            <div className="lp-line-v" style={{left:'35%'}}/>
          </div>

          <div className="lp-orb lp-orb-1"/>
          <div className="lp-orb lp-orb-2"/>

          <div className={`lp-brand ${v(1)?'in':''}`} onClick={()=>navigate('/')}>
            <div className="lp-brand-mark">R</div>
            <div className="lp-brand-name">RevenueRadar</div>
          </div>

          <div className="lp-center">

            <h2 className={`lp-tagline ${v(2)?'in':''}`}>
              Your empire<br/>awaits <span className="lp-tagline-em">your<br/>command.</span>
            </h2>

            <p className={`lp-desc ${v(2)?'in':''}`}>
              Thousands of executives trust RevenueRadar to surface what matters — before it matters.
              Sign in to resume your command center.
            </p>

            <div className={`lp-stats ${v(3)?'in':''}`}>
              {[
                { lbl: 'Organizations', val: '3,200+', delta: '↑ 18% this quarter' },
                { lbl: 'Decisions Powered', val: '1.4M', delta: '↑ Daily' },
                { lbl: 'Platform Uptime', val: '99.99%', delta: 'Enterprise SLA' },
              ].map((s,i) => (
                <div className="lp-stat" key={i}>
                  <div>
                    <div className="lp-stat-lbl">{s.lbl}</div>
                    <div className="lp-stat-val">{s.val}</div>
                  </div>
                  <div className="lp-stat-delta">{s.delta}</div>
                </div>
              ))}
            </div>

          </div>

          <div className={`lp-testimonial ${v(3)?'in':''}`}>
            <div className="lp-quote">
              "RevenueRadar eliminated three weekly reporting meetings. Our board now has answers before they form questions."
            </div>

            <div className="lp-quoter">
              <div className="lp-quoter-av">SR</div>
              <div>
                <div className="lp-quoter-name">Sarah Renault</div>
                <div className="lp-quoter-role">CEO · Meridian Capital Group</div>
              </div>
            </div>
          </div>

        </div>


        {/* RIGHT PANEL */}
        <div className="lp-right">

          <div
            className={`lp-card ${v(2)?'in':''}`}
            style={{
              transform: v(2)
                ? `perspective(900px) rotateY(${px * 0.03}deg) rotateX(${py * 0.02}deg) translateY(0px)`
                : 'translateY(28px)',
              transition: 'opacity 0.9s ease 0.2s, box-shadow 0.3s, transform 0.9s ease 0.2s'
            }}
          >

            <div className="lp-card-top">

              <div className="lp-card-eyebrow">
                <div className="lp-card-pill">Executive Access</div>

                <div className="lp-card-live">
                  <div className="lp-card-dot"/>
                  <span className="lp-card-live-lbl">Secure Session</span>
                </div>

              </div>

              <h1 className="lp-card-h">
                Welcome <strong>back.</strong>
              </h1>

              <p className="lp-card-sub">
                Sign in to your dashboard and resume where you left off.
              </p>

            </div>


            {/* Form */}
            <form className="lp-form" onSubmit={handleSubmit} noValidate>

              <div className="lp-field">
                <label className="lp-label">Work Email</label>

                <div className="lp-input-wrap">

                  <div className={`lp-input-icon ${focusedField==='email'?'active':''}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M1 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>

                  <input
                    className={`lp-input ${error?'has-error':''}`}
                    type="email"
                    placeholder="richard@meridian.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={()=>setFocusedField('email')}
                    onBlur={()=>setFocusedField(null)}
                    autoComplete="email"
                  />

                </div>
              </div>


              <div className="lp-field">

                <label className="lp-label">
                  Password
                  <span className="lp-label-link">Forgot password?</span>
                </label>

                <div className="lp-input-wrap">

                  <div className={`lp-input-icon ${focusedField==='password'?'active':''}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M4.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>

                  <input
                    className={`lp-input ${error?'has-error':''}`}
                    type={showPass?'text':'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={()=>setFocusedField('password')}
                    onBlur={()=>setFocusedField(null)}
                    autoComplete="current-password"
                    style={{paddingRight:'38px'}}
                  />

                  <div className="lp-input-right" onClick={()=>setShowPass(!showPass)}>
                    {showPass ? 'Hide' : 'Show'}
                  </div>

                </div>

              </div>


              {error && (
                <div className="lp-error">
                  {error}
                </div>
              )}

              <button className="lp-submit" type="submit" disabled={loading}>
                {loading ? 'Authenticating…' : 'Access Dashboard'}
              </button>

            </form>


            <div className="lp-footer">

              <div className="lp-register">
                Don't have an Account ?{' '}
                <span className="lp-reg-link" onClick={()=>navigate('/register')}>
                  Register
                </span>
              </div>

              <div className="lp-secure">
                256-bit SSL · SOC 2 Type II · GDPR Compliant
              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  )
}