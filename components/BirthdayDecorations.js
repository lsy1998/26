import React from 'react';
import { 
  Cake, 
  CardGiftcard, 
  Celebration,
  Stars,
  Favorite,
  EmojiEmotions,
  LocalFlorist,
  Flare,
} from '@mui/icons-material';

const BirthdayDecorations = () => {
  // 定义装饰元素
  const decorations = [
    { Icon: Cake, color: '#FF69B4', size: 40, position: { top: '10%', left: '5%' } },
    { Icon: CardGiftcard, color: '#87CEEB', size: 35, position: { top: '15%', right: '8%' } },
    { Icon: Celebration, color: '#FFD700', size: 38, position: { bottom: '20%', left: '7%' } },
    { Icon: Stars, color: '#FF6B6B', size: 32, position: { bottom: '15%', right: '6%' } },
    { Icon: Favorite, color: '#98FB98', size: 36, position: { top: '40%', left: '3%' } },
    { Icon: EmojiEmotions, color: '#DDA0DD', size: 30, position: { top: '35%', right: '4%' } },
    { Icon: LocalFlorist, color: '#FF69B4', size: 42, position: { bottom: '40%', left: '4%' } },
    { Icon: Flare, color: '#87CEEB', size: 34, position: { bottom: '35%', right: '5%' } },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
    }}>
      {decorations.map((dec, index) => {
        const { Icon, color, size, position } = dec;
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              ...position,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite alternate`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
            }}
          >
            <Icon 
              sx={{ 
                fontSize: size,
                color: color,
                filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))',
                opacity: 0.4,
              }} 
            />
          </div>
        );
      })}

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(10px, 10px) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
};

export default BirthdayDecorations; 