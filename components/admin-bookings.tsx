"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const statuses = ["AWAITING_REVIEW", "QUOTE_SENT", "ADVANCE_PENDING", "CONFIRMED", "TEAM_ASSIGNED", "COMPLETED", "CANCELLED"];
const labels: Record<string, string> = Object.fromEntries(statuses.map((status) => [status, status.toLowerCase().replaceAll("_", " ")]));

type Booking = {
  id: number;
  reference: string;
  customerName: string;
  phone: string;
  occasion: string;
  eventDate: string;
  city: string;
  pincode: string;
  status: string;
  createdAt: string;
};

export function AdminBookings({ initialBookings }: { initialBookings: Booking[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialBookings);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchesQuery = !normalized || [item.customerName, item.phone, item.reference, item.occasion, item.city, item.pincode]
        .some((value) => value.toLowerCase().includes(normalized));
      return matchesStatus && matchesQuery;
    });
  }, [items, query, statusFilter]);

  async function changeStatus(id: number, status: string) {
    setBusyId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const responseText = await response.text();
      const result = responseText ? JSON.parse(responseText) as { error?: string } : {};
      if (response.status === 401) {
        router.replace("/admin/login");
        router.refresh();
        return;
      }
      if (!response.ok) throw new Error(result.error || "Status update failed.");
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Status update failed.");
    } finally {
      setBusyId(null);
    }
  }

  if (!items.length) {
    return <div className="admin-empty"><strong>No booking requests yet.</strong><p>New customer requests will appear here automatically.</p></div>;
  }

  return (
    <>
      <div className="admin-tools">
        <label>
          <Search size={16} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone, city, or reference" />
        </label>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter bookings by status">
          <option value="ALL">All statuses</option>
          {statuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}
        </select>
      </div>
      {error && <p className="admin-update-error" role="alert">{error}</p>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Customer</th><th>Ceremony</th><th>Event</th><th>Reference</th><th>Status</th></tr></thead>
          <tbody>{visibleItems.map((item) => (
            <tr key={item.id}>
              <td><strong>{item.customerName}</strong><span><a href={`tel:${item.phone}`}>{item.phone}</a></span></td>
              <td><strong>{item.occasion}</strong><span>{item.city} · {item.pincode}</span></td>
              <td>{new Date(item.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
              <td><code>{item.reference}</code></td>
              <td>
                <select value={item.status} disabled={busyId === item.id} onChange={(event) => changeStatus(item.id, event.target.value)}>
                  {statuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}
                </select>
              </td>
            </tr>
          ))}</tbody>
        </table>
        {!visibleItems.length && <div className="admin-empty"><strong>No matching bookings.</strong><p>Try a different search or status filter.</p></div>}
      </div>
    </>
  );
}
