const API_URL = import.meta.env.VITE_COMPANY_MANAGEMENT_API_URL || "";




const clone = (value) => JSON.parse(JSON.stringify(value));
const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(clone(value)), 220));
const fromInitials = (name) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const request = async (path, options) => {
  const token = localStorage.getItem('token');
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options?.headers || {}),
  };
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {

    return { message: text || "Success", success: true };
  }
};
const formDataRequest = async (url, formData) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_URL}${url}`, {
    method: "POST",
    body: formData,
    headers,
  });
  // if (!response.ok) {
  //   const error = await response.json().catch(() => ({}));
  //   throw new Error(error.message || `Upload failed: ${response.status}`);
  // }
  if (!response.ok) {
    let errorMsg = `Upload failed: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
      const text = await response.text();
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return { success: true };
  // return response.json();
};
const mapCompany = (apiCompany) => ({
  id: apiCompany.companyId,
  name: apiCompany.companyName,
  logo: apiCompany.avatar || apiCompany.companyName?.slice(0, 2).toUpperCase() || "CO",
  contactNumber: apiCompany.contactNumber,
  state: apiCompany.state,
  pincode: apiCompany.pinCode,
  country: apiCompany.country,
  companySecretaryName: apiCompany.companySecretaryName,
  companySecretaryContact: apiCompany.secretaryContactNo,
  companySecretaryEmail: apiCompany.secretaryEmail,
  registeredAddress: apiCompany.registeredAddress,
  cin: apiCompany.cinNo,
  gstNumber: apiCompany.gstNo,
  panNumber: apiCompany.panNo,
  tan: apiCompany.tanNo,
  stateOfRegistration: apiCompany.stateOfRegistration,
  entityType: apiCompany.entityType,
  taxRegime: apiCompany.taxRegime,
  status: apiCompany.isActive ? "active" : "inactive",
  industry: apiCompany.industry || "General",
  employees: apiCompany.employees || 0,
  tier: apiCompany.tier || "tier",
  founded: apiCompany.founded || new Date().getFullYear(),
  revenue: apiCompany.revenue || "0",
  directors: [],
  shareholders: [],
  attachedDocs: []
});

