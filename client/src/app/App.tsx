// import './App.scss'
import { TypingWindow } from '@/features/TypingWindow'
import { Header } from '@widgets/Header'

function App() {

  return (
    <div className='app'>
     <Header/> 
      <h1>Vite + React</h1>
      <div className="card">
        While routers not exist:

        <TypingWindow/>
      </div>
    </div>
  )
}

export default App
