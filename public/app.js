const categories = ["Management", "Staff", "Facilities", "Billing", "Safety", "Cleanliness", "Other"];

const translations = {
  en: {
    tagline: "Independent member feedback board",
    verifyCta: "Verify to Vote",
    reportCta: "Report an Issue",
    disclaimerTitle: "Not affiliated with Structure Health & Fitness.",
    disclaimerBody: "This is a member-run board for verified gym member issues.",
    focusBranchNote: "Currently focused on Gulberg branch only.",
    statIssues: "Verified issues, 30 days",
    statVotes: "Total verified upvotes",
    statCategory: "Most reported category",
    statBranch: "Focus branch",
    topIssues: "Top issues",
    verifiedReports: "Verified member reports",
    branch: "Branch",
    category: "Category",
    allBranches: "All branches",
    allCategories: "All categories",
    staffMentions: "Staff mentions",
    repeatedRoles: "Repeated roles or names",
    recentActivity: "Recent activity",
    latestChanges: "Latest changes",
    whyEyebrow: "Why verification exists",
    whyHeading: "The Gulberg board is public, but posting and voting should come from real members.",
    whyBody: "Verification is a trust check. It helps keep the issue count from being inflated by outsiders, fake accounts, or repeat votes while still letting members report anonymously by default.",
    proofOne: "Pick the branch you visited.",
    proofTwo: "Upload any recent original gym photo. It does not need to show a person.",
    proofThree: "The system checks date and approximate place, then discards the photo.",
    faqHeading: "What this is and what it is not",
    faqOfficialQ: "Is this official?",
    faqOfficialA: "No. This is an independent member-run board and is not affiliated with, endorsed by, or operated by Structure Health & Fitness.",
    faqPhotoQ: "Why do you need a photo?",
    faqPhotoA: "The photo is only used as proof that someone recently visited the selected branch. It can be equipment, floor, signage, lockers, or any non-person gym photo. It reduces fake reports and duplicate voting.",
    faqStoreQ: "Do you store the photo?",
    faqStoreA: "No. The plan is to check the photo metadata in memory and discard the original image immediately after verification.",
    faqAnonymousQ: "Can I stay anonymous?",
    faqAnonymousA: "Yes. Reports are anonymous by default. If someone wants their name shown, they can choose that while posting.",
    faqUnverifiedQ: "Can I report without being verified?",
    faqUnverifiedA: "For launch, no. Verification is required before publishing a report or voting. This keeps public counts credible while still letting the report appear anonymous.",
    faqFocusQ: "What should reports focus on?",
    faqFocusA: "Reports should describe observable gym issues: facilities, billing, cleanliness, safety, staff behavior, or management problems. Threats and private personal details do not belong here.",
    faqPhotoFailQ: "What if my photo does not work?",
    faqPhotoFailA: "Screenshots and images saved through WhatsApp or Instagram often lose the metadata needed for verification. An original phone-gallery photo has the best chance of working.",
    policyEyebrow: "Intent & privacy",
    policyHeading: "Built for transparency, not fights.",
    intentTitle: "Why this exists",
    intentBody: "This board is meant to make recurring gym issues visible in one place so they can be resolved. The goal is transparency and constructive pressure, not personal attacks, drama, or endless arguing.",
    privacyTitle: "What is stored",
    privacyBody: "Reports, votes, branch choice, verification time, expiry time, photo timestamp, approximate distance from the branch, and hashed technical signals such as member token, IP, and user agent may be stored.",
    photoPrivacyTitle: "What is not stored",
    photoPrivacyBody: "The original verification photo is checked in memory and discarded. Names are optional, reports are anonymous by default, and the server stores only a hash of the member token.",
    conductTitle: "How to use it",
    conductBody: "Post observable issues, avoid private personal details, threats, insults, or claims you cannot support, and use the board to help fix problems before they turn into arguments.",
    newReport: "New report",
    reportTitle: "Report an Issue",
    demoNote: "Verify first, then publish your report. Reports stay anonymous by default.",
    titleLabel: "Title",
    titlePlaceholder: "Short, specific title",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Describe what happened. Avoid insults, threats, or private personal details.",
    staffName: "Staff name",
    staffRole: "Staff role",
    optional: "Optional",
    postAnonymously: "Post anonymously",
    displayName: "Display name",
    shownPublicly: "Shown publicly",
    cancel: "Cancel",
    publishIssue: "Publish Issue",
    memberVerification: "Member verification",
    verifyTitle: "Verify to Post or Vote",
    photoLabel: "Recent original gym photo",
    photoPickerTitle: "Choose photo from gallery or camera",
    photoPickerMeta: "No person needed",
    noPhotoSelected: "No photo selected",
    selectedPhoto: "Selected:",
    photoRequired: "Add a recent original gym photo first.",
    photoReady: "Photo selected. Ready to check.",
    verificationChecking: "Checking photo...",
    verificationSuccess: "Verified. You can now post and vote.",
    verificationFailed: "Could not verify this photo.",
    extractedMetadata: "What we checked",
    extractedBranch: "Branch",
    extractedPhotoTaken: "Photo taken",
    extractedDistance: "Distance from branch",
    extractedMaxDistance: "Allowed radius",
    extractedMetadataStatus: "Metadata status",
    extractedJpeg: "Image format",
    extractedExif: "EXIF metadata",
    extractedTimestamp: "Timestamp",
    extractedGps: "GPS location",
    found: "Found",
    missing: "Missing",
    notChecked: "Not checked",
    gpsAndTimestamp: "GPS and timestamp found",
    unsupportedFile: "Unsupported file type",
    missingExifStatus: "EXIF metadata missing",
    missingTimestampStatus: "Timestamp missing",
    missingGpsStatus: "GPS missing",
    outsideBranchStatus: "Outside branch radius",
    verifyBeforePosting: "Verify as a member before publishing a report.",
    botCheckFailed: "Bot check failed. Please try again.",
    botCheckMisconfigured: "Bot check is enabled, but the public Turnstile site key is missing.",
    whyNeeded: "Why this is needed",
    whyNeededBody: "Only verified members can post or vote, so public counts stay harder to fake. The photo is checked for recent branch visit proof and then discarded. It does not have to include a person.",
    photoHint: "Upload an original photo from your phone gallery. It can be equipment, floor, signage, lockers, or anything inside the gym. Screenshots and WhatsApp or Instagram images usually will not work.",
    checkPhoto: "Check Photo",
    haveThisToo: "Have this too",
    counted: "Counted",
    anonymousMember: "Anonymous member",
    postedBy: "Posted by",
    noMatchingIssues: "No matching issues yet.",
    noStaffMentions: "No staff mentions yet.",
    noRecentActivity: "No recent activity.",
    reports: "reports",
    daysAgo: "d ago",
    pageTitle: "Shitty Structure",
    issue_peak_hours_title: "Peak-hour floor crowding",
    issue_peak_hours_body: "Evening sessions are becoming hard to complete because benches and racks stay occupied for long stretches."
  },
  ur: {
    tagline: "اراکین کا آزاد رائے بورڈ",
    verifyCta: "تصدیق کریں",
    reportCta: "رپورٹ کریں",
    disclaimerTitle: "⁦Structure Health & Fitness⁩ سے وابستہ نہیں۔",
    disclaimerBody: "یہ تصدیق شدہ اراکین کے مسائل کے لیے ایک آزاد بورڈ ہے۔",
    focusBranchNote: "فی الحال صرف گلبرگ برانچ پر توجہ ہے۔",
    statIssues: "گزشتہ 30 دن کے تصدیق شدہ مسائل",
    statVotes: "کل تصدیق شدہ ووٹ",
    statCategory: "سب سے زیادہ رپورٹ ہونے والی قسم",
    statBranch: "منتخب برانچ",
    topIssues: "اہم مسائل",
    verifiedReports: "تصدیق شدہ اراکین کی رپورٹس",
    branch: "برانچ",
    category: "قسم",
    allBranches: "تمام برانچز",
    allCategories: "تمام اقسام",
    staffMentions: "اسٹاف کا ذکر",
    repeatedRoles: "بار بار ذکر ہونے والے نام یا کردار",
    recentActivity: "تازہ سرگرمی",
    latestChanges: "تازہ تبدیلیاں",
    whyEyebrow: "تصدیق کیوں ضروری ہے",
    whyHeading: "گلبرگ کا بورڈ عوامی ہے، مگر رپورٹ اور ووٹ صرف حقیقی اراکین سے ہونے چاہئیں۔",
    whyBody: "تصدیق اعتماد قائم کرنے کا طریقہ ہے۔ اس سے باہر کے لوگوں، جعلی اکاؤنٹس، اور بار بار ووٹ ڈالنے سے اعداد و شمار بگڑنے کا خطرہ کم ہوتا ہے، جبکہ اراکین عام طور پر اپنا نام چھپا سکتے ہیں۔",
    proofOne: "وہ برانچ منتخب کریں جہاں آپ حال ہی میں گئے تھے۔",
    proofTwo: "جم کی کوئی بھی حالیہ اصل تصویر شامل کریں۔ اس میں کسی شخص کا ہونا ضروری نہیں۔",
    proofThree: "سسٹم تاریخ اور مقام کا اندازہ جانچتا ہے، پھر تصویر حذف کر دی جاتی ہے۔",
    faqHeading: "یہ کیا ہے اور کیا نہیں",
    faqOfficialQ: "کیا یہ سرکاری بورڈ ہے؟",
    faqOfficialA: "نہیں۔ یہ اراکین کا آزاد بورڈ ہے۔ اسے ⁦Structure Health & Fitness⁩ نہیں چلا رہا، نہ اس نے اس کی توثیق کی ہے۔",
    faqPhotoQ: "تصویر کیوں چاہیے؟",
    faqPhotoA: "تصویر صرف اس بات کے ثبوت کے لیے ہے کہ کسی رکن نے حال ہی میں منتخب برانچ کا دورہ کیا ہے۔ یہ مشین، فرش، سائن بورڈ، لاکرز، یا جم کے اندر کسی بھی چیز کی تصویر ہو سکتی ہے؛ کسی شخص کی تصویر ضروری نہیں۔ اس سے جعلی رپورٹس اور دہری ووٹنگ کم ہوتی ہے۔",
    faqStoreQ: "کیا تصویر محفوظ کی جاتی ہے؟",
    faqStoreA: "نہیں۔ منصوبہ یہ ہے کہ تصویر کی معلومات عارضی طور پر جانچی جائیں اور تصدیق کے فوراً بعد اصل تصویر حذف ہو جائے۔",
    faqAnonymousQ: "کیا میرا نام چھپا رہ سکتا ہے؟",
    faqAnonymousA: "ہاں۔ رپورٹس عام طور پر نام کے بغیر ہوتی ہیں۔ اگر کوئی اپنا نام دکھانا چاہے تو رپورٹ کرتے وقت انتخاب کر سکتا ہے۔",
    faqUnverifiedQ: "کیا تصدیق کے بغیر رپورٹ کر سکتا ہوں؟",
    faqUnverifiedA: "آغاز کے لیے نہیں۔ رپورٹ شائع کرنے یا ووٹ دینے سے پہلے تصدیق ضروری ہوگی۔ اس سے عوامی اعداد و شمار قابل اعتماد رہتے ہیں، جبکہ رپورٹ نام کے بغیر رہ سکتی ہے۔",
    faqFocusQ: "رپورٹس میں کیا لکھنا چاہیے؟",
    faqFocusA: "رپورٹس نظر آنے والے جم مسائل پر ہونی چاہئیں: سہولیات، فیس، صفائی، حفاظت، اسٹاف کا رویہ، یا انتظامی مسائل۔ دھمکیاں اور نجی ذاتی معلومات یہاں نہیں ہونی چاہئیں۔",
    faqPhotoFailQ: "اگر تصویر کام نہ کرے تو؟",
    faqPhotoFailA: "اسکرین شاٹس اور واٹس ایپ یا انسٹاگرام سے محفوظ تصاویر میں اکثر مطلوبہ معلومات نہیں رہتیں۔ فون گیلری کی اصل تصویر کے کام کرنے کے امکانات بہتر ہوتے ہیں۔",
    policyEyebrow: "مقصد اور پرائیویسی",
    policyHeading: "یہ شفافیت کے لیے ہے، لڑائی کے لیے نہیں۔",
    intentTitle: "یہ کیوں بنایا گیا ہے",
    intentBody: "اس بورڈ کا مقصد بار بار آنے والے جم مسائل کو ایک جگہ واضح کرنا ہے تاکہ انہیں حل کیا جا سکے۔ مقصد شفافیت اور مثبت دباؤ ہے، ذاتی حملے، ڈرامہ، یا بے فائدہ بحث نہیں۔",
    privacyTitle: "کیا محفوظ ہو سکتا ہے",
    privacyBody: "رپورٹس، ووٹس، منتخب برانچ، تصدیق کا وقت، ختم ہونے کا وقت، تصویر کا وقت، برانچ سے اندازاً فاصلہ، اور ہیش شدہ تکنیکی معلومات جیسے ممبر ٹوکن، آئی پی، اور یوزر ایجنٹ محفوظ ہو سکتے ہیں۔",
    photoPrivacyTitle: "کیا محفوظ نہیں کیا جاتا",
    photoPrivacyBody: "اصل تصدیقی تصویر صرف عارضی طور پر میموری میں چیک ہوتی ہے اور پھر ضائع کر دی جاتی ہے۔ نام اختیاری ہے، رپورٹس عام طور پر نام کے بغیر ہوتی ہیں، اور سرور صرف ممبر ٹوکن کا ہیش محفوظ کرتا ہے۔",
    conductTitle: "اسے کیسے استعمال کریں",
    conductBody: "صرف نظر آنے والے مسائل لکھیں، نجی ذاتی معلومات، دھمکیاں، گالیاں، یا ایسی باتیں نہ لکھیں جن کا سہارا نہ ہو، اور اسے مسائل حل کرنے کے لیے استعمال کریں تاکہ بات بحث یا لڑائی تک نہ پہنچے۔",
    newReport: "نئی رپورٹ",
    reportTitle: "مسئلہ رپورٹ کریں",
    demoNote: "پہلے تصدیق کریں، پھر رپورٹ شائع کریں۔ رپورٹس عام طور پر نام کے بغیر رہتی ہیں۔",
    titleLabel: "عنوان",
    titlePlaceholder: "مختصر اور واضح عنوان",
    descriptionLabel: "تفصیل",
    descriptionPlaceholder: "جو ہوا اسے واضح لکھیں۔ گالیاں، دھمکیاں، یا نجی معلومات شامل نہ کریں۔",
    staffName: "اسٹاف کا نام",
    staffRole: "اسٹاف کا کردار",
    optional: "اختیاری",
    postAnonymously: "نام چھپا کر شائع کریں",
    displayName: "دکھایا جانے والا نام",
    shownPublicly: "عوامی طور پر دکھایا جائے گا",
    cancel: "منسوخ کریں",
    publishIssue: "رپورٹ شائع کریں",
    memberVerification: "رکن کی تصدیق",
    verifyTitle: "رپورٹ یا ووٹ کے لیے تصدیق کریں",
    photoLabel: "جم کی حالیہ اصل تصویر",
    photoPickerTitle: "گیلری یا کیمرے سے تصویر منتخب کریں",
    photoPickerMeta: "کسی شخص کی تصویر ضروری نہیں",
    noPhotoSelected: "ابھی تصویر منتخب نہیں ہوئی",
    selectedPhoto: "منتخب تصویر:",
    photoRequired: "پہلے جم کی حالیہ اصل تصویر شامل کریں۔",
    photoReady: "تصویر منتخب ہو گئی۔ اب اسے جانچا جا سکتا ہے۔",
    verificationChecking: "تصویر جانچی جا رہی ہے...",
    verificationSuccess: "تصدیق ہو گئی۔ اب آپ رپورٹ یا ووٹ کر سکتے ہیں۔",
    verificationFailed: "اس تصویر سے تصدیق نہیں ہو سکی۔",
    extractedMetadata: "ہم نے کیا چیک کیا",
    extractedBranch: "برانچ",
    extractedPhotoTaken: "تصویر کا وقت",
    extractedDistance: "برانچ سے فاصلہ",
    extractedMaxDistance: "اجازت شدہ حد",
    extractedMetadataStatus: "میٹا ڈیٹا کی حالت",
    extractedJpeg: "تصویر کا فارمیٹ",
    extractedExif: "EXIF metadata",
    extractedTimestamp: "وقت",
    extractedGps: "GPS مقام",
    found: "موجود",
    missing: "موجود نہیں",
    notChecked: "چیک نہیں ہوا",
    gpsAndTimestamp: "GPS اور وقت موجود ہے",
    unsupportedFile: "فائل کی قسم قابل قبول نہیں",
    missingExifStatus: "EXIF metadata موجود نہیں",
    missingTimestampStatus: "وقت موجود نہیں",
    missingGpsStatus: "GPS موجود نہیں",
    outsideBranchStatus: "برانچ کی حد سے باہر",
    verifyBeforePosting: "رپورٹ شائع کرنے سے پہلے رکن کی تصدیق کریں۔",
    botCheckFailed: "بوٹ چیک ناکام ہو گیا۔ دوبارہ کوشش کریں۔",
    botCheckMisconfigured: "بوٹ چیک فعال ہے، مگر عوامی Turnstile site key موجود نہیں۔",
    whyNeeded: "یہ کیوں ضروری ہے",
    whyNeededBody: "صرف تصدیق شدہ اراکین رپورٹ یا ووٹ کر سکیں گے، اس لیے عوامی اعداد و شمار کو جعلی بنانا مشکل ہوگا۔ تصویر حالیہ برانچ دورے کے ثبوت کے لیے جانچی جاتی ہے اور پھر حذف کر دی جاتی ہے۔ اس میں کسی شخص کا ہونا ضروری نہیں۔",
    photoHint: "فون گیلری سے اصل تصویر شامل کریں۔ یہ مشین، فرش، سائن بورڈ، لاکرز، یا جم کے اندر کسی بھی چیز کی تصویر ہو سکتی ہے۔ اسکرین شاٹس اور واٹس ایپ یا انسٹاگرام کی تصاویر عموماً کام نہیں کرتیں۔",
    checkPhoto: "تصویر جانچیں",
    haveThisToo: "مجھے بھی یہ مسئلہ ہے",
    counted: "ووٹ شامل ہو گیا",
    anonymousMember: "نام ظاہر نہیں کیا گیا",
    postedBy: "شائع کرنے والا:",
    noMatchingIssues: "ابھی کوئی ملتا جلتا مسئلہ نہیں۔",
    noStaffMentions: "ابھی اسٹاف کا کوئی ذکر نہیں۔",
    noRecentActivity: "ابھی کوئی تازہ سرگرمی نہیں۔",
    reports: "رپورٹس",
    daysAgo: "دن پہلے",
    pageTitle: "Shitty Structure",
    issue_peak_hours_title: "مصروف اوقات میں جم فلور پر بہت رش",
    issue_peak_hours_body: "شام کے وقت بینچز اور ریکس لمبے وقت تک مصروف رہتے ہیں، جس کی وجہ سے ورزش مکمل کرنا مشکل ہو جاتا ہے۔"
  }
};

