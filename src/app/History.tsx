import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';


function HistoryPage() {
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
  const navigate = useNavigate();

  const handleSessionClick = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };

  const handleNewSessionClick = () => {
    const newSessionId = uuidv4();
    navigate(`/chat/${newSessionId}`);
  };


  return (
    <div>
      <h1>Session History</h1>
      <button onClick={handleNewSessionClick}>New Session</button>
      <ul>
        {sessions.map((session: any) => (
          <li key={session.id} onClick={() => handleSessionClick(session.id)}>
            Session {session.id.substring(0, 8)}...
            <br />
            Filename: {session.name}
            <br />
            Number of messages: {session.messages.length}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryPage;