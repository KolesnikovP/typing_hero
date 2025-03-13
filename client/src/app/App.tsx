// import './App.scss'
import { TypingWindow } from '@/features/TypingWindow'
import { Header } from '@widgets/Header'

function App() {

  return (
    <div className='app'>
     <Header/> 
      <h1>Vite + React</h1>
      <div className="" style={{display: 'flex', flexDirection: 'column', alignItems: 'center' ,justifyContent: 'center'}}>
        <div>While routes not written</div>
        <TypingWindow/>
      </div>
    </div>
  )
}

export default App
