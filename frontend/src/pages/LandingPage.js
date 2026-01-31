import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Globe, 
  Zap, 
  Settings, 
  Link2, 
  Gauge,
  Target,
  Clock,
  MessageSquare,
  Layers,
  Building,
  ChevronRight,
  Send,
  Phone,
  ArrowRight,
  Check,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// Section wrapper with animation
const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Scroll to section helper
const scrollToSection = (e, sectionId) => {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80; // navbar height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Navigation
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'servicios', label: 'Servicios' },
    { id: 'proceso', label: 'Proceso' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'casos', label: 'Casos' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-lg border-b border-border' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <button 
          onClick={(e) => scrollToSection(e, 'hero')} 
          className="text-xl font-heading font-bold text-foreground cursor-pointer" 
          data-testid="logo"
        >
          Think<span className="text-primary">Fast</span>
        </button>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={(e) => scrollToSection(e, link.id)}
              className="text-secondary-foreground hover:text-foreground transition-colors text-sm cursor-pointer bg-transparent border-none"
              data-testid={`nav-${link.id}`}
            >
              {link.label}
            </button>
          ))}
          <button onClick={(e) => scrollToSection(e, 'contacto')} data-testid="nav-contacto">
            <Button className="btn-primary rounded-none">Contactar</Button>
          </button>
        </div>
        <button onClick={(e) => scrollToSection(e, 'contacto')} className="md:hidden" data-testid="nav-contacto-mobile">
          <Button className="btn-primary rounded-none text-sm px-4 py-2">Contactar</Button>
        </button>
      </div>
    </motion.nav>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      {/* Spline Background */}
      <div className="spline-container">
        <iframe 
          src="https://my.spline.design/tierrav1computer-z2oE1FObnsIWQQWFSpy2IpPh/" 
          title="Think Fast 3D Background"
          loading="lazy"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="hero-overlay" />
      
      {/* Content */}
      <div className="hero-content w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl"
          >
            <h1 
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
              data-testid="hero-title"
            >
              Software y soluciones digitales para negocios que necesitan{' '}
              <span className="text-primary">resultados.</span>
            </h1>
            <p 
              className="text-lg md:text-xl text-secondary-foreground mb-10 max-w-2xl"
              data-testid="hero-subtitle"
            >
              Diseñamos y desarrollamos productos digitales rápidos, modernos y orientados a conversión.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={(e) => scrollToSection(e, 'contacto')} data-testid="hero-cta-primary">
                <Button className="btn-primary rounded-none text-base px-8 py-6 w-full sm:w-auto">
                  Solicitar una consulta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </button>
              <button onClick={(e) => scrollToSection(e, 'servicios')} data-testid="hero-cta-secondary">
                <Button variant="outline" className="btn-secondary rounded-none text-base px-8 py-6 w-full sm:w-auto">
                  Ver servicios
                </Button>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Services Section
const services = [
  {
    icon: Globe,
    title: 'Desarrollo Web Profesional',
    description: 'Sitios web rápidos, seguros y optimizados para tu negocio.'
  },
  {
    icon: Target,
    title: 'Landing Pages',
    description: 'Páginas orientadas a conversión que generan resultados medibles.'
  },
  {
    icon: Settings,
    title: 'Automatización de Procesos',
    description: 'Ahorrá tiempo automatizando tareas repetitivas de tu negocio.'
  },
  {
    icon: Link2,
    title: 'Integraciones a Medida',
    description: 'Conectamos tus sistemas para que trabajen juntos sin fricciones.'
  },
  {
    icon: Gauge,
    title: 'Optimización y Performance',
    description: 'Mejoramos la velocidad y rendimiento de tus plataformas existentes.'
  }
];

