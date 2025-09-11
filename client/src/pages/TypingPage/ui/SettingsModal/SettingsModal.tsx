import { Modal } from '@/shared/ui/Modal';
import { Text } from '@/shared/ui/Text';
import cls from './SettingsModal.module.scss';
import { Switch } from './Switch';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  showKeyboardHelper: boolean;
  onToggleKeyboardHelper: () => void;
  includePunctuation: boolean;
  onTogglePunctuation: () => void;
  includeNumbers: boolean;
  onToggleNumbers: () => void;
}

export const SettingsModal = (props: SettingsModalProps) => {
  const { 
    isOpen,
    onClose, 
    showKeyboardHelper, 
    onToggleKeyboardHelper, 
    includePunctuation, 
    onTogglePunctuation, 
    includeNumbers, 
    onToggleNumbers
   } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className={cls.SettingsContent}>
        <div className={cls.SettingRow}>
          <Text size='size_s' title='Keyboard Helper' />
          <div className={cls.ToggleLabel}>
            <Switch checked={showKeyboardHelper} onChange={onToggleKeyboardHelper} />
          </div>
        </div>
        <div className={cls.SettingRow}>
          <Text size='size_s' title='Include punctuation' />
          <div className={cls.ToggleLabel}>
            <Switch checked={includePunctuation} onChange={onTogglePunctuation} />
          </div>
        </div>
        <div className={cls.SettingRow}>
          <Text size='size_s' title='Include numbers' />
          <div className={cls.ToggleLabel}>
            <Switch checked={includeNumbers} onChange={onToggleNumbers} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
