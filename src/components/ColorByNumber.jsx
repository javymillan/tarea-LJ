import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Palette } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

const ColorByNumber = ({ tableNumber, onBack, onComplete, initialSavedAnswers = {} }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [filledPaths, setFilledPaths] = useState(initialSavedAnswers || {}); // { pathId: color }
  const [showCompletion, setShowCompletion] = useState(false);
  const [message, setMessage] = useState('');

  const colorMap = [
    { label: `${tableNumber}x1`, result: tableNumber * 1, color: '#3498db', name: 'Azul' },
    { label: `${tableNumber}x2`, result: tableNumber * 2, color: '#e67e22', name: 'Naranja' },
    { label: `${tableNumber}x3`, result: tableNumber * 3, color: '#ff9ff3', name: 'Rosa' },
    { label: `${tableNumber}x4`, result: tableNumber * 4, color: '#f5deb3', name: 'Beige' },
    { label: `${tableNumber}x5`, result: tableNumber * 5, color: '#2c3e50', name: 'Negro' },
    { label: `${tableNumber}x6 y ${tableNumber}x7`, result: [tableNumber * 6, tableNumber * 7], color: '#8b4513', name: 'Café' },
    { label: `${tableNumber}x8 y ${tableNumber}x9`, result: [tableNumber * 8, tableNumber * 9], color: '#f1c40f', name: 'Amarillo' },
    { label: `${tableNumber}x10`, result: tableNumber * 10, color: '#9b59b6', name: 'Morado' },
  ];

  const bearSegments = [
    // Head & Ears
    { id: 'ear-l', number: tableNumber * 4, path: "M 40,60 Q 30,30 60,40" },
    { id: 'ear-r', number: tableNumber * 4, path: "M 160,60 Q 170,30 140,40" },
    { id: 'face', number: tableNumber * 6, path: "M 100,50 Q 150,50 150,100 Q 150,150 100,150 Q 50,150 50,100 Q 50,50 100,50" },
    // Body & Paws
    { id: 'body', number: tableNumber * 10, path: "M 100,150 Q 160,150 160,220 Q 160,280 100,280 Q 40,280 40,220 Q 40,150 100,150" },
    { id: 'paw-l', number: tableNumber * 2, path: "M 45,230 Q 20,240 30,270 Q 50,270 50,240" },
    { id: 'paw-r', number: tableNumber * 2, path: "M 155,230 Q 180,240 170,270 Q 150,270 150,240" },
    // Details
    { id: 'snout', number: tableNumber * 8, path: "M 100,110 Q 120,110 120,130 Q 120,145 100,145 Q 80,145 80,130 Q 80,110 100,110" },
    { id: 'nose', number: 8, path: "M 100,120 Q 105,120 105,125 Q 100,130 95,125 Q 95,120 100,120", isSpecial: true },
    // Extra sections to fill the space
    { id: 'bg-1', number: tableNumber * 1, path: "M 0,0 L 100,0 L 50,50 Z" },
    { id: 'bg-2', number: tableNumber * 5, path: "M 200,0 L 100,0 L 150,50 Z" },
    { id: 'bg-3', number: tableNumber * 3, path: "M 0,300 L 0,200 L 50,250 Z" },
    { id: 'bg-4', number: tableNumber * 9, path: "M 200,300 L 200,200 L 150,250 Z" },
  ];

  const handleSegmentClick = (segmentId, number) => {
    if (showCompletion) return;
    if (!selectedColor) {
      setMessage('¡Primero selecciona un color de arriba!');
      return;
    }

    // Check if color matches number
    const colorConfig = colorMap.find(c => c.color === selectedColor);
    const isCorrect = Array.isArray(colorConfig.result) 
      ? colorConfig.result.includes(number)
      : colorConfig.result === number;

    if (isCorrect || segmentId === 'nose') {
      setFilledPaths(prev => ({ ...prev, [segmentId]: selectedColor }));
      setMessage('');
    } else {
      setMessage(`¡Ups! Ese no es el color para el número ${number}.`);
    }

    // Check for completion
    const allFilled = bearSegments.every(s => (filledPaths[s.id] || s.id === segmentId));
    if (allFilled) {
      setShowCompletion(true);
      triggerConfetti();
      onComplete('color_by_number', { answers: filledPaths });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button className="button secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Colorea por Número ({tableNumber}x)</h2>
        <p style={{ marginBottom: '20px' }}>Selecciona un color y haz clic en las partes del dibujo que tengan el resultado correcto.</p>

        {/* Color Palette */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '30px' }}>
          {colorMap.map(c => (
            <button
              key={c.color}
              onClick={() => setSelectedColor(c.color)}
              style={{
                backgroundColor: c.color,
                color: c.color === '#2c3e50' ? 'white' : 'black',
                padding: '10px',
                border: selectedColor === c.color ? '4px solid white' : '2px solid transparent',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: selectedColor === c.color ? '0 0 15px rgba(255,255,255,0.5)' : 'none',
                transform: selectedColor === c.color ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s'
              }}
            >
              <div>{c.name}</div>
              <div style={{ fontSize: '0.8rem' }}>{c.label}</div>
            </button>
          ))}
        </div>

        {/* Drawing Area */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'center' }}>
          <svg width="400" height="400" viewBox="0 0 200 300" style={{ cursor: 'crosshair', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))' }}>
             {bearSegments.map(s => (
               <g key={s.id} onClick={() => handleSegmentClick(s.id, s.number)}>
                 <path
                   d={s.path}
                   fill={filledPaths[s.id] || '#f9f9f9'}
                   stroke="#333"
                   strokeWidth="2"
                   style={{ transition: 'fill 0.3s' }}
                 />
                 <text
                   x="50%"
                   y="50%"
                   dominantBaseline="middle"
                   textAnchor="middle"
                   fill="#999"
                   fontSize="8"
                   style={{ pointerEvents: 'none', userSelect: 'none' }}
                 >
                   {/* This logic is just to position numbers roughly in segments */}
                   {/* In a real SVG we'd have exact coordinates for each label */}
                 </text>
                 <foreignObject width="100%" height="100%" pointerEvents="none">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '10px', fontWeight: 'bold' }}>
                        {/* We use a simplified approach here for the demo */}
                    </div>
                 </foreignObject>
               </g>
             ))}
             
             {/* Overlay labels since positioning <text> inside <g> with path is tricky */}
             <text x="50" y="30" fontSize="10" fill="#999" textAnchor="middle" pointerEvents="none">{tableNumber*1}</text>
             <text x="150" y="30" fontSize="10" fill="#999" textAnchor="middle" pointerEvents="none">{tableNumber*5}</text>
             <text x="50" y="50" fontSize="10" fill="#999" textAnchor="middle" pointerEvents="none">{tableNumber*4}</text>
             <text x="150" y="50" fontSize="10" fill="#999" textAnchor="middle" pointerEvents="none">{tableNumber*4}</text>
             <text x="100" y="90" fontSize="10" fill="#999" textAnchor="middle" pointerEvents="none">{tableNumber*6}</text>
             <text x="100" y="210" fontSize="10" fill="#999" textAnchor="middle" pointerEvents="none">{tableNumber*10}</text>
             <text x="35" y="255" fontSize="10" fill="#333" textAnchor="middle" pointerEvents="none">{tableNumber*2}</text>
             <text x="165" y="255" fontSize="10" fill="#333" textAnchor="middle" pointerEvents="none">{tableNumber*2}</text>
             <text x="100" y="130" fontSize="8" fill="#333" textAnchor="middle" pointerEvents="none">{tableNumber*8}</text>
             <text x="30" y="250" fontSize="10" fill="#999" textAnchor="middle" pointerEvents="none">{tableNumber*3}</text>
             <text x="170" y="250" fontSize="10" fill="#999" textAnchor="middle" pointerEvents="none">{tableNumber*9}</text>
          </svg>
        </div>

        {message && <div style={{ marginTop: '20px', color: showCompletion ? 'var(--success)' : '#e67e22', fontWeight: 'bold' }}>{message}</div>}

        {showCompletion && (
          <div style={{ marginTop: '20px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <CheckCircle style={{ verticalAlign: 'middle', marginRight: '5px' }} />
            ¡Dibujo completadado! Luis Javier, eres un artista de las tablas.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ColorByNumber;
