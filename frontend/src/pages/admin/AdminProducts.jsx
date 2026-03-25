import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import api from "../../services/Api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        console.log(res.data);
        setProducts(res.data.data);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div>
      <div>
        <h1>Product Controller</h1>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stoke</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.productName}</td>
                <td>{product.brand}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.status}</td>
                <td><button>View</button></td>
                <td><button>Update</button></td>
                <td><button>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
