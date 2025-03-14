// import './App.scss'
import { TypingPage } from '@/pages/TypingPage'
import { Header } from '@widgets/Header'

function App() {

  return (
    <div className='app'>
     <Header/> 
      <h1>Vite + React</h1>
      <div className="" style={{display: 'flex', flexDirection: 'column', alignItems: 'center' ,justifyContent: 'center'}}>
        <div>While routes not written</div>
        <TypingPage/>
      </div>
    </div>
  )
}

export default App
