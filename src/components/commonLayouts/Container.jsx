const Container = ({ children, className }) => {
  return (
    <div
      className={`w-full px-4 sm:px-6 lg:px-8 max-w-[1520px] mx-auto ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
