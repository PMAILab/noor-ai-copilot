export interface ServiceCycle {
  id: string;
  name: string;
  nameHi: string;
  cycleWeeks: number;
  reminderText: string;
  reminderTextHi: string;
  icon: string;
}

export const SERVICE_CYCLES: ServiceCycle[] = [
  {
    id: 'haircut',
    name: 'Haircut',
    nameHi: 'हेयरकट',
    cycleWeeks: 4,
    reminderText: 'Time for a trim! Your last haircut was 4 weeks ago.',
    reminderTextHi: 'ट्रिम का समय आ गया! आपका पिछला हेयरकट 4 हफ्ते पहले था।',
    icon: '✂️',
  },
  {
    id: 'facial',
    name: 'Facial',
    nameHi: 'फेशियल',
    cycleWeeks: 6,
    reminderText: 'Your skin is calling for care! Book your monthly facial.',
    reminderTextHi: 'आपकी त्वचा को देखभाल की जरूरत है! अपना मासिक फेशियल बुक करें।',
    icon: '✨',
  },
  {
    id: 'hair_colour',
    name: 'Hair Colour',
    nameHi: 'हेयर कलर',
    cycleWeeks: 8,
    reminderText: 'Roots showing? Let us fix that with a fresh colour refresh!',
    reminderTextHi: 'जड़ें दिख रही हैं? ताजे रंग रिफ्रेश के साथ इसे ठीक करते हैं!',
    icon: '🎨',
  },
  {
    id: 'threading',
    name: 'Threading',
    nameHi: 'थ्रेडिंग',
    cycleWeeks: 2,
    reminderText: 'Quick threading touch-up? Book your slot today!',
    reminderTextHi: 'जल्दी थ्रेडिंग टच-अप? आज अपना स्लॉट बुक करें!',
    icon: '🧵',
  },
  {
    id: 'manicure',
    name: 'Manicure',
    nameHi: 'मैनीक्योर',
    cycleWeeks: 3,
    reminderText: 'Nails need attention! Come in for a fresh manicure.',
    reminderTextHi: 'नाखूनों पर ध्यान चाहिए! ताजे मैनीक्योर के लिए आएं।',
    icon: '💅',
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    nameHi: 'पेडीक्योर',
    cycleWeeks: 4,
    reminderText: 'Happy feet, happy you! Time for your monthly pedicure.',
    reminderTextHi: 'खुश पैर, खुश आप! आपके मासिक पेडीक्योर का समय आ गया है।',
    icon: '🦶',
  },
  {
    id: 'hair_spa',
    name: 'Hair Spa',
    nameHi: 'हेयर स्पा',
    cycleWeeks: 4,
    reminderText: 'Treat your hair to a nourishing hair spa session this week!',
    reminderTextHi: 'इस सप्ताह अपने बालों को पोषण देने वाले हेयर स्पा सेशन से ट्रीट करें!',
    icon: '💆',
  },
  {
    id: 'bridal_prep',
    name: 'Bridal Prep',
    nameHi: 'ब्राइडल प्रेप',
    cycleWeeks: 12,
    reminderText: 'Bridal season is approaching! Start your bridal prep journey with us.',
    reminderTextHi: 'शादी का सीजन आ रहा है! हमारे साथ अपनी ब्राइडल प्रेप यात्रा शुरू करें।',
    icon: '💍',
  },
];

export type GoalOption = {
  id: string;
  label: string;
  labelHi: string;
  icon: string;
  description: string;
};

export const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'more_walkins',
    label: 'Get More Walk-ins',
    labelHi: 'ज्यादा वॉक-इन पाएं',
    icon: '🚶',
    description: 'Drive more customers through your doors',
  },
  {
    id: 'fill_weekdays',
    label: 'Fill Weekday Slots',
    labelHi: 'वीकडे स्लॉट भरें',
    icon: '📅',
    description: 'Keep your salon busy Mon–Thu',
  },
  {
    id: 'bridal_bookings',
    label: 'Bridal Season Bookings',
    labelHi: 'ब्राइडल सीजन बुकिंग',
    icon: '💍',
    description: 'Capture bridal & wedding season demand',
  },
  {
    id: 'new_service',
    label: 'Launch New Service',
    labelHi: 'नई सेवा लॉन्च करें',
    icon: '🚀',
    description: 'Promote a newly added service',
  },
  {
    id: 'win_back',
    label: 'Win Back Old Clients',
    labelHi: 'पुराने ग्राहक वापस लाएं',
    icon: '💌',
    description: 'Re-engage customers who haven\'t visited in 45+ days',
  },
];

export type ChannelOption = {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
  free: boolean;
  requiresMeta: boolean;
};

export const CHANNEL_OPTIONS: ChannelOption[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    nameHi: 'व्हाट्सएप',
    icon: '💬',
    free: true,
    requiresMeta: false,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    nameHi: 'इंस्टाग्राम',
    icon: '📸',
    free: true,
    requiresMeta: false,
  },
  {
    id: 'meta_ads',
    name: 'Meta Ads',
    nameHi: 'मेटा ऐड्स',
    icon: '🎯',
    free: false,
    requiresMeta: true,
  },
];
