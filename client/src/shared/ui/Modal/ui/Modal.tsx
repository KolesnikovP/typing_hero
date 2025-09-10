import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Modal.module.scss';
import { Separator } from '@/shared/ui/Separator';
import { JSX } from 'react';

type ModalProps = HTMLDivElement & {
  title?: string;
  description?: string;
  children: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
  lazy?: boolean; // For compatibility with existing usage
}

function Modal(props: ModalProps) {
  const {title, description, isOpen, onClose, children} = props;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={styles.overlay}
                />
              </Dialog.Overlay>
              <div className={styles.container}>
                <Dialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={styles.panel}
                  >
                    {title && (
                      <>
                        <Dialog.Title className={styles.title}>
                          {title}
                        </Dialog.Title>
                        <Separator className={styles.modalSeparator} />
                      </>
                    )}

                    {description && (
                      <Dialog.Description className={styles.description}>
                        {description} 
                      </Dialog.Description>
                    )}
                    {children}
                  </motion.div>
                </Dialog.Content>
              </div>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
