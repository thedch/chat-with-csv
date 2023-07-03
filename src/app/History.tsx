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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold text-gray-900">Session History</h1>
          <button
            onClick={handleNewSessionClick}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-base font-semibold rounded-lg shadow-md hover:bg-blue-700"
          >
            New Session
          </button>
          <ul className="mt-6 space-y-4">
            {sessions.map((session: any) => (
              <li
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="px-4 py-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer bg-gray-100"
              >
                <div className="text-lg font-semibold text-gray-900">Session {session.id.substring(0, 8)}...</div>
                <div className="text-sm font-medium text-gray-600">Filename: {session.name}</div>
                <div className="text-sm font-medium text-gray-600">Number of messages: {session.messages.length}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

}

export default HistoryPage;