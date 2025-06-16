
import { User } from '../pages/Index';
import { Button } from './ui/button';
import { LogOut, Wifi } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wifi className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Circuit Management Portal</h1>
              <p className="text-sm text-slate-600">Network Operations Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-slate-900">{user.username}</p>
              <p className="text-sm text-slate-600 capitalize">{user.role}</p>
            </div>
            
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
