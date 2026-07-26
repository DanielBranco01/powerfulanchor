const BRANDS = ["Digitus", "HellermannTyton", "RFS", "Brady", "Roxtec"];

export default function TrustBar() {
  return (
    <div className="trust">
      <div className="wrap">
        <span className="label">Representamos marcas de referência</span>
        <div className="brands">
          {BRANDS.map((brand) => (
            <span key={brand} className="chip">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
