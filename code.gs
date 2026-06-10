// =========================================================
// AI WEB - CODE.GS MERGED FINAL SAFE
// Merged from stable project script + Codex SyncHQ-safe logic + Owner/Admin/TL-FZR fixes.
// 
// What was cleaned:
// - Removed duplicate patch blocks and repeated function declarations.
// - Removed duplicate const declarations causing SyntaxError.
// - Kept final/latest logic for comment badge, read-by, process lock,
//   2 new bonuses, Auto SyncHQ today+yesterday, Admin/TL/FZR session login.
// - TL/FZR can view Admin Panel claim data; only Admin can run actions.
// =========================================================

const SOURCE_SPREADSHEET_ID = "1-MoAS4Bruy581reiZr4xgKKkAC4KChSs3BHjgGdB_KU";
const SHEET_BONUS_CLAIM = "BONUS_CLAIM";
const SHEET_THB_HELPER = "THB_HELPER";
const SHEET_USER_ACCESS = "USER_ACCESS";
const SHEET_USER_STAFF_ACCESS = "USER_STAFF_ACCESS";
const SHEET_ADMIN_ACCESS_REQUESTS = "ADMIN_ACCESS_REQUESTS";
const SHEET_CLAIM_CHAT_LOG = "CLAIM_CHAT_LOG";
const UPLOAD_FOLDER_ID = "1AYgRdXzRLEj3zoRHcGM3_mHDXtgYCzfG";
const SOURCE_CU_SPORT_SHEET = "酷體育瘋串串";
const SOURCE_WELCOME_SHEET = "體驗金777";
const SOURCE_PROMO_SYUKURAN_SHEET = "感恩禮金";
const SOURCE_TRANSFER_AGEN_SHEET = "轉線- Transfer Agen";
const SOURCE_VVIP_DEPO_SHEET = "VVIP-當日存款";
const SOURCE_VVIP_SPECIAL_SHEET = "VVIP-特別獎";
const SOURCE_LUCKY_MONEY_SHEET = "新升銅禮金Lucky money";
const SOURCE_HELLO_FRIENDS_SHEET = "介紹好友 FRIENDS";
const SOURCE_TIAP_HARI_SHEET = "(新)天天拿大獎";
const NO_SYNC_CATEGORIES = {
  "Direct Agent": true
};
const CU_SPORT_HQ_TIPE_MAP = {
  // MUST match HQ 酷體育瘋串串 column G data validation exactly.
  "CU Sport Crazy Parlay 128": "CU Sport Crazy Parlay 128",
  "CU Sport Crazy Parlay 168": "CU Sport Crazy Parlay 168",
  "CU Sport Crazy Parlay 268": "CU Sport Crazy Parlay 268",
  "CU Sport Crazy Parlay 328": "CU Sport Crazy Parlay 328",
  "CU Sport Crazy Parlay 388": "CU Sport Crazy Parlay 388",
  "CU Sport Crazy Parlay 588": "CU Sport Crazy Parlay 588",
  "CU Sport Crazy Parlay 688": "CU Sport Crazy Parlay 688",
  "CU Sport Crazy Parlay 888": "CU Sport Crazy Parlay 888"
};
const CU_SPORT_NOMINAL_MAP = {
  "CU Sport Crazy Parlay 128": 128,
  "CU Sport Crazy Parlay 168": 168,
  "CU Sport Crazy Parlay 268": 268,
  "CU Sport Crazy Parlay 328": 328,
  "CU Sport Crazy Parlay 388": 388,
  "CU Sport Crazy Parlay 588": 588,
  "CU Sport Crazy Parlay 688": 688,
  "CU Sport Crazy Parlay 888": 888
};
const CU_SPORT_PARLAY_HQ_MAP = {
  // User sees 3 Parlay / 4 Parlay / ... but HQ must receive exact Chinese validation value.
  "3 Parlay": "3串全過",
  "4 Parlay": "4串全過",
  "5 Parlay": "5串全過",
  "6 Parlay": "6串全過",
  "7 Parlay": "7串全過",
  "8 Parlay": "8串全過",
  "9 Parlay": "9串全過",
  "10 Parlay": "10串全過",
  "3串全過": "3串全過",
  "4串全過": "4串全過",
  "5串全過": "5串全過",
  "6串全過": "6串全過",
  "7串全過": "7串全過",
  "8串全過": "8串全過",
  "9串全過": "9串全過",
  "10串全過": "10串全過"
};
const CU_SPORT_TIPE_TO_PARLAY_HQ_MAP = {
  // Safety fallback: if old user UI did not send Parlay, backend can derive it from selected bonus.
  "CU Sport Crazy Parlay 128": "3串全過",
  "CU Sport Crazy Parlay 168": "4串全過",
  "CU Sport Crazy Parlay 268": "5串全過",
  "CU Sport Crazy Parlay 328": "6串全過",
  "CU Sport Crazy Parlay 388": "7串全過",
  "CU Sport Crazy Parlay 588": "8串全過",
  "CU Sport Crazy Parlay 688": "9串全過",
  "CU Sport Crazy Parlay 888": "10串全過"
};
const WELCOME_BONUS_SOURCE_MAP = {
  // UI lama -> format validasi HQ 體驗金777 kolom G
  "體驗金-完善資料/Bonus percobaan 28": "Bonus percobaan 28 (完善資料)",
  "體驗金-首存50/ Bonus percobaan 28 ( PERTAMA 50)": "Bonus percobaan 28 (首存50)",
  "體驗金-二存99/ Bonus percobaan48 (IN kedua 99)": "Bonus percobaan 48 (二存99)",
  "體驗金-三存99/ Bonus percobaan68 (IN ketiga 99）": "Bonus percobaan 68 (三存99)",
  "體驗金-完善+首存50/ Bonus percobaan56 (berhasil lengkapi data + IN 50 : 28+28）": "Bonus percobaan 56 (完善+首存50：28+28)",
  "體驗金-完善28+首存199/ Bonus percobaan148 (berhasil lengkapi data 28 + pertama  199）": "Bonus percobaan 148 (已領過28+首存199)",
  "體驗金-首存199/ Bonus percobaan177（IN pertama 199）": "Bonus percobaan 177 (首存199)",

  // Format baru yang sudah sama dengan HQ -> tetap support langsung
  "Bonus percobaan 28 (完善資料)": "Bonus percobaan 28 (完善資料)",
  "Bonus percobaan 56 (完善+首存50：28+28)": "Bonus percobaan 56 (完善+首存50：28+28)",
  "Bonus percobaan 48 (二存99)": "Bonus percobaan 48 (二存99)",
  "Bonus percobaan 68 (三存99)": "Bonus percobaan 68 (三存99)",
  "Bonus percobaan 148 (已領過28+首存199)": "Bonus percobaan 148 (已領過28+首存199)",
  "Bonus percobaan 177 (首存199)": "Bonus percobaan 177 (首存199)",
  "Bonus percobaan 28 (首存50)": "Bonus percobaan 28 (首存50)"
};
const WELCOME_NOMINAL_MAP = {
  "體驗金-完善資料/Bonus percobaan 28": 28,
  "體驗金-首存50/ Bonus percobaan 28 ( PERTAMA 50)": 28,
  "體驗金-二存99/ Bonus percobaan48 (IN kedua 99)": 48,
  "體驗金-三存99/ Bonus percobaan68 (IN ketiga 99）": 68,
  "體驗金-完善+首存50/ Bonus percobaan56 (berhasil lengkapi data + IN 50 : 28+28）": 56,
  "體驗金-完善28+首存199/ Bonus percobaan148 (berhasil lengkapi data 28 + pertama  199）": 148,
  "體驗金-首存199/ Bonus percobaan177（IN pertama 199）": 177,

  "Bonus percobaan 28 (完善資料)": 28,
  "Bonus percobaan 56 (完善+首存50：28+28)": 56,
  "Bonus percobaan 48 (二存99)": 48,
  "Bonus percobaan 68 (三存99)": 68,
  "Bonus percobaan 148 (已領過28+首存199)": 148,
  "Bonus percobaan 177 (首存199)": 177,
  "Bonus percobaan 28 (首存50)": 28
};
const WELCOME_AGEN_STATUS_MAP = {
  // MUST match HQ 體驗金777 column F data validation exactly.
  // Do not adjust spaces / hyphens / Chinese text.
  DW31: "WELCOME-FB",
  DW32: "WELCOME-FB",
  DW33: "WELCOME-FB",
  DW35: "WELCOME-FB",
  DW318: "WELCOME-FB (DW318)",

  DW36: "WELCOME-IG",

  DW311: "WELCOME-SEO",
  DW312: "WELCOME-SEO",
  DW315: "WELCOME-SEO",
  DW319: "WELCOME-SEO",
  DW329: "WELCOME-SEO",
  DW357: "WELCOME-SEO",
  DW358: "WELCOME-SEO",
  DW359: "WELCOME-SEO",
  DW360: "WELCOME-SEO",
  DW362: "WELCOME-SEO",

  DW353: "WELCOME--SEM",
  DW355: "WELCOME--SEM",

  DW38: "WELCOME BET- DW328",

  DW316: "WELCOME BET-大馬",
  DW330: "WELCOME BET-大馬",
  DW331: "WELCOME BET-大馬",
  DW332: "WELCOME BET-大馬",
  DW333: "WELCOME BET-大馬",
  DW335: "WELCOME BET-大馬",
  DW336: "WELCOME BET-大馬",
  DW337: "WELCOME BET-大馬",
  DW338: "WELCOME BET-大馬",
  DW339: "WELCOME BET-大馬",
  DW351: "WELCOME BET-大馬",
  DW352: "WELCOME BET-大馬",

  DW320: "WELCOME-DW320"
};
const PROMO_SYUKURAN_NOMINAL_MAP = {
  "Telesale DW Cashback 28": 28,
  "Telesale DW Cashback 80": 80,
  "Telesale DW Cashback 80+80": "80+80",
  "Telesale DW Cashback 188": 188,
  "Telesale DW Cashback 200": 200,
  "Telesale DW Cashback 400": 400,
  "Telesale DW Cashback 700": 700,
  "Telesale DW Cashback 1100": 1100,
  "Telesale DW Cashback 138": 138,
  "Telesale DW Cashback 328": 328
};
const VVIP_DEPO_HQ_TIPE_MAP = {
  "VVIP BONUS-77": "VVIP BONUS-77",
  "VVIP BONUS-177": "VVIP BONUS-177",
  "VVIP BONUS-377": "VVIP BONUS-377",
  "VVIP BONUS-777": "VVIP BONUS-777",
  // Legacy user values from older UI. Keep accepted but write exact HQ validation value.
  "VVIP-BONUS-77": "VVIP BONUS-77",
  "VVIP-BONUS-177": "VVIP BONUS-177",
  "VVIP-BONUS-377": "VVIP BONUS-377",
  "VVIP-BONUS-777": "VVIP BONUS-777"
};
const VVIP_DEPO_NOMINAL_MAP = {
  "VVIP BONUS-77": 77,
  "VVIP BONUS-177": 177,
  "VVIP BONUS-377": 377,
  "VVIP BONUS-777": 777,
  // Legacy user values from older UI.
  "VVIP-BONUS-77": 77,
  "VVIP-BONUS-177": 177,
  "VVIP-BONUS-377": 377,
  "VVIP-BONUS-777": 777
};
const VVIP_SPECIAL_HQ_TIPE_MAP = {
  // MUST match HQ VVIP-特別獎 column E data validation exactly.
  "VVIP BONUS-77": "VVIP BONUS-77",
  "SUPER VIP SPECIAL 1688": "SUPER VIP SPECIAL 1688",
  "SUPER VIP SPECIAL 588": "SUPER VIP SPECIAL 588",
  "SUPER VIP SPECIAL 888": "SUPER VIP SPECIAL 888"
};
const VVIP_SPECIAL_NOMINAL_MAP = {
  "VVIP BONUS-77": 77,
  "SUPER VIP SPECIAL 1688": 1688,
  "SUPER VIP SPECIAL 588": 588,
  "SUPER VIP SPECIAL 888": 888
};
const LUCKY_MONEY_NOMINAL_MAP = {
  "Lucky money 88": 88
};
const SHEET_BONUS_COMMENTS = "BONUS_COMMENTS";
const SHEET_ADMIN_LOGIN_LOG = "ADMIN_LOGIN_LOG";
const SHEET_ADMIN_ACTIVE_SESSION = "ADMIN_ACTIVE_SESSION";


// ===============================
// LIGHTWEIGHT LOCK / ANTI-SPAM HELPERS
// ===============================

function acquireDocumentWriteLock_(timeoutMs, message) {
  const lock = LockService.getDocumentLock() || LockService.getScriptLock();
  if (!lock.tryLock(timeoutMs || 10000)) {
    throw new Error(message || "Sistem sedang memproses request lain. Coba lagi beberapa detik.");
  }
  return lock;
}

function acquireHQWriteLock_(timeoutMs, message) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(timeoutMs || 15000)) {
    throw new Error(message || "Submit HQ sedang memproses request lain. Coba lagi beberapa detik.");
  }
  return lock;
}

function releaseLockSafe_(lock) {
  try {
    if (lock) lock.releaseLock();
  } catch (err) {}
}

function makeShortCacheKey_(prefix, parts) {
  const raw = String(prefix || "KEY") + "|" + (parts || []).map(v => String(v || "")).join("|");
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, raw);
  const hex = digest.map(function(b) {
    const v = (b + 256) % 256;
    return ("0" + v.toString(16)).slice(-2);
  }).join("");
  return String(prefix || "KEY").replace(/[^A-Za-z0-9_]/g, "_").slice(0, 20) + "_" + hex;
}


const ACCESS_CACHE_TTL_SECONDS = 45;
const CLAIM_HISTORY_USER_DEFAULT_ROWS = 3000;
const CLAIM_HISTORY_ADMIN_DEFAULT_ROWS = 5000;
const CLAIM_HISTORY_MAX_ROWS = 15000;

function getCachedJson_(key) {
  try {
    const raw = CacheService.getScriptCache().get(key);
    if (raw === null) return { hit: false, value: null };
    return { hit: true, value: JSON.parse(raw) };
  } catch (err) {
    return { hit: false, value: null };
  }
}

function putCachedJson_(key, value, ttlSeconds) {
  try {
    CacheService.getScriptCache().put(key, JSON.stringify(value), ttlSeconds || ACCESS_CACHE_TTL_SECONDS);
  } catch (err) {}
}

function getClaimHistoryReadWindow_(lastRow, filter, isAdmin) {
  const totalRows = Math.max(0, Number(lastRow || 0) - 1);
  if (totalRows <= 0) return { startRow: 2, rowCount: 0 };

  const requested = filter && Number(filter.maxRows || 0);
  const defaultRows = isAdmin ? CLAIM_HISTORY_ADMIN_DEFAULT_ROWS : CLAIM_HISTORY_USER_DEFAULT_ROWS;
  const maxRows = Math.min(
    CLAIM_HISTORY_MAX_ROWS,
    Math.max(1, requested || defaultRows)
  );
  const rowCount = Math.min(totalRows, maxRows);

  return {
    startRow: Math.max(2, lastRow - rowCount + 1),
    rowCount: rowCount
  };
}

function getBonusCommentUnreadMapForRows_(rowNums, viewerRole) {
  rowNums = Array.isArray(rowNums) ? rowNums : [];
  const allowedRows = {};

  rowNums.forEach(row => {
    row = Number(row);
    if (row) allowedRows[row] = true;
  });

  if (!Object.keys(allowedRows).length) return {};

  const shComment = ensureBonusCommentsSheet_();
  if (!shComment || shComment.getLastRow() < 2) return {};

  const comments = shComment.getRange(2, 1, shComment.getLastRow() - 1, 13).getValues();
  const map = {};
  viewerRole = String(viewerRole || "User").trim();

  comments.forEach(r => {
    const claimRow = Number(r[1]);
    if (!allowedRows[claimRow]) return;

    const senderRole = String(r[3] || "").trim();
    const readByUser = r[9];
    const readByAdmin = r[10];

    if (viewerRole === "User" && senderRole === "Admin" && !readByUser) {
      map[claimRow] = (map[claimRow] || 0) + 1;
    }

    if (viewerRole === "Admin" && senderRole === "User" && !readByAdmin) {
      map[claimRow] = (map[claimRow] || 0) + 1;
    }
  });

  return map;
}

function getSubmitFingerprint_(data, email) {
  data = data || {};
  return [
    String(email || "").trim().toLowerCase(),
    String(data.staffName || "").trim().toUpperCase(),
    String(data.akunMember || "").trim().toUpperCase(),
    String(data.bonusCategory || "").trim(),
    String(data.tipeBonus || "").trim(),
    String(data.nomorSlip || "").trim().toUpperCase(),
    String(data.nominalBetting || "").trim(),
    String(data.kodeAgen || "").trim().toUpperCase(),
    String(data.remarks || "").trim()
  ];
}


// ===============================
// CORE ACCESS / ROUTING
// ===============================

function doGet(e) {
  const page = e && e.parameter && e.parameter.page ? e.parameter.page : "staff";

  // Admin page is allowed to load so unregistered Admin/TL/FZR can submit a registration request.
  // All protected actions are still guarded server-side by USER_ACCESS role checks.
  const html = page === "admin" ? "admin" : "index";

  return HtmlService.createTemplateFromFile(html)
    .evaluate()
    .setTitle(page === "admin" ? "Admin Panel" : "Bonus Claim Dashboard");
}

function getCurrentUser() {
  return getUserPortalAccessInfo();
}

function getAdminAccessRecord_(email) {
  email = String(email || "").trim().toLowerCase();
  if (!email) return null;

  const cacheKey = makeShortCacheKey_("ADMIN_ACCESS", [email]);
  const cached = getCachedJson_(cacheKey);
  if (cached.hit) return cached.value;

  const sh = ensureAdminUserAccessSheet_();
  if (!sh || sh.getLastRow() < 2) {
    putCachedJson_(cacheKey, null, ACCESS_CACHE_TTL_SECONDS);
    return null;
  }

  const data = sh.getRange(2, 1, sh.getLastRow() - 1, 10).getValues();
  let result = null;

  for (let i = 0; i < data.length; i++) {
    const r = data[i];
    if (String(r[0] || "").trim().toLowerCase() !== email) continue;

    const role = String(r[1] || "").trim();
    const activeFlag = normalizeAdminActiveFlag_(r[4]);
    const accountStatus = normalizeOwnerAccountStatus_(r[9], activeFlag);
    const active = activeFlag && accountStatus === "ACTIVE";

    result = {
      row: i + 2,
      email: String(r[0] || "").trim(),
      role: role,
      staffName: String(r[2] || "").trim(),
      adminCode: String(r[3] || "").trim(),
      active: active,
      activeFlag: activeFlag,
      team: String(r[5] || "").trim(),
      updatedAt: r[6],
      updatedBy: String(r[7] || "").trim(),
      notes: String(r[8] || "").trim(),
      accountStatus: accountStatus
    };
    break;
  }

  putCachedJson_(cacheKey, result, ACCESS_CACHE_TTL_SECONDS);
  return result;
}

function getUserAccess_(email) {
  const record = getAdminAccessRecord_(email);
  if (!record) return null;

  // USER_ACCESS is reserved for Admin Panel roles only.
  if (!isAdminPanelRole_(record.role)) {
    return null;
  }

  // Owner/Admin/TL/FZR with Locked/Removed/OFF cannot access admin/backend actions.
  if (!record.active || record.accountStatus === "LOCKED" || record.accountStatus === "REMOVED") {
    return null;
  }

  return {
    email: record.email,
    role: record.role,
    staffName: record.staffName,
    adminCode: record.adminCode,
    active: record.active,
    team: record.team,
    notes: record.notes,
    accountStatus: record.accountStatus
  };
}

// ===============================
// USER STAFF ACCESS / REGISTRATION
// USER_ACCESS stays for Admin Panel roles only: Owner/Admin/TL/FZR.
// USER_STAFF_ACCESS is for normal user portal access.
// ===============================

function normalizeAccessFlag_(value) {
  if (value === false) return false;
  if (value === true) return true;

  const v = String(value == null ? "" : value).trim().toUpperCase();
  return v === "ON" || v === "YES" || v === "TRUE" || v === "1" || v === "APPROVED" || v === "ACTIVE";
}

function normalizeAdminActiveFlag_(value) {
  // Existing USER_ACCESS rows from the old 4-column format should stay active when blank.
  // But real boolean false from Owner Control checkbox must be treated as OFF.
  if (value === false) return false;
  if (value === true) return true;

  const v = String(value == null ? "" : value).trim().toUpperCase();
  if (!v) return true;

  return v === "ON" || v === "YES" || v === "TRUE" || v === "1" || v === "APPROVED";
}

function normalizeOwnerAccountStatus_(value, activeDefault) {
  const v = String(value == null ? "" : value).trim().toUpperCase();

  if (v === "REMOVED" || v === "DELETE" || v === "DELETED") return "REMOVED";
  if (v === "LOCKED" || v === "LOCK" || v === "BLOCKED" || v === "OFF") return "LOCKED";
  if (v === "ACTIVE" || v === "ON" || v === "APPROVED" || v === "YES" || v === "TRUE" || v === "1") return "ACTIVE";

  // Old rows without Account Status follow Active column.
  return activeDefault ? "ACTIVE" : "LOCKED";
}

function isRemovedOwnerAccountStatus_(value) {
  return normalizeOwnerAccountStatus_(value, false) === "REMOVED";
}


function ensureAdminUserAccessSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_USER_ACCESS);
  if (!sh) sh = ss.insertSheet(SHEET_USER_ACCESS);

  const headers = [
    "Email",
    "Role",
    "Staff Name",
    "Admin Code",
    "Active",
    "Team",
    "Updated At",
    "Updated By",
    "Notes",
    "Account Status"
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    return sh;
  }

  const lastCol = Math.max(sh.getLastColumn(), headers.length);
  const current = sh.getRange(1, 1, 1, lastCol).getValues()[0];

  headers.forEach((h, i) => {
    if (String(current[i] || "").trim() !== h) {
      sh.getRange(1, i + 1).setValue(h);
    }
  });

  return sh;
}


function ensureUserStaffAccessSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_USER_STAFF_ACCESS);

  if (!sh) sh = ss.insertSheet(SHEET_USER_STAFF_ACCESS);

  const headers = [
    "Email",
    "Staff Name",
    "Staff ID",
    "Posisi",
    "Team",
    "Active",
    "Access Status",
    "Claim Bonus Access",
    "Bonus Mingguan Access",
    "Device Report Access",
    "Project 4 Access",
    "Project 5 Access",
    "Registered At",
    "Updated At",
    "Updated By",
    "Notes"
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
  } else {
    const lastCol = Math.max(sh.getLastColumn(), headers.length);
    const current = sh.getRange(1, 1, 1, lastCol).getValues()[0];

    headers.forEach((h, i) => {
      if (String(current[i] || "").trim() !== h) {
        sh.getRange(1, i + 1).setValue(h);
      }
    });
  }

  return sh;
}


function migrateLegacyUserAccessToStaff_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const adminSheet = ss.getSheetByName(SHEET_USER_ACCESS);
  const staffSheet = ensureUserStaffAccessSheet_();

  if (!adminSheet || adminSheet.getLastRow() < 2) {
    return { migrated: 0 };
  }

  const existing = {};
  if (staffSheet.getLastRow() >= 2) {
    staffSheet.getRange(2, 1, staffSheet.getLastRow() - 1, 1).getValues().forEach(r => {
      const email = String(r[0] || "").trim().toLowerCase();
      if (email) existing[email] = true;
    });
  }

  const values = adminSheet.getRange(2, 1, adminSheet.getLastRow() - 1, 4).getValues();
  const now = new Date();
  const rows = [];

  values.forEach(r => {
    const email = String(r[0] || "").trim();
    const role = String(r[1] || "").trim();
    const staffName = String(r[2] || "").trim();
    const staffId = String(r[3] || "").trim();

    if (!email) return;
    if (existing[email.toLowerCase()]) return;

    // Only migrate legacy normal user rows. Owner/Admin/TL/FZR stay in USER_ACCESS.
    if (isAdminPanelRole_(role)) return;

    rows.push([
      email,
      staffName,
      staffId,
      ["IT", "MT", "BZ"].includes(String(role || "").trim().toUpperCase()) ? String(role).trim().toUpperCase() : "",
      "",
      "ON",
      "APPROVED",
      "ON",
      "OFF",
      "OFF",
      "OFF",
      "OFF",
      now,
      now,
      "AUTO_MIGRATE",
      "Migrated from legacy USER_ACCESS row"
    ]);

    existing[email.toLowerCase()] = true;
  });

  if (rows.length) {
    staffSheet.getRange(staffSheet.getLastRow() + 1, 1, rows.length, 16).setValues(rows);
  }

  return { migrated: rows.length };
}


function findUserStaffAccessRow_(email) {
  email = String(email || "").trim().toLowerCase();
  if (!email) return null;

  const cacheKey = makeShortCacheKey_("STAFF_ACCESS", [email]);
  const cached = getCachedJson_(cacheKey);
  if (cached.hit) return cached.value;

  const sh = ensureUserStaffAccessSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) {
    return null;
  }

  const values = sh.getRange(2, 1, lastRow - 1, 16).getValues();
  let result = null;

  for (let i = 0; i < values.length; i++) {
    const rowEmail = String(values[i][0] || "").trim().toLowerCase();
    if (rowEmail === email) {
      result = {
        row: i + 2,
        values: values[i]
      };
      break;
    }
  }

  if (result) putCachedJson_(cacheKey, result, ACCESS_CACHE_TTL_SECONDS);
  return result;
}

function getUserStaffAccess_(email) {
  let found = findUserStaffAccessRow_(email);
  if (!found) {
    try {
      migrateLegacyUserAccessToStaff_();
      found = findUserStaffAccessRow_(email);
    } catch (err) {}
  }
  if (!found) return null;

  const r = found.values;
  const active = normalizeAccessFlag_(r[5]);
  const status = String(r[6] || "").trim() || "PENDING";

  return {
    row: found.row,
    email: String(r[0] || "").trim(),
    staffName: String(r[1] || "").trim(),
    staffId: String(r[2] || "").trim(),
    posisi: String(r[3] || "").trim(),
    team: String(r[4] || "").trim(),
    active: active,
    accessStatus: status,
    claimBonusAccess: normalizeAccessFlag_(r[7]),
    bonusMingguanAccess: normalizeAccessFlag_(r[8]),
    deviceReportAccess: normalizeAccessFlag_(r[9]),
    project4Access: normalizeAccessFlag_(r[10]),
    project5Access: normalizeAccessFlag_(r[11]),
    registeredAt: r[12],
    updatedAt: r[13],
    updatedBy: String(r[14] || "").trim(),
    notes: String(r[15] || "").trim()
  };
}

function getUserPortalAccessInfo() {
  const email = Session.getActiveUser().getEmail();

  if (!email) {
    throw new Error("Gmail tidak terbaca. Pastikan kamu login dengan akun Google.");
  }

  const adminUser = getUserAccess_(email);

  // Admin panel roles can also open the user portal without separate USER_STAFF_ACCESS.
  if (adminUser && isAdminPanelRole_(adminUser.role)) {
    return {
      ok: true,
      email: String(adminUser.email || email).trim(),
      role: String(adminUser.role || "").trim(),
      staffName: String(adminUser.staffName || adminUser.adminCode || "").trim(),
      adminCode: String(adminUser.adminCode || "").trim(),
      registered: true,
      active: true,
      accessStatus: "APPROVED",
      needsRegistration: false,
      needsApproval: false,
      projectAccess: {
        claimBonus: true,
        bonusMingguan: true,
        deviceReport: true,
        project4: true,
        project5: true
      }
    };
  }

  const staff = getUserStaffAccess_(email);

  if (!staff) {
    return {
      ok: false,
      email: String(email).trim(),
      role: "User",
      staffName: "",
      adminCode: "",
      registered: false,
      active: false,
      accessStatus: "UNREGISTERED",
      needsRegistration: true,
      needsApproval: false,
      projectAccess: {
        claimBonus: false,
        bonusMingguan: false,
        deviceReport: false,
        project4: false,
        project5: false
      }
    };
  }

  const approved = staff.active && normalizeAccessFlag_(staff.accessStatus);
  return {
    ok: approved,
    email: staff.email || String(email).trim(),
    role: "User",
    staffName: staff.staffName || "",
    adminCode: staff.staffId || "",
    staffId: staff.staffId || "",
    posisi: staff.posisi || "",
    team: staff.team || "",
    registered: true,
    active: staff.active,
    accessStatus: staff.accessStatus,
    needsRegistration: false,
    needsApproval: !approved,
    projectAccess: {
      claimBonus: !!staff.claimBonusAccess,
      bonusMingguan: !!staff.bonusMingguanAccess,
      deviceReport: !!staff.deviceReportAccess,
      project4: !!staff.project4Access,
      project5: !!staff.project5Access
    }
  };
}

