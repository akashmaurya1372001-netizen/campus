import { useEffect, useMemo } from "react";

// Socket.io hook for real-time updates
// Socket.io connection is disabled for Vercel compatibility
// For production deployments on Vercel, use polling or webhooks instead

export const useSocket = () => {
  useEffect(() => {
    // Socket.io initialization would go here
    // Currently disabled for Vercel serverless compatibility
  }, []);

  return useMemo(() => ({
    isConnected: false,
    error: null,
  }), []);
};
