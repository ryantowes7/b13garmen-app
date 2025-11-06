import './globals.css'

export const metadata = {
  title: 'B13 Garment - Sistem Manajemen Internal',
  description: 'Sistem manajemen orderan, katalog, dan keuangan B13 Garment Factory',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  )
}