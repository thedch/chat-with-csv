'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useChat } from 'ai/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // for generating unique session IDs
import HistoryPage from './History'
import { useNavigate } from 'react-router-dom';


function CSVUploader({ setSessionId, sessionId }: { setSessionId: (id: string) => void, sessionId: string | null }) {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('!!! Got new file upload event', event.target.files)
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csvText = e.target?.result as string
        const rows = csvText.split('\n').map(row => row.split(','))
        setCsvData(rows)
        setIsFileUploaded(true)  // file upload successful, change state

        const newSessionId = uuidv4(); // generate a unique ID for this session
        console.log('!!! New session ID', newSessionId)
        setSessionId(newSessionId); // notify the Chat component of the new session ID

        // Save to local storage
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
        sessions.push({
          id: newSessionId,
          name: file.name,
          data: rows,
          messages: [], // start with no messages for this session
        })
        localStorage.setItem('sessions', JSON.stringify(sessions))
        navigate(`/chat/${newSessionId}`);
      }
      reader.readAsText(file)
    }
  }

  // Load file from local storage if a sessionId is passed in
  useEffect(() => {
    if (sessionId) {
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
      const currentSession = sessions.find(session => session.id === sessionId)
      if (currentSession) {
        setCsvData(currentSession.data)
        setIsFileUploaded(true)
      }
    }
  }, [sessionId])

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-full p-6 bg-white shadow rounded">
      <div className="flex justify-between mb-4 space-x-4">
        <button
          onClick={handleBackClick}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
        >
          Back to History
        </button>
        <label className="flex items-center px-4 py-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600">
          <span className="mr-2">{isFileUploaded ? "Try another file" : "Upload file"}</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"  // hide default input style
          />
        </label>
      </div>
      <div className="overflow-x-auto max-h-[30vh] overflow-y-auto">
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr>
              {csvData[0]?.map((cell, cellIndex) => (
                <th key={cellIndex} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200">{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {csvData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2 border border-gray-200">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Chat() {
  const { sessionId } = useParams(); // this gets the sessionId from the route
  const [localSessionId, setLocalSessionId] = useState<string | null>(sessionId);

  // Load pre-existing messages from local storage
  let initialMessages = [];
  if (sessionId) {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const currentSession = sessions.find(session => session.id === sessionId);
    if (currentSession) {
      initialMessages = currentSession.messages;
    }
  }

  const { messages, input, handleInputChange, handleSubmit } = useChat( {id: 'daniel-test', initialMessages } )

  useEffect(() => {
    if (localSessionId) {
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
      const currentSession = sessions.find(session => session.id === localSessionId)
      if (currentSession) {
        currentSession.messages = messages
        localStorage.setItem('sessions', JSON.stringify(sessions))
      }
    }
  }, [messages])

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-grow overflow-y-scroll">
          <header className="flex items-center justify-between p-6 bg-white border-b-2 border-gray-200">
              <CSVUploader setSessionId={setLocalSessionId} sessionId={sessionId}/>
          </header>
          <main className="p-6">
            {messages.map(m => (
              <div key={m.id} className="flex items-start mb-4">
                <div className={`rounded py-2 px-3 mr-2 text-sm font-medium ${m.role === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {m.role}
                </div>
                <div className='px-4 py-2 bg-white rounded shadow'>{m.content}</div>
              </div>
            ))}
          </main>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center p-6 bg-white border-t-2 border-gray-200">
          <input
            value={input}
            onChange={handleInputChange}
            className="flex-grow px-4 py-2 mr-4 bg-gray-100 rounded focus:outline-none focus:bg-white border border-transparent focus:border-blue-200 transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </>
  )
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat/:sessionId" element={<Chat />} />
        <Route path="/" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
