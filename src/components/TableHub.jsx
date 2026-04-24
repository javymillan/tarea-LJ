import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Brain, Circle, Compass, CheckCircle, Lock, CheckSquare, Palette, FileDown } from 'lucide-react';
import { generateIndividualReport } from '../utils/pdfGenerator';

const TableHub = ({ tableNumber, onBack, onSelectLevel, progress }) => {
  const tableLevelProgress = progress[tableNumber] || {};

  const isCompleted = (id) => !!tableLevelProgress[id]?.completed;

  const levels = [
    { id: 'classic',  name: 'Tabla Clásica', icon: <BookOpen size={36} />, level: 1 },
    { id: 'mental',   name: 'Mente Rápida',  icon: <Brain size={36} />,   level: 2 },
    { id: 'bubbles',  name: 'Burbujas',       icon: <Circle size={36} />,  level: 3 },
    { id: 'maze',     name: 'Laberinto',      icon: <Compass size={36} />, level: 4 },
    { id: 'true_false', name: 'Verdadero/Falso', icon: <CheckSquare size={36} />, level: 5 },
    { id: 'color_by_number', name: 'Colorea', icon: <Palette size={36} />, level: 6 },
  ];

  // Unlock logic:
  // Level 1 & 2: always open
  // Level 3: needs 1 & 2 complete
  // Level 4: needs 3 complete
  // Level 5: needs 4 complete
  // Level 6: needs 5 complete
  const isUnlocked = (lvl) => {
    if (lvl.level <= 2) return true;
    if (lvl.level === 3) return isCompleted('classic') && isCompleted('mental');
    if (lvl.level === 4) return isCompleted('bubbles');
    if (lvl.level === 5) return isCompleted('maze');
    if (lvl.level === 6) return isCompleted('true_false');
    return false;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="button secondary" onClick={onBack}>
          <ArrowLeft size={20} /> Volver
        </button>
        <h2 style={{ fontSize: '2.2rem', color: '#fff', textShadow: '1px 2px 8px rgba(0,0,0,0.3)', margin: 0, textAlign: 'center' }}>
          🎮 Misiones — Tabla del {tableNumber}
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {Object.keys(tableLevelProgress).length > 0 && (
            <button 
              className="button" 
              onClick={() => generateIndividualReport(tableNumber, tableLevelProgress)}
              style={{ background: '#FF851B', color: '#fff' }}
            >
              <FileDown size={20} /> Reporte
            </button>
          )}
          <div style={{ width: '5px' }} />
        </div>
      </div>

      {/* Progress bar */}
      {(() => {
        const done = levels.filter(l => isCompleted(l.id)).length;
        const total = levels.length;
        const pct = (done / total) * 100;
        return (
          <div style={{ marginBottom: '1.8rem' }}>
            <div style={{ color: '#fff', fontSize: '1rem', marginBottom: '6px', opacity: 0.8 }}>
              Progreso: {done}/{total} misiones completadas
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #39CCCC, #2ECC40)',
                  boxShadow: '0 0 10px rgba(46,204,64,0.5)',
                }}
              />
            </div>
          </div>
        );
      })()}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {levels.map((lvl, i) => {
          const completed = isCompleted(lvl.id);
          const unlocked = isUnlocked(lvl);

          // Card colors
          let bg, border, iconColor, textColor, badgeBg, badgeText;
          if (completed) {
            bg = 'linear-gradient(135deg, rgba(46,213,115,0.85), rgba(0,180,80,0.85))';
            border = '2px solid rgba(46,213,115,0.6)';
            iconColor = '#fff';
            textColor = '#fff';
            badgeBg = 'rgba(255,255,255,0.25)';
            badgeText = '#fff';
          } else if (unlocked) {
            bg = 'linear-gradient(135deg, rgba(0,116,217,0.75), rgba(0,60,150,0.75))';
            border = '2px solid rgba(57,204,204,0.5)';
            iconColor = '#FFDC00';
            textColor = '#fff';
            badgeBg = 'rgba(255,220,0,0.2)';
            badgeText = '#FFDC00';
          } else {
            bg = 'rgba(30,30,60,0.55)';
            border = '2px solid rgba(255,255,255,0.1)';
            iconColor = 'rgba(255,255,255,0.3)';
            textColor = 'rgba(255,255,255,0.4)';
            badgeBg = 'rgba(255,255,255,0.08)';
            badgeText = 'rgba(255,255,255,0.4)';
          }

          return (
            <motion.div
              key={lvl.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={unlocked ? { scale: 1.06, y: -4 } : {}}
              whileTap={unlocked ? { scale: 0.96 } : {}}
              onClick={() => unlocked && onSelectLevel(lvl.id)}
              style={{
                background: bg,
                border,
                borderRadius: '20px',
                padding: '28px 16px',
                textAlign: 'center',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                backdropFilter: 'blur(12px)',
                boxShadow: completed
                  ? '0 8px 30px rgba(46,213,115,0.35)'
                  : unlocked
                  ? '0 8px 30px rgba(0,116,217,0.35)'
                  : '0 4px 15px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 0.3s',
              }}
            >
              {/* Level badge */}
              <div style={{
                position: 'absolute', top: '10px', left: '12px',
                background: badgeBg, color: badgeText,
                borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                padding: '2px 10px', letterSpacing: '0.5px'
              }}>
                Nivel {lvl.level}
              </div>

              {/* Shimmer for unlocked */}
              {unlocked && !completed && (
                <div style={{
                  position: 'absolute', top: 0, left: '-60%', width: '40%', height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                  animation: 'shimmer 2.5s infinite',
                  pointerEvents: 'none',
                }} />
              )}

              {/* Icon / Lock */}
              <div style={{ color: iconColor, marginTop: '10px' }}>
                {unlocked ? lvl.icon : <Lock size={36} />}
              </div>

              <h3 style={{ fontSize: '1.2rem', margin: 0, color: textColor, fontWeight: 700 }}>
                {lvl.name}
              </h3>

              {/* Status badge */}
              {completed ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontWeight: 700, color: '#fff', fontSize: '0.9rem',
                  background: 'rgba(255,255,255,0.2)', borderRadius: '999px',
                  padding: '4px 14px'
                }}>
                  <CheckCircle size={15} /> ¡Listo!
                </div>
              ) : unlocked ? (
                <div style={{
                  fontWeight: 700, color: '#FFDC00', fontSize: '0.9rem',
                  background: 'rgba(255,220,0,0.15)', borderRadius: '999px',
                  padding: '4px 16px', letterSpacing: '1px'
                }}>
                  ▶ Jugar
                </div>
              ) : (
                <div style={{
                  fontWeight: 600, color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem',
                  background: 'rgba(255,255,255,0.06)', borderRadius: '999px',
                  padding: '4px 14px'
                }}>
                  🔒 Bloqueado
                </div>
              )}

              {/* Tooltip for locked */}
              {!unlocked && (
                <div style={{
                  fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)',
                  textAlign: 'center', lineHeight: 1.4
                }}>
                  {lvl.level === 3 ? 'Completa 1 y 2' : 
                   lvl.level === 4 ? 'Completa Burbujas' :
                   lvl.level === 5 ? 'Completa Laberinto' :
                   'Completa Verdadero/Falso'}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TableHub;
