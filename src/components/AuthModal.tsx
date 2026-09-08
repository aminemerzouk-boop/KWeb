'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setErrorMsg(error.message);
      else {
        alert('Check your email to confirm registration!');
        onClose();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
      else onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-900">
          {isSignUp ? 'Create Atelier Account' : 'Sign In'}
        </h3>

        {errorMsg && (
          <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">{errorMsg}</p>
        )}

        <form onSubmit={handleAuth} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border p-2 text-xs focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border p-2 text-xs focus:border-black focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition"
          >
            {loading ? 'Processing...' : isSignUp ? 'Register' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 w-full text-center text-xs text-gray-600 underline"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Register"}
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full text-center text-xs text-gray-400 hover:text-black"
        >
          Close
        </button>
      </div>
    </div>
  );
};