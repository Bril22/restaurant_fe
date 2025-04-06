'use client'
import { ProtectedRouter } from "./protected-router";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <ProtectedRouter>
        {children}
      </ProtectedRouter>
    );
  };