import React, { useRef, useEffect, useState } from 'react';
import { dft } from '../utils/fourier';
import '../App.css'; 
export default function Canvas({ frameRect }) {
    const canvasRef = useRef(null);
    const pointsRef = useRef([]);
    const fourierRef = useRef(null);
    const animRef = useRef(null);
    const timeRef = useRef(0);
    const pathRef = useRef([]);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showFirstOnly, setShowFirstOnly] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    // Drawing setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = 700;
        canvas.height = 444;
        
        const clear = () => {
            ctx.fillStyle = '#f4e6d3';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        clear();
        
        let drawing = false;
        
        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left) * (canvas.width / rect.width),
                y: (e.clientY - rect.top) * (canvas.height / rect.height)
            };
        };

        const start = (e) => {
            drawing = true;
            setIsDrawing(true);
            setHasDrawn(true);
            pointsRef.current = [];
            pathRef.current = [];
            timeRef.current = 0;
            setIsAnimating(false);
            clear();
            ctx.beginPath();
            const p = getPos(e);
            ctx.moveTo(p.x, p.y);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            pointsRef.current.push(p);
        };

        const draw = (e) => {
            if (!drawing) return;
            const p = getPos(e);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            pointsRef.current.push(p);
        };

        const stop = () => {
            if (!drawing) return;
            drawing = false;
            setIsDrawing(false);

            if (pointsRef.current.length > 10) {
                const signal = pointsRef.current.map(p => ({
                    re: p.x,
                    im: p.y
                }));
                
                const result = dft(signal);
                fourierRef.current = {
                    coefficients: result.coefficients.sort((a, b) => b.amp - a.amp),
                    centroid: result.centroid
                };
                
                console.log('Fourier coefficients:', fourierRef.current.coefficients.length);
                console.log('Centroid:', fourierRef.current.centroid);
                
                // start animation automatically
                setIsAnimating(true);
            }
        };
        
        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stop);
        canvas.addEventListener('mouseleave', stop);
        
        const onTouchStart = (ev) => {
            ev.preventDefault();
            if (ev.touches && ev.touches[0]) {
                const touch = ev.touches[0];
                start({ clientX: touch.clientX, clientY: touch.clientY });
            }
        };

        const onTouchMove = (ev) => {
            ev.preventDefault();
            if (ev.touches && ev.touches[0]) {
                const touch = ev.touches[0];
                draw({ clientX: touch.clientX, clientY: touch.clientY });
            }
        };

        const onTouchEnd = (ev) => {
            ev.preventDefault();
            stop();
        };
        
        canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        canvas.addEventListener('touchend', onTouchEnd, { passive: false });

        return () => {
            canvas.removeEventListener('mousedown', start);
            canvas.removeEventListener('mousemove', draw);
            window.removeEventListener('mouseup', stop);
            canvas.removeEventListener('mouseleave', stop);
            canvas.removeEventListener('touchstart', onTouchStart);
            canvas.removeEventListener('touchmove', onTouchMove);
            canvas.removeEventListener('touchend', onTouchEnd);
            if (animRef.current) {
                cancelAnimationFrame(animRef.current);
            }
        };
    }, []);

    // Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');

        if (!isAnimating) {
            if (animRef.current) {
                cancelAnimationFrame(animRef.current);
                animRef.current = null;
            }
            return;
        }

        const drawCircle = (x, y, r) => {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        const drawLine = (x1, y1, x2, y2, color = 'black') => {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        const animate = () => {
            const fourierData = fourierRef.current;
            if (!fourierData || !fourierData.coefficients || fourierData.coefficients.length === 0) {
                return;
            }

            const N = fourierData.coefficients.length;
            const X = fourierData.coefficients;
            const useCount = showFirstOnly ? 1 : Math.min(100, X.length);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#f4e6d3';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw original shape faintly
            if (pointsRef.current.length > 0) {
                ctx.beginPath();
                ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);
                for (let i = 1; i < pointsRef.current.length; i++) {
                    ctx.lineTo(pointsRef.current[i].x, pointsRef.current[i].y);
                }
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            let vx = fourierData.centroid.x;
            let vy = fourierData.centroid.y;
            const t = timeRef.current;

            // Draw epicycles
            for (let i = 0; i < useCount; i++) {
                const comp = X[i];
                const freq = comp.freq;
                const amp = comp.amp;
                const phase = comp.phase;
                const angle = (2 * Math.PI * freq * t / N) + phase;
                const dx = amp * Math.cos(angle);
                const dy = amp * Math.sin(angle);

                drawCircle(vx, vy, amp);
                drawLine(vx, vy, vx + dx, vy + dy, 'rgba(100, 100, 255, 0.8)');

                vx = vx + dx;
                vy = vy + dy;
            }

            // Store path point
            pathRef.current.unshift({ x: vx, y: vy });
            if (pathRef.current.length > N * 2) pathRef.current.pop();

            // Draw traced path
            if (pathRef.current.length > 1) {
                ctx.beginPath();
                ctx.moveTo(pathRef.current[0].x, pathRef.current[0].y);
                for (let i = 1; i < pathRef.current.length; i++) {
                    ctx.lineTo(pathRef.current[i].x, pathRef.current[i].y);
                }
                ctx.strokeStyle = '#FF0000';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            timeRef.current += 1;

            if (timeRef.current >= N) {
                timeRef.current = 0;
                pathRef.current = [];
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animRef.current) {
                cancelAnimationFrame(animRef.current);
            }
        };
    }, [isAnimating, showFirstOnly]);

    const handleClear = () => {
        pointsRef.current = [];
        fourierRef.current = null;
        timeRef.current = 0;
        pathRef.current = [];
        setIsAnimating(false);
        setHasDrawn(false);
        
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#f4e6d3';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div className="canvas-page">
            <div className="toolbar"
            style={frameRect ? {
                left: `${frameRect.left + frameRect.width / 2}%`,
                top: `${frameRect.top + frameRect.height + 1.5}%`
                } : { visibility: 'hidden' }}
            >
                <button
                    onClick={handleClear}
                    className="btn btn-clear"
                >
                    Clear
                </button>
                <button
                    onClick={() => setIsAnimating(v => !v)}
                    className="btn btn-playpause"
                    disabled={!fourierRef.current}
                >
                    {isAnimating ? 'Pause' : 'Play'}
                </button>
                <label className="toolbar-checkbox">
                    <input
                        type="checkbox"
                        checked={showFirstOnly}
                        onChange={(e) => setShowFirstOnly(e.target.checked)}
                    />
                    {' '}Show only first circle
                </label>
            </div>

            <div
                className="canvas-slot"
                style={frameRect ? {
                    left: `${frameRect.left}%`,
                    top: `${frameRect.top}%`,
                    width: `${frameRect.width}%`,
                    height: `${frameRect.height}%`
                } : { visibility: 'hidden' }}
            >
                <canvas
                    ref={canvasRef}
                    className="drawing-canvas"
                    style={{ touchAction: 'none' }}
                />
                {!hasDrawn && (
                    <p className='canvas-placeholder'>
                        Draw a shape in a single stroke, without lifting your mouse or finger.
                    </p>
                )
                }
            </div>
        </div>
    );
}