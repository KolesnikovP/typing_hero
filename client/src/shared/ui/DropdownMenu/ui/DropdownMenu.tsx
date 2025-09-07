import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ReactNode } from 'react'
import { classNames } from '../../../lib/classNames/classNames'
import cls from './DropdownMenu.module.scss'

/**
 * Reusable DropdownMenu component
 * 
 * @example
 * const menuItems = [
 *   { id: 'profile', label: 'Profile', href: '/profile' },
 *   { id: 'settings', label: 'Settings', onClick: () => console.log('Settings') },
 *   'separator',
 *   { id: 'logout', label: 'Logout', onClick: handleLogout, destructive: true }
 * ]
 * 
 * <DropdownMenu
 *   buttonContent="My Account"
 *   items={menuItems}
 *   align="right"
 *   direction="bottom"
 * />
 */

export interface DropdownMenuItem {
  id: string
  label: string
  onClick?: () => void
  href?: string
  icon?: ReactNode
  destructive?: boolean
  disabled?: boolean
}

export interface DropdownMenuProps {
  buttonContent: ReactNode
  items: (DropdownMenuItem | 'separator')[]
  className?: string
  buttonClassName?: string
  align?: 'left' | 'right' | 'center'
  direction?: 'bottom' | 'top'
}

export const DropdownMenu = ({
  buttonContent,
  items,
  className,
  buttonClassName,
  align = 'left',
  direction = 'bottom',
}: DropdownMenuProps) => {
  const renderMenuItem = (item: DropdownMenuItem | 'separator', index: number) => {
    if (item === 'separator') {
      return <div key={`separator-${index}`} className={cls.separator} />
    }

    const itemClassName = classNames(cls.menuItem, {
      [cls.destructive]: item.destructive,
    })

    if (item.href) {
      return (
        <MenuItem key={item.id} disabled={item.disabled}>
          <a
            href={item.href}
            className={itemClassName}
            onClick={item.onClick}
          >
            {item.icon && <span className={cls.icon}>{item.icon}</span>}
            {item.label}
          </a>
        </MenuItem>
      )
    }

    return (
      <MenuItem key={item.id} disabled={item.disabled}>
        <button
          type="button"
          className={itemClassName}
          onClick={item.onClick}
        >
          {item.icon && <span className={cls.icon}>{item.icon}</span>}
          {item.label}
        </button>
      </MenuItem>
    )
  }

  return (
    <Menu as="div" className={classNames(cls.menu, {}, [className])}>
      <MenuButton className={classNames(cls.menuButton, {}, [buttonClassName])}>
        {buttonContent}
      </MenuButton>
      <MenuItems
        anchor={`${direction} ${align}` as any}
        className={cls.menuItems}
      >
        {items.map(renderMenuItem)}
      </MenuItems>
    </Menu>
  )
}
