import Canvas from './components/Canvas';
import './App.css';

function App(){
  return (
    <div className='app'>
      {/* <h1 style={ { textAlign:'center'} }>Draw Something</h1> */}
      <Canvas />                        
    </div>
  );
}

export default App;

//canvas is the child component