function registerUserStaffAccess(profile) {
  profile = profile || {};
  const email = Session.getActiveUser().getEmail();

  if (!email) throw new Error("Gmail tidak terbaca. Pastikan login Google.");

  const staffName = String(profile.staffName || "").trim();
  const staffId = String(profile.staffId || "").trim();
  const posisi = String(profile.posisi || "").trim().toUpperCase();
  const team = String(profile.team || "").trim();

  if (!staffName) throw new Error("Staff Name wajib diisi.");
  if (!staffId) throw new Error("Staff ID wajib diisi.");
  if (!["IT", "MT", "BZ"].includes(posisi)) throw new Error("Posisi user wajib pilih IT / MT / BZ.");
  if (!team) throw new Error("Team wajib diisi.");

  const lock = LockService.getDocumentLock() || LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error("Register sedang diproses. Coba lagi beberapa detik.");

  try {
    const sh = ensureUserStaffAccessSheet_();
    const found = findUserStaffAccessRow_(email);
    const now = new Date();

    if (found) {
      const currentStatus = String(found.values[6] || "").trim() || "PENDING";
      const currentActive = normalizeAccessFlag_(found.values[5]);

      // Allow user to update pending profile data. Do not turn ON automatically.
      sh.getRange(found.row, 2, 1, 4).setValues([[staffName, staffId, posisi, team]]);
      sh.getRange(found.row, 14, 1, 3).setValues([[now, email, "Updated by user registration form"]]);

      return {
        ok: true,
        message: currentActive ? "Data kamu sudah aktif." : "Register sudah tersimpan. Tunggu Owner approve akses.",
        accessStatus: currentStatus,
        active: currentActive
      };
    }

    sh.appendRow([
      String(email).trim(),
      staffName,
      staffId,
      posisi,
      team,
      "OFF",
      "PENDING",
      "OFF",
      "OFF",
      "OFF",
      "OFF",
      "OFF",
      now,
      now,
      email,
      "Self registration"
    ]);

    return {
      ok: true,
      message: "Register berhasil. Tunggu Owner approve akses.",
      accessStatus: "PENDING",
      active: false
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function projectKeyToStaffAccessProp_(projectKey) {
  projectKey = String(projectKey || "").trim();

  if (projectKey === "Claim Bonus") return "claimBonusAccess";
  if (projectKey === "Bonus Mingguan") return "bonusMingguanAccess";
  if (projectKey === "Device Report") return "deviceReportAccess";
  if (projectKey === "Project 4") return "project4Access";
  if (projectKey === "Project 5") return "project5Access";

  return "";
}

function assertUserProjectAccess_(projectKey) {
  const email = Session.getActiveUser().getEmail();
  const adminUser = getUserAccess_(email);

  if (adminUser && isAdminPanelRole_(adminUser.role)) {
    return true;
  }

  const staff = getUserStaffAccess_(email);
  if (!staff) {
    throw new Error("Akses belum terdaftar. Silakan register dulu dan tunggu Owner approve.");
  }

  if (!staff.active || !normalizeAccessFlag_(staff.accessStatus)) {
    throw new Error("Akses kamu masih Pending/OFF. Hubungi Owner.");
  }

  const prop = projectKeyToStaffAccessProp_(projectKey);
  if (prop && !staff[prop]) {
    throw new Error("Akses " + projectKey + " belum aktif untuk akun kamu.");
  }

  return true;
}

function ensureAdminAccessRequestsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_ADMIN_ACCESS_REQUESTS);

  if (!sh) sh = ss.insertSheet(SHEET_ADMIN_ACCESS_REQUESTS);

  const headers = [
    "Timestamp",
    "Email",
    "Staff Name",
    "Staff ID",
    "Posisi Request",
    "Team",
    "Status",
    "Updated At",
    "Updated By",
    "Notes"
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
  } else {
    const lastCol = Math.max(sh.getLastColumn(), headers.length);
    const current = sh.getRange(1, 1, 1, lastCol).getValues()[0];

    headers.forEach((h, i) => {
      if (String(current[i] || "").trim() !== h) {
        sh.getRange(1, i + 1).setValue(h);
      }
    });
  }

  return sh;
}

function findAdminAccessRequestRow_(email) {
  email = String(email || "").trim().toLowerCase();
  if (!email) return null;

  const cacheKey = makeShortCacheKey_("ADMIN_REQUEST", [email]);
  const cached = getCachedJson_(cacheKey);
  if (cached.hit) return cached.value;

  const sh = ensureAdminAccessRequestsSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) {
    return null;
  }

  const values = sh.getRange(2, 1, lastRow - 1, 10).getValues();
  let result = null;

  for (let i = values.length - 1; i >= 0; i--) {
    const rowEmail = String(values[i][1] || "").trim().toLowerCase();
    if (rowEmail === email) {
      result = {
        row: i + 2,
        values: values[i]
      };
      break;
    }
  }

  if (result) putCachedJson_(cacheKey, result, ACCESS_CACHE_TTL_SECONDS);
  return result;
}

function registerAdminAccessRequest(profile) {
  profile = profile || {};
  const email = Session.getActiveUser().getEmail();

  if (!email) throw new Error("Gmail tidak terbaca. Pastikan login Google.");

  const adminRecord = getAdminAccessRecord_(email);

  if (adminRecord && isAdminPanelRole_(adminRecord.role)) {
    if (adminRecord.accountStatus === "LOCKED") {
      throw new Error("Akun admin ini sedang di-Lock oleh Owner. Tidak bisa register ulang.");
    }
    if (adminRecord.accountStatus === "REMOVED") {
      throw new Error("Akun admin ini sudah di-Remove oleh Owner. Tidak bisa register ulang.");
    }
    if (adminRecord.active) {
      return { ok: true, alreadyActive: true, message: "Admin access sudah aktif." };
    }
  }

  const staffName = String(profile.staffName || profile.namaStaff || "").trim();
  const staffId = String(profile.staffId || profile.idAnggota || "").trim();
  const posisi = String(profile.posisi || "").trim();
  const team = String(profile.team || "").trim();

  if (!staffName) throw new Error("Staff Name wajib diisi.");
  if (!staffId) throw new Error("Staff ID wajib diisi.");
  if (!["Admin", "TL", "FZR"].includes(posisi)) throw new Error("Posisi admin wajib pilih Admin / TL / FZR.");
  if (!team) throw new Error("Team wajib diisi.");

  const lock = LockService.getDocumentLock() || LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error("Register admin sedang diproses. Coba lagi beberapa detik.");

  try {
    const sh = ensureAdminAccessRequestsSheet_();
    const found = findAdminAccessRequestRow_(email);
    const now = new Date();

    if (found) {
      const status = String(found.values[6] || "").trim() || "PENDING";
      sh.getRange(found.row, 3, 1, 4).setValues([[staffName, staffId, posisi, team]]);
      sh.getRange(found.row, 8, 1, 3).setValues([[now, email, "Updated by admin registration form"]]);

      return {
        ok: true,
        message: status === "APPROVED" ? "Request sudah approved. Silakan refresh." : "Request admin sudah tersimpan. Tunggu Owner approve.",
        accessStatus: status
      };
    }

    sh.appendRow([
      now,
      String(email).trim(),
      staffName,
      staffId,
      posisi,
      team,
      "PENDING",
      now,
      email,
      "Admin self registration request"
    ]);

    return {
      ok: true,
      message: "Request admin berhasil dikirim. Tunggu Owner approve.",
      accessStatus: "PENDING"
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function isOwner_() {
  const email = Session.getActiveUser().getEmail();
  const user = getUserAccess_(email);
  return user && String(user.role || "").trim() === "Owner";
}

function assertOwner_() {
  if (!isOwner_()) throw new Error("Access denied. Hanya Owner yang boleh akses menu ini.");
  return true;
}

function getOwnerAccessControlData() {
  assertOwner_();

  try {
    migrateLegacyUserAccessToStaff_();
  } catch (err) {}

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const staffSheet = ensureUserStaffAccessSheet_();
  const reqSheet = ensureAdminAccessRequestsSheet_();
  const adminSheet = ensureAdminUserAccessSheet_();

  const staffRows = [];
  if (staffSheet.getLastRow() >= 2) {
    staffSheet.getRange(2, 1, staffSheet.getLastRow() - 1, 16).getDisplayValues().forEach((r, i) => {
      staffRows.push({
        row: i + 2,
        email: r[0],
        staffName: r[1],
        staffId: r[2],
        posisi: r[3],
        team: r[4],
        active: r[5],
        accessStatus: r[6],
        claimBonusAccess: r[7],
        bonusMingguanAccess: r[8],
        deviceReportAccess: r[9],
        project4Access: r[10],
        project5Access: r[11],
        registeredAt: r[12],
        updatedAt: r[13],
        updatedBy: r[14],
        notes: r[15]
      });
    });
  }

  const adminRows = [];
  if (adminSheet && adminSheet.getLastRow() >= 2) {
    adminSheet.getRange(2, 1, adminSheet.getLastRow() - 1, 10).getDisplayValues().forEach((r, i) => {
      const role = String(r[1] || "").trim();
      if (!isAdminPanelRole_(role)) return;
      const activeFlag = r[4] || "ON";
      const accountStatus = normalizeOwnerAccountStatus_(r[9], normalizeAdminActiveFlag_(activeFlag));

      adminRows.push({
        row: i + 2,
        email: r[0],
        role: role,
        staffName: r[2],
        adminCode: r[3],
        active: accountStatus === "ACTIVE" ? "ON" : "OFF",
        team: r[5],
        updatedAt: r[6],
        updatedBy: r[7],
        notes: r[8],
        accountStatus: accountStatus
      });
    });
  }

  const adminRequests = [];
  if (reqSheet.getLastRow() >= 2) {
    reqSheet.getRange(2, 1, reqSheet.getLastRow() - 1, 10).getDisplayValues().forEach((r, i) => {
      adminRequests.push({
        row: i + 2,
        timestamp: r[0],
        email: r[1],
        staffName: r[2],
        staffId: r[3],
        posisi: r[4],
        team: r[5],
        status: r[6],
        updatedAt: r[7],
        updatedBy: r[8],
        notes: r[9]
      });
    });
  }

  return {
    ok: true,
    staffRows: staffRows,
    adminRows: adminRows,
    adminRequests: adminRequests
  };
}


function getOwnerAdminControlData() {
  assertOwner_();

  const adminSheet = ensureAdminUserAccessSheet_();
  const reqSheet = ensureAdminAccessRequestsSheet_();

  const adminRows = [];
  if (adminSheet && adminSheet.getLastRow() >= 2) {
    adminSheet.getRange(2, 1, adminSheet.getLastRow() - 1, 10).getDisplayValues().forEach((r, i) => {
      const role = String(r[1] || "").trim();
      if (!isAdminPanelRole_(role)) return;

      const activeFlag = r[4] || "ON";
      const accountStatus = normalizeOwnerAccountStatus_(r[9], normalizeAdminActiveFlag_(activeFlag));

      adminRows.push({
        row: i + 2,
        email: r[0],
        role: role,
        staffName: r[2],
        adminCode: r[3],
        active: accountStatus === "ACTIVE" ? "ON" : "OFF",
        team: r[5],
        updatedAt: r[6],
        updatedBy: r[7],
        notes: r[8],
        accountStatus: accountStatus
      });
    });
  }

  const adminRequests = [];
  if (reqSheet.getLastRow() >= 2) {
    reqSheet.getRange(2, 1, reqSheet.getLastRow() - 1, 10).getDisplayValues().forEach((r, i) => {
      adminRequests.push({
        row: i + 2,
        timestamp: r[0],
        email: r[1],
        staffName: r[2],
        staffId: r[3],
        posisi: r[4],
        team: r[5],
        status: r[6],
        updatedAt: r[7],
        updatedBy: r[8],
        notes: r[9]
      });
    });
  }

  return {
    ok: true,
    adminRows: adminRows,
    adminRequests: adminRequests
  };
}

function getOwnerUserControlData() {
  assertOwner_();

  try {
    migrateLegacyUserAccessToStaff_();
  } catch (err) {}

  const staffSheet = ensureUserStaffAccessSheet_();

  const staffRows = [];
  if (staffSheet.getLastRow() >= 2) {
    staffSheet.getRange(2, 1, staffSheet.getLastRow() - 1, 16).getDisplayValues().forEach((r, i) => {
      staffRows.push({
        row: i + 2,
        email: r[0],
        staffName: r[1],
        staffId: r[2],
        posisi: r[3],
        team: r[4],
        active: r[5],
        accessStatus: r[6],
        claimBonusAccess: r[7],
        bonusMingguanAccess: r[8],
        deviceReportAccess: r[9],
        project4Access: r[10],
        project5Access: r[11],
        registeredAt: r[12],
        updatedAt: r[13],
        updatedBy: r[14],
        notes: r[15]
      });
    });
  }

  return {
    ok: true,
    staffRows: staffRows
  };
}


function ownerUpdateStaffAccess(payload) {
  assertOwner_();
  payload = payload || {};

  let email = String(payload.email || "").trim().toLowerCase();
  const row = Number(payload.row || 0);

  const sh = ensureUserStaffAccessSheet_();
  let found = null;

  if (email) {
    found = findUserStaffAccessRow_(email);
  } else if (row >= 2 && row <= sh.getLastRow()) {
    const values = sh.getRange(row, 1, 1, 16).getValues()[0];
    email = String(values[0] || "").trim().toLowerCase();
    found = { row: row, values: values };
  }

  if (!email) throw new Error("Email user wajib ada. Refresh User Control lalu coba lagi.");
  if (!found) throw new Error("User staff tidak ditemukan: " + email);

  const posisi = String(payload.posisi || "").trim().toUpperCase();
  if (!["IT", "MT", "BZ"].includes(posisi)) throw new Error("Posisi user wajib IT / MT / BZ.");

  const requestedStatus = String(payload.accountStatus || payload.accessStatus || "").trim().toUpperCase();
  let active = normalizeAccessFlag_(payload.active) ? "ON" : "OFF";
  let status = String(payload.accessStatus || "").trim() || "PENDING";

  if (requestedStatus === "REMOVED") {
    active = "OFF";
    status = "REMOVED";
  } else if (requestedStatus === "LOCKED" || requestedStatus === "BLOCKED" || requestedStatus === "OFF") {
    active = "OFF";
    status = "LOCKED";
  } else if (requestedStatus === "ACTIVE" || requestedStatus === "APPROVED" || active === "ON") {
    active = "ON";
    status = "APPROVED";
  }

  const now = new Date();
  const by = Session.getActiveUser().getEmail();

  const lock = LockService.getDocumentLock() || LockService.getScriptLock();
  if (!lock.tryLock(8000)) {
    throw new Error("Owner Control sedang dipakai. Coba lagi beberapa detik.");
  }

  try {
    sh.getRange(found.row, 2, 1, 15).setValues([[
      String(payload.staffName || "").trim(),
      String(payload.staffId || "").trim(),
      posisi,
      String(payload.team || "").trim(),
      active,
      status,
      normalizeAccessFlag_(payload.claimBonusAccess) ? "ON" : "OFF",
      normalizeAccessFlag_(payload.bonusMingguanAccess) ? "ON" : "OFF",
      normalizeAccessFlag_(payload.deviceReportAccess) ? "ON" : "OFF",
      normalizeAccessFlag_(payload.project4Access) ? "ON" : "OFF",
      normalizeAccessFlag_(payload.project5Access) ? "ON" : "OFF",
      found.values[12] || now,
      now,
      by,
      String(payload.notes || "").trim()
    ]]);

    return { ok: true, message: "User access " + status + ": " + email };
  } finally {
    releaseLockSafe_(lock);
  }
}

function ownerApproveAdminAccessRequest(payload) {
  assertOwner_();
  payload = payload || {};

  const email = String(payload.email || "").trim().toLowerCase();
  const role = String(payload.role || payload.posisi || "").trim();
  const staffName = String(payload.staffName || "").trim();
  const adminCode = String(payload.staffId || payload.adminCode || "").trim();

  if (!email) throw new Error("Email wajib diisi.");
  if (!["Admin", "TL", "FZR"].includes(role)) throw new Error("Role admin wajib Admin / TL / FZR.");
  if (!staffName) throw new Error("Staff Name wajib diisi.");
  if (!adminCode) throw new Error("Staff ID / Admin Code wajib diisi.");

  const sh = ensureAdminUserAccessSheet_();

  const last = sh.getLastRow();
  let targetRow = 0;

  if (last >= 2) {
    const values = sh.getRange(2, 1, last - 1, 10).getValues();
    for (let i = 0; i < values.length; i++) {
      if (String(values[i][0] || "").trim().toLowerCase() === email) {
        targetRow = i + 2;
        break;
      }
    }
  }

  if (!targetRow) {
    targetRow = sh.getLastRow() + 1;
  }

  const now = new Date();
  const by = Session.getActiveUser().getEmail();
  const team = String(payload.team || "").trim();
  const notes = String(payload.notes || "Approved by Owner").trim();

  sh.getRange(targetRow, 1, 1, 10).setValues([[
    email,
    role,
    staffName,
    adminCode,
    "ON",
    team,
    now,
    by,
    notes,
    "ACTIVE"
  ]]);

  const req = findAdminAccessRequestRow_(email);
  if (req) {
    const reqSheet = ensureAdminAccessRequestsSheet_();
    reqSheet.getRange(req.row, 7, 1, 4).setValues([["APPROVED", new Date(), Session.getActiveUser().getEmail(), "Approved by Owner"]]);
  }

  return { ok: true, message: "Admin access approved: " + email };
}


function ownerUpdateAdminAccess(payload) {
  assertOwner_();
  payload = payload || {};

  const row = Number(payload.row || 0);
  const email = String(payload.email || "").trim().toLowerCase();
  const role = String(payload.role || "").trim();
  const staffName = String(payload.staffName || "").trim();
  const adminCode = String(payload.adminCode || payload.staffId || "").trim();
  const team = String(payload.team || "").trim();
  const notes = String(payload.notes || "").trim();

  const requestedStatus = String(payload.accountStatus || "").trim().toUpperCase();
  const derivedActive = normalizeAdminActiveFlag_(payload.active);
  const accountStatus = normalizeOwnerAccountStatus_(requestedStatus || (derivedActive ? "ACTIVE" : "LOCKED"), derivedActive);
  const active = accountStatus === "ACTIVE" ? "ON" : "OFF";

  if (!row || row < 2) throw new Error("Row admin tidak valid.");
  if (!email) throw new Error("Email wajib diisi.");
  if (!isAdminPanelRole_(role)) throw new Error("Role wajib Owner / Admin / TL / FZR.");
  if (!staffName) throw new Error("Staff Name wajib diisi.");
  if (!adminCode) throw new Error("Staff ID / Admin Code wajib diisi.");

  const currentEmail = String(Session.getActiveUser().getEmail() || "").trim().toLowerCase();

  // Prevent owner from accidentally locking/removing/demoting own active session.
  if (currentEmail && currentEmail === email) {
    if (accountStatus !== "ACTIVE" || active !== "ON") throw new Error("Owner tidak boleh Lock/Remove akun sendiri.");
    if (role !== "Owner") throw new Error("Owner tidak boleh mengubah role sendiri dari Owner.");
  }

  const lock = LockService.getDocumentLock() || LockService.getScriptLock();
  if (!lock.tryLock(8000)) {
    throw new Error("Owner Control sedang dipakai. Coba lagi beberapa detik.");
  }

  try {
    const sh = ensureAdminUserAccessSheet_();
    const maxRow = sh.getLastRow();
    if (row > maxRow) throw new Error("Row admin tidak ditemukan.");

    const rowEmail = String(sh.getRange(row, 1).getValue() || "").trim().toLowerCase();
    if (rowEmail !== email) throw new Error("Email row tidak cocok. Refresh Owner Control lalu coba lagi.");

    const now = new Date();
    const by = Session.getActiveUser().getEmail();

    sh.getRange(row, 1, 1, 10).setValues([[
      email,
      role,
      staffName,
      adminCode,
      active,
      team,
      now,
      by,
      notes,
      accountStatus
    ]]);

    return { ok: true, message: "Admin access " + accountStatus + ": " + email };
  } finally {
    releaseLockSafe_(lock);
  }
}

function ownerRejectAdminAccessRequest(email) {
  assertOwner_();
  email = String(email || "").trim().toLowerCase();
  const req = findAdminAccessRequestRow_(email);
  if (!req) throw new Error("Request tidak ditemukan.");

  const sh = ensureAdminAccessRequestsSheet_();
  sh.getRange(req.row, 7, 1, 4).setValues([["REJECTED", new Date(), Session.getActiveUser().getEmail(), "Rejected by Owner"]]);

  return { ok: true, message: "Admin request rejected: " + email };
}




function getLoginUser_() {
  const email = Session.getActiveUser().getEmail();

  if (!email) {
    throw new Error("Gmail tidak terbaca. Pastikan kamu login dengan akun Google.");
  }

  const accessUser = getUserAccess_(email);

  if (accessUser) {
    return accessUser;
  }

  const staffAccess = getUserStaffAccess_(email);

  if (staffAccess) {
    return {
      email: String(email).trim(),
      role: "User",
      staffName: staffAccess.staffName || "",
      adminCode: staffAccess.staffId || "",
      staffId: staffAccess.staffId || "",
      posisi: staffAccess.posisi || "",
      team: staffAccess.team || "",
      staffAccess: staffAccess
    };
  }

  return {
    email: String(email).trim(),
    role: "User",
    staffName: "",
    adminCode: "",
    registered: false,
    active: false
  };
}

function isAdmin_() {
  const email = Session.getActiveUser().getEmail();
  const user = getUserAccess_(email);
  return user && isFullAdminRole_(user.role);
}

function isFullAdminRole_(role) {
  role = String(role || "").trim();
  return role === "Owner" || role === "Admin";
}

function isAdminPanelRole_(role) {
  role = String(role || "").trim();
  return role === "Owner" || role === "Admin" || role === "TL" || role === "FZR";
}

function isViewerOnlyRole_(role) {
  role = String(role || "").trim();
  return role === "TL" || role === "FZR";
}

function getAdminPanelUser_() {
  const email = Session.getActiveUser().getEmail();

  if (!email) {
    throw new Error("Gmail tidak terbaca. Pastikan login Google.");
  }

  const user = getUserAccess_(email);

  // Akses panel tetap by Gmail USER_ACCESS, bukan dari pilihan Posisi di form.
  if (!user || !isAdminPanelRole_(user.role)) {
    throw new Error("Access denied. Gmail ini belum terdaftar sebagai Owner/Admin/TL/FZR di USER_ACCESS.");
  }

  return {
    email: String(user.email || email).trim(),
    role: String(user.role || "").trim(),
    staffName: String(user.staffName || "").trim(),
    adminCode: String(user.adminCode || "").trim(),
    viewerOnly: isViewerOnlyRole_(user.role)
  };
}


// ===============================
// ADMIN LOGIN / ACTIVE SESSION
// ===============================

function ensureAdminLoginLogSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_ADMIN_LOGIN_LOG);

  if (!sh) sh = ss.insertSheet(SHEET_ADMIN_LOGIN_LOG);

  const headers = [
    "Timestamp",
    "Email",
    "Access Role",
    "Nama Staff",
    "ID Anggota",
    "Posisi Input",
    "Team",
    "Session ID",
    "Action"
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
  } else {
    const lastCol = Math.max(sh.getLastColumn(), headers.length);
    const current = sh.getRange(1, 1, 1, lastCol).getValues()[0];

    headers.forEach((h, i) => {
      if (String(current[i] || "").trim() !== h) {
        sh.getRange(1, i + 1).setValue(h);
      }
    });
  }

  return sh;
}

function ensureAdminActiveSessionSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_ADMIN_ACTIVE_SESSION);

  if (!sh) sh = ss.insertSheet(SHEET_ADMIN_ACTIVE_SESSION);

  const headers = [
    "Session ID",
    "Email",
    "Access Role",
    "Nama Staff",
    "ID Anggota",
    "Posisi Input",
    "Team",
    "Last Seen",
    "Page",
    "Status"
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
  } else {
    const lastCol = Math.max(sh.getLastColumn(), headers.length);
    const current = sh.getRange(1, 1, 1, lastCol).getValues()[0];

    headers.forEach((h, i) => {
      if (String(current[i] || "").trim() !== h) {
        sh.getRange(1, i + 1).setValue(h);
      }
    });
  }

  return sh;
}

function getLastAdminLoginProfile_(email) {
  email = String(email || "").trim().toLowerCase();

  const sh = ensureAdminLoginLogSheet_();
  const lastRow = sh.getLastRow();

  if (lastRow < 2) return null;

  const values = sh.getRange(2, 1, lastRow - 1, 9).getValues();

  for (let i = values.length - 1; i >= 0; i--) {
    const r = values[i];
    const rowEmail = String(r[1] || "").trim().toLowerCase();
    const action = String(r[8] || "").trim();

    if (rowEmail === email && action === "LOGIN") {
      return {
        email: String(r[1] || "").trim(),
        accessRole: String(r[2] || "").trim(),
        namaStaff: String(r[3] || "").trim(),
        idAnggota: String(r[4] || "").trim(),
        posisi: String(r[5] || "").trim(),
        team: String(r[6] || "").trim()
      };
    }
  }

  return null;
}

function getAdminPanelAccessInfo() {
  const email = Session.getActiveUser().getEmail();

  if (!email) {
    throw new Error("Gmail tidak terbaca. Pastikan login Google.");
  }

  const record = getAdminAccessRecord_(email);

  if (!record || !isAdminPanelRole_(record.role)) {
    const req = findAdminAccessRequestRow_(email);
    const r = req ? req.values : null;

    return {
      ok: false,
      email: String(email).trim(),
      role: "",
      staffName: "",
      adminCode: "",
      viewerOnly: true,
      needsRegistration: true,
      accessDenied: false,
      accountStatus: "UNREGISTERED",
      pendingRequest: r ? {
        timestamp: r[0],
        email: r[1],
        staffName: r[2],
        staffId: r[3],
        posisi: r[4],
        team: r[5],
        status: r[6]
      } : null
    };
  }

  if (!record.active || record.accountStatus === "LOCKED" || record.accountStatus === "REMOVED") {
    return {
      ok: false,
      email: record.email || String(email).trim(),
      role: record.role,
      staffName: record.staffName,
      adminCode: record.adminCode,
      viewerOnly: true,
      needsRegistration: false,
      accessDenied: true,
      accountStatus: record.accountStatus,
      message: record.accountStatus === "REMOVED"
        ? "Akun admin ini sudah di-Remove oleh Owner. Hubungi Owner jika perlu restore."
        : "Akun admin ini sedang di-Lock oleh Owner. Hubungi Owner untuk Unlock."
    };
  }

  const saved = getLastAdminLoginProfile_(record.email);

  return {
    ok: true,
    email: record.email,
    role: record.role,
    staffName: record.staffName,
    adminCode: record.adminCode,
    viewerOnly: record.viewerOnly || isViewerOnlyRole_(record.role),
    hasSavedProfile: !!saved,
    savedProfile: saved,
    accountStatus: record.accountStatus
  };
}

