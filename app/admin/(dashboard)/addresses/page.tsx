import { createClient } from "@/lib/supabase/server";
import { getSiteContact } from "@/lib/site-contact";
import { AddressesClient } from "./AddressesClient";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const supabase = await createClient();
  const contact = await getSiteContact(supabase);

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Addresses</h1>
      <p className="mt-1 text-stone-600">
        Edit your address, phone, email, and social links. These appear on the Visit page and in the footer.
      </p>
      <AddressesClient initialContact={contact} />
    </div>
  );
}
