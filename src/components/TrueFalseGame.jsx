import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Check, X } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

const TrueFalseGame = ({ tableNumber, onBack, onComplete, initialSavedAnswers = {} }) => {
  // Generate a set of multiplications, some correct, some wrong
  const [exercises] = useState(() => {
    const list = [];
    const multipliers = [8, 9, 7, 1, 5, 2, 3, 3, 10, 4, 5, 9, 7, 8, 6].slice(0, 15);
    
    multipliers.forEach((m, idx) => {
      const isCorrect = Math.random() > 0.4;
      let result = tableNumber * m;
      if (!isCorrect) {
        const offset = Math.floor(Math.random() * 3) + 1;
        result += (Math.random() > 0.5 ? offset : -offset);
      }
      list.push({ id: idx, m, result, isCorrect });
    });
    return list;
  });

  const [selections, setSelections] = useState(initialSavedAnswers || {}); // { id: 'correct' | 'incorrect' }
  const [feedback, setFeedback] = useState({});
  const [message, setMessage] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  const handleSelect = (id, type) => {
    if (showCompletion) return;
    setSelections(prev => ({ ...prev, [id]: type }));
    setFeedback(prev => ({ ...prev, [id]: null }));
    setMessage('');
  };

  const handleVerify = () => {
    let allRight = true;
    const newFeedback = {};
    
    exercises.forEach(ex => {
      const selection = selections[ex.id];
      const correctType = ex.isCorrect ? 'correct' : 'incorrect';
      
      if (!selection) {
        allRight = false;
        newFeedback[ex.id] = 'missing';
      } else if (selection === correctType) {
        newFeedback[ex.id] = 'valid';
      } else {
        newFeedback[ex.id] = 'invalid';
        allRight = false;
      }
    });

    setFeedback(newFeedback);

    if (allRight) {
      setMessage('¡Excelente Luis Javier! Identificaste todas las operaciones correctamente.');
      setShowCompletion(true);
      triggerConfetti();
      onComplete('true_false', { answers: selections });
    } else {
      setMessage('Algunas operaciones no son correctas. ¡Revisa los lápices rojos!');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button className="button secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Verdadero o Falso ({tableNumber}x)</h2>
        <p style={{ marginBottom: '30px', fontSize: '1.2rem' }}>Selecciona <span style={{color: 'var(--success)', fontWeight: 'bold'}}>✓ Verde</span> si la operación es correcta y <span style={{color: '#ff9800', fontWeight: 'bold'}}>✗ Naranja</span> si es incorrecta.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {exercises.map((ex) => {
            const selection = selections[ex.id];
            const fb = feedback[ex.id];
            
            return (
              <div key={ex.id} className="pencil-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }}>
                {/* Pencil SVG Shape */}
                <svg width="240" height="60" viewBox="0 0 240 60">
                   <path d="M10,10 L200,10 L220,30 L200,50 L10,50 Z" fill="white" stroke="#333" strokeWidth="2" />
                   <path d="M10,10 L30,10 L30,50 L10,50 Z" fill="#ddd" />
                   <path d="M200,10 L220,30 L200,50 Z" fill="#ffdbac" />
                   <path d="M215,25 L220,30 L215,35 Z" fill="black" />
                </svg>
                
                <div style={{ position: 'absolute', left: '40px', width: '130px', fontSize: '1.4rem', fontWeight: 'bold', color: '#333' }}>
                   {tableNumber} x {ex.m} = {ex.result}
                </div>

                <div style={{ position: 'absolute', right: '10px', display: 'flex', gap: '5px' }}>
                   <button 
                    onClick={() => handleSelect(ex.id, 'correct')}
                    style={{ 
                        width: '35px', height: '35px', borderRadius: '50%', border: 'none', 
                        backgroundColor: selection === 'correct' ? 'var(--success)' : '#eee',
                        color: selection === 'correct' ? 'white' : '#666',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                   >
                     <Check size={20} />
                   </button>
                   <button 
                    onClick={() => handleSelect(ex.id, 'incorrect')}
                    style={{ 
                        width: '35px', height: '35px', borderRadius: '50%', border: 'none', 
                        backgroundColor: selection === 'incorrect' ? '#ff9800' : '#eee',
                         color: selection === 'incorrect' ? 'white' : '#666',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                   >
                     <X size={20} />
                   </button>
                </div>
                
                {fb === 'invalid' && (
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--error)', borderRadius: '50%', padding: '2px' }}>
                        <X size={16} color="white" />
                    </div>
                )}
                {fb === 'valid' && (
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--success)', borderRadius: '50%', padding: '2px' }}>
                        <Check size={16} color="white" />
                    </div>
                )}
              </div>
            );
          })}
        </div>

        {showCompletion ? (
          <div style={{ marginTop: '30px' }}>
            <button className="button success animate-bounce-in" onClick={onBack}>
               ¡Ganaste! Volver al Mapa 🏆
            </button>
          </div>
        ) : (
          <button className="button" style={{ marginTop: '30px' }} onClick={handleVerify}><Save size={24} /> Verificar Operaciones</button>
        )}
      </div>
    </motion.div>
  );
}

export default TrueFalseGame;
