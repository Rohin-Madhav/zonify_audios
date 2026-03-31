import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import api from "../../services/Api";
import { Eye } from "lucide-react";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payment/all");
        console.log(res.data);
        setPayments(res.data.data);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleRefund = async (orderId) => {
  try {
    const res = await api.post("/payment/refund", {
      orderId,
    });

    toast.success("Refund successful");

    setPayments((prev) =>
      prev.map((p) =>
        p._id === paymentId ? { ...p, status: "refunded" } : p
      )
    );
  } catch (error) {
    toast.error("Refund failed");
  }
};

  return (
    <div>
      <div>
        <h1>Payment Controller</h1>
      </div>
      <div>
        <table>
          <thead>
            <th>Payment Id</th>
            <th>Order Id</th>
            <th>User</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment._id}</td>
                <td>{payment.orderId._id}</td>
                <td>{payment.userId.name}</td>
                <td>{payment.amount}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.status}</td>
                <td>{payment.createdAt}</td>
                <td>
                  <button>View</button>
                  <button>Refund</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
