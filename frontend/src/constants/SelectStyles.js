export const selectStylesCustom = () => {
  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'var(--color-base-100)',
      borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-base-200)',
      color: 'var(--color-base-content)',
      boxShadow: 'none',
      ':hover': {
        borderColor: 'var(--color-primary)',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? 'var(--color-base-200)'
        : 'var(--color-base-100)',
      color: 'var(--color-base-content)',
      ':active': {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-base-100)',
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'var(--color-base-100)',
      color: 'var(--color-base-content)',
      border: '1px solid var(--color-base-200)',
      zIndex: 9999,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'var(--color-base-200)',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'var(--color-base-content)',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: 'var(--color-base-content)',
      ':hover': {
        backgroundColor: 'var(--color-error)',
        color: 'white',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: 'var(--color-base-content)',
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--color-base-content)',
    }),
    input: (base) => ({
      ...base,
      color: 'var(--color-base-content)',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: 'var(--color-base-content)',
      ':hover': {
        color: 'var(--color-primary)',
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: 'var(--color-base-content)',
      ':hover': {
        color: 'var(--color-error)',
      },
    }),
    
    menuPortal: base => ({ ...base, zIndex: 9999 })
  }
}