import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-motif" aria-hidden="true">
          <span />
        </div>
        <p className="welcome-kicker">3D room planner</p>
        <h1>Plan a room you&rsquo;ll love.</h1>
        <p className="welcome-text">
          Place furniture, set the colours and shape the space the way you
          imagine it.
        </p>
        <button onClick={() => navigate('/login')}>Start planning</button>
      </div>
    </div>
  );
}