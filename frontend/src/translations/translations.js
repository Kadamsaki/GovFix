export const translations = {
  en: {
    // Top Bar
    initiativeText: "A Smart Municipal Grievance Redressal Initiative",
    helplineText: "Toll-Free Helpline: 1800-11-2026",
    contactSupport: "Helpdesk",
    accessibility: "Accessibility",
    selectLanguage: "Language",

    // Main Navigation
    portalTitle: "GovFix",
    portalSubtitle: "Municipal Grievance Redressal Portal",
    navHome: "Home",
    navAbout: "About GovFix",
    navServices: "Services",
    navHowItWorks: "How It Works",
    navTransparency: "Transparency",
    navCitizenInfo: "Citizen Guide",
    navContact: "Contact",
    btnLogin: "Citizen Login",
    btnRegister: "Register Complaint",

    // Hero Section
    heroBadge: "Digital Civic Redressal Engine",
    heroHeading: "Your City. Your Voice. Our Responsibility.",
    heroSubtext: "Report civic issues, track your complaints and stay informed about every action taken. GovFix makes municipal grievance redressal simpler, faster and more transparent.",
    btnHeroRegister: "Register a Complaint",
    btnHeroTrack: "Track Your Complaint",
    trustIndicator: "One Platform. Transparent Resolution. Accountable Governance.",
    quickTrackPlaceholder: "Enter 10-digit Complaint ID (e.g. GFX-2026-8942)",
    btnQuickTrack: "Track Status",

    // Hero Stats / Visual Dashboard
    dashboardTitle: "Municipal Command & Redressal Center",
    statResolutionRate: "Resolution Rate",
    statAvgSla: "Average Resolution SLA",
    statActiveWards: "Active Municipal Wards",
    statResolvedToday: "Grievances Resolved",
    statLiveStatus: "Real-time AI Redressal Active",

    // Services Section
    servicesTitle: "Report Your Civic Issues",
    servicesSubtitle: "Select a municipal service category to file your grievance directly with the concerned department.",
    btnReportIssue: "Report Issue",
    services: [
      {
        id: "garbage",
        title: "Garbage & Sanitation",
        desc: "Overflowing community dustbins, missed door-to-door garbage collection, irregular street sweeping, and illegal garbage dumping.",
      },
      {
        id: "water",
        title: "Water Supply",
        desc: "Pipeline bursts and leakage, contaminated drinking water, low pressure, irregular water timings, and municipal valve issues.",
      },
      {
        id: "roads",
        title: "Roads & Potholes",
        desc: "Dangerous potholes, broken pavements, road caving, open utility trenches, unauthorized speed breakers, and damaged dividers.",
      },
      {
        id: "streetlights",
        title: "Streetlights",
        desc: "Dark street stretches, non-functional streetlights, blinking fixtures, damaged electric poles, and hazardous exposed wires.",
      },
      {
        id: "drainage",
        title: "Drainage & Sewage",
        desc: "Clogged stormwater drains, overflowing sewage manholes, stagnant drain water causing mosquito hazards, and missing manhole covers.",
      },
    ],

    // How It Works
    howItWorksTitle: "How GovFix Works",
    howItWorksSubtitle: "A transparent 5-step automated workflow ensuring time-bound accountability for every citizen complaint.",
    steps: [
      {
        number: "01",
        title: "Submit Complaint",
        desc: "Citizens submit issue details along with photos and GPS location through the portal, mobile app, or WhatsApp helpline.",
      },
      {
        number: "02",
        title: "AI-Assisted Analysis",
        desc: "AI classifies the grievance category, analyzes urgency level, eliminates duplicates, and identifies the correct municipal ward.",
      },
      {
        number: "03",
        title: "Officer Assignment",
        desc: "Direct auto-assignment to the designated Junior Engineer or Sanitation Inspector with a time-bound SLA resolution clock.",
      },
      {
        number: "04",
        title: "Issue Resolution",
        desc: "Ground teams execute repairs and upload geo-tagged, timestamped before-and-after photographs as resolution proof.",
      },
      {
        number: "05",
        title: "Citizen Confirmation",
        desc: "Citizen inspects the resolution, confirms closure with OTP or rating, or escalates if the civic issue remains unresolved.",
      },
    ],

    // Transparency & Accountability
    transparencyTitle: "Transparency & Municipal Accountability",
    transparencySubtitle: "Empowering citizens with end-to-end visibility, officer accountability, and automated grievance escalation.",
    pillars: [
      {
        title: "Real-Time Tracking",
        desc: "Inspect live grievance progression from initial triage to ground execution with timestamped updates.",
      },
      {
        title: "Defined SLA Deadlines",
        desc: "Every grievance is bound by Citizen Charter timelines (24 to 72 hours based on priority and hazard level).",
      },
      {
        title: "Automated Escalation",
        desc: "Complaints approaching SLA breach automatically escalate to Ward Executive Engineers and Municipal Commissioners.",
      },
      {
        title: "Complete Action History",
        desc: "Tamper-evident audit trail capturing every officer remark, inspection dispatch, and resolution evidence.",
      },
      {
        title: "Responsible Officer Details",
        desc: "Know exactly which municipal engineer is handling your complaint with official ward contact information.",
      },
    ],

    // Sample Timeline
    sampleTimelineBadge: "Live Complaint Tracking Demonstration",
    sampleComplaintNumber: "Complaint ID: GFX-2026-8942",
    sampleCategory: "Roads & Potholes",
    sampleWard: "Ward No. 14 (Shivaji Chowk - Station Road)",
    sampleStatus: "Resolved Successfully",
    sampleOfficer: "Er. Rajesh Sharma (Junior Engineer, PWD)",
    sampleSla: "SLA Standard: 48 Hrs • Resolved in: 26 Hrs",
    timelineEvents: [
      {
        time: "10 Oct, 09:30 AM",
        title: "Complaint Registered",
        detail: "Citizen reported a hazardous pothole near Shivaji Chowk with photo attachment.",
      },
      {
        time: "10 Oct, 09:32 AM",
        title: "AI Triage & Classification",
        detail: "Categorized under PWD Roads. Priority: High (Traffic & Safety Hazard). Ward 14 tagged.",
      },
      {
        time: "10 Oct, 11:15 AM",
        title: "Officer Assigned & Dispatched",
        detail: "Assigned to Ward Junior Engineer Er. Rajesh Sharma. Work order #WO-448 issued to road gang.",
      },
      {
        time: "11 Oct, 08:45 AM",
        title: "Ground Maintenance Completed",
        detail: "Pothole filled with cold mix asphalt and compacted. Timestamped post-repair photo uploaded.",
      },
      {
        time: "11 Oct, 11:30 AM",
        title: "Citizen Confirmed & Closed",
        detail: "Citizen verified ground resolution via SMS link and rated service 5/5 stars.",
      },
    ],

    // Citizen Info & FAQ
    citizenInfoTitle: "Citizen Guide & Help Center",
    citizenInfoSubtitle: "Everything you need to know about registering, tracking, and resolving municipal grievances.",
    noticeHeading: "Official Notice for Citizens",
    noticeBody: "Please do NOT submit sensitive personal information such as Aadhaar numbers, PAN details, bank account numbers, or OTPs in grievance descriptions. Only describe the civic problem and its geographical location.",
    quickLinksTitle: "Quick Access",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "How long does it take for a complaint to be resolved?",
        a: "Depending on the grievance severity, standard Citizen Charter SLAs range from 24 hours for acute issues (e.g. hazardous water contamination or open manholes) to 48-72 hours for routine street repairs.",
      },
      {
        q: "What happens if an officer does not resolve my complaint in time?",
        a: "GovFix features automated escalation. If a ticket exceeds 80% of its SLA without action, alert notifications are triggered directly to the Ward Executive Engineer and Zonal Deputy Commissioner.",
      },
      {
        q: "Can I reopen a complaint if the work is unsatisfactory?",
        a: "Yes. Once an officer marks a ticket as resolved, the citizen receives an SMS/Portal notification with an option to confirm closure or reopen the ticket with a rejection remark within 48 hours.",
      },
      {
        q: "Is there any fee to register a complaint?",
        a: "No. GovFix is a free public civic service platform. No fees or charges are applicable for filing or tracking municipal grievances.",
      },
    ],

    // Footer
    footerDesc: "GovFix is an AI-powered municipal grievance redressal initiative dedicated to transparent, responsive, and accountable local governance for all citizens.",
    quickLinksHeader: "Quick Links",
    servicesHeader: "Citizen Services",
    supportHeader: "Help & Redressal",
    accessibilityHeader: "Accessibility & Policies",
    footerDisclaimer: "GovFix is a hackathon prototype developed to demonstrate an AI-assisted municipal grievance redressal system. It is not an official government portal.",
    copyright: "© 2026 GovFix Initiative. Developed for transparent municipal governance.",
  },

  hi: {
    // Top Bar
    initiativeText: "एक स्मार्ट नगरपालिका जन शिकायत निवारण पहल",
    helplineText: "टोल-फ्री हेल्पलाइन: 1800-11-2026",
    contactSupport: "हेल्पडेस्क",
    accessibility: "सुलभता",
    selectLanguage: "भाषा चुनें",

    // Main Navigation
    portalTitle: "गॉवफिक्स (GovFix)",
    portalSubtitle: "नगरपालिका जन शिकायत निवारण पोर्टल",
    navHome: "मुख्य पृष्ठ",
    navAbout: "गॉवफिक्स के बारे में",
    navServices: "नागरिक सेवाएं",
    navHowItWorks: "कार्यप्रणाली",
    navTransparency: "पारदर्शिता व जवाबदेही",
    navCitizenInfo: "नागरिक संदर्शिका",
    navContact: "संपर्क",
    btnLogin: "नागरिक लॉगिन",
    btnRegister: "शिकायत दर्ज करें",

    // Hero Section
    heroBadge: "डिजिटल जन शिकायत निवारण इंजन",
    heroHeading: "आपका शहर। आपकी आवाज़। हमारी ज़िम्मेदारी।",
    heroSubtext: "नागरिक समस्याओं की शिकायत दर्ज करें, स्थिति ट्रैक करें और की गई हर कार्रवाई की जानकारी प्राप्त करें। गॉवफिक्स नगर निकाय शिकायत निवारण को अधिक सरल, तीव्र और पारदर्शी बनाता है।",
    btnHeroRegister: "शिकायत दर्ज करें",
    btnHeroTrack: "शिकायत ट्रैक करें",
    trustIndicator: "एक मंच। पारदर्शी समाधान। जवाबदेह शासन।",
    quickTrackPlaceholder: "10-अंकीय शिकायत संख्या दर्ज करें (उदा. GFX-2026-8942)",
    btnQuickTrack: "स्थिति जांचें",

    // Hero Stats / Visual Dashboard
    dashboardTitle: "नगरपालिका नियंत्रण व शिकायत समाधान केंद्र",
    statResolutionRate: "निवारण दर",
    statAvgSla: "औसत समाधान समय (SLA)",
    statActiveWards: "सक्रिय नगरपालिका वार्ड",
    statResolvedToday: "कुल निवारित शिकायतें",
    statLiveStatus: "रीयल-टाइम एआई निवारण सक्रिय",

    // Services Section
    servicesTitle: "अपनी नागरिक समस्याएं दर्ज करें",
    servicesSubtitle: "संबंधित विभाग को सीधे अपनी शिकायत प्रेषित करने के लिए सेवा श्रेणी चुनें।",
    btnReportIssue: "शिकायत दर्ज करें",
    services: [
      {
        id: "garbage",
        title: "कचरा व स्वच्छता",
        desc: "कूड़ेदान का भरना, घर-घर कचरा संग्रहण न होना, सड़कों पर झाड़ू न लगना अथवा अनधिकृत कचरा डंपिंग।",
      },
      {
        id: "water",
        title: "जल आपूर्ति",
        desc: "पाइपलाइन लीकेज व टूटना, दूषित पेयजल, कम दबाव, अनियमित जलापूर्ति अथवा वाल्व खराबी।",
      },
      {
        id: "roads",
        title: "सड़कें व गड्ढे",
        desc: "खतरनाक गड्ढे, टूटे फुटपाथ, सड़क धंसना, खुले सीवर गड्ढे, अनधिकृत स्पीड ब्रेकर व क्षतिग्रस्त डिवाइडर।",
      },
      {
        id: "streetlights",
        title: "स्ट्रीट लाइट",
        desc: "बंद स्ट्रीट लाइटें, टिमटिमाते बल्ब, टूटे बिजली के खंभे तथा दुर्घटना की आशंका वाले खुले तार।",
      },
      {
        id: "drainage",
        title: "जल निकासी व सीवरेज",
        desc: "जाम नालियां, उफनते सीवर मैनहोल, गंदे पानी का भराव तथा खुले व गायब मैनहोल ढक्कन।",
      },
    ],

    // How It Works
    howItWorksTitle: "गॉवफिक्स कैसे काम करता है?",
    howItWorksSubtitle: "प्रत्येक नागरिक शिकायत के समयबद्ध समाधान के लिए 5-चरणीय स्वचालित पारदर्शी व्यवस्था।",
    steps: [
      {
        number: "01",
        title: "शिकायत दर्ज करें",
        desc: "नागरिक पोर्टल, मोबाइल ऐप अथवा व्हाट्सएप हेल्पलाइन के जरिए फोटो व जीपीएस लोकेशन के साथ विवरण दर्ज करते हैं।",
      },
      {
        number: "02",
        title: "एआई-सहायता प्राप्त विश्लेषण",
        desc: "आर्टिफिशियल इंटेलिजेंस शिकायत की श्रेणी, गंभीरता का स्तर, वार्ड मैपिंग व डुप्लीकेट शिकायतों का तुरंत विश्लेषण करता है।",
      },
      {
        number: "03",
        title: "अधिकारी समीक्षा व कार्यभार",
        desc: "संबंधित वार्ड कनिष्ठ अभियंता अथवा स्वच्छता निरीक्षक को निश्चित समय-सीमा (SLA) के साथ स्वतः कार्य आवंटित होता है।",
      },
      {
        number: "04",
        title: "समस्या समाधान",
        desc: "फील्ड टीम मौके पर मरम्मत करती है तथा समाधान के प्रमाण स्वरूप जियो-टैग व टाइमस्टैम्प युक्त तस्वीरें अपलोड करती है।",
      },
      {
        number: "05",
        title: "नागरिक पुष्टि",
        desc: "नागरिक कार्य का सत्यापन करते हैं, ओटीपी/रेटिंग से संतुष्टि की पुष्टि करते हैं अथवा असंतोष होने पर दोबारा खोल सकते हैं।",
      },
    ],

    // Transparency & Accountability
    transparencyTitle: "पारदर्शिता व जवाबदेही",
    transparencySubtitle: "नागरिकों को लाइव ट्रैकिंग, अधिकारी जवाबदेही और स्वतः शिकायत एस्केलेशन की सुविधा।",
    pillars: [
      {
        title: "रीयल-टाइम ट्रैकिंग",
        desc: "शिकायत दर्ज होने से लेकर धरातल पर समाधान होने तक हर चरण का लाइव अपडेट देखें।",
      },
      {
        title: "समयबद्ध समाधान (SLA)",
        desc: "नागरिक चार्टर के तहत प्रत्येक शिकायत के लिए 24 से 72 घंटे की निश्चित समय-सीमा निर्धारित है।",
      },
      {
        title: "स्वचालित एस्केलेशन",
        desc: "समय-सीमा में कार्य न होने पर शिकायत स्वतः उच्चाधिकारियों एवं नगर आयुक्त को प्रेषित हो जाती है।",
      },
      {
        title: "पूर्ण कार्रवाई इतिहास",
        desc: "अधिकारी की टिप्पणी, निरीक्षण समय और मरम्मत प्रमाण के साथ सुरक्षित ऑडिट ट्रेल।",
      },
      {
        title: "जिम्मेदार अधिकारी का विवरण",
        desc: "शिकायत पर कार्य कर रहे संबंधित नगरपालिका अभियंता का नाम व पदनाम पारदर्शी रूप से उपलब्ध।",
      },
    ],

    // Sample Timeline
    sampleTimelineBadge: "लाइव शिकायत निवारण उदाहरण",
    sampleComplaintNumber: "शिकायत संख्या: GFX-2026-8942",
    sampleCategory: "सड़कें व गड्ढे",
    sampleWard: "वार्ड क्र. 14 (शिवाजी चौक - स्टेशन रोड)",
    sampleStatus: "सफलतापूर्वक समाधानित",
    sampleOfficer: "इंजी. राजेश शर्मा (कनिष्ठ अभियंता, लोक निर्माण विभाग)",
    sampleSla: "निर्धारित समय: 48 घंटे • समाधान समय: 26 घंटे",
    timelineEvents: [
      {
        time: "10 अक्टू, 09:30 AM",
        title: "शिकायत दर्ज हुई",
        detail: "नागरिक ने शिवाजी चौक के पास गहरे गड्ढे की फोटो सहित शिकायत दर्ज कराई।",
      },
      {
        time: "10 अक्टू, 09:32 AM",
        title: "एआई वर्गीकरण व विश्लेषण",
        detail: "पीडब्ल्यूडी रोड श्रेणी में वर्गीकृत। प्राथमिकता: उच्च (सुरक्षा जोखिम)। वार्ड 14 संबद्ध।",
      },
      {
        time: "10 अक्टू, 11:15 AM",
        title: "अधिकारी को कार्यभार सौंपा गया",
        detail: "वार्ड अभियंता इंजी. राजेश शर्मा को कार्य आवंटित। फील्ड टीम को मरम्मत आदेश जारी।",
      },
      {
        time: "11 अक्टू, 08:45 AM",
        title: "सड़क मरम्मत कार्य पूर्ण",
        detail: "डामर पैचवर्क पूरा हुआ। मरम्मत के बाद की जियो-टैग फोटो पोर्टल पर अपलोड की गई।",
      },
      {
        time: "11 अक्टू, 11:30 AM",
        title: "नागरिक सत्यापन व समाप्ति",
        detail: "नागरिक ने कार्य से संतुष्ट होकर एसएमएस लिंक के जरिए 5/5 स्टार रेटिंग दी।",
      },
    ],

    // Citizen Info & FAQ
    citizenInfoTitle: "नागरिक संदर्शिका एवं सहायता केंद्र",
    citizenInfoSubtitle: "शिकायत दर्ज करने, ट्रैक करने एवं नगर सेवाओं के बारे में महत्वपूर्ण दिशा-निर्देश।",
    noticeHeading: "नागरिकों हेतु महत्वपूर्ण सूचना",
    noticeBody: "कृपया शिकायत विवरण में आधार संख्या, पैन, बैंक खाता विवरण अथवा पासवर्ड जैसी संवेदनशील निजी जानकारी कदापि दर्ज न करें। केवल समस्या और उसके स्थान का विवरण दें।",
    quickLinksTitle: "त्वरित लिंक्स",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
    faqs: [
      {
        q: "शिकायत के समाधान में कितना समय लगता है?",
        a: "गंभीरता के आधार पर, आपातकालीन समस्याओं (जैसे दूषित जल या खुले मैनहोल) का निवारण 24 घंटे में तथा नियमित मरम्मत का समाधान 48-72 घंटे में किया जाता है।",
      },
      {
        q: "यदि समय-सीमा में समाधान न हो तो क्या होगा?",
        a: "गॉवफिक्स में स्वतः एस्केलेशन प्रणाली है। समय-सीमा समाप्त होने से पहले ही अधिशाषी अभियंता एवं जोनल उपायुक्त को चेतावनी अलर्ट भेजा जाता है।",
      },
      {
        q: "यदि कार्य से संतुष्टि न हो तो क्या शिकायत दोबारा खोली जा सकती है?",
        a: "हाँ। कार्य पूर्ण होने पर नागरिक को सूचना मिलती है। यदि कार्य संतोषजनक न हो तो नागरिक 48 घंटे के भीतर शिकायत दोबारा खोल सकते हैं।",
      },
      {
        q: "क्या शिकायत दर्ज करने का कोई शुल्क है?",
        a: "नहीं। गॉवफिक्स एक पूर्णतः निःशुल्क जन सेवा मंच है। इसके लिए कोई शुल्क नहीं लिया जाता।",
      },
    ],

    // Footer
    footerDesc: "गॉवफिक्स नागरिकों के लिए पारदर्शी, त्वरित और जवाबदेह स्थानीय शासन सुनिश्चित करने वाली एआई-संचालित नगरपालिका जन शिकायत निवारण पहल है।",
    quickLinksHeader: "त्वरित लिंक",
    servicesHeader: "नागरिक सेवाएं",
    supportHeader: "सहायता एवं निवारण",
    accessibilityHeader: "सुलभता एवं नीतियां",
    footerDisclaimer: "गॉवफिक्स एक हैकाथॉन प्रोटोटाइप है जिसे एआई-सहायता प्राप्त नगरपालिका शिकायत निवारण प्रणाली प्रदर्शित करने हेतु बनाया गया है। यह कोई आधिकारिक सरकारी पोर्टल नहीं है।",
    copyright: "© 2026 गॉवफिक्स पहल। पारदर्शी नगरपालिका शासन हेतु विकसित।",
  },

  mr: {
    // Top Bar
    initiativeText: "एक स्मार्ट महानगरपालिका जन तक्रार निवारण उपक्रम",
    helplineText: "टोल-फ्री हेल्पलाइन: 1800-11-2026",
    contactSupport: "मदत कक्ष",
    accessibility: "सुलभता",
    selectLanguage: "भाषा निवडा",

    // Main Navigation
    portalTitle: "गॉव्हफिक्स (GovFix)",
    portalSubtitle: "महानगरपालिका जन तक्रार निवारण पोर्टल",
    navHome: "मुख्य पृष्ठ",
    navAbout: "गॉव्हफिक्स बद्दल",
    navServices: "नागरी सेवा",
    navHowItWorks: "कार्यपद्धती",
    navTransparency: "पारदर्शकता व उत्तरदायित्व",
    navCitizenInfo: "नागरिक मार्गदर्शिका",
    navContact: "संपर्क",
    btnLogin: "नागरिक लॉगिन",
    btnRegister: "तक्रार नोंदवा",

    // Hero Section
    heroBadge: "डिजिटल नागरी तक्रार निवारण इंजिन",
    heroHeading: "तुमचे शहर. तुमचा आवाज. आमची जबाबदारी.",
    heroSubtext: "नागरी समस्यांची तक्रार नोंदवा, तक्रारीचा मागोवा घ्या आणि केलेल्या प्रत्येक कारवाईची माहिती मिळवा. गॉव्हफिक्स महानगरपालिकेचे तक्रार निवारण अधिक सोपे, जलद आणि पारदर्शक बनवते.",
    btnHeroRegister: "तक्रार नोंदवा",
    btnHeroTrack: "तक्रार तपासा",
    trustIndicator: "एक व्यासपीठ. पारदर्शक निवारण. उत्तरदायी प्रशासन.",
    quickTrackPlaceholder: "10-अंकी तक्रार क्रमांक टाका (उदा. GFX-2026-8942)",
    btnQuickTrack: "स्थिती तपासा",

    // Hero Stats / Visual Dashboard
    dashboardTitle: "महानगरपालिका नियंत्रण व तक्रार निवारण केंद्र",
    statResolutionRate: "निवारण प्रमाण",
    statAvgSla: "सरासरी निवारण वेळ (SLA)",
    statActiveWards: "सक्रिय प्रभाग (वॉर्ड)",
    statResolvedToday: "एकूण निवारित तक्रारी",
    statLiveStatus: "थेट एआय निवारण यंत्रणा सुरू",

    // Services Section
    servicesTitle: "तुमच्या नागरी समस्यांची तक्रार करा",
    servicesSubtitle: "संबंधित विभागाकडे थेट तक्रार नोंदवण्यासाठी खालील सेवा श्रेणी निवडा.",
    btnReportIssue: "तक्रार नोंदवा",
    services: [
      {
        id: "garbage",
        title: "कचरा आणि स्वच्छता",
        desc: "भरलेले कचराकुंडी, दरोदारी कचरा संकलन न होणे, रस्त्यांची नियमित साफसफाई नसणे आणि अनधिकृत कचरा टाकणे.",
      },
      {
        id: "water",
        title: "पाणी पुरवठा",
        desc: "जलवाहिनी गळती व फुटणे, दूषित पिण्याचे पाणी, कमी दाबाने पाणी येणे, अनियमित वेळा आणि व्हॉल्व्हमधील दोष.",
      },
      {
        id: "roads",
        title: "रस्ते आणि खड्डे",
        desc: "धोकादायक खड्डे, फुटपाथची दुरवस्था, रस्ता खचणे, उघडी गटारे, अनधिकृत गतिरोधक आणि तुटलेले दुभाजक.",
      },
      {
        id: "streetlights",
        title: "पथदिवे",
        desc: "बंद पथदिवे, चमकणारे दिवे, तुटलेले विजेचे खांब आणि अपघाताची शक्यता असलेल्या उघड्या विद्युत तारा.",
      },
      {
        id: "drainage",
        title: "गटारे आणि सांडपाणी",
        desc: "तुंबलेली गटारे, उथळणारे मलनिस्सारण मॅनहोल, साचलेले दूषित पाणी आणि मॅनहोलची गायब किंवा तुटलेली झाकणे.",
      },
    ],

    // How It Works
    howItWorksTitle: "गॉव्हफिक्स कसे कार्य करते?",
    howItWorksSubtitle: "प्रत्येक नागरी तक्रारीचे वेळेत निवारण सुनिश्चित करणारी ५-टप्प्यांची पारदर्शक स्वयंचलित प्रणाली.",
    steps: [
      {
        number: "01",
        title: "तक्रार नोंदवा",
        desc: "नागरिक पोर्टल, मोबाईल ॲप किंवा व्हॉट्सॲप हेल्पलाइनद्वारे फोटो व जीपीएस स्थानासह तक्रार नोंदवतात.",
      },
      {
        number: "02",
        title: "एआय-सहाय्यित विश्लेषण",
        desc: "आर्टिफिशियल इंटेलिजन्स तक्रारीची श्रेणी, तातडीची पातळी, प्रभाग मॅपिंग आणि डुप्लिकेट तक्रारींचे तात्काळ विश्लेषण करते.",
      },
      {
        number: "03",
        title: "अधिकारी पुनरावलोकन व जबाबदारी",
        desc: "संबंधित प्रभाग कनिष्ठ अभियंता किंवा स्वच्छता निरीक्षकाकडे कालमर्यादेसह (SLA) जबाबदारी सोपवली जाते.",
      },
      {
        number: "04",
        title: "समस्या निवारण",
        desc: "क्षेत्रीय पथक प्रत्यक्ष काम पूर्ण करते आणि निवारणाचा पुरावा म्हणून जिओ-टॅग केलेले छायाचित्र अपलोड करते.",
      },
      {
        number: "05",
        title: "नागरिकांची पडताळणी",
        desc: "नागरिक कामाची प्रत्यक्ष पाहणी करतात, ओटीपी/रेटिंगद्वारे पुष्टी देतात किंवा असमाधानी असल्यास तक्रार पुन्हा उघडू शकतात.",
      },
    ],

    // Transparency & Accountability
    transparencyTitle: "पारदर्शकता आणि उत्तरदायित्व",
    transparencySubtitle: "नागरिकांना थेट ट्रॅकिंग, अधिकारी उत्तरदायित्व आणि स्वयंचलित तक्रार एस्केलेशनची सुविधा.",
    pillars: [
      {
        title: "थेट ट्रॅकिंग (Live Tracking)",
        desc: "तक्रार दाखल झाल्यापासून प्रत्यक्ष कामापर्यंत प्रत्येक टप्प्याची माहिती वेळेसह पहा.",
      },
      {
        title: "निश्चित कालमर्यादा (SLA)",
        desc: "नागरी सनदेनुसार तक्रारीच्या स्वरूपानुसार २४ ते ७२ तासांची निश्चित कालमर्यादा ठरवली जाते.",
      },
      {
        title: "स्वयंचलित एस्केलेशन",
        desc: "वेळेत काम न झाल्यास तक्रार आपोआप कार्यकारी अभियंता आणि अतिरिक्त आयुक्तांकडे वर्ग केली जाते.",
      },
      {
        title: "संपूर्ण कारवाईचा इतिहास",
        desc: "अधिकाऱ्यांच्या नोंदी, प्रत्यक्ष तपासणी आणि कामाच्या पुराव्यांसह सुरक्षित ऑडिट ट्रेल.",
      },
      {
        title: "जबाबदार अधिकाऱ्यांचा तपशील",
        desc: "आपल्या तक्रारीवर काम करणाऱ्या संबंधित मनपा अभियंत्याचे नाव व संपर्क पारदर्शकपणे उपलब्ध.",
      },
    ],

    // Sample Timeline
    sampleTimelineBadge: "थेट तक्रार निवारण प्रात्यक्षिक",
    sampleComplaintNumber: "तक्रार क्रमांक: GFX-2026-8942",
    sampleCategory: "रस्ते आणि खड्डे",
    sampleWard: "प्रभाग क्र. १४ (शिवाजी चौक - स्टेशन रोड)",
    sampleStatus: "यशस्वीरित्या निवारण झाले",
    sampleOfficer: "इंजी. राजेश शर्मा (कनिष्ठ अभियंता, बांधकाम विभाग)",
    sampleSla: "निश्चित मुदत: ४८ तास • निवारण वेळ: २६ तास",
    timelineEvents: [
      {
        time: "१० ऑक्टो, ०९:३० AM",
        title: "तक्रार नोंदवली गेली",
        detail: "नागरिकाने शिवाजी चौकाजवळील मोठ्या खड्ड्याची छायाचित्रासह तक्रार नोंदवली.",
      },
      {
        time: "१० ऑक्टो, ०९:३२ AM",
        title: "एआय वर्गीकरण व विश्लेषण",
        detail: "रस्ते विभाग श्रेणीत वर्गीकरण. प्राधान्य: उच्च (अपघात धोका). प्रभाग १४ टॅग केला.",
      },
      {
        time: "१० ऑक्टो, ११:१५ AM",
        title: "अधिकाऱ्याकडे काम सोपवले",
        detail: "प्रभाग अभियंता इंजी. राजेश शर्मा यांच्याकडे काम वर्ग. रस्ता दुरुस्ती पथकाला कामाचे आदेश जारी.",
      },
      {
        time: "११ ऑक्टो, ०८:४५ AM",
        title: "रस्ता दुरुस्ती काम पूर्ण",
        detail: "डांबरीकरण पूर्ण झाले. कामाची जिओ-टॅग केलेली छायाचित्रे पोर्टलवर अपलोड करण्यात आली.",
      },
      {
        time: "११ ऑक्टो, ११:३० AM",
        title: "नागरिकांची पडताळणी व पूर्तता",
        detail: "नागरिकाने कामाची खात्री करून एसएमएस लिंकद्वारे ५/५ स्टार रेटिंग देऊन तक्रार बंद केली.",
      },
    ],

    // Citizen Info & FAQ
    citizenInfoTitle: "नागरिक मार्गदर्शिका आणि मदत केंद्र",
    citizenInfoSubtitle: "तक्रार नोंदवणे, मागोवा घेणे आणि नागरी सुविधांविषयी महत्त्वाच्या सूचना.",
    noticeHeading: "नागरिकांसाठी महत्त्वाची सूचना",
    noticeBody: "कृपया तक्रार नोंदीमध्ये आधार क्रमांक, पॅन कार्ड, बँक खात्याचा तपशील किंवा पासवर्ड यांसारखी कोणतीही संवेदनशील वैयक्तिक माहिती टाकू नये. केवळ नागरी समस्या आणि ठिकाणाचा उल्लेख करावा.",
    quickLinksTitle: "महत्त्वाचे दुवे",
    faqTitle: "वारंवार विचारले जाणारे प्रश्न (FAQ)",
    faqs: [
      {
        q: "तक्रार निवारणासाठी किती वेळ लागतो?",
        a: "समस्येच्या तीव्रतेनुसार, आपत्कालीन तक्रारींचे (उदा. दूषित पाणी किंवा उघडी मॅनहोल) निवारण २४ तासांत आणि नियमित दुरुस्ती ४८ ते ७२ तासांत केली जाते.",
      },
      {
        q: "मुदतीत तक्रार निवारण न झाल्यास काय होते?",
        a: "गॉव्हफिक्समध्ये स्वयंचलित एस्केलेशन आहे. मुदत संपण्यापूर्वीच कार्यकारी अभियंता आणि परिमंडळ उपायुक्तांना सतर्कतेचा संदेश जातो.",
      },
      {
        q: "काम समाधानकारक नसल्यास तक्रार पुन्हा उघडता येते का?",
        a: "होय. काम पूर्ण झाल्यावर नागरिकांना संदेश येतो. समाधान न झाल्यास ४८ तासांच्या आत तक्रार पुन्हा उघडण्याची सुविधा आहे.",
      },
      {
        q: "तक्रार नोंदवण्यासाठी काही शुल्क आहे का?",
        a: "नाही. गॉव्हफिक्स हे पूर्णपणे मोफत सार्वजनिक नागरी सेवा पोर्टल आहे. यासाठी कोणतेही शुल्क आकारले जात नाही.",
      },
    ],

    // Footer
    footerDesc: "गॉव्हफिक्स हा नागरिकांसाठी पारदर्शक, गतिमान आणि उत्तरदायी स्थानिक स्वराज्य प्रशासन सुनिश्चित करणारा एआय-आधारित नागरी तक्रार निवारण उपक्रम आहे.",
    quickLinksHeader: "महत्त्वाचे दुवे",
    servicesHeader: "नागरी सेवा",
    supportHeader: "मदत व निवारण",
    accessibilityHeader: "सुलभता आणि धोरणे",
    footerDisclaimer: "गॉव्हफिक्स हा एक हॅकाथॉन प्रोटोटाइप आहे, जो एआय-आधारित नागरी तक्रार निवारण प्रणालीचे प्रात्यक्षिक दाखवण्यासाठी विकसित केला गेला आहे. हे अधिकृत सरकारी पोर्टल नाही.",
    copyright: "© २०२६ गॉव्हफिक्स उपक्रम. पारदर्शक महानगरपालिका प्रशासनासाठी विकसित.",
  },
};
