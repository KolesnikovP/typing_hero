import { memo } from 'react';
import cls from './KeyboardHelper.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'

type KeyboardHelperProps = {
  activeKey: string;
}

function getUniqueSymbols(symbols: string[]): string[] {
  if(symbols.length === 2 && symbols[0].toUpperCase() === symbols[1].toUpperCase()) {
    return [symbols[0].toUpperCase()]
  } 

  return symbols
}

export const KeyboardHelper = memo((props: KeyboardHelperProps) => {
  const {activeKey} = props

  return (
    <div className={cls.KeyboardContainer}>
      {rowTestAgain.map(({row, params}) => (
        <div 
          key={row}
          className={classNames(cls.row, {[cls.centeredRow]: params.length === 1})}>
          {params.map(({symbol, buttonSize}, idx) => (
            <div
              key={idx}
              className={classNames(
                cls.key, 
                {
                  [cls.activeKey]: symbol.includes(activeKey === " " ? "Space" : activeKey),

                }, [cls[buttonSize]])}
            >
              {
                getUniqueSymbols(symbol).map((sym) => (
                  <span key={sym} className={cls.symbol}>
                    {sym}
                  </span>
                ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
})

type KeyboardLayoutType = {
  row: number,
  params: {
    symbol: string[],
    position: number,
    buttonSize: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl"
  }[],
}

const rowTestAgain: KeyboardLayoutType[] = [
  {
    row: 0,
    params: [
      { symbol: ["`", "~"], position: 0, buttonSize: "sm" },
      { symbol: ["1", "!"], position: 1, buttonSize: "sm" },
      { symbol: ["2", "@"], position: 2, buttonSize: "sm" },
      { symbol: ["3", "#"], position: 3, buttonSize: "sm" },
      { symbol: ["4", "$"], position: 4, buttonSize: "sm" },
      { symbol: ["5", "%"], position: 5, buttonSize: "sm" },
      { symbol: ["6", "^"], position: 6, buttonSize: "sm" },
      { symbol: ["7", "&"], position: 7, buttonSize: "sm" },
      { symbol: ["8", "*"], position: 8, buttonSize: "sm" },
      { symbol: ["9", "("], position: 9, buttonSize: "sm" },
      { symbol: ["0", ")"], position: 10, buttonSize: "sm" },
      { symbol: ["-", "_"], position: 11, buttonSize: "sm" },
      { symbol: ["=", "+"], position: 12, buttonSize: "sm" },
      { symbol: ["Backspace"], position: 13, buttonSize: "xxl" }
    ]
  },
  {
    row: 1,
    params: [
      { symbol: ["Tab"], position: 14, buttonSize: "lg" },
      { symbol: ["q", "Q"], position: 15, buttonSize: "sm" },
      { symbol: ["w", "W"], position: 16, buttonSize: "sm" },
      { symbol: ["e", "E"], position: 17, buttonSize: "sm" },
      { symbol: ["r", "R"], position: 18, buttonSize: "sm" },
      { symbol: ["t", "T"], position: 19, buttonSize: "sm" },
      { symbol: ["y", "Y"], position: 20, buttonSize: "sm" },
      { symbol: ["u", "U"], position: 21, buttonSize: "sm" },
      { symbol: ["i", "I"], position: 22, buttonSize: "sm" },
      { symbol: ["o", "O"], position: 23, buttonSize: "sm" },
      { symbol: ["p", "P"], position: 24, buttonSize: "sm" },
      { symbol: ["[", "{"], position: 25, buttonSize: "sm" },
      { symbol: ["]", "}"], position: 26, buttonSize: "sm" },
      { symbol: ["\\", "|"], position: 27, buttonSize: "lg" }
    ]
  },
  {
    row: 2,
    params: [
      { symbol: ["CapsLock"], position: 0, buttonSize: "xl" },
      { symbol: ["a", "A"], position: 1, buttonSize: "sm" },
      { symbol: ["s", "S"], position: 2, buttonSize: "sm" },
      { symbol: ["d", "D"], position: 3, buttonSize: "sm" },
      { symbol: ["f", "F"], position: 4, buttonSize: "sm" },
      { symbol: ["g", "G"], position: 5, buttonSize: "sm" },
      { symbol: ["h", "H"], position: 6, buttonSize: "sm" },
      { symbol: ["j", "J"], position: 7, buttonSize: "sm" },
      { symbol: ["k", "K"], position: 8, buttonSize: "sm" },
      { symbol: ["l", "L"], position: 9, buttonSize: "sm" },
      { symbol: [";", ":"], position: 10, buttonSize: "sm" },
      { symbol: ["'", "\""], position: 11, buttonSize: "sm" },
      { symbol: ["Enter"], position: 12, buttonSize: "xxl" }
    ]
  },
  {
    row: 3,
    params: [
      { symbol: ["ShiftLeft"], position: 0, buttonSize: "xxl" },
      { symbol: ["z", "Z"], position: 1, buttonSize: "sm" },
      { symbol: ["x", "X"], position: 2, buttonSize: "sm" },
      { symbol: ["c", "C"], position: 3, buttonSize: "sm" },
      { symbol: ["v", "V"], position: 4, buttonSize: "sm" },
      { symbol: ["b", "B"], position: 5, buttonSize: "sm" },
      { symbol: ["n", "N"], position: 6, buttonSize: "sm" },
      { symbol: ["m", "M"], position: 7, buttonSize: "sm" },
      { symbol: [",", "<"], position: 8, buttonSize: "sm" },
      { symbol: [".", ">"], position: 9, buttonSize: "sm" },
      { symbol: ["/", "?"], position: 10, buttonSize: "sm" },
      { symbol: ["ShiftRight"], position: 11, buttonSize: "xxl" }
    ]
  },
  {
    row: 4,
    params: [
      { symbol: ["Space"], position: 3, buttonSize: "xxxl" }
      // ["Control", { position: 0, row: 4 }],
      // ["Meta", { position: 1, row: 4 }],
      // ["Alt", { position: 2, row: 4 }],
      // ["AltRight", { position: 4, row: 4 }],
      // ["MetaRight", { position: 5, row: 4 }],
      // ["ContextMenu", { position: 6, row: 4 }],
      // ["ControlRight", { position: 7, row: 4 }]
    ]
  }
];
