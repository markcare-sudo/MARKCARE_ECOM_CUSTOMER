const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white md:rounded md:shadow-sm md:p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;