const ServicesSection = () => {
  return (
    <AnimatedSection className="section-container py-24 md:py-32" id="servicios">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div variants={fadeUp} className="mb-16">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">Servicios</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground" data-testid="services-title">
            Qué hacemos
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="glass-card p-8 group cursor-default"
              data-testid={`service-card-${index}`}
            >
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-secondary-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Process Section
const processSteps = [
  {
    number: '01',
    title: 'Análisis del negocio',
    description: 'Entendemos tus objetivos, tu audiencia y tus necesidades reales.'
  },
  {
    number: '02',
    title: 'Propuesta clara y cerrada',
    description: 'Te presentamos un plan concreto con alcance, tiempos y costos definidos.'
  },
  {
    number: '03',
    title: 'Desarrollo rápido',
    description: 'Construimos tu solución con entregas parciales para validar el avance.'
  },
  {
    number: '04',
    title: 'Entrega + soporte',
    description: 'Lanzamos tu proyecto y te acompañamos con soporte continuo.'
  }
];

const ProcessSection = () => {
  return (
    <AnimatedSection className="section-container py-24 md:py-32 bg-secondary/30" id="proceso">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div variants={fadeUp} className="mb-16">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">Proceso</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground" data-testid="process-title">
            Cómo trabajamos
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="relative pl-20"
                data-testid={`process-step-${index}`}
              >
                <div className="absolute left-0 top-0">
                  <span className="number-highlight">{step.number}</span>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="absolute left-6 top-16 h-full w-px bg-border" />
                )}
                <div className="pt-2">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-secondary-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            variants={fadeUp}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="glass-card p-12 text-center max-w-md">
              <Zap className="w-16 h-16 text-primary mx-auto mb-6" />
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                Desarrollo ágil
              </h3>
              <p className="text-secondary-foreground">
                Trabajamos con metodologías modernas que permiten entregas rápidas y ajustes continuos basados en tu feedback.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Why Us Section
const benefits = [
  { icon: Target, text: 'Enfoque en resultados' },
  { icon: Clock, text: 'Velocidad sin perder calidad' },
  { icon: MessageSquare, text: 'Comunicación directa' },
  { icon: Layers, text: 'Soluciones simples y escalables' },
  { icon: Building, text: 'Pensado para negocios reales' }
];

const WhyUsSection = () => {
  return (
    <AnimatedSection className="section-container py-24 md:py-32" id="nosotros">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">Por qué nosotros</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="whyus-title">
              Por qué Think<span className="text-primary">Fast</span>
            </h2>
            <p className="text-secondary-foreground text-lg leading-relaxed">
              Somos un equipo enfocado en entregar valor real. Sin complicaciones, sin demoras innecesarias, sin sorpresas.
            </p>
          </motion.div>
          
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="glass-card p-6 flex items-center gap-4 group"
                  data-testid={`benefit-${index}`}
                >
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Cases Section
const cases = [
  {
    title: 'E-commerce Retail',
    category: 'Desarrollo Web',
    description: 'Plataforma de ventas online con integración de pagos y gestión de inventario.'
  },
  {
    title: 'Sistema de Turnos',
    category: 'Automatización',
    description: 'Aplicación para gestión de citas y turnos con notificaciones automáticas.'
  },
  {
    title: 'Dashboard Analítico',
    category: 'Integraciones',
    description: 'Panel de control con métricas en tiempo real conectado a múltiples fuentes.'
  }
];

const CasesSection = () => {
  return (
    <AnimatedSection className="section-container py-24 md:py-32 bg-secondary/30" id="casos">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div variants={fadeUp} className="mb-16">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">Portfolio</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground" data-testid="cases-title">
            Casos y ejemplos
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((caseItem, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="glass-card p-8 group cursor-pointer"
              data-testid={`case-card-${index}`}
            >
              <p className="text-primary text-sm font-medium mb-4">{caseItem.category}</p>
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {caseItem.title}
              </h3>
              <p className="text-secondary-foreground leading-relaxed mb-6">
                {caseItem.description}
              </p>
              <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Ver más <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.p variants={fadeUp} className="text-center text-muted-foreground mt-12">
          * Ejemplos de proyectos tipo. Casos reales disponibles bajo solicitud.
        </motion.p>
      </div>
    </AnimatedSection>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <AnimatedSection className="section-container py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          variants={fadeUp}
          className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="cta-title">
              ¿Tenés una idea o necesitás mejorar tu presencia digital?
            </h2>
            <p className="text-secondary-foreground text-lg mb-10 max-w-2xl mx-auto">
              Contanos qué necesitás y te respondemos con una propuesta clara en menos de 48 horas.
            </p>
            <button onClick={(e) => scrollToSection(e, 'contacto')} data-testid="cta-button">
              <Button className="btn-primary rounded-none text-lg px-10 py-6">
                Hablemos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor completá todos los campos');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('¡Mensaje enviado! Te responderemos pronto.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Error al enviar. Intentá de nuevo o contactanos por WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = '5493543602061';
  const whatsappMessage = encodeURIComponent('Hola, me gustaría consultar sobre sus servicios de desarrollo.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <AnimatedSection className="section-container py-24 md:py-32 bg-secondary/30" id="contacto">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div variants={fadeUp}>
            <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">Contacto</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="contact-title">
              Iniciá tu proyecto
            </h2>
            <p className="text-secondary-foreground text-lg leading-relaxed mb-8">
              Dejanos tu mensaje y te contactamos en menos de 24 horas hábiles. También podés escribirnos directamente por WhatsApp.
            </p>
            
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn inline-flex rounded-none"
              data-testid="whatsapp-button"
            >
              <Phone className="w-5 h-5" />
              Escribinos por WhatsApp
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            
            <p className="text-muted-foreground text-sm mt-4">
              Respuesta rápida garantizada
            </p>
          </motion.div>
          
          <motion.div variants={fadeUp}>
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div>
                <label htmlFor="name" className="block text-foreground font-medium mb-2">
                  Nombre
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input rounded-none h-12"
                  data-testid="contact-name-input"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-foreground font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input rounded-none h-12"
                  data-testid="contact-email-input"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-foreground font-medium mb-2">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Contanos sobre tu proyecto o idea..."
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input rounded-none min-h-[150px] resize-none"
                  data-testid="contact-message-input"
                />
              </div>
              
              <Button 
                type="submit" 
                className="btn-primary rounded-none w-full py-6 text-base"
                disabled={isSubmitting}
                data-testid="contact-submit-button"
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    Enviar mensaje
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="section-container py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-6">
            <h3 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="footer-logo">
              Think<span className="text-primary">Fast</span>
            </h3>
            <p className="text-secondary-foreground max-w-md">
              Software agency. Soluciones digitales para negocios que necesitan resultados.
            </p>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="font-heading font-semibold text-foreground mb-4">Links</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={(e) => scrollToSection(e, 'servicios')} className="text-secondary-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer" data-testid="footer-servicios">
                  Servicios
                </button>
              </li>
              <li>
                <button onClick={(e) => scrollToSection(e, 'proceso')} className="text-secondary-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer" data-testid="footer-proceso">
                  Proceso
                </button>
              </li>
              <li>
                <button onClick={(e) => scrollToSection(e, 'contacto')} className="text-secondary-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer" data-testid="footer-contacto">
                  Contacto
                </button>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="font-heading font-semibold text-foreground mb-4">Redes</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-secondary-foreground hover:text-primary transition-colors" data-testid="footer-linkedin">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground hover:text-primary transition-colors" data-testid="footer-instagram">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground hover:text-primary transition-colors" data-testid="footer-twitter">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm" data-testid="footer-copyright">
            © {new Date().getFullYear()} Think Fast. Todos los derechos reservados.
          </p>
          <p className="text-muted-foreground text-sm">
            <a href="mailto:tomialvarez78@gmail.com" className="hover:text-primary transition-colors" data-testid="footer-email">
              tomialvarez78@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <WhyUsSection />
      <CasesSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
