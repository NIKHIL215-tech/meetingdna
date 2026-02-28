'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import OrgSwitcher from '@/components/OrgSwitcher';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-bg-base text-slate-100 selection:bg-brand-primary/30 antialiased font-sans">
        <div className="flex min-h-screen">
          {/* Enhanced Sidebar - Hidden on Landing Page */}
          {!isLandingPage && (
            <aside className="w-72 border-r border-border-subtle bg-bg-surface/50 backdrop-blur-2xl p-8 flex flex-col gap-10 sticky top-0 h-screen">
              <div className="flex items-center gap-4 group cursor-pointer">
                <Link href="/" className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                    MD
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-gradient">
                      MeetingDNA
                    </h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Engineering Intel</p>
                  </div>
                </Link>
              </div>

              <div className="space-y-6">
                <OrgSwitcher />

                <nav className="flex flex-col gap-1">
                  <SidebarLink href="/dashboard" label="Dashboard" />
                  <SidebarLink href="/meetings" label="Meeting Analysis" />
                  <SidebarLink href="/people" label="Team Performance" />
                  <SidebarLink href="/predictive" label="Predictive Intel" />
                  <div className="pt-4 border-t border-white/5 mt-4">
                    <SidebarLink href="/settings/integrations" label="Integrations" />
                    <SidebarLink href="/admin/governance" label="Governance" />
                  </div>
                </nav>
              </div>

              <div className="mt-auto relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative p-5 rounded-2xl bg-bg-surface border border-border-subtle">
                  <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mb-2">System Status</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
                    <span className="text-xs text-slate-300 font-medium">Real-time sync active</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Intelligence layer calibrated to organizational pulse.</p>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={`flex-1 overflow-y-auto ${!isLandingPage ? 'p-10 lg:p-16 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent' : ''}`}>
            <div className={!isLandingPage ? 'max-w-7xl mx-auto' : ''}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-white/5 text-white' : 'hover:bg-white/[0.03] text-slate-400 hover:text-white'}`}
    >
      <span className="text-sm font-medium tracking-wide">{label}</span>
      <span className={`text-xs transition-all ${isActive ? 'opacity-100 translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`}>→</span>
    </Link>
  );
}
