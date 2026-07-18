import React, { useState, useEffect } from 'react';
import { getDecks, saveDeck, deleteDeck } from '../api/api';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/Skeletons';
import {
  Search, SlidersHorizontal, Plus, MoreVertical,
  Layers, Trash2, Edit3, ChevronLeft, ChevronRight,
  RotateCw, Trash
} from 'lucide-react';

export default function Flashcards() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('updated'); // 'updated', 'alpha', 'count'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Modals state
  const [deckFormOpen, setDeckFormOpen] = useState(false);
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [activeDeckMenu, setActiveDeckMenu] = useState(null); // ID of deck with active dot menu

  // Active Deck Form state
  const [formDeckId, setFormDeckId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCards, setFormCards] = useState([{ front: '', back: '' }]);

  // Study Session state
  const [studyDeck, setStudyDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    loadDecks();
  }, []);

  async function loadDecks() {
    setLoading(true);
    try {
      const data = await getDecks();
      setDecks(data);
    } catch (err) {
      console.error('Error loading decks', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle outside click to close active deck dot menus
  useEffect(() => {
    function closeMenu() {
      setActiveDeckMenu(null);
    }
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  // Filter & Sort logic
  const categories = ['All', ...new Set(decks.map(d => d.category))];

  const filteredDecks = decks.filter(deck => {
    const matchesSearch = deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || deck.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    if (sortBy === 'alpha') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'count') {
      return b.cardCount - a.cardCount;
    }
    // Default: updated date descending
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  // --- CRUD ACTIONS ---

  const handleOpenCreateModal = () => {
    setFormDeckId(null);
    setFormTitle('');
    setFormCategory('');
    setFormDescription('');
    setFormCards([{ front: '', back: '' }]);
    setDeckFormOpen(true);
  };

  const handleOpenEditModal = (deck, e) => {
    e.stopPropagation();
    setFormDeckId(deck.id);
    setFormTitle(deck.title);
    setFormCategory(deck.category);
    setFormDescription(deck.description);
    setFormCards(deck.cards && deck.cards.length > 0 ? [...deck.cards] : [{ front: '', back: '' }]);
    setDeckFormOpen(true);
    setActiveDeckMenu(null);
  };

  const handleDeleteDeck = async (deckId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this deck?')) {
      try {
        await deleteDeck(deckId);
        loadDecks();
      } catch {
        alert('Failed to delete deck');
      }
    }
    setActiveDeckMenu(null);
  };

  const handleAddCardField = () => {
    setFormCards([...formCards, { front: '', back: '' }]);
  };

  const handleRemoveCardField = (index) => {
    if (formCards.length === 1) return;
    setFormCards(formCards.filter((_, i) => i !== index));
  };

  const handleCardFieldChange = (index, field, value) => {
    const updated = formCards.map((c, i) => {
      if (i === index) {
        return { ...c, [field]: value };
      }
      return c;
    });
    setFormCards(updated);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formCategory) {
      alert('Title and Category are required.');
      return;
    }

    // Filter out blank cards
    const cleanCards = formCards.filter(c => c.front.trim() && c.back.trim());
    if (cleanCards.length === 0) {
      alert('You must add at least one complete card (front and back).');
      return;
    }

    const payload = {
      id: formDeckId,
      title: formTitle,
      category: formCategory,
      description: formDescription,
      cards: cleanCards
    };

    try {
      await saveDeck(payload);
      setDeckFormOpen(false);
      loadDecks();
    } catch {
      alert('Failed to save deck.');
    }
  };

  // --- STUDY MODE ---

  const startStudySession = (deck) => {
    if (!deck.cards || deck.cards.length === 0) {
      alert('This deck has no cards.');
      return;
    }
    setStudyDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyModalOpen(true);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % studyDeck.cards.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + studyDeck.cards.length) % studyDeck.cards.length);
    }, 150);
  };

  return (
    <div className="flex-1 overflow-y-auto w-full px-md md:px-lg lg:px-xxl py-xl">
      <div className="max-w-container-max mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl animate-in fade-in duration-200">
          <div>
            <h1 className="text-headline-lg font-bold text-on-surface mb-xs">Flashcards</h1>
            <p className="text-body-md text-on-surface-variant">Manage and review your study decks.</p>
          </div>

          {/* Controls Panel */}
          <div className="flex flex-wrap items-center gap-md">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant stroke-[2px]" />
              <input
                className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="Search decks..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter/Sort Trigger */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowFilterDropdown(!showFilterDropdown); }}
                className="flex items-center gap-xs px-4 py-2 border border-outline-variant rounded-lg text-on-surface text-label-md hover:bg-surface-variant/20 transition-colors bg-surface select-none"
              >
                <SlidersHorizontal className="w-4 h-4 text-on-surface" />
                <span>Filters</span>
              </button>

              {showFilterDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-4 z-40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div>
                    <label className="text-label-sm text-secondary block mb-1">Category</label>
                    <select
                      className="w-full border border-outline-variant rounded-lg p-2 text-body-sm bg-surface"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-label-sm text-secondary block mb-1">Sort By</label>
                    <select
                      className="w-full border border-outline-variant rounded-lg p-2 text-body-sm bg-surface"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="updated">Recent Activity</option>
                      <option value="alpha">Alphabetical (A-Z)</option>
                      <option value="count">Card Count</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Create Button */}
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-xs px-4 py-2 bg-primary-container text-on-primary-container rounded-lg text-label-md hover:opacity-90 active:scale-95 transition-all ml-auto md:ml-0 font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Deck</span>
            </button>
          </div>
        </div>

        {/* Main Grid Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : sortedDecks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
            {sortedDecks.map(deck => (
              <div
                key={deck.id}
                onClick={() => startStudySession(deck)}
                className="bg-surface-container-lowest border border-outline-variant rounded-[16px] p-lg hover:border-[#CBD5E1] transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden shadow-sm hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 duration-200"
              >
                <div className="flex justify-between items-start mb-md">
                  <div className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container text-label-sm font-medium">
                    {deck.category}
                  </div>

                  {/* Dots Options menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDeckMenu(activeDeckMenu === deck.id ? null : deck.id);
                      }}
                      className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-full hover:bg-surface-variant/20"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {activeDeckMenu === deck.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg py-1 z-20">
                        <button
                          onClick={(e) => handleOpenEditModal(deck, e)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-secondary" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteDeck(deck.id, e)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-body-sm text-error hover:bg-error-container/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-headline-sm text-on-surface mb-sm group-hover:text-primary transition-colors font-bold">
                  {deck.title}
                </h3>

                <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-lg flex-1">
                  {deck.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/50">
                  <div className="flex items-center gap-xs text-on-surface-variant text-label-sm font-semibold">
                    <Layers className="w-4 h-4 text-secondary" />
                    <span>{deck.cardCount || 0} cards</span>
                  </div>
                  <span className="text-label-sm text-outline font-medium">
                    {new Date(deck.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title={searchTerm || selectedCategory !== 'All' ? "No matching decks" : "No study decks yet"}
            description={searchTerm || selectedCategory !== 'All'
              ? "Try resetting your search query or category filters."
              : "Get started by creating your first set of research flashcards."
            }
            actionLabel={searchTerm || selectedCategory !== 'All' ? "Clear Search" : "Create First Deck"}
            onAction={searchTerm || selectedCategory !== 'All'
              ? () => { setSearchTerm(''); setSelectedCategory('All'); }
              : handleOpenCreateModal
            }
          />
        )}

        {/* --- DECK CREATION & EDIT MODAL --- */}
        <Modal
          isOpen={deckFormOpen}
          onClose={() => setDeckFormOpen(false)}
          title={formDeckId ? "Edit Flashcard Deck" : "Create New Deck"}
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-label-sm text-secondary block mb-1">Deck Title *</label>
              <input
                type="text"
                required
                className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
                placeholder="e.g. Neural Networks Overview"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-sm">
              <div>
                <label className="text-label-sm text-secondary block mb-1">Category *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
                  placeholder="e.g. Computer Science"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="text-label-sm text-secondary block mb-1">Or choose existing</label>
                <select
                  className="w-full border border-outline-variant rounded-lg p-2 text-body-sm bg-surface"
                  onChange={(e) => {
                    if (e.target.value && e.target.value !== 'All') {
                      setFormCategory(e.target.value);
                    }
                  }}
                >
                  <option value="">-- Choose --</option>
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-label-sm text-secondary block mb-1">Description</label>
              <textarea
                className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 resize-none h-20"
                placeholder="Enter a brief summary of the deck study goals..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            {/* Cards Fields Area */}
            <div className="pt-2 border-t border-outline-variant/50">
              <div className="flex justify-between items-center mb-sm">
                <span className="text-label-md font-bold text-on-surface">Flashcards ({formCards.length})</span>
                <button
                  type="button"
                  onClick={handleAddCardField}
                  className="text-label-sm text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Card</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {formCards.map((card, idx) => (
                  <div key={idx} className="p-3 bg-surface-container rounded-lg border border-outline-variant/40 space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-label-sm text-secondary font-semibold">Card #{idx + 1}</span>
                      {formCards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCardField(idx)}
                          className="text-error hover:text-on-error-container hover:bg-error-container/30 p-1 rounded transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        className="w-full bg-surface border border-outline-variant rounded p-1.5 text-body-sm"
                        placeholder="Front / Question"
                        value={card.front}
                        onChange={(e) => handleCardFieldChange(idx, 'front', e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="w-full bg-surface border border-outline-variant rounded p-1.5 text-body-sm"
                        placeholder="Back / Answer"
                        value={card.back}
                        onChange={(e) => handleCardFieldChange(idx, 'back', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Submit */}
            <div className="flex justify-end gap-sm pt-4 border-t border-outline-variant/50">
              <button
                type="button"
                onClick={() => setDeckFormOpen(false)}
                className="px-4 py-2 border border-outline-variant rounded-lg text-label-md hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2 text-label-md font-medium"
              >
                Save Deck
              </button>
            </div>
          </form>
        </Modal>

        {/* --- STUDY SESSION MODAL (Interactive Flashcard Flipping) --- */}
        {studyModalOpen && studyDeck && (
          <Modal
            isOpen={studyModalOpen}
            onClose={() => setStudyModalOpen(false)}
            title={`Study: ${studyDeck.title}`}
          >
            <div className="flex flex-col items-center py-4">
              <span className="text-label-sm text-outline uppercase tracking-wider mb-2 font-semibold">
                Card {currentCardIndex + 1} of {studyDeck.cards.length}
              </span>

              {/* Interactive Flashcard container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-64 bg-surface border border-outline rounded-xl flex items-center justify-center p-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 relative select-none hover:border-primary/50 text-center"
              >
                {/* Reset layout or display front/back text */}
                <div className="flex flex-col items-center justify-center h-full">
                  {isFlipped ? (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-label-sm text-primary font-bold block mb-4 uppercase tracking-widest">Answer</span>
                      <p className="text-body-md text-on-surface font-medium leading-relaxed">
                        {studyDeck.cards[currentCardIndex]?.back}
                      </p>
                    </div>
                  ) : (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-label-sm text-secondary font-bold block mb-4 uppercase tracking-widest">Question</span>
                      <p className="text-headline-sm text-on-surface font-semibold leading-relaxed">
                        {studyDeck.cards[currentCardIndex]?.front}
                      </p>
                    </div>
                  )}
                </div>

                {/* Flip instructions at bottom */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 text-label-sm text-outline">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Click card to flip</span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-lg mt-lg">
                <button
                  onClick={handlePrevCard}
                  className="p-3 border border-outline-variant rounded-full text-on-surface hover:bg-surface-container transition-colors active:scale-90"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2px]" />
                </button>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-6 py-2 bg-surface-container border border-outline-variant rounded-full text-label-md font-semibold text-secondary hover:text-on-surface transition-colors"
                >
                  Reveal / Flip
                </button>
                <button
                  onClick={handleNextCard}
                  className="p-3 border border-outline-variant rounded-full text-on-surface hover:bg-surface-container transition-colors active:scale-90"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2px]" />
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Extra spacing */}
        <div className="h-24 lg:h-12" />
      </div>
    </div>
  );
}
