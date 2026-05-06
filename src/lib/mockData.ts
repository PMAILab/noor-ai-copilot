// Mock data for Noor AI Co-pilot demo
// Simulates Supabase data without requiring live credentials

export interface SalonProfile {
  id: string;
  name: string;
  type: string;
  city: string;
  pinCode: string;
  waNumber: string;
  topServices: string[];
  targetCustomers: string[];
  avgTicket: number;
  budgetTier: number;
  language: 'hi' | 'en' | 'hi-en';
  creditBalance: number;
  subscriptionTier: 'chamak' | 'roshan' | 'noor_pro';
  hasMetaConnected: boolean;
}

export interface PlanAction {
  day: string;
  channel: 'whatsapp' | 'instagram' | 'meta_ads';
  action_type: 'post' | 'broadcast' | 'campaign' | 'story' | 'reel';
  description: string;
  copy_suggestion: string;
  estimated_cost: number;
  recipe_id: string | null;
  time_needed_minutes: number;
  completed?: boolean;
}

export interface PlanWeek {
  week: number;
  theme: string;
  actions: PlanAction[];
}

export interface MarketingPlan {
  id: string;
  goal: string;
  monthlyBudget: number;
  planSummary: string;
  channelSplit: { whatsapp: number; instagram: number; meta_ads: number };
  budgetAllocation: {
    whatsapp_broadcasts: number;
    instagram_content: number;
    meta_ads: number;
    content_creation: number;
  };
  recommendedRecipes: string[];
  weeklyActions: PlanWeek[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  actionsCompleted: number;
  actionsTotal: number;
  createdAt: string;
}

export interface Campaign {
  id: string;
  goalText: string;
  recipeType: string;
  dailyBudgetInr: number;
  totalBudgetInr: number;
  totalSpentInr: number;
  status: 'draft' | 'pending_approval' | 'active' | 'paused' | 'completed' | 'failed';
  enquiryCount: number;
  hotLeadCount: number;
  bookingCount: number;
  costPerLead: number;
  copyVariants?: CopyVariant[];
  selectedCopyIndex?: number;
  launchedAt?: string;
  createdAt: string;
}

export interface CopyVariant {
  variant: number;
  style: string;
  headline: string;
  body: string;
  cta: string;
  wa_prefill: string;
  platform: string;
  emoji_hook: string;
}

export interface Lead {
  id: string;
  name: string;
  waNumber: string;
  score: 'new' | 'hot' | 'warm' | 'cold' | 'booked' | 'lost';
  serviceInterest: string;
  preferredDate: string;
  budgetRange: string;
  botStep: number;
  createdAt: string;
  campaignId?: string;
}

export interface DailyReport {
  id: string;
  reportDate: string;
  totalSpendInr: number;
  enquiryCount: number;
  hotLeadCount: number;
  bookingCount: number;
  costPerEnquiry: number;
  costPerBooking: number;
  bestCampaign: string;
  waMessageSent: string;
}

export interface Broadcast {
  id: string;
  segment: 'regulars' | 'occasional' | 'lapsed' | 'new' | 'all';
  messageBody: string;
  totalRecipients: number;
  sentCount: number;
  readCount: number;
  repliedCount: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

// ============================================================
// MOCK SALON PROFILE
// ============================================================
export const MOCK_SALON: SalonProfile = {
  id: 'salon-001',
  name: 'Ananya Beauty Studio',
  type: 'ladies_parlour',
  city: 'Jaipur',
  pinCode: '302001',
  waNumber: '+919876543210',
  topServices: ['facial', 'hair_colour', 'bridal_makeup', 'hair_spa', 'threading'],
  targetCustomers: ['working_women', 'homemakers', 'brides'],
  avgTicket: 650,
  budgetTier: 3000,
  language: 'hi-en',
  creditBalance: 500,
  subscriptionTier: 'roshan',
  hasMetaConnected: false,
};

// ============================================================
// MOCK CAMPAIGNS
// ============================================================
export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-001',
    goalText: 'Diwali Glow Up — bridal & facial special',
    recipeType: 'festival_offer',
    dailyBudgetInr: 500,
    totalBudgetInr: 15000,
    totalSpentInr: 9200,
    status: 'active',
    enquiryCount: 145,
    hotLeadCount: 23,
    bookingCount: 11,
    costPerLead: 63,
    launchedAt: '2024-10-15T09:00:00Z',
    createdAt: '2024-10-14T18:00:00Z',
  },
  {
    id: 'camp-002',
    goalText: 'Weekend glow-up — hair colour + facial combo',
    recipeType: 'weekday_filler',
    dailyBudgetInr: 300,
    totalBudgetInr: 6000,
    totalSpentInr: 6000,
    status: 'completed',
    enquiryCount: 68,
    hotLeadCount: 14,
    bookingCount: 8,
    costPerLead: 88,
    launchedAt: '2024-09-20T09:00:00Z',
    createdAt: '2024-09-19T18:00:00Z',
  },
  {
    id: 'camp-003',
    goalText: 'Win back lapsed clients — special 30% off offer',
    recipeType: 'win_back',
    dailyBudgetInr: 200,
    totalBudgetInr: 4000,
    totalSpentInr: 1200,
    status: 'paused',
    enquiryCount: 22,
    hotLeadCount: 4,
    bookingCount: 2,
    costPerLead: 55,
    launchedAt: '2024-11-01T09:00:00Z',
    createdAt: '2024-10-31T18:00:00Z',
  },
];

