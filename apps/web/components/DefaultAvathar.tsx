function getFontSize(sizeS: string) {
  const size = parseInt(sizeS);
  if (size <= 8) return 'text-sm';
  if (size <= 12) return 'text-md';
  if (size <= 16) return 'text-lg';
  if (size <= 20) return 'text-xl';
  if (size <= 40) return 'text-2xl';
  if (size <= 64) return 'text-3xl';
  return 'text-9xl';
}

export const DefaultAvathar = ({
  name,
  size = '8',
}: {
  name: string;
  size?: string;
}) => {
  const initials =
    (name?.[0] ?? '').toUpperCase() + (name?.[1] ?? '').toUpperCase();
  return name.length > 0 ? (
    <div
      className={`relative inline-flex items-center justify-center w-${size} h-${size} overflow-hidden bg-gray-100 rounded-full`}
    >
      <span className={`${getFontSize(size)} text-gray-900`}>
        {initials || ''}
      </span>
    </div>
  ) : (
    <div
      className={`relative w-${size} h-${size} overflow-hidden bg-gray-100 rounded-full`}
    >
      <svg
        className={`absolute text-gray-400 left-1/2 top-1/2 w-[calc(${size}*1.25)] h-[calc(${size}*1.25)] -translate-x-1/2 -translate-y-1/2`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export const DefaultAvatar = DefaultAvathar;
