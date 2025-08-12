'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  feeId: string;
  feeName: string;
  feeCategory: string;
  amount: number;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  receiptNumber: string;
  term: string;
  session: string;
  status: string;
  paidBy: string;
  relationship: string;
  phoneNumber: string;
  reference: string;
}

function ReceiptContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment');
  
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/fees/payments?studentId=${paymentId?.includes('STU') ? paymentId : ''}`);
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        // Find specific payment or use first one
        const foundPayment = result.data.find((p: Payment) => p.id === paymentId) || result.data[0];
        setPayment(foundPayment);
      } else {
        setError('Payment record not found');
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
      setError('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId]);

  const printReceipt = () => {
    window.print();
  };

  const downloadReceipt = () => {
    // Create a simple text receipt
    if (!payment) return;

    const receiptText = `
PACEY SCHOOL SOLUTION
Smart School Management System
Payment Receipt

Receipt Number: ${payment.receiptNumber}
Payment Date: ${new Date(payment.paymentDate).toLocaleDateString()}

STUDENT INFORMATION
Name: ${payment.studentName}
Class: ${payment.class}
Student ID: ${payment.studentId}

FEE DETAILS
Fee Type: ${payment.feeName}
Category: ${payment.feeCategory}
Term: ${payment.term}
Session: ${payment.session}

PAYMENT INFORMATION
Amount Due: ₦${payment.amount.toLocaleString()}
Amount Paid: ₦${payment.amountPaid.toLocaleString()}
Balance: ₦${(payment.amount - payment.amountPaid).toLocaleString()}
Payment Method: ${payment.paymentMethod}
Transaction Reference: ${payment.reference}
Payment Status: ${payment.status}

PAID BY
Name: ${payment.paidBy}
Relationship: ${payment.relationship}
Phone: ${payment.phoneNumber}

Generated on: ${new Date().toLocaleString()}

Thank you for your payment!
For inquiries, contact the school bursar.
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${payment.receiptNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Receipt Not Found</h3>
          <p className="text-gray-500 mb-4">{error || 'The requested receipt could not be found.'}</p>
          <Link
            href="/fees"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            ← Back to Fees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hide on print */}
      <header className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🧾 Payment Receipt</h1>
              <p className="text-gray-600 mt-1">Receipt #{payment.receiptNumber}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={downloadReceipt}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                📥 Download
              </button>
              <button
                onClick={printReceipt}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                🖨️ Print
              </button>
              <Link
                href="/fees"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                ← Back to Fees
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-4">
        {/* Receipt Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border-0">
          {/* School Header */}
          <div className="border-b border-gray-200 p-8 print:p-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🏫</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">PACEY SCHOOL SOLUTION</h1>
              <p className="text-lg text-blue-600 font-medium mb-2">Smart School Management System</p>
              <p className="text-gray-600">123 Education Street, Lagos, Nigeria</p>
              <p className="text-gray-600">Phone: +234-800-PACEY-01 | Email: info@paceyschool.edu.ng</p>
            </div>
          </div>

          {/* Receipt Header */}
          <div className="p-8 print:p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">PAYMENT RECEIPT</h2>
                <div className="space-y-1">
                  <p className="text-lg"><span className="font-medium">Receipt No:</span> {payment.receiptNumber}</p>
                  <p className="text-lg"><span className="font-medium">Date:</span> {new Date(payment.paymentDate).toLocaleDateString('en-GB')}</p>
                  <p className="text-lg"><span className="font-medium">Time:</span> {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex px-4 py-2 rounded-full text-lg font-semibold ${
                  payment.status === 'Complete' 
                    ? 'bg-green-100 text-green-800'
                    : payment.status === 'Partial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {payment.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="p-8 print:p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">STUDENT INFORMATION</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{payment.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Student ID</p>
                  <p className="text-lg text-gray-900">{payment.studentId}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Class</p>
                  <p className="text-lg text-gray-900">{payment.class}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Academic Session</p>
                  <p className="text-lg text-gray-900">{payment.session} - {payment.term}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-8 print:p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">PAYMENT DETAILS</h3>
            <div className="space-y-4">
              {/* Fee Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fee Type</p>
                    <p className="text-lg font-semibold text-gray-900">{payment.feeName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-lg text-gray-900">{payment.feeCategory}</p>
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-lg text-gray-600">Fee Amount:</span>
                  <span className="text-lg font-semibold text-gray-900">₦{payment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-lg text-gray-600">Amount Paid:</span>
                  <span className="text-lg font-semibold text-green-600">₦{payment.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b-2 border-gray-300">
                  <span className="text-lg font-medium text-gray-900">Balance Outstanding:</span>
                  <span className={`text-xl font-bold ${
                    payment.amount - payment.amountPaid === 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₦{(payment.amount - payment.amountPaid).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="text-lg text-gray-900">{payment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Transaction Reference</p>
                  <p className="text-lg text-gray-900 font-mono">{payment.reference}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payer Information */}
          <div className="p-8 print:p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">PAYMENT MADE BY</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg text-gray-900">{payment.paidBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Relationship</p>
                <p className="text-lg text-gray-900">{payment.relationship}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-lg text-gray-900">{payment.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 print:p-6">
            <div className="text-center space-y-4">
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg bg-blue-50">
                <p className="text-lg font-semibold text-blue-900 mb-2">
                  {payment.status === 'Complete' 
                    ? '✅ Payment Complete - Thank You!' 
                    : '⏰ Partial Payment - Balance Outstanding'
                  }
                </p>
                {payment.status !== 'Complete' && (
                  <p className="text-blue-700">
                    Please pay the remaining balance of <strong>₦{(payment.amount - payment.amountPaid).toLocaleString()}</strong> before the due date.
                  </p>
                )}
              </div>

              <div className="text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p className="mb-2"><strong>Important Notes:</strong></p>
                <ul className="text-left max-w-2xl mx-auto space-y-1">
                  <li>• This receipt is valid only when payment has been confirmed by the school bursar</li>
                  <li>• Keep this receipt safe for your records and future reference</li>
                  <li>• For any payment inquiries, contact the school office with this receipt number</li>
                  <li>• Late payment may attract additional charges as per school policy</li>
                </ul>
              </div>

              <div className="text-xs text-gray-500 pt-4">
                <p>Generated electronically by Pacey School Solution on {new Date().toLocaleString()}</p>
                <p>This is a system-generated receipt and does not require a signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div>Loading receipt...</div>}>
      <ReceiptContent />
    </Suspense>
  );
}
