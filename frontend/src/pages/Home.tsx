import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="home">
      <section
        id="welcome"
        className="section-home flex items-center justify-center"
      >
        <div className="container">
          <div className="flex justify-center items-center">
            <div className="home-container">
              <h1 className="home-title">WELCOME!)</h1>
              <button onClick={() => navigate("/women")} className="btn-home">SHOP NOW</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
