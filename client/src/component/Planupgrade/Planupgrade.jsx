import React, { useEffect, useState } from "react";
import axios, { all } from "axios";
import "./Planupgrade.css";
const Planupgrade = ({ user }) => {
  const [plans, setplans] = useState([]);
  const [message, setmessage] = useState("");
  const [loading, setloading] = useState(false);


  const query = new URLSearchParams(window.location.search)
  const reason=query.get('reason');

  const staticplans = [
    { name: "Free", price: 0, durationMinutes: 5 ,planType:'general'},
    { name: "Bronze", price: 10, durationMinutes: 7,planType:'general' },
    { name: "Silver", price: 50, durationMinutes: 10,planType:'general' },
    { name: "Gold", price: 100, durationMinutes: 9999 ,planType:'general'},
    { name: "Premium Download", price: 50, durationMinutes: 9999 ,planType:'download'},
  ];
  useEffect(() => {
    if (reason === 'download') {
      setplans(staticplans.filter(plan => plan.planType === 'download'));
    } else {
      setplans(staticplans.filter(plan => plan.planType === 'general'))
    }
  }, [reason]);


  const handleupgrade = async (planName, planPrice,planType) => {
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
          try {
            const upgradeRes=await axios.post(
            "http://localhost:5000/api/upgrade",
            {
              userId: user._id,
              userEmail: user.email,
              planName,
              planType,
            }
          );
          if (upgradeRes.data.success || upgradeRes.status === 200) {
            alert("Upgrade successfully !! You are now a premium user");
            const profile = JSON.parse(localStorage.getItem('Profile'))
            const updatedprofile={
              ...profile,
              result:{
                ...profile.result,
                isPremium:true,
                planName,
                planType,
              }
            }
            localStorage.setItem('Profile',JSON.stringify(updatedprofile))
              window.location.href = "/";
          }
          } catch (upgradeError) {
            console.error("upgrade error:",upgradeError)
            alert('something went wrong.please try again')
          }
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
        {plans.map((plan) => {
      return(
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
              onClick={() => handleupgrade(plan.name, plan.price,plan.planType)}
              disabled={loading}
            >
              {loading ? "processing..." : "Upgrade"}
            </button>
          </div>
        )})}
      </div>
      {message && <div className="alert-msg">{message}</div>}
    </div>
  );
};

export default Planupgrade;
