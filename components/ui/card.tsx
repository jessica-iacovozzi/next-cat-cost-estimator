interface CardProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export function Card({ children, className }: CardProps) {
    return (
      <div className={`bg-white shadow-lg rounded-xl p-4 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ children }: { children: React.ReactNode }) {
    return <div className="border-b pb-2 mb-3">{children}</div>;
  }
  
  export function CardTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg text-secondary font-bold">{children}</h2>;
  }
  
  export function CardContent({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  }
  