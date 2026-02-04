// src/components/AutomationTimeline.jsx
import React, { useState } from 'react';
import './AutomationTimeline.css';

function AutomationTimeline({ userName = "Rahul", scenario = "no_booking" }) {
  const [activeTab, setActiveTab] = useState('timeline');

  // Different automation flows based on user action
  const automationFlows = {
    no_booking: [
      {
        time: '1 hour after chat',
        icon: '📱',
        channel: 'WhatsApp',
        title: 'Gentle Reminder',
        preview: `Hi ${userName}! 👋 Thanks for chatting with us about Data Engineering. I noticed you had some questions about the program. Would you like me to send you more details or schedule a quick call?`,
        status: 'scheduled',
        cta: 'Book Call | More Info'
      },
      {
        time: '24 hours later',
        icon: '📧',
        channel: 'Email',
        title: 'Personalized Roadmap',
        preview: `Subject: Your Personalized Data Engineering Career Roadmap\n\nHey ${userName},\n\nBased on our conversation, I've created a custom learning path for you...\n\n✅ Skills you need\n✅ Timeline: 6 months\n✅ Expected outcome: ₹8-12 LPA roles\n\n[Download Your Roadmap] [Book Free Consultation]`,
        status: 'scheduled',
        cta: 'Download PDF | Book Call'
      },
      {
        time: '3 days later',
        icon: '📱',
        channel: 'WhatsApp',
        title: 'Final Reminder + Offer',
        preview: `Hi ${userName}! This is your last chance to grab our limited-time offer 🎯\n\n💰 Get ₹20,000 OFF on Data Engineering Program\n⏰ Offer expires in 48 hours\n\nOur advisors can help you decide if this is right for you.\n\n[Book Free Call Now]`,
        status: 'scheduled',
        cta: 'Book Call'
      }
    ],
    booked: [
      {
        time: 'Immediately',
        icon: '✅',
        channel: 'WhatsApp + Email',
        title: 'Booking Confirmation',
        preview: `✅ Consultation Confirmed!\n\nHi ${userName}, your consultation is booked for:\n📅 Thursday, Feb 6 at 3:00 PM\n👤 Career Advisor: Amit Kumar\n\n📎 Calendar invite sent to your email\n📱 We'll remind you 1 hour before`,
        status: 'sent',
        cta: 'Add to Calendar'
      },
      {
        time: '24 hours before call',
        icon: '🔔',
        channel: 'WhatsApp',
        title: 'Preparation Reminder',
        preview: `Hey ${userName}! Your consultation is tomorrow at 3 PM 📅\n\nTo make the most of our call, please:\n✅ List your career goals\n✅ Note any questions\n✅ Have your resume ready\n\nSee you tomorrow!`,
        status: 'scheduled',
        cta: 'None'
      },
      {
        time: '1 hour before call',
        icon: '⏰',
        channel: 'WhatsApp + Email',
        title: 'Final Reminder',
        preview: `🔔 Reminder: Your call starts in 1 hour!\n\n⏰ Time: 3:00 PM\n👤 Advisor: Amit Kumar\n🔗 Join here: [Meeting Link]\n\nSee you soon, ${userName}!`,
        status: 'scheduled',
        cta: 'Join Meeting'
      },
      {
        time: 'If no-show',
        icon: '❓',
        channel: 'WhatsApp',
        title: 'Missed Call Follow-up',
        preview: `Hi ${userName}, we missed you at our scheduled call today 😞\n\nNo worries! Life happens. Would you like to reschedule?\n\n[Reschedule Now] [Cancel Booking]`,
        status: 'conditional',
        cta: 'Reschedule'
      }
    ]
  };

  const messages = automationFlows[scenario];

  // Sample message templates for different channels
  const messageTemplates = {
    whatsapp: {
      title: 'WhatsApp Message Templates',
      templates: [
        {
          name: 'Initial Follow-up',
          preview: `Hi ${userName}! 👋\n\nThanks for attending our Data Engineering masterclass. I noticed you were exploring our program.\n\nWould you like to:\n1️⃣ See detailed curriculum\n2️⃣ Discuss payment options\n3️⃣ Book a free consultation\n\nJust reply with the number! 😊`
        },
        {
          name: 'Objection Handler - Price',
          preview: `I totally understand, ${userName}! ₹2L is a big investment.\n\nHere's the thing:\n💰 No-cost EMI: Just ₹8,333/month\n📈 Avg salary jump: ₹6 LPA\n🎯 ROI: Program pays for itself in 4 months!\n\nWant to chat with our advisor about this?`
        },
        {
          name: 'Objection Handler - Time',
          preview: `Great question, ${userName}!\n\n⏰ Our program needs:\n• 10-12 hrs/week\n• Flexible schedule (evenings/weekends)\n• All classes recorded\n• Self-paced assignments\n\n95% of our students work full-time while learning!\n\nSound manageable?`
        }
      ]
    },
    email: {
      title: 'Email Sequence Templates',
      templates: [
        {
          name: 'Day 1: Roadmap Email',
          preview: `Subject: Your Personalized Data Engineering Roadmap 🗺️\n\nHi ${userName},\n\nBased on our chat, here's your custom learning path:\n\nCURRENT STATE:\n→ Software Engineer with 3 years experience\n\nDESIRED STATE:\n→ Data Engineer at top tech companies\n\nYOUR 6-MONTH ROADMAP:\n\nMonth 1-2: Python & SQL Mastery\nMonth 3-4: Big Data Tools (Spark, Kafka)\nMonth 5-6: Cloud & Projects (AWS, Real-world)\n\nEXPECTED OUTCOME:\n💼 Roles: ₹12-18 LPA\n🎯 Companies: Amazon, Flipkart, Swiggy\n\n[Download Full Roadmap PDF]\n[Book Free Consultation]\n\nBest,\nScaler Team`
        },
        {
          name: 'Day 3: Success Stories',
          preview: `Subject: How Priya went from ₹8 LPA → ₹18 LPA in 7 months\n\nHi ${userName},\n\nYou remind me of Priya!\n\nShe was:\n✅ Working full-time\n✅ Worried about time commitment\n✅ Unsure about career switch\n\nToday:\n💼 Data Engineer at Amazon\n💰 ₹18 LPA package\n⏱️ Made the switch in 7 months\n\n[Read Priya's Full Story]\n[See 50+ More Success Stories]`
        }
      ]
    }
  };

  return (
    <div className="automation-timeline">
      <div className="automation-header">
        <div className="automation-icon">🤖</div>
        <h3>Smart Follow-up Automation</h3>
        <p className="automation-subtitle">
          Here's what happens behind the scenes after your chat
        </p>
      </div>

      <div className="scenario-switcher">
        <button 
          className={`scenario-btn ${scenario === 'no_booking' ? 'active' : ''}`}
          onClick={() => window.location.href = '#'}
        >
          📱 If User Doesn't Book
        </button>
        <button 
          className={`scenario-btn ${scenario === 'booked' ? 'active' : ''}`}
          onClick={() => window.location.href = '#'}
        >
          ✅ If User Books Call
        </button>
      </div>

      <div className="automation-tabs">
        <button 
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          📅 Timeline View
        </button>
        <button 
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          💬 Message Templates
        </button>
      </div>

      {activeTab === 'timeline' && (
        <div className="timeline-view">
          <div className="timeline-list">
            {messages.map((item, index) => (
              <div key={index} className={`timeline-card ${item.status}`}>
                <div className="timeline-card-header">
                  <div className="timeline-left">
                    <span className="timeline-card-icon">{item.icon}</span>
                    <div className="timeline-info">
                      <span className="timeline-channel-badge">{item.channel}</span>
                      <span className="timeline-time-text">{item.time}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${item.status}`}>
                    {item.status === 'scheduled' && '⏰ Scheduled'}
                    {item.status === 'sent' && '✅ Sent'}
                    {item.status === 'conditional' && '🔀 Conditional'}
                  </span>
                </div>
                
                <h4 className="timeline-card-title">{item.title}</h4>
                
                <div className="message-preview">
                  {item.preview}
                </div>
                
                {item.cta && item.cta !== 'None' && (
                  <div className="message-cta">
                    <strong>Call-to-Action:</strong> {item.cta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="templates-view">
          <div className="template-section">
            <h4 className="template-section-title">
              {messageTemplates.whatsapp.title}
            </h4>
            <div className="template-list">
              {messageTemplates.whatsapp.templates.map((template, index) => (
                <div key={index} className="template-card whatsapp">
                  <div className="template-header">
                    <span className="template-icon">📱</span>
                    <span className="template-name">{template.name}</span>
                  </div>
                  <div className="template-preview">
                    {template.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="template-section">
            <h4 className="template-section-title">
              {messageTemplates.email.title}
            </h4>
            <div className="template-list">
              {messageTemplates.email.templates.map((template, index) => (
                <div key={index} className="template-card email">
                  <div className="template-header">
                    <span className="template-icon">📧</span>
                    <span className="template-name">{template.name}</span>
                  </div>
                  <div className="template-preview">
                    {template.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="automation-stats">
        <div className="stat-item">
          <div className="stat-value">3x</div>
          <div className="stat-label">Higher Conversion</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">85%</div>
          <div className="stat-label">Open Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">40%</div>
          <div className="stat-label">Response Rate</div>
        </div>
      </div>

      <div className="automation-tech">
        <strong>🔧 Technology Stack:</strong>
        <div className="tech-badges">
          <span className="tech-badge">n8n Workflows</span>
          <span className="tech-badge">Twilio WhatsApp API</span>
          <span className="tech-badge">SendGrid Email</span>
          <span className="tech-badge">Supabase Database</span>
        </div>
      </div>
    </div>
  );
}

export default AutomationTimeline;