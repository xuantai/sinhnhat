import React, { useMemo } from 'react';

const FlowerPetals = () => {
  const petals = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const size = Math.random() * 10 + 10; // 10px to 20px
      const left = Math.random() * 100; // 0 to 100vw
      const animationDuration = Math.random() * 8 + 5; // 5s to 13s
      const animationDelay = Math.random() * 5; // 0s to 5s
      const swayDuration = Math.random() * 3 + 2; // 2s to 5s
      const isAlt = Math.random() > 0.5;

      return {
        id: i,
        className: isAlt ? 'petal-alt opacity-60' : 'petal opacity-40',
        left: `${left}vw`,
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${animationDuration}s`,
        animationDelay: `${animationDelay}s`,
        swayDuration: `${swayDuration}s`
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 block">
      {petals.map((p) => (
        <div
          key={p.id}
          className={`absolute -top-10 backdrop-blur-sm shadow-sm drop-shadow-sm ${p.className}`}
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            animation: `fall ${p.animationDuration} linear ${p.animationDelay} infinite, sway ${p.swayDuration} ease-in-out infinite alternate`
          }}
        />
      ))}
    </div>
  );
};

export default FlowerPetals;
