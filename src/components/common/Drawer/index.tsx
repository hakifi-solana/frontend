import { cn } from "@/utils";
import CloseIcon from "../Icons/CloseIcon";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./Base";
import { ReactNode } from "react";
import ArrowIcons from "../Icons/ArrowIcon";

type DrawerWrapperProps = {
    children?: ReactNode;
    prefix?: ReactNode;
    title?: string;
    description?: string;
    content: ReactNode;
    footer?: ReactNode;
    isOpen?: boolean;
    modal?: boolean;
    classNameTitle?: string;
    handleOpenChange?: () => void;
    handleClickOutside?: (e: any) => void;
};

const DrawerWrapper = ({ modal = true, children, prefix, title, description, content, footer, isOpen, handleOpenChange, classNameTitle, handleClickOutside }: DrawerWrapperProps) => {
    return (
        <Drawer open={isOpen} modal={modal}>
            {
                children ? <DrawerTrigger asChild onClick={handleOpenChange}>
                    {children}
                </DrawerTrigger> : null
            }
            <DrawerContent onInteractOutside={handleClickOutside}>
                <DrawerHeader>
                    <div className={cn("flex items-center", prefix ? "justify-between" : "justify-end")}>
                        {
                            prefix
                        }

                        <CloseIcon onClick={handleOpenChange} />
                    </div>
                    {title ? <DrawerTitle className="!text-title-20 text-typo-primary mt-5">{title}</DrawerTitle> : null}
                    {description ? <DrawerDescription>{description}</DrawerDescription> : null}
                </DrawerHeader>
                {content}
                {footer ? <DrawerFooter>
                    {footer}
                </DrawerFooter> : null}
            </DrawerContent>
        </Drawer>
    );
};

export default DrawerWrapper;
