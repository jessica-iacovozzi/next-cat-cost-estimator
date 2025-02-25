interface CardProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export function Card({ children, className }: CardProps) {
    return (
      <div className={`bg-white shadow-lg rounded-xl p-4 mb-6 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ children, className }: CardProps) {
    return <div className={`border-b pb-2 mb-3 ${className}`}>{children}</div>;
  }
  
  export function CardTitle({ children, className }: CardProps) {
    return <h2 className={`text-lg text-secondary font-bold ${className}`}>{children}</h2>;
  }
  
  export function CardContent({ children, className }: CardProps) {
    return <div className={`${className}`}>{children}</div>;
  }
  