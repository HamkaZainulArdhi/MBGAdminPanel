"use client";

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

// ---------------------------------------------------------------------------
// withAuth HOC
// Wraps any Client Component and redirects to /login if not authenticated.
// ---------------------------------------------------------------------------

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  function ProtectedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }
    }, [user, loading, router]);

    // While auth state is resolving, show a centered loading indicator
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <span className="text-gray-500 text-sm">Memuaaawwwat...</span>
        </div>
      );
    }

    // Not authenticated → render nothing (redirect is in progress)
    if (!user) return null;

    return <WrappedComponent {...props} />;
  }

  ProtectedComponent.displayName = `withAuth(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"
  })`;

  return ProtectedComponent;
}
