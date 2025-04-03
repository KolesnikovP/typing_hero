import { Icon } from '@shared/ui/Icon/ui/Icon'
import cls from './Header.module.scss'
import UserIcon from '@shared/assets/icons/user.svg'
import BellIcon from '@shared/assets/icons/bell.svg'
import { useCallback, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { LoginModal } from '@/features/AuthByUsername'
import { useSelector } from 'react-redux'
import { getUserAuthData, userActions } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'

export const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const authData = useSelector(getUserAuthData);
  const dispatch = useAppDispatch()

  const onAuthShowModal = () => {
    setIsAuthModalOpen(true)
  }

  const onAuthCloseModal = () => {
    setIsAuthModalOpen(false)
  }

      const onLogout = useCallback(() => {
        dispatch(userActions.logout());
    }, [dispatch]);


  if(authData) {
    return (
      <header className={cls.Header}>
        <div className={cls.HeaderItem}>
          <div className={cls.MenuItem}>logo</div>
          <div className={cls.MenuItem}>settings</div>
        </div>
        <div className={cls.HeaderItem}>
          <Button theme='clear' className={cls.MenuItem}>
            <Icon Svg={BellIcon}/>
          </Button>
          <LoginModal isOpen={isAuthModalOpen} onClose={onAuthCloseModal}/>
          <Button theme='clear' onClick={onLogout}>
            LOGOUT
          </Button>
        </div>
      </header>
    )
  }
  
  return (
      <header className={cls.Header}>
        <div className={cls.HeaderItem}>

          <div className={cls.MenuItem}>logo</div>
          <div className={cls.MenuItem}>settings</div>
        </div>
        <div className={cls.HeaderItem}>
          <Button theme='clear' className={cls.MenuItem}>
            <Icon Svg={BellIcon}/>
          </Button>
          <LoginModal isOpen={isAuthModalOpen} onClose={onAuthCloseModal}/>
          <Button theme='clear' onClick={onAuthShowModal}>
            <Icon Svg={UserIcon}/>
          </Button>
        </div>
      </header>
  )
}
