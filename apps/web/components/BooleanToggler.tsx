const BooleanToggler = ({ value, onToggle }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(!value)}
      className={`relative inline-flex h-6 w-14 items-center rounded-full transition-colors duration-300 cursor-pointer
        ${value ? 'bg-primary' : 'bg-gray-300'}
      `}
      aria-pressed={value}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300
          ${value ? 'translate-x-8' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default BooleanToggler;
