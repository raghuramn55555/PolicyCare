import fs from 'fs';

const schemes = [
    {
        id: "scheme_pmay", type: "government_scheme", category: "Housing & Welfare",
        name: { en: "Pradhan Mantri Awas Yojana (PMAY)", te: "ప్రధాన మంత్రి ఆవాస్ యోజన", hi: "प्रधानमंत्री आवास योजना" },
        description: { en: "Affordable housing for urban and rural poor under 'Housing for All' mission. Provides interest subsidy on home loans up to ₹2.67 lakh.", te: "పట్టణ మరియు గ్రామీణ పేదలకు అందుబాటు ధరల్లో గృహ నిర్మాణం.", hi: "शहरी और ग्रामीण गरीबों के लिए सस्ती आवास योजना." },
        benefits: { en: "Interest subsidy up to ₹2.67 lakh on home loans. Houses with basic amenities including water, sanitation, and electricity.", te: "గృహ రుణాలపై ₹2.67 లక్షల వడ్డీ సబ్సిడీ.", hi: "होम लोन पर ₹2.67 लाख तक ब्याज सब्सिडी." },
        eligibility: { en: "EWS/LIG/MIG families. Annual income below ₹18 lakh. Must not own a pucca house.", te: "EWS/LIG/MIG కుటుంబాలు. వార్షిక ఆదాయం ₹18 లక్షల లోపు.", hi: "EWS/LIG/MIG परिवार। वार्षिक आय ₹18 लाख से कम।" },
        how_to_apply: { en: "Apply through CSC centres or pmayg.nic.in portal.", te: "CSC కేంద్రాల ద్వారా దరఖాస్తు చేయండి.", hi: "CSC केंद्रों के माध्यम से आवेदन करें।" },
        minAge: 18, maxAge: 70, maxIncome: 1800000,
        official_source: "https://pmaymis.gov.in", video: "/videos/en/pmay.mp4"
    },
    {
        id: "scheme_pmjay", type: "government_scheme", category: "Health",
        name: { en: "Ayushman Bharat (PM-JAY)", te: "ఆయుష్మాన్ భారత్", hi: "आयुष्मान भारत" },
        description: { en: "World's largest health insurance scheme providing ₹5 lakh coverage per family per year for secondary and tertiary hospitalisation.", te: "కుటుంబానికి సంవత్సరానికి ₹5 లక్షల ఆరోగ్య బీమా.", hi: "प्रति परिवार प्रति वर्ष ₹5 लाख स्वास्थ्य बीमा।" },
        benefits: { en: "Cashless treatment at empanelled hospitals. Covers pre & post hospitalisation expenses. No cap on family size.", te: "ప్యానెల్ చేయబడిన ఆసుపత్రులలో క్యాష్‌లెస్ చికిత్స.", hi: "सूचीबद्ध अस्पतालों में कैशलेस इलाज।" },
        eligibility: { en: "BPL families identified via SECC database. No age limit. Automatic enrolment for eligible families.", te: "SECC డేటా ద్వారా గుర్తించిన BPL కుటుంబాలు.", hi: "SECC डेटा के माध्यम से पहचाने गए BPL परिवार।" },
        how_to_apply: { en: "Visit nearest Ayushman Bharat Kendra or empanelled hospital with Aadhaar card.", te: "సమీపంలోని ఆయుష్మాన్ భారత్ కేంద్రాన్ని సందర్శించండి.", hi: "निकटतम आयुष्मान भारत केंद्र जाएं।" },
        minAge: 0, maxAge: 100, maxIncome: 250000,
        official_source: "https://pmjay.gov.in", video: "/videos/en/pmjay.mp4"
    },
    {
        id: "scheme_pmkisan", type: "government_scheme", category: "Agriculture",
        name: { en: "PM Kisan Samman Nidhi", te: "పీఎం కిసాన్ సమ్మాన్ నిధి", hi: "पीएम किसान सम्मान निधि" },
        description: { en: "Direct income support of ₹6,000 per year to small and marginal farmer families, paid in 3 equal instalments.", te: "చిన్న మరియు సన్నకారు రైతు కుటుంబాలకు సంవత్సరానికి ₹6,000 ప్రత్యక్ష ఆదాయ మద్దతు.", hi: "छोटे किसान परिवारों को ₹6,000 प्रति वर्ष सीधी आय सहायता।" },
        benefits: { en: "₹6,000/year in 3 instalments of ₹2,000 directly to bank account via DBT.", te: "DBT ద్వారా బ్యాంక్ ఖాతాకు నేరుగా ₹2,000 చొప్పున 3 వాయిదాల్లో.", hi: "DBT के माध्यम से बैंक खाते में सीधे ₹2,000 की 3 किस्तें।" },
        eligibility: { en: "All farmer families with cultivable land. Excludes institutional landholders and government employees.", te: "సాగు భూమి ఉన్న అన్ని రైతు కుటుంబాలు.", hi: "कृषि योग्य भूमि वाले सभी किसान परिवार।" },
        how_to_apply: { en: "Register at pmkisan.gov.in or through local Common Service Centre.", te: "pmkisan.gov.in లో నమోదు చేసుకోండి.", hi: "pmkisan.gov.in पर पंजीकरण करें।" },
        minAge: 18, maxAge: 100, occupation: "Farmer",
        official_source: "https://pmkisan.gov.in", video: "/videos/en/pmkisan.mp4"
    },
    {
        id: "scheme_mgnrega", type: "government_scheme", category: "Employment",
        name: { en: "MGNREGA", te: "మహాత్మా గాంధీ నరేగా", hi: "मनरेगा" },
        description: { en: "Guarantees 100 days of wage employment per year to rural households willing to do unskilled manual work.", te: "గ్రామీణ కుటుంబాలకు సంవత్సరానికి 100 రోజుల వేతన ఉపాధి హామీ.", hi: "ग्रामीण परिवारों को प्रति वर्ष 100 दिन मजदूरी रोजगार की गारंटी।" },
        benefits: { en: "100 days guaranteed employment. Daily wage of ₹267-₹333 (varies by state). Unemployment allowance if work not provided within 15 days.", te: "100 రోజుల హామీ ఉపాధి. రోజు వేతనం ₹267-₹333.", hi: "100 दिन गारंटी रोजगार। दैनिक मजदूरी ₹267-₹333।" },
        eligibility: { en: "Any adult member of a rural household willing to do unskilled manual work.", te: "అన్‌స్కిల్డ్ చేతి పనికి సిద్ధంగా ఉన్న గ్రామీణ కుటుంబ సభ్యులు.", hi: "अकुशल शारीरिक कार्य करने को तैयार ग्रामीण परिवार के वयस्क सदस्य।" },
        how_to_apply: { en: "Apply at Gram Panchayat or Block office with photograph and Aadhaar.", te: "ఫోటో మరియు ఆధార్‌తో గ్రామ పంచాయతీలో దరఖాస్తు చేయండి.", hi: "फोटो और आधार के साथ ग्राम पंचायत में आवेदन करें।" },
        minAge: 18, maxAge: 60, maxIncome: 100000,
        official_source: "https://nrega.nic.in", video: "/videos/en/mgnrega.mp4"
    },
    {
        id: "scheme_pmmvy", type: "government_scheme", category: "Women & Child",
        name: { en: "PM Matru Vandana Yojana", te: "పీఎం మాతృ వందన యోజన", hi: "पीएम मातृ वंदना योजना" },
        description: { en: "Cash incentive of ₹5,000 for pregnant and lactating mothers for first living child to improve health and nutrition.", te: "మొదటి బిడ్డకు గర్భిణీ మరియు పాలిచ్చే తల్లులకు ₹5,000 నగదు ప్రోత్సాహకం.", hi: "पहले बच्चे के लिए गर्भवती और स्तनपान कराने वाली माताओं को ₹5,000 नकद प्रोत्साहन।" },
        benefits: { en: "₹5,000 in 3 instalments. Covers partial wage loss compensation and improved nutrition.", te: "3 వాయిదాల్లో ₹5,000. పాక్షిక వేతన నష్ట పరిహారం.", hi: "3 किस्तों में ₹5,000। आंशिक वेतन हानि मुआवजा।" },
        eligibility: { en: "Pregnant women for first living child. Age 19 years and above.", te: "మొదటి బిడ్డకు గర్భిణీ స్త్రీలు. 19 సంవత్సరాలు మరియు అంతకంటే ఎక్కువ.", hi: "पहले बच्चे के लिए गर्भवती महिलाएं। 19 वर्ष और उससे अधिक।" },
        how_to_apply: { en: "Register at Anganwadi Centre or health facility with MCP card.", te: "MCP కార్డ్‌తో అంగన్‌వాడీ కేంద్రంలో నమోదు చేసుకోండి.", hi: "MCP कार्ड के साथ आंगनवाड़ी केंद्र में पंजीकरण करें।" },
        minAge: 19, maxAge: 45, gender: "Female",
        official_source: "https://wcd.nic.in", video: "/videos/en/pmmvy.mp4"
    },
    {
        id: "scheme_pmjjby", type: "government_scheme", category: "Life Insurance",
        name: { en: "PM Jeevan Jyoti Bima Yojana (PMJJBY)", te: "పీఎం జీవన్ జ్యోతి బీమా యోజన", hi: "पीएम जीवन ज्योति बीमा योजना" },
        description: { en: "Government-backed life insurance scheme offering ₹2 lakh coverage at just ₹436/year premium.", te: "కేవలం ₹436/సంవత్సరం ప్రీమియంతో ₹2 లక్షల కవరేజ్ జీవిత బీమా పథకం.", hi: "सिर्फ ₹436/वर्ष प्रीमियम पर ₹2 लाख कवरेज जीवन बीमा योजना।" },
        benefits: { en: "₹2 lakh life cover. Auto-debit from bank account. Renewable annually.", te: "₹2 లక్షల జీవిత కవర్. బ్యాంక్ ఖాతా నుండి ఆటో-డెబిట్.", hi: "₹2 लाख जीवन कवर। बैंक खाते से ऑटो-डेबिट।" },
        eligibility: { en: "Age 18-50 years. Must have a savings bank account with Aadhaar linked.", te: "వయస్సు 18-50 సంవత్సరాలు. ఆధార్ లింక్ చేసిన బ్యాంక్ ఖాతా ఉండాలి.", hi: "आयु 18-50 वर्ष। आधार लिंक बचत खाता होना चाहिए।" },
        how_to_apply: { en: "Enrol through your bank's branch, net banking, or mobile banking app.", te: "మీ బ్యాంక్ శాఖ ద్వారా నమోదు చేసుకోండి.", hi: "अपनी बैंक शाखा के माध्यम से नामांकन करें।" },
        minAge: 18, maxAge: 50, minPremium: 436,
        official_source: "https://jansuraksha.gov.in", video: "/videos/en/pmjjby.mp4"
    },
    {
        id: "scheme_pmsby", type: "government_scheme", category: "Accident Insurance",
        name: { en: "PM Suraksha Bima Yojana (PMSBY)", te: "పీఎం సురక్ష బీమా యోజన", hi: "पीएम सुरक्षा बीमा योजना" },
        description: { en: "Accidental death and disability insurance at ₹20/year. Covers death and permanent disability due to accidents.", te: "₹20/సంవత్సరంలో ప్రమాద మరణం మరియు వైకల్య బీమా.", hi: "₹20/वर्ष में दुर्घटना मृत्यु और विकलांगता बीमा।" },
        benefits: { en: "₹2 lakh for accidental death. ₹1 lakh for partial permanent disability.", te: "ప్రమాద మరణానికి ₹2 లక్షలు. పాక్షిక శాశ్వత వైకల్యానికి ₹1 లక్ష.", hi: "दुर्घटना मृत्यु पर ₹2 लाख। आंशिक स्थायी विकलांगता पर ₹1 लाख।" },
        eligibility: { en: "Age 18-70 years. Must have a bank account.", te: "వయస్సు 18-70 సంవత్సరాలు. బ్యాంక్ ఖాతా ఉండాలి.", hi: "आयु 18-70 वर्ष। बैंक खाता होना चाहिए।" },
        how_to_apply: { en: "Enrol through your bank branch or net banking.", te: "మీ బ్యాంక్ శాఖ ద్వారా నమోదు.", hi: "अपनी बैंक शाखा के माध्यम से नामांकन।" },
        minAge: 18, maxAge: 70, minPremium: 20,
        official_source: "https://jansuraksha.gov.in", video: "/videos/en/pmsby.mp4"
    },
    {
        id: "scheme_apy", type: "government_scheme", category: "Pension",
        name: { en: "Atal Pension Yojana (APY)", te: "అటల్ పెన్షన్ యోజన", hi: "अटल पेंशन योजना" },
        description: { en: "Guaranteed pension of ₹1,000-₹5,000/month after age 60 for unorganised sector workers.", te: "అసంఘటిత రంగ కార్మికులకు 60 ఏళ్ల తర్వాత ₹1,000-₹5,000/నెల గ్యారంటీ పెన్షన్.", hi: "असंगठित क्षेत्र के कामगारों को 60 वर्ष के बाद ₹1,000-₹5,000/माह गारंटी पेंशन।" },
        benefits: { en: "Fixed monthly pension ₹1,000-₹5,000 after 60. Government co-contributes 50% for 5 years.", te: "60 తర్వాత నిర్ణీత నెలవారీ పెన్షన్ ₹1,000-₹5,000.", hi: "60 के बाद निश्चित मासिक पेंशन ₹1,000-₹5,000।" },
        eligibility: { en: "Age 18-40 years. Must have savings bank account. Not an income tax payer.", te: "వయస్సు 18-40 సంవత్సరాలు. పొదుపు బ్యాంక్ ఖాతా ఉండాలి.", hi: "आयु 18-40 वर्ष। बचत बैंक खाता होना चाहिए।" },
        how_to_apply: { en: "Visit bank branch or use net banking to enrol.", te: "బ్యాంక్ శాఖను సందర్శించి నమోదు చేసుకోండి.", hi: "बैंक शाखा जाकर नामांकन करें।" },
        minAge: 18, maxAge: 40, occupation: "Unorganized",
        official_source: "https://npscra.nsdl.co.in", video: "/videos/en/apy.mp4"
    },
    {
        id: "scheme_sukanya", type: "government_scheme", category: "Women & Child",
        name: { en: "Sukanya Samriddhi Yojana", te: "సుకన్య సమృద్ధి యోజన", hi: "सुकन्या समृद्धि योजना" },
        description: { en: "Small savings scheme for the girl child with 8.2% interest rate and tax benefits under Sec 80C.", te: "8.2% వడ్డీ రేటుతో బాలిక కోసం చిన్న పొదుపు పథకం.", hi: "8.2% ब्याज दर के साथ बालिकाओं के लिए लघु बचत योजना।" },
        benefits: { en: "8.2% annual interest. Tax free maturity. Partial withdrawal for education at 18.", te: "8.2% వార్షిక వడ్డీ. పన్ను రహిత మెచ్యూరిటీ.", hi: "8.2% वार्षिक ब्याज। कर-मुक्त परिपक्वता।" },
        eligibility: { en: "Girl child below 10 years of age. Only 2 accounts per family.", te: "10 సంవత్సరాల లోపు బాలిక. కుటుంబానికి 2 ఖాతాలు మాత్రమే.", hi: "10 वर्ष से कम आयु की बालिका। प्रति परिवार केवल 2 खाते।" },
        how_to_apply: { en: "Open account at any post office or authorized bank.", te: "ఏదైనా పోస్ట్ ఆఫీసులో ఖాతా తెరవండి.", hi: "किसी भी पोस्ट ऑफिस में खाता खोलें।" },
        minAge: 0, maxAge: 10, gender: "Female",
        official_source: "https://www.nsiindia.gov.in", video: "/videos/en/sukanya.mp4"
    },
    {
        id: "scheme_mudra", type: "government_scheme", category: "Business & Enterprise",
        name: { en: "PM MUDRA Yojana", te: "పీఎం ముద్ర యోజన", hi: "पीएम मुद्रा योजना" },
        description: { en: "Loans up to ₹10 lakh for non-corporate, non-farm small/micro enterprises. Three categories: Shishu, Kishore, Tarun.", te: "చిన్న/మైక్రో ఎంటర్‌ప్రైజ్‌లకు ₹10 లక్షల వరకు రుణాలు.", hi: "छोटे/सूक्ष्म उद्यमों के लिए ₹10 लाख तक के ऋण।" },
        benefits: { en: "Shishu: up to ₹50K. Kishore: ₹50K-₹5L. Tarun: ₹5L-₹10L. No collateral required.", te: "శిశు: ₹50K వరకు. కిషోర్: ₹50K-₹5L. తరుణ్: ₹5L-₹10L.", hi: "शिशु: ₹50K तक। किशोर: ₹50K-₹5L। तरुण: ₹5L-₹10L।" },
        eligibility: { en: "Any Indian citizen with a business plan for non-farm income generating activity.", te: "వ్యాపార ప్రణాళిక ఉన్న భారతీయ పౌరుడు.", hi: "व्यापार योजना वाला कोई भी भारतीय नागरिक।" },
        how_to_apply: { en: "Apply at any bank, NBFC, or MFI. Online via mudra.org.in.", te: "ఏదైనా బ్యాంక్ లేదా NBFC లో దరఖాస్తు చేయండి.", hi: "किसी भी बैंक या NBFC में आवेदन करें।" },
        minAge: 18, maxAge: 65, occupation: "Business",
        official_source: "https://www.mudra.org.in", video: "/videos/en/mudra.mp4"
    },
    {
        id: "scheme_pmuy", type: "government_scheme", category: "Energy & Welfare",
        name: { en: "PM Ujjwala Yojana", te: "పీఎం ఉజ్జ్వల యోజన", hi: "पीएम उज्ज्वला योजना" },
        description: { en: "Free LPG connections to women from BPL households to replace unclean cooking fuels.", te: "BPL కుటుంబాల మహిళలకు ఉచిత LPG కనెక్షన్లు.", hi: "BPL परिवारों की महिलाओं को मुफ्त LPG कनेक्शन।" },
        benefits: { en: "Free LPG connection and first refill. Financial assistance of ₹1,600 per connection.", te: "ఉచిత LPG కనెక్షన్ మరియు మొదటి రీఫిల్.", hi: "मुफ्त LPG कनेक्शन और पहला रिफिल।" },
        eligibility: { en: "Women from BPL households. Name in SECC-2011 data.", te: "BPL కుటుంబాల నుండి మహిళలు.", hi: "BPL परिवारों की महिलाएं।" },
        how_to_apply: { en: "Apply at nearest LPG distributor with BPL card and Aadhaar.", te: "BPL కార్డ్ మరియు ఆధార్‌తో సమీపంలోని LPG డిస్ట్రిబ్యూటర్ వద్ద దరఖాస్తు.", hi: "BPL कार्ड और आधार के साथ निकटतम LPG वितरक पर आवेदन।" },
        minAge: 18, maxAge: 100, gender: "Female", maxIncome: 200000,
        official_source: "https://www.pmuy.gov.in", video: "/videos/en/pmuy.mp4"
    },
    {
        id: "scheme_scholarship", type: "government_scheme", category: "Education",
        name: { en: "National Scholarship Portal Schemes", te: "జాతీయ స్కాలర్‌షిప్ పోర్టల్ పథకాలు", hi: "राष्ट्रीय छात्रवृत्ति पोर्टल योजनाएं" },
        description: { en: "Central and state scholarships for students from economically weaker sections pursuing higher education.", te: "ఆర్థికంగా బలహీనమైన వర్గాల విద్యార్థులకు కేంద్ర మరియు రాష్ట్ర స్కాలర్‌షిప్‌లు.", hi: "आर्थिक रूप से कमजोर वर्गों के छात्रों के लिए छात्रवृत्तियां।" },
        benefits: { en: "Full or partial tuition fee coverage. Monthly maintenance allowance. Book and study material grant.", te: "పూర్తి లేదా పాక్షిక ట్యూషన్ ఫీజు కవరేజ్.", hi: "पूर्ण या आंशिक ट्यूशन शुल्क कवरेज।" },
        eligibility: { en: "Students from families with annual income below ₹8 lakh. Minimum 50% marks in previous exam.", te: "వార్షిక ఆదాయం ₹8 లక్షల లోపు ఉన్న కుటుంబాల విద్యార్థులు.", hi: "₹8 लाख से कम वार्षिक आय वाले परिवारों के छात्र।" },
        how_to_apply: { en: "Apply online at scholarships.gov.in during open window.", te: "scholarships.gov.in లో ఆన్‌లైన్‌లో దరఖాస్తు చేయండి.", hi: "scholarships.gov.in पर ऑनलाइन आवेदन करें।" },
        minAge: 16, maxAge: 35, occupation: "Student", maxIncome: 800000,
        official_source: "https://scholarships.gov.in", video: "/videos/en/scholarship.mp4"
    },
    {
        id: "scheme_pmvvy", type: "government_scheme", category: "Pension",
        name: { en: "PM Vaya Vandana Yojana (PMVVY)", te: "పీఎం వయ వందన యోజన", hi: "पीएम वय वंदना योजना" },
        description: { en: "Pension scheme for senior citizens providing assured returns of 7.4% per annum for 10 years.", te: "సీనియర్ సిటిజన్ల కోసం 10 సంవత్సరాలకు 7.4% హామీ రిటర్న్స్ పెన్షన్ పథకం.", hi: "वरिष्ठ नागरिकों के लिए 10 वर्षों तक 7.4% गारंटी रिटर्न पेंशन योजना।" },
        benefits: { en: "Guaranteed pension of 7.4% p.a. Loan facility up to 75% of purchase price after 3 years.", te: "7.4% p.a హామీ పెన్షన్.", hi: "7.4% p.a गारंटी पेंशन।" },
        eligibility: { en: "Senior citizens aged 60 years and above. Maximum purchase price ₹15 lakh.", te: "60 సంవత్సరాలు మరియు అంతకంటే ఎక్కువ వయస్సు ఉన్న సీనియర్ సిటిజన్లు.", hi: "60 वर्ष और उससे अधिक आयु के वरिष्ठ नागरिक।" },
        how_to_apply: { en: "Purchase from LIC of India offices or LIC website.", te: "LIC ఆఫీసుల నుండి కొనుగోలు చేయండి.", hi: "LIC कार्यालयों से खरीदें।" },
        minAge: 60, maxAge: 100,
        official_source: "https://licindia.in", video: "/videos/en/pmvvy.mp4"
    },
    {
        id: "scheme_standup", type: "government_scheme", category: "Business & Enterprise",
        name: { en: "Stand-Up India Scheme", te: "స్టాండ్-అప్ ఇండియా పథకం", hi: "स्टैंड-अप इंडिया योजना" },
        description: { en: "Bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs for greenfield enterprises.", te: "SC/ST మరియు మహిళా వ్యవస్థాపకులకు ₹10 లక్షల నుండి ₹1 కోటి వరకు బ్యాంక్ రుణాలు.", hi: "SC/ST और महिला उद्यमियों के लिए ₹10 लाख से ₹1 करोड़ तक बैंक ऋण।" },
        benefits: { en: "Loans ₹10L-₹1Cr. Repayment period up to 7 years. Margin money 25%.", te: "₹10L-₹1Cr. రుణాలు. 7 సంవత్సరాల వరకు తిరిగి చెల్లింపు.", hi: "₹10L-₹1Cr ऋण। 7 वर्षों तक चुकौती अवधि।" },
        eligibility: { en: "SC/ST or Women aged 18+. For new (greenfield) enterprise. Not an existing defaulter.", te: "SC/ST లేదా 18+ వయస్సు ఉన్న మహిళలు.", hi: "SC/ST या 18+ आयु की महिलाएं।" },
        how_to_apply: { en: "Apply at standupmitra.in portal or at any scheduled commercial bank.", te: "standupmitra.in పోర్టల్‌లో దరఖాస్తు చేయండి.", hi: "standupmitra.in पोर्टल पर आवेदन करें।" },
        minAge: 18, maxAge: 65,
        official_source: "https://www.standupmitra.in", video: "/videos/en/standup.mp4"
    },
    {
        id: "scheme_pmsym", type: "government_scheme", category: "Pension",
        name: { en: "PM Shram Yogi Maan-dhan (PM-SYM)", te: "పీఎం శ్రమ్ యోగి మాన్-ధన్", hi: "पीएम श्रम योगी मान-धन" },
        description: { en: "Voluntary pension scheme for unorganised workers assuring ₹3,000/month after age 60.", te: "అసంఘటిత కార్మికులకు 60 ఏళ్ల తర్వాత ₹3,000/నెల హామీ స్వచ్ఛంద పెన్షన్ పథకం.", hi: "असंगठित कामगारों के लिए 60 वर्ष के बाद ₹3,000/माह गारंटी पेंशन योजना।" },
        benefits: { en: "₹3,000/month pension after 60. Government matches employee contribution equally.", te: "60 తర్వాత ₹3,000/నెల పెన్షన్.", hi: "60 के बाद ₹3,000/माह पेंशन।" },
        eligibility: { en: "Unorganised workers aged 18-40. Monthly income below ₹15,000. Not covered under EPFO/ESIC/NPS.", te: "18-40 వయస్సు ఉన్న అసంఘటిత కార్మికులు. నెలవారీ ఆదాయం ₹15,000 లోపు.", hi: "18-40 आयु के असंगठित कामगार। मासिक आय ₹15,000 से कम।" },
        how_to_apply: { en: "Visit nearest Common Service Centre with Aadhaar and savings bank account.", te: "ఆధార్ మరియు పొదుపు బ్యాంక్ ఖాతాతో సమీపంలోని CSC సందర్శించండి.", hi: "आधार और बचत बैंक खाते के साथ निकटतम CSC जाएं।" },
        minAge: 18, maxAge: 40, occupation: "Unorganized", maxIncome: 180000,
        official_source: "https://maandhan.in", video: "/videos/en/pmsym.mp4"
    },
];

