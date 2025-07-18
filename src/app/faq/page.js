"use client";

import React, { useState } from 'react';
import { useRef } from 'react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      question: "What strings should I choose?",
      answer: "String choice depends on your playing level, style, and racket type. For beginners, we recommend synthetic gut strings for their durability and comfort. Advanced players often prefer multifilament or polyester strings for greater control and responsiveness. Visit our String Options page for detailed descriptions and personalized recommendations.",
      category: "String Selection",
      icon: "🧵"
    },
    {
      question: "What tension should I use for my strings?",
      answer: "Tension affects power, control, and feel.\n\nLower tension (16–20 lbs for badminton, 40–50for tennis) offers more power and a softer feel—ideal for beginners.\nHigher tension (25–35 lbs for badminton, 55–70r tennis) provides better control for experienced players.\nCheck our Tension Guide on the Services page for skill-level-specific recommendations.",
      category: "Tension",
      icon: "⚖️"
    },
    {
      question: "How long does stringing take?",
      answer: "We offer three turnaround options:\n\nSame Day – $35t be booked before 20 AM)\nNext Day – $30\n3–5 Days – $25 (standard service)\nAll services include string selection from our in-stock options.",
      category: "Service Time",
      icon: "⏰"
    },
    {
      question: "Can I provide my own string?",
      answer: "Yes! You're welcome to bring your own string for a $30e. This is a great option if you have a specific preference or want to try a string we don't carry. Simply select \Own String\ when booking and bring the string with your racket.",
      category: "Service Option",
      icon: "🎯"
    },
    {
      question: "What is grommet replacement, and when is it needed?",
      answer: "Grommets are small plastic inserts that protect your strings from the racket frame. Over time, they can wear out—especially on older rackets. We charge $0.25t for replacements. We'll inspect your racket and recommend replacements if needed to prevent string breakage.",
      category: "Maintenance",
      icon: "🔧"
    },
    {
      question: "How often should I restring my racket?",
      answer: "It depends on how frequently you play:\n\nRecreational players (1–2x/week): every 3–6 months\nRegular players (3–4x/week): every 2onths\nCompetitive players: monthly or even weekly\nStrings lose tension and performance over time, even if they don't break.",
      category: "Maintenance",
      icon: "📅"
    },
    {
      question: "What's the difference between tennis and badminton strings?",
      answer: "Tennis strings are thicker and built for higher tension (40–70s) and larger racket heads. Badminton strings are thinner, designed for lower tension (16–35 lbs), and smaller, more flexible rackets. Using the wrong type of string can damage your racket and hinder performance.",
      category: "String Selection",
      icon: "🏸"
    },
    {
      question: "Do you offer a warranty on stringing services?",
      answer: "We carefully inspect every racket before stringing and use professional techniques. However, we cannot guarantee against breakage due to regular wear, mishandling, or pre-existing damage. Strings may break from impact, tension loss, or manufacturing defects. Please note that all service fees are non-refundable.",
      category: "Service Policy",
      icon: "🛡️"
    },
    {
      question: "Where can I drop off and pick up my racket?",
      answer: "We offer convenient pickup and drop-off options at:\n\nWiser Park Tennis Courts\nAngus Glen Community Centre\nDoor-to-door pickup (by appointment)\nYou can select your preferred location and time when booking. We'll coordinate logistics based on your availability and ours.",
      category: "Service Locations",
      icon: "📍"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash only.\n\nPayment is due upon pickup. Please have exact change ready.",
      category: "Payment Options",
      icon: "💳"
    },
    {
      question: "Can you string any type of racket?",
      answer: "We specialize in stringing tennis and badminton rackets. Most modern rackets are supported. If you have a vintage or specialty racket, please contact us in advance to confirm service availability.",
      category: "Service Coverage",
      icon: "🎾"
    },
    {
      question: "How do I know if my racket needs restringing?",
      answer: "Common signs your racket needs restringing include:\n\nFraying or broken strings\nStrings feeling loose or &quot;dead&quot;\nLoss of control or power\nIt&apos;s been more than 6 months since your last restring,",
      category: "Maintenance",
      icon: "🔍"
    }
  ];

  const categories = [...new Set(faqData.map(item => item.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqData = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  // Helper for smooth accordion animation
  const answerRefs = useRef([]);

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '3.5rem 0 2.5rem 0', position: 'relative', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, boxShadow: '0 8px 32px rgba(102,126,234,0.10)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>Frequently Asked Questions</h1>
          <p style={{ fontSize: '1.25rem', color: '#e0e7ff', marginBottom: '2.2rem', fontWeight: 500 }}>Everything you need to know about our stringing services</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: '1.05rem', color: 'white' }}>🎾 Tennis & Badminton</span>
            <span style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: '1.05rem', color: 'white' }}>⚡ Same-Day Service</span>
            <span style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: '1.05rem', color: 'white' }}>📍 Multiple Locations</span>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ padding: '2.5rem 0 1.5rem 0', background: 'white', borderBottom: '1.5px solid #e9ecef' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('All')}
            style={{
              padding: '0.7rem 1.7rem',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              background: selectedCategory === 'All' ? 'linear-gradient(90deg, #667eea 60%, #764ba2 100%)' : '#f3f4f6',
              color: selectedCategory === 'All' ? 'white' : '#333',
              boxShadow: selectedCategory === 'All' ? '0 2px 8px rgba(102,126,234,0.13)' : 'none',
              transition: 'all 0.18s',
              cursor: 'pointer',
            }}
          >
            All Questions
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '0.7rem 1.7rem',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                background: selectedCategory === category ? 'linear-gradient(90deg, #667eea 60%, #764ba2 100%)' : '#f3f4f6',
                color: selectedCategory === category ? 'white' : '#333',
                boxShadow: selectedCategory === category ? '0 2px 8px rgba(102,126,234,0.13)' : 'none',
                transition: 'all 0.18s',
                cursor: 'pointer',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Content */}
      <section style={{ padding: '3.5rem 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredFaqData.map((item, index) => (
              <div key={index} style={{ background: 'white', borderRadius: 24, boxShadow: '0 4px 24px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef', overflow: 'hidden', transition: 'box-shadow 0.18s' }}>
                <button
                  onClick={() => toggleItem(index)}
                  style={{
                    width: '100%',
                    padding: '2rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    transition: 'background 0.15s',
                  }}
                >
                  <span style={{ fontSize: '2rem', marginTop: 2 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.18rem', color: '#1a1a1a', marginBottom: 6, letterSpacing: '-0.01em' }}>{item.question}</div>
                    <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.25rem 0.9rem', borderRadius: 999, fontWeight: 600, fontSize: '0.98rem', letterSpacing: '0.01em' }}>{item.category}</span>
                  </div>
                  <span style={{
                    display: 'inline-block',
                    transition: 'transform 0.25s',
                    fontSize: '2.1rem',
                    color: openItems.has(index) ? '#6c63ff' : '#bdbdbd',
                    transform: openItems.has(index) ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}>❯</span>
                </button>
                <div
                  ref={el => answerRefs.current[index] = el}
                  style={{
                    maxHeight: openItems.has(index) ? 'none' : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
                    background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ff 100%)',
                    borderTop: openItems.has(index) ? '1.5px solid #e0e7ff' : 'none',
                  }}
                >
                  <div style={{ padding: openItems.has(index) ? '1.5rem 2rem' : '0 2rem', opacity: openItems.has(index) ? 1 : 0, transition: 'opacity 0.18s' }}>
                    <div style={{ fontSize: '1.08rem', color: '#333', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{item.answer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
            <div style={{ background: 'white', borderRadius: 20, padding: '2rem 1.5rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>⚡</div>
              <div style={{ fontWeight: 700, fontSize: '1.18rem', color: '#1a1a1a', marginBottom: 6 }}>Same-Day Service</div>
              <div style={{ color: '#666', fontSize: '1.01rem' }}>Book before 2:00 AM for same-day pick-up</div>
            </div>
            <div style={{ background: 'white', borderRadius: 20, padding: '2rem 1.5rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>🎾</div>
              <div style={{ fontWeight: 700, fontSize: '1.18rem', color: '#1a1a1a', marginBottom: 6 }}>Professional Quality</div>
              <div style={{ color: '#666', fontSize: '1.01rem' }}>Expert stringing with premium materials</div>
            </div>
            <div style={{ background: 'white', borderRadius: 20, padding: '2rem 1.5rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>📍</div>
              <div style={{ fontWeight: 700, fontSize: '1.18rem', color: '#1a1a1a', marginBottom: 6 }}>Convenient Locations</div>
              <div style={{ color: '#666', fontSize: '1.01rem' }}>Multiple pick-up and drop-off points</div>
            </div>
          </div>

          {/* Contact Section */}
          <div style={{ marginTop: 60, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', borderRadius: 28, padding: '3rem 1.5rem', color: 'white', boxShadow: '0 8px 32px rgba(102,126,234,0.13)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.01em' }}>Still Have Questions?</h2>
            <p style={{ fontSize: '1.18rem', color: '#e0e7ff', marginBottom: '2.2rem', fontWeight: 500 }}>Can't find the answer you're looking for? We're here to help!</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
              <a
                href="/locations"
                style={{ background: 'white', color: '#6c63ff', padding: '1.1rem 2.5rem', borderRadius: 16, fontWeight: 700, fontSize: '1.08rem', boxShadow: '0 2px 12px rgba(102,126,234,0.10)', textDecoration: 'none', transition: 'background 0.18s, color 0.18s, transform 0.13s', display: 'inline-block' }}
                onMouseOver={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.transform = 'scale(1.045)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#6c63ff'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                📞 Contact Us
              </a>
              <a
                href="/booking"
                style={{ background: 'linear-gradient(90deg, #6c63ff 60%, #667eea 100%)', color: 'white', padding: '1.1rem 2.5rem', borderRadius: 16, fontWeight: 700, fontSize: '1.08rem', boxShadow: '0 2px 12px rgba(102,126,234,0.10)', textDecoration: 'none', transition: 'background 0.18s, color 0.18s, transform 0.13s', display: 'inline-block' }}
                onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #667eea 60%, #6c63ff 100%)'; e.currentTarget.style.transform = 'scale(1.045)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #6c63ff 60%, #667eea 100%)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                🎾 Book Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 