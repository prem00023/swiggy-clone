
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Wifi, Lock } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      // Demo credentials - in real app this would be backend authentication
      if (username === 'admin' && password === 'admin123') {
        onLogin(username);
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full inline-block mb-4">
            <Wifi className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Circuit Management</h1>
          <p className="text-slate-600 mt-2">Network Operations Portal</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center space-x-2 text-xl">
              <Lock className="h-5 w-5 text-blue-600" />
              <span>Secure Login</span>
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the circuit management system
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={loading}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="h-11"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Login'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 text-center">
                <strong>Demo Credentials:</strong><br />
                Username: admin<br />
                Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
