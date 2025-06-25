import type { StylesConfig, GroupBase } from 'react-select'

type Option = {
  value: string
  label: string
}

type OptionType = {
  value: string
  label: string
}

export const customSelectStyles: StylesConfig<Option, true, GroupBase<Option>> = {
    control: (base, _) => ({
        ...base,
        backgroundColor: '#0e0e0e',
        borderColor: 'rgba(255, 59, 48, 0.4)',
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
}

export const customSelectStyles2: StylesConfig<Option, true, GroupBase<Option>> = {
    control: (_, __) => ({
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

export const customSingleSelectStyle: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
  control: (_, __) => ({
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