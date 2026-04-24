import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

const BubbleMath = ({ tableNumber, onBack, onComplete, initialSavedAnswers = {} }) => {
  // Generate 16 bubble puzzles
  // Format: { id, top: true|false, bottom: number } 
  // If top is true, top is missing. If top is false, bottom is missing.
  const puzzles = [
    { id: 1, top: true, m: 3, exTop: tableNumber*3 }, // Example is usually fully filled but mapped here
    { id: 2, top: false, m: 8, givenTop: tableNumber*8 },
    { id: 3, top: true, m: 4 },
    { id: 4, top: false, m: 1, givenTop: tableNumber*1 },
    { id: 5, top: true, m: 9 },
    { id: 6, top: true, m: 7 },
    { id: 7, top: true, m: 5 },
    { id: 8, top: true, m: 2 },
    { id: 9, top: true, m: 0 },
    { id: 10, top: true, m: 2 }, // repeats happen in the image
    { id: 11, top: false, m: 10, givenTop: tableNumber*10 },
    { id: 12, top: false, m: 5, givenTop: tableNumber*5 },
    { id: 13, top: true, m: 2 }, 
    { id: 14, top: true, m: 6 },
    { id: 15, top: true, m: 7 },
    { id: 16, top: true, m: 9 }
  ];

  const [answers, setAnswers] = useState(initialSavedAnswers || {});
  const [feedback, setFeedback] = useState({});
  const [message, setMessage] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  const handleInputChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setFeedback(prev => ({ ...prev, [id]: null }));
    setMessage('');
  };

  const handleVerify = () => {
    let allCorrect = true;
    const newFeedback = {};

    puzzles.forEach(p => {
      // First is example, technically could be filled already
      if (p.id === 1) return;

      const ans = answers[p.id];
      let correctAns = p.top ? tableNumber * p.m : p.m;

      if (ans !== '' && parseInt(ans, 10) === correctAns) {
        newFeedback[p.id] = 'correct';
      } else {
        newFeedback[p.id] = 'incorrect';
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);

    if (allCorrect) {
      setMessage('¡Felicidades Luis Javier! Completaste la burbuja mágica.');
      setShowCompletion(true);
      triggerConfetti();
      const reportAnswers = puzzles.map(p => {
        if (p.id === 1) return { question: `${tableNumber} x ${p.m}`, userAnswer: p.exTop, isCorrect: true };
        const ans = answers[p.id];
        const correctAns = p.top ? tableNumber * p.m : p.m;
        return {
          question: p.top ? `${tableNumber} x ${p.m} = ?` : `${tableNumber} x ? = ${p.givenTop}`,
          userAnswer: ans,
          isCorrect: parseInt(ans, 10) === correctAns
        };
      });
      onComplete('bubbles', { answers: reportAnswers });
    } else {
      setMessage('Ops. Hay algunos errores, verifica las burbujas rojas.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button className="button secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
        <h2>Completa las Burbujas ({tableNumber}x)</h2>
        <p style={{ marginBottom: '20px' }}>Multiplica los números de abajo para encontrar el de arriba, o encuentra el número que falta abajo.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', border: '5px solid #2F3542', padding: '15px', borderRadius: '15px', backgroundColor: 'white' }}>
          {puzzles.map(p => (
            <div key={p.id} style={{ border: '2px solid #ddd', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {/* Product (Top bubble) */}
              <div style={{ marginBottom: '-10px', zIndex: 1 }}>
                {p.id === 1 ? (
                  <div className="bubble text-red" style={{ fontWeight: 'bold', color: 'red' }}>{p.exTop}</div>
                ) : p.top ? (
                  <input type="number" className={`bubble-input ${feedback[p.id]}`} value={answers[p.id] || ''} onChange={(e)=>handleInputChange(p.id, e.target.value)} readOnly={showCompletion} />
                ) : (
                  <div className="bubble text-bold">{p.givenTop}</div>
                )}
              </div>
              
              {/* Legs SVG */}
              <svg width="60" height="40" style={{ position: 'absolute', top: '55px', zIndex: 0 }}>
                <line x1="30" y1="0" x2="15" y2="40" stroke="black" strokeWidth="2" />
                <line x1="30" y1="0" x2="45" y2="40" stroke="black" strokeWidth="2" />
              </svg>

              <div style={{ display: 'flex', gap: '25px', marginTop: '10px', alignItems: 'center', zIndex: 1 }}>
                {/* Left Bubble (always the table number) */}
                <div className="bubble bubble-small">{tableNumber}</div>
                
                <span style={{ position: 'absolute', fontWeight: 'bold', fontSize: '1.2rem', left: '50%', transform: 'translateX(-50%)', bottom: '25px', background: 'white', padding: '0 2px' }}>x</span>

                {/* Right Bubble (multiplier) */}
                {p.id === 1 ? (
                  <div className="bubble bubble-small">{p.m}</div>
                ) : !p.top ? (
                  <input type="number" className={`bubble-input bubble-small ${feedback[p.id]}`} value={answers[p.id] || ''} onChange={(e)=>handleInputChange(p.id, e.target.value)} readOnly={showCompletion} />
                ) : (
                  <div className="bubble bubble-small">{p.m}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {message && <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2rem', color: showCompletion ? 'var(--success)' : 'var(--error)' }}>{message}</div>}

        {!showCompletion && <button className="button" style={{ marginTop: '20px' }} onClick={handleVerify}><Save size={24} /> Verificar</button>}
      </div>
    </motion.div>
  );
}

export default BubbleMath;