const categoryLabels = {
  en: {
    Management: "Management",
    Staff: "Staff",
    Facilities: "Facilities",
    Billing: "Billing",
    Safety: "Safety",
    Cleanliness: "Cleanliness",
    Other: "Other"
  },
  ur: {
    Management: "انتظامیہ",
    Staff: "اسٹاف",
    Facilities: "سہولیات",
    Billing: "بلنگ",
    Safety: "حفاظت",
    Cleanliness: "صفائی",
    Other: "دیگر"
  }
};

const roleLabels = {
  ur: {
    Housekeeping: "صفائی عملہ",
    "Front desk": "فرنٹ ڈیسک",
    "Floor management": "فلور مینجمنٹ"
  }
};

const branchLabels = {
  ur: {
    Gulberg: "گلبرگ"
  }
};

const turnstileSiteKey = document.querySelector("meta[name='turnstile-site-key']")?.content.trim() || "";
const turnstileRequired = document.querySelector("meta[name='turnstile-required']")?.content === "true";
const focusBranchSlug = "gulberg";

const state = {
  branches: [],
  issues: [],
  stats: null,
  verification: {
    verified: false,
    expires_at: null
  },
  verificationChecks: null,
  pendingTurnstile: null,
  turnstileLoadPromise: null,
  turnstileTokenPromise: null,
  cachedTurnstileToken: null,
  cachedTurnstileExpiresAt: 0,
  turnstileWidgetId: null,
  locale: translations[localStorage.getItem("locale")] ? localStorage.getItem("locale") : "en"
};

