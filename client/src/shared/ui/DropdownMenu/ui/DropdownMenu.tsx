import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
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
      return <DropdownMenuPrimitive.Separator key={`separator-${index}`} className={cls.separator} />
    }

    const itemClassName = classNames(cls.menuItem, {
      [cls.destructive]: item.destructive,
      [cls.disabled]: item.disabled,
    })

    if (item.href) {
      return (
        <DropdownMenuPrimitive.Item key={item.id} disabled={item.disabled} asChild>
          <a
            href={item.href}
            className={itemClassName}
            onClick={item.onClick}
          >
            {item.icon && <span className={cls.icon}>{item.icon}</span>}
            {item.label}
          </a>
        </DropdownMenuPrimitive.Item>
      )
    }

    return (
      <DropdownMenuPrimitive.Item key={item.id} disabled={item.disabled} asChild>
        <button
          type="button"
          className={itemClassName}
          onClick={item.onClick}
        >
          {item.icon && <span className={cls.icon}>{item.icon}</span>}
          {item.label}
        </button>
      </DropdownMenuPrimitive.Item>
    )
  }

  // Convert align and direction to Radix side and align props
  const side = direction === 'bottom' ? 'bottom' : 'top'
  const alignValue = align === 'left' ? 'start' : align === 'right' ? 'end' : 'center'

  return (
    <div className={classNames(cls.menu, {}, [className])}>
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button className={classNames(cls.menuButton, {}, [buttonClassName])}>
            {buttonContent}
          </button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Content
          className={cls.menuItems}
          sideOffset={4}
          side={side}
          align={alignValue}
          avoidCollisions={false}
        >
          {items.map(renderMenuItem)}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Root>
    </div>
  )
}
