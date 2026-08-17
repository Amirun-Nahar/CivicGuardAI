import React, { useState } from 'react';
import { X, Download, Printer, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { generatePoliceGdPdf, generateBankDisputePdf } from '../../lib/pdfGenerator';
import { GdFormData, BankDisputeFormData } from '../../types';

interface GdPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateType: 'POLICE_GD_LOST_DOC' | 'BANK_DISPUTE_LETTER' | 'GENERAL_CLAIM';
  problemTitle?: string;
}

export const GdPdfModal: React.FC<GdPdfModalProps> = ({
  isOpen,
  onClose,
  templateType,
  problemTitle = 'Lost Smart National ID (NID) Card',
}) => {
  const isGd = templateType === 'POLICE_GD_LOST_DOC';

  // Police GD State
  const [gdData, setGdData] = useState<GdFormData>({
    policeStation: 'Tejgaon',
    district: 'Dhaka',
    applicantName: 'Md. Tanvir Rahman',
    fatherName: 'Md. Shafiqul Islam',
    phone: '01712345678',
    nidOrPassport: '1994269201923',
    address: 'House 42, Road 11, Block C, Agargaon, Dhaka',
    incidentType: problemTitle,
    lostItemDetails:
      'I lost my original Smart National ID Card along with my wallet on 15 August 2026 at Agargaon Road. I searched all nearby areas but could not recover it.',
    incidentLocation: 'Agargaon Nirbachan Bhaban Road, Tejgaon, Dhaka',
    incidentDateTime: new Date().toLocaleString(),
    reason: 'To prevent illegal misuse and apply for duplicate Smart NID Card re-issue.',
  });

  // Bank Dispute State
  const [bankData, setBankData] = useState<BankDisputeFormData>({
    bankName: 'Dutch-Bangla Bank PLC',
    accountNumber: '110.120.98765',
    accountHolderName: 'Md. Tanvir Rahman',
    phone: '01712345678',
    transactionId: 'TXN-98472910',
    disputedAmount: '12,500.00',
    disputeReason:
      'I am writing to formally dispute an unauthorized transaction debited from my account. I did not perform, authorize, or share PIN details for this payment.',
    fraudType: 'Unauthorized MFS / Online Debit',
    incidentDate: new Date().toLocaleString(),
  });

  if (!isOpen) return null;

  const handleDownload = () => {
    if (isGd) {
      generatePoliceGdPdf(gdData);
    } else {
      generateBankDisputePdf(bankData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#131924] dark:bg-[#131924] light:bg-white rounded-2xl border border-[#1E2638] p-6 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-100 light:text-slate-900">
                {isGd ? '1-Click Police General Diary (GD) Generator' : '1-Click Bank Fraud Dispute Letter'}
              </h3>
              <p className="text-xs text-slate-400">Pre-filled with CIVIC GUARD AI intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Form Editor */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs">
          {isGd ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Police Thana Station Name</label>
                  <input
                    type="text"
                    value={gdData.policeStation}
                    onChange={(e) => setGdData({ ...gdData, policeStation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">District / City</label>
                  <input
                    type="text"
                    value={gdData.district}
                    onChange={(e) => setGdData({ ...gdData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Applicant Full Name</label>
                  <input
                    type="text"
                    value={gdData.applicantName}
                    onChange={(e) => setGdData({ ...gdData, applicantName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Father / Spouse Name</label>
                  <input
                    type="text"
                    value={gdData.fatherName}
                    onChange={(e) => setGdData({ ...gdData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={gdData.phone}
                    onChange={(e) => setGdData({ ...gdData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">NID / Passport Number</label>
                  <input
                    type="text"
                    value={gdData.nidOrPassport}
                    onChange={(e) => setGdData({ ...gdData, nidOrPassport: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description of Lost Document / Item</label>
                <textarea
                  rows={3}
                  value={gdData.lostItemDetails}
                  onChange={(e) => setGdData({ ...gdData, lostItemDetails: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankData.bankName}
                    onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Disputed Amount (BDT)</label>
                  <input
                    type="text"
                    value={bankData.disputedAmount}
                    onChange={(e) => setBankData({ ...bankData, disputedAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={bankData.accountHolderName}
                    onChange={(e) => setBankData({ ...bankData, accountHolderName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Transaction Ref ID</label>
                  <input
                    type="text"
                    value={bankData.transactionId}
                    onChange={(e) => setBankData({ ...bankData, transactionId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Fraud Dispute Statement</label>
                <textarea
                  rows={3}
                  value={bankData.disputeReason}
                  onChange={(e) => setBankData({ ...bankData, disputeReason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[#1E2638] pt-4">
          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Form 102 Compliant Document Format</span>
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg glow-emerald hover:scale-105 transition-transform"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed Official PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