function adminPanelLogin(profile) {
  const lock = acquireDocumentWriteLock_(5000, "Login admin sedang diproses oleh request lain. Coba lagi beberapa detik.");

  try {
    const user = getAdminPanelUser_();
    const saved = getLastAdminLoginProfile_(user.email);
    profile = profile || {};

    const namaStaff = String(profile.namaStaff || (saved && saved.namaStaff) || user.staffName || user.adminCode || "").trim();
    const idAnggota = String(profile.idAnggota || (saved && saved.idAnggota) || "").trim();
    const posisi = String(profile.posisi || (saved && saved.posisi) || user.role || "").trim();

    // Team optional.
    const team = String(profile.team || (saved && saved.team) || "").trim();

    if (!namaStaff) throw new Error("Nama Staff wajib diisi.");
    if (!idAnggota) throw new Error("ID Anggota wajib diisi.");
    if (!posisi) throw new Error("Posisi wajib dipilih.");

    const sessionId = Utilities.getUuid();
    const now = new Date();

    const log = ensureAdminLoginLogSheet_();
    log.appendRow([
      now,
      user.email,
      user.role,
      namaStaff,
      idAnggota,
      posisi,
      team,
      sessionId,
      "LOGIN"
    ]);

    const active = ensureAdminActiveSessionSheet_();
    active.appendRow([
      sessionId,
      user.email,
      user.role,
      namaStaff,
      idAnggota,
      posisi,
      team,
      now,
      "Dashboard",
      "ONLINE"
    ]);

    return {
      ok: true,
      sessionId: sessionId,
      email: user.email,
      role: user.role,
      viewerOnly: user.viewerOnly,
      namaStaff: namaStaff,
      idAnggota: idAnggota,
      posisi: posisi,
      team: team,
      activeSessions: getActiveAdminSessions()
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function adminPanelHeartbeat(sessionId, page) {
  const user = getAdminPanelUser_();

  sessionId = String(sessionId || "").trim();
  page = String(page || "").trim() || "Admin Panel";

  if (!sessionId) return getActiveAdminSessions();

  // Heartbeat jangan ikut antre lock panjang. Kalau sedang sibuk, skip update sekali.
  const lock = LockService.getDocumentLock() || LockService.getScriptLock();
  if (!lock.tryLock(500)) {
    return getActiveAdminSessions();
  }

  try {
    const sh = ensureAdminActiveSessionSheet_();
    const lastRow = sh.getLastRow();

    if (lastRow >= 2) {
      const values = sh.getRange(2, 1, lastRow - 1, 10).getValues();

      for (let i = values.length - 1; i >= 0; i--) {
        const row = i + 2;
        const sid = String(values[i][0] || "").trim();
        const email = String(values[i][1] || "").trim().toLowerCase();

        if (sid === sessionId && email === user.email.toLowerCase()) {
          sh.getRange(row, 8).setValue(new Date());
          sh.getRange(row, 9).setValue(page);
          sh.getRange(row, 10).setValue("ONLINE");
          return getActiveAdminSessions();
        }
      }
    }

    return getActiveAdminSessions();

  } finally {
    releaseLockSafe_(lock);
  }
}

function markAdminPanelOffline(sessionId) {
  sessionId = String(sessionId || "").trim();
  if (!sessionId) return true;

  const sh = ensureAdminActiveSessionSheet_();
  const lastRow = sh.getLastRow();

  if (lastRow < 2) return true;

  const values = sh.getRange(2, 1, lastRow - 1, 10).getValues();

  values.forEach((r, i) => {
    if (String(r[0] || "").trim() === sessionId) {
      sh.getRange(i + 2, 10).setValue("OFFLINE");
      sh.getRange(i + 2, 8).setValue(new Date());
    }
  });

  return true;
}

function getActiveAdminSessions() {
  const sh = ensureAdminActiveSessionSheet_();
  const lastRow = sh.getLastRow();

  if (lastRow < 2) return { total:0, admin:0, viewer:0, rows:[] };

  const now = new Date().getTime();
  const tz = Session.getScriptTimeZone();
  const values = sh.getRange(2, 1, lastRow - 1, 10).getValues();
  const latestByEmail = {};

  values.forEach(r => {
    const lastSeen = r[7] instanceof Date ? r[7] : new Date(r[7]);
    const lastMs = lastSeen instanceof Date && !isNaN(lastSeen) ? lastSeen.getTime() : 0;
    const status = String(r[9] || "").trim();

    if (status === "OFFLINE") return;
    if (!lastMs || now - lastMs > 2 * 60 * 1000) return;

    const email = String(r[1] || "").trim().toLowerCase();
    if (!email) return;

    // Ambil role real terbaru dari USER_ACCESS, supaya kalau role diubah
    // Admin -> Owner / TL / FZR, Online Status langsung ikut tanpa harus daftar ulang.
    const access = getUserAccess_(email);
    const realRole = access && access.role ? String(access.role).trim() : String(r[2] || "").trim();

    latestByEmail[email] = {
      sessionId: String(r[0] || "").trim(),
      email: String(r[1] || "").trim(),
      role: realRole,
      namaStaff: String(r[3] || "").trim(),
      idAnggota: String(r[4] || "").trim(),
      posisi: String(r[5] || "").trim(),
      team: String(r[6] || "").trim(),
      lastSeen: Utilities.formatDate(lastSeen, tz, "HH:mm:ss"),
      page: String(r[8] || "").trim()
    };
  });

  const rows = Object.values(latestByEmail).sort((a, b) => {
    const rank = { Owner:0, Admin:1, TL:2, FZR:2 };
    const ar = rank[a.role] ?? 9;
    const br = rank[b.role] ?? 9;
    if (ar !== br) return ar - br;
    return String(a.namaStaff || a.email).localeCompare(String(b.namaStaff || b.email));
  });

  return {
    total: rows.length,
    admin: rows.filter(x => x.role === "Owner" || x.role === "Admin").length,
    viewer: rows.filter(x => x.role === "TL" || x.role === "FZR").length,
    rows: rows
  };
}


// ===============================
// SUBMIT / CLAIM HISTORY / ADMIN ACTION
// ===============================

function submitBonus(data) {
  data = data || {};
  const loginUser = getLoginUser_();
  assertUserProjectAccess_("Claim Bonus");

  // Reapply must be allowed. Do not block same Akun MB + same Tipe Bonus,
  // because Promo Syukuran and several HQ workflows can be claimed repeatedly.
  // Double-click protection is handled by the user panel button state; every
  // server call that reaches here is treated as a valid new claim.
  const lock = acquireDocumentWriteLock_(10000, "Sistem sedang memproses submit lain. Coba lagi beberapa detik.");

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_BONUS_CLAIM);
    if (!sh) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

    const category = String(data.bonusCategory || "").trim();
    const tipeBonus = String(data.tipeBonus || "").trim();
    const uploadedFiles = Array.isArray(data.uploadFiles) ? data.uploadFiles : [];
    const manualLinks = parseDriveLinks_(data.driveLink || "");

    if (category === "Direct Agent" && uploadedFiles.length + manualLinks.length < 2) {
      throw new Error("Direct Agent wajib upload 2 foto.");
    }

    if (category === "VVIP Special Prize" && uploadedFiles.length + manualLinks.length < 1) {
      throw new Error("VVIP Special Prize wajib upload foto.");
    }

    let nominalBonus = data.nominalBonus || "";

    if (category === "CU Sport") {
      if (!CU_SPORT_HQ_TIPE_MAP[tipeBonus]) {
        throw new Error("CU Sport wajib pilih Tipe Bonus yang sesuai HQ.");
      }
      const parlayRaw = String(data.parlay || "").trim();
      const parlayHQ = CU_SPORT_PARLAY_HQ_MAP[parlayRaw] || "";

      if (!parlayHQ) {
        throw new Error("CU Sport wajib pilih Parlay yang sesuai HQ.");
      }

      // Parlay sengaja dibuat bebas sesuai slip/HQ. Tidak wajib match dengan nominal Tipe Bonus.
      nominalBonus = CU_SPORT_NOMINAL_MAP[tipeBonus] || nominalBonus || "";
    }

    if (category === "Welcome Bonus") {
      nominalBonus = WELCOME_NOMINAL_MAP[tipeBonus] || nominalBonus || "";
    }

    if (category === "Promo Syukuran") {
      nominalBonus = PROMO_SYUKURAN_NOMINAL_MAP[tipeBonus] || nominalBonus || "";
    }

    if (category === "VVIP DEPO") {
      nominalBonus = VVIP_DEPO_NOMINAL_MAP[tipeBonus] || nominalBonus || "";
    }

    if (category === "VVIP Special Prize") {
      if (!VVIP_SPECIAL_HQ_TIPE_MAP[tipeBonus]) {
        throw new Error("VVIP Special Prize wajib pilih Tipe Bonus yang sesuai HQ.");
      }
      nominalBonus = VVIP_SPECIAL_NOMINAL_MAP[tipeBonus] || nominalBonus || "";
    }

    if (category === "Lucky Money 88") {
      nominalBonus = LUCKY_MONEY_NOMINAL_MAP[tipeBonus] || 88;
    }

    if (isTiapHariHadiahBesarCategory_(category)) {
      const tipeNominal = getTiapHariNominal_(tipeBonus);
      const inHarian = getTiapHariInHarianAmount_(tipeBonus);

      if (!tipeNominal || !inHarian) {
        throw new Error("Tiap Hari Bonus Besar wajib pilih Tipe Bonus valid: 38 / 128 / 268 / 368 / 568.");
      }

      nominalBonus = tipeNominal; // BONUS_CLAIM G = Nominal Bonus, same as selected THB type.

      const totalIn = String(data.nominalBetting || "").replace(/\D+/g, "");
      if (!totalIn) {
        throw new Error("Tiap Hari Bonus Besar wajib isi TOTAL IN angka saja.");
      }

      data.nominalBetting = totalIn; // BONUS_CLAIM I = TOTAL IN manual user.
      data.remarks = "IN HARIAN: " + inHarian; // BONUS_CLAIM K shown as IN HARIAN in admin for THB.
    }

    if (isHelloFriendsCategory_(category)) {
      nominalBonus = getHelloFriendsNominal_(tipeBonus) || nominalBonus || "";
    }

    if (category === "Transfer Agen" || category === "Direct Agent") {
      nominalBonus = "";
    }

    let finalRemarks = String(data.remarks || "").trim();

    if (category === "CU Sport") {
      const parlayRaw = String(data.parlay || "").trim();
      const parlayHQ = CU_SPORT_PARLAY_HQ_MAP[parlayRaw] || "";
      const userRemarks = String(data.remarks || "").trim();
      finalRemarks = [
        parlayHQ ? "Parlay: " + parlayHQ : "",
        userRemarks ? "Remarks: " + userRemarks : ""
      ].filter(Boolean).join("\n");
    }

    if (category === "Direct Agent") {
      const nickname = String(data.nicknameMb || "").trim();
      const userRemarks = String(data.remarks || "").trim();

      finalRemarks = [
        nickname ? "Nickname MB: " + nickname : "",
        userRemarks ? "Remarks: " + userRemarks : ""
      ].filter(Boolean).join("\n");
    }

    if (isHelloFriendsCategory_(category)) {
      const akunDiajak = String(data.akunDiajak || data.remarks || "").trim();
      const jumlahPengenalan = normalizeHelloFriendsJumlahPengenalan_(
        data.jumlahPengenalan ||
        parseHelloFriendsJumlahPengenalan_(data.remarks) ||
        parseHelloFriendsJumlahPengenalan_(data.extraRemarks) ||
        ""
      );
      const fixedType = normalizeHelloFriendsFixedType_(data.helloFixedType || data.bonusCategory || "") || "普通-介紹好友";
      const userRemarks = String(data.extraRemarks || "").trim();

      if (!jumlahPengenalan) {
        throw new Error("Hello Friends wajib pilih Jumlah Pengenalan.");
      }

      finalRemarks = [
        akunDiajak,
        jumlahPengenalan ? "Jumlah Pengenalan: " + jumlahPengenalan : "",
        fixedType,
        userRemarks ? "Remarks: " + userRemarks : ""
      ].filter(Boolean).join(" - ");
    }

    const uploadedLinks = uploadFilesToDrive_(uploadedFiles, {
      category: category,
      akunMember: data.akunMember || "",
      staffName: data.staffName || ""
    });

    const finalLinks = uploadedLinks.concat(manualLinks);

    // IMPORTANT: Re-apply / repeat claim must be written as a NEW row every time.
    // Use explicit lastRow + 1 with setValues + flush instead of appendRow + getLastRow,
    // so rapid repeat submits cannot return success while the UI reads the old last row.
    const rowValues = [[
      new Date(),
      loginUser.email,
      data.staffName || "",
      data.akunMember || "",
      category,
      (category === "Transfer Agen" || category === "Direct Agent") ? "" : tipeBonus,
      nominalBonus,
      data.nomorSlip || "",
      data.nominalBetting || "",
      data.kodeAgen || "",
      finalRemarks,
      "Pending",
      "",
      "",
      "",
      "",
      ""
    ]];

    const row = sh.getLastRow() + 1;
    sh.getRange(row, 1, 1, rowValues[0].length).setValues(rowValues);

    if (finalLinks.length) {
      setDriveLinksRichText_(sh.getRange(row, 13), finalLinks);
    }

    SpreadsheetApp.flush();

    return {
      ok: true,
      message: "Submit berhasil",
      row: row,
      category: category,
      akunMember: data.akunMember || "",
      tipeBonus: tipeBonus
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function getClaimHistory(filter) {
  filter = filter || {};

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_BONUS_CLAIM);

  if (!sh) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

  ensureBonusClaimHQSubmitColumns_();

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return [];

  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");

  const activeUser = getLoginUser_();
  const forceUserOnly = filter.forceUserOnly === true;
  const isAdmin = activeUser && isAdminPanelRole_(activeUser.role) && !forceUserOnly;
  const viewerRole = isAdmin && isFullAdminRole_(activeUser.role) ? "Admin" : "User";
  const readWindow = getClaimHistoryReadWindow_(lastRow, filter, isAdmin);

  if (readWindow.rowCount <= 0) return [];

  const claimColCount = 25;
  const raw = sh.getRange(readWindow.startRow, 1, readWindow.rowCount, claimColCount).getValues();
  const display = sh.getRange(readWindow.startRow, 1, readWindow.rowCount, claimColCount).getDisplayValues();
  const formulas = sh.getRange(readWindow.startRow, 13, readWindow.rowCount, 1).getFormulas();
  const rich = sh.getRange(readWindow.startRow, 13, readWindow.rowCount, 1).getRichTextValues();

  const cuSportSlipCount = {};

  display.forEach(r => {
    const category = String(r[4] || "").trim();
    const slip = normalizeSlip_(r[7]);

    if (category === "CU Sport" && slip) {
      cuSportSlipCount[slip] = (cuSportSlipCount[slip] || 0) + 1;
    }
  });

  const rows = raw
    .map((r, i) => {
      const d = r[0] instanceof Date ? r[0] : new Date(r[0]);
      const dateKey = d instanceof Date && !isNaN(d)
        ? Utilities.formatDate(d, tz, "yyyy-MM-dd")
        : "";

      const show = display[i];
      const category = String(show[4] || "").trim();
      const slipKey = normalizeSlip_(show[7]);

      const driveLinks = getDriveLinksFromRichText_(rich[i][0]);
      const fallbackLink = extractHyperlink_(formulas[i][0]) || show[12];
      const finalLinks = driveLinks.length ? driveLinks : (fallbackLink ? [fallbackLink] : []);

      return {
        row: readWindow.startRow + i,
        timestamp: show[0],
        email: show[1],
        staffName: show[2],
        akunMember: show[3],
        bonusCategory: show[4],
        tipeBonus: show[5],
        nominalBonus: show[6],
        nomorSlip: show[7],
        nominalBetting: show[8],
        kodeAgen: show[9],
        remarks: show[10],
        status: show[11],
        driveLink: finalLinks[0] || "",
        driveLinks: finalLinks,
        adminRemarks: show[13],
        processedBy: show[14],
        statusHQ: show[15],
        checkedAt: show[16],
        hqSubmitStatus: show[17],
        hqSubmitAt: show[18],
        hqSubmitBy: show[19],
        hqSubmitTargetRow: show[20],
        hqSubmitCount: show[21],
        thbVerifyStatus: show[22],
        thbHelperSyncStatus: show[23],
        thbHelperTglSnapshot: show[24],
        dateKey: dateKey,
        commentUnread: 0,
        isDuplicateSlip: category === "CU Sport" && slipKey && cuSportSlipCount[slipKey] > 1
      };
    })
    .filter(r => {
      if (!isAdmin) {
        if (!activeUser) return false;
        if (String(r.email).trim().toLowerCase() !== activeUser.email.toLowerCase()) return false;
      }

      if (filter.todayOnly === true) return r.dateKey === today;
      if (filter.dateFrom && r.dateKey < filter.dateFrom) return false;
      if (filter.dateTo && r.dateKey > filter.dateTo) return false;

      if (filter.status && filter.status !== "All" && r.status !== filter.status) {
        return false;
      }

      return true;
    })
    .reverse();

  const canReadUnread = !isAdmin || viewerRole === "Admin";
  const commentUnreadMap = canReadUnread
    ? getBonusCommentUnreadMapForRows_(rows.map(r => r.row), viewerRole)
    : {};

  rows.forEach(r => {
    r.commentUnread = Number(commentUnreadMap[r.row] || 0);
  });

  return rows;
}

function updateClaimStatus(row, status, adminRemarks) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Kamu bukan admin.");
  }

  const lock = acquireDocumentWriteLock_(10000, "Sistem sedang menyimpan action admin lain. Coba lagi beberapa detik.");

  try {
    row = Number(row);
    status = String(status || "").trim();

    if (!row || row < 2) {
      throw new Error("Row claim tidak valid.");
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_BONUS_CLAIM);

    if (!sh) {
      throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");
    }

    if (row > sh.getLastRow()) {
      throw new Error("Claim tidak ditemukan. Silakan refresh data.");
    }

    const current = sh.getRange(row, 1, 1, 17).getDisplayValues()[0];

    const currentStatus = String(current[11] || "").trim();
    const currentProcessedBy = String(current[14] || "").trim();
    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const processedBy = admin && admin.adminCode ? admin.adminCode : email;

    // 1) PROCESS LOCK:
    // Hanya claim Pending/kosong yang boleh diambil Process.
    // Kalau admin lain sudah ambil, admin kedua akan ditolak walaupun layar dia belum refresh.
    if (status === "On Process") {
      if (currentStatus && currentStatus !== "Pending") {
        throw new Error(
          "Claim ini sudah diproses oleh " +
          (currentProcessedBy || "admin lain") +
          ". Silakan refresh data."
        );
      }
    }

    // 2) APPROVE / REJECT SAFETY:
    // Kalau claim sedang On Process oleh admin lain, admin lain tidak boleh menimpa.
    if (
      (status === "Approved" || status === "Rejected") &&
      currentStatus === "On Process" &&
      currentProcessedBy &&
      normalizeText_(currentProcessedBy) !== normalizeText_(processedBy)
    ) {
      throw new Error(
        "Claim ini sedang diproses oleh " +
        currentProcessedBy +
        ". Silakan refresh data."
      );
    }

    // 3) FINAL SAFETY:
    // Kalau sudah Approved/Rejected oleh admin lain, jangan ditimpa.
    if (
      (currentStatus === "Approved" || currentStatus === "Rejected") &&
      currentProcessedBy &&
      normalizeText_(currentProcessedBy) !== normalizeText_(processedBy)
    ) {
      throw new Error(
        "Claim ini sudah " +
        currentStatus +
        " oleh " +
        currentProcessedBy +
        ". Silakan refresh data."
      );
    }

    sh.getRange(row, 12).setValue(status);
    if (String(adminRemarks || "") !== "__KEEP__") sh.getRange(row, 14).setValue(adminRemarks || "");
    sh.getRange(row, 15).setValue(processedBy);
    SpreadsheetApp.flush();

    return {
      ok: true,
      message: "Update berhasil",
      row: row,
      status: status,
      processedBy: processedBy
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function updateTiapHariVerifyStatus(row) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Kamu bukan admin.");
  }

  row = Number(row);
  if (!row || row < 2) {
    throw new Error("Row claim tidak valid.");
  }

  const lock = acquireDocumentWriteLock_(10000, "Sistem sedang menyimpan verify admin lain. Coba lagi beberapa detik.");

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ensureBonusClaimHQSubmitColumns_();

    if (!sh) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");
    if (row > sh.getLastRow()) throw new Error("Claim tidak ditemukan. Silakan refresh data.");

    const current = sh.getRange(row, 1, 1, 23).getDisplayValues()[0];
    const category = String(current[4] || "").trim();
    const status = String(current[11] || "").trim();
    const processedByCurrent = String(current[14] || "").trim();
    const existingVerify = String(current[22] || "").trim();

    if (!isTiapHariHadiahBesarCategory_(category)) {
      throw new Error("Verify ini khusus Tiap Hari Bonus Besar.");
    }

    if (status !== "On Process") {
      throw new Error("Claim harus di-Process / Locked dulu sebelum Verify.");
    }

    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const processedBy = admin && admin.adminCode ? admin.adminCode : email;

    // Yang verify harus admin yang sedang lock/process claim ini.
    if (
      processedByCurrent &&
      normalizeText_(processedByCurrent) !== normalizeText_(processedBy)
    ) {
      throw new Error("Claim ini sedang diproses oleh " + processedByCurrent + ". Tidak bisa Verify.");
    }

    if (existingVerify === "VERIFIED") {
      return {
        ok: true,
        row: row,
        thbVerifyStatus: "VERIFIED",
        message: "Claim sudah VERIFIED."
      };
    }

    sh.getRange(row, 23).setValue("VERIFIED"); // BONUS_CLAIM W = THB Verify Status
    SpreadsheetApp.flush();

    return {
      ok: true,
      row: row,
      thbVerifyStatus: "VERIFIED",
      message: "Tiap Hari Bonus Besar berhasil VERIFIED."
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function getThbHelperSyncData(rows) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Kamu bukan admin.");
  }

  if (!Array.isArray(rows)) rows = [];

  const targetRows = rows
    .map(r => Number(r))
    .filter(r => r && r >= 2)
    .filter((r, i, arr) => arr.indexOf(r) === i);

  const targetSet = {};
  targetRows.forEach(r => targetSet[String(r)] = true);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_THB_HELPER);
  const shClaim = ensureBonusClaimHQSubmitColumns_();
  const tz = Session.getScriptTimeZone();
  const lastSync = Utilities.formatDate(new Date(), tz, "yyyy/MM/dd HH:mm:ss");

  const resultMap = {};
  let helperRowsRead = 0;

  if (sh) {
    const lastRow = sh.getLastRow();

    if (lastRow >= 2) {
      const values = sh.getRange(2, 1, lastRow - 1, 5).getDisplayValues();
      helperRowsRead = values.length;

      values.forEach((r, i) => {
        const claimRow = Number(String(r[0] || "").trim());
        if (!claimRow) return;

        // If frontend sends target rows, return only those rows for speed/accuracy.
        if (targetRows.length && !targetSet[String(claimRow)]) return;

        resultMap[String(claimRow)] = {
          synced: true,
          source: "helper",
          claimRow: claimRow,
          helperRow: i + 2,
          akunMember: String(r[1] || "").trim(),
          totalIn: String(r[2] || "").trim(),
          nominalBonus: String(r[3] || "").trim(),
          remarksTgl: String(r[4] || "").trim()
        };
      });
    }
  }

  // Important:
  // Sync result must be persistent, not only front-end memory.
  // If a row was previously synced/submitted and THB_HELPER formula stops pulling it,
  // we restore display from BONUS_CLAIM X:Y snapshot, or from HQ target row G as fallback.
  let hqSheet = null;

  function getHqNoInByTargetRow_(targetRow) {
    targetRow = Number(targetRow || 0);
    if (!targetRow || targetRow < 2) return "";

    try {
      if (!hqSheet) {
        hqSheet = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID).getSheetByName(SOURCE_TIAP_HARI_SHEET);
      }
      if (!hqSheet) return "";
      return String(hqSheet.getRange(targetRow, 7).getDisplayValue() || "").trim(); // HQ G = NO-IN / TGL.
    } catch (err) {
      return "";
    }
  }

  const claimLastRow = shClaim ? shClaim.getLastRow() : 0;

  targetRows.forEach(row => {
    const key = String(row);
    if (resultMap[key]) return;
    if (!shClaim || row > claimLastRow) return;

    const show = shClaim.getRange(row, 1, 1, 25).getDisplayValues()[0];
    const category = String(show[4] || "").trim();
    if (!isTiapHariHadiahBesarCategory_(category)) return;

    const snapshotStatus = String(show[23] || "").trim().toUpperCase();
    let snapshotTgl = String(show[24] || "").trim();
    const hqSubmitStatus = String(show[17] || "").trim();
    const hqTargetRow = Number(show[20] || 0);

    if (!snapshotTgl && hqSubmitStatus && hqTargetRow) {
      snapshotTgl = getHqNoInByTargetRow_(hqTargetRow);
    }

    if (snapshotStatus === "SYNCED" || snapshotTgl || hqSubmitStatus) {
      resultMap[key] = {
        synced: true,
        source: snapshotTgl ? "snapshot" : "submitted",
        claimRow: row,
        helperRow: "",
        akunMember: String(show[3] || "").trim(),
        totalIn: String(show[8] || "").trim(),
        nominalBonus: String(show[6] || "").trim(),
        remarksTgl: snapshotTgl
      };
    }
  });

  // Persist any successful sync into BONUS_CLAIM X:Y immediately.
  // This prevents synced NO-IN from disappearing after refresh / re-sync / helper formula changes.
  if (shClaim && targetRows.length) {
    targetRows.forEach(row => {
      const item = resultMap[String(row)];
      if (!item) return;
      if (row > claimLastRow) return;

      shClaim.getRange(row, 24, 1, 2).setValues([[
        "SYNCED",
        String(item.remarksTgl || "")
      ]]);
    });
  }

  let found = 0;
  let missing = 0;
  let remarksFilled = 0;
  let remarksBlank = 0;
  let fromHelper = 0;
  let fromSnapshot = 0;

  targetRows.forEach(row => {
    const item = resultMap[String(row)];
    if (item) {
      found++;
      if (item.source === "helper") fromHelper++;
      else fromSnapshot++;
      if (item.remarksTgl) remarksFilled++;
      else remarksBlank++;
    } else {
      missing++;
    }
  });

  return {
    ok: true,
    sheetName: SHEET_THB_HELPER,
    helperExists: !!sh,
    lastSync: lastSync,
    helperRowsRead: helperRowsRead,
    targetRows: targetRows,
    map: resultMap,
    summary: {
      verifiedTarget: targetRows.length,
      found: found,
      missing: missing,
      remarksFilled: remarksFilled,
      remarksBlank: remarksBlank,
      readySubmit: found,
      fromHelper: fromHelper,
      fromSnapshot: fromSnapshot,
      lastSync: lastSync,
      helperRowsRead: helperRowsRead,
      helperExists: !!sh
    }
  };
}



function updateClaimAdminFields(row, payload) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Kamu bukan admin.");
  }

  row = Number(row);
  payload = payload || {};

  if (!row || row < 2) {
    throw new Error("Row claim tidak valid.");
  }

  const lock = acquireDocumentWriteLock_(10000, "Sistem sedang menyimpan data admin lain. Coba lagi beberapa detik.");

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_BONUS_CLAIM);

    if (!sh) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");
    if (row > sh.getLastRow()) throw new Error("Claim tidak ditemukan. Silakan refresh data.");

    const current = sh.getRange(row, 1, 1, 23).getDisplayValues()[0];
    const category = String(current[4] || "").trim();

    const hasAdminRemarks = Object.prototype.hasOwnProperty.call(payload, "adminRemarks");
    const hasSlip = Object.prototype.hasOwnProperty.call(payload, "nomorSlip");

    if (!hasAdminRemarks && !hasSlip) {
      throw new Error("Tidak ada data yang disimpan.");
    }

    const result = {
      ok: true,
      row: row,
      bonusCategory: category,
      adminRemarks: current[13] || "",
      nomorSlip: current[7] || ""
    };

    if (hasAdminRemarks) {
      const adminRemarks = String(payload.adminRemarks || "").trim();
      sh.getRange(row, 14).setValue(adminRemarks); // BONUS_CLAIM N = Admin Remarks
      result.adminRemarks = adminRemarks;
    }

    if (hasSlip) {
      if (category !== "VVIP Special Prize") {
        throw new Error("Slip admin hanya boleh diedit untuk VVIP Special Prize.");
      }

      const slip = String(payload.nomorSlip || "").trim().toUpperCase();
      sh.getRange(row, 8).setValue(slip); // BONUS_CLAIM H = Nomor Slip Taruhan
      result.nomorSlip = slip;
    }

    SpreadsheetApp.flush();

    return {
      ok: true,
      message: "Data claim berhasil disimpan.",
      row: row,
      data: result
    };

  } finally {
    releaseLockSafe_(lock);
  }
}


function clearTestingDataBeforeUserTest() {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya admin yang boleh clear data testing.");
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheetsToClear = [
    "BONUS_CLAIM",
    "BONUS_COMMENTS",
    "CLAIM_CHAT_LOG"
  ];

  const result = [];

  sheetsToClear.forEach(name => {
    const sh = ss.getSheetByName(name);

    if (!sh) {
      result.push(name + ": sheet tidak ada, skip");
      return;
    }

    const lastRow = sh.getLastRow();
    const lastCol = sh.getLastColumn();

    if (lastRow <= 1) {
      result.push(name + ": sudah kosong");
      return;
    }

    sh.getRange(2, 1, lastRow - 1, lastCol).clearContent();
    result.push(name + ": cleared " + (lastRow - 1) + " rows");
  });

  return "Clear testing data selesai.\n" + result.join("\n");
}


// ===============================
// BONUS COMMENTS
// ===============================

function ensureBonusCommentsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_BONUS_COMMENTS);

  if (!sh) {
    sh = ss.insertSheet(SHEET_BONUS_COMMENTS);
  }

  const headers = [
    "Timestamp",
    "Claim Row",
    "Bonus Category",
    "Sender Role",
    "Sender Email",
    "Sender Name",
    "Message",
    "Attachment Links",
    "Status Snapshot",
    "Read By User",
    "Read By Admin",
    "Read By User Name",
    "Read By Admin Name"
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
  } else {
    const lastCol = Math.max(sh.getLastColumn(), headers.length);
    const current = sh.getRange(1, 1, 1, lastCol).getValues()[0];

    headers.forEach((h, i) => {
      if (String(current[i] || "").trim() !== h) {
        sh.getRange(1, i + 1).setValue(h);
      }
    });
  }

  return sh;
}

function getBonusCommentClaimObject_(row) {
  row = Number(row);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_BONUS_CLAIM);

  if (!sh || row < 2 || row > sh.getLastRow()) {
    return null;
  }

  const display = sh.getRange(row, 1, 1, 17).getDisplayValues()[0];
  const formulas = sh.getRange(row, 1, 1, 17).getFormulas()[0];
  const rich = sh.getRange(row, 1, 1, 17).getRichTextValues()[0];

  let driveLinks = [];

  try {
    if (typeof getDriveLinksFromRichText_ === "function") {
      driveLinks = getDriveLinksFromRichText_(rich[12]);
    }
  } catch (err) {
    driveLinks = [];
  }

  let fallbackLink = "";

  try {
    if (typeof extractHyperlink_ === "function") {
      fallbackLink = extractHyperlink_(formulas[12]) || "";
    }
  } catch (err) {
    fallbackLink = "";
  }

  if (!driveLinks.length && fallbackLink) {
    driveLinks = [fallbackLink];
  }

  if (!driveLinks.length && display[12]) {
    driveLinks = String(display[12])
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);
  }

  return {
    row: row,
    timestamp: display[0],
    email: display[1],
    staffName: display[2],
    akunMember: display[3],
    bonusCategory: display[4],
    tipeBonus: display[5],
    nominalBonus: display[6],
    nomorSlip: display[7],
    nominalBetting: display[8],
    kodeAgen: display[9],
    remarks: display[10],
    status: display[11],
    driveLinks: driveLinks,
    adminRemarks: display[13],
    processedBy: display[14],
    statusHQ: display[15],
    checkedAt: display[16]
  };
}

function getBonusCommentAccess_(row) {
  const user = getLoginUser_();
  const claim = getBonusCommentClaimObject_(row);

  if (!claim) {
    return { allowed: false };
  }

  // Hanya Owner/Admin yang dianggap admin untuk comment/action.
  // TL/FZR tetap boleh lihat claim panel, tapi bukan sender Admin untuk comment.
  const isAdmin = isFullAdminRole_(user.role);
  const isOwner = String(claim.email || "").trim().toLowerCase() === String(user.email || "").trim().toLowerCase();

  if (!isAdmin && !isOwner) {
    return { allowed: false };
  }

  return {
    allowed: true,
    viewerRole: isAdmin ? "Admin" : "User",
    email: user.email,
    senderName: isAdmin
      ? (user.adminCode || user.staffName || user.email)
      : (claim.staffName || user.staffName || user.email),
    claim: claim
  };
}

function getCommentReaderName_(viewerRole) {
  try {
    const user = getLoginUser_();
    const email = String(user.email || "").trim();
    const adminCode = String(user.adminCode || "").trim();
    const staffName = String(user.staffName || "").trim();

    if (viewerRole === "Admin") {
      return adminCode || staffName || email || "Admin";
    }

    return staffName || email || "User";
  } catch (err) {
    return viewerRole || "";
  }
}

function markBonusCommentsRead_(row, viewerRole) {
  const sh = ensureBonusCommentsSheet_();

  if (sh.getLastRow() < 2) return 0;

  row = Number(row);
  viewerRole = String(viewerRole || "").trim();

  if (!row || (viewerRole !== "User" && viewerRole !== "Admin")) return 0;

  const values = sh.getRange(2, 1, sh.getLastRow() - 1, 13).getValues();
  const now = new Date();
  const readerName = getCommentReaderName_(viewerRole);
  const readRanges = [];
  const nameRanges = [];

  values.forEach((r, i) => {
    const sheetRow = i + 2;
    const claimRow = Number(r[1]);
    const senderRole = String(r[3] || "").trim();

    if (claimRow !== row) return;

    // User membaca comment dari Admin. Skip kalau sudah pernah read supaya tidak tulis ulang.
    if (viewerRole === "User" && senderRole === "Admin" && !r[9]) {
      readRanges.push("J" + sheetRow);       // Read By User
      nameRanges.push("L" + sheetRow);       // Read By User Name
    }

    // Admin membaca comment dari User. Skip kalau sudah pernah read supaya tidak tulis ulang.
    if (viewerRole === "Admin" && senderRole === "User" && !r[10]) {
      readRanges.push("K" + sheetRow);       // Read By Admin
      nameRanges.push("M" + sheetRow);       // Read By Admin Name
    }
  });

  if (!readRanges.length) return 0;

  // Batch update: lebih ringan dibanding setValue per baris.
  sh.getRangeList(readRanges).setValue(now);
  sh.getRangeList(nameRanges).setValue(readerName);

  return readRanges.length;
}

function getBonusCommentsByRow_(row) {
  row = Number(row);

  const sh = ensureBonusCommentsSheet_();

  if (sh.getLastRow() < 2) {
    return [];
  }

  const lastRow = sh.getLastRow();
  const lastCol = Math.max(sh.getLastColumn(), 13);
  const display = sh.getRange(2, 1, lastRow - 1, lastCol).getDisplayValues();
  const comments = [];

  display.forEach((r, i) => {
    const claimRow = Number(r[1]);

    if (claimRow !== row) return;

    const sheetRow = i + 2;
    let links = [];

    // RichText hanya dibaca untuk row comment yang match saja, supaya open comment lebih ringan.
    try {
      if (typeof getDriveLinksFromRichText_ === "function") {
        links = getDriveLinksFromRichText_(sh.getRange(sheetRow, 8).getRichTextValue());
      }
    } catch (err) {
      links = [];
    }

    if (!links.length && r[7]) {
      links = String(r[7])
        .split(",")
        .map(x => x.trim())
        .filter(Boolean);
    }

    comments.push({
      timestamp: r[0],
      claimRow: claimRow,
      bonusCategory: r[2],
      senderRole: r[3],
      senderEmail: r[4],
      senderName: r[5],
      message: r[6],
      attachmentLinks: links,
      statusSnapshot: r[8],
      readByUser: r[9],
      readByAdmin: r[10],
      readByUserName: r[11],
      readByAdminName: r[12]
    });
  });

  return comments;
}

