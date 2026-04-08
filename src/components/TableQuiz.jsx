import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, HelpCircle, Save } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

const TableQuiz = ({ tableNumber, onBack, onComplete, initialSavedAnswers = {} }) => {
  // We manage 10 inputs for 1 to 10
  const multipliers = Array.from({ length: 10 }, (_, i) => i + 1);
  
  const [answers, setAnswers] = useState(
    multipliers.reduce((acc, m) => {
      acc[m] = initialSavedAnswers[m] || '';
      return acc;
    }, {})
  );

  const [feedback, setFeedback] = useState({}); // { 1: 'correct' | 'incorrect' }
  const [showCompletion, setShowCompletion] = useState(false);
  const [message, setMessage] = useState('');

  // Save partial progress to local storage (could bubble up to App)
  useEffect(() => {
    localStorage.setItem(`partial_${tableNumber}`, JSON.stringify(answers));
  }, [answers, tableNumber]);

  const handleInputChange = (m, value) => {
    setAnswers(prev => ({ ...prev, [m]: value }));
    // Reset feedback for this specific input if they start typing again
    setFeedback(prev => {
      if (prev[m] === 'incorrect') {
        const newFb = { ...prev };
        delete newFb[m];
        return newFb;
      }
      return prev;
    });
    setMessage('');
  };

  const handleVerify = () => {
    let allCorrect = true;
    let anyEmpty = false;
    const newFeedback = {};

    multipliers.forEach(m => {
      const ans = answers[m];
      if (ans === '') {
        anyEmpty = true;
        allCorrect = false;
      } else if (parseInt(ans, 10) === tableNumber * m) {
        newFeedback[m] = 'correct';
      } else {
        newFeedback[m] = 'incorrect';
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);

    if (allCorrect) {
      setMessage('¡Felicidades Luis Javier! Todo está perfecto.');
      setShowCompletion(true);
      triggerConfetti();
      onComplete(tableNumber, answers);
    } else {
      setMessage('Verifica tu información. Señalé dónde hay que revisar.');
    }
  };

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      style={{ flex: 1, padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="button secondary" onClick={onBack} style={{ padding: '10px 15px' }}>
          <ArrowLeft size={20} /> Volver
        </button>
        <h2 style={{ fontSize: '2.5rem', color: '#fff', textShadow: '1px 2px 5px rgba(0,0,0,0.2)', margin: 0 }}>
          Tabla del {tableNumber}
        </h2>
        <div style={{ width: '105px' }} /> {/* Spacer to center title */}
      </div>

      <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {multipliers.map(m => (
            <div 
              key={m} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '15px',
                background: 'rgba(255,255,255,0.6)',
                padding: '15px',
                borderRadius: '15px'
              }}
            >
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', width: '100px', textAlign: 'right' }}>
                {tableNumber} <span style={{ color: 'var(--primary)' }}>x</span> {m} = 
              </span>
              <input 
                type="number"
                value={answers[m]}
                onChange={(e) => handleInputChange(m, e.target.value)}
                className={feedback[m] || ''}
                readOnly={showCompletion}
              />
              <div style={{ width: '24px' }}>
                {feedback[m] === 'correct' && <CheckCircle color="var(--success)" size={24} />}
                {feedback[m] === 'incorrect' && <HelpCircle color="var(--error)" size={24} />}
              </div>
            </div>
          ))}
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              marginTop: '15px', 
              padding: '15px', 
              borderRadius: '12px', 
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              background: showCompletion ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)',
              color: showCompletion ? 'var(--text-dark)' : 'var(--error)'
            }}
          >
            {message}
          </motion.div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {showCompletion ? (
            <button className="button success animate-bounce-in" onClick={onBack} style={{ fontSize: '1.3rem', padding: '15px 30px' }}>
              <CheckCircle size={24} /> Continuar al Menú
            </button>
          ) : (
            <button className="button" onClick={handleVerify} style={{ fontSize: '1.3rem', padding: '15px 30px' }}>
              <Save size={24} /> Verificar Respuestas
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TableQuiz;
