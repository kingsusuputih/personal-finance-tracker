const ALIAS_RULES = [
  {
    group: "Rokok",
    patterns: [/\brokok\b/i, /\bsampoerna\b/i, /\bgudang garam\b/i, /\bdjarum\b/i, /\bmarlboro\b/i, /\bmagnum\b/i, /\bess(e)?\b/i],
  },
  {
    group: "Kopi",
    patterns: [/\bkopi\b/i, /\bcoffee\b/i, /\bngopi\b/i, /\bstarbucks\b/i, /\bkenangan\b/i, /\bjanji jiwa\b/i, /\bfore\b/i, /\bpoint coffee\b/i, /\btuku\b/i],
  },
  {
    group: "Bensin & BBM",
    patterns: [/\bbensin\b/i, /\bpertalite\b/i, /\bpertamax\b/i, /\bspbu\b/i, /\bshell\b/i, /\bbbm\b/i, /\bsolar\b/i],
  },
  {
    group: "Makanan & Minuman",
    patterns: [/\bmakan(an)?\b/i, /\bsarapan\b/i, /\blunch\b/i, /\bdinner\b/i, /\bwarteg\b/i, /\bgofood\b/i, /\bgrabfood\b/i, /\bshopeefood\b/i, /\bnasi\b/i, /\bayam\b/i, /\bmie\b/i, /\bbakso\b/i],
  },
  {
    group: "Listrik & Air",
    patterns: [/\blistrik\b/i, /\bpln\b/i, /\btoken listrik\b/i, /\bpdam\b/i, /\bair galon\b/i],
  },
  {
    group: "Pulsa & Internet",
    patterns: [/\bpulsa\b/i, /\bkuota\b/i, /\bpaket data\b/i, /\bwifi\b/i, /\bindihome\b/i, /\bfirstmedia\b/i, /\bbiznet\b/i, /\btelkomsel\b/i, /\bbyu\b/i, /\bindosat\b/i, /\bxl\b/i],
  },
  {
    group: "Belanja Harian",
    patterns: [/\bindomaret\b/i, /\balfamart\b/i, /\bsuperindo\b/i, /\bhypermart\b/i, /\bpasar\b/i, /\bbelanjaan?\b/i, /\bsabun\b/i, /\bodol\b/i, /\bshampoo\b/i],
  },
  {
    group: "Parkir & Tol",
    patterns: [/\bparkir\b/i, /\btol\b/i, /\be-toll\b/i, /\btap cash\b/i],
  },
  {
    group: "Kesehatan & Obat",
    patterns: [/\bobat\b/i, /\bapotek\b/i, /\bkimia farma\b/i, /\bdokter\b/i, /\bvitamin\b/i, /\bklinik\b/i, /\brumah sakit\b/i],
  },
  {
    group: "Laundry",
    patterns: [/\blaundry\b/i, /\bcuci\b/i, /\bsetrika\b/i],
  },
];

export function resolveExpenseGroup(description = "", groupOverride = "") {
  const override = String(groupOverride || "").trim();
  if (override === "__separate__") {
    return String(description || "").trim() || "Tanpa Keterangan";
  }
  if (override) {
    return override;
  }

  const cleanDesc = String(description || "").trim();
  if (!cleanDesc) return "Lain-lain";

  if (/\b(dan|\+|\/|&)\b/i.test(cleanDesc)) {
    return cleanDesc;
  }

  for (const rule of ALIAS_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(cleanDesc))) {
      return rule.group;
    }
  }

  return cleanDesc;
}

export function groupExpenses(transactions = []) {
  const result = {
    Needs: {},
    Lifestyle: {},
    Investment: {},
  };

  transactions.forEach((t) => {
    const category = result[t.category] ? t.category : "Needs";
    const groupName = resolveExpenseGroup(t.description, t.group_override);

    if (!result[category][groupName]) {
      result[category][groupName] = {
        name: groupName,
        category,
        total: 0,
        count: 0,
        items: [],
      };
    }

    result[category][groupName].total += Number(t.amount) || 0;
    result[category][groupName].count += 1;
    result[category][groupName].items.push(t);
  });

  return result;
}
