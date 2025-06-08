import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          SlidePilot
        </h1>
        
        <div className="space-y-6">
          <p className="text-gray-600 text-center">
            AI-Powered PowerPoint Editor
          </p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              greet();
            }}
          >
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name..."
            />
            <button type="submit" className="btn-primary w-full">
              Test Tauri Connection
            </button>
          </form>
          
          {greetMsg && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{greetMsg}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
