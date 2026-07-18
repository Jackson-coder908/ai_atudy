// API Integration Layer
// Read API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Valid MongoDB User ID created in seed script
const USER_ID = '6a59eb03ffcf3fdd1e317295';

// Mock Data Initializer for persistent mock frontend
const DEFAULT_DECKS = [
  {
    id: 'deck-1',
    title: 'Cognitive Psychology Core Concepts',
    category: 'Psychology',
    description: 'Key terminology, theories of memory, attention mechanisms, and cognitive biases.',
    cardCount: 4,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    cards: [
      { id: 'c1', front: 'What is Hebbian Learning?', back: 'A theory in neuroscience that proposes an explanation for the adaptation of neurons in the brain during the learning process, summary: "Neurons that fire together, wire together."' },
      { id: 'c2', front: 'Define Working Memory', back: 'A cognitive system with a limited capacity that can temporarily hold information. It is important for reasoning and the guidance of decision-making and behavior.' },
      { id: 'c3', front: 'What is the Stroop Effect?', back: 'A demonstration of cognitive interference where a delay in the reaction time of a task occurs due to a mismatch in stimuli (e.g. the word "Red" printed in blue ink).' },
      { id: 'c4', front: 'What is Neuroplasticity?', back: 'The ability of the brain to form and reorganize synaptic connections, especially in response to learning or experience or following injury.' }
    ]
  },
  {
    id: 'deck-2',
    title: 'Data Structures & Algorithms',
    category: 'Computer Science',
    description: 'Core computer science concepts, big-O complexity, trees, graphs, and dynamic programming.',
    cardCount: 3,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    cards: [
      { id: 'c5', front: 'What is the time complexity of QuickSort in the average case?', back: 'O(n log n). QuickSort is a divide-and-conquer algorithm.' },
      { id: 'c6', front: 'Explain Breadth-First Search (BFS)', back: 'An algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all nodes at the present depth level before moving to nodes at the next depth level.' },
      { id: 'c7', front: 'What is a Hash Table?', back: 'A data structure that implements an associative array abstract data type, a structure that can map keys to values using a hash function.' }
    ]
  },
  {
    id: 'deck-3',
    title: 'Cellular Biology Basics',
    category: 'Biology',
    description: 'Mitochondrial functions, active transport, and cell division phases.',
    cardCount: 2,
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    cards: [
      { id: 'c8', front: 'What is the main function of Mitochondria?', back: 'To perform cellular respiration, taking in nutrients from the cell, breaking them down, and turning them into energy in the form of ATP.' },
      { id: 'c9', front: 'Define Active Transport', back: 'The movement of ions or molecules across a cell membrane into a region of higher concentration, assisted by enzymes and requiring energy (ATP).' }
    ]
  }
];

const DEFAULT_ACTIVITIES = [
  { id: 'act-1', title: 'Neural Networks Overview', type: 'Research Log', detail: 'Updated 2 hours ago', icon: 'bookOpen' },
  { id: 'act-2', title: 'Cognitive Psychology Deck', type: 'Flashcard Set', detail: '120 cards • Created yesterday', icon: 'layers' },
  { id: 'act-3', title: 'Literature Review: Attention Mechanisms', type: 'AI Session', detail: 'Last active 3 days ago', icon: 'cpu' }
];

// Helper to initialize local storage
const getStored = (key, fallback) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(data);
};

const setStored = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- FLASHCARDS API ---

