import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/SupabaseClient";

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);        
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();               
  const location = useLocation();                

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

   
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);

        
        if (!session?.user && location.pathname !== "/auth") {
          navigate("/auth");
        }
      }
    );

   
    return () => {
      listener.subscription?.unsubscribe();
    };
  }, [location.pathname, navigate]);

  
  if (loading) return <div>Loading...</div>;

 
  if (!user && location.pathname !== "/auth") {
    navigate("/auth");
    return null;
  }


  if (user && location.pathname === "/auth") {
    navigate("/");
    return null;
  }

  return <>{children}</>;
};

export default AuthGate;
