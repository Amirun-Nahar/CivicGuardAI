import React, { useState } from 'react';
import { ShomadhanOutput, AppLanguage } from '../../types';
import { CheckSquare, Square, ShieldCheck, Download, Sparkles, Building2 } from 'lucide-react';

interface SolutionTreeProps {
  data: ShomadhanOutput;
  language: AppLanguage;
  onOpenPdfModal: () => void;
}

export const SolutionTree: React.FC<SolutionTreeProps> = ({ data, language, onOpenPdfModal }) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const completedDocsCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocs = data.required_documents.length;
  const progressPercent = totalDocs > 0 ? Math.round((completedDocsCount / totalDocs) * 100) : 0;

  return (
    <div className="space-y-6">

      {/* Clean Overview Card */}
      <div className="p-6 rounded-2xl bg-[#131924] dark:bg-[#131924] light:bg-[#EBE3A7] border border-slate-800/80 light:border-[#D9D092] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 light:border-[#D9D092] pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-[#DCD396] text-emerald-400 dark:text-emerald-400 light:text-[#047857] border border-emerald-500/20 light:border-[#C5BC7F]">
              {data.category.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400 light:text-[#334155] font-bold">Grounded .gov.bd Verification</span>
          </div>

          {data.pdf_template_type && (
            <button
              onClick={onOpenPdfModal}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow"
            >
              <Download className="w-4 h-4" />
              <span>
                {data.pdf_template_type === 'POLICE_GD_LOST_DOC'
                  ? '1-Click Police GD Form PDF'
                  : '1-Click Bank Fraud Claim PDF'}
              </span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-100 dark:text-slate-100 light:text-[#0F172A] leading-snug">
            {language === 'bn' ? data.problem_summary_bn : data.problem_summary_en}
          </h2>

          {language === 'both' && (
            <p className="text-sm text-emerald-400/90 dark:text-emerald-400/90 light:text-[#047857] font-bangla font-semibold border-l-2 border-emerald-500/40 pl-3 py-0.5">
              {data.problem_summary_bn}
            </p>
          )}
        </div>
      </div>

      {/* Clean Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Document Checklist */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#131924] dark:bg-[#131924] light:bg-[#EBE3A7] border border-slate-800/80 light:border-[#D9D092] shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 light:border-[#D9D092] pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 dark:text-slate-100 light:text-[#0F172A] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 light:text-emerald-800" />
                <span>Prerequisite Documents</span>
              </h3>
              <span className="text-xs font-extrabold text-emerald-400 dark:text-emerald-400 light:text-[#047857] bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-[#DCD396] px-2 py-0.5 rounded-full border border-emerald-500/20 light:border-[#C5BC7F]">
                {completedDocsCount}/{totalDocs} Ready
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#090D14] dark:bg-[#090D14] light:bg-[#DCD396] rounded-full h-2 overflow-hidden border border-slate-800 light:border-[#C5BC7F]">
              <div
                className="bg-emerald-500 dark:bg-emerald-500 light:bg-[#047857] h-2 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Items */}
            <div className="space-y-2 pt-1">
              {data.required_documents.map((doc, idx) => {
                const isChecked = Boolean(checkedDocs[idx]);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDoc(idx)}
                    className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-950/20 dark:bg-emerald-950/20 light:bg-[#DCECC7] border-emerald-500/40 text-emerald-300 dark:text-emerald-300 light:text-[#047857]'
                        : 'bg-[#090D14]/50 dark:bg-[#090D14]/50 light:bg-[#FFF8D6] border-slate-800/80 light:border-[#C5BC7F] text-slate-300 dark:text-slate-300 light:text-[#0F172A] hover:border-slate-700'
                    }`}
                  >
                    <button className="mt-0.5 text-emerald-400 light:text-emerald-800 flex-shrink-0">
                      {isChecked ? <CheckSquare className="w-4 h-4 fill-emerald-500 light:fill-emerald-800 text-black dark:text-black light:text-white" /> : <Square className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className={`font-extrabold ${isChecked ? 'line-through text-slate-500 dark:text-slate-500 light:text-slate-600' : 'text-slate-100 dark:text-slate-100 light:text-[#0F172A]'}`}>
                          {language === 'bn' ? doc.item_bn : doc.item_en}
                        </span>
                        {doc.is_mandatory && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/10 dark:bg-amber-500/10 light:bg-amber-500/20 text-amber-400 dark:text-amber-400 light:text-amber-900 border border-amber-500/30">
                            Required
                          </span>
                        )}
                      </div>
                      {language === 'both' && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-[#334155] font-bangla font-semibold">{doc.item_bn}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Sequential Action Steps */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-sm text-slate-100 dark:text-slate-100 light:text-[#0F172A] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400 light:text-cyan-800" />
              <span>Action Steps Roadmap</span>
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-400 light:text-[#334155] font-bold">{data.action_steps.length} Steps</span>
          </div>

          <div className="space-y-3">
            {data.action_steps.map((step) => (
              <div
                key={step.step_number}
                className="p-5 rounded-2xl bg-[#131924] dark:bg-[#131924] light:bg-[#EBE3A7] border border-slate-800/80 light:border-[#D9D092] shadow-md space-y-2 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-[#DCD396] text-emerald-400 dark:text-emerald-400 light:text-[#047857] font-extrabold text-xs flex items-center justify-center border border-emerald-500/30 light:border-[#C5BC7F]">
                      {step.step_number}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-100 dark:text-slate-100 light:text-[#0F172A]">
                      {language === 'bn' ? step.title_bn : step.title_en}
                    </h4>
                  </div>

                  {step.department_en && (
                    <span className="flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-800 dark:bg-slate-800 dark:text-cyan-400 light:bg-[#DCD396] light:text-[#0F172A] border border-slate-700 light:border-[#C5BC7F]">
                      <Building2 className="w-3 h-3 text-cyan-400 light:text-cyan-800" />
                      <span>{language === 'bn' ? step.department_bn || step.department_en : step.department_en}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-[#1E293B] font-semibold leading-relaxed pl-8">
                  {language === 'bn' ? step.details_bn : step.details_en}
                </p>

                {language === 'both' && (
                  <p className="text-xs text-emerald-400/90 dark:text-emerald-400/90 light:text-[#047857] font-bangla font-semibold pl-8 border-t border-slate-800/50 light:border-[#D9D092] pt-2">
                    {step.details_bn}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
