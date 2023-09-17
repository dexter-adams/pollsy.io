import React from 'react';
import { Link } from 'react-router-dom';
import Button, { ButtonProps } from '../Button';

interface LinkButtonProps extends ButtonProps {
    href: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, ...buttonProps }) => {
    return (
        <Link to={href}>
            <Button {...buttonProps} />
        </Link>
    );
};

export default LinkButton;
