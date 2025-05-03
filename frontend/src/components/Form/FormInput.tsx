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
    borderRadius?: string | number; // Add borderRadius prop
}

export const FormInput: React.FC<FormInputProps> = ({
    id,
    label, // Use label prop for TextField label
    type,
    value,
    onChange,
    placeholder,
    required = false,
    borderRadius = '20px' // Default border radius
}) => {
    return (
        <div className="form-group">
            <TextField
                label={label} // Use label prop here
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                variant="outlined" // Ensure outlined variant for border visibility
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: borderRadius, // Apply borderRadius here
                        '& fieldset': {
                            // This targets the border element
                            // You might not need this if the root borderRadius is enough
                        },
                    },
                }}
            />
        </div>
    );
};