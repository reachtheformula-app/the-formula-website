import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, Calendar, BookOpen, MessageSquare, TrendingUp, Menu, X, ArrowRight, Star, Clock, Heart, Shield, Sparkles, Users, Play, Mail, Phone, MapPin, Plus, Camera, Send } from 'lucide-react';

// Color palette
const colors = {
  cream: '#F7F3EE',
  sand: '#E8DFD4',
  dune: '#D4C4B0',
  terra: '#C4956A',
  bark: '#8B6B4A',
  wood: '#5C4033',
  charcoal: '#2D2A26',
  white: '#FFFFFF'
};

// App Preview Carousel Component
const AppPreviewCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      id: 'themes',
      title: "Ocean Adventures! 🌊",
      subtitle: "This week's curriculum",
      icon: BookOpen,
      content: [
        { text: "Circle Time: Ocean animals", checked: true },
        { text: "Letter O - Octopus", checked: true },
        { text: "Fish painting activity", checked: false }
      ],
      bottomCard: {
        label: "50+ weekly curricula",
        text: "Ready-to-go lessons covering STEM, art, seasons, holidays, and more."
      }
    },
    {
      id: 'daily',
      title: "Today's Schedule",
      subtitle: "Monday, January 28",
      icon: Calendar,
      content: [
        { time: "9:00 AM", activity: "Morning Circle" },
        { time: "10:00 AM", activity: "Sensory Play" },
        { time: "12:00 PM", activity: "Lunch & Rest" }
      ],
      bottomCard: {
        label: "Structured days",
        text: "Every day planned with activities, songs, and learning objectives."
      }
    },
    {
      id: 'milestones',
      title: "Milestones",
      subtitle: "Emma's Progress",
      icon: TrendingUp,
      content: [
        { text: "First time counting to 10", date: "Jan 18" },
        { text: "Identified 5 colors", date: "Jan 15" },
        { text: "Shared toys independently", date: "Jan 12" }
      ],
      bottomCard: {
        label: "Track growth",
        text: "Document and celebrate every developmental win."
      }
    },
    {
      id: 'updates',
      title: "Parent Update",
      subtitle: "Ready to send",
      icon: MessageSquare,
      content: {
        type: 'letter',
        preview: "What a wonderful day! Emma was so engaged during our ocean theme activities. She loved the fish painting and..."
      },
      bottomCard: {
        label: "Stay connected",
        text: "Generate detailed daily letters in seconds."
      }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[activeSlide];
  const IconComponent = currentSlide.icon;

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-2xl"
      style={{ backgroundColor: colors.sand }}
    >
      <div className="p-6 flex flex-col gap-4">
        {/* Main Card - Animated */}
        <div 
          className="rounded-2xl p-6 shadow-lg transition-all duration-500"
          style={{ backgroundColor: colors.white }}
          key={currentSlide.id}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.terra }}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: colors.wood }}>{currentSlide.title}</h3>
              <p className="text-sm" style={{ color: colors.bark }}>{currentSlide.subtitle}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {currentSlide.id === 'themes' && currentSlide.content.map((item, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ backgroundColor: colors.cream }}
              >
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: item.checked ? colors.terra : colors.dune }}
                >
                  {item.checked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm" style={{ color: colors.bark }}>{item.text}</span>
              </div>
            ))}
            
            {currentSlide.id === 'daily' && currentSlide.content.map((item, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: colors.cream }}
              >
                <span className="text-xs font-semibold w-16" style={{ color: colors.terra }}>{item.time}</span>
                <span className="text-sm" style={{ color: colors.bark }}>{item.activity}</span>
              </div>
            ))}
            
            {currentSlide.id === 'milestones' && currentSlide.content.map((item, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ backgroundColor: colors.cream }}
              >
                <span className="text-sm" style={{ color: colors.bark }}>{item.text}</span>
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: colors.sand, color: colors.terra }}
                >
                  {item.date}
                </span>
              </div>
            ))}
            
            {currentSlide.id === 'updates' && (
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: colors.cream }}
              >
                <p className="text-sm italic leading-relaxed" style={{ color: colors.bark }}>
                  "{currentSlide.content.preview}"
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div 
                    className="h-1 flex-1 rounded-full"
                    style={{ backgroundColor: colors.terra }}
                  />
                  <span className="text-xs" style={{ color: colors.terra }}>Ready ✨</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Card */}
        <div 
          className="rounded-2xl p-5 shadow-lg transition-all duration-500"
          style={{ backgroundColor: colors.white }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: colors.wood }}>
              {currentSlide.bottomCard.label}
            </span>
          </div>
          <p className="text-sm" style={{ color: colors.bark }}>
            {currentSlide.bottomCard.text}
          </p>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: i === activeSlide ? colors.terra : colors.dune,
              transform: i === activeSlide ? 'scale(1.3)' : 'scale(1)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = ({ currentPage, setCurrentPage, scrolled }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'families', label: 'For Families' },
    { id: 'apply', label: 'For Caregivers' },
    { id: 'about', label: 'About' },
    { id: 'story', label: 'Our Story' },
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{ 
        backgroundColor: scrolled ? 'rgba(247, 243, 238, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${colors.sand}` : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 group"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: colors.terra }}
            >
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span 
              className="text-xl font-semibold tracking-tight"
              style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
            >
              The Formula
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className="relative py-2 text-sm font-medium transition-colors"
                style={{ color: currentPage === item.id ? colors.terra : colors.bark }}
              >
                {item.label}
                {currentPage === item.id && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: colors.terra }}
                  />
                )}
              </button>
            ))}
            <a
              href="https://theformula-app.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg"
              style={{ backgroundColor: colors.wood, color: colors.white }}
            >
              Launch App
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X style={{ color: colors.wood }} /> : <Menu style={{ color: colors.wood }} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMobileOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium"
                style={{ 
                  backgroundColor: currentPage === item.id ? colors.sand : 'transparent',
                  color: colors.wood 
                }}
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://theformula-app.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold mt-2"
              style={{ backgroundColor: colors.wood, color: colors.white }}
            >
              Launch App
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

