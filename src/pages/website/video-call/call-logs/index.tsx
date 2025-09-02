import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "../../../../layout";
import { useGetAllCallsQuery } from "../../../../app/api";
import { AppInput, PageTitle } from "../../../../component";
import Table from "react-data-table-component";
import moment from "moment";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Call {
  createdAt: string;
  [key: string]: any;
}

const groupCallsByYearMonth = (calls: Call[] = []) => {
  const grouped: { [year: string]: { [month: string]: Call[] } } = {};
  calls.forEach((call) => {
    const year = moment(call.createdAt).format("YYYY");
    const month = moment(call.createdAt).format("MMMM");
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(call);
  });
  return grouped;
};

const matchesRowSearch = (call: Call, term: string) => {
  if (!term) return true;
  const t = term.toLowerCase();
  const userName = `${call.users?.user?.name?.firstName || ""} ${call.users?.user?.name?.lastName || ""}`.toLowerCase();
  const mentorName = `${call.users?.mentor?.name?.firstName || ""} ${call.users?.mentor?.name?.lastName || ""}`.toLowerCase();
  const category = (call.users?.mentor?.category ?? [])
    .map((cat: { title: string }) => cat.title)
    .join(", ")
    .toLowerCase();
  const callId = call.sessionDetails?.roomId?.toLowerCase() || "";
  const callType = call.sessionDetails?.callType?.toLowerCase() || "";
  const status = String(call.status || "").toLowerCase();

  return (
    userName.includes(t) ||
    mentorName.includes(t) ||
    category.includes(t) ||
    callId.includes(t) ||
    callType.includes(t) ||
    status.includes(t)
  );
};

