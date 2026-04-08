import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  var duration = 3 * 1000;
  var end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#2ED573']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#2ED573']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

export const triggerBigConfetti = () => {
  var duration = 8 * 1000;
  var end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 15,
      angle: 60,
      spread: 80,
      origin: { x: 0 },
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#2ED573', '#FF4757', '#FFA502']
    });
    confetti({
      particleCount: 15,
      angle: 120,
      spread: 80,
      origin: { x: 1 },
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#2ED573', '#FF4757', '#FFA502']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};
