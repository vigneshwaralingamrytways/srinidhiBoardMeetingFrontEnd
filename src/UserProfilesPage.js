import React from 'react';
import { FaUserEdit, FaFileSignature } from 'react-icons/fa';
import { ROLES, INDUSTRY_COLORS, TopBar, getProfile } from './companyManagementShared';

const UserProfilesPage = ({ users, roles, companies, onViewProfile, onEditProfile, onEditDisclosure }) => (
  <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
    <TopBar title="Members Profiles" subtitle="Profile Management" />

    <div style={{ padding: "24px 32px", flex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
        {users.map((u, i) => {
          const profile = getProfile(u);

          /* build list of companies this user is assigned to */
          const userRoles = Object.entries(roles[u.id] || {})
            .filter(([, v]) => v)
            .map(([cid, rid]) => ({
              company: companies.find(c => String(c.id) === String(cid)),
              role:    ROLES.find(r => r.id === rid),
            }))
            .filter(x => x.company && x.role);

          return (
            <div
              key={u.id}
              onClick={() => onViewProfile(u)}
              style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "20px", animation: "cmFadeUp .3s " + (i * 0.06) + "s ease both", cursor: "pointer", transition: "border-color .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)50"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              {/* header row: avatar + name + action buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <img
                  src={u.img || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name)}
                  alt={u.name}
                  style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--gold)", background: "var(--bg3)", flexShrink: 0 }}
                  onError={e => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name); }}
                />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>{u.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
                  <span style={{ fontSize: 10, background: "var(--bg4)", color: "var(--text3)", padding: "2px 8px", borderRadius: 2, letterSpacing: "0.08em", display: "inline-block", marginTop: 4 }}>{u.department}</span>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    title="Edit profile"
                    onClick={e => { e.stopPropagation(); onEditProfile(u); }}
                    style={{ background: "none", border: "1px solid var(--border2)", color: "var(--gold)", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <FaUserEdit />
                  </button>
                  <button
                    title="Edit disclosure"
                    onClick={e => { e.stopPropagation(); onEditDisclosure(u); }}
                    style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <FaFileSignature />
                  </button>
                </div>
              </div>

              {/* profile summary */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>Profile Summary</p>
                <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>Employee ID: {profile.employeeId || "Not provided"}</p>
                <p style={{ fontSize: 12, color: "var(--text2)" }}>Location: {profile.location || "Not provided"}</p>
              </div>

              {/* company-role assignments */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 14 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>
                  Company Access ({userRoles.length})
                </p>
                {userRoles.length === 0 && (
                  <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No company access assigned</p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {userRoles.slice(0, 1).map(({ company, role }) => (
                    <div key={company.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                        <div style={{ width: 20, height: 20, background: `${INDUSTRY_COLORS[company.industry] || "#C9A252"}18`, border: `1px solid ${INDUSTRY_COLORS[company.industry] || "#C9A252"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 600, color: INDUSTRY_COLORS[company.industry] || "#C9A252", flexShrink: 0 }}>{company.logo}</div>
                        <span style={{ fontSize: 11, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{company.name}</span>
                      </div>
                      <span style={{ fontSize: 10, color: role.color, background: role.color + "15", border: "1px solid " + role.color + "30", padding: "2px 8px", borderRadius: 2, letterSpacing: "0.06em", whiteSpace: "nowrap", flexShrink: 0 }}>{role.label}</span>
                    </div>
                  ))}
                  {userRoles.length > 1 && (
                    <p style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.08em", marginTop: 2 }}>+ {userRoles.length - 3} more</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default UserProfilesPage;
