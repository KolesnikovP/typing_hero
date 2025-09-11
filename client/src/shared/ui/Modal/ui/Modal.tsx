import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import cls from './Modal.module.scss';
import { Separator } from '@/shared/ui/Separator';
import { JSX } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';

type ModalProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  lazy?: boolean; // For compatibility with existing usage
  className?: string;
}

function Modal(props: ModalProps) {
  const {title, description, isOpen, onClose, children, className} = props;

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
                  className={cls.overlay}
                />
              </Dialog.Overlay>
              <div className={classNames(cls.container, {}, [className])}>
                <Dialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cls.panel}
                  >
                    {title && (
                      <>
                        <Dialog.Title className={cls.title}>
                          {title}
                        </Dialog.Title>
                        <Separator className={cls.modalSeparator} />
                      </>
                    )}

                    {description && (
                      <Dialog.Description className={cls.description}>
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
