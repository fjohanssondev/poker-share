"use client"

import { useRouter, usePathname } from "next/navigation"

export default function GoBack() {

  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {(pathname !== "/" && pathname !== "/admin") && (
        <button
          onClick={() => router.back()}
        >
          {"<--"} Go back
        </button>
      )}
    </>
  )
}