// ============================================================
// MOCK LEADS
// ============================================================
export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-001',
    name: 'Sara Malik',
    waNumber: '+919876500001',
    score: 'hot',
    serviceInterest: 'Hair Colouring + Highlights',
    preferredDate: 'This Saturday',
    budgetRange: '₹1500-2500',
    botStep: 99,
    createdAt: '2024-10-20T14:30:00Z',
    campaignId: 'camp-001',
  },
  {
    id: 'lead-002',
    name: 'Priya Kapoor',
    waNumber: '+919876500002',
    score: 'hot',
    serviceInterest: 'Bridal Makeup + Mehendi',
    preferredDate: 'Next Month (December)',
    budgetRange: '₹5000-10000',
    botStep: 99,
    createdAt: '2024-10-20T12:15:00Z',
    campaignId: 'camp-001',
  },
  {
    id: 'lead-003',
    name: 'Neha Joshi',
    waNumber: '+919876500003',
    score: 'warm',
    serviceInterest: 'Facial',
    preferredDate: 'Anytime this week',
    budgetRange: '₹500-1000',
    botStep: 2,
    createdAt: '2024-10-20T10:00:00Z',
    campaignId: 'camp-001',
  },
  {
    id: 'lead-004',
    name: 'Aarti Singh',
    waNumber: '+919876500004',
    score: 'new',
    serviceInterest: '',
    preferredDate: '',
    budgetRange: '',
    botStep: 0,
    createdAt: '2024-10-20T08:45:00Z',
    campaignId: 'camp-001',
  },
  {
    id: 'lead-005',
    name: 'Meena Kumari',
    waNumber: '+919876500005',
    score: 'booked',
    serviceInterest: 'Hair Spa + Conditioning',
    preferredDate: 'Yesterday — confirmed',
    budgetRange: '₹800-1500',
    botStep: 99,
    createdAt: '2024-10-19T16:00:00Z',
    campaignId: 'camp-001',
  },
  {
    id: 'lead-006',
    name: 'Kavya Reddy',
    waNumber: '+919876500006',
    score: 'cold',
    serviceInterest: 'Eyebrow Threading',
    preferredDate: 'Not sure',
    budgetRange: 'Under ₹200',
    botStep: 3,
    createdAt: '2024-10-19T09:30:00Z',
  },
];