export const VideoCallsPage = () => {
  const { data: calls, isError, isFetching, error } = useGetAllCallsQuery();

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isError) console.error(error);
  }, [isError, error]);

  const allCalls: Call[] = useMemo(
    () => ((calls?.data || []).filter((c: any) => typeof c?.createdAt === "string") as Call[]),
    [calls]
  );

  const grouped = useMemo(() => groupCallsByYearMonth(allCalls), [allCalls]);

  // View mode
  const mode: "year" | "month" | "data" = !selectedYear
    ? "year"
    : selectedYear && !selectedMonth
    ? "month"
    : "data";

  const placeholder =
    mode === "year"
      ? "Search year (e.g., 2023)"
      : mode === "month"
      ? "Search month (e.g., Jan / January)"
      : "Search by user, mentor, category, call ID, type, or status";

  const clearAll = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
    setSearchTerm("");
  };

  // Year view: filter year labels only
  const filteredYears = useMemo(() => {
    const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));
    if (!searchTerm) return years;
    const t = searchTerm.toLowerCase();
    return years.filter((y) => y.toLowerCase().includes(t));
  }, [grouped, searchTerm]);

  // Month view: filter month labels only
  const filteredMonthsForYear = useMemo(() => {
    if (!selectedYear) return [];
    const months = Object.keys(grouped[selectedYear] || {});
    if (!searchTerm) return months;
    const t = searchTerm.toLowerCase();
    return months.filter((m) => m.toLowerCase().includes(t));
  }, [grouped, selectedYear, searchTerm]);

  // Data view: filter rows by data fields
  const currentData = useMemo(() => {
    if (!(selectedYear && selectedMonth)) return [];
    const monthCalls = grouped[selectedYear]?.[selectedMonth] || [];
    return monthCalls.filter((c) => matchesRowSearch(c, searchTerm));
  }, [grouped, selectedYear, selectedMonth, searchTerm]);

  return (
    <Layout pageTitle="Website call logs">
      <PageTitle
        title="Hey! admin manage your website calls"
        subTitle="Your website calls are listed here which is happened previously"
      />

      {/* Search + Quick Clear */}
      <div className="mt-4 flex items-center gap-2 max-w-xl">
        <AppInput
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        {/* {(searchTerm || selectedYear || selectedMonth) && (
          <button
            className="px-3 py-2 rounded bg-gray-100 text-gray-700 border hover:bg-gray-200"
            onClick={clearAll}
            type="button"
          >
            Clear
          </button>
        )} */}
      </div>

      {/* Breadcrumb */}
      {selectedYear && !selectedMonth && (
        <div className="text-sm text-gray-500 mb-2 mt-2">
          <span className="text-primary-600 font-semibold cursor-pointer" onClick={() => { setSelectedMonth(null); setSelectedYear(null); }}>
            Home
          </span>{" > "}
          <span className="font-semibold">{selectedYear}</span>
        </div>
      )}
      {selectedYear && selectedMonth && (
        <div className="text-sm text-gray-500 mb-2 mt-2">
          <span className="text-primary-600 font-semibold cursor-pointer" onClick={() => { setSelectedMonth(null); setSelectedYear(null); }}>
            Home
          </span>{" > "}
          <span className="text-primary-600 font-semibold cursor-pointer" onClick={() => setSelectedMonth(null)}>
            {selectedYear}
          </span>{" > "}
          <span className="font-semibold">{selectedMonth}</span>
        </div>
      )}

      {/* Year grid */}
      {!selectedYear && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {filteredYears.length === 0 && (
            <p className="col-span-full text-center text-gray-500">No matching years.</p>
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

      {/* Month grid */}
      {selectedYear && !selectedMonth && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {filteredMonthsForYear.length === 0 && (
            <p className="col-span-full text-center text-gray-500">No matching months.</p>
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
      )}

      {/* Month table */}
      {selectedYear && selectedMonth && (
        <div className="mt-6">
          {currentData.length === 0 ? (
            <p className="text-center text-gray-500">No calls found.</p>
          ) : (
            <Table
              pagination
              data={currentData}
              columns={[
                {
                  id: "#",
                  name: "Sr No.",
                  width: "100px",
                  cell: (_: any, index: number) => <p>{index + 1}</p>,
                },
                {
                  id: "users.user",
                  name: "User Name",
                  width: "250px",
                  cell: ({ users }: any) => (
                    <Link to={`/users/${users?.user?._id}`}>
                      <p className="capitalize underline text-gray-900">
                        {users?.user?.name?.firstName} {users?.user?.name?.lastName}
                      </p>
                    </Link>
                  ),
                },
                {
                  id: "users.mentor",
                  name: "Mentor",
                  width: "250px",
                  cell: ({ users }: any) => (
                    <Link to={`/mentors/${users?.mentor?._id}`}>
                      <p className="capitalize underline text-gray-900">
                        {users?.mentor?.name?.firstName} {users?.mentor?.name?.lastName}
                      </p>
                    </Link>
                  ),
                },
                {
                  id: "createdAt",
                  name: "Date / Time",
                  width: "200px",
                  cell: ({ createdAt }: any) => (
                    <p className="text-gray-500">
                      {moment(createdAt).format("Do MMM YYYY hh:mm A")}
                    </p>
                  ),
                },
                {
                  id: "category",
                  name: "Category",
                  width: "180px",
                  cell: ({ users }: any) => (
                    <p className="uppercase text-gray-500">
                      {(users.mentor?.category ?? [])
                        .map((cat: { title: string }) => cat.title)
                        .join(", ")}
                    </p>
                  ),
                },
                {
                  id: "roomId",
                  name: "Call ID",
                  width: "180px",
                  cell: ({ sessionDetails }: any) => (
                    <p className="lowercase text-gray-500">{sessionDetails?.roomId}</p>
                  ),
                },
                {
                  id: "callType",
                  name: "Call Type",
                  width: "120px",
                  selector: ({ sessionDetails }: any) => sessionDetails?.callType,
                },
                {
                  id: "status",
                  name: "Status",
                  width: "200px",
                  cell: ({ status }: any) => {
                    const statusMap: Record<string, string> = {
                      ACCEPTED: "On Going",
                      COMPLETED: "Completed",
                      PENDING: "Pending",
                      ONGOING: "Just Started",
                      REJECTED: "Rejected by Mentor",
                    };
                    const colorMap: Record<string, string> = {
                      ACCEPTED: "gray-500",
                      COMPLETED: "green-500",
                      PENDING: "orange-500",
                      ONGOING: "primary-500",
                      REJECTED: "red-500",
                    };
                    const key = String(status || "").toUpperCase();
                    return (
                      <p className={`text-${colorMap[key] || "gray-500"} uppercase`}>
                        {statusMap[key] || key}
                      </p>
                    );
                  },
                },
              ]}
            />
          )}
        </div>
      )}

      {isFetching && (
        <div className="h-[300px] flex flex-col justify-center gap-5 items-center">
          <AiOutlineLoading3Quarters size={100} className="animate-spin text-primary-500" />
          <p className="text-gray-500 animate-pulse">Getting call logs...</p>
        </div>
      )}

      {!isFetching && allCalls.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No call records found.</p>
      )}
    </Layout>
  );
};
