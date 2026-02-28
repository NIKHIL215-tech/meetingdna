'use client';

import React from 'react';
import Link from 'next/link';
import LandingHero from '@/components/LandingHero';
import FeatureShowcase from '@/components/FeatureShowcase';
import BackgroundEffects from '@/components/BackgroundEffects';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base overflow-x-hidden relative">
      <BackgroundEffects />
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-md bg-bg-base/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20">
              MD
            </div>
            <span className="text-lg font-bold tracking-tight text-white">MeetingDNA</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/dashboard" className="px-6 py-2.5 bg-white text-black rounded-xl hover:bg-teal-400 transition-all font-bold">
              Enter Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <LandingHero />
        <FeatureShowcase />

        {/* Integration Teaser */}
        <section className="py-24 px-8 border-t border-white/5 bg-gradient-to-b from-transparent to-teal-500/5">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-12">Universal Engineering Telemetry</h2>
            <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
              <div className="text-2xl font-black text-white">GitHub</div>
              <div className="text-2xl font-black text-white">Jira</div>
              <div className="text-2xl font-black text-white">Slack</div>
              <div className="text-2xl font-black text-white">Google</div>
              <div className="text-2xl font-black text-white">Atlassian</div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-[11px] font-bold text-teal-400 uppercase tracking-widest mb-4">Pricing</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white">Scale Performance.</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PriceCard
                tier="Starter"
                price="$0"
                features={['Up to 5 Users', 'Basic Pulse', '7-day History']}
              />
              <PriceCard
                tier="Pro"
                price="$49"
                featured
                features={['Unlimited Users', 'Predictive Analytics', 'Jira/GitHub RAG', 'Strategic Coaching']}
              />
              <PriceCard
                tier="Enterprise"
                price="Custom"
                features={['SSO/SAML', 'Immutable Audit Logs', 'Custom SLAs', 'On-prem Option']}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8 bg-gradient-to-b from-transparent to-teal-500/5">
          <div className="max-w-4xl mx-auto glass-card rounded-[3rem] p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500/10 to-blue-600/10 pointer-events-none"></div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10 leading-tight">Ready to Decode Your Team?</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
              Join elite engineering organizations using autonomous intelligence to maximize flow and velocity.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
              <Link href="/dashboard" className="w-full md:w-auto px-10 py-5 bg-teal-500 text-white font-bold rounded-2xl uppercase tracking-widest shadow-xl shadow-teal-500/30 hover:scale-105 transition-transform">
                Get Started Free
              </Link>
              <button className="w-full md:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl uppercase tracking-widest hover:bg-white/10 transition-all font-bold">
                Schedule Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <p>&copy; 2026 MeetingDNA. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PriceCard({ tier, price, features, featured }: { tier: string, price: string, features: string[], featured?: boolean }) {
  return (
    <div className={`glass-card rounded-[2.5rem] p-10 flex flex-col ${featured ? 'border-teal-500/50 bg-teal-500/5 shadow-2xl shadow-teal-500/10 md:scale-105 relative z-10' : ''}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-teal-500 text-white text-[9px] font-bold rounded-full uppercase tracking-widest">Most Popular</div>
      )}
      <h4 className="text-xl font-bold text-white mb-2">{tier}</h4>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-black text-white tracking-tighter">{price}</span>
        {price !== 'Custom' && <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/mo</span>}
      </div>
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-slate-400 font-medium">
            <span className="text-teal-400 font-bold">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link href="/dashboard" className={`w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center transition-all ${featured ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20 hover:bg-teal-400' : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'}`}>
        {tier === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
      </Link>
    </div>
  );
}
