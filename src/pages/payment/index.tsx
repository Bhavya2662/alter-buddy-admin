import React, { useMemo, useState } from "react";
import { Layout } from "../../layout";
import { useGetWalletQuery, useLazyGetWalletTransactionsByUserQuery, useGetPaymentNotificationsQuery } from "../../app/api";
import { IUserProps } from "../../interface/user.interface";

type WalletItem = {
  _id?: string;
  balance?: number | string | null;
  userId?: IUserProps | string | null; // populated doc OR ObjectId string
};

type WalletTxn = {
  _id?: string;
  creditAmt?: number | string;
  debitAmt?: number | string;
  closingBal?: number | string;
  createdAt?: string;
  transactionId?: string;
  transactionType?: string;
  status?: string;
  description?: string;
};

function getUserId(userId?: IUserProps | string | null) {
  if (!userId) return "";
  return typeof userId === "string" ? userId : (userId._id || "");
}

function getFullName(userId?: IUserProps | string | null) {
  if (!userId || typeof userId === "string") return "";
  const first = (userId.name?.firstName || "").trim();
  const last = (userId.name?.lastName || "").trim();
  return `${first} ${last}`.trim();
}

function toINR(value?: number | string | null) {
  const n = typeof value === "string" ? Number(value) : value ?? 0;
  if (!Number.isFinite(n)) return "N/A";
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

function getTransactionAmount(txn: WalletTxn) {
  const credit = Number(txn.creditAmt || 0);
  const debit = Number(txn.debitAmt || 0);
  return { credit, debit, isCredit: credit > 0, isDebit: debit > 0 };
}

function getTransactionTypeLabel(type?: string) {
  const typeMap: Record<string, string> = {
    'credit': 'Credit',
    'debit': 'Debit',
    'refund': 'Refund',
    'payment': 'Payment',
    'withdrawal': 'Withdrawal',
    'deposit': 'Deposit',
    'transfer': 'Transfer'
  };
  return typeMap[type?.toLowerCase() || ''] || type || 'Unknown';
}

export const PaymentPage = () => {
  const { data, isFetching, isError, error } = useGetWalletQuery();
  const { data: paymentNotifications } = useGetPaymentNotificationsQuery();
  const [searchUsers, setSearchUsers] = useState("");
  const [showPaymentNotifications, setShowPaymentNotifications] = useState(false);

  // lazy txn fetcher
  const [
    fetchTxns,
    { data: txns, isFetching: isTxnsLoading, isError: isTxnsError, error: txnsError },
  ] = useLazyGetWalletTransactionsByUserQuery();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");

  // Txn table search + pagination
  const [txnSearch, setTxnSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // always coerce to an array
  const wallets: WalletItem[] = useMemo(() => {
    const raw = (data as any)?.data ?? data; // support both {data:[...]} or [...]
    return Array.isArray(raw) ? (raw as WalletItem[]) : [];
  }, [data]);

  // search only by full name (when we actually have a populated user object)
  const filteredUsers = useMemo(() => {
    const q = searchUsers.trim().toLowerCase();
    if (!q) return wallets;
    return wallets.filter((w) => getFullName(w.userId).toLowerCase().includes(q));
  }, [wallets, searchUsers]);

  const onNameClick = (item: WalletItem) => {
    const uid = getUserId(item.userId);
    if (!uid) return;
    setSelectedUserId(uid);
    setSelectedUserName(getFullName(item.userId) || "(Unknown user)");
    setTxnSearch("");
    setPage(1);
    fetchTxns(uid, true);
  };

  const refreshTransactions = () => {
    if (selectedUserId) {
      fetchTxns(selectedUserId, true);
    }
  };

  const clearSelection = () => {
    setSelectedUserId("");
    setSelectedUserName("");
    setTxnSearch("");
    setPage(1);
  };

  // normalize txns array (supports either array or {data: array})
  const txnsArray: WalletTxn[] = useMemo(() => {
    const raw = (txns as any)?.data ?? txns;
    const array = Array.isArray(raw) ? (raw as WalletTxn[]) : [];
    return [...array].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  }, [txns]);

  // filter txns by search text (amount, closingBal, date, time, id, type, status)
  const filteredTxns = useMemo(() => {
    const q = txnSearch.trim().toLowerCase();
    if (!q) return txnsArray;

    return txnsArray.filter((t) => {
      const { credit, debit } = getTransactionAmount(t);
      const creditAmt = toINR(credit).toLowerCase();
      const debitAmt = toINR(debit).toLowerCase();
      const closing = toINR(t?.closingBal ?? 0).toLowerCase();
      const d = t?.createdAt ? new Date(t.createdAt) : null;
      const dateText = d
        ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toLowerCase()
        : "";
      const timeText = d
        ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }).toLowerCase()
        : "";
      const idText = (t?.transactionId || "").toLowerCase();
      const typeText = getTransactionTypeLabel(t?.transactionType).toLowerCase();
      const statusText = (t?.status || "").toLowerCase();
      const descText = (t?.description || "").toLowerCase();

      return (
        creditAmt.includes(q) ||
        debitAmt.includes(q) ||
        closing.includes(q) ||
        dateText.includes(q) ||
        timeText.includes(q) ||
        idText.includes(q) ||
        typeText.includes(q) ||
        statusText.includes(q) ||
        descText.includes(q)
      );
    });
  }, [txnsArray, txnSearch]);

  // Payment notifications (move above userSessionPayments)
  const notifications = useMemo(() => {
    const raw = (paymentNotifications as any)?.data ?? paymentNotifications;
    return Array.isArray(raw) ? raw : [];
  }, [paymentNotifications]);

  // Filter session payments for selected user
  const userSessionPayments = useMemo(() => {
    if (!selectedUserId) return [];
    return notifications.filter((n) => {
      // Handle both string and object userId
      if (!n.userId) return false;
      if (typeof n.userId === 'string') return n.userId === selectedUserId;
      if (typeof n.userId === 'object' && n.userId._id) return n.userId._id === selectedUserId;
      return false;
    });
  }, [notifications, selectedUserId]);

  // Map session payments to WalletTxn-like objects
  const sessionTxns = useMemo(() => {
    return userSessionPayments.map((n) => ({
      _id: n._id,
      creditAmt: n.amount,
      debitAmt: 0,
      closingBal: undefined,
      createdAt: n.timestamp,
      transactionId: n.transactionId,
      transactionType: 'Session Payment',
      status: n.status,
      description: 'Session payment',
    }));
  }, [userSessionPayments]);

  // Merge and sort by date
  const mergedTxns = useMemo(() => {
    if (!selectedUserId) return filteredTxns;
    return [...filteredTxns, ...sessionTxns].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  }, [filteredTxns, sessionTxns, selectedUserId]);

  const totalPages = Math.max(1, Math.ceil(mergedTxns.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedTxns = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return mergedTxns.slice(start, start + pageSize);
  }, [mergedTxns, currentPage, pageSize]);

  // UI
  return (
    <Layout pageTitle="Payment / Wallet of users">
      {/* Header & user search always visible */}
      <div className="my-5 flex items-center justify-between gap-3 flex-wrap">
        <h6 className="text-2xl font-semibold">User Payments</h6>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPaymentNotifications(!showPaymentNotifications)}
            className={`px-4 py-2 rounded ${showPaymentNotifications ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Session Payments ({notifications.length})
          </button>
        </div>

        {/* Users search (hidden when viewing txns? keep or hide; keeping visible) */}
        {!selectedUserId && (
          <input
            type="text"
            value={searchUsers}
            onChange={(e) => setSearchUsers(e.target.value)}
            placeholder="Search user by name"
            className="w-full sm:w-80 px-3 py-2 border rounded-md"
          />
        )}
      </div>

      {/* Loading/error for wallets */}
      {!selectedUserId && isFetching && <p className="text-gray-500">Loading wallets…</p>}
      {!selectedUserId && isError && (
        <p className="text-red-600 text-sm">
          Failed to load wallets{": "}
          {String((error as any)?.data?.message || (error as any)?.message || "")}
        </p>
      )}

      {/* Payment Notifications */}
      {showPaymentNotifications && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Recent Session Payments</h3>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-sm border text-left">
              <thead className="bg-green-50 text-gray-700 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3 border">Date</th>
                  <th className="px-4 py-3 border">User</th>
                  <th className="px-4 py-3 border">Email</th>
                  <th className="px-4 py-3 border">Amount</th>
                  <th className="px-4 py-3 border">Transaction ID</th>
                  <th className="px-4 py-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {notifications.slice(0, 10).map((payment, idx) => {
                  const date = new Date(payment.timestamp);
                  const dateText = date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <tr key={payment._id || idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{dateText}</td>
                      <td className="px-4 py-2 border font-medium">{payment.userName}</td>
                      <td className="px-4 py-2 border">{payment.userEmail}</td>
                      <td className="px-4 py-2 border font-semibold text-green-600">
                        {toINR(payment.amount)}
                      </td>
                      <td className="px-4 py-2 border font-mono text-xs">{payment.transactionId}</td>
                      <td className="px-4 py-2 border">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium capitalize">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {notifications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      No session payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Wallet cards — HIDDEN once a user is selected */}
      {!selectedUserId && !showPaymentNotifications && (
        <>
          {!isFetching && filteredUsers.length === 0 && (
            <p className="text-gray-500">No wallets found.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 my-5">
            {filteredUsers.map((item, idx) => {
              const name = getFullName(item.userId) || "(Unknown user)";
              const amount = toINR(item.balance);
              const key =
                (typeof item.userId === "object" && item.userId?._id) ||
                item._id ||
                `row-${idx}`;

              return (
                <div key={key} className="bg-gray-100 p-3 border rounded-md">
                  <button
                    type="button"
                    className="capitalize font-medium underline text-primary-700 hover:text-primary-900"
                    onClick={() => onNameClick(item)}
                    disabled={!getUserId(item.userId)}
                    title={getUserId(item.userId) ? "View transactions" : "User ID unavailable"}
                  >
                    {name}
                  </button>
                  <p className="text-gray-700">{amount}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Transactions table — visible only when a user is selected; cards hidden */}
      {selectedUserId && (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold">
              Transactions — <span className="text-primary-700">{selectedUserName}</span>
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={txnSearch}
                onChange={(e) => {
                  setTxnSearch(e.target.value);
                  setPage(1); // reset page when searching
                }}
                placeholder="Search in transactions (amount, date, ID, status...)"
                className="w-64 px-3 py-2 border rounded-md"
              />
             
              <button
                onClick={refreshTransactions}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                type="button"
                disabled={isTxnsLoading}
              >
                {isTxnsLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                type="button"
              >
                Back to users
              </button>
            </div>
          </div>

          {isTxnsLoading && <p className="text-gray-500">Loading transactions…</p>}
          {isTxnsError && (
            <p className="text-red-600 text-sm">
              Failed to load transactions: {String((txnsError as any)?.data?.message || (txnsError as any)?.message || "")}
            </p>
          )}

          {/* Transaction Summary */}
          {!isTxnsLoading && txnsArray.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-1">Total Credits (Incoming)</h4>
                <p className="text-2xl font-bold text-green-600">
                  +{toINR(txnsArray.reduce((sum, t) => sum + Number(t.creditAmt || 0), 0))}
                </p>
                <p className="text-xs text-green-600">
                  {txnsArray.filter(t => Number(t.creditAmt || 0) > 0).length} transactions
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 mb-1">Total Debits (Outgoing)</h4>
                <p className="text-2xl font-bold text-red-600">
                  -{toINR(txnsArray.reduce((sum, t) => sum + Number(t.debitAmt || 0), 0))}
                </p>
                <p className="text-xs text-red-600">
                  {txnsArray.filter(t => Number(t.debitAmt || 0) > 0).length} transactions
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Net Balance Change</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {toINR(
                    txnsArray.reduce((sum, t) => sum + Number(t.creditAmt || 0) - Number(t.debitAmt || 0), 0)
                  )}
                </p>
                <p className="text-xs text-blue-600">
                  {txnsArray.length} total transactions
                </p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-sm border text-left">
              <thead className="bg-blue-50 text-gray-700 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3 border">#</th>
                  <th className="px-4 py-3 border">Date</th>
                  <th className="px-4 py-3 border">Time</th>
                  <th className="px-4 py-3 border">Credit (+)</th>
                  <th className="px-4 py-3 border">Debit (-)</th>
                  <th className="px-4 py-3 border">Closing Balance</th>
                  <th className="px-4 py-3 border">Type</th>
                  <th className="px-4 py-3 border">Status</th>
                  <th className="px-4 py-3 border">Txn ID</th>
                </tr>
              </thead>
              <tbody>
                {pagedTxns.map((t, idx) => {
                  const { credit, debit, isCredit, isDebit } = getTransactionAmount(t);
                  const closingBal = toINR(t?.closingBal ?? 0);
                  const d = t?.createdAt ? new Date(t.createdAt) : null;
                  const dateText = d
                    ? d.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";
                  const timeText = d
                    ? d.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";
                  
                  const rowClass = isCredit 
                    ? "hover:bg-green-50 border-l-4 border-l-green-500" 
                    : isDebit 
                    ? "hover:bg-red-50 border-l-4 border-l-red-500" 
                    : "hover:bg-gray-50";
                  
                  return (
                    <tr key={t._id || `${idx}-${t.transactionId}`} className={rowClass}>
                      <td className="px-4 py-2 border">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-2 border">{dateText}</td>
                      <td className="px-4 py-2 border">{timeText}</td>
                      <td className="px-4 py-2 border">
                        {isCredit ? (
                          <span className="text-green-600 font-semibold">+{toINR(credit)}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        {isDebit ? (
                          <span className="text-red-600 font-semibold">-{toINR(debit)}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border font-medium">{closingBal}</td>
                      <td className="px-4 py-2 border">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isCredit ? 'bg-green-100 text-green-800' : 
                          isDebit ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getTransactionTypeLabel(t?.transactionType)}
                        </span>
                      </td>
                      <td className="px-4 py-2 border">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          t?.status?.toLowerCase() === 'success' || t?.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                          t?.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          t?.status?.toLowerCase() === 'failed' || t?.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t?.status || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2 border text-xs font-mono">{t?.transactionId || "—"}</td>
                    </tr>
                  );
                })}
                {pagedTxns.length === 0 && !isTxnsLoading && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between gap-3 mt-3">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredTxns.length)} of {filteredTxns.length}
            </span>
            
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 border rounded disabled:opacity-50"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="text-sm">
                Page {currentPage} / {totalPages}
              </span>
              <button
                className="px-3 py-2 border rounded disabled:opacity-50"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
             <select
                className="px-2 py-2 border rounded-md"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
              </select>
          </div>
        </div>
      )}
    </Layout>
  );
};
