
import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { CircuitSearch } from '../components/CircuitSearch';
import { CircuitDetails } from '../components/CircuitDetails';
import { ClientRegistration } from '../components/ClientRegistration';
import { Header } from '../components/Header';

export type Circuit = {
  circuit_id: string;
  client_name: string;
  client_ip: string;
  subnet: string;
  dns: string;
  vlan: string;
  bandwidth: string;
  location: string;
  mux_id: string;
  port_id: string;
  last_updated: string;
};

export type User = {
  username: string;
  role: string;
};

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [currentView, setCurrentView] = useState<'search' | 'details' | 'register'>('search');

  const handleLogin = (username: string) => {
    setUser({ username, role: 'admin' });
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCircuit(null);
    setCurrentView('search');
  };

  const handleCircuitSelect = (circuit: Circuit) => {
    setSelectedCircuit(circuit);
    setCurrentView('details');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedCircuit(null);
  };

  const handleRegisterClient = () => {
    setCurrentView('register');
  };

  const handleClientRegistered = (circuit: Circuit) => {
    console.log('New client registered:', circuit);
    // In a real app, this would save to backend
    setCurrentView('search');
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-6 py-8">
        {currentView === 'search' ? (
          <CircuitSearch onCircuitSelect={handleCircuitSelect} onRegisterClient={handleRegisterClient} />
        ) : currentView === 'details' ? (
          <CircuitDetails 
            circuit={selectedCircuit}
            onBack={handleBackToSearch}
            onUpdate={setSelectedCircuit}
          />
        ) : (
          <ClientRegistration
            onBack={handleBackToSearch}
            onRegister={handleClientRegistered}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
