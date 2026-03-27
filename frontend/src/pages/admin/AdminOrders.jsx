import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import api from "../../services/Api";
import { Eye } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/order");
        console.log(res.data.data);
        setOrders(res.data.data);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <div>
        <h1>Orders Controller</h1>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Order Id</th>
              <th>User</th>
              <th>Email</th>
              <th>Total</th>
              <th>Payment </th>
              <th>Status</th>
              <th>Address</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.user.email}</td>
                <td>{order.totalAmount}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.paymentStatus ? order.paymentStatus : "Pending"}</td>
                <td>
                  {order.shippingAddress.city},{order.shippingAddress.state}
                  <button>
                    <Eye />
                  </button>
                </td>
                <td>{order.createdAt}</td>
                <td>{order.orderStatus}</td>
                <td>
                  <button>Update Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
