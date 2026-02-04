"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    return profile
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const fullName = formData.get("fullName") as string
    const role = formData.get("role") as string

    const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, role })
        .eq("id", user.id)

    if (error) {
        throw new Error("Failed to update profile")
    }

    revalidatePath("/dashboard/profile")
}

export async function getSavedProperties() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from("saved_properties")
        .select("*, property:properties(*)")
        .eq("user_id", user.id)

    return data || []
}

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (profile?.role !== "admin") {
        redirect("/dashboard")
    }

    return user
}

export async function verifyUser(formData: FormData) {
    const supabase = await createClient()
    const adminUser = await requireAdmin(supabase)

    const userId = formData.get("userId") as string | null
    if (!userId) return
    if (userId === adminUser.id) return

    const { error } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", userId)

    if (error) {
        throw new Error("Failed to verify user")
    }

    revalidatePath("/dashboard/admin/users")
}

export async function blockUser(formData: FormData) {
    const supabase = await createClient()
    const adminUser = await requireAdmin(supabase)

    const userId = formData.get("userId") as string | null
    if (!userId) return
    if (userId === adminUser.id) return

    const { error } = await supabase
        .from("profiles")
        .update({ is_verified: false })
        .eq("id", userId)

    if (error) {
        throw new Error("Failed to update user")
    }

    revalidatePath("/dashboard/admin/users")
}

export async function getBookings() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from("bookings")
        .select("*, property:properties(id, address_details)")
        .eq("user_id", user.id)
        .order("booking_date", { ascending: false })

    return data || []
}

// --- AGENT ACTIONS ---

export async function getAgentProperties() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })

    return data || []
}

export async function getLeads() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from("leads")
        .select("*, property:properties(id, address_details)")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false })

    return data || []
}

export async function getAnalytics() {
    // Placeholder for actual analytics aggregation
    return {
        totalViews: 1250,
        totalLeads: 45,
        listingPerformance: []
    }
}

// --- BUILDER ACTIONS ---

export async function getProjects() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("builder_id", user.id)
        .order("created_at", { ascending: false })

    return data || []
}

export async function getTeamMembers() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("builder_id", user.id)
        .order("created_at", { ascending: false })

    return data || []
}


// --- ADMIN ACTIONS ---

export async function getAllUsers() {
    const supabase = await createClient()
    // Check if admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single()
    if (profile?.role !== 'admin') return []

    const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

    return data || []
}

export async function getPendingProperties() {
    const supabase = await createClient()
    // Check if admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single()
    if (profile?.role !== 'admin') return []

    const { data } = await supabase
        .from("properties")
        .select("*, owner:profiles(full_name, email)")
        .eq("status", "draft") // Assuming draft = pending review for now, or add specific 'pending_approval' status
        .order("created_at", { ascending: false })

    return data || []
}

// --- SALES CRM ACTIONS ---

export async function getInternalLeads() {
    const supabase = await createClient()
    // Check if admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single()
    if (profile?.role !== 'admin') return []

    const { data } = await supabase
        .from("internal_leads")
        .select("*")
        .order("created_at", { ascending: false })

    return data || []
}