export const getDecks = async () => {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/decks?userId=${USER_ID}`);
      if (res.ok) {
        const backendDecks = await res.json();
        const formattedDecks = [];

        for (const bd of backendDecks) {
          let title = bd.name;
          let category = 'General';
          let description = '';

          try {
            // Check if name is JSON encoded (contains title, category, description)
            const parsed = JSON.parse(bd.name);
            title = parsed.title || bd.name;
            category = parsed.category || 'General';
            description = parsed.description || '';
          } catch {
            // Raw string (seeding or direct creation)
          }

          // Fetch flashcards for this deck
          let cards = [];
          const cardsRes = await fetch(`${API_BASE_URL}/api/decks/${bd._id}/flashcards`);
          if (cardsRes.ok) {
            const rawCards = await cardsRes.json();
            cards = rawCards.map(c => ({
              id: c._id,
              front: c.question,
              back: c.answer
            }));
          }

          formattedDecks.push({
            id: bd._id,
            title,
            category,
            description,
            cardCount: cards.length,
            updatedAt: bd.updatedAt || bd.createdAt || new Date().toISOString(),
            cards
          });
        }
        return formattedDecks;
      }
    } catch (e) {
      console.warn('Backend fetch failed, falling back to mock.', e);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStored('decks', DEFAULT_DECKS));
    }, 400);
  });
};

export const saveDeck = async (deck) => {
  if (API_BASE_URL) {
    try {
      // Pack category and description into name for DB schema compatibility
      const namePayload = JSON.stringify({
        title: deck.title,
        category: deck.category,
        description: deck.description
      });

      let savedDeck;
      const isExistingDeck = deck.id && !deck.id.startsWith('deck-') && !deck.id.startsWith('mock-');

      if (isExistingDeck) {
        // Update existing deck
        const res = await fetch(`${API_BASE_URL}/api/decks/${deck.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: namePayload })
        });
        if (res.ok) {
          savedDeck = await res.json();
        }
      } else {
        // Create new deck
        const res = await fetch(`${API_BASE_URL}/api/decks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: namePayload, userId: USER_ID })
        });
        if (res.ok) {
          savedDeck = await res.json();
        }
      }

      if (!savedDeck) {
        throw new Error('Failed to save deck details.');
      }

      const deckId = savedDeck._id;

      // Sync flashcards: get existing cards from backend to see what to update/delete
      let existingCards = [];
      if (isExistingDeck) {
        const cardsRes = await fetch(`${API_BASE_URL}/api/decks/${deckId}/flashcards`);
        if (cardsRes.ok) {
          existingCards = await cardsRes.json();
        }
      }

      const finalCards = [];
      // 1. Create or Update cards in payload
      for (const card of deck.cards) {
        const cardPayload = {
          question: card.front,
          answer: card.back
        };

        const isExistingCard = card.id && !card.id.startsWith('c') && existingCards.some(ec => ec._id === card.id);

        if (isExistingCard) {
          // Update card
          const cardRes = await fetch(`${API_BASE_URL}/api/flashcards/${card.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cardPayload)
          });
          if (cardRes.ok) {
            const updated = await cardRes.json();
            finalCards.push({
              id: updated._id,
              front: updated.question,
              back: updated.answer
            });
          }
        } else {
          // Create new card
          const cardRes = await fetch(`${API_BASE_URL}/api/decks/${deckId}/flashcards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cardPayload)
          });
          if (cardRes.ok) {
            const created = await cardRes.json();
            finalCards.push({
              id: created._id,
              front: created.question,
              back: created.answer
            });
          }
        }
      }

      // 2. Delete cards no longer present in payload list
      const currentCardIds = deck.cards.map(c => c.id);
      for (const ec of existingCards) {
        if (!currentCardIds.includes(ec._id)) {
          await fetch(`${API_BASE_URL}/api/flashcards/${ec._id}`, {
            method: 'DELETE'
          });
        }
      }

      return {
        id: deckId,
        title: deck.title,
        category: deck.category,
        description: deck.description,
        cardCount: finalCards.length,
        updatedAt: savedDeck.updatedAt || savedDeck.createdAt || new Date().toISOString(),
        cards: finalCards
      };

    } catch (e) {
      console.warn('Backend save deck failed, falling back to mock.', e);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const decks = getStored('decks', DEFAULT_DECKS);
      if (deck.id) {
        // Edit
        const updated = decks.map(d => d.id === deck.id ? { 
          ...d, 
          ...deck, 
          cardCount: deck.cards.length,
          updatedAt: new Date().toISOString() 
        } : d);
        setStored('decks', updated);
        resolve(deck);
      } else {
        // Create
        const newDeck = {
          ...deck,
          id: 'deck-' + Math.random().toString(36).substr(2, 9),
          cardCount: (deck.cards || []).length,
          updatedAt: new Date().toISOString()
        };
        decks.push(newDeck);
        setStored('decks', decks);
        resolve(newDeck);
      }
    }, 300);
  });
};

export const deleteDeck = async (deckId) => {
  const isRealDbId = deckId && !deckId.startsWith('deck-') && !deckId.startsWith('mock-');
  
  if (API_BASE_URL && isRealDbId) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/decks/${deckId}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Backend delete deck failed, falling back to mock.', e);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const decks = getStored('decks', DEFAULT_DECKS);
      const filtered = decks.filter(d => d.id !== deckId);
      setStored('decks', filtered);
      resolve(true);
    }, 200);
  });
};

// --- CHAT / AI RESEARCH ASSISTANT API ---

export const getConversations = async () => {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/research-results?userId=${USER_ID}`);
      if (res.ok) {
        const results = await res.json();
        return results.map(result => ({
          id: result._id,
          title: result.topic,
          updatedAt: new Date(result.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          messages: [
            {
              id: `q-${result._id}`,
              sender: 'user',
              text: result.topic
            },
            {
              id: `a-${result._id}`,
              sender: 'assistant',
              text: result.content
            }
          ]
        }));
      }
    } catch (e) {
      console.warn('Backend fetch research-results failed, falling back to local state.', e);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStored('conversations', []));
    }, 450);
  });
};

