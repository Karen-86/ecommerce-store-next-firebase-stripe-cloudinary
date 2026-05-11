import { useEffect } from "react"
import { alert, errorAlert, warningAlert } from "@/lib/utils/alert"

export const useSignOutAlerts = () => {

  useEffect(() => {
    if (typeof window === "undefined") return
    
    const stored = sessionStorage.getItem("signOutDetails")
    if (!stored) return

    sessionStorage.removeItem("signOutDetails")

    try {
      const details = JSON.parse(stored)

      if (Array.isArray(details) && details.length) {
        setTimeout(() => {
          details.forEach((item: any) => {
            if (item.status === "success") {
              alert(item.message)
            } else {
              errorAlert(item.message)
            }
          })
        }, 100)
      }

      // 🔥 prevent repeat alerts
      sessionStorage.removeItem("signOutDetails")
    } catch (err) {
      console.error("Invalid signOutDetails format", err)
    }
  }, [])
}
