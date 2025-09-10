import { Modal } from '@/shared/ui/Modal';
import { Text } from '@/shared/ui/Text';
import cls from './SettingsModal.module.scss';
import { Switch } from './Switch';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  showKeyboardHelper: boolean;
  onToggleKeyboardHelper: () => void;
}

export const SettingsModal = (props: SettingsModalProps) => {
  const { isOpen, onClose, showKeyboardHelper, onToggleKeyboardHelper } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className={cls.SettingsContent}>
        <div className={cls.SettingRow}>
          <Text size='size_s' title='Keyboard Helper' />
          <div className={cls.ToggleLabel}>
            <Switch checked={showKeyboardHelper} onChange={onToggleKeyboardHelper} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