export const deleteConversation = async (id) => {
  const isRealDbId = id && !id.startsWith('chat-') && !id.startsWith('mock-');
  
  if (API_BASE_URL && isRealDbId) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/research-results/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Backend delete research-result failed, falling back to local state.', e);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const conversations = getStored('conversations', []);
      const filtered = conversations.filter(c => c.id !== id);
      setStored('conversations', filtered);
      resolve(true);
    }, 200);
  });
};

export const createConversation = async (title) => {
  const newChat = {
    id: 'chat-' + Math.random().toString(36).substr(2, 9),
    title: title || 'New Research Session',
    updatedAt: 'Just now',
    messages: []
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      const conversations = getStored('conversations', []);
      conversations.unshift(newChat);
      setStored('conversations', conversations);
      resolve(newChat);
    }, 200);
  });
};

export const sendMessage = async (conversationId, messageText, contextFile = null) => {
  if (API_BASE_URL) {
    try {
      // 1. Run the multi-agent research pipeline on the backend
      const promptRes = await fetch(`${API_BASE_URL}/api/research-results/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: messageText })
      });

      if (promptRes.ok) {
        const json = await promptRes.json();
        const pipelineData = json.data;

        // 2. Format the agent pipeline response into a beautiful report
        const formattedContent = `### 🔍 Agent Research Notes
${pipelineData.researchNotes || 'No research notes compiled.'}

---

### 📝 Writer Draft
${pipelineData.draft || 'No report draft written.'}

---

### ⚖️ Reviewer Feedback & Final Draft
${pipelineData.reviewResult || 'No review feedback compiled.'}`;

        // 3. Save the research result to the database
        const saveRes = await fetch(`${API_BASE_URL}/api/research-results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: messageText,
            content: formattedContent,
            userId: USER_ID
          })
        });

        if (saveRes.ok) {
          const savedResult = await saveRes.json();
          
          const userMsg = {
            id: `q-${savedResult._id}`,
            sender: 'user',
            text: messageText,
            context: contextFile
          };

          const aiMsg = {
            id: `a-${savedResult._id}`,
            sender: 'assistant',
            text: formattedContent,
            citation: 'Multi-Agent Research Pipeline'
          };

          // Clean local conversations array to prevent local state duplicate
          const conversations = getStored('conversations', []);
          const filtered = conversations.filter(c => c.id !== conversationId);
          setStored('conversations', filtered);

          return {
            dbResultId: savedResult._id,
            userMsg,
            aiMsg
          };
        }
      }
    } catch (e) {
      console.warn('Backend agent research failed, falling back to local fallback response.', e);
    }
  }

  // Fallback to local offline simulated model
  return new Promise((resolve) => {
    setTimeout(() => {
      const conversations = getStored('conversations', []);
      const chatIndex = conversations.findIndex(c => c.id === conversationId);
      
      const userMsg = {
        id: 'msg-' + Math.random().toString(36).substr(2, 9),
        sender: 'user',
        text: messageText,
        context: contextFile
      };

      const aiReply = `### 🔍 Offline Agent Research Notes
* Synthesizing notes on: **${messageText}**
* Connection to backend agent was offline, falling back to simulated output.

### 📝 Writer Draft
Here is a local summary about "${messageText}". Synaptic changes or literature review details would be shown here.

### ⚖️ Reviewer Feedback
The draft is clean and contains the local simulation structure.`;

      const aiMsg = {
        id: 'msg-' + Math.random().toString(36).substr(2, 9),
        sender: 'assistant',
        text: aiReply,
        citation: 'Offline Mock Agent'
      };

      if (chatIndex !== -1) {
        conversations[chatIndex].messages.push(userMsg);
        conversations[chatIndex].messages.push(aiMsg);
        conversations[chatIndex].updatedAt = 'Just now';
        setStored('conversations', conversations);
      }

      resolve({ userMsg, aiMsg });
    }, 1500);
  });
};


