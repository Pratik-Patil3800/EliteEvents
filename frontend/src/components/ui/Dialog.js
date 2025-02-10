export function Dialog({ open, children, onClose }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        {children}
      </div>
    );
  }
  
  