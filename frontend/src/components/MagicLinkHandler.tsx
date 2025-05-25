/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

const MagicLinkHandler: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { verifyMagicLink, setMessage } = useAuthStore();

  useEffect(() => {
    const verify = async () => {
      try {
        if (token) {
          await verifyMagicLink(token);
          navigate("/");
        }
      } catch (error: any) {
        console.error("Magic link verification failed:", error);
        setMessage("Invalid or expired magic link");
        navigate("/");
      }
    };
    verify();
  }, [token, navigate, verifyMagicLink, setMessage]);

  return <div>Verifying magic link...</div>;
};

export default MagicLinkHandler;