// ============================================================
// MOCK DAILY REPORTS
// ============================================================
export const MOCK_REPORTS: DailyReport[] = [
  {
    id: 'report-001',
    reportDate: '2024-10-20',
    totalSpendInr: 480,
    enquiryCount: 6,
    hotLeadCount: 2,
    bookingCount: 1,
    costPerEnquiry: 80,
    costPerBooking: 480,
    bestCampaign: 'Diwali Glow Up — bridal & facial special',
    waMessageSent: '📊 Noor Daily Report · 20 Oct\n\n💰 Aaj kharch: ₹480\n📩 Nayi poochh: 6\n🔥 Hot lead: 2\n📅 Booking: 1\n\n💡 Sabse achha: "Bridal facial" wala ad\n📈 ₹240 mein 1 booking mili',
  },
  {
    id: 'report-002',
    reportDate: '2024-10-19',
    totalSpendInr: 510,
    enquiryCount: 8,
    hotLeadCount: 3,
    bookingCount: 2,
    costPerEnquiry: 64,
    costPerBooking: 255,
    bestCampaign: 'Diwali Glow Up — bridal & facial special',
    waMessageSent: '📊 Noor Daily Report · 19 Oct\n\n💰 Aaj kharch: ₹510\n📩 Nayi poochh: 8\n🔥 Hot lead: 3\n📅 Booking: 2\n\n💡 Best performance: Hair spa campaign\n📈 ₹255 mein 1 booking mili',
  },
  {
    id: 'report-003',
    reportDate: '2024-10-18',
    totalSpendInr: 395,
    enquiryCount: 4,
    hotLeadCount: 1,
    bookingCount: 0,
    costPerEnquiry: 99,
    costPerBooking: 0,
    bestCampaign: 'Diwali Glow Up — bridal & facial special',
    waMessageSent: '📊 Noor Daily Report · 18 Oct\n\n💰 Aaj kharch: ₹395\n📩 Nayi poochh: 4\n🔥 Hot lead: 1\n📅 Booking: 0\n\n💡 Weekend pe traffic zyada hoga. Saturday ko boost karo!',
  },
  {
    id: 'report-004',
    reportDate: '2024-10-17',
    totalSpendInr: 620,
    enquiryCount: 11,
    hotLeadCount: 4,
    bookingCount: 3,
    costPerEnquiry: 56,
    costPerBooking: 207,
    bestCampaign: 'Diwali Glow Up — bridal & facial special',
    waMessageSent: '📊 Noor Daily Report · 17 Oct\n\n💰 Aaj kharch: ₹620\n📩 Nayi poochh: 11\n🔥 Hot lead: 4\n📅 Booking: 3\n\n🎉 Aaj best day tha! ₹207 mein 1 booking',
  },
  {
    id: 'report-005',
    reportDate: '2024-10-16',
    totalSpendInr: 440,
    enquiryCount: 5,
    hotLeadCount: 2,
    bookingCount: 1,
    costPerEnquiry: 88,
    costPerBooking: 440,
    bestCampaign: 'Diwali Glow Up — bridal & facial special',
    waMessageSent: '📊 Noor Daily Report · 16 Oct\n\n💰 Aaj kharch: ₹440\n📩 Nayi poochh: 5\n🔥 Hot lead: 2\n📅 Booking: 1\n\n💡 Tip: Subah 10-12 AM mein response zyada aata hai',
  },
];

// ============================================================
// MOCK BROADCASTS
// ============================================================
export const MOCK_BROADCASTS: Broadcast[] = [
  {
    id: 'bc-001',
    segment: 'regulars',
    messageBody: 'Hi [Name]! 🎊 Diwali special: 25% off on all facial & makeup services this week. Limited slots — book karein ab! Reply "BOOK" ya call karein.',
    totalRecipients: 142,
    sentCount: 142,
    readCount: 98,
    repliedCount: 23,
    status: 'sent',
    sentAt: '2024-10-15T10:00:00Z',
    createdAt: '2024-10-15T09:45:00Z',
  },
  {
    id: 'bc-002',
    segment: 'lapsed',
    messageBody: 'Arre [Name], bahut din ho gaye! 😊 Hum miss kar rahe hain aapko. Wapas aayein aur paayen 30% off kisi bhi service par. Offer sirf is week valid hai!',
    totalRecipients: 215,
    sentCount: 215,
    readCount: 134,
    repliedCount: 18,
    status: 'sent',
    sentAt: '2024-10-10T11:00:00Z',
    createdAt: '2024-10-10T10:45:00Z',
  },
];

