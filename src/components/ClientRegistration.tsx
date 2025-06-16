
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { ArrowLeft, Save, UserPlus, CheckCircle, Wifi, MapPin, Settings } from 'lucide-react';
import { Circuit } from '../pages/Index';

interface ClientRegistrationProps {
  onBack: () => void;
  onRegister: (circuit: Circuit) => void;
}

export const ClientRegistration = ({ onBack, onRegister }: ClientRegistrationProps) => {
  const [formData, setFormData] = useState({
    circuit_id: '',
    client_name: '',
    client_ip: '',
    subnet: '',
    dns: '',
    vlan: '',
    bandwidth: '',
    location: '',
    mux_id: '',
    port_id: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'circuit_id':
        if (value.length < 3) return 'Circuit ID must be at least 3 characters';
        break;
      case 'client_name':
        if (value.length < 2) return 'Client name must be at least 2 characters';
        break;
      case 'client_ip':
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(value)) return 'Invalid IP address format';
        break;
      case 'subnet':
        const subnetRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!subnetRegex.test(value)) return 'Invalid subnet mask format';
        break;
      case 'dns':
        const dnsRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!dnsRegex.test(value)) return 'Invalid DNS server format';
        break;
      case 'vlan':
        const vlanNum = parseInt(value);
        if (isNaN(vlanNum) || vlanNum < 1 || vlanNum > 4094) {
          return 'VLAN must be between 1-4094';
        }
        break;
      case 'bandwidth':
        if (!value.match(/^\d+\s*(Mbps|Gbps|Kbps)$/i)) {
          return 'Bandwidth must include unit (e.g., 100 Mbps, 1 Gbps)';
        }
        break;
      case 'location':
        if (value.length < 3) return 'Location must be at least 3 characters';
        break;
      case 'mux_id':
        if (value.length < 3) return 'MUX ID must be at least 3 characters';
        break;
      case 'port_id':
        if (value.length < 3) return 'Port ID must be at least 3 characters';
        break;
    }
    return '';
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    Object.entries(formData).forEach(([field, value]) => {
      if (!value.trim()) {
        newErrors[field] = `${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
        return;
      }
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCircuit: Circuit = {
        ...formData,
        last_updated: new Date().toLocaleString()
      };
      
      onRegister(newCircuit);
      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        setSuccess(false);
        onBack();
      }, 2000);
    }, 1000);
  };

  const renderField = (
    label: string,
    field: string,
    icon?: React.ReactNode,
    placeholder?: string
  ) => {
    const value = formData[field as keyof typeof formData];
    const error = errors[field];
    
    return (
      <div className="space-y-2">
        <Label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
          {icon}
          <span>{label}</span>
        </Label>
        <Input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          placeholder={placeholder}
          className={`h-10 ${error ? 'border-red-500' : ''}`}
        />
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Client registered successfully! Redirecting to search...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Search</span>
        </Button>
        
        <Badge variant="secondary" className="px-3 py-1">
          New Registration
        </Badge>
      </div>

      <div className="text-center mb-8">
        <div className="bg-green-600 p-3 rounded-full inline-block mb-4">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Register New Client</h2>
        <p className="text-slate-600">Enter circuit details to register a new client connection</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span>Circuit Information</span>
              </CardTitle>
              <CardDescription>Basic circuit and client details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderField('Circuit ID', 'circuit_id', <span className="w-4 h-4 bg-blue-100 rounded text-xs flex items-center justify-center">ID</span>, 'e.g., CKT-001-NYC')}
              {renderField('Client Name', 'client_name', <span className="w-4 h-4 bg-blue-100 rounded text-xs flex items-center justify-center">C</span>, 'e.g., TechCorp Solutions')}
              {renderField('VLAN ID', 'vlan', <span className="w-4 h-4 bg-purple-100 rounded text-xs flex items-center justify-center">V</span>, 'e.g., 100')}
              {renderField('Bandwidth', 'bandwidth', <Wifi className="h-4 w-4 text-green-600" />, 'e.g., 1 Gbps')}
              {renderField('Location', 'location', <MapPin className="h-4 w-4 text-red-600" />, 'e.g., New York Data Center')}
            </CardContent>
          </Card>

          {/* Network Configuration */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wifi className="h-5 w-5 text-green-600" />
                <span>Network Configuration</span>
              </CardTitle>
              <CardDescription>IP and DNS settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderField('Client IP Address', 'client_ip', <span className="w-4 h-4 bg-blue-100 rounded text-xs flex items-center justify-center">IP</span>, 'e.g., 192.168.1.100')}
              {renderField('Subnet Mask', 'subnet', <span className="w-4 h-4 bg-orange-100 rounded text-xs flex items-center justify-center">S</span>, 'e.g., 255.255.255.0')}
              {renderField('DNS Server', 'dns', <span className="w-4 h-4 bg-green-100 rounded text-xs flex items-center justify-center">D</span>, 'e.g., 8.8.8.8')}
            </CardContent>
          </Card>
        </div>

        {/* Hardware Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <span>Hardware Configuration</span>
            </CardTitle>
            <CardDescription>Physical network equipment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('MUX ID', 'mux_id', <span className="w-4 h-4 bg-indigo-100 rounded text-xs flex items-center justify-center">M</span>, 'e.g., MUX-NYC-01')}
              {renderField('Port ID', 'port_id', <span className="w-4 h-4 bg-pink-100 rounded text-xs flex items-center justify-center">P</span>, 'e.g., Port-24')}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? 'Registering...' : 'Register Client'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