function getBonusCommentCase(row) {
  row = Number(row);

  ensureBonusCommentsSheet_();

  const access = getBonusCommentAccess_(row);

  if (!access.allowed) {
    throw new Error("Access denied.");
  }

  markBonusCommentsRead_(row, access.viewerRole);

  const claim = getBonusCommentClaimObject_(row);
  const status = String(claim.status || "").trim();
  const isClosed = status === "Approved" || status === "Rejected";
  const canAddComment = access.viewerRole === "Admin" || !isClosed;

  return {
    claim: claim,
    comments: getBonusCommentsByRow_(row),
    viewerRole: access.viewerRole,
    unreadCount: 0,
    canAddComment: canAddComment,
    lockedMessage: canAddComment ? "" : "Case sudah " + status + ". Comment untuk user sudah ditutup."
  };
}

function addBonusComment(payload) {
  const lock = acquireDocumentWriteLock_(10000, "Sistem sedang menyimpan comment lain. Coba lagi beberapa detik.");

  try {

    payload = payload || {};
    const row = Number(payload.row);
    const message = String(payload.message || "").trim();
    const uploadFiles = Array.isArray(payload.uploadFiles) ? payload.uploadFiles : [];

    if (!row) throw new Error("Case ID tidak valid.");
    if (!message && uploadFiles.length === 0) throw new Error("Isi comment atau upload attachment terlebih dahulu.");

    const access = getBonusCommentAccess_(row);
    if (!access.allowed) throw new Error("Access denied.");

    const claim = access.claim;
    const status = String(claim.status || "").trim();
    const isClosed = status === "Approved" || status === "Rejected";

    if (access.viewerRole !== "Admin" && isClosed) {
      throw new Error("Case sudah " + status + ". Comment untuk user sudah ditutup.");
    }

    // Tandai comment lawan bicara yang sudah terbaca sebelum mengirim balasan.
    markBonusCommentsRead_(row, access.viewerRole);

    let uploadedLinks = [];

    if (uploadFiles.length) {
      if (typeof uploadFilesToDrive_ !== "function") throw new Error("Upload function belum tersedia di Code.gs.");

      uploadedLinks = uploadFilesToDrive_(uploadFiles, {
        category: "Bonus Comment",
        akunMember: claim.akunMember || "",
        staffName: access.senderName || ""
      });
    }

    const sh = ensureBonusCommentsSheet_();
    const now = new Date();

    const readByUser = access.viewerRole === "User" ? now : "";
    const readByAdmin = access.viewerRole === "Admin" ? now : "";
    const readByUserName = access.viewerRole === "User" ? getCommentReaderName_("User") : "";
    const readByAdminName = access.viewerRole === "Admin" ? getCommentReaderName_("Admin") : "";

    sh.appendRow([
      now,
      row,
      claim.bonusCategory || "",
      access.viewerRole || "",
      access.email || "",
      access.senderName || "",
      message || (uploadedLinks.length ? "Attachment uploaded." : ""),
      "",
      claim.status || "",
      readByUser,
      readByAdmin,
      readByUserName,
      readByAdminName
    ]);

    const commentRow = sh.getLastRow();

    if (uploadedLinks.length) {
      if (typeof setDriveLinksRichText_ === "function") {
        setDriveLinksRichText_(sh.getRange(commentRow, 8), uploadedLinks);
      } else {
        sh.getRange(commentRow, 8).setValue(uploadedLinks.join(", "));
      }
    }

    return "Comment berhasil dikirim.";

  } finally {
    releaseLockSafe_(lock);
  }
}

function getBonusCommentUnreadMap() {
  const user = getLoginUser_();
  const viewerRole = isFullAdminRole_(user.role) ? "Admin" : "User";
  const viewerEmail = String(user.email || "").trim().toLowerCase();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const shClaim = ss.getSheetByName(SHEET_BONUS_CLAIM);
  const shComment = ensureBonusCommentsSheet_();

  if (!shClaim || shClaim.getLastRow() < 2 || shComment.getLastRow() < 2) return {};

  const claimValues = shClaim.getRange(2, 1, shClaim.getLastRow() - 1, 17).getValues();
  const allowedRows = {};

  claimValues.forEach((r, i) => {
    const rowNum = i + 2;
    const ownerEmail = String(r[1] || "").trim().toLowerCase();

    if (viewerRole === "Admin") allowedRows[rowNum] = true;
    else if (ownerEmail === viewerEmail) allowedRows[rowNum] = true;
  });

  const comments = shComment.getRange(2, 1, shComment.getLastRow() - 1, 13).getValues();
  const map = {};

  comments.forEach(r => {
    const claimRow = Number(r[1]);
    const senderRole = String(r[3] || "").trim();
    const readByUser = r[9];
    const readByAdmin = r[10];

    if (!allowedRows[claimRow]) return;

    if (viewerRole === "User" && senderRole === "Admin" && !readByUser) {
      map[claimRow] = (map[claimRow] || 0) + 1;
    }

    if (viewerRole === "Admin" && senderRole === "User" && !readByAdmin) {
      map[claimRow] = (map[claimRow] || 0) + 1;
    }
  });

  return map;
}

function getBonusCommentUnreadMapForUserPanel() {
  const user = getLoginUser_();
  const viewerEmail = String(user.email || "").trim().toLowerCase();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const shClaim = ss.getSheetByName(SHEET_BONUS_CLAIM);
  const shComment = ensureBonusCommentsSheet_();

  if (!shClaim || shClaim.getLastRow() < 2 || shComment.getLastRow() < 2) return {};

  const claimValues = shClaim.getRange(2, 1, shClaim.getLastRow() - 1, 17).getValues();
  const allowedRows = {};

  claimValues.forEach((r, i) => {
    const rowNum = i + 2;
    const ownerEmail = String(r[1] || "").trim().toLowerCase();

    if (ownerEmail === viewerEmail) allowedRows[rowNum] = true;
  });

  const comments = shComment.getRange(2, 1, shComment.getLastRow() - 1, 13).getValues();
  const map = {};

  comments.forEach(r => {
    const claimRow = Number(r[1]);
    const senderRole = String(r[3] || "").trim();
    const readByUser = r[9];

    if (!allowedRows[claimRow]) return;

    if (senderRole === "Admin" && !readByUser) {
      map[claimRow] = (map[claimRow] || 0) + 1;
    }
  });

  return map;
}

function getBonusCommentUnreadMapSafe_() {
  try {
    return getBonusCommentUnreadMap();
  } catch (err) {
    return {};
  }
}


// ===============================
// SYNC HQ / HEALTH
// ===============================

function syncBonusReceivedToday() {
  if (!isAdmin_()) {
    throw new Error("Access denied. Kamu bukan admin.");
  }

  return syncBonusReceivedCore_({ email: "", adminMode: true });
}

function syncBonusReceivedForCurrentUser() {
  const user = getLoginUser_();
  const email = user.email;

  const cache = CacheService.getScriptCache();
  const key = "syncHQ_" + email.toLowerCase();

  if (cache.get(key)) {
    throw new Error("SyncHQ hanya bisa 1x per 60 detik. Coba lagi sebentar.");
  }

  cache.put(key, "1", 60);

  return syncBonusReceivedCore_({ email: email, adminMode: false });
}

function autoSyncHQ() {
  try {
    const result = syncBonusReceivedCore_({ email: "", adminMode: true });
    recordAutoSyncHQStatus_("OK", result, "");
    return result;
  } catch (err) {
    recordAutoSyncHQStatus_("ERROR", "", err && err.message ? err.message : err);
    console.error("Auto SyncHQ Error: " + (err && err.message ? err.message : err));
    return "Auto SyncHQ Error: " + (err && err.message ? err.message : err);
  }
}

function installAutoSyncHQTrigger() {
  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach(t => {
    if (t.getHandlerFunction() === "autoSyncHQ") {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger("autoSyncHQ")
    .timeBased()
    .everyMinutes(1)
    .create();

  return "Auto SyncHQ trigger aktif: setiap 1 menit.";
}

function uninstallAutoSyncHQTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  let deleted = 0;

  triggers.forEach(t => {
    if (t.getHandlerFunction() === "autoSyncHQ") {
      ScriptApp.deleteTrigger(t);
      deleted++;
    }
  });

  return "Auto SyncHQ trigger dihapus: " + deleted;
}

function runAutoSyncHQNow() {
  return autoSyncHQ();
}

function recordAutoSyncHQStatus_(status, result, err) {
  const props = PropertiesService.getScriptProperties();
  const nowText = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

  props.setProperty("AUTO_SYNC_HQ_LAST_AT", nowText);
  props.setProperty("AUTO_SYNC_HQ_LAST_STATUS", status || "UNKNOWN");
  props.setProperty("AUTO_SYNC_HQ_LAST_RESULT", String(result || ""));
  props.setProperty("AUTO_SYNC_HQ_LAST_ERROR", String(err || ""));
}

function getAutoSyncHQHealth() {
  if (!isAdmin_()) {
    throw new Error("Access denied. Kamu bukan admin.");
  }

  const props = PropertiesService.getScriptProperties();
  const triggers = ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "autoSyncHQ");

  const lastAt = props.getProperty("AUTO_SYNC_HQ_LAST_AT") || "-";
  const lastStatus = props.getProperty("AUTO_SYNC_HQ_LAST_STATUS") || "UNKNOWN";
  const lastResult = props.getProperty("AUTO_SYNC_HQ_LAST_RESULT") || "Belum ada sync tercatat";
  const lastError = props.getProperty("AUTO_SYNC_HQ_LAST_ERROR") || "";

  let status = lastStatus;
  if (triggers.length < 1) status = "NO_TRIGGER";

  return {
    status: status,
    lastAt: lastAt,
    lastResult: lastResult,
    lastError: lastError,
    triggerCount: triggers.length
  };
}

function repairAutoSyncHQTrigger() {
  if (!isAdmin_()) {
    throw new Error("Access denied. Kamu bukan admin.");
  }

  const result = installAutoSyncHQTrigger();
  return {
    ok: true,
    message: String(result || "Auto SyncHQ trigger repaired.")
  };
}

function getFastSyncHQConfig_(category) {
  category = String(category || "").trim();

  // Fast mode is only for categories that were submitted to HQ by this system
  // and already have a reliable HQ Submit Target Row in BONUS_CLAIM column U.
  if (category === "CU Sport") {
    return {
      categoryKey: "CU Sport",
      sheetName: SOURCE_CU_SPORT_SHEET,
      statusColumn: 10, // 酷體育瘋串串!J = StatusHQ primary
      statusColumns: [10, 9] // Safety: check J first, then I if HQ layout/status column differs.
    };
  }

  if (category === "Welcome Bonus") {
    return {
      categoryKey: "Welcome Bonus",
      sheetName: SOURCE_WELCOME_SHEET,
      statusColumn: 8 // 體驗金777!H = StatusHQ
    };
  }

  if (category === "Promo Syukuran") {
    return {
      categoryKey: "Promo Syukuran",
      sheetName: SOURCE_PROMO_SYUKURAN_SHEET,
      statusColumn: 4 // 感恩禮金!D = StatusHQ
    };
  }

  if (category === "VVIP DEPO") {
    return {
      categoryKey: "VVIP DEPO",
      sheetName: SOURCE_VVIP_DEPO_SHEET,
      statusColumn: 8 // VVIP-當日存款!H = StatusHQ
    };
  }

  if (category === "VVIP Special Prize") {
    return {
      categoryKey: "VVIP Special Prize",
      sheetName: SOURCE_VVIP_SPECIAL_SHEET,
      statusColumn: 9 // VVIP-特別獎!I = StatusHQ
    };
  }

  if (category === "Lucky Money 88") {
    return {
      categoryKey: "Lucky Money 88",
      sheetName: SOURCE_LUCKY_MONEY_SHEET,
      statusColumn: 4 // 新升銅禮金Lucky money!D = StatusHQ
    };
  }

  if (category === "Transfer Agen") {
    return {
      categoryKey: "Transfer Agen",
      sheetName: SOURCE_TRANSFER_AGEN_SHEET,
      statusColumn: 4 // 轉線- Transfer Agen!D = StatusHQ
    };
  }

  return null;
}

function getFallbackSyncDateWindow_(tz) {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const todayKey = Utilities.formatDate(now, tz, "yyyy-MM-dd");
  const yesterdayKey = Utilities.formatDate(yesterday, tz, "yyyy-MM-dd");
  const todayMDKey = Utilities.formatDate(now, tz, "MM/dd");
  const yesterdayMDKey = Utilities.formatDate(yesterday, tz, "MM/dd");
  const hour = Number(Utilities.formatDate(now, tz, "H"));

  // Yesterday fallback is only needed shortly after midnight.
  // Claims that already have HQ Submit Target Row are checked by exact row anyway,
  // so they do not need this date window and remain pending until StatusHQ is filled.
  const includeYesterday = hour >= 0 && hour <= 2;
  const allowedDateKeys = {};
  allowedDateKeys[todayKey] = true;
  if (includeYesterday) allowedDateKeys[yesterdayKey] = true;

  return {
    todayKey: todayKey,
    yesterdayKey: yesterdayKey,
    todayMDKey: todayMDKey,
    yesterdayMDKey: yesterdayMDKey,
    includeYesterday: includeYesterday,
    allowedDateKeys: allowedDateKeys,
    label: includeYesterday ? (todayKey + " + " + yesterdayKey) : todayKey
  };
}

function readHQStatusByTargetRows_(ssSource, cfg, targetRows) {
  const sh = ssSource.getSheetByName(cfg.sheetName);
  if (!sh) throw new Error("Sheet HQ " + cfg.sheetName + " tidak ditemukan.");

  const maxRows = sh.getMaxRows();
  const rows = targetRows
    .map(r => Number(r))
    .filter(r => r && r >= 2 && r <= maxRows)
    .filter((r, i, arr) => arr.indexOf(r) === i)
    .sort((a, b) => a - b);

  const map = {};
  if (!rows.length) return map;

  let start = rows[0];
  let prev = rows[0];

  function readBlock_(blockStart, blockEnd) {
    const height = blockEnd - blockStart + 1;
    const statusColumns = Array.isArray(cfg.statusColumns) && cfg.statusColumns.length
      ? cfg.statusColumns.map(c => Number(c)).filter(c => c > 0)
      : [Number(cfg.statusColumn)];

    const blockValues = statusColumns.map(col => {
      return {
        col: col,
        values: sh.getRange(blockStart, col, height, 1).getDisplayValues()
      };
    });

    for (let i = 0; i < height; i++) {
      const row = blockStart + i;
      let status = "";

      for (let c = 0; c < blockValues.length; c++) {
        status = String((blockValues[c].values[i] && blockValues[c].values[i][0]) || "").trim();
        if (status) break;
      }

      map[row] = status;
    }
  }

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row === prev + 1) {
      prev = row;
    } else {
      readBlock_(start, prev);
      start = row;
      prev = row;
    }
  }

  readBlock_(start, prev);
  return map;
}

function syncBonusReceivedCore_(opt) {
  opt = opt || {};

  // SyncHQ jangan pakai ScriptLock global, supaya tidak mengunci submit user / action admin.
  // Cache flag cukup untuk mencegah trigger sync saling tumpuk; kalau overlap, sync berikutnya tetap jalan per menit.
  const syncCache = CacheService.getScriptCache();
  const syncBusyKey = "SYNC_HQ_RUNNING";
  if (syncCache.get(syncBusyKey)) {
    const msg = "SyncHQ masih berjalan dari trigger sebelumnya. Auto sync berikutnya akan cek lagi.";
    recordAutoSyncHQStatus_("BUSY", msg, "");
    return msg;
  }
  syncCache.put(syncBusyKey, "1", 55);

  try {
    const ssTarget = SpreadsheetApp.getActiveSpreadsheet();
    const shBonus = ensureBonusClaimHQSubmitColumns_() || ssTarget.getSheetByName(SHEET_BONUS_CLAIM);
    if (!shBonus) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

    const tz = Session.getScriptTimeZone();
    const win = getFallbackSyncDateWindow_(tz);

    const bonusLastRow = shBonus.getLastRow();
    if (bonusLastRow < 2) {
      const msg = "Sync selesai: BONUS_CLAIM kosong.";
      recordAutoSyncHQStatus_("OK", msg, "");
      return msg;
    }

    const rowCount = bonusLastRow - 1;
    const claimColCount = 22;
    const bonusValues = shBonus.getRange(2, 1, rowCount, claimColCount).getValues();
    const bonusDisplay = shBonus.getRange(2, 1, rowCount, claimColCount).getDisplayValues();
    const hqWriteValues = shBonus.getRange(2, 16, rowCount, 2).getValues();

    const fastGroups = {};
    const fallbackCandidates = [];
    const neededCategories = {};
    let fastChecked = 0;
    let fastStillBlank = 0;

    bonusValues.forEach((r, i) => {
      const d = bonusDisplay[i];
      const rowEmail = String(d[1] || "").trim().toLowerCase();

      if (!opt.adminMode && rowEmail !== String(opt.email || "").trim().toLowerCase()) return;

      const currentClaimStatus = String(d[11] || "").trim();
      if (currentClaimStatus === "Rejected") return;

      const currentStatusHQ = String(d[15] || "").trim();
      if (currentStatusHQ) return;

      const category = String(d[4] || "").trim();
      if (!category) return;
      if (NO_SYNC_CATEGORIES[category]) return;

      const hqSubmitStatus = String(d[17] || "").trim();
      const hqTargetRow = Number(d[20] || r[20] || 0);
      const fastCfg = getFastSyncHQConfig_(category);

      // FAST MODE:
      // If a claim was submitted to HQ by this system and has Target Row,
      // that target row is the pending-sync memory. Keep checking it every minute
      // until StatusHQ is filled. Do not skip middle gaps like H40839/H40840.
      if (fastCfg && hqSubmitStatus && hqTargetRow >= 2) {
        const groupKey = [fastCfg.categoryKey, fastCfg.sheetName, fastCfg.statusColumn].join("|");
        if (!fastGroups[groupKey]) {
          fastGroups[groupKey] = {
            cfg: fastCfg,
            targetRows: [],
            items: []
          };
        }

        fastGroups[groupKey].targetRows.push(hqTargetRow);
        fastGroups[groupKey].items.push({
          arrayIndex: i,
          rowIndex: i + 2,
          category: category,
          hqTargetRow: hqTargetRow
        });
        return;
      }

      // FALLBACK MODE:
      // Only for old/manual claims that do not have Target Row yet.
      // This still uses matching maps, but only today, plus yesterday shortly after midnight.
      const dateKey = normalizeDateKey_(r[0], tz);
      if (!win.allowedDateKeys[dateKey]) return;

      const c = {
        arrayIndex: i,
        rowIndex: i + 2,
        dateKey: dateKey,
        mdKey: normalizeDateMDKey_(r[0], tz),
        email: rowEmail,
        category: category,
        akun: normalizeText_(r[3]),
        tipe: String(r[5] || "").trim(),
        slip: normalizeSlip_(r[7]),
        kodeAgen: normalizeText_(r[9]),
        remarks: String(r[10] || "").trim()
      };

      fallbackCandidates.push(c);

      if (isTiapHariHadiahBesarCategory_(category)) {
        neededCategories["Tiap Hari Hadiah Besar"] = true;
      } else if (isHelloFriendsCategory_(category)) {
        neededCategories["Hello Friends"] = true;
      } else {
        neededCategories[category] = true;
      }
    });

    const fastGroupKeys = Object.keys(fastGroups);

    if (!fastGroupKeys.length && fallbackCandidates.length === 0) {
      const msg = "Tidak ada data baru untuk SyncHQ. Fast pending: 0 | Fallback date: " + win.label;
      recordAutoSyncHQStatus_("OK", msg, "");
      return msg;
    }

    const ssSource = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    let updated = 0;
    const checkedAt = new Date();

    fastGroupKeys.forEach(groupKey => {
      const group = fastGroups[groupKey];
      const statusMap = readHQStatusByTargetRows_(ssSource, group.cfg, group.targetRows);

      group.items.forEach(item => {
        fastChecked++;
        const statusHQ = String(statusMap[item.hqTargetRow] || "").trim();

        if (statusHQ) {
          hqWriteValues[item.arrayIndex][0] = statusHQ;
          hqWriteValues[item.arrayIndex][1] = checkedAt;
          updated++;
        } else {
          fastStillBlank++;
        }
      });
    });

    const sourceMaps = {};

    function mergeMap(a, b) {
      a = a || {};
      b = b || {};
      Object.keys(b).forEach(k => a[k] = b[k]);
      return a;
    }

    if (fallbackCandidates.length) {
      if (neededCategories["CU Sport"]) {
        sourceMaps["CU Sport"] = buildCuSportSourceMap_(ssSource, tz, win.todayKey);
        if (win.includeYesterday) sourceMaps["CU Sport"] = mergeMap(sourceMaps["CU Sport"], buildCuSportSourceMap_(ssSource, tz, win.yesterdayKey));
      }
      if (neededCategories["Welcome Bonus"]) {
        sourceMaps["Welcome Bonus"] = buildWelcomeSourceMap_(ssSource, tz, win.todayKey);
        if (win.includeYesterday) sourceMaps["Welcome Bonus"] = mergeMap(sourceMaps["Welcome Bonus"], buildWelcomeSourceMap_(ssSource, tz, win.yesterdayKey));
      }
      if (neededCategories["Promo Syukuran"]) {
        sourceMaps["Promo Syukuran"] = buildPromoSyukuranSourceMap_(ssSource, tz, win.todayKey);
        if (win.includeYesterday) sourceMaps["Promo Syukuran"] = mergeMap(sourceMaps["Promo Syukuran"], buildPromoSyukuranSourceMap_(ssSource, tz, win.yesterdayKey));
      }
      if (neededCategories["Transfer Agen"]) {
        sourceMaps["Transfer Agen"] = buildTransferAgenSourceMap_(ssSource, tz, win.todayKey);
        if (win.includeYesterday) sourceMaps["Transfer Agen"] = mergeMap(sourceMaps["Transfer Agen"], buildTransferAgenSourceMap_(ssSource, tz, win.yesterdayKey));
      }
      if (neededCategories["VVIP DEPO"]) {
        sourceMaps["VVIP DEPO"] = buildVvipDepoSourceMap_(ssSource, tz, win.todayMDKey);
        if (win.includeYesterday) sourceMaps["VVIP DEPO"] = mergeMap(sourceMaps["VVIP DEPO"], buildVvipDepoSourceMap_(ssSource, tz, win.yesterdayMDKey));
      }
      if (neededCategories["VVIP Special Prize"]) {
        sourceMaps["VVIP Special Prize"] = buildVvipSpecialSourceMap_(ssSource, tz, win.todayMDKey);
        if (win.includeYesterday) sourceMaps["VVIP Special Prize"] = mergeMap(sourceMaps["VVIP Special Prize"], buildVvipSpecialSourceMap_(ssSource, tz, win.yesterdayMDKey));
      }
      if (neededCategories["Lucky Money 88"]) {
        sourceMaps["Lucky Money 88"] = buildLuckyMoneySourceMap_(ssSource, tz, win.todayKey);
        if (win.includeYesterday) sourceMaps["Lucky Money 88"] = mergeMap(sourceMaps["Lucky Money 88"], buildLuckyMoneySourceMap_(ssSource, tz, win.yesterdayKey));
      }
      if (neededCategories["Tiap Hari Hadiah Besar"]) {
        sourceMaps["Tiap Hari Hadiah Besar"] = buildTiapHariHadiahBesarSourceMap_(ssSource, tz, win.todayKey);
        if (win.includeYesterday) sourceMaps["Tiap Hari Hadiah Besar"] = mergeMap(sourceMaps["Tiap Hari Hadiah Besar"], buildTiapHariHadiahBesarSourceMap_(ssSource, tz, win.yesterdayKey));
      }
      if (neededCategories["Hello Friends"]) {
        sourceMaps["Hello Friends"] = buildHelloFriendsSourceMap_(ssSource, tz, win.todayKey);
        if (win.includeYesterday) sourceMaps["Hello Friends"] = mergeMap(sourceMaps["Hello Friends"], buildHelloFriendsSourceMap_(ssSource, tz, win.yesterdayKey));
      }
    }

    fallbackCandidates.forEach(c => {
      let statusHQ = "";

      if (c.category === "CU Sport") {
        statusHQ = (sourceMaps["CU Sport"] || {})[c.dateKey + "|" + c.akun + "|" + c.slip] || "";
      }
      if (c.category === "Welcome Bonus") {
        const welcomeMap = sourceMaps["Welcome Bonus"] || {};
        const sourceTipe = WELCOME_BONUS_SOURCE_MAP[c.tipe] || c.tipe;

        // Support old HQ wording (WELCOME_BONUS_SOURCE_MAP) and new direct write wording (original UI tipe bonus).
        statusHQ = welcomeMap[c.dateKey + "|" + c.akun + "|" + normalizeText_(sourceTipe)] ||
                   welcomeMap[c.dateKey + "|" + c.akun + "|" + normalizeText_(c.tipe)] ||
                   "";
      }
      if (c.category === "Promo Syukuran") {
        statusHQ = (sourceMaps["Promo Syukuran"] || {})[c.dateKey + "|" + c.akun + "|" + normalizeText_(c.tipe)] || "";
      }
      if (c.category === "Transfer Agen") {
        statusHQ = (sourceMaps["Transfer Agen"] || {})[c.dateKey + "|" + c.akun] || "";
      }
      if (c.category === "VVIP DEPO") {
        const tanggalInKey = normalizeDateKey_(c.remarks, tz);
        statusHQ = (sourceMaps["VVIP DEPO"] || {})[c.mdKey + "|" + c.akun + "|" + normalizeText_(c.tipe) + "|" + tanggalInKey] || "";
      }
      if (c.category === "VVIP Special Prize") {
        statusHQ = (sourceMaps["VVIP Special Prize"] || {})[c.mdKey + "|" + c.akun + "|" + c.slip] || "";
      }
      if (c.category === "Lucky Money 88") {
        statusHQ = (sourceMaps["Lucky Money 88"] || {})[c.dateKey + "|" + c.akun + "|" + normalizeText_(c.tipe)] || "";
      }
      if (isTiapHariHadiahBesarCategory_(c.category)) {
        statusHQ = (sourceMaps["Tiap Hari Hadiah Besar"] || {})[c.dateKey + "|" + c.akun + "|" + normalizeText_(c.tipe)] || "";
      }
      if (isHelloFriendsCategory_(c.category)) {
        const akunDiajak = normalizeText_(parseHelloFriendsDiajak_(c.remarks));
        statusHQ = (sourceMaps["Hello Friends"] || {})[c.dateKey + "|" + c.akun + "|" + akunDiajak + "|" + normalizeText_(c.tipe)] || "";
      }

      if (statusHQ) {
        hqWriteValues[c.arrayIndex][0] = statusHQ;
        hqWriteValues[c.arrayIndex][1] = checkedAt;
        updated++;
      }
    });

    if (updated > 0) {
      shBonus.getRange(2, 16, rowCount, 2).setValues(hqWriteValues);
    }

    const result =
      "Sync selesai. Fast target dicek: " + fastChecked +
      " | Fast pending kosong: " + fastStillBlank +
      " | Fallback date: " + win.label +
      " | Fallback dicek: " + fallbackCandidates.length +
      " | Update StatusHQ: " + updated;

    recordAutoSyncHQStatus_("OK", result, "");
    return result;

  } finally {
    syncCache.remove(syncBusyKey);
  }
}


// ===============================
// SOURCE MAP BUILDERS
// ===============================

function buildCuSportSourceMap_(ssSource, tz, todayKey) {
  const sh = ssSource.getSheetByName(SOURCE_CU_SPORT_SHEET);
  if (!sh) throw new Error("Sheet sumber " + SOURCE_CU_SPORT_SHEET + " tidak ditemukan.");

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {};

  const values = sh.getRange(2, 1, lastRow - 1, 10).getValues();
  const map = {};

  values.forEach(r => {
    const dateKey = normalizeDateKey_(r[0], tz);
    if (dateKey !== todayKey) return;

    const akun = normalizeText_(r[3]);
    const slip = normalizeSlip_(r[7]);
    // CU Sport HQ normal status column is J. Use I as fallback if HQ layout/validation places status there.
    const status = String(r[9] || r[8] || "").trim();

    if (!akun || !slip || !status) return;

    map[dateKey + "|" + akun + "|" + slip] = status;
  });

  return map;
}

function buildWelcomeSourceMap_(ssSource, tz, todayKey) {
  const sh = ssSource.getSheetByName(SOURCE_WELCOME_SHEET);
  if (!sh) throw new Error("Sheet sumber " + SOURCE_WELCOME_SHEET + " tidak ditemukan.");

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {};

  const values = sh.getRange(2, 1, lastRow - 1, 8).getValues();
  const map = {};

  values.forEach(r => {
    const dateKey = normalizeDateKey_(r[0], tz);
    if (dateKey !== todayKey) return;

    const akun = normalizeText_(r[4]);
    const tipe = normalizeText_(r[6]);
    const status = String(r[7] || "").trim();

    if (!akun || !tipe || !status) return;

    map[dateKey + "|" + akun + "|" + tipe] = status;
  });

  return map;
}

function buildPromoSyukuranSourceMap_(ssSource, tz, todayKey) {
  const sh = ssSource.getSheetByName(SOURCE_PROMO_SYUKURAN_SHEET);
  if (!sh) throw new Error("Sheet sumber " + SOURCE_PROMO_SYUKURAN_SHEET + " tidak ditemukan.");

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {};

  const values = sh.getRange(2, 1, lastRow - 1, 4).getValues();
  const map = {};

  values.forEach(r => {
    const dateKey = normalizeDateKey_(r[0], tz);
    if (dateKey !== todayKey) return;

    const akun = normalizeText_(r[1]);
    const tipe = normalizeText_(r[2]);
    const status = String(r[3] || "").trim();

    if (!akun || !tipe || !status) return;

    map[dateKey + "|" + akun + "|" + tipe] = status;
  });

  return map;
}

function buildTransferAgenSourceMap_(ssSource, tz, todayKey) {
  const sh = ssSource.getSheetByName(SOURCE_TRANSFER_AGEN_SHEET);
  if (!sh) throw new Error("Sheet sumber " + SOURCE_TRANSFER_AGEN_SHEET + " tidak ditemukan.");

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {};

  const values = sh.getRange(2, 1, lastRow - 1, 4).getValues();
  const map = {};

  values.forEach(r => {
    const dateKey = normalizeDateKey_(r[0], tz);
    if (dateKey !== todayKey) return;

    const akun = normalizeText_(r[1]);
    const status = String(r[3] || "").trim();

    if (!akun || !status) return;

    map[dateKey + "|" + akun] = status;
  });

  return map;
}

