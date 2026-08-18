import React from 'react';
import { CreditCard, FileCheck, GraduationCap, ShieldAlert, Award, FileText, ArrowRight } from 'lucide-react';
import { AppLanguage } from '../../types';

interface DocumentDirectoryProps {
  onSelectCategory: (categoryKey: string) => void;
  activeCategoryKey?: string;
  language: AppLanguage;
}

export const DocumentDirectory: React.FC<DocumentDirectoryProps> = ({
  onSelectCategory,
  activeCategoryKey = 'lost_nid',
  language,
}) => {
  const documentCategories = [
    {
      key: 'lost_nid',
      icon: <CreditCard className="w-5 h-5 text-emerald-400 light:text-emerald-700" />,
      titleEn: 'Smart National ID (NID) Card',
      titleBn: 'স্মার্ট এনআইডি (জাতীয় পরিচয়পত্র)',
      badge: 'Form 102 Police GD',
      feeEn: 'BDT 345 (Re-issue)',
      feeBn: '৩৪৫ টাকা (রি-ইস্যু ফি)',
      descEn: 'Lost NID re-issue, address correction, Smart Card distribution status & GD auto-fill.',
      descBn: 'এনআইডি হারানো, তথ্য সংশোধন, স্মার্ট কার্ড স্থিতি এবং ১-ক্লিক জিডি ফরম ডাউনলোড।',
      portalUrl: 'https://services.nidw.gov.bd',
    },
    {
      key: 'passport_renewal',
      icon: <FileCheck className="w-5 h-5 text-cyan-400 light:text-cyan-700" />,
      titleEn: 'e-Passport & Renewal',
      titleBn: 'ই-পাসপোর্ট ও নবায়ন সেবা',
      badge: 'DIP Bangladesh',
      feeEn: 'BDT 4,025 - 10,350',
      feeBn: '৪,০২৫ - ১০,৩৫০ টাকা',
      descEn: 'New e-Passport application, passport renewal, lost passport Police GD & fee calculator.',
      descBn: 'নতুন ই-পাসপোর্ট আবেদন, নবায়ন, হারানো পাসপোর্ট জিডি কপি এবং ফি চালানের তথ্য।',
      portalUrl: 'https://epassport.gov.bd',
    },
    {
      key: 'university_id',
      icon: <GraduationCap className="w-5 h-5 text-amber-400 light:text-amber-700" />,
      titleEn: 'University & Student ID Card',
      titleBn: 'বিশ্ববিদ্যালয় ও স্টুডেন্ট আইডি',
      badge: 'Academic Clearance',
      feeEn: 'BDT 200 - 500',
      feeBn: '২০০ - ৫০০ টাকা',
      descEn: 'Lost Student ID duplicate card application, university clearance, lost certificate GD.',
      descBn: 'হারানো স্টুডেন্ট আইডি রি-ইস্যু, ভার্সিটি ক্লিয়ারেন্স ও মূল সনদ হারানোর পুলিশ জিডি।',
      portalUrl: 'https://shed.gov.bd',
    },
    {
      key: 'bank_dispute',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400 light:text-rose-700" />,
      titleEn: 'Bank ATM / Credit Card & Fraud',
      titleBn: 'ব্যাংক কার্ড ও জালিয়াতি অভিযোগ',
      badge: 'Dispute Letter',
      feeEn: 'Free Emergency Block',
      feeBn: 'বিনামূল্যে কার্ড ব্লক',
      descEn: 'Lost ATM/Credit card instant freeze, unauthorized transaction dispute letter & helpline.',
      descBn: 'অনুমোদনহীন ব্যাংক কার্ডের লেনদেন বন্ধ, কার্ড ব্লক এবং অফিসিয়াল অভিযোগপত্র ডাউনলোড।',
      portalUrl: 'https://bb.org.bd',
    },
    {
      key: 'driving_license',
      icon: <Award className="w-5 h-5 text-indigo-400 light:text-indigo-700" />,
      titleEn: 'BRTA Driving License',
      titleBn: 'বিআরটিএ ড্রাইভিং লাইসেন্স',
      badge: 'BRTA Service',
      feeEn: 'BDT 875 - 2,500',
      feeBn: '৮৭৫ - ২,৫০০ টাকা',
      descEn: 'Lost driving license duplicate permit, learner card replacement & BRTA IS portal guidance.',
      descBn: 'হারানো লাইসেন্সের ডুপ্লিকেট কপি, লার্নার কার্ড নবায়ন ও বিআরটিএ সার্ভিস পোর্টাল।',
      portalUrl: 'https://bsp.brta.gov.bd',
    },
    {
      key: 'birth_certificate',
      icon: <FileText className="w-5 h-5 text-teal-400 light:text-teal-700" />,
      titleEn: 'Digital Birth Registration',
      titleBn: 'ডিজিটাল জন্ম ও মৃত্যু নিবন্ধন',
      badge: 'BDRIS Portal',
      feeEn: 'BDT 50 - 100',
      feeBn: '৫০ - ১০০ টাকা',
      descEn: 'Digital birth certificate correction, online copy verification & union parishad clearance.',
      descBn: 'অনলাইন জন্ম সনদ সংশোধন, ১৭-ডিজিটের ডিজিটাল সনদ এবং ইউনিয়ন পরিষদ ছাড়পত্র।',
      portalUrl: 'https://bdris.gov.bd',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="font-extrabold text-lg text-slate-100 dark:text-slate-100 light:text-[#0F172A] flex items-center space-x-2">
            <span>Bangladeshi Official Document & Card Directory</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-[#334155] font-semibold mt-0.5">
            Select any document type to instantly access prerequisite checklists, step roadmaps & GD form downloads
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentCategories.map((cat) => {
          const isActive = activeCategoryKey === cat.key;
          return (
            <div
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 space-y-3 ${
                isActive
                  ? 'bg-emerald-950/30 dark:bg-emerald-950/30 light:bg-[#DCECC7] border-emerald-500 light:border-emerald-600 shadow-lg ring-2 ring-emerald-500/40'
                  : 'bg-[#131924] dark:bg-[#131924] light:bg-[#EBE3A7] border-slate-800/80 light:border-[#D9D092] hover:border-emerald-500/40 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-[#DCD396] border border-slate-800 light:border-[#C5BC7F]">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-800 dark:bg-slate-800 dark:text-slate-300 light:bg-[#DCD396] light:text-[#0F172A] border border-slate-700 light:border-[#C5BC7F]">
                  {cat.badge}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-100 dark:text-slate-100 light:text-[#0F172A]">
                  {language === 'bn' ? cat.titleBn : cat.titleEn}
                </h4>
                <p className="text-xs text-emerald-400 dark:text-emerald-400 light:text-[#047857] font-bold mt-0.5">
                  {language === 'bn' ? cat.feeBn : cat.feeEn}
                </p>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-[#1E293B] font-medium line-clamp-2 leading-relaxed">
                {language === 'bn' ? cat.descBn : cat.descEn}
              </p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60 light:border-[#D9D092]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(cat.key);
                  }}
                  className="text-emerald-400 dark:text-emerald-400 light:text-emerald-950 font-extrabold hover:opacity-90 flex items-center space-x-1 py-1.5 px-3 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-500/20 border border-emerald-500/30 light:border-emerald-600/40 transition-all shadow-sm"
                >
                  <span>View Action Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href={cat.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] text-slate-400 dark:text-slate-400 light:text-[#334155] hover:text-cyan-400 light:hover:text-cyan-700 font-bold hover:underline"
                >
                  Verified Portal ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
