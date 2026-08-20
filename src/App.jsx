import { useRef, useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import './App.css';
//nudging the canvas alignment.
const FRAME = { x: 0.2604, y: 0.2461, w: 0.4733, h: 0.4502 };

function App() {
  const imgRef = useRef(null);
  const wrapRef = useRef(null);
  const [frameRect, setFrameRect] = useState(null);

  const recalc = () => {
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!img || !wrap || !img.naturalWidth) return;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const containerW = wrap.clientWidth;
    const containerH = wrap.clientHeight;

    const scale = Math.max(containerW / naturalW, containerH / naturalH);
    const renderedW = naturalW * scale;
    const renderedH = naturalH * scale;
    const offsetX = (renderedW - containerW) / 2;
    const offsetY = (renderedH - containerH) / 2;

    const toContainerFraction = (fx, fy) => ({
      x: (fx * renderedW - offsetX) / containerW,
      y: (fy * renderedH - offsetY) / containerH
    });

    const topLeft = toContainerFraction(FRAME.x, FRAME.y);
    const bottomRight = toContainerFraction(FRAME.x + FRAME.w, FRAME.y + FRAME.h);

    setFrameRect({
      left: topLeft.x * 100,
      top: topLeft.y * 100,
      width: (bottomRight.x - topLeft.x) * 100,
      height: (bottomRight.y - topLeft.y) * 100
    });
  };

  useEffect(() => {
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, []);

  return (
    <div className="app">
      <div className="gallery-wrap" ref={wrapRef}>
        <img
          ref={imgRef}
          src="/gallery-wall.png"
          alt=""
          className="gallery-photo"
          onLoad={recalc}
        />
        <Canvas frameRect={frameRect} />
      </div>
    </div>
  );
}

export default App;
//canvas is the child component
