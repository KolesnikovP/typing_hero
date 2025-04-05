import cls from './KeyboardHelper.module.scss'
import { classNames, Mods } from '@/shared/lib/classNames/classNames'


// className={classNames(cls.key, {[cls.activeKey]: group === classicKeyboard.get(activeKey)})}
type KeyboardHelperProps = {
  activeKey: string;
}
export const KeyboardHelper = (props: KeyboardHelperProps) => {
  const {activeKey = "~"} = props

  const keyboard = prepareForRender(rowTest);
  console.log(">>>", prepareForRender(rowTest))

  return (
    <div className={cls.KeyboardContainer}>
    {[...keyboard].map(([group, keys]) => (
        <div
          key={group} 
          className={classNames(cls.key)}
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

type RowType = Map<string, {position:number, row: number}>; 
const prepareForRender = (row: RowType) => {
  const grouped = new Map<number, string[]>();
  const groupedTest = new Map();

  row.forEach((value, key) => {
    if (!grouped.has(value.position)) {
      grouped.set(value.position, []);
    }
    if(!groupedTest.has(value.position))  {
      groupedTest.set(value.position, [])
    }

    
    console.log(key, '<<<key')
    groupedTest.get(value.position)!.push(key);
    grouped.get(value.position)!.push(key);
  });
  console.log('groupedTest>>>>>>>>>>', groupedTest)

  return grouped;
};


const rowTest: Map<string, {position:number, row: number}> = new Map([
  ["`", {position: 0, row: 0}],
  ["~", {position: 0, row: 0}],
  ["1", {position: 1, row: 0}],
  ["!", {position: 1, row: 0}],
  ["2", {position: 2, row: 0}],
  ["@", {position: 2, row: 0}],
  ["3", {position: 3, row: 0}],
  ["#", {position: 3, row: 0}],
  ["4", {position: 4, row: 0}],
  ["$", {position: 4, row: 0}],
  ["5", {position: 5, row: 0}],
  ["%", {position: 5, row: 0}],
  ["6", {position: 6, row: 0}],
  ["^", {position: 6, row: 0}],
  ["7", {position: 7, row: 0}],
  ["&", {position: 7, row: 0}],
  ["8", {position: 8, row: 0}],
  ["*", {position: 8, row: 0}],
  ["9", {position: 9, row: 0}],
  ["(", {position: 9, row: 0}],
  [")", {position: 10, row: 0}],
  ["0", {position: 10, row: 0}],
  ["-", {position: 11, row: 0}],
  ["_", {position: 11, row: 0}],
  ["=", {position: 12, row: 0}],
  ["+", {position: 12, row: 0}],
  ["Backspace", {position: 13, row: 0}],
  ["Tab", {position: 14, row: 1}],
  ["q", {position: 15, row: 1}],
  ["Q", {position: 15, row: 1}],
  ["w", {position: 16, row: 1}],
  ["W", {position: 16, row: 1}],
  ["e", {position: 17, row: 1}],
  ["E", {position: 17, row: 1}],
  ["r", {position: 18, row: 1}],
  ["R", {position: 18, row: 1}],
  ["t", {position: 19, row: 1}],
  ["T", {position: 19, row: 1}],
  ["y", {position: 20, row: 1}],
  ["Y", {position: 20, row: 1}],
  ["u", {position: 21, row: 1}],
  ["U", {position: 21, row: 1}],
  ["i", {position: 22, row: 1}],
  ["I", {position: 22, row: 1}],
  ["o", {position: 23, row: 1}],
  ["O", {position: 23, row: 1}],
  ["p", {position: 24, row: 1}],
  ["P", {position: 24, row: 1}],
  ["[", {position: 25, row: 1}],
  ["{", {position: 25, row: 1}],
  ["]", {position: 26, row: 1}],
  ["}", {position: 26, row: 1}],
  ["\\", {position: 27, row: 1}],
  ["|", {position: 27, row: 1}]
])

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



