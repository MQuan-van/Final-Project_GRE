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
        <div className="nav-item" data-text="Home">Home</div>
        <div className="nav-item" data-text="Gallery">Gallery</div>
        <div className="nav-item" data-text="Contact">Contact</div>
    </footer>

    </main>
  );
}