const mapBoardMember = (api) => ({
  id: api.boardMemberId,
  name: api.boardMemberName,
  avatar: api.avatar,
  email: api.emailAddress,
  contactNo: api.contactNumber,
  department: api.designation,
  education: api.education,
  experience: api.experience,
  username: api.userName,
  password: api.password,
  dateOfBirth: api.dateOfBirth,
  gender: api.gender,
  nationality: api.nationality,
  din: api.din,
  phone: api.phone,
  emergencyContact: api.emergencyContact,
  residentialAddress: api.residentialAddress,
  mailingAddress: api.preferredMailingAddress,
  isActive: api.isActive,

  profile: {
    phone: api.phone,
    contactNo: api.contactNumber,
    education: api.education,
    experience: api.experience,
    employeeId: "",
    joiningDate: "",
    emergencyContact: api.emergencyContact,
    signature: "",
    dateOfBirth: api.dateOfBirth,
    gender: api.gender,
    nationality: api.nationality,
    passportId: api.din,
    residentialAddress: api.residentialAddress,
    mailingAddress: api.preferredMailingAddress,
    professionalEntries: [],
    kycDocuments: [],
  },
});
export const companyManagementApi = {


  //   async getBootstrap() {
  //   if (API_URL.startsWith("static://")) {
  //     return wait({
  //       companies: staticCompanies,
  //       users: staticUsers,
  //       roleAssignments: staticRoleAssignments,
  //     });
  //   }
  //   return request("/bootstrap");
  // },
  async getBootstrap() {
    console.log(" getBootstrap")
    return request("/company/getAll", { method: "GET" })
      .then(companies => ({ companies: companies.map(mapCompany), users: [], roleAssignments: {} }));
  },

  async createCompany(payload) {
    // if (API_URL.startsWith("static://")) {
    //   return wait({
    //     id: Date.now(),
    //     logo: payload.logo || fromInitials(payload.name),
    //     ...payload,
    //     employees: Number(payload.employees) || 0,
    //     founded: Number(payload.founded) || new Date().getFullYear(),
    //   });
    // }
    // return request("/companies", { method: "POST", body: JSON.stringify(payload) });
    console.log(" val for save==", payload)
    // return request("/company/create", {
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // });
    const created = await request("/company/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return mapCompany(created);
  },
  // async updateCompany(id, payload) {
  //   return request(`/company/update/${id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(payload),
  //   });
  // },
  async deleteDocument(id) {
    console.log("deleteDocument", id);
    return request(`/companyDocuments/delete/${id}`, { method: "DELETE" });
  },
  async uploadDocument(companyId, documentType, file) {
    const formData = new FormData();
    formData.append("companyId", companyId);
    formData.append("documentType", documentType);
    formData.append("file", file);
    console.log("=== file uplaods", formData)
    return formDataRequest("/companyDocuments/fileUpload", formData);
  },

  async createDirector(directorData) {
    console.log("dir save val", directorData)
    return request("/companyDirectors/create", {
      method: "POST",
      body: JSON.stringify(directorData),
    });
  },
  async getDocumentsByCompany(companyId) {
    console.log("getDocumentsByCompany", companyId)
    return request(`/companyDocuments/getByCompany/${companyId}`, { method: "GET" });
  },
  async searchCompanies(company) {
    console.log("searchCompanies", company);

    const results = await request("/company/search", {
      method: "POST",
      body: JSON.stringify(company),
    });
    return results.map(mapCompany);
  },
  async getActiveDirectorsByCompany(companyId) {
    console.log("getActiveDirectorsByCompany", companyId)

    return request(`/companyDirectors/getAllDirectorsByCompanyActive/${companyId}`, {
      method: "GET"
    });
  },
  async updateCompany(id, payload) {
    console.log("updateCompany", payload)
    const updated = await request(`/company/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapCompany(updated);
  },
  async deleteDirector(id) {
    console.log("deleteDirector", id)
    return request(`/companyDirectors/delete/${id}`, { method: "DELETE" });
  },

  async deleteShareholder(id) {
    console.log("deleteShareholder", id)
    return request(`/companyShareHolder/delete/${id}`, { method: "DELETE" });
  },
  async updateDirector(id, directorData) {
    console.log("updateDirector", directorData)
    return request(`/companyDirectors/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(directorData),
    });
  },

  async updateShareholder(id, shareholderData) {
    console.log("updateShareholder", shareholderData)
    return request(`/companyShareHolder/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(shareholderData),
    });
  },
  async getActiveShareholdersByCompany(companyId) {
    console.log("getActiveShareholdersByCompany", companyId)
    return request(`/companyShareHolder/getAllShareHolderByCompanyActive/${companyId}`, {
      method: "GET"
    });
  },
  async createShareholder(shareholderData) {
    console.log("createShareholder", shareholderData)
    return request("/companyShareHolder/create", {
      method: "POST",
      body: JSON.stringify(shareholderData),
    });
  },
  async createUser(payload) {
    if (API_URL.startsWith("static://")) {
      return wait({
        id: Date.now(),
        avatar: payload.avatar || fromInitials(payload.name),
        ...payload,
      });
    }
    return request("/users", { method: "POST", body: JSON.stringify(payload) });
  },

  async updateUser(userId, payload) {
    if (API_URL.startsWith("static://")) {
      return wait({
        id: userId,
        avatar: payload.avatar || fromInitials(payload.name || ""),
        ...payload,
      });
    }

    return request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async updateRole({ userId, companyId, roleId }) {
    if (API_URL.startsWith("static://")) {
      return wait({ userId, companyId, roleId: roleId || null });
    }
    return request("/roles", {
      method: "PUT",
      body: JSON.stringify({ userId, companyId, roleId: roleId || null }),
    });
  },

  ///////////////////
  async getAllBoardMembers() {
    const data = await request("/boardMember/getAll", { method: "GET" });
    return data.map(mapBoardMember);
  },

  async createBoardMember(payload) {
    console.log(" createBoardMember", payload)
    const created = await request("/boardMember/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return mapBoardMember(created);
  },

  async updateBoardMember(id, payload) {
    const updated = await request(`/boardMember/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapBoardMember(updated);
  },

  async deleteBoardMember(id) {
    return request(`/boardMember/delete/${id}`, { method: "DELETE" });
  },

  async getBoardMemberProfile(boardMemberId) {
    const data = await request(`/boardMemberProfile/findByBoardMemberId/${boardMemberId}`, { method: "GET" });
    return data;
  },
  async createBoardMemberProfile(boardMemberId, documentType, file) {

    const formData = new FormData();
    formData.append("boardMemberId", boardMemberId);
    formData.append("documentType", documentType);
    console.log("createBoardMemberProfile", formData)
    if (file) formData.append("file", file);

    return formDataRequest("/boardMemberProfile/create", formData);
  },
  async updateBoardMemberProfile(id, boardMemberId, documentType, file) {

    const formData = new FormData();
    formData.append("boardMemberId", boardMemberId);
    formData.append("documentType", documentType);
    console.log("updateBoardMemberProfile", id, formData)
    if (file) formData.append("file", file);

    return formDataRequest(`/boardMemberProfile/update/${id}`, formData);
  },

  async deleteBoardMemberProfile(id) {
    console.log("deleteBoardMemberProfile", id)
    return request(`/boardMemberProfile/delete/${id}`, { method: "DELETE" });
  },

  ////

  async createProfessionalInfo(payload) {
    console.log(" createProfessionalInfo", payload)
    return request("/BoardMemberProfessionalInfo/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateProfessionalInfo(id, payload) {
    return request(`/BoardMemberProfessionalInfo/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteProfessionalInfo(id) {
    return request(`/BoardMemberProfessionalInfo/delete/${id}`, { method: "DELETE" });
  },

  async getProfessionalInfoByBoardMember(boardMemberId) {
    const data = await request(`/BoardMemberProfessionalInfo/getByBoardMember/${boardMemberId}`, {
      method: "GET",
    });
    console.log("data for prof", data)
    const mappedData = data.map(item => ({
      id: item.boardMemberProfessionalInfoId,
      companyName: item.companyName || "",
      designation: item.designation || "",
      sharesHeld: item.noOfShares || "",
      sharePercentage: item.holdingPercentage || "",
      isNew: false
    }));
    console.log("mappedData", mappedData)
    return mappedData;
  },

  /////
  async createKycDocument(payload) {
    console.log("createKycDocument", payload)
    return request("/BoardMemberKycDocuments/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async updateKycDocument(id, boardMemberId, documentName, idType, idNumber, expiryDate, file, remarks) {
    const formData = new FormData();
    formData.append("boardMemberId", boardMemberId);
    formData.append("documentName", documentName);
    formData.append("idType", idType);
    formData.append("idNumber", idNumber);
    if (expiryDate) formData.append("expiryDate", expiryDate);
    if (remarks) formData.append("remarks", remarks);
    if (file) formData.append("file", file);
    return formDataRequest(`/BoardMemberKycDocuments/fileUpdate/${id}`, formData);
  },
  async deleteKycDocument(id) {
    return request(`/BoardMemberKycDocuments/delete/${id}`, { method: "DELETE" });
  },

  async getKycDocumentsByBoardMember(boardMemberId) {
    const data = await request(`/BoardMemberKycDocuments/getByBoardMember/${boardMemberId}`, {
      method: "GET",
    });
    return data.map(doc => ({
      id: doc.boardMemberKycDocumentsId,
      name: doc.documentName || "",
      type: doc.idType || "",
      idNumber: doc.idNumber || "",
      expiry: doc.expiryDate || "",
      fileData: doc.fileUrl || doc.filePath,
      mimeType: doc.extention,
      isNew: false
    }));
  },
  async uploadKycDocument(boardMemberId, documentName, idType, idNumber, expiryDate, file) {
    const formData = new FormData();
    formData.append("boardMemberId", boardMemberId);
    formData.append("documentName", documentName);
    formData.append("idType", idType);
    formData.append("idNumber", idNumber);
    if (expiryDate) formData.append("expiryDate", expiryDate);
    // console.log("uploadKycDocument", formData)
    formData.append("file", file);
    console.log("uploadKycDocument", formData)
    return formDataRequest("/BoardMemberKycDocuments/fileUpload", formData);
  },
  ////
  async createDisclosure(payload) {
    console.log("createDisclosure", payload);
    return request("/boardMemberDisclosureCompanies/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateDisclosure(id, payload) {
    console.log("updateDisclosure", id, payload);
    return request(`/boardMemberDisclosureCompanies/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async deleteDisclosure(id) {
    return request(`/boardMemberDisclosureCompanies/delete/${id}`, { method: "DELETE" });
  },
  async getDisclosuresByBoardMember(boardMemberId) {
    const data = await request(`/boardMemberDisclosureCompanies/getByBoardMember/${boardMemberId}`, {
      method: "GET",
    });
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  },
};