// Home Page
const HomePage = ({ setCurrentPage }) => {
  const features = [
    {
      icon: BookOpen,
      title: "50+ Themed Curricula",
      description: "Ready-to-use weekly themes with daily activities, songs, crafts, and learning objectives. No planning required."
    },
    {
      icon: Calendar,
      title: "Daily Structure",
      description: "Circle time scripts, alphabet practice, counting exercises, and age-appropriate learning stations."
    },
    {
      icon: MessageSquare,
      title: "Parent Communication",
      description: "Generate beautiful daily letters and share photos, keeping parents connected even while at work."
    },
    {
      icon: TrendingUp,
      title: "Milestone Tracking",
      description: "Document and celebrate developmental milestones with detailed activity logs and progress notes."
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Choose Your Theme",
      description: "Select from 50+ expertly-designed weekly themes covering everything from STEM to social-emotional learning."
    },
    {
      step: "02", 
      title: "Follow the Plan",
      description: "Each day comes with a complete schedule: circle time scripts, activities, songs, and even themed lunch ideas."
    },
    {
      step: "03",
      title: "Log & Communicate",
      description: "Track activities and milestones throughout the day. Generate personalized letters to keep parents in the loop."
    }
  ];

  return (
    <div style={{ backgroundColor: colors.cream }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl"
            style={{ backgroundColor: colors.terra }}
          />
          <div 
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: colors.dune }}
          />
          {/* Decorative shapes */}
          <svg className="absolute top-40 left-10 w-16 h-16 opacity-10" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill={colors.terra} />
          </svg>
          <svg className="absolute bottom-40 right-20 w-24 h-24 opacity-10" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" rx="20" fill={colors.bark} />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight"
                style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
              >
                Modern tools.{' '}
                <span style={{ color: colors.terra }}>Better care.</span>
              </h1>
              
              <p 
                className="text-xl leading-relaxed max-w-xl"
                style={{ color: colors.bark }}
              >
                Structured, educational care—right at home. Daily plans for caregivers. 
                Detailed updates for parents.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setCurrentPage('apply')}
                  className="group px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.terra, color: colors.white }}
                >
                  I'm a Caregiver
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button 
                  onClick={() => setCurrentPage('families')}
                  className="px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.white, color: colors.wood, border: `2px solid ${colors.dune}` }}
                >
                  I'm a Parent
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Hero Image/Illustration - Rolling App Preview */}
            <div className="relative">
              <AppPreviewCarousel />
              
              {/* Floating elements */}
              <div 
                className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: colors.white }}
              >
                <div className="text-center">
                  <span className="text-2xl font-bold" style={{ color: colors.terra }}>50+</span>
                  <p className="text-xs" style={{ color: colors.bark }}>Weeks</p>
                </div>
              </div>
              
              <div 
                className="absolute -bottom-4 -left-4 px-6 py-4 rounded-2xl shadow-lg"
                style={{ backgroundColor: colors.wood }}
              >
                <p className="text-white text-sm font-medium">🎯 Milestone recorded!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <section 
        className="py-6 border-y"
        style={{ backgroundColor: colors.sand, borderColor: colors.dune }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              "Educator-designed",
              "Curriculum-based",
              "Digitally organized",
              "Parent-connected"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4" style={{ color: colors.terra }} />
                <span className="text-sm font-semibold tracking-wide" style={{ color: colors.wood }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      {/* Features Grid */}
      <section className="py-24" style={{ backgroundColor: colors.sand }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 
              className="text-4xl md:text-5xl font-semibold"
              style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
            >
              Everything you need. <em className="not-italic" style={{ color: colors.terra }}>Nothing</em> you don't.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="p-8 rounded-3xl transition-all hover:shadow-xl"
                style={{ backgroundColor: colors.white }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: colors.terra }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 
                  className="text-2xl font-semibold mb-3"
                  style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: colors.bark }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 
              className="text-4xl md:text-5xl font-semibold mb-6"
              style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
            >
              Simple to start. Powerful in practice.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative">
                <span 
                  className="text-8xl font-bold opacity-10 absolute -top-8 left-0"
                  style={{ color: colors.terra, fontFamily: "'Playfair Display', serif" }}
                >
                  {item.step}
                </span>
                <div className="relative pt-12">
                  <h3 
                    className="text-2xl font-semibold mb-4"
                    style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-lg leading-relaxed" style={{ color: colors.bark }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 
            className="text-4xl md:text-5xl font-semibold mb-6"
            style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
          >
            We built the framework. You bring the magic.
          </h2>
          <p className="text-xl mb-10" style={{ color: colors.bark }}>
            Join a growing community of early childhood educators committed to exceptional care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('apply')}
              className="group px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.terra, color: colors.white }}
            >
              Apply as a Caregiver
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <a 
              href="https://theformula-app.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-lg font-semibold transition-all"
              style={{ backgroundColor: colors.sand, color: colors.wood }}
            >
              Already a member? Launch App
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

// Families Page
const FamiliesPage = ({ setCurrentPage }) => {
  const [path, setPath] = useState(null); // 'have' or 'find'
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    location: '',
    childrenAges: '',
    nannyName: '',
    nannyEmail: '',
    careType: '',
    schedule: '',
    startDate: '',
    aboutFamily: '',
    whatLookingFor: ''
  });
  const [submitted, setSubmitted] = useState(false);

