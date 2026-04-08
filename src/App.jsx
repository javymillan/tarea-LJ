import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Menu from './components/Menu';
import TableHub from './components/TableHub';
import TableQuiz from './components/TableQuiz';
import MentalMath from './components/MentalMath';
import BubbleMath from './components/BubbleMath';
import MazeGame from './components/MazeGame';
import { triggerBigConfetti } from './utils/confetti';

function App() {
  const [currentPage, setCurrentPage] = useState('menu'); // menu, hub, classic, mental, bubbles, maze
  const [selectedTable, setSelectedTable] = useState(null);
  
  // Progress structure: { 1: { completed: true, answers: {} }, 2: ... }
  const [progress, setProgress] = useState({});
  const [hasBigWinner, setHasBigWinner] = useState(false);

  // Load progress on initial render
  useEffect(() => {
    const savedProgress = localStorage.getItem('tablasProgress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed);
      } catch (e) {
        console.error("Error parsing progress", e);
      }
    }
  }, []);

  // Check for entire completion
  useEffect(() => {
    const isReady = Object.keys(progress).length > 0;
    const tables = Array.from({ length: 10 }, (_, i) => i + 1);
    
    // A table is completed if it has all 4 activities done: classic, mental, bubbles, maze
    const isActivityCompleted = (t, activity) => progress[t]?.[activity]?.completed;
    
    const allCompleted = tables.every(t => 
      isActivityCompleted(t, 'classic') &&
      isActivityCompleted(t, 'mental') &&
      isActivityCompleted(t, 'bubbles') &&
      isActivityCompleted(t, 'maze')
    );

    if (allCompleted && !hasBigWinner && isReady) {
      triggerBigConfetti();
      setHasBigWinner(true);
    }
  }, [progress, hasBigWinner]);

  const handleSelectTable = (tableNumber) => {
    setSelectedTable(tableNumber);
    setCurrentPage('hub');
  };

  const handleSelectLevel = (levelId) => {
    setCurrentPage(levelId);
  };

  const handleBack = () => {
    if (currentPage === 'hub') {
      setCurrentPage('menu');
      setSelectedTable(null);
    } else {
      setCurrentPage('hub'); // Back from an activity goes to hub
    }
  };

  const handleLevelComplete = (levelId, data) => {
    const newProgress = {
      ...progress,
      [selectedTable]: {
        ...(progress[selectedTable] || {}),
        [levelId]: { completed: true, ...data }
      }
    };
    setProgress(newProgress);
    localStorage.setItem('tablasProgress', JSON.stringify(newProgress));
    localStorage.removeItem(`partial_${selectedTable}_${levelId}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        {currentPage === 'menu' && (
          <Menu 
            key="menu" 
            progress={progress} 
            onSelectTable={handleSelectTable} 
          />
        )}
        
        {currentPage === 'hub' && selectedTable && (
          <TableHub 
            key={`hub-${selectedTable}`}
            tableNumber={selectedTable}
            progress={progress}
            onSelectLevel={handleSelectLevel}
            onBack={handleBack}
          />
        )}

        {currentPage === 'classic' && selectedTable && (
          <TableQuiz 
            key={`classic-${selectedTable}`}
            tableNumber={selectedTable}
            onBack={handleBack}
            onComplete={(table, data) => handleLevelComplete('classic', data)}
            initialSavedAnswers={
              progress[selectedTable]?.classic?.answers || 
              JSON.parse(localStorage.getItem(`partial_${selectedTable}_classic`) || '{}')
            }
          />
        )}

        {currentPage === 'mental' && selectedTable && (
          <MentalMath 
            key={`mental-${selectedTable}`}
            tableNumber={selectedTable}
            onBack={handleBack}
            onComplete={(type, data) => handleLevelComplete('mental', data)}
            initialSavedAnswers={
              progress[selectedTable]?.mental?.answers || 
              JSON.parse(localStorage.getItem(`partial_${selectedTable}_mental`) || '{}')
            }
          />
        )}

        {currentPage === 'bubbles' && selectedTable && (
          <BubbleMath 
            key={`bubbles-${selectedTable}`}
            tableNumber={selectedTable}
            onBack={handleBack}
            onComplete={(type, data) => handleLevelComplete('bubbles', data)}
            initialSavedAnswers={
              progress[selectedTable]?.bubbles?.answers || 
              JSON.parse(localStorage.getItem(`partial_${selectedTable}_bubbles`) || '{}')
            }
          />
        )}

        {currentPage === 'maze' && selectedTable && (
          <MazeGame 
            key={`maze-${selectedTable}`}
            tableNumber={selectedTable}
            onBack={handleBack}
            onComplete={(type, data) => handleLevelComplete('maze', data)}
            initialSavedAnswers={
              progress[selectedTable]?.maze?.answers || 
              JSON.parse(localStorage.getItem(`partial_${selectedTable}_maze`) || '[]')
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