const elements = {
  issueCount: document.querySelector("#issueCount"),
  voteCount: document.querySelector("#voteCount"),
  topCategory: document.querySelector("#topCategory"),
  topBranch: document.querySelector("#topBranch"),
  categoryFilter: document.querySelector("#categoryFilter"),
  issuesList: document.querySelector("#issuesList"),
  staffMentions: document.querySelector("#staffMentions"),
  activityList: document.querySelector("#activityList"),
  reportButton: document.querySelector("#reportButton"),
  verifyButton: document.querySelector("#verifyButton"),
  reportDialog: document.querySelector("#reportDialog"),
  verifyDialog: document.querySelector("#verifyDialog"),
  issueForm: document.querySelector("#issueForm"),
  verifyForm: document.querySelector("#verifyForm"),
  issueBranch: document.querySelector("#issueBranch"),
  verifyBranch: document.querySelector("#verifyBranch"),
  photoPicker: document.querySelector("#photoPicker"),
  verifyPhotoInput: document.querySelector("#verifyPhotoInput"),
  photoPickerStatus: document.querySelector("#photoPickerStatus"),
  verificationDetails: document.querySelector("#verificationDetails"),
  displayNameField: document.querySelector("#displayNameField"),
  turnstileWidget: document.querySelector("#turnstileWidget"),
  localeButtons: document.querySelectorAll("[data-locale]")
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  applyLocale();
  const initialData = Promise.all([
    loadBranches(),
    refreshVerificationStatus(),
    refreshDashboard()
  ]);

  elements.localeButtons.forEach((button) => {
    button.addEventListener("click", () => setLocale(button.dataset.locale));
  });
  elements.categoryFilter.addEventListener("change", refreshIssues);
  elements.reportButton.addEventListener("click", () => openDialog(elements.reportDialog));
  elements.verifyButton.addEventListener("click", () => openDialog(elements.verifyDialog));
  elements.reportDialog.addEventListener("close", syncModalState);
  elements.verifyDialog.addEventListener("close", syncModalState);
  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => closeDialog(button.dataset.closeDialog));
  });
  elements.verifyPhotoInput.addEventListener("change", () => {
    state.verificationChecks = null;
    renderVerificationDetails(state.verificationChecks);
    updatePhotoStatus();
    prefetchTurnstileToken();
  });
  elements.issueForm.addEventListener("submit", submitIssue);
  elements.verifyForm.addEventListener("submit", submitVerification);
  elements.issueForm.is_anonymous.addEventListener("change", toggleDisplayName);

  await initialData;
}

