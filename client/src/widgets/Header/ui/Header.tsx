import cls from './Header.module.scss' 
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
      </div>
    </header>
  )
}
