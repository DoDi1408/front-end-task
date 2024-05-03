import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logoimage.png";

const Login = () => {
  const navigate = useNavigate();

  const login = () => {
    localStorage.setItem("userId", "22");
    navigate("/manager");
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-white flex flex-col w-3/5 h-2/5 items-center justify-center grid grid-cols-2 rounded-md">
        <div className="text-center	bg-red-400 h-full w-full justify-center flex flex-col rounded-l-md">
          <p className="font-bold text-2xl text-white">Welcome!</p>
          <img src={logo} className="w-72 mt-6 mx-auto" />
        </div>
        <div className="self-center justify-self-center text-center px-8">
          <p className="font-bold text-2xl my-8">Login</p>
          <div className="grid my-8 w-full max-w-sm gap-1.5">
            <Label htmlFor="email" className="mb-1">
              Email
            </Label>
            <Input type="email" id="email" placeholder="Email" />
          </div>
          <Button className="bg-red-500" onClick={login}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
