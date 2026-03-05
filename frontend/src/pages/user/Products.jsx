import React, { useState, useEffect } from "react";
import api from "../../services/Api";
import ProductCard from "../../components/shop/productCard";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addItemLocal } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.data);
        console.log(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    dispatch(addItemLocal(product));

    try {
      if (!token) {
        return navigate("/login");
      } else {
        await api.post("/cart/add", {
          items: [
            {
              product: product._id,
              quantity: 1,
            },
          ],
          
        });
       
      }
    } catch (error) {
      console.log("Product not found");
    }
  };

  return (
    <section>
      <div>
        <h1>All Products</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ProductCard product={p} onAddToCart={handleAddToCart} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Products;
