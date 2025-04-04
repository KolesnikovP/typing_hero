import cls from './KeyboardHelper.module.scss'
import { classNames, Mods } from '@/shared/lib/classNames/classNames'

type KeyboardHelperProps = {
  activeKey: string;
}
export const KeyboardHelper = (props: KeyboardHelperProps) => {
  const {activeKey = "~"} = props

  const keyboard = prepareForRender();
  return (
    <div className={cls.KeyboardContainer}>KeyboardHelper =

    {[...keyboard].map(([group, keys]) => (
        <div
          key={group} 
          className={classNames(cls.key, {[cls.activeKey]: group === classicKeyboard.get(activeKey)})}
>
          {keys.map((key) => (
            <span
              key={key}
              className={cls.symbol}
            >
              {key}
            </span>
          ))}
        </div>
      ))}
    </div>

  )
}

const prepareForRender = () => {
  const grouped = new Map();

  classicKeyboard.forEach((value, key) => {
    if (!grouped.has(value)) {
      grouped.set(value, []);
    }
    grouped.get(value).push(key);
  });

  return grouped
}

const classicKeyboard = new Map([
  ["`", 0],
  ["~", 0],
  ["1", 1],
  ["!", 1],
  ["2", 2],
  ["@", 2],
  ["3", 3],
  ["#", 3],
  ["4", 4],
  ["$", 4],
  ["5", 5],
  ["%", 5],
  ["6", 6],
  ["^", 6],
  ["7", 7],
  ["&", 7],
  ["8", 8],
  ["*", 8],
  ["9", 9],
  ["(", 9],
  [")", 10],
  ["0", 10],
  ["-", 11],
  ["_", 11],
  ["=", 12],
  ["+", 12],
  ["Backspace", 13]
])
