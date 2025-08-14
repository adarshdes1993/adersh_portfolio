import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./App.css"; // will hold the luxury dark+gold theme

export default function App() {
  const CV_PATH = "/Adersh_IT_Executive_CV.pdf";
  const PROFILE_PATH = "/profile.jpg";

  const skills = [
    "Azure","AWS","OpenAI API","TensorFlow","React",
    "Node.js","Python","Docker","MySQL","Cybersecurity","Automation"
  ];

  const experiences = [
    {
      role:"IT Executive / AI Developer", company:"Paperlink International Fzco", location:"Dubai, UAE", period:"Present",
      points:[
        "Managed IT infrastructure with 99.9% uptime SLA.",
        "Built AI-driven customer support chatbot — 60% faster responses.",
        "Automated workflows with Python & AI, saving hours weekly."
      ]
    },
    {
      role:"IT Specialist / Developer", company:"World Wide IT", location:"Goa, India", period:"Earlier",
      points:[
        "Developed responsive web apps and analytics dashboards.",
        "Delivered internal automation tools and training."
      ]
    },
    {
      role:"IT Support Engineer", company:"Transerve Technologies Pvt Ltd", location:"Goa, India", period:"Earlier",
      points:[
        "Supported 100+ users; improved reliability and response times."
      ]
    },
  ];

  const projects = [
    { title:"AI Customer Support Chatbot", client:"Paperlink International", description:"OpenAI + Python serverless chatbot that reduced support load and improved SLA.", cover:"/proj-chatbot.jpg" },
    { title:"Operations Dashboard", client:"Internal Tooling", description:"Real-time dashboard combining multiple data sources for operations visibility.", cover:"/proj-dashboard.jpg" }
  ];

  const [theme, setTheme] = useState("dark");
  const [cvExists, setCvExists] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const phrases = useMemo(() => [
    "AI Developer",
    "IT Executive",
    "Full-Stack Engineer",
    "Automation Architect"
  ], []);
  const [typed, setTyped] = useState("");
  const [pi, setPi] = useState(0);
  const [dir, setDir] = useState(1);

  const [active, setActive] = useState("home");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);

    fetch(CV_PATH, { method: "HEAD" }).then(r => setCvExists(r.ok)).catch(()=>{});
    fetch(PROFILE_PATH, { method: "HEAD" }).then(r => setProfileExists(r.ok)).catch(()=>{});
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const target = phrases[pi % phrases.length];
      if (dir === 1) {
        if (typed.length < target.length) setTyped(target.slice(0, typed.length + 1));
        else setTimeout(() => setDir(-1), 800);
      } else {
        if (typed.length > 0) setTyped(target.slice(0, typed.length - 1));
        else { setDir(1); setPi((pi+1) % phrases.length); }
      }
    }, 70);
    return () => clearInterval(id);
  }, [typed, dir, pi, phrases]);

  function toggleTheme(){
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  useEffect(() => {
    const ids = ["home","about","experience","projects","contact"];
    const observers = [];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActive(id);
      }, { rootMargin:"-40% 0px -55% 0px", threshold: 0.1 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  function useMagnet() {
    const ref = useRef(null);
    function onMove(e){
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      el.style.transform = `translate(${x*0.08}px, ${y*0.08}px)`;
    }
    function onLeave(){ if (ref.current) ref.current.style.transform = ""; }
    return { ref, onMove, onLeave };
  }
  const magnetHire = useMagnet();
  const magnetCV = useMagnet();

  function useTilt() {
    const ref = useRef(null);
    function onMove(e){
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -10;
      const ry = (px - 0.5) * 10;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    function onLeave(){ if (ref.current) ref.current.style.transform = ""; }
    return { ref, onMove, onLeave };
  }

  const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="luxury-page">
      <nav className="luxury-topbar">
        <div className="brand">Adersh</div>
        <div className="nav-links">
          {["home","about","experience","projects","contact"].map(id => (
            <a key={id} href={"#"+id} className={active===id ? "active" : ""}>{id}</a>
          ))}
        </div>
        <div className="topbar-right">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </div>
      </nav>

      <main className="container">
        {/* HERO */}
        <section className="hero luxury-card" id="home">
          <div className="hero-left">
            <motion.h1 initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} className="hero-title">
              Adersh Purso Gauns Dessai
            </motion.h1>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} className="hero-sub">
              <span className="muted">I’m a</span> <span className="type">{typed}</span><span className="cursor">|</span>
            </motion.p>

            <motion.div className="hero-ctas" initial="hidden" animate="show" variants={containerVariants}>
              <motion.a variants={itemVariants} className="btn gold"
                href={cvExists ? CV_PATH : "#"}
                {...(cvExists ? { download:true } : { onClick:(e)=>e.preventDefault() })}
                ref={magnetCV.ref} onMouseMove={magnetCV.onMove} onMouseLeave={magnetCV.onLeave}>
                {cvExists ? "Download CV" : "CV Unavailable"}
              </motion.a>

              <motion.a variants={itemVariants} className="btn outline-gold"
                href="mailto:adarshdessai1993@gmail.com?subject=Hiring%20Inquiry"
                ref={magnetHire.ref} onMouseMove={magnetHire.onMove} onMouseLeave={magnetHire.onLeave}>
                Hire Me
              </motion.a>
            </motion.div>

            <motion.ul className="skill-list" initial="hidden" animate="show" variants={containerVariants}>
              {skills.slice(0, 10).map((s) => (
                <motion.li key={s} className="skill" variants={itemVariants}>{s}</motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="hero-right">
            {profileExists ? (
              <motion.img src={PROFILE_PATH} alt="Adersh profile" className="profile-photo"
                loading="lazy" decoding="async"
                initial={{ opacity:0, scale:.9 }} whileInView={{ opacity:1, scale:1 }} />
            ) : (
              <div className="profile-placeholder"><div className="silhouette">A</div></div>
            )}
          </div>
        </section>

        {/* About */}
        <section className="luxury-card" id="about">
          <h2>About</h2>
          <p className="muted">
            Innovative IT Executive with 6 years of experience across India and the UAE.
            I design secure, scalable infrastructure and build AI-first automation.
          </p>
        </section>

        {/* Experience */}
        <section className="luxury-card" id="experience">
          <h2>Experience</h2>
          {experiences.map((exp, i) => (
            <div key={i} className="timeline-item">
              <strong>{exp.role}</strong> — {exp.company} ({exp.location})
              <ul>{exp.points.map((p,j)=><li key={j}>{p}</li>)}</ul>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="luxury-card" id="projects">
          <h2>Projects</h2>
          <div className="project-grid">
            {projects.map((p, i) => {
              const tilt = useTilt();
              return (
                <article key={i} className="project" ref={tilt.ref} onMouseMove={tilt.onMove} onMouseLeave={tilt.onLeave}>
                  {p.cover && <img src={p.cover} alt={p.title} className="project-cover" />}
                  <div>
                    <h3>{p.title}</h3>
                    <p className="muted">{p.client}</p>
                    <p>{p.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Contact */}
        <section className="luxury-card" id="contact">
          <h2>Contact</h2>
          <a className="btn gold" href="mailto:adarshdessai1993@gmail.com">Email</a>
        </section>
      </main>
    </div>
  );
}
