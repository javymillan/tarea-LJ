import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, HelpCircle, Save, Clock } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

const MentalMath = ({ tableNumber, onBack, onComplete, initialSavedAnswers = {} }) => {
  const multipliers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // As seen in the image, includes 0
  // Shuffle them or just keep standard. Image has them random! 
  // Let's use a fixed random order for consistency or standard. The image has them out of order: 2x0, 2x9, 2x1, 2x5...
  const order = [0, 9, 1, 5, 3, 8, 4, 6, 7, 2, 10]; 
  
  const [answers, setAnswers] = useState(
    order.reduce((acc, m) => {
      acc[m] = initialSavedAnswers[m] || '';
      return acc;
    }, {})
  );

  const [feedback, setFeedback] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [message, setMessage] = useState('');
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // Timer
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!timerActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, time]);

  const handleInputChange = (m, value) => {
    setAnswers(prev => ({ ...prev, [m]: value }));
    setFeedback(prev => ({ ...prev, [m]: null }));
    setMessage('');
  };

  const handleVerify = () => {
    let allCorrect = true;
    const newFeedback = {};
    let puntos = 0;

    order.forEach(m => {
      const ans = answers[m];
      if (ans !== '' && parseInt(ans, 10) === tableNumber * m) {
        newFeedback[m] = 'correct';
        puntos++;
      } else {
        newFeedback[m] = 'incorrect';
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);

    if (allCorrect) {
      setTimerActive(false);
      setMessage(`¡Excelente Luis Javier! Puntos: ${puntos}/${order.length}. Tiempo: ${time}s`);
      setShowCompletion(true);
      triggerConfetti();
      onComplete('mental', { answers, time, puntos });
    } else {
      setMessage('Verifica la información. Tienes algunos errores que corregir.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button className="button secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={20} /> Volver
      </button>
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Multiplicaciones Mentales ({tableNumber}x)</h2>
          <div style={{ fontSize: '1.5rem', display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.5)', padding: '10px 20px', borderRadius: '20px' }}>
            <Clock size={24} /> {time} s
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
          {order.map(m => (
            <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{tableNumber}x{m}=</span>
              <input 
                type="number"
                value={answers[m]}
                onChange={(e) => handleInputChange(m, e.target.value)}
                className={feedback[m] || ''}
                readOnly={showCompletion}
                style={{ width: '80px' }}
              />
            </div>
          ))}
        </div>

        {message && (
          <div style={{ marginTop: '20px', padding: '15px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: showCompletion ? 'var(--success)' : 'var(--error)' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          {!showCompletion && (
            <button className="button" onClick={handleVerify}><Save size={24} /> Verificar</button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MentalMath;
