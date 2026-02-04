import ProfileForm from "./profile-form"
import { getUserProfile } from "@/app/actions/dashboard"

export default async function ProfilePage() {
    const profile = await getUserProfile()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Profile Settings</h2>
                <p className="text-muted-foreground">Manage your personal information and preferences.</p>
            </div>

            <ProfileForm profile={profile} />
        </div>
    )
}
