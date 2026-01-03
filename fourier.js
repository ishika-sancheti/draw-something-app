import React, { useRef, useEffect, useState } from 'react';

// DFT implementation
export function dft(signal) {
    const N = signal.length;
    const coefficients = [];
    
    // Calculate centroid
    let sumX = 0, sumY = 0;
    for (let i = 0; i < N; i++) {
        sumX += signal[i].re;
        sumY += signal[i].im;
    }
    const centroid = { x: sumX / N, y: sumY / N };
    
    // Center the signal around centroid
    const centered = signal.map(p => ({
        re: p.re - centroid.x,
        im: p.im - centroid.y
    }));
    
    // Compute DFT coefficients
    for (let k = 0; k < N; k++) {
        let re = 0;
        let im = 0;
        for (let n = 0; n < N; n++) {
            const angle = (2 * Math.PI * k * n) / N;
            re += centered[n].re * Math.cos(angle) + centered[n].im * Math.sin(angle);
            im += -centered[n].re * Math.sin(angle) + centered[n].im * Math.cos(angle);
        }
        re = re / N;
        im = im / N;
        
        const freq = k;
        const amp = Math.sqrt(re * re + im * im);
        const phase = Math.atan2(im, re);
        
        coefficients.push({ freq, amp, phase, re, im });
    }
    
    return { coefficients, centroid };
}