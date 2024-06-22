import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useNavigate } from "react-router-dom";

export default function Recovery() {
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      console.log(OTP);
      if (OTP) return toast.success("OTP has been sent to your email!");
      return toast.error("Problem while generating OTP!");
    });
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        toast.success("Verify Successfully!");
        return navigate("/reset");
      }
    } catch (error) {
      return toast.error("Wrong OTP! Check email again!");
    }
  }

  function resendOTP() {
    let sentPromise = generateOTP(username);
    toast.promise(sentPromise, {
      loading: "Sending...",
      success: <b>OTP has been sent to your email!</b>,
      error: <b>Could not send it!</b>,
    });

    sentPromise.then((OTP) => {
      console.log(OTP);
    });
  }

  const styles = {
    container: {
      maxWidth: "320px", // Reduced maximum width
      margin: "auto",
      padding: "15px", // Reduced padding
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      marginBottom: "10px",
    },
    input: {
      width: "100%",
      padding: "8px", // Reduced padding
      border: "1px solid #ddd",
      borderRadius: "5px",
    },
    btn: {
      width: "100%",
      padding: "8px", // Reduced padding
      background: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    btnHover: {
      background: "#0056b3",
    },
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div style={styles.container}>
          <div
            className="title flex flex-col items-center"
            style={styles.title}
          >
            <h4 className="text-3xl font-bold">Recovery</h4>
            <span className="py-2 text-lg w-2/3 text-center text-gray-500">
              Enter OTP to recover password.
            </span>
          </div>
          <form className="pt-10" onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-4">
              <div className="input text-center">
                <span className="py-2 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  onChange={(e) => setOTP(e.target.value)}
                  style={styles.input}
                  type="text"
                  placeholder="OTP"
                />
              </div>
              <button
                style={styles.btn}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background =
                    styles.btnHover.background)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = styles.btn.background)
                }
                type="submit"
              >
                Recover
              </button>
            </div>
          </form>
          <div className="text-center py-2">
            <span className="text-gray-500">
              Can't get OTP?{" "}
              <button onClick={resendOTP} className="text-red-500">
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