function openDialog(dialog) {
  dialog.showModal();
  syncModalState();
  if (dialog === elements.verifyDialog && turnstileEnabled()) {
    loadTurnstileScript().catch(() => {});
  }
}

function syncModalState() {
  document.body.classList.toggle(
    "modal-open",
    elements.reportDialog.open || elements.verifyDialog.open
  );
}

function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (dialog?.open) {
    dialog.close();
  }
  syncModalState();
}

async function loadBranches() {
  const data = await getJson("/api/branches");
  state.branches = data.branches;

  elements.issueBranch.replaceChildren();
  elements.verifyBranch.replaceChildren();

  for (const branch of state.branches) {
    const reportOption = new Option(translateBranch(branch.name), branch.id);
    reportOption.dataset.branchName = branch.name;
    const verifyOption = new Option(translateBranch(branch.name), branch.id);
    verifyOption.dataset.branchName = branch.name;
    elements.issueBranch.append(reportOption);
    elements.verifyBranch.append(verifyOption);
  }

  if (state.branches.length === 1) {
    elements.issueBranch.value = state.branches[0].id;
    elements.verifyBranch.value = state.branches[0].id;
  }
}

function setLocale(locale) {
  state.locale = translations[locale] ? locale : "en";
  localStorage.setItem("locale", state.locale);
  applyLocale();
  renderIssues();
  renderStaffMentions();
  renderActivity();
}

