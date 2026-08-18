import React from 'react';
import { OfficialLocation, AppLanguage } from '../../types';
import { MapPin, Clock, Navigation, Building } from 'lucide-react';

interface LocationMapProps {
  locations?: OfficialLocation[];
  language: AppLanguage;
}

export const LocationMap: React.FC<LocationMapProps> = ({ locations, language }) => {
  if (!locations || locations.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-[#131924] dark:bg-[#131924] light:bg-[#EBE3A7] border border-[#1E2638] light:border-[#D9D092] shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#1E2638] light:border-[#D9D092] pb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-cyan-400 light:text-cyan-800" />
          <h3 className="font-extrabold text-base text-slate-100 dark:text-slate-100 light:text-[#0F172A]">
            Official Physical Service Locations & Mapping
          </h3>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-400 light:text-[#334155] font-extrabold">Verified Government Facilities</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#090D14]/80 dark:bg-[#090D14]/80 light:bg-[#FFF8D6] border border-[#1E2638] light:border-[#C5BC7F] space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-slate-100 dark:text-slate-100 light:text-[#0F172A] flex items-center space-x-1.5">
                  <Building className="w-4 h-4 text-emerald-400 light:text-emerald-800" />
                  <span>{language === 'bn' ? loc.name_bn : loc.name_en}</span>
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-[#1E293B] font-semibold">
                  {language === 'bn' ? loc.address_bn : loc.address_en}
                </p>
              </div>

              {loc.map_url && (
                <a
                  href={loc.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-cyan-500/20 text-cyan-400 dark:text-cyan-400 light:text-cyan-900 hover:bg-cyan-500/20 border border-cyan-500/30 light:border-cyan-600/40 transition-colors shadow-sm"
                  title="Open in Google Maps"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="flex items-center space-x-4 text-xs text-slate-400 dark:text-slate-400 light:text-[#334155] font-bold pt-1 border-t border-slate-800 light:border-[#C5BC7F]">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-400 light:text-amber-800" />
                <span>{loc.hours}</span>
              </span>
              <span className="text-emerald-400 light:text-[#047857] font-extrabold">• Open Now</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
