// import { useState } from 'react';
// import { supabase } from '../SupabaseClient';
// import { toast } from "sonner";

// const AuthForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLogin, setIsLogin] = useState(true);
  

//   const handleAuth = async () => {
    
//     if (!email || !password) {
//       toast.error('Email & Password required');
//       return;
//     }

//     const { error } = isLogin
//       ? await supabase.auth.signInWithPassword({ email, password })
//       : await supabase.auth.signUp({ email, password });

//     if (error) {
//       toast.error(error.message);
//     } else {
//       toast.success(isLogin ? 'Login success!' : 'Signup success! Please check your email.');
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: 'auto' }}>
//       <h2>{isLogin ? 'Login' : 'Signup'}</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         style={{ display: 'block', width: '100%', marginBottom: 10 }}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         style={{ display: 'block', width: '100%', marginBottom: 10 }}
//       />
//       <button onClick={handleAuth}>
//         {isLogin ? 'Login' : 'Signup'}
//       </button>

//       <p style={{ marginTop: 10 }}>
//         {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
//         <button onClick={() => setIsLogin(!isLogin)}>
//           {isLogin ? 'Signup' : 'Login'}
//         </button>
//       </p>

      
//     </div>
//   );
// };

// export default AuthForm;
// import { useState } from "react";
// import { supabase } from "../SupabaseClient";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";

// const AuthForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLogin, setIsLogin] = useState(true);

//   const handleAuth = async () => {
//     if (!email || !password) {
//       toast.error("Email & Password required");
//       return;
//     }

//     const { error } = isLogin
//       ? await supabase.auth.signInWithPassword({ email, password })
//       : await supabase.auth.signUp({ email, password });

//     if (error) {
//       toast.error(error.message);
//     } else {
//       toast.success(isLogin ? "Login success!" : "Signup success! Check your email.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-muted px-4">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-2xl text-center">
//             {isLogin ? "Login" : "Signup"}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//             />
//           </div>

//           <Button className="w-full" onClick={handleAuth}>
//             {isLogin ? "Login" : "Signup"}
//           </Button>

//           <div className="text-center text-sm text-muted-foreground">
//             {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//             <button
//               onClick={() => setIsLogin(!isLogin)}
//               className="text-blue-600 hover:underline ml-1"
//             >
//               {isLogin ? "Signup" : "Login"}
//             </button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AuthForm;
import { useState } from "react";
import { supabase } from "../SupabaseClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    // ✅ Check for empty fields
    if (!email || !password) {
      toast.error("Email & Password required");
      return;
    }

    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    // ✅ Password length check
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // ✅ Supabase Auth
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isLogin ? "Login success!" : "Signup success! Check your email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLogin ? "Login" : "Signup"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button className="w-full" onClick={handleAuth}>
            {isLogin ? "Login" : "Signup"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline ml-1"
            >
              {isLogin ? "Signup" : "Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
