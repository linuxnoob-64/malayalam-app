export const ADDRESS_AS_KEY = "malayalam-app-address-as";

export function loadAddressAs() {
  if (typeof window === "undefined") return "mone";
  try {
    const v = localStorage.getItem(ADDRESS_AS_KEY);
    if (v === "mone" || v === "mole" || v === "kunje") return v;
  } catch {
    return "mone";
  }
  return "mone";
}

export function saveAddressAs(value) {
  try {
    localStorage.setItem(ADDRESS_AS_KEY, value);
  } catch {
    return;
  }
}
