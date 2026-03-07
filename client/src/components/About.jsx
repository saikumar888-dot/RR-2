import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/About.css"

/* ─────────────────────────────────────────────
   APEX — ABOUT PAGE
   Aesthetic: Ultra-luxury dark editorial
   Fonts: Cormorant Garamond + DM Sans + DM Mono
────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: '📊',
    title: 'Centralized Dashboard',
    desc: 'Unified interface bringing together critical business metrics for complete financial visibility.',
    gradient: 'linear-gradient(135deg, rgba(191,160,84,0.15), rgba(191,160,84,0.05))'
  },
  {
    icon: '⚡',
    title: 'Real-Time Revenue Insights',
    desc: 'Live visibility into revenue trends, identifying growth opportunities and risks instantly.',
    gradient: 'linear-gradient(135deg, rgba(100,160,220,0.15), rgba(100,160,220,0.05))'
  },
  {
    icon: '📈',
    title: 'Advanced Data Visualization',
    desc: 'Interactive charts and graphs transforming complex data into clear, actionable insights.',
    gradient: 'linear-gradient(135deg, rgba(120,200,140,0.15), rgba(120,200,140,0.05))'
  },
  {
    icon: '🔒',
    title: 'Secure Data Management',
    desc: 'Enterprise-grade security protecting organizational data through modern authentication.',
    gradient: 'linear-gradient(135deg, rgba(180,120,200,0.15), rgba(180,120,200,0.05))'
  },
  {
    icon: '⚙️',
    title: 'Scalable Platform',
    desc: 'Engineered to support organizations from startups to large enterprises seamlessly.',
    gradient: 'linear-gradient(135deg, rgba(220,140,100,0.15), rgba(220,140,100,0.05))'
  },
  {
    icon: '🎯',
    title: 'Strategic Decision Support',
    desc: 'Data-driven insights enabling faster decision-making and strategic planning.',
    gradient: 'linear-gradient(135deg, rgba(200,180,100,0.15), rgba(200,180,100,0.05))'
  }
]

export default function About() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)
  const [mouseX, setMouseX] = useState(0.5)
  const [mouseY, setMouseY] = useState(0.5)
  const rafRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const lerpRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200)
    const t2 = setTimeout(() => setPhase(2), 800)
    const t3 = setTimeout(() => setPhase(3), 1400)
    const t4 = setTimeout(() => setPhase(4), 2000)
    return () => [t1,t2,t3,t4].forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const onMove = (e) => { 
      mouseRef.current = { 
        x: e.clientX/window.innerWidth, 
        y: e.clientY/window.innerHeight 
      } 
    }
    window.addEventListener('mousemove', onMove)
    const loop = () => {
      lerpRef.current.x += (mouseRef.current.x - lerpRef.current.x) * 0.05
      lerpRef.current.y += (mouseRef.current.y - lerpRef.current.y) * 0.05
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

  const px = (mouseX - 0.5) * 30
  const py = (mouseY - 0.5) * 15
  const v = (p) => phase >= p

  return (
    <>
      <div className="page about-page">
        <div className="bg-radial" />
        <div className="bg-grid" />
        <div className="bg-vignette" />

        <nav className={`nav ${v(1)?'in':''}`}>
          <div className="nav-brand">
            <div className="brand-mark">R</div>RevenueRadar
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={()=>navigate('/')}>Home</button>
            <button className="nav-link nav-link-active">About</button>
            <button className="nav-link" onClick={() => navigate('/registerorg')}>Organization</button>
          </div>
          <div className="nav-actions">
            <button className="nbtn nbtn-ghost" onClick={()=>navigate('/login')}>Sign In</button>
            <button className="nbtn nbtn-solid" onClick={()=>navigate('/registerorg')}>Get Started</button>
          </div>
        </nav>

        <main className="about-hero">
          <div className={`about-header ${v(2)?'in':''}`}>
            <div className="eyebrow-pill" style={{marginBottom: 24}}>Our Story</div>
            <h1 className="about-title">
              Built for Leaders Who<br/>
              Demand <span className="headline-gold">Clarity.</span>
            </h1>
            <p className="about-subtitle">
              RevenueRadar transforms scattered business data into unified intelligence,
              empowering executives to make confident decisions with real-time precision.
            </p>
          </div>

          <div className={`mission-section ${v(2)?'in':''}`}>
            <div className="section-label">
              <div className="slabel-line"/>
              <span>Our Mission</span>
            </div>
            <div className="mission-content">
              <div className="mission-text">
                <h2 className="section-heading">
                  Transforming Data Into<br/>Strategic Advantage
                </h2>
                <p className="body-text" style={{marginBottom: 20}}>
                  Our mission is to help organizations understand their revenue performance 
                  with clarity and precision. In today's fast-paced business environment, 
                  leaders can't afford to operate in the dark.
                </p>
                <p className="body-text">
                  RevenueRadar empowers decision-makers to transform raw data into meaningful 
                  insights that support smarter decisions, sustainable growth, and improved 
                  organizational performance across every department.
                </p>
              </div>
              <div className="mission-visual">
                <div className="stat-card" style={{animationDelay: '0.1s'}}>
                  <div className="stat-icon">📊</div>
                  <div className="stat-value">Real-Time</div>
                  <div className="stat-label">Intelligence</div>
                </div>
                <div className="stat-card" style={{animationDelay: '0.2s'}}>
                  <div className="stat-icon">⚡</div>
                  <div className="stat-value">Instant</div>
                  <div className="stat-label">Insights</div>
                </div>
                <div className="stat-card" style={{animationDelay: '0.3s'}}>
                  <div className="stat-icon">🎯</div>
                  <div className="stat-value">Strategic</div>
                  <div className="stat-label">Decisions</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`features-section ${v(3)?'in':''}`}>
            <div className="section-label">
              <div className="slabel-line"/>
              <span>Key Features</span>
            </div>
            <h2 className="section-heading" style={{marginBottom: 48}}>
              Everything You Need to<br/>Command Your Empire
            </h2>
            <div className="features-grid">
              {FEATURES.map((feat, i) => (
                <div 
                  key={i} 
                  className="feature-card"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    background: feat.gradient
                  }}
                >
                  <div className="feat-icon">{feat.icon}</div>
                  <h3 className="feat-title">{feat.title}</h3>
                  <p className="feat-desc">{feat.desc}</p>
                  <div className="feat-shine"/>
                </div>
              ))}
            </div>
          </div>

          <div className={`why-section ${v(3)?'in':''}`}>
            <div className="why-grid">
              <div className="why-left">
                <div className="section-label">
                  <div className="slabel-line"/>
                  <span>Why RevenueRadar</span>
                </div>
                <h2 className="section-heading">
                  From Data Confusion<br/>to Revenue <span className="headline-gold">Clarity</span>
                </h2>
              </div>
              <div className="why-right">
                <div className="why-card">
                  <div className="why-number">01</div>
                  <h3 className="why-title">Scattered Data Problem</h3>
                  <p className="why-text">
                    Critical business data trapped across multiple systems makes it impossible 
                    for leaders to quickly understand company performance.
                  </p>
                </div>
                <div className="why-card">
                  <div className="why-number">02</div>
                  <h3 className="why-title">Unified Intelligence</h3>
                  <p className="why-text">
                    RevenueRadar consolidates metrics into a single powerful dashboard, 
                    providing the complete financial and operational picture instantly.
                  </p>
                </div>
                <div className="why-card">
                  <div className="why-number">03</div>
                  <h3 className="why-title">Competitive Advantage</h3>
                  <p className="why-text">
                    Faster decision-making and strategic planning powered by accurate, 
                    real-time insights keep organizations ahead of the competition.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`vision-section ${v(4)?'in':''}`}>
            <div className="vision-glow" style={{
              transform: `translate(${px*2}px, ${py*2}px)`
            }}/>
            <div className="vision-content">
              <div className="section-label">
                <div className="slabel-line"/>
                <span>Our Vision</span>
              </div>
              <h2 className="section-heading" style={{marginBottom: 24}}>
                Next-Generation Revenue<br/>Intelligence Platform
              </h2>
              <p className="body-text" style={{maxWidth: 680, margin: '0 auto 40px'}}>
                We're building the future of business intelligence — a platform where monitoring, 
                analyzing, and optimizing financial performance happens in real time, with 
                unprecedented clarity and precision.
              </p>
              <div className="vision-ctas">
                <button className="cta-p" onClick={()=>navigate('/registerorg')}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Get Started Today
                </button>
                
              </div>
            </div>
          </div>
        </main>

        <div className="scene">
          <svg className={`city-svg ${v(1)?'in':''}`} viewBox="0 0 1440 260"
            preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#161C2A"/><stop offset="100%" stopColor="#0C1018"/>
              </linearGradient>
              <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1C2336"/><stop offset="100%" stopColor="#0C1018"/>
              </linearGradient>
              <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#12181E"/><stop offset="100%" stopColor="#060810"/>
              </linearGradient>
            </defs>

            {[[0,55,130],[60,38,105],[102,68,165],[174,34,120],[212,52,148],[268,44,138],
              [316,76,178],[396,38,118],[436,62,158],[502,48,144],[554,72,172],[628,43,132],
              [676,58,156],[738,82,188],[824,48,140],[876,66,164],[946,52,150],[1002,78,183],
              [1084,42,130],[1132,62,158],[1200,70,172],[1276,52,146],[1336,38,112]
            ].map(([x,w,h],i)=>(
              <rect key={'b'+i} x={x} y={260-h} width={w} height={h} fill="url(#bg1)" opacity="0.55"/>
            ))}

            {[[8,62,148],[76,48,124],[128,72,162],[204,58,138],[266,86,176],[356,52,128],
              [412,68,152],[484,62,147],[550,76,166],[630,52,132],[686,72,157],[762,88,186],
              [854,58,142],[916,76,166],[996,62,152],[1062,82,176],[1148,52,132],[1206,72,160],
              [1284,88,172]
            ].map(([x,w,h],i)=>(
              <rect key={'m'+i} x={x} y={260-h} width={w} height={h} fill="url(#bg2)" opacity="0.88"/>
            ))}

            {Array.from({length:100},(_,i)=>{
              const wx=10+(i*89)%1420, wy=15+(i*61)%220
              return <rect key={'w'+i} x={wx} y={wy} width={3.5} height={5.5}
                fill={i%9===0?'#BFA054':i%5===0?'#C8D8F0':'#E8EFF8'}
                opacity={0.07+(i%6)*0.05} rx="0.4"/>
            })}

            {[[402,178,220],[760,186,230],[1064,176,216]].map(([x,h,t],i)=>(
              <g key={'ant'+i}>
                <line x1={x} y1={260-h} x2={x} y2={260-t} stroke="#BFA054" strokeWidth="0.8" opacity="0.25"/>
                <circle cx={x} cy={260-t} r="1.2" fill="#BFA054" opacity="0.3"/>
              </g>
            ))}

            <rect x="0" y="240" width="1440" height="20" fill="url(#road)"/>
            <line x1="0" y1="241.5" x2="1440" y2="241.5" stroke="rgba(191,160,84,0.2)" strokeWidth="0.5"/>
            {Array.from({length:22},(_,i)=>(
              <rect key={'d'+i} x={i*65+10} y="249" width="40" height="1.5" rx="0.75"
                fill="rgba(255,255,255,0.055)"/>
            ))}
          </svg>
          <div className="ground-line"/>
        </div>

        <footer className={`about-footer ${v(4)?'in':''}`}>
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-mark">A</div>
              <span>RevenueRadar</span>
            </div>
            <div className="footer-text">
              Built for executives who demand real-time clarity.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}