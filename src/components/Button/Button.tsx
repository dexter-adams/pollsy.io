import React, {forwardRef} from 'react';
import classnames from 'classnames';

export interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    variant?: 'primary' | 'secondary' | 'warning' | 'outlinePrimary' | 'outlineSecondary' | 'outlineWarning';
    size?: 'small' | 'normal' | 'large';
    pill?: boolean;
    disabled?: boolean;
    full?: boolean;
    onClick?: () => void;
}

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
    {
        children,
        type = 'button',
        className,
        variant = 'primary',
        size = 'normal',
        pill,
        disabled = false,
        full = false,
        onClick,
        ...restProps
    },
    ref
) => {
    const classes = {
        base: 'focus:outline-none transition ease-in-out duration-300',
        disabled: 'opacity-50 cursor-not-allowed',
        pill: 'rounded-full',
        size: {
            small: 'px-2 py-0 text-sm',
            normal: 'px-4 py-2',
            large: 'px-8 py-3 text-lg',
        },
        variant: {
            primary: 'px-10 py-[1rem] text-white rounded-md bg-blue hover:bg-blue focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ',
            secondary: 'px-10 py-[1rem] text-white rounded-md bg-gray hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50',
            warning: 'px-10 py-[1rem] text-white rounded-md bg-red hover:bg-red focus:ring-2 focus:ring-red-500 focus:ring-opacity-50',
            outlinePrimary: 'px-10 py-[1rem] text-blue rounded-md ring-2 ring-blue',
            outlineSecondary: 'px-10 py-[1rem] text-gray rounded-md ring-2 ring-gray',
            outlineWarning: 'px-10 py-[1rem] text-red rounded-md ring-2 ring-red',
        },
        full: 'w-full',
    };

    return (
        <button
            ref={ref}
            type={type}
            className={classnames(
                classes.base,
                classes.size[size],
                classes.variant[variant],
                pill && classes.pill,
                disabled && classes.disabled,
                full && classes.full,
                className
            )}
            onClick={onClick}
            {...restProps}
        >
            {children}
        </button>
    );
};

export default forwardRef<HTMLButtonElement, ButtonProps>(Button);