const encode = (data) =>
    Object.keys(data)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
      .join('&');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formName = path === 'have' ? 'have-a-caregiver' : 'looking-for-caregiver';
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': formName, ...formData }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Form submission error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div style={{ backgroundColor: colors.cream }} className="min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: colors.terra }}
          >
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 
            className="text-4xl font-semibold mb-6"
            style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
          >
            {path === 'have' ? "You're All Set!" : "Request Received!"}
          </h1>
          <p className="text-lg mb-8" style={{ color: colors.bark }}>
            {path === 'have' 
              ? "We'll send your caregiver an invitation to join The Formula. Once they're set up, you'll start receiving updates."
              : "We'll review your family's needs and be in touch within 2-3 business days to discuss finding your perfect caregiver match."
            }
          </p>
          <button 
            onClick={() => setCurrentPage('home')}
            className="px-8 py-4 rounded-full text-lg font-semibold"
            style={{ backgroundColor: colors.terra, color: colors.white }}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Path selection screen
  if (!path) {
    return (
      <div style={{ backgroundColor: colors.cream }}>
        <section className="pt-32 pb-20 min-h-screen">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h1 
                className="text-5xl md:text-6xl font-semibold mb-6"
                style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
              >
                Welcome, families.
              </h1>
              <p className="text-xl" style={{ color: colors.bark }}>
                Whether you have a caregiver or need to find one, The Formula keeps you connected to your child's growth.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* I Have a Caregiver */}
              <button
                onClick={() => setPath('have')}
                className="text-left p-8 rounded-3xl transition-all hover:shadow-xl border-2 group"
                style={{ backgroundColor: colors.white, borderColor: colors.dune }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: colors.sand }}
                >
                  <Heart className="w-8 h-8" style={{ color: colors.terra }} />
                </div>
                <h2 
                  className="text-2xl font-semibold mb-4"
                  style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                >
                  I have a caregiver
                </h2>
                <p className="mb-6" style={{ color: colors.bark }}>
                  Give your nanny or au pair access to The Formula's curriculum and tools—and start receiving detailed daily updates.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Gift your caregiver a subscription",
                    "Receive daily activity updates",
                    "Track milestones and development"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: colors.bark }}>
                      <Check className="w-4 h-4" style={{ color: colors.terra }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div 
                  className="flex items-center gap-2 font-semibold"
                  style={{ color: colors.terra }}
                >
                  Get started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              {/* I'm Looking for a Caregiver */}
              <button
                onClick={() => setPath('find')}
                className="text-left p-8 rounded-3xl transition-all hover:shadow-xl border-2 group"
                style={{ backgroundColor: colors.white, borderColor: colors.dune }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: colors.terra }}
                >
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 
                  className="text-2xl font-semibold mb-4"
                  style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                >
                  I'm looking for a caregiver
                </h2>
                <p className="mb-6" style={{ color: colors.bark }}>
                  Get matched with a Formula-Certified caregiver—vetted professionals trained in our curriculum and tools.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Pre-vetted, qualified caregivers",
                    "Trained in structured, educational care",
                    "Built-in communication tools"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: colors.bark }}>
                      <Check className="w-4 h-4" style={{ color: colors.terra }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div 
                  className="flex items-center gap-2 font-semibold"
                  style={{ color: colors.terra }}
                >
                  Find a caregiver <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          </div>
        </section>
        <Footer setCurrentPage={setCurrentPage} />
      </div>
    );
  }

  // Form for "I have a caregiver"
  if (path === 'have') {
    return (
      <div style={{ backgroundColor: colors.cream }}>
        <section className="pt-32 pb-20">
          <div className="max-w-2xl mx-auto px-6">
            <button 
              onClick={() => setPath(null)}
              className="flex items-center gap-2 mb-8 text-sm font-medium"
              style={{ color: colors.bark }}
            >
              ← Back
            </button>
            
            <div className="text-center mb-12">
              <h1 
                className="text-4xl md:text-5xl font-semibold mb-4"
                style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
              >
                Invite your caregiver
              </h1>
              <p className="text-lg" style={{ color: colors.bark }}>
                We'll send them an invitation to join The Formula with a gifted subscription.
              </p>
            </div>

            <div 
              className="rounded-3xl p-8 md:p-10"
              style={{ backgroundColor: colors.white }}
            >
             <form
                onSubmit={handleSubmit}
                className="space-y-6"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                name="have-a-caregiver"
              >
                <input type="hidden" name="form-name" value="have-a-caregiver" />
                <input type="hidden" name="bot-field" />

                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                  >
                    Your Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.parentName}
                        onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                        style={{ borderColor: colors.dune, color: colors.wood }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                        style={{ borderColor: colors.dune, color: colors.wood }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                  >
                    Caregiver Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                        Caregiver's Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nannyName}
                        onChange={(e) => setFormData({...formData, nannyName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                        style={{ borderColor: colors.dune, color: colors.wood }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                        Caregiver's Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.nannyEmail}
                        onChange={(e) => setFormData({...formData, nannyEmail: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                        style={{ borderColor: colors.dune, color: colors.wood }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                    Children's Ages
                  </label>
                  <input
                    type="text"
                    value={formData.childrenAges}
                    onChange={(e) => setFormData({...formData, childrenAges: e.target.value})}
                    placeholder="e.g., 2 years, 4 years"
                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                    style={{ borderColor: colors.dune, color: colors.wood }}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl"
                  style={{ backgroundColor: colors.terra, color: colors.white }}
                >
                  Send Invitation
                </button>
              </form>
            </div>
          </div>
        </section>
        <Footer setCurrentPage={setCurrentPage} />
      </div>
    );
  }

  // Form for "I'm looking for a caregiver"
  if (path === 'find') {
    return (
      <div style={{ backgroundColor: colors.cream }}>
        <section className="pt-32 pb-20">
          <div className="max-w-2xl mx-auto px-6">
            <button 
              onClick={() => setPath(null)}
              className="flex items-center gap-2 mb-8 text-sm font-medium"
              style={{ color: colors.bark }}
            >
              ← Back
            </button>
            
            <div className="text-center mb-12">
              <h1 
                className="text-4xl md:text-5xl font-semibold mb-4"
                style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
              >
                Find your perfect caregiver
              </h1>
              <p className="text-lg" style={{ color: colors.bark }}>
                Tell us about your family and we'll match you with a Formula-Certified professional.
              </p>
            </div>

            <div 
              className="rounded-3xl p-8 md:p-10"
              style={{ backgroundColor: colors.white }}
            >
            <form
                onSubmit={handleSubmit}
                className="space-y-6"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                name="looking-for-caregiver"
              >
                <input type="hidden" name="form-name" value="looking-for-caregiver" />
                <input type="hidden" name="bot-field" />
                <div>
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                  >
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.parentName}
                          onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                          style={{ borderColor: colors.dune, color: colors.wood }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                          style={{ borderColor: colors.dune, color: colors.wood }}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                          style={{ borderColor: colors.dune, color: colors.wood }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                          Location (City, State) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                          style={{ borderColor: colors.dune, color: colors.wood }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                  >
                    Care Needs
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                        Children's Ages *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.childrenAges}
                        onChange={(e) => setFormData({...formData, childrenAges: e.target.value})}
                        placeholder="e.g., 6 months, 3 years"
                        className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                        style={{ borderColor: colors.dune, color: colors.wood }}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                          Type of Care *
                        </label>
                        <select
                          required
                          value={formData.careType}
                          onChange={(e) => setFormData({...formData, careType: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                          style={{ borderColor: colors.dune, color: colors.wood }}
                        >
                          <option value="">Select...</option>
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="live-in">Live-in</option>
                          <option value="temporary">Temporary/Travel</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                          Ideal Start Date
                        </label>
                        <input
                          type="text"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          placeholder="e.g., ASAP, March 2026"
                          className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                          style={{ borderColor: colors.dune, color: colors.wood }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                        Schedule Needed
                      </label>
                      <input
                        type="text"
                        value={formData.schedule}
                        onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                        placeholder="e.g., Monday-Friday 8am-6pm"
                        className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                        style={{ borderColor: colors.dune, color: colors.wood }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                  >
                    Tell Us More
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                        About your family
                      </label>
                      <textarea
                        rows={3}
                        value={formData.aboutFamily}
                        onChange={(e) => setFormData({...formData, aboutFamily: e.target.value})}
                        placeholder="Tell us a bit about your family, values, and lifestyle..."
                        className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none resize-none"
                        style={{ borderColor: colors.dune, color: colors.wood }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                        What you're looking for in a caregiver
                      </label>
                      <textarea
                        rows={3}
                        value={formData.whatLookingFor}
                        onChange={(e) => setFormData({...formData, whatLookingFor: e.target.value})}
                        placeholder="Specific skills, experience, personality traits..."
                        className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none resize-none"
                        style={{ borderColor: colors.dune, color: colors.wood }}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl"
                  style={{ backgroundColor: colors.terra, color: colors.white }}
                >
                  Submit Request
                </button>

                <p className="text-sm text-center" style={{ color: colors.bark }}>
                  A placement specialist will contact you within 2-3 business days.
                </p>
              </form>
            </div>
          </div>
        </section>
        <Footer setCurrentPage={setCurrentPage} />
      </div>
    );
  }
};

// About Page - Services & Platform Focused
const AboutPage = ({ setCurrentPage }) => {
  const dailyFlow = [
    {
      step: "1",
      title: "Open the app",
      description: "See today's theme, activities, and learning objectives at a glance. No planning required.",
      icon: Calendar
    },
    {
      step: "2",
      title: "Run the day",
      description: "Follow circle time scripts, learning stations, and activities—all laid out and ready to go.",
      icon: BookOpen
    },
    {
      step: "3",
      title: "Capture moments",
      description: "Snap photos, log activities, and note milestones as they happen throughout the day.",
      icon: Camera
    },
    {
      step: "4",
      title: "Send the update",
      description: "Generate a beautiful parent letter in one tap. Done before pickup.",
      icon: Send
    }
  ];

  const whoItsFor = [
    {
      title: "Career Caregivers",
      description: "Professional nannies ready to elevate their practice with structured curricula and tools that match their expertise."
    },
    {
      title: "Newer to Childcare",
      description: "Those building their confidence who want a proven framework—so they can focus on learning the child, not inventing the wheel."
    },
    {
      title: "Engaged Family Members",
      description: "Parents, grandparents, and relatives who want their time with children to be meaningful—not just supervised."
    }
  ];

  return (
    <div style={{ backgroundColor: colors.cream }}>
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 
              className="text-4xl md:text-5xl font-semibold leading-tight mb-6"
              style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
            >
              Childcare has evolved. The first five years matter{' '}
              <em className="italic" style={{ color: colors.terra }}>more than ever</em>.
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: colors.bark }}>
              The Formula is a digital toolkit that brings curriculum-based learning to home childcare—giving 
              caregivers structure, parents visibility, and children the engaged care that shapes their future.
            </p>
          </div>
        </div>
      </section>

      {/* The Caregiver Experience */}
      <section className="py-24" style={{ backgroundColor: colors.white }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 
              className="text-4xl md:text-5xl font-semibold mb-6"
              style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
            >
              A Day with The Formula
            </h2>
            <p className="text-xl" style={{ color: colors.bark }}>
              From morning circle to parent pickup—structured, simple, seamless.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {dailyFlow.map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={i}
                  className="text-center p-6"
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
                    style={{ backgroundColor: colors.terra, color: colors.white }}
                  >
                    {item.step}
                  </div>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: colors.sand }}
                  >
                    <IconComponent className="w-6 h-6" style={{ color: colors.wood }} />
                  </div>
                  <h3 
                    className="text-xl font-semibold mb-3"
                    style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: colors.bark }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Growing Library */}
      <section className="py-24" style={{ backgroundColor: colors.sand }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span 
                className="text-sm font-semibold tracking-wider uppercase mb-4 block"
                style={{ color: colors.terra }}
              >
                Always Growing
              </span>
              <h2 
                className="text-4xl md:text-5xl font-semibold mb-6"
                style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
              >
                A library that grows with you
              </h2>
              <p className="text-lg mb-6" style={{ color: colors.bark }}>
                Start with 50+ expertly designed weekly curricula—then watch the library expand. 
                New themes are added every month by our team and contributed by caregivers in the community.
              </p>
              <p className="text-lg mb-8" style={{ color: colors.bark }}>
                From seasonal activities to trending topics, you'll never run out of fresh, 
                educator-approved content to keep little learners engaged.
              </p>
              <div className="flex flex-wrap gap-3">
                {['STEM', 'Seasons', 'Holidays', 'Animals', 'Art', 'Social-Emotional', 'Life Skills', 'Music'].map((tag) => (
                  <span 
                    key={tag}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{ backgroundColor: colors.white, color: colors.bark }}
                  >
                    {tag}
                  </span>
                ))}
                <span 
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ backgroundColor: colors.terra, color: colors.white }}
                >
                  + New monthly
                </span>
              </div>
            </div>
            <div 
              className="rounded-3xl p-8"
              style={{ backgroundColor: colors.white }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: colors.cream }}>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.terra }}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: colors.wood }}>Ocean Adventures</p>
                    <p className="text-sm" style={{ color: colors.bark }}>Science & Sensory • 5 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: colors.cream }}>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.terra }}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: colors.wood }}>Feelings & Friends</p>
                    <p className="text-sm" style={{ color: colors.bark }}>Social-Emotional • 5 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: colors.cream }}>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.terra }}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: colors.wood }}>Space Explorers</p>
                    <p className="text-sm" style={{ color: colors.bark }}>STEM & Imagination • 5 days</p>
                  </div>
                </div>
                <div 
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed"
                  style={{ borderColor: colors.dune }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.sand }}
                  >
                    <Plus className="w-6 h-6" style={{ color: colors.terra }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: colors.terra }}>New themes added monthly</p>
                    <p className="text-sm" style={{ color: colors.bark }}>By our team & community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24" style={{ backgroundColor: colors.wood }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 
              className="text-4xl md:text-5xl font-semibold mb-4"
              style={{ color: colors.cream, fontFamily: "'Playfair Display', serif" }}
            >
              Built for anyone dedicated to early childhood
            </h2>
            <p className="text-xl" style={{ color: colors.dune }}>
              Great care isn't about job titles. It's about intention.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whoItsFor.map((item, i) => (
              <div 
                key={i}
                className="p-8 rounded-3xl"
                style={{ backgroundColor: colors.bark }}
              >
                <h3 
                  className="text-xl font-semibold mb-4"
                  style={{ color: colors.cream, fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <p className="leading-relaxed" style={{ color: colors.dune }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 
            className="text-4xl md:text-5xl font-semibold mb-6"
            style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
          >
            Ready to transform your caregiving?
          </h2>
          <p className="text-xl mb-10" style={{ color: colors.bark }}>
            Join a growing community of caregivers committed to exceptional early childhood experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('apply')}
              className="group px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.terra, color: colors.white }}
            >
              Apply as a Caregiver
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => setCurrentPage('families')}
              className="group px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2 border-2"
              style={{ borderColor: colors.terra, color: colors.terra, backgroundColor: 'transparent' }}
            >
              For Families
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

// Our Story Page - Founder Narrative
const OurStoryPage = ({ setCurrentPage }) => {
  const values = [
    {
      title: "Structure Enables Magic",
      description: "Framework doesn't limit creativity—it frees caregivers to be fully present. When the plan is handled, connection happens."
    },
    {
      title: "Parents Deserve to Know",
      description: "Working parents shouldn't wonder what happened today. They should know—and feel part of it, even from a distance."
    },
    {
      title: "Professional Tools for Everyone",
      description: "Whether you've been caring for children for twenty years or twenty days, you deserve resources that match your dedication."
    },
    {
      title: "Every Milestone Matters",
      description: "First steps. New words. Breakthrough moments. These aren't just cute—they're evidence of a child becoming who they'll be."
    }
  ];

  return (
    <div style={{ backgroundColor: colors.cream }}>
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span 
              className="text-sm font-semibold tracking-wider uppercase mb-6 block"
              style={{ color: colors.terra }}
            >
              Our Story
            </span>
            <h1 
              className="text-5xl md:text-6xl font-semibold mb-8 leading-tight"
              style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
            >
              Ten years, one realization, and a really big spreadsheet.
            </h1>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="pb-24" style={{ backgroundColor: colors.cream }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6 text-lg leading-relaxed" style={{ color: colors.bark }}>
              <p>
                I didn't start out with a grand plan to change childcare. I started the way most 
                caregivers do—by loving kids and wanting to help.
              </p>
              <p>
                I believed that if I cared enough, 
                the rest would fall into place. And in some ways, it did—but not quickly, and not easily. 
                It took <em style={{ color: colors.wood }}>ten years</em> of trial, observation, and learning the hard way.
              </p>
              <p>
                Over that decade, I worked with multiple families, in preschool classrooms, and later 
                as a pod leader during the pandemic. Each role taught me something different. Each 
                setting showed me what worked—and what was missing.
              </p>
              <p>
                Eventually, I returned to nannying with a new perspective. I finally understood that 
                meaningful childcare requires more than supervision or good intentions. 
                It requires <em style={{ color: colors.wood }}>an educator's mindset</em>.
              </p>
              <p>
                So I brought early education into the home. I built structure into each day—weekly 
                themes, daily lesson plans, language exposure, music, and clear communication with parents.
              </p>
              <p>
                The impact was immediate. Children flourished. Parents felt informed and connected. 
                And other caregivers began asking for the system behind it all.
              </p>
              <p className="text-xl font-semibold" style={{ color: colors.wood }}>
                So I created The Formula to elevate home care for everyone involved. 
                The structure is built—so caregivers can focus on what matters most: 
                the child in front of them.
              </p>
            </div>

            {/* Signature / Founder */}
            <div className="mt-16 pt-8 border-t" style={{ borderColor: colors.dune }}>
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: colors.terra, color: colors.white }}
                >
                  E
                </div>
                <div>
                  <p className="font-semibold text-lg" style={{ color: colors.wood }}>Emily J Barrett</p>
                  <p style={{ color: colors.bark }}>Founder, The Formula</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24" style={{ backgroundColor: colors.white }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span 
              className="text-sm font-semibold tracking-wider uppercase mb-4 block"
              style={{ color: colors.terra }}
            >
              What We Believe
            </span>
            <h2 
              className="text-4xl md:text-5xl font-semibold"
              style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
            >
              Our guiding principles
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, i) => (
              <div 
                key={i}
                className="p-8 rounded-3xl border-2"
                style={{ borderColor: colors.dune }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: colors.terra }}
                >
                  <span className="text-white font-bold">{i + 1}</span>
                </div>
                <h3 
                  className="text-2xl font-semibold mb-4"
                  style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                >
                  {value.title}
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: colors.bark }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ backgroundColor: colors.sand }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 
            className="text-4xl md:text-5xl font-semibold mb-6"
            style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
          >
            We built the framework. You bring the magic.
          </h2>
          <p className="text-xl mb-10" style={{ color: colors.bark }}>
            Join a growing community of caregivers committed to exceptional early childhood experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('apply')}
              className="group px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.terra, color: colors.white }}
            >
              Apply as a Caregiver
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <a 
              href="https://app.theformula.care"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2 border-2"
              style={{ borderColor: colors.terra, color: colors.terra, backgroundColor: 'transparent' }}
            >
              See How It Works
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