function buildVvipDepoSourceMap_(ssSource, tz, todayMDKey) {
  const sh = ssSource.getSheetByName(SOURCE_VVIP_DEPO_SHEET);
  if (!sh) throw new Error("Sheet sumber " + SOURCE_VVIP_DEPO_SHEET + " tidak ditemukan.");

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {};

  const values = sh.getRange(2, 1, lastRow - 1, 8).getValues();
  const map = {};

  values.forEach(r => {
    const dateMDKey = normalizeDateMDKey_(r[0], tz);
    if (dateMDKey !== todayMDKey) return;

    const akun = normalizeText_(r[3]);
    const tipe = normalizeText_(r[4]);
    const tanggalInKey = normalizeDateKey_(r[5], tz);
    const status = String(r[7] || "").trim();

    if (!akun || !tipe || !tanggalInKey || !status) return;

    map[dateMDKey + "|" + akun + "|" + tipe + "|" + tanggalInKey] = status;
  });

  return map;
}

function buildVvipSpecialSourceMap_(ssSource, tz, todayMDKey) {
  const sh = ssSource.getSheetByName(SOURCE_VVIP_SPECIAL_SHEET);
  if (!sh) throw new Error("Sheet sumber " + SOURCE_VVIP_SPECIAL_SHEET + " tidak ditemukan.");

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {};

  const values = sh.getRange(2, 1, lastRow - 1, 9).getValues();
  const map = {};

  values.forEach(r => {
    const dateMDKey = normalizeDateMDKey_(r[0], tz);
    if (dateMDKey !== todayMDKey) return;

    const akun = normalizeText_(r[3]);
    const slip = normalizeSlip_(r[6]);
    const status = String(r[8] || "").trim();

    if (!akun || !slip || !status) return;

    map[dateMDKey + "|" + akun + "|" + slip] = status;
  });

  return map;
}

function buildLuckyMoneySourceMap_(ssSource, tz, todayKey) {
  const sh = ssSource.getSheetByName(SOURCE_LUCKY_MONEY_SHEET);
  if (!sh) throw new Error("Sheet sumber " + SOURCE_LUCKY_MONEY_SHEET + " tidak ditemukan.");

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {};

  const values = sh.getRange(2, 1, lastRow - 1, 4).getValues();
  const map = {};

  values.forEach(r => {
    const dateKey = normalizeDateKey_(r[0], tz);
    if (dateKey !== todayKey) return;

    const akun = normalizeText_(r[1]);
    const tipe = normalizeText_(r[2]);
    const status = String(r[3] || "").trim();

    if (!akun || !tipe || !status) return;

    map[dateKey + "|" + akun + "|" + tipe] = status;
  });

  return map;
}

function buildTiapHariHadiahBesarSourceMap_(ssSource, tz, dateKey) {
  const sh = ssSource.getSheetByName("(新)天天拿大獎");
  if (!sh) throw new Error("Sheet sumber (新)天天拿大獎 tidak ditemukan.");

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {};

  const values = sh.getRange(2, 1, lastRow - 1, 9).getValues();
  const map = {};

  values.forEach(r => {
    const dKey = normalizeDateKey_(r[0], tz);
    if (dKey !== dateKey) return;

    const akun = normalizeText_(r[3]);       // D = Akun MB
    const tipe = normalizeText_(r[7]);       // H = Tipe Bonus
    const status = String(r[8] || "").trim(); // I = StatusHQ

    if (!akun || !tipe || !status) return;

    map[dKey + "|" + akun + "|" + tipe] = status;
  });

  return map;
}

function buildHelloFriendsSourceMap_(ssSource, tz, dateKey) {
  const sh = ssSource.getSheetByName(SOURCE_HELLO_FRIENDS_SHEET);
  if (!sh) throw new Error("Sheet sumber " + SOURCE_HELLO_FRIENDS_SHEET + " tidak ditemukan.");

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return {};

  const values = sh.getRange(2, 1, lastRow - 1, 11).getValues();
  const map = {};

  values.forEach(r => {
    const dKey = normalizeDateKey_(r[0], tz);
    if (dKey !== dateKey) return;

    const akunPengenal = normalizeText_(r[4]); // E = Akun MB Pengenal
    const akunDiajak = normalizeText_(r[5]);   // F = Akun MB yang Diajak
    const tipe = normalizeText_(r[8]);         // I = Bonus/Tipe Bonus
    const status = String(r[10] || "").trim(); // K = StatusHQ

    if (!akunPengenal || !akunDiajak || !tipe || !status) return;

    map[dKey + "|" + akunPengenal + "|" + akunDiajak + "|" + tipe] = status;
  });

  return map;
}


// ===============================
// BONUS HELPERS
// ===============================

function isTiapHariHadiahBesarCategory_(category) {
  const c = String(category || "").trim();
  return c === "Tiap Hari Bonus Besar" ||
         c === "Tiap Hari Hadiah Besar" ||
         c === "天天拿大獎 / Tiap Hari Hadiah Besar" ||
         c === "天天拿大獎 / Tiap Hari Bonus Besar";
}

function isHelloFriendsCategory_(category) {
  const c = String(category || "").trim();
  return c === "HELLOFRIENDS-介紹朋友活動-普通 / HELLOFRIENDS Pengenalan Teman" ||
         c === "HELLOFRIENDS-介紹朋友活動-VIP / HELLOFRIENDS VIP" ||
         c === "Hello Friends";
}

function getHelloFriendsNominal_(tipe) {
  const map = {
    "HELLO FRIEND-77": "77",
    "HELLO FRIEND-77+77": "77+77",
    "HELLO FRIEND-77+127": "77+127",
    "HELLO FRIEND-77+177": "77+177"
  };
  return map[String(tipe || "").trim()] || "";
}

function getTiapHariNominal_(tipe) {
  const text = String(tipe || "").trim();
  const m = text.match(/(\d+)\s*$/);
  return m ? m[1] : "";
}

function getTiapHariInHarianAmount_(tipeOrNominal) {
  const key = getTiapHariNominal_(tipeOrNominal) || String(tipeOrNominal || "").trim();
  const map = {
    "38": "300",
    "128": "1000",
    "268": "2000",
    "368": "3000",
    "568": "5000"
  };
  return map[key] || "";
}


function parseHelloFriendsDiajak_(remarks) {
  const text = String(remarks || "").trim();
  if (!text) return "";
  return text.split(" - ")[0].trim();
}

function normalizeHelloFriendsJumlahPengenalan_(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const compact = raw.replace(/\s+/g, "").replace(/-/g, "~");
  const map = {
    "1~10": "1~10",
    "11~20": "11~20",
    "21~30": "21~30+",
    "21~30+": "21~30+"
  };

  return map[compact] || raw;
}

function parseHelloFriendsJumlahPengenalan_(remarks) {
  const text = String(remarks || "").trim();
  if (!text) return "";

  const m = text.match(/Jumlah\s+Pengenalan\s*:\s*([^\-]+)/i);
  if (m) return normalizeHelloFriendsJumlahPengenalan_(m[1]);

  const allowed = ["1~10", "11~20", "21~30+"];
  for (let i = 0; i < allowed.length; i++) {
    if (text.indexOf(allowed[i]) >= 0) return allowed[i];
  }

  return "";
}

function normalizeHelloFriendsFixedType_(value) {
  const text = String(value || "").trim();
  const up = text.toUpperCase();

  if (!text) return "";
  if (text.indexOf("VIP-介紹好友") >= 0 || up.indexOf("VIP") >= 0) return "VIP-介紹好友";
  if (text.indexOf("普通-介紹好友") >= 0 || text.indexOf("普通") >= 0 || up.indexOf("PENGENALAN") >= 0 || up.indexOf("HELLOFRIENDS") >= 0) return "普通-介紹好友";

  return text;
}

function parseHelloFriendsFixedType_(remarks) {
  const text = String(remarks || "").trim();
  return normalizeHelloFriendsFixedType_(text) || "普通-介紹好友";
}


// ===============================
// UPLOAD / NORMALIZE HELPERS
// ===============================

function uploadFilesToDrive_(files, meta) {
  if (!files || !files.length) return [];

  const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
  const urls = [];
  const now = new Date();
  const ts = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyyMMdd_HHmmss");

  files.forEach((f, i) => {
    if (!f || !f.data) return;

    const rawName = String(f.name || ("upload_" + (i + 1))).trim();
    const mimeType = String(f.mimeType || "application/octet-stream").trim();
    const cleanName = sanitizeFileName_(rawName);
    const category = sanitizeFileName_(meta.category || "Bonus");
    const akun = sanitizeFileName_(meta.akunMember || "Akun");
    const staff = sanitizeFileName_(meta.staffName || "Staff");

    let base64 = String(f.data || "");
    base64 = base64.replace(/^data:.*?;base64,/, "");

    const bytes = Utilities.base64Decode(base64);
    const fileName = ts + "_" + category + "_" + staff + "_" + akun + "_OPEN" + (i + 1) + "_" + cleanName;
    const blob = Utilities.newBlob(bytes, mimeType, fileName);
    const file = folder.createFile(blob);

    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (err) {}

    urls.push(file.getUrl());
  });

  return urls;
}

function sanitizeFileName_(value) {
  return String(value || "")
    .trim()
    .replace(/[\\\/:*?"<>|#%{}~&]/g, "_")
    .replace(/\s+/g, "_")
    .substring(0, 80);
}

function normalizeDateKey_(value, tz) {
  if (!value) return "";

  if (value instanceof Date && !isNaN(value)) {
    return Utilities.formatDate(value, tz, "yyyy-MM-dd");
  }

  const text = String(value).trim();

  let m = text.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (m) {
    return m[1] + "-" + String(m[2]).padStart(2, "0") + "-" + String(m[3]).padStart(2, "0");
  }

  m = text.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (m) {
    const y = Utilities.formatDate(new Date(), tz, "yyyy");
    return y + "-" + String(m[1]).padStart(2, "0") + "-" + String(m[2]).padStart(2, "0");
  }

  const d = new Date(text);
  if (d instanceof Date && !isNaN(d)) {
    return Utilities.formatDate(d, tz, "yyyy-MM-dd");
  }

  return "";
}

function normalizeDateMDKey_(value, tz) {
  if (!value) return "";

  if (value instanceof Date && !isNaN(value)) {
    return Utilities.formatDate(value, tz, "MM/dd");
  }

  const text = String(value).trim();

  let m = text.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (m) {
    return String(m[2]).padStart(2, "0") + "/" + String(m[3]).padStart(2, "0");
  }

  m = text.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (m) {
    return String(m[1]).padStart(2, "0") + "/" + String(m[2]).padStart(2, "0");
  }

  const d = new Date(text);
  if (d instanceof Date && !isNaN(d)) {
    return Utilities.formatDate(d, tz, "MM/dd");
  }

  return "";
}

function normalizeText_(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
}

function normalizeSlip_(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
}

function parseDriveLinks_(value) {
  if (Array.isArray(value)) {
    return value.map(x => String(x || "").trim()).filter(x => x);
  }

  return String(value || "")
    .split(",")
    .map(x => x.trim())
    .filter(x => x);
}

function setDriveLinksRichText_(range, value) {
  const links = parseDriveLinks_(value);

  if (links.length === 0) {
    range.setValue("");
    return;
  }

  const labels = links.map((_, i) => "OPEN " + (i + 1));
  const text = labels.join("\n");

  const builder = SpreadsheetApp.newRichTextValue().setText(text);

  let pos = 0;

  labels.forEach((label, i) => {
    builder.setLinkUrl(pos, pos + label.length, links[i]);
    pos += label.length + 1;
  });

  range.setRichTextValue(builder.build());
}

function getDriveLinksFromRichText_(richText) {
  try {
    if (!richText) return [];

    const runs = richText.getRuns();
    if (!runs || !runs.length) return [];

    const links = [];

    runs.forEach(run => {
      const url = run.getLinkUrl();
      if (url) links.push(url);
    });

    return links;

  } catch(err) {
    return [];
  }
}

function extractHyperlink_(formula) {
  if (!formula) return "";

  const match = formula.match(/HYPERLINK\("([^"]+)"/i);

  return match ? match[1] : "";
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function testUploadAccess() {
  const user = getLoginUser_();
  const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
  const ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss");
  const fileName = "UPLOAD_ACCESS_TEST_" + sanitizeFileName_(user.email) + "_" + ts + ".txt";
  const blob = Utilities.newBlob("upload access test", "text/plain", fileName);
  const file = folder.createFile(blob);
  const url = file.getUrl();

  try {
    file.setTrashed(true);
  } catch (err) {}

  return {
    ok: true,
    message: "Upload access ready. Test file berhasil dibuat dan dihapus.",
    url: url
  };
}


// ===============================
// LEGACY DIRECT AGENT CHAT (kept for compatibility)
// ===============================

function getDirectAgentCases() {
  ensureChatLogSheet_();

  const email = Session.getActiveUser().getEmail();
  const user = getUserAccess_(email);
  if (!user) throw new Error("Access denied.");

  const isAdmin = isFullAdminRole_(user.role);
  const data = getClaimHistory({ todayOnly: false });
  const unreadMap = getDirectAgentUnreadMap_(isAdmin ? "Admin" : "User", user.email);

  return data
    .filter(r => r.bonusCategory === "Direct Agent")
    .filter(r => isAdmin || String(r.email).trim().toLowerCase() === user.email.toLowerCase())
    .map(r => {
      r.unreadCount = unreadMap[r.row] || 0;
      return r;
    });
}

function getDirectAgentUnreadCount() {
  ensureChatLogSheet_();

  const email = Session.getActiveUser().getEmail();
  const user = getUserAccess_(email);
  if (!user) return 0;

  const role = isFullAdminRole_(user.role) ? "Admin" : "User";
  const map = getDirectAgentUnreadMap_(role, user.email);

  return Object.keys(map).reduce((acc, k) => acc + (map[k] || 0), 0);
}

function getDirectAgentUnreadMap_(viewerRole, viewerEmail) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const shLog = ss.getSheetByName(SHEET_CLAIM_CHAT_LOG);
  const shClaim = ss.getSheetByName(SHEET_BONUS_CLAIM);

  if (!shLog || shLog.getLastRow() < 2) return {};

  const claimLastRow = shClaim.getLastRow();
  if (claimLastRow < 2) return {};

  const claims = shClaim.getRange(2, 1, claimLastRow - 1, 17).getValues();
  const allowedRows = {};

  claims.forEach((r, i) => {
    const rowNum = i + 2;
    const ownerEmail = String(r[1] || "").trim().toLowerCase();
    const category = String(r[4] || "").trim();

    if (category !== "Direct Agent") return;

    if (viewerRole === "Admin") {
      allowedRows[rowNum] = true;
    } else if (ownerEmail === String(viewerEmail || "").trim().toLowerCase()) {
      allowedRows[rowNum] = true;
    }
  });

  const logs = shLog.getRange(2, 1, shLog.getLastRow() - 1, 10).getValues();
  const map = {};

  logs.forEach(r => {
    const claimRow = Number(r[1]);
    const senderRole = String(r[3] || "").trim();
    const readByUser = String(r[8] || "").trim();
    const readByAdmin = String(r[9] || "").trim();

    if (!allowedRows[claimRow]) return;

    if (viewerRole === "Admin" && senderRole === "User" && !readByAdmin) {
      map[claimRow] = (map[claimRow] || 0) + 1;
    }

    if (viewerRole === "User" && senderRole === "Admin" && !readByUser) {
      map[claimRow] = (map[claimRow] || 0) + 1;
    }
  });

  return map;
}

function getDirectAgentCase(row) {
  ensureChatLogSheet_();

  row = Number(row);

  const access = getDirectAgentAccess_(row);
  if (!access.allowed) throw new Error("Access denied.");

  markDirectAgentMessagesRead_(row, access.viewerRole);

  const claim = getClaimObjectByRow_(row);
  const chat = getChatMessagesByRow_(row);

  return {
    claim: claim,
    chat: chat,
    viewerRole: access.viewerRole
  };
}

function sendDirectAgentMessage(payload) {
  ensureChatLogSheet_();

  const row = Number(payload.row);
  const message = String(payload.message || "").trim();
  const uploadFiles = Array.isArray(payload.uploadFiles) ? payload.uploadFiles : [];
  const nextStatus = String(payload.status || "").trim();

  const access = getDirectAgentAccess_(row);
  if (!access.allowed) throw new Error("Access denied.");

  const claim = getClaimObjectByRow_(row);

  if (
    access.viewerRole !== "Admin" &&
    (claim.status === "Approved" || claim.status === "Rejected")
  ) {
    throw new Error("Case sudah ditutup.");
  }

  if (!message && uploadFiles.length === 0 && !nextStatus) {
    throw new Error("Isi pesan atau upload file terlebih dahulu.");
  }

  const uploadedLinks = uploadFilesToDrive_(uploadFiles, {
    category: "Direct Agent Chat",
    akunMember: claim.akunMember || "",
    staffName: access.senderName || ""
  });

  let statusSnapshot = claim.status || "Pending";

  if (access.viewerRole === "Admin" && nextStatus) {
    updateClaimStatus(row, nextStatus, message || claim.adminRemarks || "");
    statusSnapshot = nextStatus;
  }

  const finalMessage = message || (nextStatus ? "Status updated to " + nextStatus : "Attachment uploaded.");

  appendChatLog_(row, {
    senderEmail: access.email,
    senderRole: access.viewerRole,
    senderName: access.senderName,
    message: finalMessage,
    attachmentLinks: uploadedLinks,
    statusSnapshot: statusSnapshot,
    readByUser: access.viewerRole === "User" ? new Date() : "",
    readByAdmin: access.viewerRole === "Admin" ? new Date() : ""
  });

  return "Pesan berhasil dikirim.";
}

function getDirectAgentAccess_(row) {
  const email = Session.getActiveUser().getEmail();
  const user = getUserAccess_(email);
  if (!user) return { allowed: false };

  const claim = getClaimObjectByRow_(row);
  if (!claim || claim.bonusCategory !== "Direct Agent") return { allowed: false };

  const isAdmin = isFullAdminRole_(user.role);
  const isOwner = String(claim.email || "").trim().toLowerCase() === user.email.toLowerCase();

  if (!isAdmin && !isOwner) return { allowed: false };

  return {
    allowed: true,
    viewerRole: isAdmin ? "Admin" : "User",
    email: user.email,
    senderName: isAdmin ? (user.adminCode || user.email) : (claim.staffName || user.staffName || user.email)
  };
}

function getClaimObjectByRow_(row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_BONUS_CLAIM);

  if (!sh || row < 2 || row > sh.getLastRow()) return null;

  const display = sh.getRange(row, 1, 1, 17).getDisplayValues()[0];
  const formulas = sh.getRange(row, 1, 1, 17).getFormulas()[0];
  const rich = sh.getRange(row, 1, 1, 17).getRichTextValues()[0];

  const driveLinks = getDriveLinksFromRichText_(rich[12]);
  const fallbackLink = extractHyperlink_(formulas[12]) || display[12];
  const finalLinks = driveLinks.length ? driveLinks : (fallbackLink ? [fallbackLink] : []);

  return {
    row: row,
    timestamp: display[0],
    email: display[1],
    staffName: display[2],
    akunMember: display[3],
    bonusCategory: display[4],
    tipeBonus: display[5],
    nominalBonus: display[6],
    nomorSlip: display[7],
    nominalBetting: display[8],
    kodeAgen: display[9],
    remarks: display[10],
    status: display[11],
    driveLinks: finalLinks,
    adminRemarks: display[13],
    processedBy: display[14],
    statusHQ: display[15],
    checkedAt: display[16]
  };
}

function getChatMessagesByRow_(row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_CLAIM_CHAT_LOG);

  if (!sh || sh.getLastRow() < 2) return [];

  const raw = sh.getRange(2, 1, sh.getLastRow() - 1, 10).getDisplayValues();
  const rich = sh.getRange(2, 1, sh.getLastRow() - 1, 10).getRichTextValues();

  return raw
    .map((r, i) => {
      const claimRow = Number(r[1]);
      if (claimRow !== Number(row)) return null;

      const links = getDriveLinksFromRichText_(rich[i][6]);

      return {
        timestamp: r[0],
        claimRow: claimRow,
        senderEmail: r[2],
        senderRole: r[3],
        senderName: r[4],
        message: r[5],
        attachmentLinks: links,
        statusSnapshot: r[7],
        readByUser: r[8],
        readByAdmin: r[9]
      };
    })
    .filter(Boolean);
}

function markDirectAgentMessagesRead_(row, viewerRole) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_CLAIM_CHAT_LOG);

  if (!sh || sh.getLastRow() < 2) return;

  const values = sh.getRange(2, 1, sh.getLastRow() - 1, 10).getValues();
  const now = new Date();

  values.forEach((r, i) => {
    const claimRow = Number(r[1]);
    const senderRole = String(r[3] || "").trim();
    const sheetRow = i + 2;

    if (claimRow !== Number(row)) return;

    if (viewerRole === "Admin" && senderRole === "User" && !r[9]) {
      sh.getRange(sheetRow, 10).setValue(now);
    }

    if (viewerRole === "User" && senderRole === "Admin" && !r[8]) {
      sh.getRange(sheetRow, 9).setValue(now);
    }
  });
}

function appendChatLog_(claimRow, opt) {
  const sh = ensureChatLogSheet_();

  sh.appendRow([
    new Date(),
    claimRow,
    opt.senderEmail || "",
    opt.senderRole || "",
    opt.senderName || "",
    opt.message || "",
    "",
    opt.statusSnapshot || "",
    opt.readByUser || "",
    opt.readByAdmin || ""
  ]);

  const row = sh.getLastRow();

  if (opt.attachmentLinks && opt.attachmentLinks.length) {
    setDriveLinksRichText_(sh.getRange(row, 7), opt.attachmentLinks);
  }
}

function ensureChatLogSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_CLAIM_CHAT_LOG);

  if (!sh) {
    sh = ss.insertSheet(SHEET_CLAIM_CHAT_LOG);
  }

  if (sh.getLastRow() === 0) {
    sh.appendRow([
      "Timestamp",
      "Claim Row",
      "Sender Email",
      "Sender Role",
      "Sender Name",
      "Message",
      "Attachment Links",
      "Status After Message",
      "Read By User",
      "Read By Admin"
    ]);
  }

  return sh;
}



// =========================================================
// USER PANEL FORCE USER MODE PATCH
// Tujuan:
// - Gmail yang terdaftar Owner/Admin tetap dianggap User biasa saat membuka panel user.
// - Claim History tetap hanya data milik email tersebut.
// - Comment dari panel user tercatat sebagai Sender Role = User, bukan Admin.
// - Read badge user/admin tetap benar.
// =========================================================

function getCurrentUserForUserPanelIdentity_() {
  const user = getLoginUser_();

  return {
    email: user.email,
    role: "User",
    realRole: user.role,
    staffName: user.staffName || "",
    adminCode: user.adminCode || ""
  };
}

function getBonusCommentAccessForUserPanel_(row) {
  const user = getLoginUser_();
  const claim = getBonusCommentClaimObject_(row);

  if (!claim) return { allowed: false };

  const ownerEmail = String(claim.email || "").trim().toLowerCase();
  const viewerEmail = String(user.email || "").trim().toLowerCase();

  if (!ownerEmail || ownerEmail !== viewerEmail) {
    return { allowed: false };
  }

  return {
    allowed: true,
    viewerRole: "User",
    email: user.email,
    senderName: claim.staffName || user.staffName || user.email,
    claim: claim
  };
}

function getBonusCommentCaseForUserPanel(row) {
  row = Number(row);

  ensureBonusCommentsSheet_();

  const access = getBonusCommentAccessForUserPanel_(row);

  if (!access.allowed) {
    throw new Error("Access denied.");
  }

  markBonusCommentsRead_(row, "User");

  const claim = getBonusCommentClaimObject_(row);
  const status = String(claim.status || "").trim();
  const isClosed = status === "Approved" || status === "Rejected";
  const canAddComment = !isClosed;

  return {
    claim: claim,
    comments: getBonusCommentsByRow_(row),
    viewerRole: "User",
    unreadCount: 0,
    canAddComment: canAddComment,
    lockedMessage: canAddComment ? "" : "Case sudah " + status + ". Comment untuk user sudah ditutup."
  };
}

function addBonusCommentForUserPanel(payload) {
  const lock = acquireDocumentWriteLock_(10000, "Sistem sedang menyimpan comment lain. Coba lagi beberapa detik.");

  try {

    payload = payload || {};
    const row = Number(payload.row);
    const message = String(payload.message || "").trim();
    const uploadFiles = Array.isArray(payload.uploadFiles) ? payload.uploadFiles : [];

    if (!row) throw new Error("Case ID tidak valid.");
    if (!message && uploadFiles.length === 0) throw new Error("Isi comment atau upload attachment terlebih dahulu.");

    const access = getBonusCommentAccessForUserPanel_(row);
    if (!access.allowed) throw new Error("Access denied.");

    const claim = access.claim;
    const status = String(claim.status || "").trim();
    const isClosed = status === "Approved" || status === "Rejected";

    if (isClosed) {
      throw new Error("Case sudah " + status + ". Comment untuk user sudah ditutup.");
    }

    // Tandai comment admin yang sudah terbaca sebelum user mengirim balasan.
    markBonusCommentsRead_(row, "User");

    let uploadedLinks = [];

    if (uploadFiles.length) {
      if (typeof uploadFilesToDrive_ !== "function") throw new Error("Upload function belum tersedia di Code.gs.");

      uploadedLinks = uploadFilesToDrive_(uploadFiles, {
        category: "Bonus Comment",
        akunMember: claim.akunMember || "",
        staffName: access.senderName || ""
      });
    }

    const sh = ensureBonusCommentsSheet_();
    const now = new Date();
    const readByUserName = getCommentReaderName_("User");

    sh.appendRow([
      now,
      row,
      claim.bonusCategory || "",
      "User",
      access.email || "",
      access.senderName || "",
      message || (uploadedLinks.length ? "Attachment uploaded." : ""),
      "",
      claim.status || "",
      now,
      "",
      readByUserName,
      ""
    ]);

    const commentRow = sh.getLastRow();

    if (uploadedLinks.length) {
      if (typeof setDriveLinksRichText_ === "function") {
        setDriveLinksRichText_(sh.getRange(commentRow, 8), uploadedLinks);
      } else {
        sh.getRange(commentRow, 8).setValue(uploadedLinks.join(", "));
      }
    }

    return "Comment berhasil dikirim.";

  } finally {
    releaseLockSafe_(lock);
  }
}


// =========================================================
// HQ SUBMIT PILOT - TRANSFER AGEN + WELCOME BONUS + PROMO SYUKURAN
// =========================================================
// BONUS_CLAIM extra columns used by this pilot:
// R = HQ Submit Status
// S = HQ Submit At
// T = HQ Submit By
// U = HQ Submit Target Row
// V = HQ Submit Count
// StatusHQ remains column P and Checked At remains column Q.

function ensureBonusClaimHQSubmitColumns_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_BONUS_CLAIM);
  if (!sh) return null;

  const headers = {
    18: "HQ Submit Status",
    19: "HQ Submit At",
    20: "HQ Submit By",
    21: "HQ Submit Target Row",
    22: "HQ Submit Count",
    23: "THB Verify Status",
    24: "THB Helper Sync Status",
    25: "THB Helper TGL Snapshot"
  };

  Object.keys(headers).forEach(colText => {
    const col = Number(colText);
    const current = String(sh.getRange(1, col).getValue() || "").trim();
    if (!current) sh.getRange(1, col).setValue(headers[col]);
  });

  return sh;
}

function normalizeHQStatusForCompare_(status) {
  let raw = String(status || "").trim();

  try {
    raw = raw.normalize("NFKC");
  } catch (err) {
    // Apps Script V8 supports normalize, but keep fallback safe.
  }

  return raw
    .replace(/[\s\u00A0\u200B-\u200D\uFEFF]/g, "")
    .replace(/Ｏ/g, "O")
    .replace(/Ｋ/g, "K")
    .toUpperCase();
}

function isHQOkStatus_(status) {
  const raw = String(status || "").trim();
  const norm = normalizeHQStatusForCompare_(raw);

  // Treat common HQ success values as final OK.
  // Important: use startsWith("OK") so values like OK✅ / OK-已派發 count as OK,
  // but NOT OK will not pass because it starts with NOTOK.
  return norm === "OK" || norm.indexOf("OK") === 0 || raw === "是" || raw === "已派發" || raw === "通過";
}

function findLastDataRowByColumns_(sh, columns) {
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return 1;

  const maxCol = Math.max.apply(null, columns);
  const values = sh.getRange(1, 1, lastRow, maxCol).getDisplayValues();

  for (let i = values.length - 1; i >= 0; i--) {
    const row = values[i];
    const hasData = columns.some(col => String(row[col - 1] || "").trim() !== "");
    if (hasData) return i + 1;
  }

  return 1;
}

function formatHQSubmitDate_(value) {
  const tz = Session.getScriptTimeZone();
  let d = value instanceof Date ? value : new Date(value);
  if (!(d instanceof Date) || isNaN(d)) d = new Date();
  return Utilities.formatDate(d, tz, "yyyy/M/d");
}

function formatWelcomeHQSubmitDate_(value) {
  const tz = Session.getScriptTimeZone();
  let d = value instanceof Date ? value : new Date(value);
  if (!(d instanceof Date) || isNaN(d)) d = new Date();
  return Utilities.formatDate(d, tz, "yyyy/MM/dd");
}

function formatPromoSyukuranHQSubmitDate_(value) {
  const tz = Session.getScriptTimeZone();
  let d = value instanceof Date ? value : new Date(value);
  if (!(d instanceof Date) || isNaN(d)) d = new Date();
  return Utilities.formatDate(d, tz, "yyyy/MM/dd");
}

function formatVvipDepoHQSubmitDate_(value) {
  const tz = Session.getScriptTimeZone();
  let d = value instanceof Date ? value : new Date(value);
  if (!(d instanceof Date) || isNaN(d)) d = new Date();
  return Utilities.formatDate(d, tz, "MM/dd");
}

function formatVvipDepoTanggalInForHQ_(value) {
  const tz = Session.getScriptTimeZone();
  if (value instanceof Date && !isNaN(value)) {
    return Utilities.formatDate(value, tz, "yyyy/MM/dd");
  }

  const text = String(value || "").trim();
  if (!text) return "";

  let m = text.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (m) {
    return m[1] + "/" + String(m[2]).padStart(2, "0") + "/" + String(m[3]).padStart(2, "0");
  }

  m = text.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (m) {
    const y = Utilities.formatDate(new Date(), tz, "yyyy");
    return y + "/" + String(m[1]).padStart(2, "0") + "/" + String(m[2]).padStart(2, "0");
  }

  const d = new Date(text);
  if (d instanceof Date && !isNaN(d)) {
    return Utilities.formatDate(d, tz, "yyyy/MM/dd");
  }

  // Keep exact user remarks if it cannot be parsed, so admin can inspect the claim.
  return text;
}

