import { Icon } from '@shared/ui/Icon/ui/Icon'
import cls from './Header.module.scss'
import UserIcon from '@shared/assets/icons/user.svg'

export const Header = () => {
  return (
    <header className={cls.Header}>
      <div className={cls.HeaderItem}>
        <div className={cls.MenuItem}>logo</div>
        <div className={cls.MenuItem}>settings</div>
      </div>
      <div className={cls.HeaderItem}>
        <div className={cls.MenuItem}>notifications</div>
        <div className={cls.MenuItem}>Login</div>
        <Icon Svg={UserIcon}/>
      </div>
    </header>
  )
}
