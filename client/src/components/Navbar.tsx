import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Shield } from "lucide-react";
import { Link } from "wouter";

export function Navbar() {
  const { user, logout, isLoggingOut } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="p-2 bg-white/10 rounded-lg">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none">وەزارەتی پێشمەرگە</h1>
                <p className="text-xs text-primary-foreground/70 mt-1 font-normal">سیستەمی پرسیار و وەڵام</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-sm font-medium">{user.fullName}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/20">
                {user.role === 'admin' ? 'بەڕێوەبەر' : 'ئەفسەر'} - {user.militaryId}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => logout()} 
              disabled={isLoggingOut}
              className="text-primary-foreground hover:bg-white/10 hover:text-white"
              title="چوونە دەرەوە"
            >
              <LogOut className="w-5 h-5 rtl-flip" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
