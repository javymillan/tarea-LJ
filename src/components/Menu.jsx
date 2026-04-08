import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Award, Lock } from 'lucide-react';

const Menu = ({ progress, onSelectTable }) => {
  const tables = Array.from({ length: 10 }, (_, i) => i + 1);

  // Check if all tables are completed to show the big prize
  const isTableCompleted = (t) => {
    const p = progress[t];
    return p?.classic?.completed && p?.mental?.completed && p?.bubbles?.completed && p?.maze?.completed;
  };
  
  const allCompleted = tables.every(t => isTableCompleted(t));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 style={{ fontSize: '3rem', color: '#fff', textShadow: '2px 4px 10px rgba(0,0,0,0.2)', marginBottom: '1rem' }}>
          ✨ ¡Aventuras Multiplicadoras! ✨
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '500', background: 'rgba(0,0,0,0.1)', padding: '10px 20px', borderRadius: '50px', display: 'inline-block' }}>
          Selecciona una tabla para practicar
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        {tables.map(table => {
          const isCompleted = isTableCompleted(table);
          return (
            <motion.div
              key={table}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-panel"
              style={{
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                background: isCompleted ? 'rgba(46, 213, 115, 0.9)' : 'var(--card-bg)',
                color: isCompleted ? 'white' : 'var(--text-dark)'
              }}
              onClick={() => onSelectTable(table)}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                {table}x
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                {isCompleted ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Star size={16} fill="white" /> ¡Logrado!
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary)' }}>
                    <Play size={16} /> Practicar
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {allCompleted && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="glass-panel animate-pulse"
          style={{ 
            marginTop: '3rem', 
            padding: '30px', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA502 100%)',
            color: 'white',
            boxShadow: '0 10px 30px rgba(255, 165, 2, 0.4)'
          }}
        >
          <Award size={64} style={{ marginBottom: '15px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>¡ERES UN MASTER!</h2>
          <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>
            Has completado todas las tablas. ¡Felicidades!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Menu;