const insurancePolicies = [
    {
        id: "policy_term_lic", type: "insurance_policy", provider: "LIC", category: "Term Insurance", policy_type: "Term Insurance",
        name: { en: "LIC Tech Term Plan", te: "LIC టెక్ టర్మ్ ప్లాన్", hi: "LIC टेक टर्म प्लान" },
        description: { en: "Pure online term plan with high cover at low premium. Cover up to ₹50 lakh at just ₹5,000/year.", te: "తక్కువ ప్రీమియంతో అధిక కవర్ కలిగిన ఆన్‌లైన్ టర్మ్ ప్లాన్.", hi: "कम प्रीमियम पर उच्च कवर ऑनलाइन टर्म प्लान।" },
        coverage_summary: { en: "Life cover up to ₹50 lakh. Death benefit paid as lump sum to nominee.", te: "₹50 లక్షల వరకు జీవిత కవర్.", hi: "₹50 लाख तक जीवन कवर।" },
        ideal_for: { en: "Young salaried individuals looking for affordable life cover.", te: "అందుబాటు ధరలో జీవిత కవర్ కావాలనుకునే యువ ఉద్యోగులు.", hi: "किफायती जीवन कवर चाहने वाले युवा वेतनभोगी।" },
        minAge: 18, maxAge: 55, minPremium: 5000, cta: "Get Quote",
        official_source: "https://licindia.in", video: "/videos/en/term_life.mp4"
    },
    {
        id: "policy_health_star", type: "insurance_policy", provider: "Star Health", category: "Health Insurance", policy_type: "Health Insurance",
        name: { en: "Star Family Health Optima", te: "స్టార్ ఫ్యామిలీ హెల్త్ ఆప్టిమా", hi: "स्टार फैमिली हेल्थ ऑप्टिमा" },
        description: { en: "Comprehensive family floater health plan covering hospitalization, day-care, and pre/post expenses.", te: "ఆసుపత్రి, డే-కేర్ మరియు ముందు/తర్వాత ఖర్చులను కవర్ చేసే సమగ్ర కుటుంబ ఫ్లోటర్ హెల్త్ ప్లాన్.", hi: "अस्पताल, डे-केयर और पूर्व/बाद खर्च कवर करने वाला पारिवारिक फ्लोटर स्वास्थ्य प्लान।" },
        coverage_summary: { en: "Sum insured ₹5L-₹1Cr. Cashless at 14,000+ hospitals. No co-pay.", te: "₹5L-₹1Cr బీమా రాశి. 14,000+ ఆసుపత్రులలో క్యాష్‌లెస్.", hi: "₹5L-₹1Cr बीमा राशि। 14,000+ अस्पतालों में कैशलेस।" },
        ideal_for: { en: "Families seeking comprehensive health coverage with no co-pay.", te: "సమగ్ర ఆరోగ్య కవరేజ్ కోరుకునే కుటుంబాలు.", hi: "व्यापक स्वास्थ्य कवरेज चाहने वाले परिवार।" },
        minAge: 18, maxAge: 65, minPremium: 12000, cta: "Check Premium",
        official_source: "https://starhealth.in", video: "/videos/en/health.mp4"
    },
    {
        id: "policy_term_hdfc", type: "insurance_policy", provider: "HDFC Life", category: "Term Insurance", policy_type: "Term Insurance",
        name: { en: "HDFC Click 2 Protect Life", te: "HDFC క్లిక్ 2 ప్రొటెక్ట్ లైఫ్", hi: "HDFC क्लिक 2 प्रोटेक्ट लाइफ" },
        description: { en: "Comprehensive term plan with flexible payout options. Cover up to ₹2 crore.", te: "సరళమైన చెల్లింపు ఆప్షన్లతో సమగ్ర టర్మ్ ప్లాన్. ₹2 కోట్ల వరకు కవర్.", hi: "लचीले भुगतान विकल्पों के साथ व्यापक टर्म प्लान। ₹2 करोड़ तक कवर।" },
        coverage_summary: { en: "Life cover up to ₹2Cr. Critical illness rider. Accidental death benefit.", te: "₹2Cr వరకు జీవిత కవర్. క్రిటికల్ ఇల్‌నెస్ రైడర్.", hi: "₹2Cr तक जीवन कवर। गंभीर बीमारी राइडर।" },
        ideal_for: { en: "Professionals wanting high-value term cover with riders.", te: "రైడర్లతో అధిక-విలువ టర్మ్ కవర్ కావాలనుకునే వృత్తి నిపుణులు.", hi: "राइडर्स के साथ उच्च-मूल्य टर्म कवर चाहने वाले पेशेवर।" },
        minAge: 18, maxAge: 60, minPremium: 8000, cta: "Get Quote",
        official_source: "https://hdfclife.com", video: "/videos/en/term_life.mp4"
    },
    {
        id: "policy_pension_sbi", type: "insurance_policy", provider: "SBI Life", category: "Pension", policy_type: "Pension",
        name: { en: "SBI Life Retire Smart Plan", te: "SBI లైఫ్ రిటైర్ స్మార్ట్ ప్లాన్", hi: "SBI लाइफ रिटायर स्मार्ट प्लान" },
        description: { en: "Unit-linked pension plan with market-linked growth and guaranteed additions.", te: "మార్కెట్-లింక్డ్ వృద్ధితో యూనిట్-లింక్డ్ పెన్షన్ ప్లాన్.", hi: "मार्केट-लिंक्ड ग्रोथ के साथ यूनिट-लिंक्ड पेंशन प्लान।" },
        coverage_summary: { en: "Retirement corpus with systematic withdrawal. Life cover during accumulation.", te: "క్రమబద్ధమైన ఉపసంహరణతో రిటైర్‌మెంట్ కార్పస్.", hi: "व्यवस्थित निकासी के साथ सेवानिवृत्ति कोष।" },
        ideal_for: { en: "Individuals aged 30-55 planning for early retirement.", te: "ముందస్తు రిటైర్‌మెంట్ ప్లాన్ చేసుకుంటున్న 30-55 వయస్సు వ్యక్తులు.", hi: "जल्दी सेवानिवृत्ति की योजना बनाने वाले 30-55 आयु के व्यक्ति।" },
        minAge: 30, maxAge: 60, minPremium: 50000, cta: "Calculate Pension",
        official_source: "https://sbilife.co.in", video: "/videos/en/pension.mp4"
    },
    {
        id: "policy_child_icici", type: "insurance_policy", provider: "ICICI Prudential", category: "Savings", policy_type: "Child Plan",
        name: { en: "ICICI Pru Smart Kid Plan", te: "ICICI ప్రూ స్మార్ట్ కిడ్ ప్లాన్", hi: "ICICI प्रू स्मार्ट किड प्लान" },
        description: { en: "Education savings plan with life cover. Ensures child's education even if parent is not around.", te: "జీవిత కవర్‌తో విద్యా పొదుపు ప్రణాళిక.", hi: "जीवन कवर के साथ शिक्षा बचत योजना।" },
        coverage_summary: { en: "Guaranteed payouts at key education milestones. Premium waiver on death of parent.", te: "కీలక విద్యా మైలురాళ్ల వద్ద హామీ చెల్లింపులు.", hi: "प्रमुख शिक्षा मील के पत्थरों पर गारंटी भुगतान।" },
        ideal_for: { en: "Parents aged 25-45 with young children planning for education expenses.", te: "విద్యా ఖర్చుల కోసం ప్లాన్ చేస్తున్న చిన్న పిల్లలతో 25-45 వయస్సు తల్లిదండ్రులు.", hi: "शिक्षा खर्चों की योजना बनाने वाले 25-45 आयु के माता-पिता।" },
        minAge: 20, maxAge: 45, minPremium: 25000, cta: "Plan Now",
        official_source: "https://iciciprulife.com", video: "/videos/en/child.mp4"
    },
    {
        id: "policy_ulip_bajaj", type: "insurance_policy", provider: "Bajaj Allianz", category: "ULIP", policy_type: "ULIP",
        name: { en: "Bajaj Allianz Life Goal Assure", te: "బజాజ్ అలియాంజ్ లైఫ్ గోల్ అష్యూర్", hi: "बजाज आलियांज लाइफ गोल एश्योर" },
        description: { en: "ULIP plan with 4 fund options and free switching. Combination of insurance and investment.", te: "4 ఫండ్ ఆప్షన్లు మరియు ఉచిత స్విచింగ్‌తో ULIP ప్లాన్.", hi: "4 फंड विकल्पों और मुफ्त स्विचिंग के साथ ULIP प्लान।" },
        coverage_summary: { en: "Market-linked returns with life cover. Loyalty additions from 6th year.", te: "జీవిత కవర్‌తో మార్కెట్-లింక్డ్ రిటర్న్స్.", hi: "जीवन कवर के साथ मार्केट-लिंक्ड रिटर्न।" },
        ideal_for: { en: "Investors aged 25-50 wanting insurance + market-linked growth.", te: "బీమా + మార్కెట్-లింక్డ్ వృద్ధి కావాలనుకునే 25-50 వయస్సు పెట్టుబడిదారులు.", hi: "बीमा + मार्केट-लिंक्ड ग्रोथ चाहने वाले 25-50 आयु के निवेशक।" },
        minAge: 18, maxAge: 50, minPremium: 60000, cta: "Invest Now",
        official_source: "https://bajajallianzlife.com", video: "/videos/en/ulip.mp4"
    },
    {
        id: "policy_health_niva", type: "insurance_policy", provider: "Niva Bupa", category: "Health Insurance", policy_type: "Health Insurance",
        name: { en: "Niva Bupa Health Companion", te: "నివా బూపా హెల్త్ కంపానియన్", hi: "निवा बूपा हेल्थ कंपेनियन" },
        description: { en: "Individual health plan with OPD cover, wellness benefits, and unlimited restoration of sum insured.", te: "OPD కవర్, వెల్నెస్ బెనిఫిట్స్ మరియు అపరిమిత బీమా రాశి పునరుద్ధరణతో వ్యక్తిగత హెల్త్ ప్లాన్.", hi: "OPD कवर, वेलनेस लाभ और असीमित बीमा राशि बहाली के साथ व्यक्तिगत हेल्थ प्लान।" },
        coverage_summary: { en: "Sum insured ₹3L-₹1Cr. 100% restoration. No room rent capping.", te: "₹3L-₹1Cr బీమా రాశి. 100% పునరుద్ధరణ.", hi: "₹3L-₹1Cr बीमा राशि। 100% बहाली।" },
        ideal_for: { en: "Health-conscious individuals seeking comprehensive cover with OPD.", te: "OPD తో సమగ్ర కవర్ కోరుకునే ఆరోగ్య స్పృహ ఉన్న వ్యక్తులు.", hi: "OPD के साथ व्यापक कवर चाहने वाले स्वास्थ्य-जागरूक व्यक्ति।" },
        minAge: 18, maxAge: 65, minPremium: 8000, cta: "Check Premium",
        official_source: "https://nivabupa.com", video: "/videos/en/health.mp4"
    },
    {
        id: "policy_term_tata", type: "insurance_policy", provider: "Tata AIA", category: "Term Insurance", policy_type: "Term Insurance",
        name: { en: "Tata AIA Sampoorna Raksha", te: "టాటా AIA సంపూర్ణ రక్ష", hi: "टाटा AIA संपूर्ण रक्षा" },
        description: { en: "Term insurance with return of premium. Get all premiums back if you survive the policy term.", te: "ప్రీమియం రిటర్న్‌తో టర్మ్ ఇన్సూరెన్స్.", hi: "प्रीमियम वापसी के साथ टर्म बीमा।" },
        coverage_summary: { en: "Life cover ₹25L-₹2Cr. Return of all premiums on survival. Terminal illness benefit.", te: "₹25L-₹2Cr జీవిత కవర్. జీవించి ఉంటే అన్ని ప్రీమియంలు తిరిగి.", hi: "₹25L-₹2Cr जीवन कवर। जीवित रहने पर सभी प्रीमियम वापस।" },
        ideal_for: { en: "Risk-averse individuals who want term cover but don't want to 'lose' premiums.", te: "ప్రీమియంలు 'కోల్పోవడం' ఇష్టపడని వ్యక్తులు.", hi: "प्रीमियम 'खोना' न चाहने वाले व्यक्ति।" },
        minAge: 18, maxAge: 55, minPremium: 15000, cta: "Get Quote",
        official_source: "https://tataaia.com", video: "/videos/en/term_life.mp4"
    },
    {
        id: "policy_health_max", type: "insurance_policy", provider: "Max Bupa", category: "Health Insurance", policy_type: "Health Insurance",
        name: { en: "Max Bupa Health Recharge", te: "మ్యాక్స్ బూపా హెల్త్ రీచార్జ్", hi: "मैक्स बूपा हेल्थ रिचार्ज" },
        description: { en: "Health insurance with automatic recharge of sum insured after each claim. Zero waiting period for accidents.", te: "ప్రతి క్లెయిమ్ తర్వాత బీమా రాశి ఆటోమేటిక్ రీచార్జ్‌తో ఆరోగ్య బీమా.", hi: "प्रत्येक दावे के बाद बीमा राशि की ऑटोमैटिक रिचार्ज।" },
        coverage_summary: { en: "Sum insured ₹5L-₹2Cr. Unlimited recharge. 10,000+ cashless hospitals.", te: "₹5L-₹2Cr బీమా రాశి. అపరిమిత రీచార్జ్.", hi: "₹5L-₹2Cr बीमा राशि। असीमित रिचार्ज।" },
        ideal_for: { en: "Families wanting health cover that recharges after claims.", te: "క్లెయిమ్‌ల తర్వాత రీచార్జ్ అయ్యే హెల్త్ కవర్ కోరుకునే కుటుంబాలు.", hi: "दावों के बाद रिचार्ज होने वाला हेल्थ कवर चाहने वाले परिवार।" },
        minAge: 18, maxAge: 65, minPremium: 10000, cta: "Check Premium",
        official_source: "https://maxbupahealth.com", video: "/videos/en/health.mp4"
    },
    {
        id: "policy_endow_kotak", type: "insurance_policy", provider: "Kotak Life", category: "Endowment", policy_type: "Endowment",
        name: { en: "Kotak Assured Savings Plan", te: "కోటక్ అష్యూర్డ్ సేవింగ్స్ ప్లాన్", hi: "कोटक एश्योर्ड सेविंग्स प्लान" },
        description: { en: "Traditional endowment plan with guaranteed maturity benefit and life cover. Ideal for disciplined savings.", te: "హామీ మెచ్యూరిటీ బెనిఫిట్ మరియు జీవిత కవర్‌తో సాంప్రదాయ ఎండోమెంట్ ప్లాన్.", hi: "गारंटी मेच्योरिटी बेनिफिट और जीवन कवर के साथ पारंपरिक एंडोमेंट प्लान।" },
        coverage_summary: { en: "Guaranteed maturity benefit 110% of total premiums + bonuses. Life cover during term.", te: "హామీ మెచ్యూరిటీ బెనిఫిట్ మొత్తం ప్రీమియంలలో 110% + బోనస్‌లు.", hi: "गारंटी मेच्योरिटी बेनिफिट कुल प्रीमियम का 110% + बोनस।" },
        ideal_for: { en: "Conservative investors seeking guaranteed returns with life cover.", te: "జీవిత కవర్‌తో హామీ రిటర్న్స్ కోరుకునే కన్సర్వేటివ్ పెట్టుబడిదారులు.", hi: "जीवन कवर के साथ गारंटी रिटर्न चाहने वाले रूढ़िवादी निवेशक।" },
        minAge: 18, maxAge: 55, minPremium: 30000, cta: "Start Saving",
        official_source: "https://kotaklife.com", video: "/videos/en/endowment.mp4"
    },
];

const output = { policies: [...schemes, ...insurancePolicies] };
fs.writeFileSync('policies.json', JSON.stringify(output, null, 2));
console.log(`Generated ${output.policies.length} policies (${schemes.length} schemes + ${insurancePolicies.length} insurance).`);
