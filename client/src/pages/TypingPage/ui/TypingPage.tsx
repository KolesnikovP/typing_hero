import { Timer } from '@/features/Timer';
import { TypingWindow } from '@/features/TypingWindow'
import { useEffect, useState } from 'react';
import { SessionStats } from './SessionStats/SessionStats';
import cls from './TypingPage.module.scss'
import useAccurateCountdown from '@/shared/lib/hooks/useAccurateCountDown';
import ReloadIcon from '@shared/assets/icons/reload.svg'
import GearIcon from '@shared/assets/icons/gear.svg'
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon/ui/Icon';
import { KeyboardHelper } from '@/features/KeyboardHelper';
import { TimeSelector, type TimeInterval } from './TimeSelector';
import { SettingsModal } from './SettingsModal/SettingsModal';
import { fetchText } from '@/features/TypingText/model/services/fetchText/fetchText';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { LS_TEXT_NUMBERS, LS_TEXT_PUNCTUATION, LS_KEYBOARD_HELPER, LS_SELECTED_TIME } from '@/shared/const/localstorage';
import { useLocalStorage } from '@/shared/lib/hooks/useLocalStorage/useLocalStorage';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { typingTextReducer } from '@/features/TypingText/model/slice/typingTextSlice';
import { useSelector } from 'react-redux';
import { getTypingTextContent, getTypingTextLoading } from '@/features/TypingText/model/selectors/getTypingText';

type Logs = { timestamp: number; key: string; isMistake: boolean }
const initSessionProgress = {lettersTyped: 0, mistakesCount: 0, logs: [] as Logs[], timeWhenSessionOver: 0} 


const reducers: ReducersList = {
  typingText: typingTextReducer,
};

export const TypingPage = () => {
  const content = useSelector(getTypingTextContent);
  const isFetching = useSelector(getTypingTextLoading);
  const [typingText, setTypingText] = useState<string[]>([]);
  const [keyboardHelperActiveKey, setKeyboardHelperActiveKey] = useState('')
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [sessionResults, setSessionResults] = useState(initSessionProgress)
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useLocalStorage<TimeInterval>(LS_SELECTED_TIME, 60 as TimeInterval);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showKeyboardHelper, setShowKeyboardHelper] = useLocalStorage<boolean>(LS_KEYBOARD_HELPER, true);
  const [includePunctuation, setIncludePunctuation] = useLocalStorage<boolean>(LS_TEXT_PUNCTUATION, false);
  const [includeNumbers, setIncludeNumbers] = useLocalStorage<boolean>(LS_TEXT_NUMBERS, false);
  
  const dispatch = useAppDispatch();
  const { timeLeft, startCountdown, resetCountdown } = useAccurateCountdown(selectedTime);

  const requestText = () => {
    dispatch(fetchText({ length: 30, punctuation: includePunctuation, numbers: includeNumbers }));
  };
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

  // Initial fetch
  useEffect(() => {
    requestText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleKeyboardHelper = () => setShowKeyboardHelper((prev) => !prev);

  const togglePunctuation = () => setIncludePunctuation((prev) => !prev);

  const toggleNumbers = () => setIncludeNumbers((prev) => !prev);

  // Refetch when text preferences change
  useEffect(() => {
    requestText();
  }, [includePunctuation, includeNumbers]);

  // Sync local array + active key when content updates
  useEffect(() => {
    const chars = content.split('');
    setTypingText(chars);
    setKeyboardHelperActiveKey(chars[0] || '');
  }, [content]);

  return (
    <DynamicModuleLoader reducers={reducers}>
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
            <div className={cls.TopBar}>
              {isSessionStarted && (
                <Timer timeLeft={timeLeft} format='seconds' />
              )}
              {!isSessionStarted && (
                <div className={cls.TopBarControls}>
                  <TimeSelector 
                    className={cls.TopBarTimeSelector}
                    selectedTime={selectedTime}
                    onTimeChange={setSelectedTime}
                    disabled={isSessionStarted}
                    hideLabel
                  />
                  <Button
                    className={cls.SettingsButton}
                    theme='outline'
                    aria-label="Reload text"
                    title="Reload text"
                    onClick={requestText}
                    disabled={isFetching}
                  >
                    <Icon Svg={ReloadIcon} width={22} height={22} />
                  </Button>
                  <Button
                   className={cls.SettingsButton}
                   theme='outline'
                   aria-label="Settings" 
                   title="Settings"
                   onClick={() => setIsSettingsOpen(true)}>
                    <Icon Svg={GearIcon} width={22} height={22} />
                  </Button>
                </div>
              )}
            </div>
            <TypingWindow
              canType={Number(timeLeft.toFixed(1)) > 0 && isSessionStarted}
              typingText={typingText}
              onFirstKeyPress={handleFirstKeyPress}
              isSessionFinished={isSessionFinished}
              onSessionFinish={onSessionFinish}
              // very DEBATABLE
              updateKeyboardHelperActiveKey={updateKeyboardHelperActiveKey}
            /> 
            {showKeyboardHelper && (
              <KeyboardHelper activeKey={keyboardHelperActiveKey} />
            )}
            

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
        includePunctuation={includePunctuation}
        onTogglePunctuation={togglePunctuation}
        includeNumbers={includeNumbers}
        onToggleNumbers={toggleNumbers}
      />
    </div>
    </DynamicModuleLoader>
  )
}
