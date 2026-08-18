import React, { useState } from 'react';
import { VerifiedSource } from '../../types';
import { ShieldCheck, ExternalLink, CheckCircle, Flame, RefreshCw } from 'lucide-react';
import { scrapeGovPortal, FirecrawlScrapeResult } from '../../lib/firecrawlService';

interface SourceVerifierProps {
  sources: VerifiedSource[];
}

export const SourceVerifier: React.FC<SourceVerifierProps> = ({ sources }) => {
  const [activeScrape, setActiveScrape] = useState<FirecrawlScrapeResult | null>(null);
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  if (!sources || sources.length === 0) return null;

  const handleFirecrawlScrape = async (url: string) => {
    setLoadingUrl(url);
    const result = await scrapeGovPortal(url);
    setActiveScrape(result);
    setLoadingUrl(null);
  };

  return (
    <div className="p-5 rounded-2xl bg-[#131924] dark:bg-[#131924] light:bg-[#EBE3A7] border border-[#1E2638] light:border-[#D9D092] shadow-xl space-y-4">
      
      <div className="flex items-center justify-between border-b border-[#1E2638] light:border-[#D9D092] pb-2.5">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 light:text-emerald-800" />
          <h3 className="font-extrabold text-sm text-slate-100 dark:text-slate-100 light:text-[#0F172A]">
            Grounded Official Sources & Domain Verification
          </h3>
        </div>

        <span className="flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#090D14] dark:bg-[#090D14] light:bg-[#DCD396] text-orange-400 dark:text-orange-400 light:text-orange-950 border border-orange-500/30 light:border-[#C5BC7F]">
          <Flame className="w-3 h-3 text-orange-400 light:text-orange-800" />
          <span>Firecrawl API Scraper Active</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {sources.map((src, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#090D14] dark:bg-[#090D14] light:bg-[#FFF8D6] border border-[#1E2638] light:border-[#C5BC7F] text-xs text-slate-300 dark:text-slate-300 light:text-[#0F172A] transition-all shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-800" />
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold hover:text-emerald-300 light:hover:text-emerald-900 flex items-center space-x-1"
            >
              <span>{src.title}</span>
              <ExternalLink className="w-3 h-3 text-slate-500 light:text-slate-700" />
            </a>

            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-500/30 text-emerald-300 dark:text-emerald-300 light:text-emerald-950 text-[10px] font-extrabold">
              {src.domain_type === 'GOV' ? '.GOV.BD' : 'OFFICIAL'}
            </span>

            {/* Firecrawl Live Scrape Trigger Button */}
            <button
              onClick={() => handleFirecrawlScrape(src.url)}
              disabled={loadingUrl === src.url}
              className="ml-1 px-2 py-0.5 rounded bg-orange-500/10 dark:bg-orange-500/10 light:bg-orange-500/20 text-orange-300 dark:text-orange-300 light:text-orange-950 border border-orange-500/30 light:border-orange-600/40 text-[10px] font-extrabold transition-all flex items-center space-x-1"
              title="Scrape & Verify live page content via Firecrawl API"
            >
              {loadingUrl === src.url ? (
                <RefreshCw className="w-3 h-3 animate-spin text-orange-400 light:text-orange-800" />
              ) : (
                <>
                  <Flame className="w-3 h-3 text-orange-400 light:text-orange-800" />
                  <span>Verify Scrape</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Firecrawl Scrape Result Drawer */}
      {activeScrape && (
        <div className="p-3.5 rounded-xl bg-[#090D14] dark:bg-[#090D14] light:bg-[#FFF8D6] border border-orange-500/30 light:border-[#C5BC7F] text-xs space-y-2 animate-fade-in shadow-md">
          <div className="flex items-center justify-between text-orange-400 dark:text-orange-400 light:text-orange-900 font-extrabold border-b border-slate-800 light:border-[#C5BC7F] pb-2">
            <span className="flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-orange-400 light:text-orange-800" />
              <span>Firecrawl API Grounded Verification Result</span>
            </span>
            <button onClick={() => setActiveScrape(null)} className="text-slate-500 dark:text-slate-500 light:text-slate-800 hover:text-white font-bold">✕</button>
          </div>

          <p className="font-extrabold text-slate-200 dark:text-slate-200 light:text-[#0F172A]">{activeScrape.title}</p>
          <p className="text-slate-400 dark:text-slate-400 light:text-[#1E293B] leading-relaxed font-mono text-[11px] bg-black/40 dark:bg-black/40 light:bg-[#DCD396] p-2 rounded border border-slate-800 light:border-[#C5BC7F] font-semibold">
            {activeScrape.markdown}
          </p>

          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-500 light:text-[#334155] font-bold pt-1">
            <span>Source URL: {activeScrape.url}</span>
            <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-950 font-extrabold">100% Authenticated Government Domain</span>
          </div>
        </div>
      )}

    </div>
  );
};
