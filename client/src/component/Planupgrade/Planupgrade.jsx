import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Planupgrade.css";

const Planupgrade = ({ user }) => {
  const [plans, setplans] = useState([]);
  const [message, setmessage] = useState("");
  const [loading, setloading] = useState(false);

  const staticplans = [
    { name: "Free", price: 0, durationMinutes: 5 },
    { name: "Bronze", price: 10, durationMinutes: 7 },
    { name: "Silver", price: 50, durationMinutes: 10 },
    { name: "Gold", price: 100, durationMinutes: 9999 },
  ];
  useEffect(() => {
    setplans(staticplans);
  }, []);

  const handleupgrade = async (planName, planPrice) => {
    if (!user) {
      setmessage("please log in to upgrade your plan");
      return;
    }
    setloading(true);
    setmessage("");

    if (planPrice === 0) {
      setmessage("You are already on free plan");
      setloading(false);
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/video/create-order",
        {
          amount: planPrice,
        }
      );

      const order = res.data;
      const options = {
        key: "rzp_test_QwSuYItlzKmHNj",
        amount: order.amount,
        currency: order.currency,
        name: "YourTube Premium Plan",
        description: `Upgrade to ${planName}`,
        order_id: order.id,
        handler: async function () {
          await axios.post(
            "http://localhost:5000/api/upgrade",
            {
              userId: user._id,
              userEmail: user.email,
              planName,
            }
          );
          alert("Upgrade successfully !! You are now a premium user");
          window.location.href = "/";
        },

        prefill: {
          email: user.email,
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      setmessage("payment failed.please try again");
    } finally {
      setloading(false);
    }

    
  };
  return (
    <div className="plan-upgrade-container">
      <h2>UPGRADE YOUR PLAN</h2>
      <div className="plan-grid">
        {plans.map((plan) => (
          <div key={plan.name} className="plan-card">
            <h5>{plan.name} Plan</h5>
            <p>
              Duration:{" "}
              {plan.durationMinutes === 9999
                ? "Unlimited"
                : `${plan.durationMinutes} mins`}
            </p>
            <p>Price: ₹{plan.price}</p>
            <button
              className="plan-upgrade-btn"
              onClick={() => handleupgrade(plan.name, plan.price)}
              disabled={loading}
            >
              {loading ? "processing..." : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
      {message && <div className="alert-msg">{message}</div>}
    </div>
  );
};

export default Planupgrade;
