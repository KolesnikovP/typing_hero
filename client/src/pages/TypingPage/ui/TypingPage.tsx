import { Timer } from '@/features/Timer';
import { TypingWindow } from '@/features/TypingWindow'
import { getMockedTypingText } from '@/features/TypingWindow/mockText';
import { useEffect, useState } from 'react';
import { SessionStats } from './SessionStats/SessionStats';
import cls from './TypingPage.module.scss'
import useAccurateCountdown from '@/shared/lib/hooks/useAccurateCountDown';
import ReloadIcon from '@shared/assets/icons/reload.svg'
import GearIcon from '@shared/assets/icons/gear.svg'
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon/ui/Icon';
import { KeyboardHelper } from '@/features/KeyboardHelper';
import { TimeSelector, getStoredTime, type TimeInterval } from './TimeSelector';
import { SettingsModal } from './SettingsModal/SettingsModal';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showKeyboardHelper, setShowKeyboardHelper] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('typing_hero_show_keyboard_helper');
      return stored ? stored === 'true' : true;
    } catch {
      return true;
    }
  });
  
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

  const toggleKeyboardHelper = () => {
    setShowKeyboardHelper((prev) => {
      const next = !prev;
      try { localStorage.setItem('typing_hero_show_keyboard_helper', String(next)); } catch {}
      return next;
    });
  };

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
            {showKeyboardHelper && (
              <KeyboardHelper activeKey={keyboardHelperActiveKey} />
            )}
            <div className={cls.TimeControlsRow}>
              <TimeSelector 
                selectedTime={selectedTime}
                onTimeChange={setSelectedTime}
                disabled={isSessionStarted}
                hideLabel
              />
              <Button
               className={cls.SettingsButton}
               theme='outline'
               aria-label="Settings" 
               title="Settings"
               onClick={() => setIsSettingsOpen(true)}>
                <Icon Svg={GearIcon} width={25} height={25} />
              </Button>
            </div>

            <div className={cls.ButtonsGroup}>
              <button className={cls.Button} onClick={startCountdown}>Start</button>
              <button className={cls.Button} onClick={resetCountdown}>Reset</button>
            </div>
          </>
      }
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        showKeyboardHelper={showKeyboardHelper}
        onToggleKeyboardHelper={toggleKeyboardHelper}
      />
    </div>
  )
}
