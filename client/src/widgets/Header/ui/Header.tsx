import { Icon } from '@shared/ui/Icon/ui/Icon'
import cls from './Header.module.scss'
import UserIcon from '@shared/assets/icons/user.svg'
import BellIcon from '@shared/assets/icons/bell.svg'
import { useCallback, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { DropdownMenu } from '@/shared/ui/DropdownMenu'
import { LoginModal } from '@/features/AuthByUsername'
import { useSelector } from 'react-redux'
import { getUserAuthData, userActions } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { ThemeToggle } from '@/features/ThemeToggle';

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
            <Icon Svg={BellIcon} width={24} height={24} />
          </Button>
          <ThemeToggle className={cls.MenuItem} />
          <LoginModal isOpen={isAuthModalOpen} onClose={onAuthCloseModal}/>
          <DropdownMenu
            buttonContent={<Icon Svg={UserIcon} width={26} height={26} />}
            items={[
              { id: 'home', label: 'Home', href: '/' },
              { id: 'profile', label: 'Profile', href: '/profile' },
              { id: 'settings', label: 'Settings', onClick: () => console.log('Settings') },
              'separator',
              { id: 'logout', label: 'Logout', onClick: onLogout, destructive: true }
            ]}
            align="right"
            direction="bottom"
          />
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
            <Icon Svg={BellIcon} width={30} height={30} />
          </Button>
          <ThemeToggle className={cls.MenuItem} />
          <LoginModal isOpen={isAuthModalOpen} onClose={onAuthCloseModal}/>
          <Button theme='clear' onClick={onAuthShowModal}>
            <Icon Svg={UserIcon} width={30} height={30} />
          </Button>
        </div>
      </header>
  )
}
