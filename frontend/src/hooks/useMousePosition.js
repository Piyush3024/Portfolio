import { useState, useEffect } from 'react';

/**
 * A custom hook that tracks mouse position relative to a reference element
 * @param {React.RefObject} ref - Reference to the element to track mouse position against
 * @returns {Object} - The x and y coordinates of the mouse position
 */
const useMousePosition = (ref) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (ref && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref]);

  return mousePosition;
};

export default useMousePosition;