// Apply Page (Nanny Application)
const ApplyPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    certifications: '',
    availability: '',
    aboutYou: '',
    whyFormula: ''
  });
  const [submitted, setSubmitted] = useState(false);

const encode = (data) =>
    Object.keys(data)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
      .join('&');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'caregiver-application', ...formData }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Form submission error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div style={{ backgroundColor: colors.cream }} className="min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: colors.terra }}
          >
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 
            className="text-4xl font-semibold mb-6"
            style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
          >
            Application Received!
          </h1>
          <p className="text-lg mb-8" style={{ color: colors.bark }}>
            Thank you for your interest in The Formula. We'll review your application 
            and be in touch within 3-5 business days.
          </p>
          <button 
            onClick={() => setCurrentPage('home')}
            className="px-8 py-4 rounded-full text-lg font-semibold"
            style={{ backgroundColor: colors.terra, color: colors.white }}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.cream }}>
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 
              className="text-5xl md:text-6xl font-semibold mb-6"
              style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
            >
              Join The Formula
            </h1>
            <p className="text-xl" style={{ color: colors.bark }}>
              Apply to become a Formula-certified caregiver and get access to our full toolkit.
            </p>
          </div>

          <div 
            className="rounded-3xl p-8 md:p-12"
            style={{ backgroundColor: colors.white }}
          >
           <form
  onSubmit={handleSubmit}
  className="space-y-8"
  data-netlify="true"
  data-netlify-honeypot="bot-field"
  name="caregiver-application"
