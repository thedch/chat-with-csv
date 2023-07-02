'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'

function CSVUploader() {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csvText = e.target?.result as string
        const rows = csvText.split('\n').map(row => row.split(','))
        setCsvData(rows)
        setIsFileUploaded(true)  // file upload successful, change state
      }
      reader.readAsText(file)
    }
  }

  return (
    <div>
      <div className="flex justify-end">
      <label className="flex items-center p-1 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer">
        <span className="mr-2">{isFileUploaded ? "Try another file" : "Upload file"}</span>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload}
          className="hidden"  // hide default input style
        />
      </label>
      </div>
      <table style={{ 
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9'
      }}>
        <thead>
          <tr>
            {csvData[0]?.map((cell, cellIndex) => (
              <th key={cellIndex} style={{ 
                border: '1px solid black',
                padding: '8px'
              }}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {csvData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ 
                  border: '1px solid black',
                  padding: '8px'
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat( {id: 'daniel-test'} )

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow overflow-y-scroll">
          <CSVUploader />
          <div className="px-4 py-2">
            {messages.map(m => (
              <div key={m.id} className="flex items-center">
                <div className={`rounded py-2 px-3 mr-2 ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {m.role}
                </div>
                <div className='p-10'>{m.content}</div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-2 border-t border-gray-200">
          <input
            value={input}
            onChange={handleInputChange}
            className="flex-1 px-2 py-1 mr-2 border border-gray-200 rounded focus:outline-none focus:border-blue-200"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send, length of messages is {messages.length}
          </button>
        </form>
      </div>
    </>
  )
}
