import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <header className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm p-4 flex justify-between items-center border-b border-white/10">
        <h2 className="text-3xl font-bold text-white">PGR</h2>
        <SignOutButton />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md mx-auto">
          <Content />
        </div>
      </main>

      <footer className="text-center py-4 text-white/80 bg-black/20 backdrop-blur-sm">
        <p>Made by alsharef • <a href="https://t.me/devv_515" className="hover:text-white transition-colors">t.me/devv_515</a></p>
      </footer>
      
      <Toaster />
    </div>
  );
}

function Content() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);

  const generatePassword = useMutation(api.passwords.generatePassword);
  const savePassword = useMutation(api.passwords.savePassword);
  const savedPasswords = useQuery(api.passwords.getSavedPasswords) || [];

  const handleGenerate = async () => {
    const newPassword = await generatePassword({
      length,
      includeNumbers,
      includeSymbols,
      includeUppercase,
    });
    setPassword(newPassword);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  const handleSave = async () => {
    if (!password) return;
    await savePassword({ password });
    toast.success("Password saved!");
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Password Generator</h1>
        <Authenticated>
          <p className="text-xl text-white/80">Generate secure passwords instantly</p>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-white/80">Sign in to save your passwords</p>
        </Unauthenticated>
      </div>

      <Unauthenticated>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={password}
                readOnly
                className="w-full bg-white/5 border border-white/20 rounded px-4 py-2 text-white"
                placeholder="Generated password will appear here"
              />
              <button
                onClick={handleCopy}
                disabled={!password}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded text-white transition-colors"
              >
                Copy
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Length: {length}</label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                  Include Numbers
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
                  Include Symbols
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                  />
                  Include Uppercase
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white transition-colors"
              >
                Generate Password
              </button>
              <button
                onClick={handleSave}
                disabled={!password}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded text-white transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {savedPasswords.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Saved Passwords</h3>
              <div className="space-y-2">
                {savedPasswords.map((saved) => (
                  <div
                    key={saved._id}
                    className="flex items-center gap-2 bg-white/5 rounded p-2"
                  >
                    <span className="flex-1 text-white font-mono">{saved.password}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(saved.password);
                        toast.success("Password copied!");
                      }}
                      className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm text-white transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Authenticated>
    </div>
  );
}