function applyLocale() {
  document.documentElement.lang = state.locale;
  document.documentElement.dir = state.locale === "ur" ? "rtl" : "ltr";
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-category-label]").forEach((option) => {
    option.textContent = translateCategory(option.dataset.categoryLabel);
  });

  document.querySelectorAll("[data-branch-name]").forEach((option) => {
    option.textContent = translateBranch(option.dataset.branchName);
  });

  elements.localeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.locale === state.locale);
  });

  if (state.stats) {
    elements.topCategory.textContent = translateCategory(state.stats.top_category);
    elements.topBranch.textContent = translateBranch(state.stats.top_branch);
  }

  updatePhotoStatus();
  renderVerificationDetails(state.verificationChecks);
}

async function refreshDashboard() {
  await Promise.all([refreshStats(), refreshIssues()]);
}

async function refreshStats() {
  state.stats = await getJson("/api/stats");
  elements.issueCount.textContent = state.stats.issue_count;
  elements.voteCount.textContent = state.stats.vote_count;
  elements.topCategory.textContent = translateCategory(state.stats.top_category);
  elements.topBranch.textContent = translateBranch(state.stats.top_branch);
  renderStaffMentions();
}

async function refreshIssues() {
  const params = new URLSearchParams({
    branch: focusBranchSlug,
    category: elements.categoryFilter.value
  });
  const data = await getJson(`/api/issues?${params.toString()}`);
  state.issues = data.issues;
  renderIssues();
  renderActivity();
}

