import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { _id, productName, price, image, stock, description } = product;
  const isOutOfStock = stock <= 0;

  return (
    <div
      onClick={() => navigate(`/products/${_id}`)}
      className="group cursor-pointer border border-black/5 hover:border-black/10 rounded-2xl overflow-hidden transition-all duration-300 bg-white"
    >
      {/* Image */}
      <div className="bg-black/2 flex items-center justify-center h-56 overflow-hidden">
        <img
          src={image}
          alt={productName}
          className="max-h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 border-t border-black/5">
        {/* Name + Description */}
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-black line-clamp-1">
            {productName}
          </h3>
          {description && (
            <p className="text-xs text-black/35 mt-1 line-clamp-1 tracking-tight">
              {description}
            </p>
          )}
        </div>

        {/* Price + Stock badge */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold tracking-tight text-black">
            ₹{price.toLocaleString()}
          </span>
          <span
            className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${
              isOutOfStock
                ? "bg-red-50 text-red-400"
                : stock < 5
                  ? "bg-yellow-50 text-yellow-500"
                  : "bg-green-50 text-green-500"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : stock < 5
                ? "Low Stock"
                : "In Stock"}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium tracking-tight transition-all duration-300 ${
            isOutOfStock
              ? "bg-black/5 text-black/25 cursor-not-allowed"
              : "bg-black hover:bg-black/80 text-white cursor-pointer"
          }`}
        >
          {!isOutOfStock && (
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
          )}
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
