import { clearNuxtData, navigateTo, useAsyncData, useNuxtApp, useState, useToast } from "#imports"
import { computed } from "vue"
import { authClient } from "~~/auth/auth-client"

//TODO Hackaround due to nuxt auto import issues
interface NuxtAppWithI18n {
  $i18n: {
    t: (key: string, named?: Record<string, any>) => string
  }
}

type SignUpInput = Parameters<typeof authClient.signUp.email>[0]
type SignInInput = Parameters<typeof authClient.signIn.email>[0]

type CheckRoleArgs = Parameters<typeof authClient.organization.checkRolePermission>[0]
type PermissionsInput = CheckRoleArgs["permissions"]

export const useAuth = () => {
  const toast = useToast()
  const getT = () => (useNuxtApp() as unknown as NuxtAppWithI18n).$i18n.t
  const isLoading = useState("auth-loading", () => false)

  //region Data
  // Data - Session
  const {
    data: session,
    status,
    refresh,
    error
  } = useAsyncData(
    "auth-session",
    async () => {
      // We use getSession() instead of useSession() here because useSession is a reactive hook
      // and shouldn't be called inside useAsyncData. getSession returns a Promise.
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Client auth timeout")), 8000)
      )

      try {
        const response = await Promise.race([authClient.getSession(), timeoutPromise])
        return response?.data?.user ? response.data : null
      } catch (e) {
        console.error("Client auth session fetch failed:", e)
        return null
      }
    },
    {
      server: false,
      immediate: true
    }
  )

  // Data - User
  const user = computed(() => session.value?.user)

  const permissions = {
    admin: {
      canAccess: computed(() => checkPermission({ admin: ["access"] }))
    },
    blog: {
      canCreate: computed(() => checkPermission({ blogPost: ["create"] })),
      canEdit: computed(() => checkPermission({ blogPost: ["edit"] })),
      canPublish: computed(() => checkPermission({ blogPost: ["publish"] })),
      canDelete: computed(() => checkPermission({ blogPost: ["delete"] }))
    },
    team: {
      canCreate: computed(() => checkPermission({ team: ["create"] })),
      canUpdate: computed(() => checkPermission({ team: ["update"] })),
      canDelete: computed(() => checkPermission({ team: ["delete"] }))
    },
    org: {
      canCreate: computed(() => checkPermission({ organization: ["create"] })),
      canUpdate: computed(() => checkPermission({ organization: ["update"] })),
      canDelete: computed(() => checkPermission({ organization: ["delete"] }))
    }
  }
  //endregion

  //region Actions
  //region Sign Up
  const signUp = async (input: SignUpInput) => {
    const t = getT()
    isLoading.value = true
    try {
      const { error } = await authClient.signUp.email(input)

      if (error) {
        console.error("Signup error:", error)
        toast.add({
          color: "error",
          title: t("auth_sign_up_failed_title"),
          description: error.message
        })
        return
      }

      toast.add({
        color: "success",
        title: t("auth_account_creation_success_title"),
        description: t("auth_account_creation_success_description")
      })

      await refresh()
      const redirect = useRoute().query.redirect as string
      await navigateTo(redirect || "/")
    } catch (err) {
      console.error("Network error during signup:", err)
      toast.add({
        color: "error",
        title: t("auth_connection_error_title"),
        description: t("auth_connection_error_description")
      })
    } finally {
      isLoading.value = false
    }
  }
  //endregion

  //region Sign In
  const signIn = async (credentials: SignInInput) => {
    const t = getT()
    isLoading.value = true

    try {
      const { data, error } = await authClient.signIn.email(credentials)

      // Failure
      if (error) {
        console.error("[Sign In Error]:", error)
        toast.add({
          color: "error",
          title: t("auth_sign_in_failed_title"),
          description: error.message
        })
        return
      }

      // Success
      toast.add({
        color: "success",
        title: t("auth_sign_in_success_title"),
        description: t("auth_sign_in_success_description", { name: data.user.name })
      })

      await refresh()
      const redirect = useRoute().query.redirect as string
      await navigateTo(redirect || "/")
    } catch {
      toast.add({
        color: "error",
        title: t("auth_connection_error_title"),
        description: t("auth_connection_error_description")
      })
    } finally {
      isLoading.value = false
    }
  }
  //endregion

  //region Sign Out
  const signOut = async () => {
    const t = getT()
    isLoading.value = true

    try {
      const { error } = await authClient.signOut()

      // Failure
      if (error) {
        console.error("[Sign Out API Error]:", error)
        toast.add({
          color: "error",
          title: t("auth_sign-out_error"),
          description: "The server rejected the sign-out request."
        })
        return
      }

      // Success
      toast.add({
        color: "success",
        title: "Sign Out Successful",
        description: "You have been signed out."
      })

      clearNuxtData("auth-session")
      await navigateTo("/")
    } catch (err) {
      console.error("Sign Out Error:", err)
      toast.add({
        color: "error",
        title: "Network Error",
        description: "A connection issue occurred while signing out."
      })
    } finally {
      isLoading.value = false
    }
  }
  //endregion

  //region Check Permissions
  const checkPermission = (permissions: PermissionsInput) => {
    const userRole = session.value?.user?.role

    if (!userRole) return false

    const args = {
      permissions,
      role: userRole
    } as CheckRoleArgs

    return authClient.organization.checkRolePermission(args)
  }
  //endregion
  //endregion

  return {
    // Data
    session,
    user,
    permissions,

    // State
    status,
    isLoading,
    error,

    // Actions
    signUp,
    signIn,
    signOut,
    refresh,
    checkPermission
  }
}
