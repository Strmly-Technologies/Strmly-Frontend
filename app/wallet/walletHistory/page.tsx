'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, MoreHorizontal, MoreVertical } from 'lucide-react';

export default function WalletHistoryPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <button onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">Wallet History</h1>
        <MoreHorizontal className="h-6 w-6" />
      </div>

      <div className="p-4">
        {/* Wallet history content */}
      </div>
    </div>
  );
}
