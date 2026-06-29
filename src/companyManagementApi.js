const API_URL = import.meta.env.VITE_COMPANY_MANAGEMENT_API_URL || "";

const sampleCompanyDocs = [
  {
    id: "sample-coi",
    type: "Certificate Of Incorporation",
    name: "Certificate_Of_Incorporation.pdf",
    size: 245760,
    mimeType: "application/pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    uploadedAt: "2026-01-12",
  },
  {
    id: "sample-moa",
    type: "MOA",
    name: "Memorandum_Of_Association.pdf",
    size: 188420,
    mimeType: "application/pdf",
    url: "https://www.iitrpr.ac.in/physics/uploads/dummy.pdf",
    uploadedAt: "2026-01-12",
  },
  {
    id: "sample-aoa",
    type: "AOA",
    name: "Articles_Of_Association.pdf",
    size: 204900,
    mimeType: "application/pdf",
    url: "https://neiafmr.org.in/wp-content/uploads/2022/01/dummy.pdf",
    uploadedAt: "2026-01-12",
  },
  {
    id: "sample-pan",
    type: "PAN",
    name: "Company_PAN.pdf",
    size: 98240,
    mimeType: "application/pdf",
    url: "https://www.panafricanenergy.com/wp-content/uploads/2022/09/dummy.pdf",
    uploadedAt: "2026-01-12",
  },
  {
    id: "sample-gst",
    type: "GST Certificate",
    name: "GST_Certificate.pdf",
    size: 126500,
    mimeType: "application/pdf",
    url: "https://www.georgeinstitute.org/sites/default/files/2025-04/dummy.pdf",
    uploadedAt: "2026-01-12",
  },
];

