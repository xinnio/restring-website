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
      question: "What stringing services do you offer?",
      answer: "We offer professional stringing for both tennis and badminton rackets. Our services include:\n\n• Same-day service (book before 2:00 AM)\n• Next-day service\n• 3-5 day standard service\n• Own string service (+$3)\n• Grommet replacement ($0.25 each)\n\nAll services include professional stringing with quality strings from our inventory.",
      category: "Services",
      icon: "🎾"
    },
    {
      question: "How much does stringing cost?",
      answer: "Our pricing is based on turnaround time:\n\n• Same-day service: $35\n• Next-day service: $30\n• 3-5 day service: $25\n\nAdditional services:\n• Own string: +$3\n• Grommet replacement: $0.25 each\n\nAll prices include quality strings and professional stringing.",
      category: "Pricing",
      icon: "💰"
    },
    {
      question: "What strings do you use?",
      answer: "We stock a variety of high-quality strings for both tennis and badminton. Our inventory includes popular brands like Yonex, Victor, Li-Ning, and more. String selection varies based on availability, but we always use professional-grade strings suitable for your racket type and playing level.",
      category: "Strings",
      icon: "🧵"
    },
    {
      question: "How long does stringing take?",
      answer: "Stringing time depends on your chosen service:\n\n• Same-day: Book before 2:00 AM for same-day pick-up\n• Next-day: Book anytime for next-day pick-up\n• Standard: 3-5 business days\n\nActual stringing takes about 30-45 minutes per racket, but we batch orders for efficiency.",
      category: "Timing",
      icon: "⏰"
    },
    {
      question: "Can I bring my own string?",
      answer: "Yes! You can bring your own string for an additional $3 fee. This is perfect if you have a specific string preference or brand loyalty. We'll string your racket with your string using the same professional techniques.",
      category: "Services",
      icon: "🎯"
    },
    {
      question: "What tension should I use?",
      answer: "Tension recommendations vary by skill level and playing style:\n\nBadminton:\n• Beginner: 19-23 lbs\n• Intermediate: 22-26 lbs\n• Advanced: 25-29 lbs\n\nTennis:\n• Beginner: 50-60 lbs\n• Intermediate: 55-65 lbs\n• Advanced: 60-70 lbs\n\nWe can help you choose the right tension based on your experience and preferences.",
      category: "Technical",
      icon: "⚖️"
    },
    {
      question: "Do you offer a warranty on stringing services?",
      answer: "We carefully inspect every racket before stringing and use professional techniques. However, we cannot guarantee against breakage due to regular wear, mishandling, or pre-existing damage. Strings may break from impact, tension loss, or manufacturing defects. Please note that all service fees are non-refundable.",
      category: "Service Policy",
      icon: "🛡️"
    },
    {
      question: "Where can I drop off and pick up my racket?",
      answer: "We offer convenient pickup and drop-off options at:\n\nWiser Park Tennis Courts\nAngus Glen Community Centre\nDoor-to-door pickup (by appointment)\nYou can select your preferred location and time when booking. We&apos;ll coordinate logistics based on your availability and ours.",
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
      answer: "Common signs your racket needs restringing include:\n\nFraying or broken strings\nStrings feeling loose or &quot;dead&quot;\nLoss of control or power\nIt&apos;s been more than 6 months since your last restring.",
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
          <h1 style={{ fontSize: '2.675rem', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>Frequently Asked Questions</h1>
          <p style={{ fontSize: '1.125rem', color: '#e0e7ff', marginBottom: '2.2rem', fontWeight: 500 }}>Everything you need to know about our stringing services</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: '0.925rem', color: 'white' }}>🎾 Tennis & Badminton</span>
            <span style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: '0.925rem', color: 'white' }}>⚡ Same-Day Service</span>
            <span style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: '0.925rem', color: 'white' }}>📍 Multiple Locations</span>
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
              fontSize: '0.875rem',
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
                fontSize: '0.875rem',
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
                  <span style={{ fontSize: '1.875rem', marginTop: 2 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.055rem', color: '#1a1a1a', marginBottom: 6, letterSpacing: '-0.01em' }}>{item.question}</div>
                    <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.25rem 0.9rem', borderRadius: 999, fontWeight: 600, fontSize: '0.855rem', letterSpacing: '0.01em' }}>{item.category}</span>
                  </div>
                  <span style={{
                    display: 'inline-block',
                    transition: 'transform 0.25s',
                    fontSize: '1.975rem',
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
                    <div style={{ fontSize: '0.955rem', color: '#333', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{item.answer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
            <div style={{ background: 'white', borderRadius: 20, padding: '2rem 1.5rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef' }}>
              <div style={{ fontSize: '2.075rem', marginBottom: 12 }}>⚡</div>
              <div style={{ fontWeight: 700, fontSize: '1.055rem', color: '#1a1a1a', marginBottom: 6 }}>Same-Day Service</div>
              <div style={{ color: '#666', fontSize: '0.885rem' }}>Book before 2:00 AM for same-day pick-up</div>
            </div>
            <div style={{ background: 'white', borderRadius: 20, padding: '2rem 1.5rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef' }}>
              <div style={{ fontSize: '2.075rem', marginBottom: 12 }}>🎾</div>
              <div style={{ fontWeight: 700, fontSize: '1.055rem', color: '#1a1a1a', marginBottom: 6 }}>Professional Quality</div>
              <div style={{ color: '#666', fontSize: '0.885rem' }}>Expert stringing with premium materials</div>
            </div>
            <div style={{ background: 'white', borderRadius: 20, padding: '2rem 1.5rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef' }}>
              <div style={{ fontSize: '2.075rem', marginBottom: 12 }}>📍</div>
              <div style={{ fontWeight: 700, fontSize: '1.055rem', color: '#1a1a1a', marginBottom: 6 }}>Convenient Locations</div>
              <div style={{ color: '#666', fontSize: '0.885rem' }}>Multiple pick-up and drop-off points</div>
            </div>
          </div>

          {/* Contact Section */}
          <div style={{ marginTop: 60, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', borderRadius: 28, padding: '3rem 1.5rem', color: 'white', boxShadow: '0 8px 32px rgba(102,126,234,0.13)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.975rem', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.01em' }}>Still Have Questions?</h2>
            <p style={{ fontSize: '1.055rem', color: '#e0e7ff', marginBottom: '2.2rem', fontWeight: 500 }}>Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help!</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
              <a
                href="/locations"
                style={{ background: 'white', color: '#6c63ff', padding: '1.1rem 2.5rem', borderRadius: 16, fontWeight: 700, fontSize: '0.955rem', boxShadow: '0 2px 12px rgba(102,126,234,0.10)', textDecoration: 'none', transition: 'background 0.18s, color 0.18s, transform 0.13s', display: 'inline-block' }}
                onMouseOver={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.transform = 'scale(1.045)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#6c63ff'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                📞 Contact Us
              </a>
              <a
                href="/booking"
                style={{ background: 'linear-gradient(90deg, #6c63ff 60%, #667eea 100%)', color: 'white', padding: '1.1rem 2.5rem', borderRadius: 16, fontWeight: 700, fontSize: '0.955rem', boxShadow: '0 2px 12px rgba(102,126,234,0.10)', textDecoration: 'none', transition: 'background 0.18s, color 0.18s, transform 0.13s', display: 'inline-block' }}
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