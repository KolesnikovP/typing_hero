import { Timer } from '@/features/Timer';
import { TypingWindow } from '@/features/TypingWindow'
import { getMockedTypingText } from '@/features/TypingWindow/mockText';
import { useEffect, useState } from 'react';
import { SessionStats } from './SessionStats/SessionStats';
import cls from './TypingPage.module.scss'
import useAccurateCountdown from '@/shared/lib/hooks/useAccurateCountDown';
import ReloadIcon from '@shared/assets/icons/reload.svg'
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon/ui/Icon';
import { KeyboardHelper } from '@/features/KeyboardHelper';
import { TimeSelector, getStoredTime, type TimeInterval } from './TimeSelector';

type Logs = { timestamp: number; key: string; isMistake: boolean }
const initSessionProgress = {lettersTyped: 0, mistakesCount: 0, logs: [] as Logs[], timeWhenSessionOver: 0} 
const mockedText = [...getMockedTypingText(), ...getMockedTypingText(), ...getMockedTypingText(), ...getMockedTypingText()]


export const TypingPage = () => {
  const [keyboardHelperActiveKey, setKeyboardHelperActiveKey] = useState(mockedText[0])
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [sessionResults, setSessionResults] = useState(initSessionProgress)
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<TimeInterval>(getStoredTime());
  
  const { timeLeft, startCountdown, resetCountdown } = useAccurateCountdown(selectedTime);
    // Function to start the session when user types first letter
  const handleFirstKeyPress = () => {
    if (!isSessionStarted) {
      setIsSessionStarted(true);
      startCountdown(); // Start the countdown
    }
  };

  const updateKeyboardHelperActiveKey = (key: string) => {
    setKeyboardHelperActiveKey(key)
}


  const onSessionFinish = (chars: number, mistakes: number, logs: Logs[], timeWhenSessionOver: number) => {
    setSessionResults(prev => ({...prev, lettersTyped: chars, mistakesCount: mistakes, timeWhenSessionOver: timeWhenSessionOver, logs}))
    setIsResultsVisible(true)
  }

  useEffect(() => {
    if(Number(timeLeft.toFixed(1)) === 0) {
      setIsSessionFinished(true);
      setIsSessionStarted(false);
    }
  }, [timeLeft])

  return (
    <div className={cls.TypingPage}>
      {
        isResultsVisible?
          <div className={cls.StatsContainer}>
            <SessionStats
              lettersTyped={sessionResults.lettersTyped}
              mistakesCount={sessionResults.mistakesCount}
              sessionDurationInSeconds={selectedTime}
              timeWhenSessionOver={sessionResults.timeWhenSessionOver}
              logs={sessionResults.logs}
            />
            <Button 
              theme='clear'
              square
              onClick={() => {
                setIsSessionFinished(false);
                setIsResultsVisible(false);
                setIsSessionStarted(false);
                setSessionResults(initSessionProgress);
                resetCountdown();
              }}>
              <Icon Svg={ReloadIcon}/> 
            </Button>
          </div>
          :
          <>
            <div>
              <Timer timeLeft={Number(timeLeft.toFixed(1))}/>
            </div>
            <TypingWindow
              canType={Number(timeLeft.toFixed(1)) > 0 && isSessionStarted}
              typingText={mockedText}
              onFirstKeyPress={handleFirstKeyPress}
              isSessionFinished={isSessionFinished}
              onSessionFinish={onSessionFinish}
              // very DEBATABLE
              updateKeyboardHelperActiveKey={updateKeyboardHelperActiveKey}
            /> 

            <KeyboardHelper activeKey={keyboardHelperActiveKey}/>
            
            <TimeSelector 
              selectedTime={selectedTime}
              onTimeChange={setSelectedTime}
              disabled={isSessionStarted}
            />

            <div className={cls.ButtonsGroup}>
              <button className={cls.Button} onClick={startCountdown}>Start</button>
              <button className={cls.Button} onClick={resetCountdown}>Reset</button>
            </div>
          </>
      }
    </div>
  )
}
