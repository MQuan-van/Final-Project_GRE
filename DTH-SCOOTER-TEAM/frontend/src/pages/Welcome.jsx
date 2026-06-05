import { useNavigate } from "react-router-dom";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="welcome-main">

    <div className="welcome-body">
        {/* background/logo nằm phần trên */}
    </div>

    <footer className="wel-nav">
      < div className="nav-left">
         <a
          href="https://github.com/MQuan-van/Final-Project_GRE.git"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
          data-text="GitHub"
        >
          GitHub
        </a>
      </div>

      <div className="nav-center">
        <a
          href="https://www.facebook.com/profile.php?id=61574902900658"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
          data-text="Facebook"
        >
          Facebook
        </a>
        <a
          href="https://www.tiktok.com/@_dth568?fbclid=IwY2xjawSP3EZleHRuA2FlbQIxMABicmlkETFQTnpXTjcya2VtQzA2ZVZyc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHh3oRNyA9clJnAKI5O8bVa72jpspAE46ysqRiM1jU6axe5Ovx_wCPysZU_fh_aem_RSmRHpa26QL6VBD7ZXUKRg"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
          data-text="Tiktok"
        >
          Tiktok
        </a>
        <a
          href="https://www.facebook.com/nguyen.tien.hai.454888#"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
          data-text="Contact"
        >
          Contact
        </a >
      </div>

      <div className="nav-right">
        <div className="nav-item" data-text="Home" onClick={() => navigate("/Home")}>Home</div>
      </div>
      
    </footer>

    </main>
  );
}