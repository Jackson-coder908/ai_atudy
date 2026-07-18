import React, { useState, useEffect, useRef } from 'react';
import { 
  getConversations, createConversation, deleteConversation, sendMessage 
} from '../api/api';
import { ChatSkeleton, ListSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import { 
  Brain, Send, Plus, Paperclip, Mic, FileText, X, 
  Trash2, File, MessageSquare
} from 'lucide-react';


export default function AIAssistant() {
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Active Source Attachment State
  const [attachedFiles, setAttachedFiles] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeChatId, sending]);

  async function loadSessions() {
    setLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
      if (data.length > 0) {
        setActiveChatId(data[0].id);
      }
    } catch (e) {
      console.error('Failed to load conversations', e);
    } finally {
      setLoading(false);
    }
  }

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateChat = async () => {
    const title = prompt('Enter a title for the research session:', 'New Research Session');
    if (title === null) return; // Cancelled
    
    try {
      const newChat = await createConversation(title.trim() || 'New Research Session');
      const updated = await getConversations();
      setConversations(updated);
      setActiveChatId(newChat.id);
    } catch {
      alert('Failed to create research session');
    }
  };

  const handleDeleteChat = async (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this research session?')) {
      try {
        await deleteConversation(id);
        const updated = conversations.filter(c => c.id !== id);
        setConversations(updated);
        if (activeChatId === id) {
          setActiveChatId(updated.length > 0 ? updated[0].id : null);
        }
      } catch {
        alert('Failed to delete session');
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || sending || !activeChatId) return;

    const textToSend = inputValue;
    setInputValue('');
    setSending(true);

    // 1. Immediately append user's message bubble locally for chatbot-like responsiveness
    const tempUserMsgId = 'temp-' + Date.now();
    const newUserMsg = {
      id: tempUserMsgId,
      sender: 'user',
      text: textToSend,
      context: attachedFiles.length > 0 ? attachedFiles[0].name : null
    };

    setConversations(prevChats => 
      prevChats.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newUserMsg],
            updatedAt: 'Just now'
          };
        }
        return chat;
      })
    );

    setAttachedFiles([]);

    try {
      // 2. Query the live agent research pipeline
      const res = await sendMessage(activeChatId, textToSend, newUserMsg.context);
      
      if (res && res.aiMsg) {
        // Update local messages with final database-synced structures
        setConversations(prevChats => 
          prevChats.map(chat => {
            if (chat.id === activeChatId) {
              const otherMsgs = chat.messages.filter(m => m.id !== tempUserMsgId);
              return {
                ...chat,
                id: res.dbResultId || chat.id,
                title: textToSend,
                messages: [...otherMsgs, res.userMsg, res.aiMsg],
                updatedAt: 'Just now'
              };
            }
            return chat;
          })
        );

        if (res.dbResultId) {
          setActiveChatId(res.dbResultId);
        }
      }

      // 3. Fully synchronize state with the database
      const data = await getConversations();
      setConversations(data);
      if (res && res.dbResultId) {
        setActiveChatId(res.dbResultId);
      }
    } catch {
      alert('Error running research agent pipeline.');
    } finally {
      setSending(false);
    }
  };

  const handleAddAttachment = () => {
    const filename = prompt('Enter a research filename to attach (mock):', 'Research_Notes.pdf');
    if (filename) {
      setAttachedFiles([...attachedFiles, { id: 'file-' + Date.now(), name: filename }]);
    }
  };

  const handleRemoveAttachment = (id) => {
    setAttachedFiles(attachedFiles.filter(f => f.id !== id));
  };

  const getActiveChat = () => {
    return conversations.find(c => c.id === activeChatId) || null;
  };

  // Simple Native Markdown Renderer
  const renderMessageContent = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeContent = [];
    const elements = [];

    lines.forEach((line, index) => {
      // Check for code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // Close block
          elements.push(
            <pre key={`code-${index}`} className="bg-[#1b1b24] text-[#dcd8e5] p-4 rounded-lg overflow-x-auto my-3 text-mono-sm">
              <code>{codeContent.join('\n')}</code>
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Check for list items
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const itemText = line.trim().substring(2);
        elements.push(
          <ul key={`list-${index}`} className="list-disc pl-6 mb-2 text-body-md text-secondary">
            <li>{parseInline(itemText)}</li>
          </ul>
        );
        return;
      }

      // Default paragraph
      if (line.trim()) {
        elements.push(
          <p key={`p-${index}`} className="text-body-md leading-relaxed mb-3 last:mb-0">
            {parseInline(line)}
          </p>
        );
      }
    });

    return elements;
  };

  // Parse inline bold (**) and inline code (`)
  const parseInline = (text) => {
    // We will do a basic replacement loop for bold & inline code
    const processedText = text.split(/(\*\*.*?\*\*|`.*?`)/).map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="text-on-surface font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="bg-surface-variant/70 px-1 rounded text-on-surface font-mono text-[13px]">{part.slice(1, -1)}</code>;
      }
      return part;
    });

    return processedText;
  };

  const activeChat = getActiveChat();

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-background animate-in fade-in duration-200">
      
      {/* Session History Sidebar Pane (Left) */}
      <aside className="hidden md:flex flex-col w-72 border-r border-outline-variant bg-surface h-full">
        <div className="p-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container-low/40">
          <span className="text-label-sm text-secondary uppercase tracking-wider font-bold">Research Sessions</span>
          <button 
            onClick={handleCreateChat}
            className="text-secondary hover:text-primary transition-colors p-1 rounded hover:bg-surface-container"
            title="Start New Session"
          >
            <Plus className="w-4 h-4 stroke-[2px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <ListSkeleton />
          ) : conversations.length > 0 ? (
            conversations.map(chat => (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                }}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeChatId === chat.id 
                    ? 'bg-primary/5 border-l-4 border-primary text-primary rounded-l-none'
                    : 'text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface'
                }`}
              >
                <div className="overflow-hidden flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 flex-shrink-0 text-secondary" />
                    <p className={`text-label-md truncate ${activeChatId === chat.id ? 'font-bold text-primary' : 'text-on-surface'}`}>
                      {chat.title}
                    </p>
                  </div>
                  <p className="text-label-sm text-outline mt-1 pl-6">{chat.updatedAt}</p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-secondary hover:text-error transition-all p-1 rounded hover:bg-error-container/20"
                  title="Delete Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 px-4 text-outline text-label-sm">
              No sessions. Click '+' to start one.
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Workspace (Right) */}
      <section className="flex-1 flex flex-col h-full bg-background relative min-w-0">
        
        {/* Top Active Session Header */}
        <header className="h-14 border-b border-outline-variant/60 bg-surface px-lg flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <Brain className="w-5 h-5 text-primary flex-shrink-0" />
            <h2 className="text-label-md font-bold text-on-surface truncate">
              {activeChat ? activeChat.title : 'Research Assistant'}
            </h2>
          </div>

          {/* Active context badge */}
          {attachedFiles.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant bg-surface-container-low text-label-sm text-secondary font-medium">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>{attachedFiles.length} Sources Active</span>
            </div>
          )}
        </header>

        {/* Chat Feed */}
        <main className="flex-1 overflow-y-auto p-md sm:p-lg space-y-lg pb-4">
          {loading ? (
            <div className="space-y-6">
              <ChatSkeleton />
              <ChatSkeleton />
            </div>
          ) : activeChat ? (
            <>
              {/* Session Start Alert Badge */}
              <div className="flex justify-center my-lg">
                <div className="bg-surface-container rounded-lg px-md py-1 text-center border border-outline-variant/30">
                  <p className="text-label-sm text-secondary">
                    Research Session Active • {activeChat.messages.length} messages
                  </p>
                </div>
              </div>

              {/* Messages list */}
              {activeChat.messages.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* AI Avatar */}
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center flex-shrink-0 border border-outline-variant">
                      <Brain className="w-4 h-4 text-primary fill-primary/5" />
                    </div>
                  )}

                  {/* Bubble body */}
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-md sm:px-lg sm:py-md shadow-sm border ${
                    msg.sender === 'user'
                      ? 'bg-primary text-on-primary rounded-tr-sm border-primary/20'
                      : 'bg-surface-container-low text-on-surface rounded-tl-sm border-outline-variant/50'
                  }`}>
                    {msg.sender === 'user' ? (
                      <p className="text-body-md">{msg.text}</p>
                    ) : (
                      <div className="markdown-body">
                        {renderMessageContent(msg.text)}
                      </div>
                    )}

                    {/* Citations block */}
                    {msg.citation && (
                      <div className="mt-3 pt-3 border-t border-outline-variant/30 flex gap-2">
                        <span 
                          onClick={() => alert(`Opening source details: ${msg.citation}`)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-variant text-secondary text-label-sm cursor-pointer hover:bg-outline-variant/40 transition-colors font-medium border border-outline-variant/50"
                        >
                          <FileText className="w-3 h-3 text-primary" />
                          <span>{msg.citation}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Sending / Typing State indicator */}
              {sending && (
                <div className="flex justify-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center flex-shrink-0 border border-outline-variant">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-surface-container-low rounded-2xl rounded-tl-sm px-md py-3 border border-outline-variant/50 flex items-center shadow-sm">
                    <div className="typing-indicator flex h-3 items-center">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState 
              icon={Brain}
              title="No active research session"
              description="Start a new AI conversation to analyze research notes, papers, and Hebbian concepts."
              actionLabel="Create Session"
              onAction={handleCreateChat}
            />
          )}

          <div ref={chatEndRef} />
        </main>

        {/* Input Bar (Static Bottom of Flex Column) */}
        {activeChatId && (
          <div className="border-t border-outline-variant/50 p-4 bg-background">
            <form onSubmit={handleSend} className="max-w-3xl mx-auto">
              <div className="flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant shadow-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all overflow-hidden">
                
                {/* Active Attachment context indicator */}
                {attachedFiles.length > 0 && (
                  <div className="px-4 py-2 border-b border-outline-variant/30 flex items-center gap-2 overflow-x-auto bg-surface-container-low/20">
                    <span className="text-label-sm text-outline font-semibold">Context:</span>
                    {attachedFiles.map(file => (
                      <span 
                        key={file.id} 
                        className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-label-sm flex items-center gap-1 whitespace-nowrap font-medium"
                      >
                        <File className="w-3 h-3" />
                        <span>{file.name}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveAttachment(file.id)}
                          className="hover:text-error transition-colors"
                        >
                          <X className="w-3 h-3 stroke-[2.5px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Textarea */}
                <textarea 
                  className="w-full bg-transparent border-none resize-none focus:ring-0 p-4 text-body-md text-on-surface placeholder-secondary focus:outline-none min-h-[70px] max-h-[150px]"
                  placeholder="Ask the research assistant or type Hebbian learning rules..."
                  rows="2"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />

                {/* Bottom Action controls */}
                <div className="px-4 py-2.5 flex justify-between items-center bg-surface-container-low/30 border-t border-outline-variant/30">
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={handleAddAttachment}
                      className="p-2 text-secondary hover:text-primary hover:bg-surface-container rounded-full transition-colors"
                      title="Attach Research File"
                    >
                      <Paperclip className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => alert('Microphone input triggered (mock).')}
                      className="p-2 text-secondary hover:text-primary hover:bg-surface-container rounded-full transition-colors"
                      title="Voice Command"
                    >
                      <Mic className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || sending}
                    className={`px-5 py-1.5 rounded-lg text-label-md font-medium flex items-center gap-2 transition-all shadow-sm ${
                      !inputValue.trim() || sending
                        ? 'bg-outline-variant/40 text-outline cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-container text-on-primary active:scale-95'
                    }`}
                  >
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