function renderIssues() {
  elements.issuesList.replaceChildren();

  if (state.issues.length === 0) {
    elements.issuesList.append(emptyMessage(t("noMatchingIssues")));
    return;
  }

  for (const issue of state.issues) {
    const card = document.createElement("article");
    card.className = "issue-card";
    card.innerHTML = `
      <div>
        <h3>${escapeHtml(translateIssueTitle(issue))}</h3>
        <div class="author-line">${escapeHtml(authorLine(issue))}</div>
        <p>${escapeHtml(translateIssueBody(issue))}</p>
        <div class="meta-row">
          <span class="pill">${escapeHtml(translateBranch(issue.branch_name))}</span>
          <span class="pill category">${escapeHtml(translateCategory(issue.category))}</span>
          ${issue.staff_name || issue.staff_role ? `<span class="pill">${escapeHtml(translateRole(issue.staff_name || issue.staff_role))}</span>` : ""}
        </div>
      </div>
      <div class="vote-box">
        <strong>${Number(issue.vote_count || 0)}</strong>
        <button class="vote-button" type="button" data-issue-id="${escapeHtml(issue.id)}">${escapeHtml(t("haveThisToo"))}</button>
      </div>
    `;
    elements.issuesList.append(card);
  }

  elements.issuesList.querySelectorAll(".vote-button").forEach((button) => {
    button.addEventListener("click", vote);
  });
}

function renderStaffMentions() {
  elements.staffMentions.replaceChildren();
  const mentions = state.stats?.staff_mentions || [];

  if (mentions.length === 0) {
    elements.staffMentions.append(emptyMessage(t("noStaffMentions")));
    return;
  }

  mentions.forEach((mention) => {
    const row = document.createElement("div");
    row.className = "mention";
    row.innerHTML = `
      <strong>${escapeHtml(translateRole(mention.label))}</strong>
      <span>${Number(mention.count)} ${escapeHtml(t("reports"))}</span>
    `;
    elements.staffMentions.append(row);
  });
}

