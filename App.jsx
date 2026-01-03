import Canvas from './components/Canvas';

function App(){
  return (
    <div>
      <h1 style={ { textAlign:'center'} }>Draw Something</h1>
      <Canvas />                        
    </div>
  );
}

export default App;

//div creates a section in your webpage
//canvas is the child component