function findFirstBlankRowByColumn_(sh, column, startRow) {
  // Append-mode based on the LAST FILLED cell in the selected column.
  // Important for HQ sheets like 體驗金777 where column A/date may be pre-filled
  // and there may be blank gaps near the top (example E2 blank).
  // We do NOT write to the first blank gap; we write to the next row after
  // the last non-empty Akun MB in column E.
  column = Number(column);
  startRow = Number(startRow || 2);

  if (!column || column < 1) throw new Error("Kolom pencarian row kosong tidak valid.");

  const maxRows = sh.getMaxRows();
  if (maxRows < startRow) return startRow;

  const values = sh.getRange(startRow, column, maxRows - startRow + 1, 1).getDisplayValues();

  for (let i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0] || "").trim() !== "") {
      const nextRow = startRow + i + 1;
      if (nextRow > maxRows) sh.insertRowsAfter(maxRows, nextRow - maxRows);
      return nextRow;
    }
  }

  return startRow;
}

function getWelcomeAgenStatus_(kodeAgen) {
  const code = String(kodeAgen || "").trim().toUpperCase();
  return WELCOME_AGEN_STATUS_MAP[code] || "";
}

function submitTransferAgenToHQ(row) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya Owner/Admin yang bisa Submit HQ.");
  }

  const lock = acquireHQWriteLock_(15000, "Submit HQ Transfer Agen sedang berjalan. Coba lagi beberapa detik.");

  try {

    row = Number(row);
    if (!row || row < 2) throw new Error("Row claim tidak valid.");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const shClaim = ensureBonusClaimHQSubmitColumns_();
    if (!shClaim) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");
    if (row > shClaim.getLastRow()) throw new Error("Claim tidak ditemukan. Silakan refresh data.");

    const claim = shClaim.getRange(row, 1, 1, 22).getValues()[0];
    const claimDisplay = shClaim.getRange(row, 1, 1, 22).getDisplayValues()[0];

    const category = String(claimDisplay[4] || "").trim();
    const status = String(claimDisplay[11] || "").trim();
    const statusHQ = String(claimDisplay[15] || "").trim();
    const hqSubmitStatus = String(claimDisplay[17] || "").trim();
    const hqSubmitCount = Number(claim[21] || 0);

    if (category !== "Transfer Agen") {
      throw new Error("Submit HQ pilot ini hanya untuk bonus Transfer Agen.");
    }

    if (status === "Rejected") {
      throw new Error("Claim sudah Rejected, tidak perlu dikirim ke HQ.");
    }

    assertClaimLockedForHQSubmit_(status, row);

    if (isHQOkStatus_(statusHQ)) {
      throw new Error("StatusHQ sudah OK. Tidak perlu Submit HQ lagi.");
    }

    if (hqSubmitStatus && !statusHQ) {
      throw new Error("Claim ini sudah dikirim ke HQ dan masih menunggu StatusHQ.");
    }

    // If HQ has answered non-OK, resubmit is allowed.
    const isResubmit = !!(hqSubmitStatus && statusHQ && !isHQOkStatus_(statusHQ));

    const applyDate = formatHQSubmitDate_(claim[0]);
    const akunMember = String(claimDisplay[3] || "").trim().toUpperCase();
    const kodeAgen = String(claimDisplay[9] || "").trim().toUpperCase();

    if (!akunMember) throw new Error("Akun Member kosong, tidak bisa Submit HQ.");
    if (!kodeAgen) throw new Error("Kode Agen kosong, tidak bisa Submit HQ.");

    const ssSource = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    const shHQ = ssSource.getSheetByName(SOURCE_TRANSFER_AGEN_SHEET);
    if (!shHQ) throw new Error("Sheet HQ " + SOURCE_TRANSFER_AGEN_SHEET + " tidak ditemukan.");

    const lastDataRow = findLastDataRowByColumns_(shHQ, [1, 2, 3]);
    const nextRow = Math.max(2, lastDataRow + 1);

    // HQ Transfer Agen mapping:
    // A = tanggal apply user, B = Akun MB, C = Kode Agen, D = StatusHQ remains empty.
    shHQ.getRange(nextRow, 1, 1, 3).setValues([[applyDate, akunMember, kodeAgen]]);

    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const submitBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);
    const now = new Date();

    shClaim.getRange(row, 18, 1, 5).setValues([[
      isResubmit ? "Resubmitted" : "Submitted",
      now,
      submitBy,
      nextRow,
      hqSubmitCount + 1
    ]]);

    return {
      ok: true,
      message: (isResubmit ? "Resubmit HQ berhasil" : "Submit HQ berhasil") + " ke row " + nextRow,
      claimRow: row,
      hqRow: nextRow,
      hqSubmitStatus: isResubmit ? "Resubmitted" : "Submitted",
      hqSubmitBy: submitBy,
      hqSubmitCount: hqSubmitCount + 1,
      data: {
        tanggal: applyDate,
        akunMember: akunMember,
        kodeAgen: kodeAgen
      }
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function columnNumberToLetter_(column) {
  column = Number(column);
  if (!column || column < 1) return "";

  let letter = "";
  while (column > 0) {
    const temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = Math.floor((column - temp - 1) / 26);
  }

  return letter;
}

function columnLetterToNumber_(letter) {
  letter = String(letter || "").trim().toUpperCase();
  if (!letter) return 0;

  let num = 0;
  for (let i = 0; i < letter.length; i++) {
    const code = letter.charCodeAt(i);
    if (code < 65 || code > 90) continue;
    num = num * 26 + (code - 64);
  }

  return num;
}

function getHQWritePointerKey_(category, sheetName, keyColumn) {
  return [
    "HQ_WRITE_POINTER",
    String(category || "").trim(),
    String(sheetName || "").trim(),
    columnNumberToLetter_(keyColumn)
  ].join("|");
}

function ensureHQWritePointerSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("HQ_WRITE_POINTER");

  if (!sh) sh = ss.insertSheet("HQ_WRITE_POINTER");

  const headers = [
    "Pointer Key",
    "Category",
    "HQ Sheet",
    "Key Column",
    "Last Row",
    "Updated At",
    "Updated By",
    "Note"
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
  } else {
    const lastCol = Math.max(sh.getLastColumn(), headers.length);
    const current = sh.getRange(1, 1, 1, lastCol).getValues()[0];

    headers.forEach((h, i) => {
      if (String(current[i] || "").trim() !== h) {
        sh.getRange(1, i + 1).setValue(h);
      }
    });
  }

  return sh;
}

function findHQWritePointerRows_(category, sheetName, keyColumn) {
  const key = getHQWritePointerKey_(category, sheetName, keyColumn);
  const sh = ensureHQWritePointerSheet_();
  const last = sh.getLastRow();
  const rows = [];

  if (last < 2) return rows;

  const values = sh.getRange(2, 1, last - 1, 5).getDisplayValues();
  const targetCategory = String(category || "").trim();
  const targetSheet = String(sheetName || "").trim();
  const targetKeyColumn = Number(keyColumn || 0);

  values.forEach((r, i) => {
    const row = i + 2;
    const rowKey = String(r[0] || "").trim();
    const rowCategory = String(r[1] || "").trim();
    const rowSheet = String(r[2] || "").trim();
    const rowKeyText = String(r[3] || "").trim();
    const rowKeyColumn = /^\d+$/.test(rowKeyText) ? Number(rowKeyText) : columnLetterToNumber_(rowKeyText);

    const sameKey = rowKey === key;
    const sameConfig = rowCategory === targetCategory && rowSheet === targetSheet && rowKeyColumn === targetKeyColumn;

    if (sameKey || sameConfig) rows.push(row);
  });

  return rows;
}

function updateHQWritePointerRecord_(category, sheetName, keyColumn, lastRow, note) {
  const key = getHQWritePointerKey_(category, sheetName, keyColumn);
  const sh = ensureHQWritePointerSheet_();
  const last = sh.getLastRow();
  const matches = findHQWritePointerRows_(category, sheetName, keyColumn);
  let targetRow = matches.length ? matches[0] : last + 1;

  const email = Session.getActiveUser().getEmail();
  const admin = getUserAccess_(email);
  const updatedBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);

  sh.getRange(targetRow, 1, 1, 8).setValues([[
    key,
    category,
    sheetName,
    columnNumberToLetter_(keyColumn),
    Number(lastRow || 0),
    new Date(),
    updatedBy,
    note || ""
  ]]);

  // Prevent duplicated pointer rows. This can happen if the pointer key was typed
  // manually with a missing separator, while Category/HQ Sheet/Key Column are valid.
  // Keep the first matching row and delete the older duplicates from bottom to top.
  if (matches.length > 1) {
    matches.slice(1).sort((a, b) => b - a).forEach(row => {
      if (row !== targetRow && row <= sh.getLastRow()) sh.deleteRow(row);
    });
  }
}

function getStoredHQWritePointerRow_(category, sheetName, keyColumn) {
  const props = PropertiesService.getScriptProperties();
  const key = getHQWritePointerKey_(category, sheetName, keyColumn);
  const propValue = Number(props.getProperty(key) || 0);

  if (propValue) return propValue;

  // Active memory support:
  // HQ_WRITE_POINTER is the system memory updated after every successful Submit HQ.
  const sheetValue = getHQWritePointerRowFromSheet_(category, sheetName, keyColumn);
  if (sheetValue) {
    props.setProperty(key, String(sheetValue));
    return sheetValue;
  }

  // Production setup support:
  // HQ_POINTER_SETUP is the manual "bocoran last row" sheet. If admin filled it
  // but forgot to run initializeHQPointersFromSetup(), use it automatically once,
  // then cache/update HQ_WRITE_POINTER so Submit HQ does not scan huge HQ history.
  const setupValue = getHQPointerSetupRow_(category, sheetName, keyColumn);
  if (setupValue) {
    setStoredHQWritePointerRow_(category, sheetName, keyColumn, setupValue, "Initialized automatically from HQ_POINTER_SETUP. Next Write Row = " + (setupValue + 1));
    return setupValue;
  }

  return 0;
}

function getHQPointerSetupRow_(category, sheetName, keyColumn) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName("HQ_POINTER_SETUP");
  if (!sh || sh.getLastRow() < 2) return 0;

  const values = sh.getRange(2, 1, sh.getLastRow() - 1, 4).getDisplayValues();
  const targetCategory = String(category || "").trim();
  const targetSheet = String(sheetName || "").trim();
  const targetKeyColumn = Number(keyColumn || 0);
  let bestLast = 0;

  values.forEach(r => {
    const rowCategory = String(r[0] || "").trim();
    const rowSheet = String(r[1] || "").trim();
    const rowKeyText = String(r[2] || "").trim();
    const rowKeyColumn = /^\d+$/.test(rowKeyText) ? Number(rowKeyText) : columnLetterToNumber_(rowKeyText);
    const rowLast = Number(String(r[3] || "").replace(/,/g, ""));

    if (!rowCategory || !rowSheet || !rowKeyColumn || !rowLast) return;
    if (rowCategory === targetCategory && rowSheet === targetSheet && rowKeyColumn === targetKeyColumn) {
      bestLast = Math.max(bestLast, rowLast);
    }
  });

  return bestLast;
}

function getHQWritePointerRowFromSheet_(category, sheetName, keyColumn) {
  const key = getHQWritePointerKey_(category, sheetName, keyColumn);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName("HQ_WRITE_POINTER");

  if (!sh || sh.getLastRow() < 2) return 0;

  const values = sh.getRange(2, 1, sh.getLastRow() - 1, 5).getDisplayValues();
  const targetCategory = String(category || "").trim();
  const targetSheet = String(sheetName || "").trim();
  const targetKeyColumn = Number(keyColumn || 0);
  let bestLast = 0;

  for (let i = 0; i < values.length; i++) {
    const rowKey = String(values[i][0] || "").trim();
    const rowCategory = String(values[i][1] || "").trim();
    const rowSheet = String(values[i][2] || "").trim();
    const rowKeyText = String(values[i][3] || "").trim();
    const rowKeyColumn = /^\d+$/.test(rowKeyText) ? Number(rowKeyText) : columnLetterToNumber_(rowKeyText);
    const rowLast = Number(String(values[i][4] || "").replace(/,/g, ""));

    const sameKey = rowKey === key;
    const sameConfig = rowCategory === targetCategory && rowSheet === targetSheet && rowKeyColumn === targetKeyColumn;

    if ((sameKey || sameConfig) && rowLast) {
      // If duplicate records exist, use the largest Last Row to avoid overwriting HQ rows.
      bestLast = Math.max(bestLast, rowLast);
    }
  }

  return bestLast;
}

function setStoredHQWritePointerRow_(category, sheetName, keyColumn, lastRow, note) {
  const props = PropertiesService.getScriptProperties();
  const key = getHQWritePointerKey_(category, sheetName, keyColumn);
  props.setProperty(key, String(Number(lastRow || 0)));
  updateHQWritePointerRecord_(category, sheetName, keyColumn, Number(lastRow || 0), note || "");
}
function initializeHQWritePointerByNextRow(category, nextWriteRow) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya admin yang boleh initialize HQ pointer.");
  }

  const cfg = getHQWritePointerConfigByCategory_(category);
  nextWriteRow = Number(nextWriteRow || 0);

  if (!nextWriteRow || nextWriteRow < 2) {
    throw new Error("Next Write Row tidak valid.");
  }

  const lastRow = nextWriteRow - 1;
  setStoredHQWritePointerRow_(cfg.category, cfg.sheetName, cfg.keyColumn, lastRow, "Manual init. Next Write Row = " + nextWriteRow);

  return {
    ok: true,
    category: cfg.category,
    sheetName: cfg.sheetName,
    keyColumn: columnNumberToLetter_(cfg.keyColumn),
    lastRow: lastRow,
    nextWriteRow: nextWriteRow,
    message: "HQ pointer initialized. Submit berikutnya akan write mulai row " + nextWriteRow + "."
  };
}

function reloadHQWritePointersFromSheet() {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya admin yang boleh reload HQ pointer.");
  }

  const sh = ensureHQWritePointerSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return "HQ_WRITE_POINTER masih kosong.";

  const values = sh.getRange(2, 1, lastRow - 1, 8).getDisplayValues();
  const props = PropertiesService.getScriptProperties();
  const email = Session.getActiveUser().getEmail();
  const admin = getUserAccess_(email);
  const updatedBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);
  const map = {};

  values.forEach(r => {
    const category = String(r[1] || "").trim();
    const sheetName = String(r[2] || "").trim();
    const keyColText = String(r[3] || "").trim();
    const last = Number(String(r[4] || "").replace(/,/g, ""));
    const note = String(r[7] || "").trim();

    if (!category || !sheetName || !keyColText || !last) return;

    const keyColumn = /^\d+$/.test(keyColText) ? Number(keyColText) : columnLetterToNumber_(keyColText);
    if (!keyColumn) return;

    const expectedKey = getHQWritePointerKey_(category, sheetName, keyColumn);

    if (!map[expectedKey] || last > map[expectedKey].lastRow) {
      map[expectedKey] = {
        key: expectedKey,
        category: category,
        sheetName: sheetName,
        keyColumn: keyColumn,
        lastRow: last,
        note: note || "Pointer reloaded / duplicate cleaned"
      };
    }
  });

  const records = Object.keys(map).sort().map(k => map[k]);

  // Rewrite as one clean pointer row per Category + HQ Sheet + Key Column.
  if (lastRow >= 2) sh.getRange(2, 1, lastRow - 1, 8).clearContent();

  if (records.length) {
    const output = records.map(x => [
      x.key,
      x.category,
      x.sheetName,
      columnNumberToLetter_(x.keyColumn),
      x.lastRow,
      new Date(),
      updatedBy,
      x.note
    ]);

    sh.getRange(2, 1, output.length, 8).setValues(output);
  }

  const details = [];
  records.forEach(x => {
    props.setProperty(x.key, String(x.lastRow));
    details.push(x.category + " → last row " + x.lastRow + " / next row " + (x.lastRow + 1));
  });

  return "Reload HQ pointer selesai: " + records.length + " kategori. Duplicate sudah dibersihkan.\n" + details.join("\n");
}

function ensureHQPointerSetupSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("HQ_POINTER_SETUP");

  if (!sh) sh = ss.insertSheet("HQ_POINTER_SETUP");

  const headers = [
    "Category",
    "HQ Sheet",
    "Key Column",
    "Last Existing Row",
    "Note"
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
  } else {
    const lastCol = Math.max(sh.getLastColumn(), headers.length);
    const current = sh.getRange(1, 1, 1, lastCol).getValues()[0];

    headers.forEach((h, i) => {
      if (String(current[i] || "").trim() !== h) {
        sh.getRange(1, i + 1).setValue(h);
      }
    });
  }

  return sh;
}

function initializeHQPointersFromSetup() {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya admin yang boleh initialize HQ pointer.");
  }

  const sh = ensureHQPointerSetupSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return "HQ_POINTER_SETUP masih kosong.";

  const values = sh.getRange(2, 1, lastRow - 1, 5).getDisplayValues();
  const details = [];
  let skipped = 0;
  let updated = 0;

  values.forEach((r, i) => {
    const sheetRow = i + 2;
    const category = String(r[0] || "").trim();
    const sheetName = String(r[1] || "").trim();
    const keyColText = String(r[2] || "").trim();
    const lastExistingRow = Number(String(r[3] || "").replace(/,/g, ""));
    const note = String(r[4] || "").trim();

    // Blank Last Existing Row means skip, never reset pointer to 0.
    if (!category || !sheetName || !keyColText || !lastExistingRow) {
      skipped++;
      return;
    }

    const cfg = getHQWritePointerConfigByCategory_(category);
    const keyColumn = /^\d+$/.test(keyColText) ? Number(keyColText) : columnLetterToNumber_(keyColText);
    if (!keyColumn) throw new Error("HQ_POINTER_SETUP row " + sheetRow + " Key Column tidak valid.");
    if (cfg.sheetName !== sheetName) throw new Error("HQ_POINTER_SETUP row " + sheetRow + " HQ Sheet tidak sesuai config: " + sheetName + " / expected " + cfg.sheetName);
    if (cfg.keyColumn !== keyColumn) throw new Error("HQ_POINTER_SETUP row " + sheetRow + " Key Column tidak sesuai config: " + keyColText + " / expected " + columnNumberToLetter_(cfg.keyColumn));

    setStoredHQWritePointerRow_(
      cfg.category,
      cfg.sheetName,
      cfg.keyColumn,
      lastExistingRow,
      note || "Initialized from HQ_POINTER_SETUP. Next Write Row = " + (lastExistingRow + 1)
    );

    updated++;
    details.push(cfg.category + " → last row " + lastExistingRow + " / next row " + (lastExistingRow + 1));
  });

  return "Initialize HQ pointers selesai. Updated: " + updated + " | Skipped blank: " + skipped + (details.length ? "\n" + details.join("\n") : "");
}

function getHQWritePointerConfigByCategory_(category) {
  category = String(category || "").trim();

  if (category === "CU Sport") {
    return { category: "CU Sport", sheetName: SOURCE_CU_SPORT_SHEET, keyColumn: 4, statusColumn: 10 };
  }

  if (category === "Welcome Bonus") {
    return { category: "Welcome Bonus", sheetName: SOURCE_WELCOME_SHEET, keyColumn: 5, statusColumn: 8 };
  }

  if (category === "Promo Syukuran") {
    return { category: "Promo Syukuran", sheetName: SOURCE_PROMO_SYUKURAN_SHEET, keyColumn: 2, statusColumn: 4 };
  }

  if (category === "Transfer Agen") {
    return { category: "Transfer Agen", sheetName: SOURCE_TRANSFER_AGEN_SHEET, keyColumn: 2, statusColumn: 4 };
  }

  if (category === "VVIP DEPO") {
    return { category: "VVIP DEPO", sheetName: SOURCE_VVIP_DEPO_SHEET, keyColumn: 4, statusColumn: 8 };
  }

  if (category === "VVIP Special Prize") {
    return { category: "VVIP Special Prize", sheetName: SOURCE_VVIP_SPECIAL_SHEET, keyColumn: 4, statusColumn: 9 };
  }

  if (category === "Lucky Money 88") {
    return { category: "Lucky Money 88", sheetName: SOURCE_LUCKY_MONEY_SHEET, keyColumn: 2, statusColumn: 4 };
  }

  if (isHelloFriendsCategory_(category)) {
    return { category: "Hello Friends", sheetName: SOURCE_HELLO_FRIENDS_SHEET, keyColumn: 5, statusColumn: 11 };
  }

  throw new Error("Category belum support pointer setup: " + category);
}


function findLastFilledRowInColumnFast_(sh, column, startRow) {
  column = Number(column);
  startRow = Number(startRow || 2);

  const lastRow = Math.max(sh.getLastRow(), startRow);
  const chunkSize = 5000;

  for (let endRow = lastRow; endRow >= startRow; endRow -= chunkSize) {
    const beginRow = Math.max(startRow, endRow - chunkSize + 1);
    const values = sh.getRange(beginRow, column, endRow - beginRow + 1, 1).getDisplayValues();

    for (let i = values.length - 1; i >= 0; i--) {
      if (String(values[i][0] || "").trim() !== "") {
        return beginRow + i;
      }
    }
  }

  return startRow - 1;
}

function ensureRowsAvailable_(sh, lastNeededRow) {
  lastNeededRow = Number(lastNeededRow || 0);
  const maxRows = sh.getMaxRows();
  if (lastNeededRow > maxRows) sh.insertRowsAfter(maxRows, lastNeededRow - maxRows);
}

function allocateHQAppendBlockFromPointer_(sh, opt) {
  opt = opt || {};

  const category = String(opt.category || "").trim();
  const sheetName = String(opt.sheetName || sh.getName()).trim();
  const keyColumn = Number(opt.keyColumn || 1);
  const startRow = Number(opt.startRow || 2);
  const count = Number(opt.count || 1);

  if (!category) throw new Error("Category pointer kosong.");
  if (!keyColumn || keyColumn < 1) throw new Error("Key column pointer tidak valid.");
  if (!count || count < 1) throw new Error("Jumlah data Submit HQ tidak valid.");

  let storedLastRow = getStoredHQWritePointerRow_(category, sheetName, keyColumn);
  const requirePointer = opt.requirePointer === true;

  if (requirePointer && (!storedLastRow || storedLastRow < startRow - 1)) {
    throw new Error(
      "HQ pointer belum diset untuk " + category + ". Isi HQ_POINTER_SETUP: " +
      category + " | " + sheetName + " | " + columnNumberToLetter_(keyColumn) +
      " | Last Existing Row, lalu submit ulang."
    );
  }

  let startTargetRow = Math.max(startRow, (storedLastRow || 0) + 1);
  let refreshed = false;

  ensureRowsAvailable_(sh, startTargetRow + count - 1);

  function blockHasConflict_(row) {
    const values = sh.getRange(row, keyColumn, count, 1).getDisplayValues();
    return values.some(r => String(r[0] || "").trim() !== "");
  }

  // First run / no memory: scan once from bottom, then cache pointer.
  if (!storedLastRow || storedLastRow < startRow - 1) {
    storedLastRow = findLastFilledRowInColumnFast_(sh, keyColumn, startRow);
    startTargetRow = Math.max(startRow, storedLastRow + 1);
    refreshed = true;
    ensureRowsAvailable_(sh, startTargetRow + count - 1);
  }

  // Safety: if HQ team manually added rows after our pointer, refresh once.
  if (blockHasConflict_(startTargetRow)) {
    storedLastRow = findLastFilledRowInColumnFast_(sh, keyColumn, startRow);
    startTargetRow = Math.max(startRow, storedLastRow + 1);
    refreshed = true;
    ensureRowsAvailable_(sh, startTargetRow + count - 1);
  }

  if (blockHasConflict_(startTargetRow)) {
    throw new Error("Target row HQ masih berisi data di kolom " + columnNumberToLetter_(keyColumn) + ". Silakan refresh pointer / cek HQ sheet.");
  }

  return {
    startRow: startTargetRow,
    endRow: startTargetRow + count - 1,
    previousLastRow: storedLastRow,
    refreshed: refreshed
  };
}

function assertClaimLockedForHQSubmit_(status, row) {
  if (String(status || "").trim() !== "On Process") {
    throw new Error("Row " + row + " harus di-Lock / On Process dulu sebelum Submit HQ.");
  }
}

function buildWelcomeHQSubmitItem_(claim, claimDisplay, row) {
  const category = String(claimDisplay[4] || "").trim();
  const status = String(claimDisplay[11] || "").trim();
  const statusHQ = String(claimDisplay[15] || "").trim();
  const hqSubmitStatus = String(claimDisplay[17] || "").trim();
  const hqSubmitCount = Number(claim[21] || 0);

  if (category !== "Welcome Bonus") {
    throw new Error("Row " + row + " bukan Welcome Bonus.");
  }

  if (status === "Rejected") {
    throw new Error("Row " + row + " sudah Rejected.");
  }

  assertClaimLockedForHQSubmit_(status, row);

  if (isHQOkStatus_(statusHQ)) {
    throw new Error("Row " + row + " StatusHQ sudah OK.");
  }

  if (hqSubmitStatus && !statusHQ) {
    throw new Error("Row " + row + " sudah dikirim ke HQ dan masih menunggu StatusHQ.");
  }

  const applyDate = formatWelcomeHQSubmitDate_(claim[0]);
  let submitOrderDate = claim[0] instanceof Date ? claim[0] : new Date(claim[0]);
  if (!(submitOrderDate instanceof Date) || isNaN(submitOrderDate)) submitOrderDate = new Date(0);
  const submitOrderMs = submitOrderDate.getTime();
  const akunMember = String(claimDisplay[3] || "").trim().toUpperCase();
  const kodeAgen = String(claimDisplay[9] || "").trim().toUpperCase();
  const agenStatus = getWelcomeAgenStatus_(kodeAgen);
  const tipeBonus = String(claimDisplay[5] || "").trim();
  const tipeBonusHQ = WELCOME_BONUS_SOURCE_MAP[tipeBonus] || tipeBonus;

  if (!akunMember) throw new Error("Row " + row + " Akun Member kosong.");
  if (!kodeAgen) throw new Error("Row " + row + " Kode Agen kosong.");
  if (!agenStatus) throw new Error("Row " + row + " Kode Agen " + kodeAgen + " belum ada mapping Welcome.");
  if (!tipeBonus) throw new Error("Row " + row + " Tipe Bonus kosong.");
  if (!WELCOME_BONUS_SOURCE_MAP[tipeBonus] && !WELCOME_NOMINAL_MAP[tipeBonus]) {
    throw new Error("Row " + row + " Tipe Bonus Welcome belum sesuai mapping HQ: " + tipeBonus);
  }

  const isResubmit = !!(hqSubmitStatus && statusHQ && !isHQOkStatus_(statusHQ));

  return {
    row: row,
    submitOrderMs: submitOrderMs,
    applyDate: applyDate,
    akunMember: akunMember,
    kodeAgen: kodeAgen,
    agenStatus: agenStatus,
    tipeBonusHQ: tipeBonusHQ,
    isResubmit: isResubmit,
    hqSubmitCount: hqSubmitCount
  };
}

function buildPromoSyukuranHQSubmitItem_(claim, claimDisplay, row) {
  const category = String(claimDisplay[4] || "").trim();
  const status = String(claimDisplay[11] || "").trim();
  const statusHQ = String(claimDisplay[15] || "").trim();
  const hqSubmitStatus = String(claimDisplay[17] || "").trim();
  const hqSubmitCount = Number(claim[21] || 0);

  if (category !== "Promo Syukuran") {
    throw new Error("Row " + row + " bukan Promo Syukuran.");
  }

  if (status === "Rejected") {
    throw new Error("Row " + row + " sudah Rejected.");
  }

  assertClaimLockedForHQSubmit_(status, row);

  if (isHQOkStatus_(statusHQ)) {
    throw new Error("Row " + row + " StatusHQ sudah OK.");
  }

  if (hqSubmitStatus && !statusHQ) {
    throw new Error("Row " + row + " sudah dikirim ke HQ dan masih menunggu StatusHQ.");
  }

  const applyDate = formatPromoSyukuranHQSubmitDate_(claim[0]);
  let submitOrderDate = claim[0] instanceof Date ? claim[0] : new Date(claim[0]);
  if (!(submitOrderDate instanceof Date) || isNaN(submitOrderDate)) submitOrderDate = new Date(0);
  const submitOrderMs = submitOrderDate.getTime();
  const akunMember = String(claimDisplay[3] || "").trim().toUpperCase();
  const tipeBonus = String(claimDisplay[5] || "").trim();

  if (!akunMember) throw new Error("Row " + row + " Akun Member kosong.");
  if (!tipeBonus) throw new Error("Row " + row + " Tipe Bonus kosong.");
  if (!Object.prototype.hasOwnProperty.call(PROMO_SYUKURAN_NOMINAL_MAP, tipeBonus)) {
    throw new Error("Row " + row + " Tipe Bonus Promo Syukuran belum sesuai validasi HQ: " + tipeBonus);
  }

  const isResubmit = !!(hqSubmitStatus && statusHQ && !isHQOkStatus_(statusHQ));

  return {
    row: row,
    submitOrderMs: submitOrderMs,
    applyDate: applyDate,
    akunMember: akunMember,
    tipeBonus: tipeBonus,
    isResubmit: isResubmit,
    hqSubmitCount: hqSubmitCount
  };
}

function buildVvipDepoHQSubmitItem_(claim, claimDisplay, row) {
  const category = String(claimDisplay[4] || "").trim();
  const status = String(claimDisplay[11] || "").trim();
  const statusHQ = String(claimDisplay[15] || "").trim();
  const hqSubmitStatus = String(claimDisplay[17] || "").trim();
  const hqSubmitCount = Number(claim[21] || 0);

  if (category !== "VVIP DEPO") {
    throw new Error("Row " + row + " bukan VVIP DEPO.");
  }

  if (status === "Rejected") {
    throw new Error("Row " + row + " sudah Rejected.");
  }

  assertClaimLockedForHQSubmit_(status, row);

  if (isHQOkStatus_(statusHQ)) {
    throw new Error("Row " + row + " StatusHQ sudah OK.");
  }

  if (hqSubmitStatus && !statusHQ) {
    throw new Error("Row " + row + " sudah dikirim ke HQ dan masih menunggu StatusHQ.");
  }

  const applyDate = formatVvipDepoHQSubmitDate_(claim[0]);
  let submitOrderDate = claim[0] instanceof Date ? claim[0] : new Date(claim[0]);
  if (!(submitOrderDate instanceof Date) || isNaN(submitOrderDate)) submitOrderDate = new Date(0);
  const submitOrderMs = submitOrderDate.getTime();
  const akunMember = String(claimDisplay[3] || "").trim().toUpperCase();
  const tipeBonusRaw = String(claimDisplay[5] || "").trim();
  const tipeBonusHQ = VVIP_DEPO_HQ_TIPE_MAP[tipeBonusRaw] || tipeBonusRaw;
  const tanggalIn = formatVvipDepoTanggalInForHQ_(claimDisplay[10] || claim[10]);
  const nominalBonus = VVIP_DEPO_NOMINAL_MAP[tipeBonusRaw] || VVIP_DEPO_NOMINAL_MAP[tipeBonusHQ] || String(claimDisplay[6] || "").trim();

  if (!akunMember) throw new Error("Row " + row + " Akun Member kosong.");
  if (!tipeBonusRaw) throw new Error("Row " + row + " Tipe Bonus kosong.");
  if (!Object.prototype.hasOwnProperty.call(VVIP_DEPO_HQ_TIPE_MAP, tipeBonusRaw)) {
    throw new Error("Row " + row + " Tipe Bonus VVIP DEPO belum sesuai validasi HQ: " + tipeBonusRaw);
  }
  if (!tanggalIn) throw new Error("Row " + row + " Tanggal IN / User Remarks kosong.");
  if (nominalBonus === "") throw new Error("Row " + row + " Nominal Bonus kosong.");

  const isResubmit = !!(hqSubmitStatus && statusHQ && !isHQOkStatus_(statusHQ));

  return {
    row: row,
    submitOrderMs: submitOrderMs,
    applyDate: applyDate,
    akunMember: akunMember,
    tipeBonusHQ: tipeBonusHQ,
    tanggalIn: tanggalIn,
    nominalBonus: nominalBonus,
    isResubmit: isResubmit,
    hqSubmitCount: hqSubmitCount
  };
}

