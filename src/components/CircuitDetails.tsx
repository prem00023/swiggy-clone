
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { ArrowLeft, Edit2, Save, X, CheckCircle, Settings, MapPin, Wifi } from 'lucide-react';
import { Circuit } from '../pages/Index';

interface CircuitDetailsProps {
  circuit: Circuit | null;
  onBack: () => void;
  onUpdate: (circuit: Circuit) => void;
}

export const CircuitDetails = ({ circuit, onBack, onUpdate }: CircuitDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCircuit, setEditedCircuit] = useState<Circuit | null>(circuit);
  const [loading, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!circuit) return null;

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'client_ip':
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(value)) return 'Invalid IP address format';
        const parts = value.split('.');
        if (parts.some(part => parseInt(part) > 255)) return 'IP address octets must be 0-255';
        break;
      case 'subnet':
        const subnetRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!subnetRegex.test(value)) return 'Invalid subnet mask format';
        const subnetParts = value.split('.');
        if (subnetParts.some(part => parseInt(part) > 255)) return 'Subnet mask octets must be 0-255';
        break;
      case 'dns':
        const dnsRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!dnsRegex.test(value)) return 'Invalid DNS server format';
        const dnsParts = value.split('.');
        if (dnsParts.some(part => parseInt(part) > 255)) return 'DNS server octets must be 0-255';
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
      case 'client_name':
        if (value.length < 2) return 'Client name must be at least 2 characters';
        break;
    }
    return '';
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedCircuit({ ...circuit });
    setErrors({});
    setSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCircuit(circuit);
    setErrors({});
  };

  const handleSave = async () => {
    if (!editedCircuit) return;
    
    const newErrors: Record<string, string> = {};
    
    // Validate all editable fields including network configuration
    const editableFields = ['client_name', 'vlan', 'bandwidth', 'location', 'mux_id', 'port_id', 'client_ip', 'subnet', 'dns'];
    editableFields.forEach(field => {
      const error = validateField(field, editedCircuit[field as keyof Circuit]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedCircuit = {
        ...editedCircuit,
        last_updated: new Date().toLocaleString()
      };
      
      onUpdate(updatedCircuit);
      setIsEditing(false);
      setSuccess(true);
      setSaving(false);
      
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const handleFieldChange = (field: keyof Circuit, value: string) => {
    if (editedCircuit) {
      setEditedCircuit({ ...editedCircuit, [field]: value });
      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors({ ...errors, [field]: '' });
      }
    }
  };

  const renderField = (
    label: string, 
    field: keyof Circuit, 
    icon?: React.ReactNode,
    editable: boolean = true,
    type: string = 'text'
  ) => {
    const value = editedCircuit?.[field] || '';
    const error = errors[field];
    
    return (
      <div className="space-y-2">
        <Label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
          {icon}
          <span>{label}</span>
        </Label>
        {isEditing && editable ? (
          <div>
            <Input
              type={type}
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className={`h-10 ${error ? 'border-red-500' : ''}`}
            />
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
        ) : (
          <div className={`p-3 bg-slate-50 rounded-md font-mono text-sm ${!editable ? 'text-slate-600' : ''}`}>
            {value}
          </div>
        )}
      </div>
    );
  };

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
        
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="px-3 py-1">
            Circuit Active
          </Badge>
          
          {!isEditing ? (
            <Button onClick={handleEdit} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
              <Edit2 className="h-4 w-4" />
              <span>Edit Details</span>
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Circuit details updated successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <span>Circuit Information</span>
            </CardTitle>
            <CardDescription>
              Circuit ID: <span className="font-mono font-semibold">{circuit.circuit_id}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderField('Client Name', 'client_name', <span className="w-4 h-4 bg-blue-100 rounded text-xs flex items-center justify-center">C</span>)}
            {renderField('VLAN ID', 'vlan', <span className="w-4 h-4 bg-purple-100 rounded text-xs flex items-center justify-center">V</span>)}
            {renderField('Bandwidth', 'bandwidth', <Wifi className="h-4 w-4 text-green-600" />)}
            {renderField('Location', 'location', <MapPin className="h-4 w-4 text-red-600" />)}
          </CardContent>
        </Card>

        {/* Network Configuration */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5 text-green-600" />
              <span>Network Configuration</span>
            </CardTitle>
            <CardDescription>
              {isEditing ? 'IP and DNS settings (Editable)' : 'IP and DNS settings'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderField('Client IP Address', 'client_ip', <span className="w-4 h-4 bg-blue-100 rounded text-xs flex items-center justify-center">IP</span>, true)}
            {renderField('Subnet Mask', 'subnet', <span className="w-4 h-4 bg-orange-100 rounded text-xs flex items-center justify-center">S</span>, true)}
            {renderField('DNS Server', 'dns', <span className="w-4 h-4 bg-green-100 rounded text-xs flex items-center justify-center">D</span>, true)}
          </CardContent>
        </Card>

        {/* Hardware Information */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <span>Hardware Configuration</span>
            </CardTitle>
            <CardDescription>Physical network equipment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('MUX ID', 'mux_id', <span className="w-4 h-4 bg-indigo-100 rounded text-xs flex items-center justify-center">M</span>)}
              {renderField('Port ID', 'port_id', <span className="w-4 h-4 bg-pink-100 rounded text-xs flex items-center justify-center">P</span>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <p className="text-sm text-slate-600">
          <strong>Last Updated:</strong> {circuit.last_updated}
        </p>
      </div>
    </div>
  );
};
