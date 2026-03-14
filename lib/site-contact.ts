const SITE_CONTACT_ID = "00000000-0000-0000-0000-000000000001";

export interface SiteContact {
  address_line1: string;
  address_line2: string;
  address_line3: string;
  phone: string;
  email: string;
  instagram: string;
  tiktok: string;
}

const DEFAULTS: SiteContact = {
  address_line1: "123 Cloud Street",
  address_line2: "Sky District",
  address_line3: "Your City",
  phone: "+1 234 567 890",
  email: "hello@cloud9.cafe",
  instagram: "https://instagram.com/cloud9",
  tiktok: "https://tiktok.com/@cloud9",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSiteContact(client: any): Promise<SiteContact> {
  try {
    const { data } = await client.from("site_contact").select().eq("id", SITE_CONTACT_ID).single();
    if (!data) return { ...DEFAULTS };
    return {
    address_line1: data.address_line1 ?? DEFAULTS.address_line1,
    address_line2: data.address_line2 ?? DEFAULTS.address_line2,
    address_line3: data.address_line3 ?? DEFAULTS.address_line3,
    phone: data.phone ?? DEFAULTS.phone,
    email: data.email ?? DEFAULTS.email,
    instagram: data.instagram ?? DEFAULTS.instagram,
    tiktok: data.tiktok ?? DEFAULTS.tiktok,
  };
  } catch {
    return { ...DEFAULTS };
  }
}

export { SITE_CONTACT_ID, DEFAULTS };