function renderActivity() {
  elements.activityList.replaceChildren();
  const recent = [...state.issues]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  if (recent.length === 0) {
    elements.activityList.append(emptyMessage(t("noRecentActivity")));
    return;
  }

  recent.forEach((issue) => {
    const row = document.createElement("div");
    row.className = "activity";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(translateIssueTitle(issue))}</strong>
        <span>${escapeHtml(translateBranch(issue.branch_name))} - ${relativeDate(issue.updated_at)}</span>
      </div>
    `;
    elements.activityList.append(row);
  });
}

async function submitIssue(event) {
  event.preventDefault();

  if (!getStoredMemberToken()) {
    elements.reportDialog.close();
    openDialog(elements.verifyDialog);
    updatePhotoStatus("error", t("verifyBeforePosting"));
    return;
  }

  const form = new FormData(elements.issueForm);
  if (turnstileRequired && !turnstileEnabled()) {
    alert(t("botCheckMisconfigured"));
    return;
  }

  const turnstileToken = await getTurnstileToken().catch(() => "");
  if (turnstileEnabled() && !turnstileToken) {
    alert(t("botCheckFailed"));
    return;
  }

  const payload = {
    title: form.get("title"),
    body: form.get("body"),
    branch_id: form.get("branch_id"),
    category: form.get("category"),
    staff_name: form.get("staff_name"),
    staff_role: form.get("staff_role"),
    is_anonymous: form.get("is_anonymous") === "on",
    display_name: form.get("display_name"),
    turnstile_token: turnstileToken
  };

  const response = await fetch("/api/issues", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-member-token": getStoredMemberToken(),
      "x-locale": state.locale
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const data = await safeJson(response);
    if (response.status === 401) {
      clearStoredVerification();
      elements.reportDialog.close();
      openDialog(elements.verifyDialog);
      updatePhotoStatus("error", data.message || t("verifyBeforePosting"));
      return;
    }
    alert(data.message || t("botCheckFailed"));
    return;
  }

  elements.issueForm.reset();
  elements.issueForm.is_anonymous.checked = true;
  toggleDisplayName();
  elements.reportDialog.close();
  await refreshDashboard();
}

async function vote(event) {
  const button = event.currentTarget;
  const originalText = button.textContent;

  if (!getStoredMemberToken()) {
    openDialog(elements.verifyDialog);
    updatePhotoStatus("error", t("verifyBeforePosting"));
    return;
  }

  button.disabled = true;
  button.textContent = t("counted");

  if (turnstileRequired && !turnstileEnabled()) {
    button.disabled = false;
    button.textContent = originalText;
    alert(t("botCheckMisconfigured"));
    return;
  }

  const turnstileToken = await getTurnstileToken().catch(() => "");
  if (turnstileEnabled() && !turnstileToken) {
    button.disabled = false;
    button.textContent = originalText;
    alert(t("botCheckFailed"));
    return;
  }

  const response = await fetch(`/api/issues/${button.dataset.issueId}/vote`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-member-token": getStoredMemberToken(),
      "x-locale": state.locale
    },
    body: JSON.stringify({ turnstile_token: turnstileToken })
  });

  if (!response.ok) {
    const data = await safeJson(response);
    if (response.status === 401) {
      clearStoredVerification();
      openDialog(elements.verifyDialog);
      updatePhotoStatus("error", data.message || t("verifyBeforePosting"));
    }
    if (response.status === 403) {
      alert(data.message || t("botCheckFailed"));
    }
    button.disabled = false;
    button.textContent = originalText;
    return;
  }

  await refreshDashboard();
}

function toggleDisplayName() {
  elements.displayNameField.classList.toggle("hidden", elements.issueForm.is_anonymous.checked);
}

async function submitVerification(event) {
  event.preventDefault();

  if (!elements.verifyPhotoInput.files?.[0]) {
    updatePhotoStatus("error");
    elements.verifyPhotoInput.focus();
    return;
  }

  const submitButton = elements.verifyForm.querySelector("button[type='submit']");
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  elements.verifyForm.classList.add("is-loading");
  submitButton.textContent = t("verificationChecking");
  updatePhotoStatus("neutral", t("verificationChecking"));
  state.verificationChecks = null;
  renderVerificationDetails(state.verificationChecks);

  try {
    const form = new FormData();
    if (turnstileRequired && !turnstileEnabled()) {
      updatePhotoStatus("error", t("botCheckMisconfigured"));
      return;
    }

    const turnstileToken = await getTurnstileToken().catch(() => "");
    if (turnstileEnabled() && !turnstileToken) {
      updatePhotoStatus("error", t("botCheckFailed"));
      return;
    }

    form.set("branch_id", elements.verifyBranch.value);
    form.set("photo", elements.verifyPhotoInput.files[0]);
    form.set("turnstile_token", turnstileToken);

    const response = await fetch("/api/verify-photo", {
      method: "POST",
      headers: { "x-locale": state.locale },
      body: form
    });
    const data = await safeJson(response);

    if (!response.ok || !data.verified) {
      updatePhotoStatus("error", data.message || t("verificationFailed"));
      state.verificationChecks = data.checks || null;
      renderVerificationDetails(state.verificationChecks);
      return;
    }

    localStorage.setItem("memberToken", data.member_token);
    localStorage.setItem("verificationExpiresAt", data.expires_at);
    state.verification = {
      verified: true,
      expires_at: data.expires_at
    };
    updatePhotoStatus("success", t("verificationSuccess"));
    state.verificationChecks = data.checks || null;
    renderVerificationDetails(state.verificationChecks);
  } finally {
    elements.verifyForm.classList.remove("is-loading");
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}

function updatePhotoStatus(tone = "neutral", message = "") {
  const file = elements.verifyPhotoInput.files?.[0];
  elements.photoPickerStatus.classList.toggle("error", tone === "error");
  elements.photoPickerStatus.classList.toggle("success", tone === "success");
  elements.photoPickerStatus.textContent = message || (file
    ? tone === "success"
      ? t("photoReady")
      : `${t("selectedPhoto")} ${file.name}`
    : tone === "error"
      ? t("photoRequired")
    : t("noPhotoSelected"));
}

function renderVerificationDetails(checks) {
  elements.verificationDetails.replaceChildren();
  elements.verificationDetails.classList.toggle("hidden", !checks);
  if (!checks) return;

  const title = document.createElement("strong");
  title.textContent = t("extractedMetadata");

  const list = document.createElement("dl");
  const rows = [
    [t("extractedBranch"), translateBranch(checks.branch)],
    [t("extractedJpeg"), formatImageFormat(checks)],
    [t("extractedExif"), formatCheckStatus(checks.exif_found)],
    [t("extractedTimestamp"), formatCheckStatus(checks.timestamp_found)],
    [t("extractedGps"), formatCheckStatus(checks.gps_found)],
    [t("extractedPhotoTaken"), formatDateTime(checks.photo_taken_at)],
    [t("extractedDistance"), formatMeters(checks.distance_from_branch_meters)],
    [t("extractedMaxDistance"), formatMeters(checks.max_distance_meters)],
    [t("extractedMetadataStatus"), formatMetadataStatus(checks.metadata_status)]
  ];

  rows.forEach(([label, value]) => {
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = value || "-";
    if (value === t("missing") || value === t("notChecked")) {
      detail.className = "muted";
    }
    list.append(term, detail);
  });

  elements.verificationDetails.append(title, list);
}

async function refreshVerificationStatus() {
  const token = getStoredMemberToken();
  if (!token) {
    state.verification = { verified: false, expires_at: null };
    return;
  }

  const response = await fetch("/api/verification/status", {
    headers: {
      "x-member-token": token,
      "x-locale": state.locale
    }
  });
  const data = await safeJson(response);
  state.verification = {
    verified: Boolean(data.verified),
    expires_at: data.expires_at || null
  };

  if (!state.verification.verified) {
    clearStoredVerification();
  }
}

function getStoredMemberToken() {
  return localStorage.getItem("memberToken") || "";
}

function clearStoredVerification() {
  localStorage.removeItem("memberToken");
  localStorage.removeItem("verificationExpiresAt");
  state.verification = { verified: false, expires_at: null };
}

function turnstileEnabled() {
  return Boolean(turnstileSiteKey && !turnstileSiteKey.includes("__"));
}

async function getTurnstileToken() {
  if (!turnstileEnabled()) return "";

  if (state.cachedTurnstileToken && state.cachedTurnstileExpiresAt > Date.now() + 5000) {
    const token = state.cachedTurnstileToken;
    state.cachedTurnstileToken = null;
    state.cachedTurnstileExpiresAt = 0;
    return token;
  }

  if (state.turnstileTokenPromise) {
    try {
      const token = await state.turnstileTokenPromise;
      if (state.cachedTurnstileToken === token) {
        const isFresh = state.cachedTurnstileExpiresAt > Date.now() + 5000;
        state.cachedTurnstileToken = null;
        state.cachedTurnstileExpiresAt = 0;
        if (!isFresh) return requestTurnstileToken();
      }
      return token;
    } finally {
      state.turnstileTokenPromise = null;
    }
  }

  return requestTurnstileToken();
}

function prefetchTurnstileToken() {
  if (!turnstileEnabled() || !elements.verifyPhotoInput.files?.[0]) return;
  if (state.cachedTurnstileToken && state.cachedTurnstileExpiresAt > Date.now() + 5000) return;
  if (state.turnstileTokenPromise) return;

  state.turnstileTokenPromise = requestTurnstileToken()
    .then((token) => {
      state.cachedTurnstileToken = token;
      state.cachedTurnstileExpiresAt = Date.now() + 240000;
      return token;
    })
    .catch((error) => {
      state.turnstileTokenPromise = null;
      throw error;
    });
  state.turnstileTokenPromise.catch(() => {});
}

async function requestTurnstileToken() {
  const turnstile = await waitForTurnstile();
  const widgetId = ensureTurnstileWidget(turnstile);

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      state.pendingTurnstile = null;
      reject(new Error("Turnstile timed out"));
    }, 15000);

    state.pendingTurnstile = {
      resolve: (token) => {
        window.clearTimeout(timeout);
        resolve(token);
      },
      reject: (error) => {
        window.clearTimeout(timeout);
        reject(error);
      }
    };

    turnstile.reset(widgetId);
    turnstile.execute(widgetId);
  });
}

function ensureTurnstileWidget(turnstile) {
  if (state.turnstileWidgetId !== null) return state.turnstileWidgetId;

  state.turnstileWidgetId = turnstile.render(elements.turnstileWidget, {
    sitekey: turnstileSiteKey,
    execution: "execute",
    appearance: "interaction-only",
    callback: (token) => {
      const pending = state.pendingTurnstile;
      state.pendingTurnstile = null;
      pending?.resolve(token);
    },
    "error-callback": () => {
      const pending = state.pendingTurnstile;
      state.pendingTurnstile = null;
      pending?.reject(new Error("Turnstile failed"));
    },
    "expired-callback": () => {
      const pending = state.pendingTurnstile;
      state.pendingTurnstile = null;
      pending?.reject(new Error("Turnstile expired"));
    },
    "timeout-callback": () => {
      const pending = state.pendingTurnstile;
      state.pendingTurnstile = null;
      pending?.reject(new Error("Turnstile timed out"));
    }
  });

  return state.turnstileWidgetId;
}

async function waitForTurnstile() {
  await loadTurnstileScript();
  return window.turnstile;
}

function loadTurnstileScript() {
  if (window.turnstile?.render && window.turnstile?.execute) {
    return Promise.resolve();
  }

  if (state.turnstileLoadPromise) {
    return state.turnstileLoadPromise;
  }

  state.turnstileLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector("script[data-turnstile-api]");
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Turnstile did not load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      if (window.turnstile?.render && window.turnstile?.execute) {
        window.clearInterval(interval);
        resolve(window.turnstile);
        return;
      }

      if (Date.now() - startedAt > 10000) {
        window.clearInterval(interval);
        reject(new Error("Turnstile did not load"));
      }
    }, 50);

    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.turnstileApi = "true";
    script.addEventListener("error", () => {
      window.clearInterval(interval);
      reject(new Error("Turnstile did not load"));
    }, { once: true });
    document.head.append(script);
  });

  return state.turnstileLoadPromise;
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function getJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}

function emptyMessage(text) {
  const node = document.createElement("div");
  node.className = "empty";
  node.textContent = text;
  return node;
}

function relativeDate(value) {
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.max(1, Math.round(diff / 86400000));
  return state.locale === "ur" ? `${days} ${t("daysAgo")}` : `${days}${t("daysAgo")}`;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(state.locale === "ur" ? "ur-PK" : "en-PK", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function formatMeters(value) {
  const meters = Number(value);
  return Number.isFinite(meters) ? `${meters}m` : "-";
}

function formatCheckStatus(value) {
  if (value === true) return t("found");
  if (value === false) return t("missing");
  return t("notChecked");
}

function formatImageFormat(checks) {
  if (checks.supported_image === false || checks.supported_jpeg === false) return t("missing");
  if (checks.format === "jpeg") return "JPEG";
  if (checks.format === "heic") return "HEIC/HEIF";
  if (checks.supported_image === true || checks.supported_jpeg === true) return t("found");
  return t("notChecked");
}

function formatMetadataStatus(status) {
  const statuses = {
    gps_and_timestamp: t("gpsAndTimestamp"),
    unsupported_file: t("unsupportedFile"),
    missing_exif: t("missingExifStatus"),
    missing_timestamp: t("missingTimestampStatus"),
    missing_gps: t("missingGpsStatus"),
    outside_branch: t("outsideBranchStatus"),
    not_checked: t("notChecked")
  };
  return statuses[status] || status || "-";
}

function translateCategory(category) {
  return categoryLabels[state.locale]?.[category] || category || "-";
}

function translateRole(role) {
  return roleLabels[state.locale]?.[role] || role;
}

function translateBranch(branch) {
  return branchLabels[state.locale]?.[branch] || branch;
}

function translateIssueTitle(issue) {
  return translations[state.locale]?.[`${issue.id}_title`] || issue.title;
}

function translateIssueBody(issue) {
  return translations[state.locale]?.[`${issue.id}_body`] || issue.body;
}

function authorLine(issue) {
  const author = Number(issue.is_anonymous) === 0 && issue.display_name
    ? issue.display_name
    : t("anonymousMember");
  return `${t("postedBy")} ${author}`;
}

function t(key) {
  return translations[state.locale]?.[key] || translations.en[key] || key;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[char];
  });
}
