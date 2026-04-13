export function displayDoctorName(me: any) {
  const d = me?.doctor;

  const first = d?.first_name ?? me?.first_name ?? "";
  const last = d?.last_name ?? me?.last_name ?? "";

  const rawTitle = d?.title;
  const title = rawTitle && rawTitle !== "NONE" ? `${rawTitle} ` : "Dr. ";

  const full = `${first} ${last}`.trim();

  return full ? `${title}${full}` : "—";
}