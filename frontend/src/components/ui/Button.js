export function Button({ children, ...props }) {
    return (
      <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors" {...props}>
        {children}
      </button>
    );
  }
  