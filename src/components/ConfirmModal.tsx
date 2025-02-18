import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { AnimatedHeadline } from './AnimatedHeadline';

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: Props) {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50 " onClose={onCancel}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[var(--color-modal-overlay)]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-[var(--color-modal-bg)] rounded-lg max-w-md w-full shadow-xl transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
                  <AnimatedHeadline className="text-xl font-semibold text-primary dark:text-gray-100">
                    {title}
                  </AnimatedHeadline>
                  <button
                    onClick={onCancel}
                    className="p-1 rounded-full hover:bg-[var(--color-hover)] text-primary dark:text-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-secondary dark:text-gray-300 mb-6">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-[var(--color-border)]">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)] text-primary dark:text-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Clear Data
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}