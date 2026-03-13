import { MoodManageClient } from "./MoodManageClient";
import { createClient } from "@/lib/supabase/server";
import { getWeekKey } from "@/lib/utils";

export default async function AdminMoodPage() {
  const weekKey = getWeekKey();
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let message = "";
  if (serviceKey) {
    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(adminUrl, serviceKey);
    const { data } = await admin.from("cloud9_moods").select("message").eq("week_key", weekKey).single();
    message = data?.message ?? "";
  }
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Cloud9 mood</h1>
      <p className="mt-1 text-stone-600">Edit the weekly mood message shown on the homepage.</p>
      <MoodManageClient weekKey={weekKey} initialMessage={message} />
    </div>
  );
}
