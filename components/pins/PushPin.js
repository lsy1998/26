import { Circle, Line } from 'react-konva';

export const PushPin = ({ color = '#FF4444' }) => {
  return (
    <>
      {/* 图钉头部 */}
      <Circle
        radius={10}
        fill={color}
        shadowColor="black"
        shadowBlur={2}
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={0.3}
      />
      {/* 图钉针部 */}
      <Line
        points={[0, 0, 0, 30]}
        stroke={color}
        strokeWidth={3}
        lineCap="round"
        shadowColor="black"
        shadowBlur={2}
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={0.3}
      />
    </>
  );
}; 