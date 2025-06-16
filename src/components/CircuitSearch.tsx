
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Search, Zap, AlertCircle, UserPlus } from 'lucide-react';
import { Circuit } from '../pages/Index';

interface CircuitSearchProps {
  onCircuitSelect: (circuit: Circuit) => void;
  onRegisterClient: () => void;
}

// Mock data - in real app this would come from backend API
const mockCircuits: Circuit[] = [
  {
    circuit_id: 'CKT-001-NYC',
    client_name: 'TechCorp Solutions',
    client_ip: '192.168.1.100',
    subnet: '255.255.255.0',
    dns: '8.8.8.8',
    vlan: '100',
    bandwidth: '1 Gbps',
    location: 'New York Data Center',
    mux_id: 'MUX-NYC-01',
    port_id: 'Port-24',
    last_updated: '2024-06-14 10:30:00'
  },
  {
    circuit_id: 'CKT-002-LAX',
    client_name: 'Global Enterprises Inc',
    client_ip: '10.0.0.50',
    subnet: '255.255.0.0',
    dns: '1.1.1.1',
    vlan: '200',
    bandwidth: '500 Mbps',
    location: 'Los Angeles Data Center',
    mux_id: 'MUX-LAX-03',
    port_id: 'Port-12',
    last_updated: '2024-06-13 15:45:00'
  },
  {
    circuit_id: 'CKT-003-CHI',
    client_name: 'Metro Networks LLC',
    client_ip: '172.16.10.25',
    subnet: '255.255.255.128',
    dns: '8.8.4.4',
    vlan: '150',
    bandwidth: '2 Gbps',
    location: 'Chicago Data Center',
    mux_id: 'MUX-CHI-02',
    port_id: 'Port-08',
    last_updated: '2024-06-14 09:15:00'
  }
];

export const CircuitSearch = ({ onCircuitSelect, onRegisterClient }: CircuitSearchProps) => {
  const [circuitId, setCircuitId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!circuitId.trim()) {
      setError('Please enter a Circuit ID');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const circuit = mockCircuits.find(c => 
        c.circuit_id.toLowerCase() === circuitId.toLowerCase()
      );
      
      if (circuit) {
        onCircuitSelect(circuit);
      } else {
        setError(`Circuit ID "${circuitId}" not found in the system`);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-blue-600 p-3 rounded-full inline-block mb-4">
          <Search className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Circuit Lookup</h2>
        <p className="text-slate-600">Enter a Circuit ID to view and manage circuit details</p>
      </div>

      <div className="flex justify-center mb-6">
        <Button
          onClick={onRegisterClient}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register New Client</span>
        </Button>
      </div>

      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Search Circuit</span>
          </CardTitle>
          <CardDescription>
            Find circuit information by entering the Circuit ID below
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="circuitId">Circuit ID</Label>
              <Input
                id="circuitId"
                type="text"
                value={circuitId}
                onChange={(e) => setCircuitId(e.target.value)}
                placeholder="e.g., CKT-001-NYC"
                disabled={loading}
                className="h-12 text-lg"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Circuit'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Available Demo Circuit IDs:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {mockCircuits.map(circuit => (
                <button
                  key={circuit.circuit_id}
                  onClick={() => setCircuitId(circuit.circuit_id)}
                  className="text-left p-2 rounded hover:bg-white transition-colors border border-transparent hover:border-slate-200"
                >
                  <span className="font-mono text-blue-600">{circuit.circuit_id}</span>
                  <span className="text-slate-600 ml-2">- {circuit.client_name}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
