// src/components/ChatInput.jsx
import React, { useState, useEffect } from 'react';
import './ChatInput.css';

function ChatInput({ onSend, disabled }) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      // Configuration
      recognitionInstance.continuous = false;  // Stop after one phrase
      recognitionInstance.interimResults = false;  // Only final results
      recognitionInstance.lang = 'en-US';  // English
      recognitionInstance.maxAlternatives = 1;  // Best guess only
      
      // Handle successful speech recognition
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('🎤 Voice input:', transcript);
        setInputValue(transcript);
        setIsListening(false);
      };
      
      // Handle errors
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access in your browser settings.');
        }
      };
      
      // Handle end of speech
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      console.warn('Speech recognition not supported');
      setIsSupported(false);
    }
  }, []);

  // Toggle voice input
  const handleVoiceInput = () => {
    if (!isSupported) {
      alert('🎤 Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    if (!recognition) {
      alert('Voice recognition is not initialized. Please refresh the page.');
      return;
    }
    
    if (isListening) {
      // Stop listening
      recognition.stop();
      setIsListening(false);
    } else {
      // Start listening
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        placeholder={isListening ? "🎤 Listening..." : "Type your message or click 🎤 to speak..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled || isListening}
      />
      
      <button
        type="button"
        className={`voice-button ${isListening ? 'listening' : ''} ${!isSupported ? 'unsupported' : ''}`}
        onClick={handleVoiceInput}
        disabled={disabled || !isSupported}
        title={isSupported ? (isListening ? "Stop listening" : "Click to speak") : "Voice not supported"}
      >
        {isListening ? '🔴' : '🎤'}
      </button>
      
      <button
        type="submit"
        className="chat-send-button"
        disabled={disabled || !inputValue.trim()}
      >
        {disabled ? '...' : 'Send'}
      </button>
    </form>
  );
}

export default ChatInput;