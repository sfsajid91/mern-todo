import React from 'react';

const TextInput = React.forwardRef(function TextInput(
    { error, label, type = 'text', placeholder, className, ...props },
    ref
) {
    const { name } = props;
    return (
        <div className="form-control w-full">
            <label className="label" htmlFor={name}>
                <span className="label-text">{label}</span>
            </label>
            <input
                type={type}
                placeholder={placeholder}
                className={`input bg-white input-bordered w-full ${className} ${
                    error && 'input-error'
                }`}
                id={name}
                {...props}
                ref={ref}
            />
            {error && (
                <label className="label">
                    <span className="label-text text-red-600">{error}</span>
                </label>
            )}
        </div>
    );
});

export default TextInput;