function submitVvipDepoBatchToHQ(rows) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya Owner/Admin yang bisa Submit HQ.");
  }

  if (!Array.isArray(rows)) rows = [rows];

  rows = rows
    .map(r => Number(r))
    .filter(r => r && r >= 2)
    .filter((r, i, arr) => arr.indexOf(r) === i);

  if (!rows.length) throw new Error("Pilih minimal 1 claim VVIP DEPO untuk Submit HQ.");

  const lock = acquireHQWriteLock_(15000, "Submit HQ VVIP DEPO sedang berjalan. Coba lagi beberapa detik, atau gunakan Submit Selected HQ untuk batch.");

  try {
    const shClaim = ensureBonusClaimHQSubmitColumns_();
    if (!shClaim) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

    const valid = [];
    const skipped = [];

    rows.forEach(row => {
      try {
        if (row > shClaim.getLastRow()) throw new Error("Row " + row + " tidak ditemukan.");

        const claim = shClaim.getRange(row, 1, 1, 22).getValues()[0];
        const claimDisplay = shClaim.getRange(row, 1, 1, 22).getDisplayValues()[0];
        valid.push(buildVvipDepoHQSubmitItem_(claim, claimDisplay, row));
      } catch (err) {
        skipped.push({ row: row, ok: false, message: err && err.message ? err.message : String(err) });
      }
    });

    if (!valid.length) {
      const msg = skipped.length ? skipped.map(x => x.message).join("\n") : "Tidak ada data valid untuk Submit HQ.";
      throw new Error(msg);
    }

    // HQ rows must follow claim queue order: older timestamp first, then claim row.
    valid.sort((a, b) => {
      const am = Number(a.submitOrderMs || 0);
      const bm = Number(b.submitOrderMs || 0);
      if (am !== bm) return am - bm;
      return Number(a.row || 0) - Number(b.row || 0);
    });

    const ssSource = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    const shHQ = ssSource.getSheetByName(SOURCE_VVIP_DEPO_SHEET);
    if (!shHQ) throw new Error("Sheet HQ " + SOURCE_VVIP_DEPO_SHEET + " tidak ditemukan.");

    const block = allocateHQAppendBlockFromPointer_(shHQ, {
      category: "VVIP DEPO",
      sheetName: SOURCE_VVIP_DEPO_SHEET,
      keyColumn: 4,
      startRow: 2,
      count: valid.length
    });

    const dateValues = valid.map(item => [item.applyDate]);
    const mainValues = valid.map(item => [item.akunMember, item.tipeBonusHQ, item.tanggalIn, item.nominalBonus]);

    // Batch write VVIP-當日存款:
    // A = tanggal apply MM/dd; D = Akun MB; E = Tipe Bonus exact validation HQ; F = Tanggal IN/User Remarks; G = Nominal Bonus.
    shHQ.getRange(block.startRow, 1, valid.length, 1).setValues(dateValues);
    shHQ.getRange(block.startRow, 4, valid.length, 4).setValues(mainValues);

    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const submitBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);
    const now = new Date();
    const results = [];

    valid.forEach((item, i) => {
      const hqRow = block.startRow + i;
      const submitStatus = item.isResubmit ? "Resubmitted" : "Submitted";
      const nextCount = item.hqSubmitCount + 1;

      shClaim.getRange(item.row, 18, 1, 5).setValues([[
        submitStatus,
        now,
        submitBy,
        hqRow,
        nextCount
      ]]);

      // Keep THB helper status visible even after helper formula removes submitted rows.
      shClaim.getRange(item.row, 24, 1, 2).setValues([[
        "SYNCED",
        item.tglRemarks
      ]]);

      results.push({
        ok: true,
        claimRow: item.row,
        hqRow: hqRow,
        hqSubmitStatus: submitStatus,
        hqSubmitBy: submitBy,
        hqSubmitCount: nextCount,
        data: {
          tanggal: item.applyDate,
          akunMember: item.akunMember,
          tipeBonus: item.tipeBonusHQ,
          tanggalIn: item.tanggalIn,
          nominalBonus: item.nominalBonus
        }
      });
    });

    setStoredHQWritePointerRow_(
      "VVIP DEPO",
      SOURCE_VVIP_DEPO_SHEET,
      4,
      block.endRow,
      "Batch Submit HQ VVIP DEPO: " + valid.length + " claim" + (block.refreshed ? " | pointer refreshed" : "")
    );

    SpreadsheetApp.flush();

    const rowText = valid.length === 1 ? String(block.startRow) : (block.startRow + "-" + block.endRow);
    const message = "Submit HQ VVIP DEPO berhasil: " + valid.length + " claim ke row " + rowText + (skipped.length ? " | Skip: " + skipped.length : "");

    return {
      ok: true,
      message: message,
      count: valid.length,
      skippedCount: skipped.length,
      rows: rows,
      startRow: block.startRow,
      endRow: block.endRow,
      pointerRefreshed: block.refreshed,
      results: results,
      skipped: skipped
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function submitVvipDepoToHQ(row) {
  const result = submitVvipDepoBatchToHQ([row]);
  const first = result && result.results && result.results[0];

  if (!first) {
    const skipped = result && result.skipped && result.skipped[0];
    throw new Error(skipped && skipped.message ? skipped.message : "Submit HQ VVIP DEPO gagal.");
  }

  return {
    ok: true,
    message: (first.hqSubmitStatus === "Resubmitted" ? "Resubmit HQ VVIP DEPO berhasil" : "Submit HQ VVIP DEPO berhasil") + " ke row " + first.hqRow,
    claimRow: first.claimRow,
    hqRow: first.hqRow,
    hqSubmitStatus: first.hqSubmitStatus,
    hqSubmitBy: first.hqSubmitBy,
    hqSubmitCount: first.hqSubmitCount,
    data: first.data
  };
}


function parseCuSportParlayForHQ_(remarks) {
  const text = String(remarks || "").trim();
  if (!text) return "";

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = String(lines[i] || "").trim();
    const m = line.match(/^Parlay\s*:\s*(.+)$/i);
    if (m) {
      const raw = String(m[1] || "").trim();
      return CU_SPORT_PARLAY_HQ_MAP[raw] || raw;
    }
  }

  const valid = ["3串全過", "4串全過", "5串全過", "6串全過", "7串全過", "8串全過", "9串全過", "10串全過"];
  for (let i = 0; i < valid.length; i++) {
    if (text.indexOf(valid[i]) >= 0) return valid[i];
  }

  return "";
}

function buildCuSportHQSubmitItem_(claim, claimDisplay, row) {
  const category = String(claimDisplay[4] || "").trim();
  const status = String(claimDisplay[11] || "").trim();
  const statusHQ = String(claimDisplay[15] || "").trim();
  const hqSubmitStatus = String(claimDisplay[17] || "").trim();
  const hqSubmitCount = Number(claim[21] || 0);

  if (category !== "CU Sport") {
    throw new Error("Row " + row + " bukan CU Sport.");
  }

  if (status === "Rejected") {
    throw new Error("Row " + row + " sudah Rejected.");
  }

  assertClaimLockedForHQSubmit_(status, row);

  if (isHQOkStatus_(statusHQ)) {
    throw new Error("Row " + row + " StatusHQ sudah OK.");
  }

  if (hqSubmitStatus && !statusHQ) {
    throw new Error("Row " + row + " sudah dikirim ke HQ dan masih menunggu StatusHQ.");
  }

  const applyDate = formatHQSubmitDate_(claim[0]);
  let submitOrderDate = claim[0] instanceof Date ? claim[0] : new Date(claim[0]);
  if (!(submitOrderDate instanceof Date) || isNaN(submitOrderDate)) submitOrderDate = new Date(0);
  const submitOrderMs = submitOrderDate.getTime();
  const akunMember = String(claimDisplay[3] || "").trim().toUpperCase();
  const parlay = parseCuSportParlayForHQ_(claimDisplay[10] || claim[10]);
  const nomorSlip = String(claimDisplay[7] || "").trim();
  const nominalBetting = String(claimDisplay[8] || "").trim();
  const tipeBonusRaw = String(claimDisplay[5] || "").trim();
  const tipeBonusHQ = CU_SPORT_HQ_TIPE_MAP[tipeBonusRaw] || tipeBonusRaw;

  if (!akunMember) throw new Error("Row " + row + " Akun Member kosong.");
  if (!parlay) throw new Error("Row " + row + " Parlay kosong di User Remarks.");
  if (!nomorSlip) throw new Error("Row " + row + " Nomor Slip Taruhan kosong.");
  if (!nominalBetting) throw new Error("Row " + row + " Nominal Betting kosong.");
  if (!tipeBonusRaw) throw new Error("Row " + row + " Tipe Bonus kosong.");
  if (!Object.prototype.hasOwnProperty.call(CU_SPORT_HQ_TIPE_MAP, tipeBonusRaw)) {
    throw new Error("Row " + row + " Tipe Bonus CU Sport belum sesuai validasi HQ: " + tipeBonusRaw);
  }

  const isResubmit = !!(hqSubmitStatus && statusHQ && !isHQOkStatus_(statusHQ));

  return {
    row: row,
    submitOrderMs: submitOrderMs,
    applyDate: applyDate,
    akunMember: akunMember,
    parlay: parlay,
    nomorSlip: nomorSlip,
    nominalBetting: nominalBetting,
    tipeBonusHQ: tipeBonusHQ,
    isResubmit: isResubmit,
    hqSubmitCount: hqSubmitCount
  };
}

function submitCuSportBatchToHQ(rows) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya Owner/Admin yang bisa Submit HQ.");
  }

  if (!Array.isArray(rows)) rows = [rows];

  rows = rows
    .map(r => Number(r))
    .filter(r => r && r >= 2)
    .filter((r, i, arr) => arr.indexOf(r) === i);

  if (!rows.length) throw new Error("Pilih minimal 1 claim CU Sport untuk Submit HQ.");

  const lock = acquireHQWriteLock_(15000, "Submit HQ CU Sport sedang berjalan. Coba lagi beberapa detik, atau gunakan Submit Selected HQ untuk batch.");

  try {
    const shClaim = ensureBonusClaimHQSubmitColumns_();
    if (!shClaim) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

    const valid = [];
    const skipped = [];

    rows.forEach(row => {
      try {
        if (row > shClaim.getLastRow()) throw new Error("Row " + row + " tidak ditemukan.");

        const claim = shClaim.getRange(row, 1, 1, 22).getValues()[0];
        const claimDisplay = shClaim.getRange(row, 1, 1, 22).getDisplayValues()[0];
        valid.push(buildCuSportHQSubmitItem_(claim, claimDisplay, row));
      } catch (err) {
        skipped.push({ row: row, ok: false, message: err && err.message ? err.message : String(err) });
      }
    });

    if (!valid.length) {
      const msg = skipped.length ? skipped.map(x => x.message).join("\n") : "Tidak ada data valid untuk Submit HQ.";
      throw new Error(msg);
    }

    // HQ rows must follow claim queue order: older timestamp first, then claim row.
    valid.sort((a, b) => {
      const am = Number(a.submitOrderMs || 0);
      const bm = Number(b.submitOrderMs || 0);
      if (am !== bm) return am - bm;
      return Number(a.row || 0) - Number(b.row || 0);
    });

    const ssSource = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    const shHQ = ssSource.getSheetByName(SOURCE_CU_SPORT_SHEET);
    if (!shHQ) throw new Error("Sheet HQ " + SOURCE_CU_SPORT_SHEET + " tidak ditemukan.");

    const block = allocateHQAppendBlockFromPointer_(shHQ, {
      category: "CU Sport",
      sheetName: SOURCE_CU_SPORT_SHEET,
      keyColumn: 4,
      startRow: 2,
      count: valid.length
    });

    const dateValues = valid.map(item => [item.applyDate]);
    const mainValues = valid.map(item => [item.akunMember, item.parlay, item.nominalBetting, item.tipeBonusHQ, item.nomorSlip]);

    // Batch write 酷體育瘋串串:
    // A = tanggal apply yyyy/M/d; D = Akun MB; E = Parlay; F = Nominal Betting; G = Tipe Bonus; H = Nomor Slip Taruhan.
    shHQ.getRange(block.startRow, 1, valid.length, 1).setValues(dateValues);
    shHQ.getRange(block.startRow, 4, valid.length, 5).setValues(mainValues);

    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const submitBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);
    const now = new Date();
    const results = [];

    valid.forEach((item, i) => {
      const hqRow = block.startRow + i;
      const submitStatus = item.isResubmit ? "Resubmitted" : "Submitted";
      const nextCount = item.hqSubmitCount + 1;

      shClaim.getRange(item.row, 18, 1, 5).setValues([[
        submitStatus,
        now,
        submitBy,
        hqRow,
        nextCount
      ]]);

      results.push({
        ok: true,
        claimRow: item.row,
        hqRow: hqRow,
        hqSubmitStatus: submitStatus,
        hqSubmitBy: submitBy,
        hqSubmitCount: nextCount,
        data: {
          tanggal: item.applyDate,
          akunMember: item.akunMember,
          parlay: item.parlay,
          nominalBetting: item.nominalBetting,
          tipeBonus: item.tipeBonusHQ,
          nomorSlip: item.nomorSlip
        }
      });
    });

    setStoredHQWritePointerRow_(
      "CU Sport",
      SOURCE_CU_SPORT_SHEET,
      4,
      block.endRow,
      "Batch Submit HQ CU Sport: " + valid.length + " claim" + (block.refreshed ? " | pointer refreshed" : "")
    );

    SpreadsheetApp.flush();

    const rowText = valid.length === 1 ? String(block.startRow) : (block.startRow + "-" + block.endRow);
    const message = "Submit HQ CU Sport berhasil: " + valid.length + " claim ke row " + rowText + (skipped.length ? " | Skip: " + skipped.length : "");

    return {
      ok: true,
      message: message,
      count: valid.length,
      skippedCount: skipped.length,
      rows: rows,
      startRow: block.startRow,
      endRow: block.endRow,
      pointerRefreshed: block.refreshed,
      results: results,
      skipped: skipped
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function submitCuSportToHQ(row) {
  const result = submitCuSportBatchToHQ([row]);
  const first = result && result.results && result.results[0];

  if (!first) {
    const skipped = result && result.skipped && result.skipped[0];
    throw new Error(skipped && skipped.message ? skipped.message : "Submit HQ CU Sport gagal.");
  }

  return {
    ok: true,
    message: (first.hqSubmitStatus === "Resubmitted" ? "Resubmit HQ CU Sport berhasil" : "Submit HQ CU Sport berhasil") + " ke row " + first.hqRow,
    claimRow: first.claimRow,
    hqRow: first.hqRow,
    hqSubmitStatus: first.hqSubmitStatus,
    hqSubmitBy: first.hqSubmitBy,
    hqSubmitCount: first.hqSubmitCount,
    data: first.data
  };
}

function parseVvipSpecialGameForHQ_(remarks) {
  const text = String(remarks || "").trim();
  if (!text) return "";

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = String(lines[i] || "").trim();
    const m = line.match(/^Tipe\s*Game\s*:\s*(.+)$/i);
    if (m) return String(m[1] || "").trim();
  }

  // Backward-safe fallback if the value was stored without a label.
  const valid = ["CU體育", "CU真人", "CU彩票", "CD電子", "第三方(備註填寫平台)"];
  for (let i = 0; i < valid.length; i++) {
    if (text.indexOf(valid[i]) >= 0) return valid[i];
  }

  return "";
}

function buildVvipSpecialHQSubmitItem_(claim, claimDisplay, row) {
  const category = String(claimDisplay[4] || "").trim();
  const status = String(claimDisplay[11] || "").trim();
  const statusHQ = String(claimDisplay[15] || "").trim();
  const hqSubmitStatus = String(claimDisplay[17] || "").trim();
  const hqSubmitCount = Number(claim[21] || 0);

  if (category !== "VVIP Special Prize") {
    throw new Error("Row " + row + " bukan VVIP Special Prize.");
  }

  if (status === "Rejected") {
    throw new Error("Row " + row + " sudah Rejected.");
  }

  assertClaimLockedForHQSubmit_(status, row);

  if (isHQOkStatus_(statusHQ)) {
    throw new Error("Row " + row + " StatusHQ sudah OK.");
  }

  if (hqSubmitStatus && !statusHQ) {
    throw new Error("Row " + row + " sudah dikirim ke HQ dan masih menunggu StatusHQ.");
  }

  const applyDate = formatVvipDepoHQSubmitDate_(claim[0]);
  let submitOrderDate = claim[0] instanceof Date ? claim[0] : new Date(claim[0]);
  if (!(submitOrderDate instanceof Date) || isNaN(submitOrderDate)) submitOrderDate = new Date(0);
  const submitOrderMs = submitOrderDate.getTime();
  const akunMember = String(claimDisplay[3] || "").trim().toUpperCase();
  const tipeBonusRaw = String(claimDisplay[5] || "").trim();
  const tipeBonusHQ = VVIP_SPECIAL_HQ_TIPE_MAP[tipeBonusRaw] || tipeBonusRaw;
  const tipeGame = parseVvipSpecialGameForHQ_(claimDisplay[10] || claim[10]);
  const slip = String(claimDisplay[7] || "").trim().toUpperCase();

  if (!akunMember) throw new Error("Row " + row + " Akun Member kosong.");
  if (!tipeBonusRaw) throw new Error("Row " + row + " Tipe Bonus kosong.");
  if (!Object.prototype.hasOwnProperty.call(VVIP_SPECIAL_HQ_TIPE_MAP, tipeBonusRaw)) {
    throw new Error("Row " + row + " Tipe Bonus VVIP Special belum sesuai validasi HQ: " + tipeBonusRaw);
  }
  if (!tipeGame) throw new Error("Row " + row + " Tipe Game kosong. User harus pilih Tipe Game untuk VVIP Special Prize.");
  if (!slip) throw new Error("Row " + row + " Slip Taruhan wajib diisi admin sebelum Submit HQ.");

  const isResubmit = !!(hqSubmitStatus && statusHQ && !isHQOkStatus_(statusHQ));

  return {
    row: row,
    submitOrderMs: submitOrderMs,
    applyDate: applyDate,
    akunMember: akunMember,
    tipeBonusHQ: tipeBonusHQ,
    tipeGame: tipeGame,
    slip: slip,
    isResubmit: isResubmit,
    hqSubmitCount: hqSubmitCount
  };
}

function submitVvipSpecialBatchToHQ(rows) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya Owner/Admin yang bisa Submit HQ.");
  }

  if (!Array.isArray(rows)) rows = [rows];

  rows = rows
    .map(r => Number(r))
    .filter(r => r && r >= 2)
    .filter((r, i, arr) => arr.indexOf(r) === i);

  if (!rows.length) throw new Error("Pilih minimal 1 claim VVIP Special Prize untuk Submit HQ.");

  const lock = acquireHQWriteLock_(15000, "Submit HQ VVIP Special sedang berjalan. Coba lagi beberapa detik, atau gunakan Submit Selected HQ untuk batch.");

  try {
    const shClaim = ensureBonusClaimHQSubmitColumns_();
    if (!shClaim) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

    const valid = [];
    const skipped = [];

    rows.forEach(row => {
      try {
        if (row > shClaim.getLastRow()) throw new Error("Row " + row + " tidak ditemukan.");

        const claim = shClaim.getRange(row, 1, 1, 22).getValues()[0];
        const claimDisplay = shClaim.getRange(row, 1, 1, 22).getDisplayValues()[0];
        valid.push(buildVvipSpecialHQSubmitItem_(claim, claimDisplay, row));
      } catch (err) {
        skipped.push({ row: row, ok: false, message: err && err.message ? err.message : String(err) });
      }
    });

    if (!valid.length) {
      const msg = skipped.length ? skipped.map(x => x.message).join("\n") : "Tidak ada data valid untuk Submit HQ.";
      throw new Error(msg);
    }

    // HQ rows must follow claim queue order: older timestamp first, then claim row.
    valid.sort((a, b) => {
      const am = Number(a.submitOrderMs || 0);
      const bm = Number(b.submitOrderMs || 0);
      if (am !== bm) return am - bm;
      return Number(a.row || 0) - Number(b.row || 0);
    });

    const ssSource = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    const shHQ = ssSource.getSheetByName(SOURCE_VVIP_SPECIAL_SHEET);
    if (!shHQ) throw new Error("Sheet HQ " + SOURCE_VVIP_SPECIAL_SHEET + " tidak ditemukan.");

    const block = allocateHQAppendBlockFromPointer_(shHQ, {
      category: "VVIP Special Prize",
      sheetName: SOURCE_VVIP_SPECIAL_SHEET,
      keyColumn: 4,
      startRow: 2,
      count: valid.length
    });

    const dateValues = valid.map(item => [item.applyDate]);
    const mainValues = valid.map(item => [item.akunMember, item.tipeBonusHQ, item.tipeGame, item.slip]);

    // Batch write VVIP-特別獎:
    // A = tanggal apply MM/dd; D = Akun MB; E = Tipe Bonus; F = Tipe Game; G = Nomor Slip Taruhan.
    shHQ.getRange(block.startRow, 1, valid.length, 1).setValues(dateValues);
    shHQ.getRange(block.startRow, 4, valid.length, 4).setValues(mainValues);

    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const submitBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);
    const now = new Date();
    const results = [];

    valid.forEach((item, i) => {
      const hqRow = block.startRow + i;
      const submitStatus = item.isResubmit ? "Resubmitted" : "Submitted";
      const nextCount = item.hqSubmitCount + 1;

      shClaim.getRange(item.row, 18, 1, 5).setValues([[
        submitStatus,
        now,
        submitBy,
        hqRow,
        nextCount
      ]]);

      results.push({
        ok: true,
        claimRow: item.row,
        hqRow: hqRow,
        hqSubmitStatus: submitStatus,
        hqSubmitBy: submitBy,
        hqSubmitCount: nextCount,
        data: {
          tanggal: item.applyDate,
          akunMember: item.akunMember,
          tipeBonus: item.tipeBonusHQ,
          tipeGame: item.tipeGame,
          slip: item.slip
        }
      });
    });

    setStoredHQWritePointerRow_(
      "VVIP Special Prize",
      SOURCE_VVIP_SPECIAL_SHEET,
      4,
      block.endRow,
      "Batch Submit HQ VVIP Special Prize: " + valid.length + " claim" + (block.refreshed ? " | pointer refreshed" : "")
    );

    SpreadsheetApp.flush();

    const rowText = valid.length === 1 ? String(block.startRow) : (block.startRow + "-" + block.endRow);
    const message = "Submit HQ VVIP Special berhasil: " + valid.length + " claim ke row " + rowText + (skipped.length ? " | Skip: " + skipped.length : "");

    return {
      ok: true,
      message: message,
      count: valid.length,
      skippedCount: skipped.length,
      rows: rows,
      startRow: block.startRow,
      endRow: block.endRow,
      pointerRefreshed: block.refreshed,
      results: results,
      skipped: skipped
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function submitVvipSpecialToHQ(row) {
  const result = submitVvipSpecialBatchToHQ([row]);
  const first = result && result.results && result.results[0];

  if (!first) {
    const skipped = result && result.skipped && result.skipped[0];
    throw new Error(skipped && skipped.message ? skipped.message : "Submit HQ VVIP Special gagal.");
  }

  return {
    ok: true,
    message: (first.hqSubmitStatus === "Resubmitted" ? "Resubmit HQ VVIP Special berhasil" : "Submit HQ VVIP Special berhasil") + " ke row " + first.hqRow,
    claimRow: first.claimRow,
    hqRow: first.hqRow,
    hqSubmitStatus: first.hqSubmitStatus,
    hqSubmitBy: first.hqSubmitBy,
    hqSubmitCount: first.hqSubmitCount,
    data: first.data
  };
}


function buildLuckyMoneyHQSubmitItem_(claim, claimDisplay, row) {
  const category = String(claimDisplay[4] || "").trim();
  const status = String(claimDisplay[11] || "").trim();
  const statusHQ = String(claimDisplay[15] || "").trim();
  const hqSubmitStatus = String(claimDisplay[17] || "").trim();
  const hqSubmitCount = Number(claim[21] || 0);

  if (category !== "Lucky Money 88") {
    throw new Error("Row " + row + " bukan Lucky Money 88.");
  }

  if (status === "Rejected") {
    throw new Error("Row " + row + " sudah Rejected.");
  }

  assertClaimLockedForHQSubmit_(status, row);

  if (isHQOkStatus_(statusHQ)) {
    throw new Error("Row " + row + " StatusHQ sudah OK.");
  }

  if (hqSubmitStatus && !statusHQ) {
    throw new Error("Row " + row + " sudah dikirim ke HQ dan masih menunggu StatusHQ.");
  }

  const applyDate = formatPromoSyukuranHQSubmitDate_(claim[0]);
  let submitOrderDate = claim[0] instanceof Date ? claim[0] : new Date(claim[0]);
  if (!(submitOrderDate instanceof Date) || isNaN(submitOrderDate)) submitOrderDate = new Date(0);
  const submitOrderMs = submitOrderDate.getTime();
  const akunMember = String(claimDisplay[3] || "").trim().toUpperCase();
  const tipeBonus = String(claimDisplay[5] || "").trim();

  if (!akunMember) throw new Error("Row " + row + " Akun Member kosong.");
  if (!tipeBonus) throw new Error("Row " + row + " Tipe Bonus kosong.");
  if (!Object.prototype.hasOwnProperty.call(LUCKY_MONEY_NOMINAL_MAP, tipeBonus)) {
    throw new Error("Row " + row + " Tipe Bonus Lucky Money belum sesuai validasi HQ: " + tipeBonus);
  }

  const isResubmit = !!(hqSubmitStatus && statusHQ && !isHQOkStatus_(statusHQ));

  return {
    row: row,
    submitOrderMs: submitOrderMs,
    applyDate: applyDate,
    akunMember: akunMember,
    tipeBonus: tipeBonus,
    isResubmit: isResubmit,
    hqSubmitCount: hqSubmitCount
  };
}



function readThbHelperMapForRows_(rows) {
  const rowSet = {};
  (rows || []).forEach(row => rowSet[String(Number(row))] = true);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_THB_HELPER);
  if (!sh) throw new Error("Sheet THB_HELPER tidak ditemukan.");

  const lastRow = sh.getLastRow();
  const map = {};

  if (lastRow < 2) return map;

  const values = sh.getRange(2, 1, lastRow - 1, 5).getDisplayValues();
  values.forEach((r, i) => {
    const claimRow = Number(String(r[0] || "").trim());
    if (!claimRow) return;
    if (rows && rows.length && !rowSet[String(claimRow)]) return;

    map[String(claimRow)] = {
      claimRow: claimRow,
      helperRow: i + 2,
      akunMember: String(r[1] || "").trim(),
      totalIn: String(r[2] || "").trim(),
      nominalBonus: String(r[3] || "").trim(),
      remarksTgl: String(r[4] || "").trim()
    };
  });

  return map;
}

function formatTiapHariHQSubmitDate_(value) {
  const tz = Session.getScriptTimeZone();

  if (value instanceof Date && !isNaN(value)) {
    return Utilities.formatDate(value, tz, "yyyy/MM/dd");
  }

  const text = String(value || "").trim();
  if (!text) return Utilities.formatDate(new Date(), tz, "yyyy/MM/dd");

  let m = text.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (m) {
    return m[1] + "/" + String(m[2]).padStart(2, "0") + "/" + String(m[3]).padStart(2, "0");
  }

  const d = new Date(text);
  if (d instanceof Date && !isNaN(d)) {
    return Utilities.formatDate(d, tz, "yyyy/MM/dd");
  }

  return text;
}

function buildTiapHariBonusBesarHQSubmitItem_(claim, claimDisplay, row, helperMap) {
  const category = String(claimDisplay[4] || "").trim();
  const status = String(claimDisplay[11] || "").trim();
  const statusHQ = String(claimDisplay[15] || "").trim();
  const hqSubmitStatus = String(claimDisplay[17] || "").trim();
  const hqSubmitCount = Number(claim[21] || 0);
  const verifyStatus = String(claimDisplay[22] || "").trim().toUpperCase();

  if (!isTiapHariHadiahBesarCategory_(category)) {
    throw new Error("Row " + row + " bukan Tiap Hari Bonus Besar.");
  }

  if (status === "Rejected") {
    throw new Error("Row " + row + " sudah Rejected.");
  }

  assertClaimLockedForHQSubmit_(status, row);

  if (verifyStatus !== "VERIFIED") {
    throw new Error("Row " + row + " belum VERIFIED.");
  }

  if (isHQOkStatus_(statusHQ)) {
    throw new Error("Row " + row + " StatusHQ sudah OK.");
  }

  if (hqSubmitStatus && !statusHQ) {
    throw new Error("Row " + row + " sudah dikirim ke HQ dan masih menunggu StatusHQ.");
  }

  const helper = helperMap[String(row)];
  if (!helper) {
    throw new Error("Row " + row + " belum ditemukan di THB_HELPER. Klik Sync THB Helper dan pastikan Claim Row ada.");
  }

  const applyDate = formatTiapHariHQSubmitDate_(claim[0]);
  let submitOrderDate = claim[0] instanceof Date ? claim[0] : new Date(claim[0]);
  if (!(submitOrderDate instanceof Date) || isNaN(submitOrderDate)) submitOrderDate = new Date(0);

  const akunMember = String(claimDisplay[3] || "").trim().toUpperCase();
  const tipeBonus = String(claimDisplay[5] || "").trim();
  const nominalBonus = String(claimDisplay[6] || "").trim();
  const totalIn = String(claimDisplay[8] || "").replace(/\D+/g, "");
  const inHarian = getTiapHariInHarianAmount_(tipeBonus);
  const tglRemarks = String(helper.remarksTgl || "").trim();

  if (!akunMember) throw new Error("Row " + row + " Akun Member kosong.");
  if (!tipeBonus) throw new Error("Row " + row + " Tipe Bonus kosong.");
  if (!nominalBonus) throw new Error("Row " + row + " Nominal Bonus kosong.");
  if (!inHarian) throw new Error("Row " + row + " IN HARIAN tidak valid.");
  if (!totalIn) throw new Error("Row " + row + " TOTAL IN kosong / tidak valid.");

  const isResubmit = !!(hqSubmitStatus && statusHQ && !isHQOkStatus_(statusHQ));

  return {
    row: row,
    submitOrderMs: submitOrderDate.getTime(),
    applyDate: applyDate,
    akunMember: akunMember,
    inHarian: inHarian,
    totalIn: totalIn,
    tglRemarks: tglRemarks,
    tipeBonus: tipeBonus,
    nominalBonus: nominalBonus,
    isResubmit: isResubmit,
    hqSubmitCount: hqSubmitCount
  };
}