// --- DASHBOARD API ---

export const getDashboardSummary = async () => {
  if (API_BASE_URL) {
    try {
      const decks = await getDecks();
      const totalCards = decks.reduce((sum, d) => sum + d.cardCount, 0);
      return {
        totalDecks: decks.length,
        totalCards,
        dueToday: 12,
        studyStreak: 5
      };
    } catch (e) {
      console.warn('Backend summary calculation failed', e);
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const decks = getStored('decks', DEFAULT_DECKS);
      const totalCards = decks.reduce((sum, d) => sum + d.cardCount, 0);
      resolve({
        totalDecks: decks.length,
        totalCards,
        dueToday: 12,
        studyStreak: 5
      });
    }, 200);
  });
};

export const getRecentActivities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStored('activities', DEFAULT_ACTIVITIES));
    }, 200);
  });
};

// --- STATELESS AI QUIZ GENERATOR API ---

export const generateQuiz = async (topic, difficulty) => {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });
      if (res.ok) return await res.json();
      
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to generate quiz');
    } catch (e) {
      console.warn('Backend generate quiz failed.', e);
      throw e;
    }
  }

  // Fallback offline mock generator for development testing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: `${topic} Practice Quiz`,
        difficulty,
        questions: [
          {
            question: `What is the primary function of ${topic}?`,
            options: ['To facilitate standard functions', 'To provide alternative pathways', 'To regulate general processes', 'To study specific mechanisms'],
            correctAnswer: 0
          },
          {
            question: `Which difficulty is this ${topic} quiz?`,
            options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            correctAnswer: Math.max(0, ['Beginner', 'Intermediate', 'Advanced'].indexOf(difficulty))
          },
          {
            question: `Which of the following is associated with ${topic}?`,
            options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
            correctAnswer: 1
          },
          {
            question: `What describes the correct approach to ${topic}?`,
            options: ['Random testing', 'Dynamic generation', 'Standard logic', 'All of the above'],
            correctAnswer: 3
          },
          {
            question: `A typical question regarding ${topic} has how many choices?`,
            options: ['Two choices', 'Three choices', 'Four choices', 'Five choices'],
            correctAnswer: 2
          }
        ]
      });
    }, 2000);
  });
};
