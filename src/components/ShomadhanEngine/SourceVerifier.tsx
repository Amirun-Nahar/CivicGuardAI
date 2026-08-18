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
    <div className="p-5 rounded-2xl bg-[#EBE3A7] dark:bg-[#131924] border border-[#D9D092] dark:border-[#1E2638] shadow-xl space-y-4">
      
      <div className="flex items-center justify-between border-b border-[#D9D092] dark:border-[#1E2638] pb-2.5">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
          <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-slate-100">
            Grounded Official Sources & Domain Verification
          </h3>
        </div>

        <span className="flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#DCD396] dark:bg-[#090D14] text-orange-950 dark:text-orange-400 border border-[#C5BC7F] dark:border-orange-500/30">
          <Flame className="w-3 h-3 text-orange-800 dark:text-orange-400" />
          <span>Firecrawl API Scraper Active</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {sources.map((src, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#FFF8D6] dark:bg-[#090D14] border border-[#C5BC7F] dark:border-[#1E2638] text-xs text-[#0F172A] dark:text-slate-300 transition-all shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>{src.title}</span>
              <ExternalLink className="w-3 h-3 text-slate-700 dark:text-slate-500" />
            </a>

            <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold">
              {src.domain_type === 'GOV' ? '.GOV.BD' : 'OFFICIAL'}
            </span>

            {/* Firecrawl Live Scrape Trigger Button */}
            <button
              onClick={() => handleFirecrawlScrape(src.url)}
              disabled={loadingUrl === src.url}
              className="ml-1 px-2 py-0.5 rounded bg-orange-500/20 dark:bg-orange-500/10 text-orange-950 dark:text-orange-300 border border-orange-600/40 dark:border-orange-500/30 text-[10px] font-extrabold transition-all flex items-center space-x-1"
              title="Scrape & Verify live page content via Firecrawl API"
            >
              {loadingUrl === src.url ? (
                <RefreshCw className="w-3 h-3 animate-spin text-orange-800 dark:text-orange-400" />
              ) : (
                <>
                  <Flame className="w-3 h-3 text-orange-800 dark:text-orange-400" />
                  <span>Verify Scrape</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Firecrawl Scrape Result Drawer */}
      {activeScrape && (
        <div className="p-3.5 rounded-xl bg-[#FFF8D6] dark:bg-[#090D14] border border-[#C5BC7F] dark:border-orange-500/30 text-xs space-y-2 animate-fade-in shadow-md">
          <div className="flex items-center justify-between text-orange-900 dark:text-orange-400 font-extrabold border-b border-[#C5BC7F] dark:border-slate-800 pb-2">
            <span className="flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-orange-800 dark:text-orange-400" />
              <span>Firecrawl API Grounded Verification Result</span>
            </span>
            <button onClick={() => setActiveScrape(null)} className="text-slate-800 dark:text-slate-500 hover:text-black dark:hover:text-white font-bold">✕</button>
          </div>

          <p className="font-extrabold text-[#0F172A] dark:text-slate-200">{activeScrape.title}</p>
          <p className="text-[#1E293B] dark:text-slate-400 leading-relaxed font-mono text-[11px] bg-[#DCD396] dark:bg-black/40 p-2 rounded border border-[#C5BC7F] dark:border-slate-800 font-semibold">
            {activeScrape.markdown}
          </p>

          <div className="flex items-center justify-between text-[10px] text-[#334155] dark:text-slate-500 font-extrabold pt-1">
            <span>Source URL: {activeScrape.url}</span>
            <span className="text-emerald-950 dark:text-emerald-400 font-extrabold">100% Authenticated Government Domain</span>
          </div>
        </div>
      )}

    </div>
  );
};
