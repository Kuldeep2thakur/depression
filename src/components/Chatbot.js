import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 2000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 2rem;
  box-shadow: 0 4px 24px rgba(102, 126, 234, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
`;

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 110px;
  right: 32px;
  width: 350px;
  max-width: 95vw;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(102, 126, 234, 0.25);
  z-index: 2100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #f7f8fa;
`;

const Message = styled.div`
  margin-bottom: 1.2rem;
  display: flex;
  align-items: flex-end;
  flex-direction: ${props => (props.isUser ? 'row-reverse' : 'row')};
`;

const Bubble = styled.div`
  background: ${props => (props.isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#eaeaea')};
  color: ${props => (props.isUser ? 'white' : '#333')};
  padding: 0.8rem 1.2rem;
  border-radius: 18px;
  max-width: 75%;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
  margin: 0 0.5rem;
`;

const ChatFooter = styled.form`
  display: flex;
  padding: 1rem;
  border-top: 1px solid #eee;
  background: #fff;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  border-radius: 20px;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  background: #f1f3f6;
  margin-right: 0.7rem;
  outline: none;
`;

const SendBtn = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Disclaimer = styled.div`
  font-size: 0.85rem;
  color: #888;
  background: #f8f8f8;
  padding: 0.7rem 1rem;
  border-top: 1px solid #eee;
  text-align: center;
`;

const initialMessages = [
  {
    isUser: false,
    text: "Hello! I'm your AI mental health assistant. I'm here to provide supportive conversations and general guidance. Please note that I'm not a substitute for professional mental health care. If you're experiencing a crisis, please contact emergency services or a mental health professional immediately. How can I support you today?"
  }
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (open && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Debug: Check environment variable on component mount
  useEffect(() => {
    console.log('Chatbot mounted - Environment check:');
    console.log('REACT_APP_OPENAI_API_KEY exists:', !!process.env.REACT_APP_OPENAI_API_KEY);
    console.log('REACT_APP_OPENAI_API_KEY starts with sk-:', process.env.REACT_APP_OPENAI_API_KEY?.startsWith('sk-'));
    console.log('NODE_ENV:', process.env.NODE_ENV);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Debug: Check if API key is available
    console.log('API Key available:', !!process.env.REACT_APP_OPENAI_API_KEY);
    console.log('API Key length:', process.env.REACT_APP_OPENAI_API_KEY?.length);
    
    const userMsg = { isUser: true, text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      // Replace YOUR_OPENAI_API_KEY with your actual key in a .env file for production
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a supportive, friendly, and non-judgmental mental health assistant. Always encourage users to seek professional help for serious issues." },
            ...[...messages, userMsg].map(m => ({ role: m.isUser ? "user" : "assistant", content: m.text }))
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });
      
      // Debug: Log the response status and data
      console.log('API Response status:', res.status);
      const data = await res.json();
      console.log('API Response data:', data);
      
      if (!res.ok) {
        let errorMessage = "Sorry, there was an error connecting to the AI. Please try again later.";
        
        if (res.status === 429) {
          errorMessage = "I'm currently experiencing high usage. Please try again in a few minutes, or contact support if this persists.";
        } else if (res.status === 401) {
          errorMessage = "Authentication error. Please check your API configuration.";
        } else if (res.status === 403) {
          errorMessage = "Access denied. Please check your API permissions.";
        } else if (data.error?.message) {
          errorMessage = `Service temporarily unavailable: ${data.error.message}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const aiText = data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't process that. Please try again.";
      setMessages(msgs => [...msgs, { isUser: false, text: aiText }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(msgs => [...msgs, { isUser: false, text: err.message }]);
    }
    setLoading(false);
  };

  return (
    <>
      <FloatingButton onClick={() => setOpen(o => !o)} title="Chat with AI Assistant">
        <i className="fas fa-comments"></i>
      </FloatingButton>
      {open && (
        <ChatbotContainer>
          <ChatHeader>
            <span><i className="fas fa-robot"></i> Mental Health Chatbot</span>
            <CloseBtn onClick={() => setOpen(false)} title="Close">&times;</CloseBtn>
          </ChatHeader>
          <ChatBody ref={chatBodyRef}>
            {messages.map((msg, idx) => (
              <Message key={idx} isUser={msg.isUser}>
                <Bubble isUser={msg.isUser}>{msg.text}</Bubble>
              </Message>
            ))}
            {loading && (
              <Message isUser={false}>
                <Bubble isUser={false}><i className="fas fa-spinner fa-spin"></i> Thinking...</Bubble>
              </Message>
            )}
          </ChatBody>
          <ChatFooter onSubmit={sendMessage}>
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <SendBtn type="submit" disabled={loading || !input.trim()} title="Send">
              <i className="fas fa-paper-plane"></i>
            </SendBtn>
          </ChatFooter>
          <Disclaimer>
            <strong>Disclaimer:</strong> This AI is for informational and supportive purposes only and is <u>not a substitute for professional mental health care</u>.
          </Disclaimer>
        </ChatbotContainer>
      )}
    </>
  );
};

export default Chatbot; 