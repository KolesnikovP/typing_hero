import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Modal.module.scss';
import { JSX } from 'react';

type ModalProps = HTMLDivElement & {
  title?: string;
  description?: string;
  children: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
}

function Modal(props: ModalProps) {
  const {title, description, isOpen, onClose, children} = props;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Dialog static open={isOpen} onClose={onClose} >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.overlay}
            />
            <div className={styles.container}>
              <DialogPanel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={styles.panel}
              >
                {
                title &&
                <DialogTitle className={styles.title}>
                  {title}
                </DialogTitle>
                }

                {description &&
                <Description className={styles.description}>
                  {description} 
                </Description>
                }
                {children}
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}

export default Modal;