>
  <input type="hidden" name="form-name" value="caregiver-application" />
  <input type="hidden" name="bot-field" />
              {/* Personal Info */}
              <div>
                <h3 
                  className="text-xl font-semibold mb-6"
                  style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                >
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                      style={{ borderColor: colors.dune, color: colors.wood }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                      style={{ borderColor: colors.dune, color: colors.wood }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                      style={{ borderColor: colors.dune, color: colors.wood }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                      style={{ borderColor: colors.dune, color: colors.wood }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                      Location (City, State) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                      style={{ borderColor: colors.dune, color: colors.wood }}
                    />
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 
                  className="text-xl font-semibold mb-6"
                  style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                >
                  Experience & Qualifications
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                      Years of Childcare Experience *
                    </label>
                    <select
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                      style={{ borderColor: colors.dune, color: colors.wood }}
                    >
                      <option value="">Select...</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                      Certifications (CPR, First Aid, ECE, etc.)
                    </label>
                    <input
                      type="text"
                      value={formData.certifications}
                      onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                      placeholder="e.g., CPR Certified, First Aid, Child Development Associate"
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                      style={{ borderColor: colors.dune, color: colors.wood }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                      Availability *
                    </label>
                    <select
                      required
                      value={formData.availability}
                      onChange={(e) => setFormData({...formData, availability: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors"
                      style={{ borderColor: colors.dune, color: colors.wood }}
                    >
                      <option value="">Select...</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="flexible">Flexible</option>
                      <option value="live-in">Live-in</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* About You */}
              <div>
                <h3 
                  className="text-xl font-semibold mb-6"
                  style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
                >
                  Tell Us About Yourself
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                      Describe your childcare philosophy and experience *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.aboutYou}
                      onChange={(e) => setFormData({...formData, aboutYou: e.target.value})}
                      placeholder="Tell us about your approach to childcare, memorable experiences, and what makes you a great caregiver..."
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors resize-none"
                      style={{ borderColor: colors.dune, color: colors.wood }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.bark }}>
                      Why do you want to join The Formula? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.whyFormula}
                      onChange={(e) => setFormData({...formData, whyFormula: e.target.value})}
                      placeholder="What excites you about using structured curricula and professional tools in your childcare?"
                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors resize-none"
                      style={{ borderColor: colors.dune, color: colors.wood }}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl"
                style={{ backgroundColor: colors.terra, color: colors.white }}
              >
                Submit Application
              </button>

              <p className="text-sm text-center" style={{ color: colors.bark }}>
                By submitting, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

// Login Page - Redirects to Live App
const LoginPage = ({ setCurrentPage }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: colors.cream }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 mx-auto mb-8 group"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: colors.terra }}
            >
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span 
              className="text-2xl font-semibold tracking-tight"
              style={{ color: colors.wood, fontFamily: "'Playfair Display', serif" }}
            >
              The Formula
            </span>
          </button>
          <h1 
            className="text-3xl font-semibold mb-2"
            style={{ color: colors.charcoal, fontFamily: "'Playfair Display', serif" }}
          >
            Ready to get started?
          </h1>
          <p style={{ color: colors.bark }}>Access The Formula app</p>
        </div>

        <div 
          className="rounded-3xl p-8 text-center"
          style={{ backgroundColor: colors.white }}
        >
          <div className="mb-6">
            <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: colors.terra }} />
            <p className="text-lg mb-2" style={{ color: colors.wood }}>
              The Formula is now live!
            </p>
            <p className="text-sm" style={{ color: colors.bark }}>
              Click below to launch the app and sign in or create your account.
            </p>
          </div>
          
          <a 
            href="https://theformula-app.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl"
            style={{ backgroundColor: colors.terra, color: colors.white }}
          >
            Launch The Formula
          </a>

          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: colors.sand }}>
            <p className="text-sm" style={{ color: colors.bark }}>
              Interested in becoming a caregiver?{' '}
              <button 
                onClick={() => setCurrentPage('apply')}
                className="font-semibold"
                style={{ color: colors.terra }}
              >
                Apply now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = ({ setCurrentPage }) => {
  return (
    <footer style={{ backgroundColor: colors.charcoal }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.terra }}
              >
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span 
                className="text-xl font-semibold tracking-tight text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                The Formula
              </span>
            </div>
            <p className="text-lg mb-6" style={{ color: colors.dune }}>
              Modern tools. Better care.<br />
              The digital toolkit for exceptional childcare.
            </p>
            <div className="flex gap-4">
              {['twitter', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: colors.bark }}
                >
                  <span className="text-white text-sm capitalize">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-3">
              {[
                { label: 'Home', page: 'home' },
                { label: 'About', page: 'about' },
                { label: 'Our Story', page: 'story' },
                { label: 'For Families', page: 'families' },
                { label: 'For Caregivers', page: 'apply' }
              ].map((link) => (
                <button
                  key={link.page}
                  onClick={() => setCurrentPage(link.page)}
                  className="block transition-colors hover:underline"
                  style={{ color: colors.dune }}
                >
                  {link.label}
                </button>
              ))}
              <a
                href="https://theformula-app.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:underline"
                style={{ color: colors.dune }}
              >
                Launch App
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2" style={{ color: colors.dune }}>
                <Mail className="w-4 h-4" />
                <span>reach.theformula@gmail.com</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: colors.dune }}>
                <MapPin className="w-4 h-4" />
                <span>Chicago, IL</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: colors.bark }}
        >
          <p className="text-sm" style={{ color: colors.bark }}>
            © 2026 The Formula. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm transition-colors hover:underline" style={{ color: colors.bark }}>
              Privacy Policy
            </a>
            <a href="#" className="text-sm transition-colors hover:underline" style={{ color: colors.bark }}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
export default function FormulaWebsite() {
  const [currentPage, setCurrentPage] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Load Playfair Display font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Set body font
    document.body.style.fontFamily = "'DM Sans', sans-serif";
    
    return () => {
      document.head.removeChild(link);
      document.body.style.fontFamily = '';
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      {currentPage !== 'login' && (
        <Navigation 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          scrolled={scrolled}
        />
      )}
      
      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'about' && <AboutPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'story' && <OurStoryPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'families' && <FamiliesPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'apply' && <ApplyPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} />}
    </div>
  );
}
