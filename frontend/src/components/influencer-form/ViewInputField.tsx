import React from "react";

export const viewInputField = (
    label: string,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    disabled = false) => (
    <div className='form-field'>
        <label className='form-label'>{label}</label>
        <input
            className='form-input'
            type='text'
            value={value}
            onChange={(e) => setter(e.target.value)}
            required={true}
            disabled={disabled}
        />
    </div>
);
