import { jsPDF } from 'jspdf';
import { GdFormData, BankDisputeFormData } from '../types';

export function generatePoliceGdPdf(data: GdFormData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Colors
  const primaryNavy = '#0F172A';
  const emeraldAccent = '#059669';

  // Header Banner
  doc.setFillColor(15, 23, 42); // #0F172A
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BANGLADESH POLICE GENERAL DIARY (GD) DRAFT', 105, 14, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('CIVIC GUARD AI - Form Verified & Pre-Filled Application (Form No. 102)', 105, 21, { align: 'center' });

  // Reset text color
  doc.setTextColor(15, 23, 42);

  // Date & Thana Address Block
  let y = 40;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), 30, y);

  doc.setFont('helvetica', 'bold');
  doc.text('To,', 15, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Officer-in-Charge (OC)`, 15, y + 14);
  doc.text(`${data.policeStation || 'Tejgaon'} Police Station, ${data.district || 'Dhaka'}`, 15, y + 20);

  // Subject Line
  y = y + 32;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y - 5, 180, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text(`SUBJECT: General Diary Application regarding ${data.incidentType || 'Lost National ID (NID) Card'}`, 18, y + 1);

  // Applicant Particulars Box
  y = y + 14;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Applicant Details:', 15, y);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const details = [
    ['Full Name:', data.applicantName || '[Applicant Name]'],
    ['Father / Spouse Name:', data.fatherName || '[Father Name]'],
    ['Contact Phone Number:', data.phone || '[Phone Number]'],
    ['NID / Passport No.:', data.nidOrPassport || '[NID / Passport]'],
    ['Permanent Address:', data.address || '[Address Details]']
  ];

  let lineY = y + 6;
  details.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, lineY);
    doc.setFont('helvetica', 'normal');
    doc.text(val, 68, lineY);
    lineY += 6;
  });

  // Incident Description Box
  y = lineY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. Incident & Lost Item Details:', 15, y);

  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Location of Incident:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.incidentLocation || 'Tejgaon Agargaon Road, Dhaka', 68, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Date & Time of Loss:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.incidentDateTime || new Date().toLocaleString(), 68, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Description of Lost Items:', 20, y);
  
  y += 6;
  doc.setFont('helvetica', 'normal');
  const splitText = doc.splitTextToSize(
    data.lostItemDetails ||
      'I lost my original Smart National ID Card along with my wallet containing 1 copy of birth certificate. I searched all nearby areas but could not recover it. I am filing this General Diary to prevent any misuse and to apply for a duplicate re-issue.',
    170
  );
  doc.text(splitText, 20, y);

  y += splitText.length * 5 + 10;

  // Declaration & Signature Box
  doc.setFont('helvetica', 'bold');
  doc.text('Declaration:', 15, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('I hereby declare that the information provided above is true and correct to the best of my knowledge.', 15, y);

  y += 25;
  // Signature Lines
  doc.setDrawColor(148, 163, 184);
  doc.line(15, y, 75, y);
  doc.line(135, y, 195, y);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Applicant Signature', 15, y + 5);
  doc.text('Receiving Police Officer Signature & Seal', 135, y + 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated via CIVIC GUARD AI Engine | Verification ID: CG-GD-${Math.floor(100000 + Math.random() * 900000)}`, 105, 285, { align: 'center' });

  // Save PDF
  doc.save(`Police_GD_Draft_${(data.applicantName || 'Applicant').replace(/\s+/g, '_')}.pdf`);
}

export function generateBankDisputePdf(data: BankDisputeFormData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(220, 38, 38); // #DC2626 Red
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('UNAUTHORIZED TRANSACTION DISPUTE CLAIM', 105, 14, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('CIVIC GUARD AI - Financial Crime & Chargeback Form', 105, 21, { align: 'center' });

  doc.setTextColor(15, 23, 42);

  let y = 40;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), 30, y);

  doc.setFont('helvetica', 'bold');
  doc.text('To,', 15, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text('The Head of Fraud Management & Card Services', 15, y + 14);
  doc.text(`${data.bankName || 'Dutch-Bangla Bank Limited'}`, 15, y + 20);

  y = y + 32;
  doc.setFillColor(254, 226, 226);
  doc.rect(15, y - 5, 180, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text(`SUBJECT: Urgent Dispute Claim for Unauthorized Transaction BDT ${data.disputedAmount || '0.00'}`, 18, y + 1);

  y = y + 14;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Account / Card Holder Name:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.accountHolderName || '[Name]', 75, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Account / Card Number:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.accountNumber || '[Account No]', 75, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction Reference ID:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.transactionId || '[TXN ID]', 75, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Date & Time of Fraud:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.incidentDate || new Date().toLocaleString(), 75, y);

  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Statement of Fraud:', 15, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  const text = doc.splitTextToSize(
    data.disputeReason ||
      'I am writing to formally dispute an unauthorized transaction debited from my account. I did not perform, authorize, or share PIN details for this payment. I request immediate temporary credit and full investigation by the fraud department.',
    175
  );
  doc.text(text, 15, y);

  y += text.length * 5 + 25;

  doc.line(15, y, 75, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Account Holder Signature', 15, y + 5);

  doc.save(`Bank_Dispute_Claim_${(data.accountHolderName || 'Customer').replace(/\s+/g, '_')}.pdf`);
}
