"use client";

import { useIsMobile } from '@/hooks/useMediaQuery';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from './Dialog';
import { cn } from '@/utils';
import { ReactNode, useEffect } from 'react';
import DrawerWrapper from '../Drawer';

type ModalProps = {
    onInteractOutside?: (e: any) => void;
    showCloseButton?: boolean;
    variant?: 'primary' | 'danger';
    title?: string | ReactNode;
    isMobileFullHeight?: boolean;
    children: any;
    isOpen: boolean;
    asChild?: boolean;
    className?: string;
    overlayClassName?: string;
    contentClassName?: string;
    onRequestClose: () => void;
    size?: 'sm' | 'md' | 'lg';
    modal?: boolean;
    useDrawer?: boolean;
};

const Modal = ({
    children,
    showCloseButton,
    overlayClassName,
    contentClassName,
    className,
    asChild = false,
    onInteractOutside,
    variant = 'primary',
    onRequestClose,
    modal = false,
    size = "md",
    title,
    isOpen,
    useDrawer = true,
    ...rest
}: ModalProps) => {
    const isMobile = useIsMobile();
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <>
            {
                !isMobile ? <Dialog open={isOpen} onOpenChange={onRequestClose} {...rest} modal={modal}>
                    <DialogContent
                        onInteractOutside={onInteractOutside}
                        size={size}
                        className={cn("max-h-[740px] overflow-auto custom-scroll", contentClassName)}
                        showCloseButton={showCloseButton as boolean}
                    >
                        <DialogHeader>
                            {title ? <DialogTitle
                                asChild={asChild}
                                className="!text-title-24 text-typo-primary">
                                {title}
                            </DialogTitle> : null}
                            <DialogDescription asChild>
                                {children}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog> :
                    useDrawer && <DrawerWrapper
                        isOpen={isOpen}
                        handleOpenChange={onRequestClose}
                        classNameTitle="!text-title-24 text-typo-primary"
                        content={
                            children
                        }
                    >
                    </DrawerWrapper>

            }
        </>
    );
};

export default Modal;
