import React, { useState, FormEvent } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase configuration (move to a separate file in production)
const firebaseConfig = {
  apiKey: "AIzaSyCYfOtBqd4kKuQgmotYuRiHNtFQSnx2iz0",
  authDomain: "spectra25-fb7cf.firebaseapp.com",
  projectId: "spectra25-fb7cf",
  storageBucket: "spectra25-fb7cf.appspot.com",
  messagingSenderId: "189531230803",
  appId: "1:189531230803:web:81978d30b5001ec0586ca6",
  measurementId: "G-41XLWDDW7T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface TeamRegistrationData {
  teamName: string;
  name1: string;
  name2: string;
  college?: string;
  department: string;
  email: string;
  phone1: string;
  phone2: string;
  transactionId: string;
  paymentMethod: 'online' | 'offline';
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<TeamRegistrationData>({
    teamName: '',
    name1: '',
    name2: '',
    college: '',
    department: '',
    email: '',
    phone1: '',
    phone2: '',
    transactionId: '',
    paymentMethod: 'offline'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const requiredFields: (keyof TeamRegistrationData)[] = [
        'teamName', 'name1', 'name2', 'department',
        'email', 'phone1', 'phone2'
      ];

      if (formData.paymentMethod === 'online') {
        requiredFields.push('transactionId');
      }

      const missingFields = requiredFields.filter(field => !formData[field]?.trim());
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        throw new Error('Invalid email format');
      }

      await addDoc(collection(db, "registrations"), {
        ...formData,
        timestamp: new Date().toISOString()
      });
      
      setFormData({
        teamName: '',
        name1: '',
        name2: '',
        college: '',
        department: '',
        email: '',
        phone1: '',
        phone2: '',
        transactionId: '',
        paymentMethod: 'offline'
      });
      
      setSubmitStatus('success');
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Sci-fi background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500 opacity-10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-4xl bg-gray-900/90 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.3)] rounded-3xl p-8 sm:p-10 lg:p-12 mt-20 transform transition-all hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] animate-fade-in z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-cyan-400 tracking-wider animate-glow">
            Spectra 2025: Register here
          </h2>
          <p className="text-gray-400 mt-4 text-xl font-mono animate-fade-in-up">
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Payment Method Selection */}
          <div className="space-y-4">
            <label htmlFor="paymentMethod" className="block text-sm font-mono text-cyan-300">
              Payment Mode <span className="text-red-500">*</span>
            </label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-4 bg-gray-800 border-2 border-cyan-500/50 rounded-xl text-cyan-200 focus:ring-4 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
              required
            >
              <option value="offline">Offline Mode</option>
              <option value="online">Online Mode</option>
            </select>
          </div>

          {/* QR Code for Online Payment */}
          {formData.paymentMethod === 'online' && (
            <div className="bg-gray-800/80 p-6 rounded-2xl text-center space-y-5 border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.3)] animate-slide-up">
              <p className="text-purple-300 font-mono text-lg">
                Quantum Payment Interface
              </p>
              <div className="bg-gray-900 p-4 rounded-xl shadow-inner transform hover:scale-105 transition-all duration-300 border border-cyan-500/20">
                <img
                  src="https://via.placeholder.com/150x150.png?text=Quantum+QR"
                  alt="Payment QR Code"
                  className="w-52 h-52 rounded-lg shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                />
              </div>
              <p className="text-gray-400 text-sm font-mono animate-fade-in">
                Input Transaction Hash below
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { id: 'teamName', label: 'Team Name', placeholder: 'Enter your Team Name', required: true },
                { id: 'name1', label: 'Name 1', placeholder: 'Enter 1st Participant Name', required: true },
                { id: 'name2', label: 'Name 2', placeholder: 'Enter 2nd Participant Name', required: true }
              ].map(field => (
                <div key={field.id} className="space-y-3 animate-fade-in-up" style={{ animationDelay: `${field.id === 'teamName' ? '0s' : field.id === 'name1' ? '0.1s' : '0.2s'}` }}>
                  <label htmlFor={field.id} className="block text-sm font-mono text-cyan-300">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id={field.id}
                    type="text"
                    value={formData[field.id as keyof TeamRegistrationData]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full p-4 bg-gray-800 border-2 border-cyan-500/50 rounded-xl text-cyan-200 focus:ring-4 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] placeholder-gray-500"
                    required={field.required}
                  />
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { id: 'college', label: 'College Name', placeholder: 'Enter College Name', required: false },
                { id: 'department', label: 'Department', placeholder: 'Enter Department', required: true },
                { id: 'email', label: 'Email', placeholder: 'Enter your Email', type: 'email', required: true }
              ].map(field => (
                <div key={field.id} className="space-y-3 animate-fade-in-up" style={{ animationDelay: `${field.id === 'college' ? '0s' : field.id === 'department' ? '0.1s' : '0.2s'}` }}>
                  <label htmlFor={field.id} className="block text-sm font-mono text-cyan-300">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id={field.id}
                    type={field.type || 'text'}
                    value={formData[field.id as keyof TeamRegistrationData]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full p-4 bg-gray-800 border-2 border-cyan-500/50 rounded-xl text-cyan-200 focus:ring-4 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] placeholder-gray-500"
                    required={field.required}
                  />
                </div>
              ))}
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { id: 'phone1', label: 'Phone No', placeholder: 'Enter Phone No 1', type: 'tel', required: true },
                { id: 'phone2', label: 'Phone No', placeholder: 'Enter Phone No 2', type: 'tel', required: true },
                ...(formData.paymentMethod === 'online' ? [{
                  id: 'transactionId',
                  label: 'Transaction Hash',
                  placeholder: 'Enter transaction hash',
                  required: true
                }] : [])
              ].map(field => (
                <div key={field.id} className="space-y-3 animate-fade-in-up" style={{ animationDelay: `${field.id === 'phone1' ? '0s' : field.id === 'phone2' ? '0.1s' : '0.2s'}` }}>
                  <label htmlFor={field.id} className="block text-sm font-mono text-cyan-300">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id={field.id}
                    type={field.type || 'text'}
                    value={formData[field.id as keyof TeamRegistrationData]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full p-4 bg-gray-800 border-2 border-cyan-500/50 rounded-xl text-cyan-200 focus:ring-4 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] placeholder-gray-500"
                    required={field.required}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl text-white font-mono text-lg uppercase tracking-wider transition-all duration-500 shadow-[0_0_15px_rgba(0,255,255,0.5)] ${
              isSubmitting 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 focus:ring-4 focus:ring-cyan-400 transform hover:scale-105 animate-glow'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 mr-3 text-cyan-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Transmitting...
              </span>
            ) : (
              'Engage Registry'
            )}
          </button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mt-8 p-6 bg-gray-800/80 text-cyan-300 rounded-2xl flex items-center shadow-[0_0_15px_rgba(0,255,255,0.3)] animate-bounce-in border border-cyan-500/30">
              <svg className="h-8 w-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="font-mono">Registry Confirmed: Access Granted!</span>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mt-8 p-6 bg-gray-800/80 text-red-400 rounded-2xl flex items-center shadow-[0_0_15px_rgba(255,0,0,0.3)] animate-bounce-in border border-red-500/30">
              <svg className="h-8 w-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span className="font-mono">Error: {errorMessage}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;