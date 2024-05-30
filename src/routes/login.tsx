import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logoimage.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [telegramId, setTelegramId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const login = () => {
    if (!isValidEmail(email)) {
      setError("Invalid email, please try again.");
      return;
    }

    if (email === "manager@oracle.com") {
      localStorage.setItem("userId", "22");
      navigate("/manager");
    } else if (email === "employee@oracle.com") {
      localStorage.setItem("userId", "31");
      navigate("/employee");
    } else {
      setError("Invalid, please try again.");
    }
  };

  const handleRegister = () => {
    console.log("Registration Data:", { email, password, telegramId });
  };

  return (
    <div className="flex justify-center items-start h-screen bg-gradient-to-r from-red-50 via-white-50 to-sky-50 pt-[150px]">
      <div className="bg-white flex flex-col w-3/5 h-2/5 items-center justify-center grid grid-cols-2 rounded-md shadow-2xl">
        <div className="text-center bg-red-400 h-full w-full justify-center flex flex-col rounded-l-md">
          <p className="font-bold text-2xl text-white">Welcome!</p>
          <img src={logo} className="w-72 mt-6 mx-auto" />
        </div>
        <div className="self-center justify-self-center text-center px-8">
          {isRegistering ? (
            <>
              <p className="font-bold text-2xl my-8">Register</p>
              <div className="grid my-8 w-full max-w-sm gap-1.5">
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Label htmlFor="password" className="mb-1"></Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Label htmlFor="telegramId" className="mb-1"></Label>
                <Input
                  type="text"
                  id="telegramId"
                  placeholder="Telegram ID"
                  onChange={(e) => setTelegramId(e.target.value)}
                />
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  onClick={handleRegister}
                >
                  Submit
                </Button>
                <Button
                  className="py-2 px-4 rounded border border-red-500 text-red-500 bg-white hover:bg-red-100"
                  onClick={() => setIsRegistering(false)}
                >
                  Go Back
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="font-bold text-2xl my-8">Login</p>
              <div className="grid my-8 w-full max-w-sm gap-1.5">
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(event) => event.key === "Enter" && login()}
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  onClick={login}
                >
                  Login
                </Button>
                <div className="flex flex-col items-center justify-self-end ml-auto">
                  <Button
                    className="py-2 px-4 rounded border border-red-500 text-red-500 bg-white hover:bg-red-100 ml-auto"
                    onClick={() => setIsRegistering(true)}
                  >
                    Register Now
                  </Button>
                  <p className="text-gray-500 mt-2 text-center">
                    Don't have an account?
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
