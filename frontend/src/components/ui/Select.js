export function Select({ children, ...props }) {
    return (
      <select className="w-full p-2 border border-gray-300 rounded-md" {...props}>
        {children}
      </select>
    );
  }
  