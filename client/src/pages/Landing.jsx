import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Brain, 
  Code2, 
  MessageSquare, 
  FileText, 
  Target, 
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Play,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';

const Landing = () => {
  const [activeSection, setActiveSection] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveSection(index);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Questions',
      description: 'Smart question generation tailored to your profile',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: Code2,
      title: 'Live Coding Environment',
      description: 'Real-time code execution with multiple language support',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'Voice & Video Analysis',
      description: 'AI analyzes your responses in real-time',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Comprehensive reports with actionable insights',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: FileText,
      title: 'Resume Parsing',
      description: 'AI extracts skills and generates personalized questions',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Target,
      title: 'Mock Interviews',
      description: 'Practice with company-specific scenarios',
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Interviews Conducted' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '500+', label: 'Company Templates' },
    { value: '24/7', label: 'AI Availability' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      image: 'SC',
      quote: 'Synapse helped me land my dream job. The AI feedback was incredibly insightful.'
    },
    {
      name: 'Marcus Johnson',
      role: 'Data Scientist at Meta',
      image: 'MJ',
      quote: 'The coding environment is so realistic. Felt exactly like my real interviews.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager at Amazon',
      image: 'ER',
      quote: 'Best investment in my career. The personalized questions made all the difference.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] overflow-x-hidden">
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="orb w-[600px] h-[600px] bg-violet-500/20 blur-[120px] absolute -top-1/4 -right-1/4"
          style={{ animation: 'float 15s ease-in-out infinite' }}
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="orb w-[500px] h-[500px] bg-cyan-500/15 blur-[100px] absolute -bottom-1/4 -left-1/4"
          style={{ animation: 'float 20s ease-in-out infinite reverse' }}
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="orb w-[400px] h-[400px] bg-violet-500/10 blur-[80px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: 'float 12s ease-in-out infinite', animationDelay: '2s' }}
        />
      </div>

      {/* Navigation Pill */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[672px]"
      >
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
            <span className="font-serif text-lg text-white">Synapse</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Stats', 'Testimonials'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-white/60 hover:text-white transition-colors uppercase tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/login"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register"
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl px-6"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/70 mb-6">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>AI-Powered Interview Preparation</span>
            </div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="font-serif text-7xl md:text-9xl text-white leading-[0.85] tracking-tight mb-8"
          >
            Master Your{' '}
            <span className="text-shimmer inline-block">Interview</span>
            <br />
            <span className="text-white/60">Journey</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-light"
          >
            Experience the future of interview preparation with AI-powered mock sessions, 
            real-time feedback, and personalized analytics.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/register"
              className="group relative px-8 py-4 rounded-full transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 animate-spin bg-[length:200%] opacity-75" />
              <div className="relative bg-black rounded-full px-8 py-4 flex items-center gap-3">
                <Play className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Start Free Trial</span>
              </div>
            </Link>
            
            <Link 
              to="/login"
              className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>See How It Works</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
          
          {/* Hero Visual - Abstract representation */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 relative"
          >
            <div className="w-full h-48 rounded-3xl overflow-hidden glass flex items-center justify-center">
              <div className="flex items-center gap-8">
                {[Brain, Code2, MessageSquare, Target].map((Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center"
                  >
                    <Icon className="w-8 h-8 text-white/70" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Metrics Ticker */}
      <section className="py-8 border-y border-white/5 bg-black/40">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...stats, ...stats].map((stat, i) => (
            <div key={i} className="flex items-center gap-8 px-8">
              <span className="text-xs uppercase tracking-widest text-white/40 font-mono">
                {stat.label}
              </span>
              <span className="text-base text-white font-mono font-medium">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Everything you need to ace your interviews
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                className="group p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-violet-500/40 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Integration Block */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="code-block overflow-hidden"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-sm text-white/50 font-mono ml-4">interview.js</span>
              </div>
              <button className="text-white/50 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            
            {/* Code Content */}
            <div className="p-6 font-mono text-sm">
              <div className="flex">
                <div className="text-white/30 text-right pr-4 select-none">
                  {[1, 2, 3, 4, 5, 6, 7].map((line) => (
                    <div key={line} className="leading-7">{line}</div>
                  ))}
                </div>
                <div className="text-white/80">
                  <div className="leading-7"><span className="code-syntax-import">import</span> {'{'} aiCoach {'}'} <span className="code-syntax-import">from</span> <span className="code-syntax-string">'synapse/ai'</span>;</div>
                  <div className="leading-7">&nbsp;</div>
                  <div className="leading-7"><span className="code-syntax-class">const</span> interview = <span className="code-syntax-import">new</span> AICoach(&#123;</div>
                  <div className="leading-7">&nbsp;&nbsp;type: <span className="code-syntax-string">'technical'</span>,</div>
                  <div className="leading-7">&nbsp;&nbsp;difficulty: <span className="code-syntax-string">'hard'</span>,</div>
                  <div className="leading-7">&nbsp;&nbsp;feedback: <span className="code-syntax-import">true</span></div>
                  <div className="leading-7">&#125;);</div>
                  <div className="leading-7">&nbsp;</div>
                  <div className="leading-7"><span className="code-syntax-comment">// Start your mock interview session</span></div>
                  <div className="leading-7"><span className="code-syntax-import">await</span> interview.start();</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-32 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-serif text-white mb-2">{stat.value}</div>
                <div className="text-sm uppercase tracking-widest text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
              Success Stories
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Join thousands who've transformed their careers
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-sm text-white/50">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-white/60 leading-relaxed">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-5xl md:text-7xl text-white mb-8">
              Ready to{' '}
              <span className="gradient-text-static">Transform</span>
              <br />
              Your Career?
            </h2>
            <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto">
              Join the platform used by top tech professionals to prepare for their dream interviews.
            </p>
            <Link 
              to="/register"
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 animate-spin bg-[length:200%] opacity-75" />
              <div className="relative bg-black rounded-full px-10 py-5 flex items-center gap-3">
                <span className="text-white font-medium text-lg">Get Started Free</span>
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
                <span className="font-serif text-xl text-white">Synapse</span>
              </div>
              <p className="text-white/40 text-sm">
                The future of interview preparation powered by artificial intelligence.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">Product</h4>
              <div className="space-y-3">
                {['Features', 'Pricing', 'Testimonials', 'API'].map((item) => (
                  <a key={item} href="#" className="block text-white/60 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">Company</h4>
              <div className="space-y-3">
                {['About', 'Careers', 'Blog', 'Press'].map((item) => (
                  <a key={item} href="#" className="block text-white/60 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">Legal</h4>
              <div className="space-y-3">
                {['Privacy', 'Terms', 'Security'].map((item) => (
                  <a key={item} href="#" className="block text-white/60 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
            <p className="text-white/40 text-sm">
              © 2024 Synapse. All rights reserved.
            </p>
            <div className="status-indicator mt-4 md:mt-0">
              <div className="status-dot status-dot-pulse" />
              <span className="text-sm text-emerald-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;