function submitTiapHariBonusBesarBatchToHQ(rows) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya Owner/Admin yang bisa Submit HQ.");
  }

  if (!Array.isArray(rows)) rows = [rows];

  rows = rows
    .map(r => Number(r))
    .filter(r => r && r >= 2)
    .filter((r, i, arr) => arr.indexOf(r) === i);

  if (!rows.length) throw new Error("Tidak ada claim Tiap Hari Bonus Besar yang ready untuk Submit HQ.");

  const lock = acquireHQWriteLock_(15000, "Submit HQ Tiap Hari Bonus Besar sedang berjalan. Coba lagi beberapa detik.");

  try {
    const shClaim = ensureBonusClaimHQSubmitColumns_();
    if (!shClaim) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

    const helperMap = readThbHelperMapForRows_(rows);
    const valid = [];
    const skipped = [];

    rows.forEach(row => {
      try {
        if (row > shClaim.getLastRow()) throw new Error("Row " + row + " tidak ditemukan.");

        const claim = shClaim.getRange(row, 1, 1, 25).getValues()[0];
        const claimDisplay = shClaim.getRange(row, 1, 1, 25).getDisplayValues()[0];
        valid.push(buildTiapHariBonusBesarHQSubmitItem_(claim, claimDisplay, row, helperMap));
      } catch (err) {
        skipped.push({ row: row, ok: false, message: err && err.message ? err.message : String(err) });
      }
    });

    if (!valid.length) {
      const msg = skipped.length ? skipped.map(x => x.message).join("\n") : "Tidak ada data valid untuk Submit HQ.";
      throw new Error(msg);
    }

    valid.sort((a, b) => {
      const am = Number(a.submitOrderMs || 0);
      const bm = Number(b.submitOrderMs || 0);
      if (am !== bm) return am - bm;
      return Number(a.row || 0) - Number(b.row || 0);
    });

    const ssSource = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    const shHQ = ssSource.getSheetByName(SOURCE_TIAP_HARI_SHEET);
    if (!shHQ) throw new Error("Sheet HQ " + SOURCE_TIAP_HARI_SHEET + " tidak ditemukan.");

    const block = allocateHQAppendBlockFromPointer_(shHQ, {
      category: "Tiap Hari Bonus Besar",
      sheetName: SOURCE_TIAP_HARI_SHEET,
      keyColumn: 4,
      startRow: 2,
      count: valid.length
    });

    // HQ (新)天天拿大獎:
    // A = tanggal yyyy/MM/dd
    // D = Akun MB
    // E = IN HARIAN
    // F = TOTAL IN
    // G = TGL / Remarks dari THB_HELPER E
    // H = Bonus / Tipe Bonus
    shHQ.getRange(block.startRow, 1, valid.length, 1).setValues(valid.map(item => [item.applyDate]));
    shHQ.getRange(block.startRow, 4, valid.length, 5).setValues(valid.map(item => [
      item.akunMember,
      item.inHarian,
      item.totalIn,
      item.tglRemarks,
      item.tipeBonus
    ]));

    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const submitBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);
    const now = new Date();
    const results = [];

    valid.forEach((item, i) => {
      const hqRow = block.startRow + i;
      const submitStatus = item.isResubmit ? "Resubmitted" : "Submitted";
      const nextCount = item.hqSubmitCount + 1;

      shClaim.getRange(item.row, 18, 1, 5).setValues([[
        submitStatus,
        now,
        submitBy,
        hqRow,
        nextCount
      ]]);

      results.push({
        ok: true,
        claimRow: item.row,
        hqRow: hqRow,
        hqSubmitStatus: submitStatus,
        hqSubmitBy: submitBy,
        hqSubmitCount: nextCount,
        data: {
          tanggal: item.applyDate,
          akunMember: item.akunMember,
          inHarian: item.inHarian,
          totalIn: item.totalIn,
          tglRemarks: item.tglRemarks,
          tipeBonus: item.tipeBonus
        }
      });
    });

    setStoredHQWritePointerRow_(
      "Tiap Hari Bonus Besar",
      SOURCE_TIAP_HARI_SHEET,
      4,
      block.endRow,
      "Batch Submit HQ Tiap Hari Bonus Besar: " + valid.length + " claim" + (block.refreshed ? " | pointer refreshed" : "")
    );

    SpreadsheetApp.flush();

    const rowText = valid.length === 1 ? String(block.startRow) : (block.startRow + "-" + block.endRow);
    const message = "Submit HQ Tiap Hari Bonus Besar berhasil: " + valid.length + " claim ke row " + rowText + (skipped.length ? " | Skip: " + skipped.length : "");

    return {
      ok: true,
      message: message,
      count: valid.length,
      skippedCount: skipped.length,
      rows: rows,
      startRow: block.startRow,
      endRow: block.endRow,
      pointerRefreshed: block.refreshed,
      results: results,
      skipped: skipped
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function submitLuckyMoneyBatchToHQ(rows) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya Owner/Admin yang bisa Submit HQ.");
  }

  if (!Array.isArray(rows)) rows = [rows];

  rows = rows
    .map(r => Number(r))
    .filter(r => r && r >= 2)
    .filter((r, i, arr) => arr.indexOf(r) === i);

  if (!rows.length) throw new Error("Pilih minimal 1 claim Lucky Money 88 untuk Submit HQ.");

  const lock = acquireHQWriteLock_(15000, "Submit HQ Lucky Money 88 sedang berjalan. Coba lagi beberapa detik, atau gunakan Submit Selected HQ untuk batch.");

  try {
    const shClaim = ensureBonusClaimHQSubmitColumns_();
    if (!shClaim) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

    const valid = [];
    const skipped = [];

    rows.forEach(row => {
      try {
        if (row > shClaim.getLastRow()) throw new Error("Row " + row + " tidak ditemukan.");

        const claim = shClaim.getRange(row, 1, 1, 22).getValues()[0];
        const claimDisplay = shClaim.getRange(row, 1, 1, 22).getDisplayValues()[0];
        valid.push(buildLuckyMoneyHQSubmitItem_(claim, claimDisplay, row));
      } catch (err) {
        skipped.push({ row: row, ok: false, message: err && err.message ? err.message : String(err) });
      }
    });

    if (!valid.length) {
      const msg = skipped.length ? skipped.map(x => x.message).join("\n") : "Tidak ada data valid untuk Submit HQ.";
      throw new Error(msg);
    }

    // HQ rows must follow claim queue order: older timestamp first, then claim row.
    valid.sort((a, b) => {
      const am = Number(a.submitOrderMs || 0);
      const bm = Number(b.submitOrderMs || 0);
      if (am !== bm) return am - bm;
      return Number(a.row || 0) - Number(b.row || 0);
    });

    const ssSource = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    const shHQ = ssSource.getSheetByName(SOURCE_LUCKY_MONEY_SHEET);
    if (!shHQ) throw new Error("Sheet HQ " + SOURCE_LUCKY_MONEY_SHEET + " tidak ditemukan.");

    const block = allocateHQAppendBlockFromPointer_(shHQ, {
      category: "Lucky Money 88",
      sheetName: SOURCE_LUCKY_MONEY_SHEET,
      keyColumn: 2,
      startRow: 2,
      count: valid.length
    });

    const mainValues = valid.map(item => [item.applyDate, item.akunMember, item.tipeBonus]);

    // Batch write 新升銅禮金Lucky money:
    // A = tanggal apply yyyy/MM/dd; B = Akun MB; C = Tipe Bonus.
    shHQ.getRange(block.startRow, 1, valid.length, 3).setValues(mainValues);

    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const submitBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);
    const now = new Date();
    const results = [];

    valid.forEach((item, i) => {
      const hqRow = block.startRow + i;
      const submitStatus = item.isResubmit ? "Resubmitted" : "Submitted";
      const nextCount = item.hqSubmitCount + 1;

      shClaim.getRange(item.row, 18, 1, 5).setValues([[
        submitStatus,
        now,
        submitBy,
        hqRow,
        nextCount
      ]]);

      results.push({
        ok: true,
        claimRow: item.row,
        hqRow: hqRow,
        hqSubmitStatus: submitStatus,
        hqSubmitBy: submitBy,
        hqSubmitCount: nextCount,
        data: {
          tanggal: item.applyDate,
          akunMember: item.akunMember,
          tipeBonus: item.tipeBonus
        }
      });
    });

    setStoredHQWritePointerRow_(
      "Lucky Money 88",
      SOURCE_LUCKY_MONEY_SHEET,
      2,
      block.endRow,
      "Batch Submit HQ Lucky Money 88: " + valid.length + " claim" + (block.refreshed ? " | pointer refreshed" : "")
    );

    SpreadsheetApp.flush();

    const rowText = valid.length === 1 ? String(block.startRow) : (block.startRow + "-" + block.endRow);
    const message = "Submit HQ Lucky Money 88 berhasil: " + valid.length + " claim ke row " + rowText + (skipped.length ? " | Skip: " + skipped.length : "");

    return {
      ok: true,
      message: message,
      count: valid.length,
      skippedCount: skipped.length,
      rows: rows,
      startRow: block.startRow,
      endRow: block.endRow,
      pointerRefreshed: block.refreshed,
      results: results,
      skipped: skipped
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function submitLuckyMoneyToHQ(row) {
  const result = submitLuckyMoneyBatchToHQ([row]);
  const first = result && result.results && result.results[0];

  if (!first) {
    const skipped = result && result.skipped && result.skipped[0];
    throw new Error(skipped && skipped.message ? skipped.message : "Submit HQ Lucky Money 88 gagal.");
  }

  return {
    ok: true,
    message: (first.hqSubmitStatus === "Resubmitted" ? "Resubmit HQ Lucky Money 88 berhasil" : "Submit HQ Lucky Money 88 berhasil") + " ke row " + first.hqRow,
    claimRow: first.claimRow,
    hqRow: first.hqRow,
    hqSubmitStatus: first.hqSubmitStatus,
    hqSubmitBy: first.hqSubmitBy,
    hqSubmitCount: first.hqSubmitCount,
    data: first.data
  };
}

function submitPromoSyukuranBatchToHQ(rows) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya Owner/Admin yang bisa Submit HQ.");
  }

  if (!Array.isArray(rows)) rows = [rows];

  rows = rows
    .map(r => Number(r))
    .filter(r => r && r >= 2)
    .filter((r, i, arr) => arr.indexOf(r) === i);

  if (!rows.length) throw new Error("Pilih minimal 1 claim Promo Syukuran untuk Submit HQ.");

  const lock = acquireHQWriteLock_(15000, "Submit HQ Promo Syukuran sedang berjalan. Coba lagi beberapa detik, atau gunakan Submit Selected HQ untuk batch.");

  try {
    const shClaim = ensureBonusClaimHQSubmitColumns_();
    if (!shClaim) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

    const valid = [];
    const skipped = [];

    rows.forEach(row => {
      try {
        if (row > shClaim.getLastRow()) throw new Error("Row " + row + " tidak ditemukan.");

        const claim = shClaim.getRange(row, 1, 1, 22).getValues()[0];
        const claimDisplay = shClaim.getRange(row, 1, 1, 22).getDisplayValues()[0];
        valid.push(buildPromoSyukuranHQSubmitItem_(claim, claimDisplay, row));
      } catch (err) {
        skipped.push({ row: row, ok: false, message: err && err.message ? err.message : String(err) });
      }
    });

    if (!valid.length) {
      const msg = skipped.length ? skipped.map(x => x.message).join("\n") : "Tidak ada data valid untuk Submit HQ.";
      throw new Error(msg);
    }

    // HQ rows must follow claim queue order: older timestamp first, then claim row.
    valid.sort((a, b) => {
      const am = Number(a.submitOrderMs || 0);
      const bm = Number(b.submitOrderMs || 0);
      if (am !== bm) return am - bm;
      return Number(a.row || 0) - Number(b.row || 0);
    });

    const ssSource = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    const shHQ = ssSource.getSheetByName(SOURCE_PROMO_SYUKURAN_SHEET);
    if (!shHQ) throw new Error("Sheet HQ " + SOURCE_PROMO_SYUKURAN_SHEET + " tidak ditemukan.");

    const block = allocateHQAppendBlockFromPointer_(shHQ, {
      category: "Promo Syukuran",
      sheetName: SOURCE_PROMO_SYUKURAN_SHEET,
      keyColumn: 2,
      startRow: 2,
      count: valid.length
    });

    const mainValues = valid.map(item => [item.applyDate, item.akunMember, item.tipeBonus]);

    // Batch write: A = tanggal apply user, B = Akun MB, C = Tipe Bonus exact validation HQ.
    shHQ.getRange(block.startRow, 1, valid.length, 3).setValues(mainValues);

    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const submitBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);
    const now = new Date();
    const results = [];

    valid.forEach((item, i) => {
      const hqRow = block.startRow + i;
      const submitStatus = item.isResubmit ? "Resubmitted" : "Submitted";
      const nextCount = item.hqSubmitCount + 1;

      shClaim.getRange(item.row, 18, 1, 5).setValues([[
        submitStatus,
        now,
        submitBy,
        hqRow,
        nextCount
      ]]);

      results.push({
        ok: true,
        claimRow: item.row,
        hqRow: hqRow,
        hqSubmitStatus: submitStatus,
        hqSubmitBy: submitBy,
        hqSubmitCount: nextCount,
        data: {
          tanggal: item.applyDate,
          akunMember: item.akunMember,
          tipeBonus: item.tipeBonus
        }
      });
    });

    setStoredHQWritePointerRow_(
      "Promo Syukuran",
      SOURCE_PROMO_SYUKURAN_SHEET,
      2,
      block.endRow,
      "Batch Submit HQ Promo Syukuran: " + valid.length + " claim" + (block.refreshed ? " | pointer refreshed" : "")
    );

    const rowText = valid.length === 1 ? String(block.startRow) : (block.startRow + "-" + block.endRow);
    const message = "Submit HQ Promo Syukuran berhasil: " + valid.length + " claim ke row " + rowText + (skipped.length ? " | Skip: " + skipped.length : "");

    return {
      ok: true,
      message: message,
      count: valid.length,
      skippedCount: skipped.length,
      rows: rows,
      startRow: block.startRow,
      endRow: block.endRow,
      pointerRefreshed: block.refreshed,
      results: results,
      skipped: skipped
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function submitPromoSyukuranToHQ(row) {
  const result = submitPromoSyukuranBatchToHQ([row]);
  const first = result && result.results && result.results[0];

  if (!first) {
    const skipped = result && result.skipped && result.skipped[0];
    throw new Error(skipped && skipped.message ? skipped.message : "Submit HQ Promo Syukuran gagal.");
  }

  return {
    ok: true,
    message: (first.hqSubmitStatus === "Resubmitted" ? "Resubmit HQ Promo Syukuran berhasil" : "Submit HQ Promo Syukuran berhasil") + " ke row " + first.hqRow,
    claimRow: first.claimRow,
    hqRow: first.hqRow,
    hqSubmitStatus: first.hqSubmitStatus,
    hqSubmitBy: first.hqSubmitBy,
    hqSubmitCount: first.hqSubmitCount,
    data: first.data
  };
}

function submitWelcomeBonusBatchToHQ(rows) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya Owner/Admin yang bisa Submit HQ.");
  }

  if (!Array.isArray(rows)) rows = [rows];

  rows = rows
    .map(r => Number(r))
    .filter(r => r && r >= 2)
    .filter((r, i, arr) => arr.indexOf(r) === i);

  if (!rows.length) throw new Error("Pilih minimal 1 claim Welcome Bonus untuk Submit HQ.");

  const lock = acquireHQWriteLock_(15000, "Submit HQ Welcome sedang berjalan. Coba lagi beberapa detik, atau gunakan Submit Selected HQ untuk batch.");

  try {
    const shClaim = ensureBonusClaimHQSubmitColumns_();
    if (!shClaim) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

    const valid = [];
    const skipped = [];

    rows.forEach(row => {
      try {
        if (row > shClaim.getLastRow()) throw new Error("Row " + row + " tidak ditemukan.");

        const claim = shClaim.getRange(row, 1, 1, 22).getValues()[0];
        const claimDisplay = shClaim.getRange(row, 1, 1, 22).getDisplayValues()[0];
        valid.push(buildWelcomeHQSubmitItem_(claim, claimDisplay, row));
      } catch (err) {
        skipped.push({ row: row, ok: false, message: err && err.message ? err.message : String(err) });
      }
    });

    if (!valid.length) {
      const msg = skipped.length ? skipped.map(x => x.message).join("\n") : "Tidak ada data valid untuk Submit HQ.";
      throw new Error(msg);
    }

    // IMPORTANT: HQ rows must follow claim queue order, not UI selection/display order.
    // Admin may select rows while the table is sorted newest-first, but HQ team needs
    // the written rows in chronological order: older timestamp first, then claim row.
    valid.sort((a, b) => {
      const am = Number(a.submitOrderMs || 0);
      const bm = Number(b.submitOrderMs || 0);
      if (am !== bm) return am - bm;
      return Number(a.row || 0) - Number(b.row || 0);
    });

    const ssSource = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    const shHQ = ssSource.getSheetByName(SOURCE_WELCOME_SHEET);
    if (!shHQ) throw new Error("Sheet HQ " + SOURCE_WELCOME_SHEET + " tidak ditemukan.");

    const block = allocateHQAppendBlockFromPointer_(shHQ, {
      category: "Welcome Bonus",
      sheetName: SOURCE_WELCOME_SHEET,
      keyColumn: 5,
      startRow: 2,
      count: valid.length
    });

    const dateValues = valid.map(item => [item.applyDate]);
    const mainValues = valid.map(item => [item.akunMember, item.agenStatus, item.tipeBonusHQ]);

    // Batch write: hanya 2 call ke HQ walaupun 3/10/50 claim dipilih.
    // A = tanggal apply user; E = Akun MB; F = Agen Status; G = Tipe Bonus format validasi HQ.
    shHQ.getRange(block.startRow, 1, valid.length, 1).setValues(dateValues);
    shHQ.getRange(block.startRow, 5, valid.length, 3).setValues(mainValues);

    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const submitBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);
    const now = new Date();
    const results = [];

    valid.forEach((item, i) => {
      const hqRow = block.startRow + i;
      const submitStatus = item.isResubmit ? "Resubmitted" : "Submitted";
      const nextCount = item.hqSubmitCount + 1;

      shClaim.getRange(item.row, 18, 1, 5).setValues([[
        submitStatus,
        now,
        submitBy,
        hqRow,
        nextCount
      ]]);

      results.push({
        ok: true,
        claimRow: item.row,
        hqRow: hqRow,
        hqSubmitStatus: submitStatus,
        hqSubmitBy: submitBy,
        hqSubmitCount: nextCount,
        data: {
          tanggal: item.applyDate,
          akunMember: item.akunMember,
          agenStatus: item.agenStatus,
          tipeBonus: item.tipeBonusHQ
        }
      });
    });

    setStoredHQWritePointerRow_(
      "Welcome Bonus",
      SOURCE_WELCOME_SHEET,
      5,
      block.endRow,
      "Batch Submit HQ: " + valid.length + " claim" + (block.refreshed ? " | pointer refreshed" : "")
    );

    const rowText = valid.length === 1 ? String(block.startRow) : (block.startRow + "-" + block.endRow);
    const message = "Submit HQ Welcome berhasil: " + valid.length + " claim ke row " + rowText + (skipped.length ? " | Skip: " + skipped.length : "");

    return {
      ok: true,
      message: message,
      count: valid.length,
      skippedCount: skipped.length,
      rows: rows,
      startRow: block.startRow,
      endRow: block.endRow,
      pointerRefreshed: block.refreshed,
      results: results,
      skipped: skipped
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function submitWelcomeBonusToHQ(row) {
  const result = submitWelcomeBonusBatchToHQ([row]);
  const first = result && result.results && result.results[0];

  if (!first) {
    const skipped = result && result.skipped && result.skipped[0];
    throw new Error(skipped && skipped.message ? skipped.message : "Submit HQ Welcome gagal.");
  }

  return {
    ok: true,
    message: (first.hqSubmitStatus === "Resubmitted" ? "Resubmit HQ Welcome berhasil" : "Submit HQ Welcome berhasil") + " ke row " + first.hqRow,
    claimRow: first.claimRow,
    hqRow: first.hqRow,
    hqSubmitStatus: first.hqSubmitStatus,
    hqSubmitBy: first.hqSubmitBy,
    hqSubmitCount: first.hqSubmitCount,
    data: first.data
  };
}

function buildHelloFriendsHQSubmitItem_(claim, claimDisplay, row) {
  const category = String(claimDisplay[4] || "").trim();
  const status = String(claimDisplay[11] || "").trim();
  const statusHQ = String(claimDisplay[15] || "").trim();
  const hqSubmitStatus = String(claimDisplay[17] || "").trim();
  const hqSubmitCount = Number(claim[21] || 0);

  if (!isHelloFriendsCategory_(category)) {
    throw new Error("Row " + row + " bukan Hello Friends.");
  }

  if (status === "Rejected") {
    throw new Error("Row " + row + " sudah Rejected.");
  }

  assertClaimLockedForHQSubmit_(status, row);

  if (isHQOkStatus_(statusHQ)) {
    throw new Error("Row " + row + " StatusHQ sudah OK.");
  }

  if (hqSubmitStatus && !statusHQ) {
    throw new Error("Row " + row + " sudah dikirim ke HQ dan masih menunggu StatusHQ.");
  }

  const applyDate = formatPromoSyukuranHQSubmitDate_(claim[0]); // yyyy/MM/dd
  let submitOrderDate = claim[0] instanceof Date ? claim[0] : new Date(claim[0]);
  if (!(submitOrderDate instanceof Date) || isNaN(submitOrderDate)) submitOrderDate = new Date(0);
  const submitOrderMs = submitOrderDate.getTime();

  const kodeAgen = String(claimDisplay[9] || "").trim().toUpperCase();
  const akunPengenal = String(claimDisplay[3] || "").trim().toUpperCase();
  const remarks = String(claimDisplay[10] || claim[10] || "").trim();
  const akunDiajak = String(parseHelloFriendsDiajak_(remarks) || "").trim().toUpperCase();
  const jumlahPengenalan = String(parseHelloFriendsJumlahPengenalan_(remarks) || "").trim();
  const fixedType = parseHelloFriendsFixedType_(remarks);
  const tipeBonus = String(claimDisplay[5] || "").trim();

  if (!kodeAgen) throw new Error("Row " + row + " Kode Agen kosong.");
  if (!akunPengenal) throw new Error("Row " + row + " Akun MB Pengenal kosong.");
  if (!akunDiajak) throw new Error("Row " + row + " Akun MB yang Diajak kosong di User Remarks.");
  if (!jumlahPengenalan) throw new Error("Row " + row + " Jumlah Pengenalan kosong di User Remarks.");
  if (!fixedType) throw new Error("Row " + row + " tipe fixed Hello Friends kosong.");
  if (!tipeBonus) throw new Error("Row " + row + " Tipe Bonus kosong.");
  if (!getHelloFriendsNominal_(tipeBonus)) {
    throw new Error("Row " + row + " Tipe Bonus Hello Friends belum sesuai validasi HQ: " + tipeBonus);
  }

  const isResubmit = !!(hqSubmitStatus && statusHQ && !isHQOkStatus_(statusHQ));

  return {
    row: row,
    submitOrderMs: submitOrderMs,
    applyDate: applyDate,
    kodeAgen: kodeAgen,
    akunPengenal: akunPengenal,
    akunDiajak: akunDiajak,
    jumlahPengenalan: jumlahPengenalan,
    fixedType: fixedType,
    tipeBonus: tipeBonus,
    isResubmit: isResubmit,
    hqSubmitCount: hqSubmitCount
  };
}

function submitHelloFriendsBatchToHQ(rows) {
  if (!isAdmin_()) {
    throw new Error("Access denied. Hanya Owner/Admin yang bisa Submit HQ.");
  }

  if (!Array.isArray(rows)) rows = [rows];

  rows = rows
    .map(r => Number(r))
    .filter(r => r && r >= 2)
    .filter((r, i, arr) => arr.indexOf(r) === i);

  if (!rows.length) throw new Error("Pilih minimal 1 claim Hello Friends untuk Submit HQ.");

  const lock = acquireHQWriteLock_(15000, "Submit HQ Hello Friends sedang berjalan. Coba lagi beberapa detik, atau gunakan Submit Selected HQ untuk batch.");

  try {
    const shClaim = ensureBonusClaimHQSubmitColumns_();
    if (!shClaim) throw new Error("Sheet BONUS_CLAIM tidak ditemukan.");

    const valid = [];
    const skipped = [];

    rows.forEach(row => {
      try {
        if (row > shClaim.getLastRow()) throw new Error("Row " + row + " tidak ditemukan.");

        const claim = shClaim.getRange(row, 1, 1, 22).getValues()[0];
        const claimDisplay = shClaim.getRange(row, 1, 1, 22).getDisplayValues()[0];
        valid.push(buildHelloFriendsHQSubmitItem_(claim, claimDisplay, row));
      } catch (err) {
        skipped.push({ row: row, ok: false, message: err && err.message ? err.message : String(err) });
      }
    });

    if (!valid.length) {
      const msg = skipped.length ? skipped.map(x => x.message).join("\n") : "Tidak ada data valid untuk Submit HQ.";
      throw new Error(msg);
    }

    // HQ rows must follow claim queue order: older timestamp first, then claim row.
    valid.sort((a, b) => {
      const am = Number(a.submitOrderMs || 0);
      const bm = Number(b.submitOrderMs || 0);
      if (am !== bm) return am - bm;
      return Number(a.row || 0) - Number(b.row || 0);
    });

    const ssSource = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
    const shHQ = ssSource.getSheetByName(SOURCE_HELLO_FRIENDS_SHEET);
    if (!shHQ) throw new Error("Sheet HQ " + SOURCE_HELLO_FRIENDS_SHEET + " tidak ditemukan.");

    const block = allocateHQAppendBlockFromPointer_(shHQ, {
      category: "Hello Friends",
      sheetName: SOURCE_HELLO_FRIENDS_SHEET,
      keyColumn: 5,
      startRow: 2,
      count: valid.length,
      requirePointer: true
    });

    const dateValues = valid.map(item => [item.applyDate]);
    const mainValues = valid.map(item => [
      item.kodeAgen,
      item.akunPengenal,
      item.akunDiajak,
      item.jumlahPengenalan,
      item.fixedType,
      item.tipeBonus
    ]);

    // Batch write 介紹好友 FRIENDS:
    // A = tanggal yyyy/MM/dd; D = Kode Agen; E = Akun MB Pengenal; F = Akun MB yang Diajak;
    // G = Jumlah Pengenalan; H = 普通/VIP-介紹好友; I = Tipe Bonus.
    shHQ.getRange(block.startRow, 1, valid.length, 1).setValues(dateValues);
    shHQ.getRange(block.startRow, 4, valid.length, 6).setValues(mainValues);

    const email = Session.getActiveUser().getEmail();
    const admin = getUserAccess_(email);
    const submitBy = admin && admin.adminCode ? admin.adminCode : (admin && admin.staffName ? admin.staffName : email);
    const now = new Date();
    const results = [];

    valid.forEach((item, i) => {
      const hqRow = block.startRow + i;
      const submitStatus = item.isResubmit ? "Resubmitted" : "Submitted";
      const nextCount = item.hqSubmitCount + 1;

      shClaim.getRange(item.row, 18, 1, 5).setValues([[
        submitStatus,
        now,
        submitBy,
        hqRow,
        nextCount
      ]]);

      results.push({
        ok: true,
        claimRow: item.row,
        hqRow: hqRow,
        hqSubmitStatus: submitStatus,
        hqSubmitBy: submitBy,
        hqSubmitCount: nextCount,
        data: {
          tanggal: item.applyDate,
          kodeAgen: item.kodeAgen,
          akunPengenal: item.akunPengenal,
          akunDiajak: item.akunDiajak,
          jumlahPengenalan: item.jumlahPengenalan,
          fixedType: item.fixedType,
          tipeBonus: item.tipeBonus
        }
      });
    });

    setStoredHQWritePointerRow_(
      "Hello Friends",
      SOURCE_HELLO_FRIENDS_SHEET,
      5,
      block.endRow,
      "Batch Submit HQ Hello Friends: " + valid.length + " claim" + (block.refreshed ? " | pointer refreshed" : "")
    );

    SpreadsheetApp.flush();

    const rowText = valid.length === 1 ? String(block.startRow) : (block.startRow + "-" + block.endRow);
    const message = "Submit HQ Hello Friends berhasil: " + valid.length + " claim ke row " + rowText + (skipped.length ? " | Skip: " + skipped.length : "");

    return {
      ok: true,
      message: message,
      count: valid.length,
      skippedCount: skipped.length,
      rows: rows,
      startRow: block.startRow,
      endRow: block.endRow,
      pointerRefreshed: block.refreshed,
      results: results,
      skipped: skipped
    };

  } finally {
    releaseLockSafe_(lock);
  }
}

function submitHelloFriendsToHQ(row) {
  const result = submitHelloFriendsBatchToHQ([row]);
  const first = result && result.results && result.results[0];

  if (!first) {
    const skipped = result && result.skipped && result.skipped[0];
    throw new Error(skipped && skipped.message ? skipped.message : "Submit HQ Hello Friends gagal.");
  }

  return {
    ok: true,
    message: (first.hqSubmitStatus === "Resubmitted" ? "Resubmit HQ Hello Friends berhasil" : "Submit HQ Hello Friends berhasil") + " ke row " + first.hqRow,
    claimRow: first.claimRow,
    hqRow: first.hqRow,
    hqSubmitStatus: first.hqSubmitStatus,
    hqSubmitBy: first.hqSubmitBy,
    hqSubmitCount: first.hqSubmitCount,
    data: first.data
  };
}

