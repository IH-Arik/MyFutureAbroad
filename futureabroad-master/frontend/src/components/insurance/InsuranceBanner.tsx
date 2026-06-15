import type React from "react";

const InsuranceBanner: React.FC<any> = ({ src, alt }) => {
  return (
    <section className="mb-16 flex justify-center">
      <img src={src} alt={alt} className="rounded-lg shadow-md" />
    </section>
  );
};

export default InsuranceBanner;
