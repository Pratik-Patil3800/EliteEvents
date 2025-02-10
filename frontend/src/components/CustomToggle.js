

const CustomToggle= ({ options, value, onToggle }) => {
  return (
    <div
      className="relative flex h-10 w-48 cursor-pointer items-center rounded-full bg-gray-200 p-1"
      onClick={() => onToggle(!value)}
    >
      <div
        className={`absolute h-8 w-[calc(50%-0.5rem)] rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
          value ? "translate-x-full" : ""
        }`}
      />
      {options.map((option, index) => (
        <span
          key={option}
          className={`z-10 flex h-8 w-1/2 items-center justify-center text-sm font-medium transition-colors duration-200 ${
            index === (value ? 1 : 0) ? "text-gray-800" : "text-gray-500"
          }`}
        >
          {option}
        </span>
      ))}
    </div>
  )
}

export default CustomToggle

