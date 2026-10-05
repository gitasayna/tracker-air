import { useTorenData } from './hooks/useTorenData'
import ActiveFill from './components/ActiveFill'
import StartPanel from './components/StartPanel'
import History from './components/History'
import MemberManager from './components/MemberManager'
import Stats from './components/Stats'
import SetupBanner from './components/SetupBanner'
import { formatDateLong } from './lib/time'
import { IS_TEST_MODE } from './lib/constants'

export default function App() {
  const {
    members,
    history,
    runningSession,
    filledToday,
    loading,
    error,
    usingLocal,
    actions,
  } = useTorenData()

  return (
    <div className="mx-auto min-h-full max-w-xl px-4 pb-16 pt-6">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-2xl shadow-sm">
            💧
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Toren Tracker</h1>
            <p className="text-xs text-slate-500">
              {formatDateLong(new Date().toISOString())}
            </p>
          </div>
        </div>
      </header>

      {IS_TEST_MODE && (
        <div className="mb-4 rounded-xl bg-purple-100 px-4 py-2 text-center text-xs font-semibold text-purple-700">
          🧪 MODE TES: batas alarm dipercepat jadi 20 detik
        </div>
      )}

      {usingLocal && (
        <div className="mb-5">
          <SetupBanner />
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Memuat data…
        </div>
      ) : (
        <main className="space-y-8">
          <section>
            {runningSession ? (
              <ActiveFill session={runningSession} onStop={actions.stopFill} />
            ) : (
              <StartPanel
                members={members}
                filledToday={filledToday}
                onPick={actions.startFill}
              />
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">Riwayat</h2>
            <History history={history} />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-800">Statistik</h2>
            <Stats history={history} />
          </section>

          <section>
            <MemberManager members={members} actions={actions} />
          </section>
        </main>
      )}

      <footer className="mt-10 text-center text-xs text-slate-400">
        Toren Tracker · pencatatan pengisian air rumah
      </footer>
    </div>
  )
}
