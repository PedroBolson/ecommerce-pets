import React from 'react';
import './FormInput.css';
import TextField from '@mui/material/TextField';

interface FormInputProps {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
    id,
    label,
    type,
    value,
    onChange,
    placeholder,
    required = false,
}) => {
    return (
        <div className="form-group">
            <TextField
                label={label}
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                variant="standard"
                fullWidth
            />
        </div>
    );
};