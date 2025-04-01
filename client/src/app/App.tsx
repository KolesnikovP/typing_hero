// import './App.scss'
import { Header } from '@widgets/Header'
import { Suspense, useEffect } from 'react'
import { AppRouter } from './providers/router'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { getUserInited, userActions } from '@/entities/User';

function App() {
  const dispatch = useAppDispatch();
  const inited = useSelector(getUserInited);

  useEffect(() => {
    dispatch(userActions.initAuthData());
  }, [dispatch]);


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
          {inited && <AppRouter/>}
        </div>

      </Suspense>

    </div>
  )
}

export default App
