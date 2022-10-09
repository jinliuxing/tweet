export function username(email: string | undefined) {
  return email?.split("@")[0]
}
