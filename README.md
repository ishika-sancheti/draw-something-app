# Draw Something App

An interactive drawing application built with React that lets users sketch freehand drawings and visualizes them using Fourier Transform animation.

## Overview

**Draw Something App** is a fun interactive web application where users can draw any shape or doodle on a canvas, and the app reconstructs that drawing using animated Fourier epicycles.

This project combines frontend development with mathematical visualization, making it both creative and educational.

## Features

- Freehand drawing canvas
- Mouse and touch support
- Real-time drawing capture
- Fourier Transform-based shape reconstruction
- Animated epicycle visualization
- Responsive interaction
- Automatic animation playback after drawing

## How It Works

1. Draw any shape on the canvas.
2. The app captures the drawn points.
3. A **Discrete Fourier Transform (DFT)** is applied to the drawing coordinates.
4. Fourier coefficients are generated and sorted by amplitude.
5. Animated circles (epicycles) reconstruct the original drawing path.

This creates a visual demonstration of how complex shapes can be represented as sums of rotating vectors.

## Tech Stack

- **React**
- **Vite**
- **JavaScript**
- **HTML5 Canvas API**
- **CSS**

## Project Structure

```text
draw-something-app/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── components/
│   │   └── Canvas.jsx
│   └── utils/
│       └── fourier.js
├── package.json
├── vite.config.js
└── index.html
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/ishika-sancheti/draw-something-app.git
```

### Navigate to the Project

```bash
cd draw-something-app
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Available Scripts

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Linting

```bash
npm run lint
```

## Usage

- Open the application in your browser
- Draw any shape using your mouse or touchscreen
- Release the mouse / lift your finger
- Watch the Fourier animation recreate your drawing

## Learning Concepts Demonstrated

This project showcases:

- Discrete Fourier Transform (DFT)
- Signal decomposition
- Mathematical visualization
- HTML Canvas drawing
- React state management
- Animation with `requestAnimationFrame`

## Future Improvements

Potential enhancements:

- Clear canvas button
- Pause / resume animation controls
- Adjustable number of epicycles
- Color customization
- Save drawings as images
- Undo functionality
- Mobile UI improvements

## Why This Project?

This project blends:

- frontend engineering
- mathematics
- interactivity
- visualization

It demonstrates both programming skills and problem-solving through creative implementation.

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

## License

MIT License

## Author

**Ishika Sancheti**

GitHub: https://github.com/ishika-sancheti