const defaultDirectors = [
  {
    name: "Rajesh Kumar",
    din: "01234567",
    email: "rajesh@company.com",
    contact: "+91 9876543210",
    position: "Managing Director",

    joiningDate: "2018-04-15",
    leavingDate: "",
    leavingReason: "",
    otherLeavingReason: ""
  },

  {
    name: "Priya Sharma",
    din: "02345678",
    email: "priya@company.com",
    contact: "+91 9876543211",
    position: "Whole Time Director",

    joiningDate: "2020-07-10",
    leavingDate: "2025-03-31",
    leavingReason: "Retirement",
    otherLeavingReason: ""
  },

  {
    name: "Arun Nair",
    din: "03456789",
    email: "arun@company.com",
    contact: "+91 9876543212",
    position: "Independent Director",

    joiningDate: "2021-01-20",
    leavingDate: "2024-12-15",
    leavingReason: "Others",
    otherLeavingReason: "Moved To Advisory Board"
  }
];
const defaultShareholders = [
  {
    name: "Rajesh Kumar",
    shares: 50000,
    percentage: 50,

    acquisitionType: "Promoter Allocation",
    issueDate: "2018-04-15",

    kycDocName: "Rajesh_KYC.pdf",
    kycDocUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },

  {
    name: "Priya Sharma",
    shares: 30000,
    percentage: 30,

    acquisitionType: "Private Placement",
    issueDate: "2020-07-10",

    kycDocName: "Priya_KYC.pdf",
    kycDocUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },

  {
    name: "Arun Nair",
    shares: 20000,
    percentage: 20,

    acquisitionType: "Share Transfer",
    issueDate: "2021-01-20",

    kycDocName: "Arun_KYC.pdf",
    kycDocUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

const staticCompanies = [
  {
    id: 1,
    name: "Meridian Capital Group",
    logo: "MC",
    industry: "Finance",
    country: "United States",
    employees: 1240,
    status: "active",
    tier: "enterprise",
    founded: 2001,
    revenue: "$4.2B",
    contactNumber: "+1 212 555 0148",
    state: "New York",
    pincode: "10001",
    registeredAddress: "120 Park Avenue, New York, NY 10001",
    companySecretaryName: "Emma Richardson",
    companySecretaryContact: "+1 212 555 0199",
    companySecretaryEmail: "secretary@meridian.com",
    cin: "U65990NY2001PTC123456",
    gstNumber: "22AAAAA0000A1Z5",
    panNumber: "AAAAA0000A",
    tan: "PDES03028F",
    stateOfRegistration: "New York",
    entityType: "Private Limited",
    taxRegime: "Regular",
    directors: defaultDirectors,
    shareholders: defaultShareholders,
    attachedDocs: sampleCompanyDocs,
  },
  {
    id: 2,
    name: "Synthex Pharma",
    logo: "SP",
    industry: "Healthcare",
    country: "Germany",
    employees: 890,
    status: "active",
    tier: "pro",
    founded: 2009,
    revenue: "$1.8B",
    contactNumber: "+49 30 5550 1400",
    state: "Berlin",
    pincode: "10115",
    registeredAddress: "Invalidenstrasse 48, Berlin 10115",
    companySecretaryName: "Lena Hoffmann",
    companySecretaryContact: "+49 30 5550 1411",
    companySecretaryEmail: "secretary@synthexpharma.com",
    cin: "U24230BE2009PTC234567",
    gstNumber: "07BBBBB1111B1Z6",
    panNumber: "BBBBB1111B",
    tan: "BLRS12345G",
    stateOfRegistration: "Berlin",
    entityType: "Private Limited",
    taxRegime: "Regular",
    directors: defaultDirectors,
    shareholders: defaultShareholders,
    attachedDocs: sampleCompanyDocs,
  },
  {
    id: 3,
    name: "Aether Dynamics",
    logo: "AD",
    industry: "Aerospace",
    country: "United Kingdom",
    employees: 2100,
    status: "active",
    tier: "enterprise",
    founded: 1995,
    revenue: "$6.7B",
    contactNumber: "+44 20 7946 0812",
    state: "London",
    pincode: "EC1A 1BB",
    registeredAddress: "18 King William Street, London EC1A 1BB",
    companySecretaryName: "Oliver Hughes",
    companySecretaryContact: "+44 20 7946 0890",
    companySecretaryEmail: "secretary@aetherdynamics.com",
    cin: "U35300LD1995PLC345678",
    gstNumber: "29CCCCC2222C1Z7",
    panNumber: "CCCCC2222C",
    tan: "LOND54321K",
    stateOfRegistration: "London",
    entityType: "Public Limited",
    taxRegime: "Regular",
    directors: defaultDirectors,
    shareholders: defaultShareholders,
    attachedDocs: sampleCompanyDocs,
  },
  {
    id: 4,
    name: "Phoenix Capital Group",
    logo: "MC",
    industry: "Finance",
    country: "United States",
    employees: 1240,
    status: "active",
    tier: "enterprise",
    founded: 2001,
    revenue: "$4.2B",
    contactNumber: "+1 212 555 0148",
    state: "New York",
    pincode: "10001",
    registeredAddress: "120 Park Avenue, New York, NY 10001",
    companySecretaryName: "Emma Richardson",
    companySecretaryContact: "+1 212 555 0199",
    companySecretaryEmail: "secretary@meridian.com",
    cin: "U65990NY2001PTC123456",
    gstNumber: "22AAAAA0000A1Z5",
    panNumber: "AAAAA0000A",
    tan: "PDES03028F",
    stateOfRegistration: "New York",
    entityType: "Private Limited",
    taxRegime: "Regular",
    directors: defaultDirectors,
    shareholders: defaultShareholders,
    attachedDocs: sampleCompanyDocs,
  },
  {
    id: 5,
    name: "Biotic Pharma",
    logo: "SP",
    industry: "Healthcare",
    country: "Germany",
    employees: 890,
    status: "active",
    tier: "pro",
    founded: 2009,
    revenue: "$1.8B",
    contactNumber: "+49 30 5550 1400",
    state: "Berlin",
    pincode: "10115",
    registeredAddress: "Invalidenstrasse 48, Berlin 10115",
    companySecretaryName: "Lena Hoffmann",
    companySecretaryContact: "+49 30 5550 1411",
    companySecretaryEmail: "secretary@synthexpharma.com",
    cin: "U24230BE2009PTC234567",
    gstNumber: "07BBBBB1111B1Z6",
    panNumber: "BBBBB1111B",
    tan: "BLRS12345G",
    stateOfRegistration: "Berlin",
    entityType: "Private Limited",
    taxRegime: "Regular",
    directors: defaultDirectors,
    shareholders: defaultShareholders,
    attachedDocs: sampleCompanyDocs,
  },
  {
    id: 6,
    name: "Chone Dynamics",
    logo: "AD",
    industry: "Aerospace",
    country: "United Kingdom",
    employees: 2100,
    status: "active",
    tier: "enterprise",
    founded: 1995,
    revenue: "$6.7B",
    contactNumber: "+44 20 7946 0812",
    state: "London",
    pincode: "EC1A 1BB",
    registeredAddress: "18 King William Street, London EC1A 1BB",
    companySecretaryName: "Oliver Hughes",
    companySecretaryContact: "+44 20 7946 0890",
    companySecretaryEmail: "secretary@aetherdynamics.com",
    cin: "U35300LD1995PLC345678",
    gstNumber: "29CCCCC2222C1Z7",
    panNumber: "CCCCC2222C",
    tan: "LOND54321K",
    stateOfRegistration: "London",
    entityType: "Public Limited",
    taxRegime: "Regular",
    directors: defaultDirectors,
    shareholders: defaultShareholders,
    attachedDocs: sampleCompanyDocs,
  },
  {
    id: 7,
    name: "Meridian  Group",
    logo: "MC",
    industry: "Finance",
    country: "United States",
    employees: 1240,
    status: "active",
    tier: "enterprise",
    founded: 2001,
    revenue: "$4.2B",
    contactNumber: "+1 212 555 0148",
    state: "New York",
    pincode: "10001",
    registeredAddress: "120 Park Avenue, New York, NY 10001",
    companySecretaryName: "Emma Richardson",
    companySecretaryContact: "+1 212 555 0199",
    companySecretaryEmail: "secretary@meridian.com",
    cin: "U65990NY2001PTC123456",
    gstNumber: "22AAAAA0000A1Z5",
    panNumber: "AAAAA0000A",
    tan: "PDES03028F",
    stateOfRegistration: "New York",
    entityType: "Private Limited",
    taxRegime: "Regular",
    directors: defaultDirectors,
    shareholders: defaultShareholders,
    attachedDocs: sampleCompanyDocs,
  },
  {
    id: 8,
    name: "Anox Pharma",
    logo: "SP",
    industry: "Healthcare",
    country: "Germany",
    employees: 890,
    status: "active",
    tier: "pro",
    founded: 2009,
    revenue: "$1.8B",
    contactNumber: "+49 30 5550 1400",
    state: "Berlin",
    pincode: "10115",
    registeredAddress: "Invalidenstrasse 48, Berlin 10115",
    companySecretaryName: "Lena Hoffmann",
    companySecretaryContact: "+49 30 5550 1411",
    companySecretaryEmail: "secretary@synthexpharma.com",
    cin: "U24230BE2009PTC234567",
    gstNumber: "07BBBBB1111B1Z6",
    panNumber: "BBBBB1111B",
    tan: "BLRS12345G",
    stateOfRegistration: "Berlin",
    entityType: "Private Limited",
    taxRegime: "Regular",
    directors: defaultDirectors,
    shareholders: defaultShareholders,
    attachedDocs: sampleCompanyDocs,
  },
  {
    id: 9,
    name: "Ether Dynamics",
    logo: "AD",
    industry: "Aerospace",
    country: "United Kingdom",
    employees: 2100,
    status: "active",
    tier: "enterprise",
    founded: 1995,
    revenue: "$6.7B",
    contactNumber: "+44 20 7946 0812",
    state: "London",
    pincode: "EC1A 1BB",
    registeredAddress: "18 King William Street, London EC1A 1BB",
    companySecretaryName: "Oliver Hughes",
    companySecretaryContact: "+44 20 7946 0890",
    companySecretaryEmail: "secretary@aetherdynamics.com",
    cin: "U35300LD1995PLC345678",
    gstNumber: "29CCCCC2222C1Z7",
    panNumber: "CCCCC2222C",
    tan: "LOND54321K",
    stateOfRegistration: "London",
    entityType: "Public Limited",
    taxRegime: "Regular",
    directors: defaultDirectors,
    shareholders: defaultShareholders,
    attachedDocs: sampleCompanyDocs,
  },
];

const staticUsers = [
  {
    id: 1,
    name: "Alexandra Chen",
    email: "a.chen@meridian.com",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    department: "Executive",
    avatar: "AC",
    profile: {
      contactNo: "+1 555 210 8841",
      phone: "+1 555 210 8841",
      employeeId: "DIR-001",
      joiningDate: "2021-04-12",
      emergencyContact: "Daniel Chen / +1 555 891 2400",
      dateOfBirth: "1982-08-14",
      gender: "Female",
      nationality: "American",
      passportId: "DIN00124567",
      residentialAddress: "24 Madison Avenue, New York, NY",
      mailingAddress: "24 Madison Avenue, New York, NY",
      signature: "",
      professionalEntries: [
        {
          companyName: "Meridian Capital Group",
          designation: "Executive Director",
          sharesHeld: "12000",
          sharePercentage: "4.8",
        },
        {
          companyName: "Aether Dynamics",
          designation: "Board Advisor",
          sharesHeld: "3000",
          sharePercentage: "1.2",
        },
      ],
      shareholdings: [],
      skills: [],
    },
    kycDocuments: [
      {
        id: "kyc-1",
        name: "Passport",
        type: "Passport",
        idNumber: "P1234567",
        expiry: "2029-08-14",
        fileData: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        mimeType: "application/pdf",
      },
      {
        id: "kyc-2",
        name: "PAN Card",
        type: "PAN",
        idNumber: "ABCDE1234F",
        expiry: "",
        fileData: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png",
        mimeType: "image/png",
      },
    ],
  },
  {
    id: 2,
    name: "Marcus Webb",
    email: "m.webb@meridian.com",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    department: "Operations",
    avatar: "MW",
    profile: {
      contactNo: "+1 555 334 9920",
      phone: "+1 555 334 9920",
      employeeId: "DIR-002",
      joiningDate: "2020-09-03",
      emergencyContact: "Laura Webb / +1 555 778 3100",
      dateOfBirth: "1978-11-22",
      gender: "Male",
      nationality: "American",
      passportId: "DIN00451290",
      residentialAddress: "88 Lakeview Road, Chicago, IL",
      mailingAddress: "88 Lakeview Road, Chicago, IL",
      signature: "",
      professionalEntries: [
        {
          companyName: "Meridian Capital Group",
          designation: "Operations Director",
          sharesHeld: "8500",
          sharePercentage: "3.4",
        },
      ],
      shareholdings: [],
      skills: [],
    },
    kycDocuments: [
      {
        id: "kyc-1",
        name: "Driver's License",
        type: "Driver's License",
        idNumber: "DL-9987234",
        expiry: "2027-03-15",
        fileData: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        mimeType: "application/pdf",
      },
      {
        id: "kyc-2",
        name: "Social Security Card",
        type: "SSN",
        idNumber: "XXX-XX-6789",
        expiry: "",
        fileData: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg",
        mimeType: "image/jpeg",
      },
    ],
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "p.sharma@meridian.com",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    department: "Finance",
    avatar: "PS",
    profile: {
      contactNo: "+91 98765 43210",
      phone: "+91 98765 43210",
      employeeId: "DIR-003",
      joiningDate: "2022-01-18",
      emergencyContact: "Amit Sharma / +91 99887 77665",
      dateOfBirth: "1986-05-19",
      gender: "Female",
      nationality: "Indian",
      passportId: "DIN00881234",
      residentialAddress: "14 Marine Drive, Mumbai",
      mailingAddress: "14 Marine Drive, Mumbai",
      signature: "",
      professionalEntries: [
        {
          companyName: "Meridian Capital Group",
          designation: "Finance Director",
          sharesHeld: "6200",
          sharePercentage: "2.5",
        },
      ],
      shareholdings: [],
      skills: [],
    },
    kycDocuments: [
      {
        id: "kyc-1",
        name: "Aadhar Card",
        type: "Aadhar",
        idNumber: "XXXX-XXXX-4521",
        expiry: "",
        fileData: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/A_confusing_street_sign.jpg/320px-A_confusing_street_sign.jpg",
        mimeType: "image/jpeg",
      },
      {
        id: "kyc-2",
        name: "PAN Card",
        type: "PAN",
        idNumber: "PQRST5678G",
        expiry: "",
        fileData: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        mimeType: "application/pdf",
      },
      {
        id: "kyc-3",
        name: "Passport",
        type: "Passport",
        idNumber: "Z9876543",
        expiry: "2031-05-22",
        fileData: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png",
        mimeType: "image/png",
      },
    ],
  },
  {
    id: 4,
    name: "James Okafor",
    email: "j.okafor@meridian.com",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
    department: "Technology",
  },
  {
    id: 5,
    name: "Sofia Lindgren",
    email: "s.lindgren@meridian.com",
    img: "https://randomuser.me/api/portraits/women/21.jpg",
    department: "Marketing",
  },
  {
    id: 6,
    name: "Raj Patel",
    email: "r.patel@meridian.com",
    img: "https://randomuser.me/api/portraits/men/51.jpg",
    department: "Legal",
  },
];

const staticRoleAssignments = {
  1: { 1: "Directore", 3: "Executive Director" },
  2: { 1: "Executive Director" },
  3: { 1: "Board Member" },
  4: { 2: "Board Member" },
  5: { 3: "Board Member" },
  6: {},
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(clone(value)), 220));
const fromInitials = (name) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const request = async (path, options) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
};
const formDataRequest = async (url, formData) => {
  const response = await fetch(`${API_URL}${url}`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Upload failed: ${response.status}`);
  }
  return response.json();
};
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
    return request("/company/getAll", { method: "GET" })
      .then(companies => ({ companies, users: [], roleAssignments: {} }));
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
    return request("/company/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async updateCompany(id, payload) {
    return request(`/company/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async uploadDocument(companyId, documentType, file) {
    const formData = new FormData();
    formData.append("companyId", companyId);
    formData.append("documentType", documentType);
    formData.append("file", file);
    return formDataRequest("/companyDocuments/fileUpload", formData);
  },
  async createDirector(directorData) {
    return request("/companyDirectors/create", {
      method: "POST",
      body: JSON.stringify(directorData),
    });
  },
  async createShareholder(shareholderData) {
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
};
