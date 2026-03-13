import { AdminLoginClient } from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <AdminLoginClient />
    </div>
  );
}