// ============================================================
// MOCK MARKETING PLAN (for when no plan is generated yet)
// ============================================================
export const MOCK_PLAN: MarketingPlan = {
  id: 'plan-001',
  goal: 'Get more walk-ins and fill weekday slots',
  monthlyBudget: 3000,
  planSummary: 'Is mahine, hum focus karenge weekday walk-ins badhane par. WhatsApp pe regular clients ko special offers bhejenge, Instagram par before/after transformations post karenge, aur 3 targeted Meta ads chalayenge Friday-Sunday. Total 28 actions in 4 weeks.',
  channelSplit: { whatsapp: 45, instagram: 30, meta_ads: 25 },
  budgetAllocation: {
    whatsapp_broadcasts: 0,
    instagram_content: 0,
    meta_ads: 2500,
    content_creation: 500,
  },
  recommendedRecipes: ['weekday_filler', 'win_back', 'festival_offer'],
  weeklyActions: [
    {
      week: 1,
      theme: 'Build awareness in your locality',
      actions: [
        {
          day: 'Mon',
          channel: 'instagram',
          action_type: 'post',
          description: 'Before/after transformation reel — hair colour or facial',
          copy_suggestion: '✨ Transformation Tuesday nahi, Motivation Monday! Dekho kaise Priya ne apna look badla sirf 2 ghante mein. Aap bhi try karo? Book karo aaj! 💇‍♀️ #AuraSalon #HairTransformation #Jaipur',
          estimated_cost: 0,
          recipe_id: null,
          time_needed_minutes: 10,
          completed: true,
        },
        {
          day: 'Wed',
          channel: 'whatsapp',
          action_type: 'broadcast',
          description: 'Weekday offer to regular clients — mid-week special',
          copy_suggestion: 'Hi [Name]! 💄 Midweek Special: Aaj aur kal, koi bhi facial ya hair spa karo aur pao FREE eyebrow threading! Slots limited hain — bol dena. 😊',
          estimated_cost: 0,
          recipe_id: 'weekday_filler',
          time_needed_minutes: 5,
          completed: true,
        },
        {
          day: 'Fri',
          channel: 'meta_ads',
          action_type: 'campaign',
          description: 'Click-to-WhatsApp ad for weekend special',
          copy_suggestion: 'Weekend Glow Up! ✨ Facial + Hair Wash combo sirf ₹599 mein. Friday-Sunday only. Jaipur mein best salon experience. Book karein ab! 📲',
          estimated_cost: 600,
          recipe_id: 'weekday_filler',
          time_needed_minutes: 15,
          completed: false,
        },
      ],
    },
    {
      week: 2,
      theme: 'Win back lapsed clients',
      actions: [
        {
          day: 'Mon',
          channel: 'whatsapp',
          action_type: 'broadcast',
          description: 'Re-engagement message to clients not seen in 45+ days',
          copy_suggestion: 'Arre [Name], 2 mahine ho gaye! 🥺 Hum miss kar rahe hain aapko. Wapas aayein aur paayen 30% off apni favourite service par. Yeh offer sirf aapke liye hai! 💕',
          estimated_cost: 0,
          recipe_id: 'win_back',
          time_needed_minutes: 5,
          completed: false,
        },
        {
          day: 'Wed',
          channel: 'instagram',
          action_type: 'reel',
          description: 'Service showcase reel — 15 second "look inside our salon"',
          copy_suggestion: '🌸 Aao na! Behind the scenes dekhte hain hamari salon ki. Har treatment mein love lagaate hain hum. Aur haan — walk-ins welcome hain! #BehindTheScenes #AuraSalon',
          estimated_cost: 0,
          recipe_id: null,
          time_needed_minutes: 20,
          completed: false,
        },
        {
          day: 'Sat',
          channel: 'meta_ads',
          action_type: 'campaign',
          description: 'Weekend bridal inquiry ad',
          copy_suggestion: '💍 Shaadi ki date fix ho gayi? Bridal trial booking shuru karo ab! Expert bridal makeup artist available. Free consultation + ₹500 off on bridal package. Book today!',
          estimated_cost: 700,
          recipe_id: 'bridal_season',
          time_needed_minutes: 15,
          completed: false,
        },
      ],
    },
    {
      week: 3,
      theme: 'Festival season push',
      actions: [
        {
          day: 'Tue',
          channel: 'instagram',
          action_type: 'story',
          description: 'Festival countdown story with offer',
          copy_suggestion: '🪔 Diwali aane waali hai! Is saal sabse sundar dikhna hai? Abhi se slot book karo — sirf 5 bridal slots bacha hain! Swipe up to book! ✨',
          estimated_cost: 0,
          recipe_id: 'festival_offer',
          time_needed_minutes: 5,
          completed: false,
        },
        {
          day: 'Thu',
          channel: 'whatsapp',
          action_type: 'broadcast',
          description: 'Festival special package announcement',
          copy_suggestion: '🎊 Noor Diwali Package! Facial + Mehendi + Hair Styling = sirf ₹1499 (regular ₹2100). Is week book karo! Limited slots. "DIWALI" likh ke reply karo. 🪔',
          estimated_cost: 0,
          recipe_id: 'festival_offer',
          time_needed_minutes: 5,
          completed: false,
        },
        {
          day: 'Fri',
          channel: 'meta_ads',
          action_type: 'campaign',
          description: 'Diwali glow ad with festival urgency',
          copy_suggestion: '🪔 Diwali pe sabse sundar dikhna chahti hain? Last minute booking available! Facial + Makeup combo ₹999. Sirf 3 din bacha! Book karein abhi. 📲',
          estimated_cost: 800,
          recipe_id: 'festival_offer',
          time_needed_minutes: 15,
          completed: false,
        },
      ],
    },
    {
      week: 4,
      theme: 'Retain & rebook for next month',
      actions: [
        {
          day: 'Mon',
          channel: 'instagram',
          action_type: 'post',
          description: 'Client appreciation post + November preview',
          copy_suggestion: '💖 Yeh mahina amazing raha! Itne pyaare clients ke saath kaam karna hum ko khush karta hai. November mein bhi aate rehna! New services launch hone wali hain soon... 👀 #ClientLove',
          estimated_cost: 0,
          recipe_id: null,
          time_needed_minutes: 10,
          completed: false,
        },
        {
          day: 'Wed',
          channel: 'whatsapp',
          action_type: 'broadcast',
          description: 'Service cycle reminder to clients due for revisit',
          copy_suggestion: 'Hi [Name]! 🌸 Aapka facial 6 week pehle hua tha — time aa gaya hai doosre ka! Is week book karo aur pao ₹100 off. Aapka slot hold kar sakti hoon? 😊',
          estimated_cost: 0,
          recipe_id: null,
          time_needed_minutes: 5,
          completed: false,
        },
        {
          day: 'Fri',
          channel: 'whatsapp',
          action_type: 'broadcast',
          description: 'Weekend offer broadcast to occasional clients',
          copy_suggestion: 'Weekend ko pamper time banaao! 💆‍♀️ Hair spa + face pack combo sirf ₹699. Saturday ya Sunday — jo convenient ho. Reply karein ya directly aa jaayein! ✨',
          estimated_cost: 0,
          recipe_id: 'weekday_filler',
          time_needed_minutes: 5,
          completed: false,
        },
      ],
    },
  ],
  status: 'active',
  actionsCompleted: 2,
  actionsTotal: 12,
  createdAt: '2024-10-14T09:00:00Z',
};
