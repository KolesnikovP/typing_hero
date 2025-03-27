// import './App.scss'
import { TypingPage } from '@/pages/TypingPage'
import { Header } from '@widgets/Header'

function App() {

  return (
    <div className='app'>
      <Header/> 
      <div className="" style={{display: 'flex', flexDirection: 'column', alignItems: 'center' ,justifyContent: 'center'}}>
        <TypingPage/>
      </div>
    </div>
  )
}

export default App
