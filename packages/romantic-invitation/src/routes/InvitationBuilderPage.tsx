import { TopNav } from '../components/TopNav'
import { WizardPage } from '../components/WizardPage'
import { useInvitation } from '../hooks/useInvitation'

export function InvitationBuilderPage() {
  const { data, updateField, toggleFood, shareUrl } = useInvitation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white">
      <TopNav />
      <main className="px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <WizardPage
            data={data}
            updateField={updateField}
            toggleFood={toggleFood}
            shareUrl={shareUrl}
          />
        </div>
      </main>
    </div>
  )
}
