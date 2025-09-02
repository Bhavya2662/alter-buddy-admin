import React, { useMemo, useState, useEffect } from "react";
import moment from "moment";
import { Layout } from "../../layout";
import { useGetAllMentorWalletHistoryQuery } from "../../app/api/mentorWallet.api";

// Helpers
const fullName = (x: any): string => {
  if (!x || typeof x === "string") return "";
  const f = x.name?.firstName || "";
  const l = x.name?.lastName || "";
  return `${f} ${l}`.trim();
};
const inr = (n: number) =>
  Number(n || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

type Row = {
  date: string; // ISO createdAt
  mentorName: string;
  userName: string;
  description: string;
  type: string; // debit/credit
  status: string; // confirmed/failed/...
  amount: number; // total amount
  // Session details
  sessionDuration?: number;
  sessionCallType?: string;
  sessionDate?: string;
  sessionTime?: string;
  bookingType?: string;
};

const groupByYearMonth = (transactions: Row[]) => {
  const grouped: Record<string, Record<string, Row[]>> = {};
  transactions.forEach((txn) => {
    const year = moment(txn.date).format("YYYY");
    const month = moment(txn.date).format("MMMM");
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(txn);
  });
  return grouped;
};

const matchesRowSearch = (txn: Row, term: string) => {
  if (!term) return true;
  const t = term.toLowerCase();
  const dateText = moment(txn.date).format("MMM D, YYYY h:mm A").toLowerCase();
  return (
    txn.mentorName.toLowerCase().includes(t) ||
    txn.userName.toLowerCase().includes(t) ||
    (txn.description || "").toLowerCase().includes(t) ||
    (txn.type || "").toLowerCase().includes(t) ||
    (txn.status || "").toLowerCase().includes(t) ||
    dateText.includes(t) ||
    String(txn.amount).toLowerCase().includes(t)
  );
};

export const MentorPaymentPage = () => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const { data, isFetching, isError, error, refetch } =
    useGetAllMentorWalletHistoryQuery(undefined, {
      pollingInterval: 10000, // Poll every 10 seconds
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  // Update last updated time when data changes
  useEffect(() => {
    if (data && !isFetching) {
      setLastUpdated(new Date());
    }
  }, [data, isFetching]);

  const handleManualRefresh = () => {
    refetch();
  };

  // Normalize API payload -> rows
  const rows: Row[] = useMemo(() => {
    const list = (data as any)?.data?.data ?? [];
    console.log('Raw API data:', data);
    console.log('Extracted list:', list);
    console.log('Is array?', Array.isArray(list));
    
    const processedRows = Array.isArray(list)
      ? list.map((t: any) => ({
          date: t.createdAt,
          mentorName: t.mentorName || fullName(t.mentorId) || "(Unknown mentor)",
          userName: t.userName || fullName(t.userId) || "(Unknown user)",
          description: t.description || "",
          type: String(t.type || ""), // "debit"/"credit"
          status: String(t.status || ""),
          amount: Number(t.amount ?? 0),
          // Session details
          sessionDuration: t.sessionDuration,
          sessionCallType: t.sessionCallType,
          sessionDate: t.sessionDate,
          sessionTime: t.sessionTime,
          bookingType: t.bookingType,
        }))
      : [];
    
    console.log('Processed rows:', processedRows);
    return processedRows;
  }, [data]);

  const grouped = useMemo(() => {
    const result = groupByYearMonth(rows);
    console.log('Grouped data:', result);
    console.log('Available years:', Object.keys(result));
    return result;
  }, [rows]);

  // View state
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state (data view)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset pagination on context changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedYear, selectedMonth, pageSize]);

  const mode: "year" | "month" | "data" = !selectedYear
    ? "year"
    : !selectedMonth
    ? "month"
    : "data";

  const placeholder =
    mode === "year"
      ? "Search year (e.g., 2025)"
      : mode === "month"
      ? "Search month (e.g., Jun / June)"
      : "Search by mentor, user, description, type, status, date, or amount";

  const clearAll = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
    setSearchTerm("");
  };

  // Year search (label only)
  const filteredYears = useMemo(() => {
    const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));
    console.log('All years before filtering:', years);
    console.log('Search term:', searchTerm);
    
    const filtered = !searchTerm ? years : years.filter((y) => y.toLowerCase().includes(searchTerm.toLowerCase()));
    console.log('Filtered years:', filtered);
    return filtered;
  }, [grouped, searchTerm]);

  // Month search (label only)
  const filteredMonthsForYear = useMemo(() => {
    if (!selectedYear) return [];
    const months = Object.keys(grouped[selectedYear] || {});
    if (!searchTerm) return months;
    const t = searchTerm.toLowerCase();
    return months.filter((m) => m.toLowerCase().includes(t));
  }, [grouped, selectedYear, searchTerm]);

  // Table search (row fields)
  const monthData = useMemo(() => {
    if (!(selectedYear && selectedMonth)) return [];
    return grouped[selectedYear]?.[selectedMonth] || [];
  }, [grouped, selectedYear, selectedMonth]);

  const filteredData = useMemo(
    () => monthData.filter((txn) => matchesRowSearch(txn, searchTerm)),
    [monthData, searchTerm]
  );

  // Pagination
  const total = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <Layout pageTitle="Mentor Wallet Transactions">
      <div className="my-6 flex items-center justify-between">
        <div className="text-xl font-semibold">Mentor Transactions</div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {moment(lastUpdated).format('HH:mm:ss')}
            </span>
          )}
          <button
            onClick={handleManualRefresh}
            disabled={isFetching}
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isFetching ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search + Clear */}
      <div className="mt-2 mb-4 flex items-center gap-2 max-w-xl">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isFetching || isError}
        />
       
      </div>

      {isFetching && <p className="text-gray-500">Loading mentor history…</p>}
      {isError && (
        <p className="text-red-600 text-sm">
          Failed to load mentor history:{" "}
          {String(
            (error as any)?.data?.message || (error as any)?.message || ""
          )}
        </p>
      )}

      {/* Breadcrumb */}
      {selectedYear && !selectedMonth && (
        <div className="text-sm text-gray-500 mb-2">
          <span
            className="text-primary-600 font-semibold cursor-pointer"
            onClick={clearAll}
          >
            Home
          </span>
          {" > "}
          <span className="font-semibold">{selectedYear}</span>
        </div>
      )}
      {selectedYear && selectedMonth && (
        <div className="text-sm text-gray-500 mb-2">
          <span
            className="text-primary-600 font-semibold cursor-pointer"
            onClick={clearAll}
          >
            Home
          </span>
          {" > "}
          <span
            className="text-primary-600 font-semibold cursor-pointer"
            onClick={() => setSelectedMonth(null)}
          >
            {selectedYear}
          </span>
          {" > "}
          <span className="font-semibold">{selectedMonth}</span>
        </div>
      )}

      {/* Years */}
      {!selectedYear && !isFetching && !isError && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {filteredYears.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No matching years.
            </p>
          )}
          {filteredYears.map((year) => (
            <div
              key={year}
              onClick={() => setSelectedYear(year)}
              className="cursor-pointer p-4 border rounded-lg shadow hover:bg-primary-100 text-center font-medium"
            >
              {year}
            </div>
          ))}
        </div>
      )}

      {/* Months */}
      {selectedYear && !selectedMonth && !isFetching && !isError && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Months in {selectedYear}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {filteredMonthsForYear.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No matching months.
              </p>
            )}
            {filteredMonthsForYear.map((month) => (
              <div
                key={month}
                onClick={() => setSelectedMonth(month)}
                className="cursor-pointer p-4 border rounded-lg shadow hover:bg-primary-100 text-center font-medium"
              >
                {month}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table with pagination */}
      {selectedYear && selectedMonth && !isFetching && !isError && (
        <>
          {/* Top controls */}
          <div className="flex items-center justify-between gap-3 mb-2"></div>

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-sm border text-left">
              <thead className="bg-red-100 text-gray-700 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3 border">Sr</th>
                  <th className="px-4 py-3 border">Date</th>
                  <th className="px-4 py-3 border">Mentor</th>
                  <th className="px-4 py-3 border">User</th>
                  <th className="px-4 py-3 border">Duration (mins)</th>
                  <th className="px-4 py-3 border">Session Time</th>
                  <th className="px-4 py-3 border">Call Type</th>
                  <th className="px-4 py-3 border">Description</th>
                  <th className="px-4 py-3 border">Type</th>
                  <th className="px-4 py-3 border">Status</th>
                  <th className="px-4 py-3 border">Total Amount</th>
                  <th className="px-4 py-3 border">
                    Gateway Charges (Total Amount * 2.36%)
                  </th>
                  <th className="px-4 py-3 border">
                    Alter Buddy Share (Total Amount * 30%)
                  </th>
                  <th className="px-4 py-3 border">
                    Recived by Alter Buddy (Alter Share - PG Charges)
                  </th>
                  <th className="px-4 py-3 border">
                    Mentor Share (Total Amount * 70%)
                  </th>
                  <th className="px-4 py-3 border">TDS (Mentor Share * 10%)</th>
                  <th className="px-4 py-3 border">
                    Mentor Payment (Mentor Share - TDS)
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedData.map((txn, idx) => {
                  const amt = txn.amount;
                  const pgCharges = amt * 0.0236;
                  const abShare = amt * 0.3;
                  const receivedByAB = abShare - pgCharges;
                  const mentorShare = amt * 0.7;
                  const tds = mentorShare * 0.1;
                  const mentorPayment = mentorShare - tds;

                  return (
                    <tr key={`${txn.date}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">
                        {startIndex + idx + 1}
                      </td>
                      <td className="px-4 py-2 border">
                        {moment(txn.date).format("MMM D, YYYY h:mm A")}
                      </td>
                      <td className="px-4 py-2 border">{txn.mentorName}</td>
                      <td className="px-4 py-2 border">{txn.userName}</td>
                      <td className="px-4 py-2 border">
                        {txn.sessionDuration ? `${txn.sessionDuration} mins` : '-'}
                      </td>
                      <td className="px-4 py-2 border">
                        {txn.sessionTime || '-'}
                      </td>
                      <td className="px-4 py-2 border capitalize">
                        {txn.sessionCallType || '-'}
                      </td>
                      <td className="px-4 py-2 border">{txn.description}</td>
                      <td className="px-4 py-2 border capitalize">
                        {txn.type}
                      </td>
                      <td className="px-4 py-2 border font-bold capitalize">
                        {txn.status}
                      </td>
                      <td className="px-4 py-2 border">{inr(amt)}</td>
                      <td className="px-4 py-2 border">{inr(pgCharges)}</td>
                      <td className="px-4 py-2 border">{inr(abShare)}</td>
                      <td className="px-4 py-2 border text-green-600 font-semibold">
                        {inr(receivedByAB)}
                      </td>
                      <td className="px-4 py-2 border">{inr(mentorShare)}</td>
                      <td className="px-4 py-2 border">{inr(tds)}</td>
                      <td className="px-4 py-2 border text-green-600 font-semibold">
                        {inr(mentorPayment)}
                      </td>
                    </tr>
                  );
                })}
                {pagedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={14}
                      className="px-4 py-6 text-center text-gray-500"
                    >
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
              Showing {total === 0 ? 0 : startIndex + 1}–
              {Math.min(startIndex + pageSize, total)} of {total}
            </span>
            <div>
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
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rows per page</label>
              <select
                className="px-2 py-1.5 border rounded"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};
