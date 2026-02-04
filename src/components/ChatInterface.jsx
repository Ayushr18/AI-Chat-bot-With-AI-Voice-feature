// src/components/ChatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import BookingWidget from './BookingWidget';
import QuickReplies from './QuickReplies';
import './ChatInterface.css';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [quickReplies, setQuickReplies] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  // User context - In production, this comes from database/session
  const userContext = {
    userName: "Rahul",
    userEmail: "rahul.sharma@example.com",
    userPhone: "9876543210",
    masterclassTopic: "Data Engineering",
    attendedDate: "2026-02-03",
    leadSource: "masterclass"
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showBooking, quickReplies]);

  // Voice output - AI speaks the message
  const speakMessage = (text) => {
    if (!isVoiceEnabled) return;
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.1; // Slightly higher pitch for friendliness
      utterance.volume = 1;
      utterance.lang = 'en-US';
      
      // Try to use a pleasant voice
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Prefer female/Google voices for friendlier tone
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google') ||
          voice.name.includes('Female') ||
          voice.name.includes('Samantha') ||
          voice.name.includes('Karen') ||
          voice.name.includes('Zira')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      };
      
      // Load voices (some browsers need this)
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      // Track speaking state
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      // Speak!
      window.speechSynthesis.speak(utterance);
      
      console.log('🔊 Speaking:', text);
    }
  };

  // Toggle voice on/off
  const toggleVoice = () => {
    setIsVoiceEnabled(prev => !prev);
    if (isVoiceEnabled) {
      // If turning off, stop any current speech
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Welcome message on load
  useEffect(() => {
    const welcomeMessage = {
      text: "Hey! 👋 Thanks for attending the Data Engineering masterclass! What did you think of it?",
      sender: 'ai',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
    
    // Speak welcome message after a short delay
    setTimeout(() => {
      speakMessage(welcomeMessage.text);
    }, 1000);
    
    // Set initial quick replies
    setQuickReplies([
      { label: "It was great! 🎉", icon: "🎉", value: "It was really great!" },
      { label: "Need more info ℹ️", icon: "ℹ️", value: "I need more information about the program" }
    ]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Detect if AI suggests booking
  const detectBookingIntent = (aiMessage) => {
    const bookingKeywords = [
      'book a consultation',
      'speak with our advisor',
      'speak with an advisor',
      'schedule a call',
      'book a call',
      'would you like to book',
      'talk to our career advisor',
      'connect you with',
      'free consultation',
      '30-min call',
      'book you a free'
    ];
    
    return bookingKeywords.some(keyword => 
      aiMessage.toLowerCase().includes(keyword)
    );
  };

  // Handle sending message
  const handleSendMessage = async (userMessage) => {
    // Clear quick replies when user sends a message
    setQuickReplies(null);
    
    // Stop any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    // Add user message
    const newUserMessage = {
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
      // Call backend
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage,
        conversationHistory: messages,
        userContext: userContext
      });

      // Add AI response
      const aiMessage = {
        text: response.data.message,
        sender: 'ai',
        timestamp: response.data.timestamp
      };

      setMessages(prev => [...prev, aiMessage]);

      // Speak the AI response
      setTimeout(() => {
        speakMessage(aiMessage.text);
      }, 500);

      // Set quick replies if available from backend
      if (response.data.quickReplies && response.data.quickReplies.length > 0) {
        setQuickReplies(response.data.quickReplies);
      } else {
        // Fallback: Set default quick replies based on conversation context
        setDefaultQuickReplies(aiMessage.text);
      }

      // Check if AI is suggesting booking
      if (detectBookingIntent(response.data.message)) {
        setTimeout(() => {
          setShowBooking(true);
          setQuickReplies(null);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting. Please try again!",
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Speak error message
      speakMessage(errorMessage.text);
      
      // Add retry quick reply
      setQuickReplies([
        { label: "🔄 Try again", icon: "🔄", value: userMessage }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Set default quick replies based on AI message content
  const setDefaultQuickReplies = (aiMessage) => {
    const lowerMessage = aiMessage.toLowerCase();
    
    // Check for different contexts and provide relevant quick replies
    if (lowerMessage.includes('career') || lowerMessage.includes('goals')) {
      setQuickReplies([
        { label: "Career growth 📈", icon: "📈", value: "I want to grow in my current role" },
        { label: "Switch careers 🔄", icon: "🔄", value: "I want to switch to a different role" },
        { label: "Learn new skills 🎓", icon: "🎓", value: "I want to learn new technical skills" }
      ]);
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
      setQuickReplies([
        { label: "💳 EMI options", icon: "💳", value: "Tell me about EMI options" },
        { label: "💰 ROI details", icon: "💰", value: "What's the return on investment?" },
        { label: "📅 Book call", icon: "📅", value: "Yes, I'd like to book a consultation" }
      ]);
    } else if (lowerMessage.includes('time') || lowerMessage.includes('schedule')) {
      setQuickReplies([
        { label: "✅ Sounds good", icon: "✅", value: "That sounds manageable" },
        { label: "⏰ Still concerned", icon: "⏰", value: "I'm still worried about time" },
        { label: "📚 See schedule", icon: "📚", value: "Show me the schedule" }
      ]);
    } else if (lowerMessage.includes('curriculum') || lowerMessage.includes('learn') || lowerMessage.includes('topics')) {
      setQuickReplies([
        { label: "📚 See curriculum", icon: "📚", value: "What will I learn?" },
        { label: "⏰ Duration?", icon: "⏰", value: "How long is the program?" },
        { label: "💼 Job support?", icon: "💼", value: "Do you provide job support?" }
      ]);
    } else {
      // Default quick replies
      setQuickReplies([
        { label: "💰 Pricing details", icon: "💰", value: "How much does it cost?" },
        { label: "⏰ Time commitment", icon: "⏰", value: "How much time do I need?" },
        { label: "📚 See curriculum", icon: "📚", value: "What will I learn?" },
        { label: "📅 Book a call", icon: "📅", value: "I'd like to book a consultation call" }
      ]);
    }
  };

  // Handle booking close
  const handleBookingClose = () => {
    setShowBooking(false);
    
    // Add a message confirming booking was closed
    const closeMessage = {
      text: "No problem! Feel free to ask me any other questions. I'm here to help! 😊",
      sender: 'ai',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, closeMessage]);
    
    // Speak the message
    speakMessage(closeMessage.text);
    
    // Add helpful quick replies
    setQuickReplies([
      { label: "💰 Pricing info", icon: "💰", value: "Tell me about pricing" },
      { label: "📚 Curriculum", icon: "📚", value: "What will I learn?" },
      { label: "💼 Job support", icon: "💼", value: "Do you help with jobs?" }
    ]);
  };

  if (!isOpen) {
    return (
      <div className="chat-bubble" onClick={() => setIsOpen(true)}>
        <span className="chat-bubble-icon">💬</span>
        <span className="chat-bubble-text">Need help?</span>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-header-avatar">
            <span className="avatar-icon">🎓</span>
          </div>
          <div className="chat-header-info">
            <h3 className="chat-header-title">Scaler Career Coach</h3>
            <p className="chat-header-status">
              <span className="status-dot"></span>
              Online · Ready to help
            </p>
          </div>
        </div>

        {/* Voice Toggle Button */}
        <button 
          className="voice-toggle-btn"
          onClick={toggleVoice}
          title={isVoiceEnabled ? "Voice on - Click to mute" : "Voice off - Click to enable"}
        >
          {isVoiceEnabled ? '🔊' : '🔇'}
          {isSpeaking && <span className="speaking-indicator"></span>}
        </button>

        <button 
          className="chat-header-close"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <ChatMessage 
            key={index}
            message={msg.text}
            sender={msg.sender}
            timestamp={msg.timestamp}
            isError={msg.isError}
          />
        ))}
        
        {isTyping && <TypingIndicator />}

        {/* Quick Replies - Show when not typing and available */}
        {!isTyping && !showBooking && quickReplies && quickReplies.length > 0 && (
          <QuickReplies 
            options={quickReplies}
            onSelect={handleSendMessage}
            disabled={isTyping}
          />
        )}

        {/* Booking Widget */}
        {showBooking && (
          <BookingWidget 
            onClose={handleBookingClose}
            userName={userContext.userName}
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={isTyping} />
    </div>
  );
}

export default ChatInterface;