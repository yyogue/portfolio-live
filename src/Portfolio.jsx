// Portfolio.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpCircle,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Moon,
  Sun,
  GitHub,
  Linkedin,
  Code,
  Globe,
  ChevronRight,
  X,
  Menu
} from "lucide-react";
import "./Portfolio.css";

// Dark mode hook
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true" || false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode];
};

// Particle background component
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
        ctx.fill();

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          particle.x -= Math.cos(angle) * 0.5;
          particle.y -= Math.sin(angle) * 0.5;
        }

        // Boundary checking
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      // Connect particles
      particles.forEach((particleA, i) => {
        particles.slice(i + 1).forEach((particleB) => {
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${
              0.1 * (1 - distance / 100)
            })`;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    resizeCanvas();
    drawParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

// Modern Portfolio Component
const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useDarkMode();
  const [currentProject, setCurrentProject] = useState(null);

  // Custom cursor
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current && cursorDotRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;

        // Delayed dot for trailing effect
        setTimeout(() => {
          cursorDotRef.current.style.left = `${e.clientX}px`;
          cursorDotRef.current.style.top = `${e.clientY}px`;
        }, 80);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      const sections = [
        "home",
        "about",
        "experience",
        "projects",
        "education",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Project data
  const projects = [
    {
      id: 1,
      title: "Congondaku.com",
      description:
        "Real estate platform with localized African payment solutions (Orange Money). Built with React, Node.js, MongoDB, and AWS services.",
      longDescription:
        "This real estate platform was designed specifically for the African market, incorporating local payment methods like Orange Money. The frontend was built with React.js, creating a responsive and intuitive user interface. The backend utilizes Node.js with Express, connected to MongoDB for flexible data storage. Images are stored in AWS S3 buckets for efficient delivery, and the entire application is deployed using AWS Amplify for the frontend and Render for the backend services. The CI/CD pipeline ensures smooth updates with every commit.",
      tags: [
        "React.js",
        "Node.js",
        "MongoDB",
        "AWS S3",
        "AWS Amplify",
        "Render",
      ],
      image: "/api/placeholder/600/400",
      // github: "https://github.com/yyogue/congondaku",
      live: "https://congondaku.com",
      featured: true,
    },
    {
      id: 2,
      title: "Employee Management System",
      description:
        "Full-stack system for employee management using React.js, Node.js, and MongoDB.",
      longDescription:
        "This comprehensive employee management system provides tools for HR departments to track employee data, attendance, performance reviews, and more. The React frontend delivers an intuitive dashboard with data visualization components, while the Node.js backend provides a robust API layer. MongoDB stores employee records in a flexible schema that can adapt to different organizational structures. Authentication and authorization are handled with JSON Web Tokens for secure access control.",
      tags: ["React.js", "Node.js", "MongoDB", "Express.js"],
      image: "/api/placeholder/600/400",
      github: "https://github.com/yyogue/employee-management-system",
      featured: false,
    },
    {
      id: 3,
      title: "Youssouf Store",
      description: "E-commerce platform built with modern web technologies.",
      longDescription:
        "A complete e-commerce solution featuring product listings, shopping cart functionality, user accounts, and order processing. The frontend utilizes React.js with Redux for state management, creating a seamless shopping experience. The Node.js backend handles product data, user authentication, and order processing. MongoDB stores flexible product data with rich attributes and categories. The responsive design ensures a consistent experience across desktop and mobile devices.",
      tags: ["React.js", "Node.js", "MongoDB", "Redux"],
      image: "/api/placeholder/600/400",
      github: "https://github.com/yyogue/youssouf-store",
      live: "http://youssoufstore.com",
      featured: false,
    },
    {
      id: 4,
      title: "Hackathon App",
      description: "Application built during a hackathon event.",
      longDescription:
        "This application was developed during a 48-hour hackathon event, showcasing rapid prototyping and problem-solving skills. The app provides a platform for tracking health metrics and providing personalized wellness recommendations. It features Firebase integration for real-time data synchronization and user authentication. The React frontend includes data visualization components to help users understand their health trends over time.",
      tags: ["React.js", "Firebase", "API Integration"],
      image: "/api/placeholder/600/400",
      github: "https://github.com/yyogue/hackathon-app",
      live: "https://hackathon-prudential.netlify.app",
      featured: false,
    },
  ];

  return (
    <div
      className={`portfolio-container ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* Custom cursor */}
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-dot" ref={cursorDotRef}></div>

      {/* Background particles */}
      <ParticleBackground />

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <motion.div
              className="logo"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              YY
            </motion.div>

            <div className="nav-links-container">
              <div className="desktop-menu">
                {[
                  "home",
                  "about",
                  "experience",
                  "projects",
                  "education",
                  "contact",
                ].map((item, index) => (
                  <motion.button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`nav-link ${
                      activeSection === item ? "active" : ""
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>

              <motion.button
                className="theme-toggle"
                onClick={() => setIsDarkMode(!isDarkMode)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              <motion.button
                className="mobile-menu-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="mobile-menu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {[
                  "home",
                  "about",
                  "experience",
                  "projects",
                  "education",
                  "contact",
                ].map((item) => (
                  <motion.button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`mobile-nav-link ${
                      activeSection === item ? "active" : ""
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="container">
            <div className="hero-content">
              <motion.div
                className="hero-text"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="hero-title">Youssouf Yogue</h1>
                <h2 className="hero-subtitle">Full-Stack Software Engineer</h2>
                <p className="hero-description">
                  Building meaningful software that solves real-world problems
                  with React, Node.js, and cloud technologies.
                </p>
                <div className="hero-buttons">
                  <motion.button
                    onClick={() => scrollToSection("contact")}
                    className="primary-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Me
                  </motion.button>
                  <motion.button
                    onClick={() => scrollToSection("projects")}
                    className="secondary-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Projects
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                className="hero-image"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="avatar-container">
                  <div className="avatar-content">YY</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="container">
            <SectionHeader title="About Me" />

            <motion.div
              className="about-content"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="about-text">
                <p>
                  Dedicated Full-Stack Software Engineer and Cloud Computing
                  student at Purdue University with a passion for building
                  meaningful software that solves real-world problems. Skilled
                  in React.js, Node.js, and Java with growing expertise in
                  Python and backend system design.
                </p>
                <p>
                  Known for being a fast learner, team-oriented, and
                  relentlessly curious. Actively building tools that make teams
                  more efficient and systems more scalable. Eager to bring
                  hands-on experience, a strong problem-solving mindset, and a
                  deep hunger to grow into a collaborative engineering team.
                </p>
              </div>

              <div className="skills-section">
                <h3 className="skills-title">Technical Skills</h3>

                <div className="skills-grid">
                  <SkillCategory
                    title="Frontend"
                    skills={[
                      "React.js",
                      "React Native",
                      "Redux",
                      "JavaScript (ES6+)",
                      "HTML5",
                      "CSS3",
                      "SCSS",
                    ]}
                  />
                  <SkillCategory
                    title="Backend"
                    skills={[
                      "Node.js",
                      "Express.js",
                      "Java (Spring Boot)",
                      "Python",
                      "RESTful APIs",
                    ]}
                  />
                  <SkillCategory
                    title="Databases"
                    skills={["MongoDB", "MySQL", "Firebase"]}
                  />
                  <SkillCategory
                    title="Tools & DevOps"
                    skills={[
                      "Git & GitHub",
                      "Docker",
                      "Postman",
                      "GitHub Actions (CI/CD)",
                      "Agile/Scrum",
                    ]}
                  />
                  <SkillCategory
                    title="Cloud & Development"
                    skills={[
                      "AWS",
                      "Azure",
                      "Google Cloud",
                      "Docker",
                      "Kubernetes",
                    ]}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="experience-section">
          <div className="container">
            <SectionHeader title="Work Experience" />

            <div className="experience-timeline">
              <ExperienceTimelineItem
                company="Jabil"
                location="Florence, KY"
                title="Line Lead IT Diagnostic Technician"
                period="Feb 2025 - Present"
                description={[
                  "Lead daily technical operations on hardware diagnostics; performed root-cause analysis on PCB assemblies.",
                  "Acted as a communication bridge between production staff and engineering leadership.",
                  "Proposed a search-driven AI assistant to help technicians resolve issues faster by detecting patterns and routing problems to the right person or group — a project I'm currently prototyping.",
                  "Work closely with the Test Engineering team to continuously analyze and improve diagnostic accuracy.",
                ]}
              />

              <ExperienceTimelineItem
                company="Dec Consult"
                location="Kinshasa, D.R. Congo"
                title="Full-Stack Software Consultant (Contract)"
                period="Aug 2024 - Jan 2025"
                description={[
                  "Delivered a full-stack Employee Management System using React.js, Node.js, and MongoDB.",
                  "Customized and deployed the platform, trained staff, and worked with local developers to support integration and maintenance.",
                  "Supported a team with mostly WordPress experience, helping them understand JavaScript stack fundamentals.",
                ]}
              />

              <ExperienceTimelineItem
                company="American Express"
                location="Sunrise, FL"
                title="Software Engineer III"
                period="May 2022 - Aug 2024"
                description={[
                  "Built and maintained web apps using React.js with an emphasis on performance, accessibility, and modularity.",
                  "Refactored large codebases, uplifted dependencies, and improved CI/CD workflows, reducing deployment times.",
                  "Provided mentorship to incoming junior devs, offering guidance on how to find support, learn quickly, and deliver with confidence.",
                  "Developed and supported backend features using Node.js and Spring Boot, gradually expanding to full-stack development.",
                ]}
                isLast={true}
              />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects-section">
          <div className="container">
            <SectionHeader title="Projects" />

            <div className="projects-grid">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <ModernProjectCard
                    project={project}
                    onClick={() => setCurrentProject(project)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="education-section">
          <div className="container">
            <SectionHeader title="Education & Certifications" />

            <div className="education-cards">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <EducationCard
                  institution="Purdue University Global"
                  degree="Bachelor of Science in Cloud Computing"
                  period="Expected Graduation: 2027"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <EducationCard
                  institution="Multiverse US, Inc."
                  degree="Software Engineering Apprenticeship"
                  period="Completed: August 2023"
                  certification="View Certificate"
                  certificationUrl="https://www.dropbox.com/scl/fi/c97knw2yifxozhu4zup6y/Apprentice-Electronic-Completion-Certificate-Yogue-Youssouf-ZA2022053682-24120096.pdf"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="container">
            <SectionHeader title="Contact Me" />

            <div className="contact-content">
              <motion.div
                className="contact-info"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="contact-title">Get In Touch</h3>
                <div className="contact-items">
                  <ContactItem
                    icon={<MapPin size={20} />}
                    label="Location"
                    value="Florence, KY 41042"
                  />
                  <ContactItem
                    icon={<Phone size={20} />}
                    label="Phone"
                    value="(954) 716-5510"
                    href="tel:+19547165510"
                  />
                  <ContactItem
                    icon={<Mail size={20} />}
                    label="Email"
                    value="yousyogue@gmail.com"
                    href="mailto:yousyogue@gmail.com"
                  />
                  <ContactItem
                    icon={<GitHubIcon />}
                    label="GitHub"
                    value="github.com/yyogue"
                    href="https://github.com/yyogue"
                  />
                  <ContactItem
                    icon={<LinkedInIcon />}
                    label="LinkedIn"
                    value="linkedin.com/in/youssouf-yogue"
                    href="https://linkedin.com/in/youssouf-yogue"
                  />
                </div>
              </motion.div>

              <motion.div
                className="contact-form-container"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="contact-title">Send a Message</h3>
                <div className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-input"
                      placeholder="Your Name"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder="your.email@example.com"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="form-textarea"
                      placeholder="Your message..."
                      disabled
                    />
                  </div>
                  <div className="form-note">
                    This contact form is just a demo. Please use email or phone
                    to get in touch.
                  </div>
                  <motion.button
                    className="form-button"
                    onClick={() =>
                      (window.location.href = "mailto:yousyogue@gmail.com")
                    }
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Contact via Email
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-name">Youssouf Yogue</div>
              <div className="footer-title">Full-Stack Software Engineer</div>

              <div className="social-links">
                <a
                  href="https://github.com/yyogue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="GitHub Profile"
                >
                  <GitHubIcon size={24} />
                </a>
                <a
                  href="https://linkedin.com/in/youssouf-yogue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedInIcon size={24} />
                </a>
                <a
                  href="mailto:yousyogue@gmail.com"
                  className="social-link"
                  aria-label="Email"
                >
                  <Mail size={24} />
                </a>
              </div>

              <div className="copyright">
                &copy; {new Date().getFullYear()} Youssouf Yogue. All rights
                reserved.
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="scroll-top-button"
            aria-label="Scroll to top"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUpCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {currentProject && (
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCurrentProject(null)}
          >
            <motion.div
              className="project-modal"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="project-modal-header">
                <h3 className="project-modal-title">{currentProject.title}</h3>
                <button
                  className="project-modal-close"
                  onClick={() => setCurrentProject(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="project-modal-image">
                <img src={currentProject.image} alt={currentProject.title} />
              </div>

              <div className="project-modal-content">
                <div className="project-modal-tags">
                  {currentProject.tags.map((tag, index) => (
                    <span key={index} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="project-modal-description">
                  <p>{currentProject.longDescription}</p>
                </div>

                <div className="project-modal-links">
                  {currentProject.github && (
                    <a
                      href={currentProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link-button"
                    >
                      <GitHubIcon size={18} />
                      <span>View Code</span>
                    </a>
                  )}

                  {currentProject.live && (
                    <a
                      href={currentProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link-button"
                    >
                      <Globe size={18} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Components
const SectionHeader = ({ title }) => (
  <motion.div
    className="section-header"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="section-title">{title}</h2>
  </motion.div>
);

const SkillCategory = ({ title, skills }) => (
  <div className="skill-category">
    <h4 className="skill-category-title">{title}</h4>
    <div className="skill-items">
      {skills.map((skill, index) => (
        <motion.span
          key={index}
          className="skill-item"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05, backgroundColor: "#EEF2FF" }}
        >
          {skill}
        </motion.span>
      ))}
    </div>
  </div>
);

const ExperienceTimelineItem = ({
  company,
  location,
  title,
  period,
  description,
  isLast = false,
}) => (
  <motion.div
    className={`timeline-item ${isLast ? "last-item" : ""}`}
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="timeline-marker"></div>
    <div className="timeline-content">
      <div className="timeline-header">
        <div className="timeline-company">
          <h3 className="company-name">{company}</h3>
          <div className="company-location">{location}</div>
        </div>
        <div className="timeline-position">
          <div className="position-title">{title}</div>
          <div className="position-period">{period}</div>
        </div>
      </div>
      <ul className="timeline-description">
        {description.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
          >
            <ChevronRight size={16} className="timeline-bullet" />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const ModernProjectCard = ({ project, onClick }) => (
  <motion.div
    className={`project-card ${project.featured ? "featured" : ""}`}
    whileHover={{
      y: -8,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    }}
    onClick={onClick}
  >
    <div className="project-image">
      <img src={project.image} alt={project.title} />
      {project.featured && <div className="featured-badge">Featured</div>}
    </div>
    <div className="project-content">
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-tags">
        {project.tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="project-tag">
            {tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span className="project-tag">+{project.tags.length - 3}</span>
        )}
      </div>
      <div className="project-links">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
            onClick={(e) => e.stopPropagation()}
          >
            <Code size={16} />
            <span>Code</span>
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={16} />
            <span>Live</span>
          </a>
        )}
      </div>
      <div className="view-details">
        <span>View Details</span>
      </div>
    </div>
  </motion.div>
);

const EducationCard = ({
  institution,
  degree,
  period,
  certification,
  certificationUrl,
}) => (
  <div className="education-card">
    <div className="education-content">
      <h3 className="institution">{institution}</h3>
      <div className="degree">{degree}</div>
      <div className="period">{period}</div>
      {certification && certificationUrl && (
        <a
          href={certificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="certification-link"
        >
          <ExternalLink size={16} />
          <span>{certification}</span>
        </a>
      )}
    </div>
  </div>
);

const ContactItem = ({ icon, label, value, href }) => (
  <div className="contact-item">
    <div className="contact-icon">{icon}</div>
    <div className="contact-details">
      <div className="contact-label">{label}</div>
      {href ? (
        <a
          href={href}
          className="contact-value contact-link"
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {value}
        </a>
      ) : (
        <div className="contact-value">{value}</div>
      )}
    </div>
  </div>
);

// SVG Icons
const GitHubIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedInIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default Portfolio;
