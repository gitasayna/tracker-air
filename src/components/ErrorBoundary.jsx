import { Component } from 'react'

// Jaring pengaman terakhir: menangkap error render agar app tidak blank putih.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary menangkap error:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <span className="text-5xl" aria-hidden>
            🛠️
          </span>
          <h1 className="mt-4 text-lg font-bold text-slate-800">
            Terjadi kendala saat memuat aplikasi
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Coba muat ulang halaman. Jika masih bermasalah, kemungkinan
            konfigurasi Supabase (URL / key) di hosting belum benar.
          </p>
          <pre className="mt-4 overflow-auto rounded-lg bg-slate-100 p-3 text-left text-xs text-slate-500">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Muat ulang
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
