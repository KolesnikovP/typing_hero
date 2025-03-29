// import './App.scss'
import { TypingPage } from '@/pages/TypingPage'
import { Header } from '@widgets/Header'
import { Suspense } from 'react'

function App() {

  return (
    <div className='app'>
      <Header/> 
      <Suspense>
        <div 
          className="content-page" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
        <TypingPage/>
      </div>

      </Suspense>

    </div>
  )
}

export default App
