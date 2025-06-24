import type { StylesConfig, GroupBase } from 'react-select'

type Option = {
  value: string
  label: string
}

export const customSelectStyles: StylesConfig<Option, true, GroupBase<Option>> = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#000000',
        color: '#d1d5db',
        borderColor: state.isFocused ? '#ef4444' : '#374151',
        borderWidth: '1px',
        borderRadius: '0.75rem',
        boxShadow: 'none',              
    }),
    input: (base) => ({
        ...base,
        color: '#d1d5db',
        outline: 'none !important',  
        boxShadow: 'none'
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9ca3af'
    }),
    singleValue: (base) => ({
        ...base,
        color: '#d1d5db'
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#1f2937'
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#d1d5db'
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: '#d1d5db',
        ':hover': {
        backgroundColor: '#ef4444',
        color: 'white'
        }
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: '#000000',
        borderRadius: '0.75rem',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        zIndex: 99,
    }),
    menuList: (base) => ({
        ...base,
        maxHeight: '150px',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        touchAction: 'auto',
        paddingTop: 0,
        paddingBottom: 0
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#ef4444' : '#000000',
        color: state.isFocused ? 'white' : '#d1d5db',
        cursor: 'pointer',
        padding: '0.5rem 1rem'
    })
}

export const customSelectStyles2: StylesConfig<Option, true, GroupBase<Option>> = {
    control: (_, state) => ({
        backgroundColor: '#3b3b3b',
        border: 'none',
        boxShadow: 'none',
        minHeight: 'auto',
        borderRadius: '0.375rem',
        padding: '2px',
        display: 'flex',
        alignItems: 'center',
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: '#3b3b3b',
        color: '#fff',
        borderRadius: '0.375rem',
        zIndex: 9999,
    }),
    menuList: (base) => ({
        ...base,
        maxHeight: '150px',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        touchAction: 'auto',
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: '0.375rem',
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused
            ? 'rgba(255, 59, 48, 0.1)'
            : '#3b3b3b',
        color: '#fff',
        '&:hover': {
            backgroundColor: 'rgba(255, 59, 48, 0.2)',
        },
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
        color: '#fff',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#fff',
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: '#fff',
        ':hover': {
            backgroundColor: 'rgba(255, 59, 48, 0.4)',
            color: '#fff',
        },
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9CA3AF', 
    }),
    input: (base) => ({
        ...base,
        color: '#fff',
    }),
    singleValue: (base) => ({
        ...base,
        color: '#fff',
    }),
};

