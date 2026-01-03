import React, { useRef, useEffect, useState } from 'react';
import { dft } from '../utils/fourier';
import '../App.css';

function Canvas(){                                 //react fx component called canvas
    const canvasRef=useRef(null);                  //creates a ref object with inital value null
    const [points, setPoints] = useState([]);      //to track coordinates of the line being drawn 

    useEffect( () => {                             //runs after component is rendered to make sure there is something (/canvas) existing before user tries to draw on it
                                                   //this code block is defining a function that should run afte render - 'side effect'
        const canvas = canvasRef.current;          //get the actual canvas element from the ref
        const ctx = canvas.getContext('2d');       //get the 2d rendering context - an API used for drawing
                                                   //like getting 2d drawing tools for the drawing
                                                   //ctx then is an object that contains those tools that lets user draw
                                                   //all canvas drw commands go thru ctx
        ctx.fillStyle = 'white';                   //choose the bg colour 
        ctx.fillRect(0, 0, canvas.width, canvas.height);   //fills the whole canvas with white colour/makes white as the background
        ctx.lineWidth=2;                            //specs of your paintbrush
        ctx.strokeStyle='black';
        
        let drawing = false;                        //to know when the mouse is drawing 
                                                    //event handlers - ASSEMBLE!
        const start = (e) => {
            drawing = true;                                     //and we begin drawing
            setPoints([]);                                      //1st update of points - reset points to zero/empty array to start a new drawing
            ctx.beginPath();                                    //and we start a new shape - imp to do this as you want to start a new shape, not start off from the prev drw
            ctx.moveTo(e.offsetX, e.offsetY);                   //move pen to the posn of the mouse 
            setPoints([{ x:e.offsetX, y:e.offsetY }]);        //add 1st set of points - the starting point
        };

        const draw = (e) =>{
            if (!drawing) return;                                                   //get out of here if you're not drawing
            ctx.lineTo(e.offsetX, e.offsetY);                                       //draw a line from current posn to new mouse posn
            ctx.stroke();                                                          //draw that line on canvas - w/o this the drw will not be seen on the screen
            setPoints((prev) => [ ...prev, {x:e.offsetX, y:offsetY}]);
        };
        const stop = () =>{
            drawing=false;                          //stop the drw when the mouse is released or not on canvas anymore
            console.log(points);
        }
        
        //use the following event listeners to get notified when one of these things happen - not exactly tracking mouse movt
        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stop);
        canvas.addEventListener('mouseleave', stop);
        
        return ( ) => {                                            //when you leave the canvas/page, clean ur brushes and then leave
            canvas.removeEventListener('mousedown', start);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stop);
            canvas.removeEventListener('mouseleave', stop);
        };

    }, [points]);

    // [] - dependency array - tells react when to re-run useEffect

    return (                        //jsx returned by the component 
        <canvas                     //creates a HTMl canvas element
            ref={canvasRef}         //attaches to the ref so react can give access to the actual canvas element
            width={600}
            height={400}
            style={{ border:'1px solid #aaa', display: 'block', margin:'2rem auto' }}
        />
    );
}

export default Canvas;               //exports the component so it can be imported and used elsewhere, eg: app.jsx


//canvas is a blank sheet of paper, 
//getCOntext is like asking for the paintbrush set and ctx is getting a specific brush, details of which can be found in fillStyle that lets user draw
//fillStyle, strokeStyle etc are like choosing the pen colour
//fillRect is actually doing some painting on the paper, like filling teh background

//mousedown, mousemove etc are predefined event types