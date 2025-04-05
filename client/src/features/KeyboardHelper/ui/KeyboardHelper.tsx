import { memo, useMemo } from 'react';
import cls from './KeyboardHelper.module.scss'
import { classNames, Mods } from '@/shared/lib/classNames/classNames'

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

  const keyboard = useMemo(() => prepareForRenderTest(rowTest), []);
  console.log('keyboard', keyboard)
 
  return (
    <div className={cls.KeyboardContainer}>
      {keyboard.map(([row, keys]) => (
        <div key={row} className={cls.row}>
          {keys.map((symbols, idx) => (
            <div
              key={idx}
              className={classNames(cls.key, {
                [cls.activeKey]: symbols.includes(activeKey),
                [cls.size_l]: false,
              })}
            >
              {
                getUniqueSymbols(symbols).map((sym) => (
                <div key={sym} className={cls.symbol}>
                  {sym}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>

  )
})

type RowType = Map<string, {position:number, row: number}>; 

const prepareForRenderTest = (row: RowType) => {
  const grouped = new Map<number, Map<number, string[]>>();

  row.forEach((value, key) => {
    if (!grouped.has(value.row)) {
      grouped.set(value.row, new Map());
    }

    const rowMap = grouped.get(value.row)!;

    if (!rowMap.has(value.position)) {
      rowMap.set(value.position, []);
    }

    rowMap.get(value.position)!.push(key);
  });

  // Convert to a sorted array
  const result: [number, string[][]][] = [];

  grouped.forEach((positions, rowNum) => {
    const sorted = [...positions.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([_, symbols]) => symbols);
    result.push([rowNum, sorted]);
  });

  // Sort rows by row number
  return result.sort((a, b) => a[0] - b[0]);
};

const rowTest: Map<string, { position: number, row: number, buttonSize: 'sm' | 'md' | 'lg' | 'xl' }> = new Map([
  // Row 0
  ["~", { position: 0, row: 0, buttonSize: "sm" }],
  ["`", { position: 0, row: 0, buttonSize: "sm" }],
  ["!", { position: 1, row: 0, buttonSize: "sm" }],
  ["1", { position: 1, row: 0, buttonSize: "sm" }],
  ["@", { position: 2, row: 0, buttonSize: "sm" }],
  ["2", { position: 2, row: 0, buttonSize: "sm" }],
  ["#", { position: 3, row: 0, buttonSize: "sm" }],
  ["3", { position: 3, row: 0, buttonSize: "sm" }],
  ["$", { position: 4, row: 0, buttonSize: "sm" }],
  ["4", { position: 4, row: 0, buttonSize: "sm" }],
  ["%", { position: 5, row: 0, buttonSize: "sm" }],
  ["5", { position: 5, row: 0, buttonSize: "sm" }],
  ["^", { position: 6, row: 0, buttonSize: "sm" }],
  ["6", { position: 6, row: 0, buttonSize: "sm" }],
  ["&", { position: 7, row: 0, buttonSize: "sm" }],
  ["7", { position: 7, row: 0, buttonSize: "sm" }],
  ["*", { position: 8, row: 0, buttonSize: "sm" }],
  ["8", { position: 8, row: 0, buttonSize: "sm" }],
  ["(", { position: 9, row: 0, buttonSize: "sm" }],
  ["9", { position: 9, row: 0, buttonSize: "sm" }],
  [")", { position: 10, row: 0, buttonSize: "sm" }],
  ["0", { position: 10, row: 0, buttonSize: "sm" }],
  ["_", { position: 11, row: 0, buttonSize: "sm" }],
  ["-", { position: 11, row: 0, buttonSize: "sm" }],
  ["+", { position: 12, row: 0, buttonSize: "sm" }],
  ["=", { position: 12, row: 0, buttonSize: "sm" }],
  ["Backspace", { position: 13, row: 0, buttonSize: "lg" }],

  // Row 1
  ["Tab", { position: 14, row: 1, buttonSize: "md" }],
  ["q", { position: 15, row: 1, buttonSize: "sm" }],
  ["Q", { position: 15, row: 1, buttonSize: "sm" }],
  ["w", { position: 16, row: 1, buttonSize: "sm" }],
  ["W", { position: 16, row: 1, buttonSize: "sm" }],
  ["e", { position: 17, row: 1, buttonSize: "sm" }],
  ["E", { position: 17, row: 1, buttonSize: "sm" }],
  ["r", { position: 18, row: 1, buttonSize: "sm" }],
  ["R", { position: 18, row: 1, buttonSize: "sm" }],
  ["t", { position: 19, row: 1, buttonSize: "sm" }],
  ["T", { position: 19, row: 1, buttonSize: "sm" }],
  ["y", { position: 20, row: 1, buttonSize: "sm" }],
  ["Y", { position: 20, row: 1, buttonSize: "sm" }],
  ["u", { position: 21, row: 1, buttonSize: "sm" }],
  ["U", { position: 21, row: 1, buttonSize: "sm" }],
  ["i", { position: 22, row: 1, buttonSize: "sm" }],
  ["I", { position: 22, row: 1, buttonSize: "sm" }],
  ["o", { position: 23, row: 1, buttonSize: "sm" }],
  ["O", { position: 23, row: 1, buttonSize: "sm" }],
  ["p", { position: 24, row: 1, buttonSize: "sm" }],
  ["P", { position: 24, row: 1, buttonSize: "sm" }],
  ["[", { position: 25, row: 1, buttonSize: "sm" }],
  ["{", { position: 25, row: 1, buttonSize: "sm" }],
  ["]", { position: 26, row: 1, buttonSize: "sm" }],
  ["}", { position: 26, row: 1, buttonSize: "sm" }],
  ["\\", { position: 27, row: 1, buttonSize: "md" }],
  ["|", { position: 27, row: 1, buttonSize: "md" }],

  // Row 2
  ["CapsLock", { position: 0, row: 2, buttonSize: "lg" }],
  ["a", { position: 1, row: 2, buttonSize: "sm" }],
  ["A", { position: 1, row: 2, buttonSize: "sm" }],
  ["s", { position: 2, row: 2, buttonSize: "sm" }],
  ["S", { position: 2, row: 2, buttonSize: "sm" }],
  ["d", { position: 3, row: 2, buttonSize: "sm" }],
  ["D", { position: 3, row: 2, buttonSize: "sm" }],
  ["f", { position: 4, row: 2, buttonSize: "sm" }],
  ["F", { position: 4, row: 2, buttonSize: "sm" }],
  ["g", { position: 5, row: 2, buttonSize: "sm" }],
  ["G", { position: 5, row: 2, buttonSize: "sm" }],
  ["h", { position: 6, row: 2, buttonSize: "sm" }],
  ["H", { position: 6, row: 2, buttonSize: "sm" }],
  ["j", { position: 7, row: 2, buttonSize: "sm" }],
  ["J", { position: 7, row: 2, buttonSize: "sm" }],
  ["k", { position: 8, row: 2, buttonSize: "sm" }],
  ["K", { position: 8, row: 2, buttonSize: "sm" }],
  ["l", { position: 9, row: 2, buttonSize: "sm" }],
  ["L", { position: 9, row: 2, buttonSize: "sm" }],
  [";", { position: 10, row: 2, buttonSize: "sm" }],
  [":", { position: 10, row: 2, buttonSize: "sm" }],
  ["'", { position: 11, row: 2, buttonSize: "sm" }],
  ["\"", { position: 11, row: 2, buttonSize: "sm" }],
  ["Enter", { position: 12, row: 2, buttonSize: "lg" }],

  // Row 3
  ["ShiftLeft", { position: 0, row: 3, buttonSize: "lg" }],
  ["z", { position: 1, row: 3, buttonSize: "sm" }],
  ["Z", { position: 1, row: 3, buttonSize: "sm" }],
  ["x", { position: 2, row: 3, buttonSize: "sm" }],
  ["X", { position: 2, row: 3, buttonSize: "sm" }],
  ["c", { position: 3, row: 3, buttonSize: "sm" }],
  ["C", { position: 3, row: 3, buttonSize: "sm" }],
  ["v", { position: 4, row: 3, buttonSize: "sm" }],
  ["V", { position: 4, row: 3, buttonSize: "sm" }],
  ["b", { position: 5, row: 3, buttonSize: "sm" }],
  ["B", { position: 5, row: 3, buttonSize: "sm" }],
  ["n", { position: 6, row: 3, buttonSize: "sm" }],
  ["N", { position: 6, row: 3, buttonSize: "sm" }],
  ["m", { position: 7, row: 3, buttonSize: "sm" }],
  ["M", { position: 7, row: 3, buttonSize: "sm" }],
  [",", { position: 8, row: 3, buttonSize: "sm" }],
  ["<", { position: 8, row: 3, buttonSize: "sm" }],
  [".", { position: 9, row: 3, buttonSize: "sm" }],
  [">", { position: 9, row: 3, buttonSize: "sm" }],
  ["/", { position: 10, row: 3, buttonSize: "sm" }],
  ["?", { position: 10, row: 3, buttonSize: "sm" }],
  ["ShiftRight", { position: 11, row: 3, buttonSize: "lg" }],

  // Row 4
  ["Space", { position: 3, row: 4, buttonSize: "xl" }]
  // ["Control", { position: 0, row: 4 }],
  // ["Meta", { position: 1, row: 4 }],
  // ["Alt", { position: 2, row: 4 }],
  // ["AltRight", { position: 4, row: 4 }],
  // ["MetaRight", { position: 5, row: 4 }],
  // ["ContextMenu", { position: 6, row: 4 }],
  // ["ControlRight", { position: 7, row: 4 }]
]);

const row1 = new Map([
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

const row2 = new Map([
  ["Tab", 0],
  ["q", 1],
  ["Q", 1],
  ["w", 2],
  ["W", 2],
  ["e", 3],
  ["E", 3],
  ["r", 4],
  ["R", 4],
  ["t", 5],
  ["T", 5],
  ["y", 6],
  ["Y", 6],
  ["u", 7],
  ["U", 7],
  ["i", 8],
  ["I", 8],
  ["o", 9],
  ["O", 9],
  ["p", 10],
  ["P", 10],
  ["[", 11],
  ["{", 11],
  ["]", 12],
  ["}", 12],
  ["\\", 13],
  ["|", 13]
])



