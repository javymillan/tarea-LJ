import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Brain, Circle, Compass, CheckCircle } from 'lucide-react';

const TableHub = ({ tableNumber, onBack, onSelectLevel, progress }) => {
  // progress for this specific table is an object with { classic, mental, bubbles, maze }
  const tableLevelProgress = progress[tableNumber] || {};

  const levels = [
    { id: 'classic', name: 'Tabla Clásica', icon: <BookOpen size={32} /> },
    { id: 'mental', name: 'Mente Rápida', icon: <Brain size={32} /> },
    { id: 'bubbles', name: 'Burbujas', icon: <Circle size={32} /> },
    { id: 'maze', name: 'Laberinto', icon: <Compass size={32} /> }
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="button secondary" onClick={onBack}>
          <ArrowLeft size={20} /> Volver
        </button>
        <h2 style={{ fontSize: '2.5rem', color: '#fff', textShadow: '1px 2px 5px rgba(0,0,0,0.2)', margin: 0 }}>
          Misiones de la Tabla del {tableNumber}
        </h2>
        <div style={{ width: '105px' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {levels.map(lvl => {
          const isCompleted = tableLevelProgress[lvl.id]?.completed;
          return (
            <motion.div
              key={lvl.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-panel"
              style={{
                padding: '30px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                background: isCompleted ? 'rgba(46, 213, 115, 0.9)' : 'var(--card-bg)',
                color: isCompleted ? 'white' : 'var(--text-dark)'
              }}
              onClick={() => onSelectLevel(lvl.id)}
            >
              <div style={{ color: isCompleted ? 'white' : 'var(--primary)' }}>
                {lvl.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{lvl.name}</h3>
              {isCompleted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                  <CheckCircle size={18} /> ¡Completado!
                </div>
              ) : (
                <div style={{ fontWeight: 'bold', opacity: 0.7 }}>Jugar ▶</div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
};

export default TableHub;
