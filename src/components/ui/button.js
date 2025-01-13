import React from 'react';

export const Button = ({ children, onClick, disabled, ...props }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            {...props}
        >
            {children}
        </button>
    );
};
