import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

const MazeGame = ({ tableNumber, onBack, onComplete, initialSavedAnswers = [] }) => {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(initialSavedAnswers || []); // array of indices
  const [feedback, setFeedback] = useState([]); // 'correct' | 'incorrect' indicating if the selected was right/wrong
  const [message, setMessage] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  // Generate a random maze of 25 items (5x5) when component mounts
  useEffect(() => {
    // Basic logic: some are true, some are false.
    const items = [];
    for(let i=0; i<25; i++) {
        // True or False equation
        const isTrue = Math.random() > 0.5;
        const m = Math.floor(Math.random() * 10) + 1;
        let ans = tableNumber * m;
        if (!isTrue) {
            // offset the answer by 1 to 5
            ans += (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
        }
        items.push({ id: i, text: `${tableNumber}x${m}=${ans}`, isTrue });
    }
    setGrid(items);
  }, [tableNumber]);

  const toggleSelect = (index) => {
    if (showCompletion) return;
    setSelected(prev => {
        if (prev.includes(index)) return prev.filter(i => i !== index);
        return [...prev, index];
    });
    setFeedback([]); // reset feedback
    setMessage('');
  };

  const handleVerify = () => {
    let allGood = true;
    const newFeedback = new Array(25).fill(null);
    let missedAny = false;

    grid.forEach((item, index) => {
        const isSelected = selected.includes(index);
        
        if (isSelected && item.isTrue) {
            newFeedback[index] = 'correct'; 
        } else if (isSelected && !item.isTrue) {
            newFeedback[index] = 'incorrect';
            allGood = false;
        } else if (!isSelected && item.isTrue) {
            missedAny = true;
        }
    });

    setFeedback(newFeedback);

    if (allGood && !missedAny) {
      setMessage('¡Felicidades Luis Javier! Encontraste el camino correcto a la salida.');
      setShowCompletion(true);
      triggerConfetti();
      const reportAnswers = selected.map(idx => ({
        question: `Casilla ${idx}`,
        userAnswer: grid[idx].text,
        isCorrect: grid[idx].isTrue
      }));
      onComplete('maze', { answers: reportAnswers });
    } else if (!allGood) {
      setMessage('Marcaste casillas rojas que no son correctas. ¡Sigue intentando!');
    } else if (missedAny) {
      setMessage('Aún te faltan operaciones correctas por iluminar.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button className="button secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
        <h2>Laberinto ({tableNumber}x)</h2>
        <p style={{ marginBottom: '20px' }}>Colorea todas las multiplicaciones correctas para llegar de la entrada a la salida.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px', backgroundColor: '#333', border: '5px solid #333', borderRadius: '10px', overflow: 'hidden' }}>
          {grid.map((item, index) => {
              const isSelected = selected.includes(index);
              const fb = feedback[index];
              let bgColor = isSelected ? 'var(--accent)' : 'white';
              if (fb === 'incorrect') bgColor = 'var(--error)';
              if (fb === 'correct') bgColor = 'var(--success)';

              return (
                <div 
                  key={item.id} 
                  onClick={() => toggleSelect(index)}
                  style={{ 
                    backgroundColor: bgColor, 
                    color: fb === 'incorrect' ? 'white' : 'black',
                    padding: '20px 10px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    userSelect: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.text}
                </div>
              )
          })}
        </div>
        <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>ENTRADA</span>
            <span>SALIDA</span>
        </div>

        {message && <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2rem', color: showCompletion ? 'var(--success)' : 'var(--error)' }}>{message}</div>}

        {!showCompletion && <button className="button" style={{ marginTop: '20px' }} onClick={handleVerify}><Save size={24} /> Verificar Laberinto</button>}
      </div>
    </motion.div>
  );
}

export default MazeGame;
