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
