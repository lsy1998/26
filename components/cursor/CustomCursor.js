export const CustomCursor = ({ position, radius }) => {
  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: radius * 2,
        height: radius * 2,
        border: '2px solid #666',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}; 