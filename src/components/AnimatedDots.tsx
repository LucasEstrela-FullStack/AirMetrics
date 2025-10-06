import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

interface AnimatedDotsProps {
  color?: string;
  size?: number;
}

const AnimatedDots: React.FC<AnimatedDotsProps> = ({
  color = 'white',
  size = 8
}) => {
  const [dot1Opacity, setDot1Opacity] = useState(1);
  const [dot2Opacity, setDot2Opacity] = useState(1);
  const [dot3Opacity, setDot3Opacity] = useState(1);

  useEffect(() => {
    const animateDot1 = setInterval(() => {
      setDot1Opacity(prev => prev === 1 ? 0.3 : 1);
    }, 600);

    const animateDot2 = setInterval(() => {
      setDot2Opacity(prev => prev === 1 ? 0.3 : 1);
    }, 600);

    const animateDot3 = setInterval(() => {
      setDot3Opacity(prev => prev === 1 ? 0.3 : 1);
    }, 600);

    // Delay para criar efeito cascata
    setTimeout(() => {
      clearInterval(animateDot2);
      const animateDot2Delayed = setInterval(() => {
        setDot2Opacity(prev => prev === 1 ? 0.3 : 1);
      }, 600);
      
      setTimeout(() => {
        clearInterval(animateDot2Delayed);
        clearInterval(animateDot3);
        const animateDot3Delayed = setInterval(() => {
          setDot3Opacity(prev => prev === 1 ? 0.3 : 1);
        }, 600);
      }, 200);
    }, 200);

    return () => {
      clearInterval(animateDot1);
      clearInterval(animateDot2);
      clearInterval(animateDot3);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.dot, 
          { 
            backgroundColor: color, 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            opacity: dot1Opacity 
          }
        ]} 
      />
      <View 
        style={[
          styles.dot, 
          { 
            backgroundColor: color, 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            opacity: dot2Opacity 
          }
        ]} 
      />
      <View 
        style={[
          styles.dot, 
          { 
            backgroundColor: color, 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            opacity: dot3Opacity 
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    marginHorizontal: 4,
  },
});

export default AnimatedDots;
