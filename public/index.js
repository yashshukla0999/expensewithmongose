//BUY PREMIUM
document.getElementById("razor").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3000/purchase/premium", {headers: { authorization: token }});
  console.log("5");
  var options = {
    key: res.data.key_id,
    order_id: res.data.order.id,
    handler: async function (res) {
      const res1 = await axios.post("http://localhost:3000/purchase/updatestatus",
      {  order_id: options.order_id,
          payment_id: res.razorpay_payment_id,
        },
        { headers: { authorization: token } }
      );
      alert("you are  a premium user now");
      document.getElementById("razor").style.visibility = "hidden";
      document.getElementById(
        "show"
      ).innerHTML = `<p style="color:green"> You are a Premium User <p>`;
      const change = document.getElementById("chn");
      change.innerHTML = `<input type="button" id="leader" style="margin-top:4.7%;float:left;" value="Show Leaderboard"
   class="submitBtn">`;
      localStorage.setItem("token", res1.data.token);
      document.getElementById("leader").onclick = async function () {
        let resp = await axios.get("http://localhost:3000/purchase/getCheat");
        const parentNode = document.getElementById('listexpenseall');
        parentNode.innerHTML = ' ';
        for (let i = 0; i < resp.data.length; i++) {
          showleader(resp.data[i]);
        }
      }
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on("payment.failed", function (res) {
    console.log(res);
    alert("something went wrong");
  });
};
