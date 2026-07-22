"use client";

export default function DeleteClassButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm("Delete this class? This cannot be undone.")) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
