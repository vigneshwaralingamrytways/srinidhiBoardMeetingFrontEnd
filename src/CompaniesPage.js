import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { INDUSTRY_COLORS, statusBadge, tierBadge, TopBar, buttonBase } from './companyManagementShared';

const CompaniesPage = ({ companies, onSelectCompany, onAddCompany }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [view, setView] = useState("table");
  // const handleSearch = async (val) => {
  //   setSearch(val);
  //   if (!val.trim()) return;
  //   const results = await companyManagementApi.searchCompanies({ companyName: val });
  //   setCompanies(results);
  // };
  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchTier = filterTier === "all" || c.tier === filterTier;
    return matchSearch && matchStatus && matchTier;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "employees") return b.employees - a.employees;
    if (sortBy === "founded") return a.founded - b.founded;
    return 0;
  });

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      <TopBar
        title="Company Registry"
        subtitle="Corporate Management"
        action={
          <button
            onClick={onAddCompany}
            style={{ background: "var(--gold)", border: "none", color: "var(--bg)", padding: "8px 16px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)", cursor: "pointer", fontWeight: 500 }}
          >
            + Add Company
          </button>
        }
      />

      <div style={{ padding: "24px 32px", flex: 1 }}>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap", animation: "cmFadeUp .4s .1s ease both" }}>
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}>
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies, industry, country..."
              style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)", padding: "10px 12px 10px 34px", fontSize: 12, outline: "none", borderRadius: 0 }}
            />
          </div>

          {[
            { val: filterStatus, set: setFilterStatus, opts: ["all", "active", "trial", "inas"], label: "Status" },
            { val: filterTier, set: setFilterTier, opts: ["all", "enterprise", "pro", "starter"], label: "Tier" },
            { val: sortBy, set: setSortBy, opts: ["name", "employees", "founded"], label: "Sort" },
          ].map(({ val, set, opts, label }) => (
            <select
              key={label}
              value={val}
              onChange={e => set(e.target.value)}
              style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text2)", padding: "10px 12px", fontSize: 11, outline: "none", cursor: "pointer", letterSpacing: "0.05em" }}
            >
              {opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          ))}

          <div style={{ display: "flex", border: "1px solid var(--border)" }}>
            {[
              { v: "table", icon: <svg viewBox="0 0 16 16" fill="none" width="14"><rect x="1" y="1" width="14" height="14" rx="0" stroke="currentColor" strokeWidth="1.2" /><line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2" /><line x1="1" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="1.2" /><line x1="6" y1="1" x2="6" y2="15" stroke="currentColor" strokeWidth="1.2" /></svg> },
              { v: "grid", icon: <svg viewBox="0 0 16 16" fill="none" width="14"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /></svg> },
            ].map(({ v, icon }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{ padding: "8px 12px", background: view === v ? "var(--gold)15" : undefined, border: "none", color: view === v ? "var(--gold)" : "var(--text3)", cursor: "pointer" }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE VIEW */}
        {view === "table" && (
          <div style={{ border: "1px solid var(--border)", overflow: "hidden", animation: "cmFadeUp .4s .15s ease both" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border2)", background: "var(--bg3)" }}>
                  {["Company", "Industry", "Country", "Employees", "Revenue", "Status", "Tier", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", fontSize: 9, letterSpacing: "0.22em", color: "var(--text3)", textTransform: "uppercase", textAlign: "left", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: "1px solid var(--border)", transition: "background .12s", cursor: "pointer", animation: `cmFadeUp .3s ${i * 0.04}s ease both` }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                    onClick={() => onSelectCompany(c)}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: `${INDUSTRY_COLORS[c.industry] || "#C9A252"}18`, border: `1px solid ${INDUSTRY_COLORS[c.industry] || "#C9A252"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: INDUSTRY_COLORS[c.industry] || "#C9A252", letterSpacing: "0.05em", flexShrink: 0 }}>{c.logo}</div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{c.name}</p>
                          <p style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.05em" }}>Est. {c.founded}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 11, color: INDUSTRY_COLORS[c.industry] || "var(--text2)", letterSpacing: "0.05em" }}>{c.industry}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text2)" }}>{c.country}</td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>{c.employees.toLocaleString()}</td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--gold)", fontVariantNumeric: "tabular-nums" }}>{c.revenue}</td>
                    <td style={{ padding: "14px 16px" }}>{statusBadge(c.status)}</td>
                    <td style={{ padding: "14px 16px" }}>{tierBadge(c.tier)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={e => { e.stopPropagation(); onSelectCompany(c); }}
                        style={{ background: "none", border: "1px solid var(--border2)", color: "var(--gold)", padding: "5px 12px", fontSize: 10, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "var(--font-mono)", transition: "all .15s", textTransform: "uppercase" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)15"; e.currentTarget.style.borderColor = "var(--gold)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--border2)"; }}
                      >
                        Members <FaArrowRight />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: "48px", textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
                No companies match your search.
              </div>
            )}
          </div>
        )}

        {/* GRID VIEW */}
        {view === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16, animation: "cmFadeUp .4s .15s ease both" }}>
            {filtered.map((c, i) => (
              <div
                key={c.id}
                onClick={() => onSelectCompany(c)}
                style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "20px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "border-color .15s", animation: `cmFadeUp .3s ${i * 0.05}s ease both` }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)50"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${INDUSTRY_COLORS[c.industry] || "#C9A252"},transparent)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, background: `${INDUSTRY_COLORS[c.industry] || "#C9A252"}15`, border: `1px solid ${INDUSTRY_COLORS[c.industry] || "#C9A252"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: INDUSTRY_COLORS[c.industry] || "#C9A252", letterSpacing: "0.05em" }}>{c.logo}</div>
                  {statusBadge(c.status)}
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 4, lineHeight: 1.3 }}>{c.name}</h3>
                <p style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.05em", marginBottom: 16 }}>{c.industry} · {c.country}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  <div>
                    <p style={{ fontSize: 9, letterSpacing: "0.15em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>Employees</p>
                    <p style={{ fontSize: 13, color: "var(--text)" }}>{c.employees.toLocaleString()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 9, letterSpacing: "0.15em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>Revenue</p>
                    <p style={{ fontSize: 13, color: "var(--gold)" }}>{c.revenue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 16, letterSpacing: "0.05em" }}>
          {filtered.length} of {companies.length} companies
        </p>
      </div>
    </div>
  );
};

export default CompaniesPage;
