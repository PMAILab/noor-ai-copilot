export interface Festival {
  id: string;
  name: string;
  nameHi: string;
  date: string; // MM-DD format, year calculated dynamically
  region: 'national' | 'north' | 'south' | 'east' | 'west' | 'pan_india';
  relevantServices: string[];
  offerTemplate: string;
  offerTemplateHi: string;
  color: string;
  emoji: string;
}

// Helper to get next occurrence of a festival date
export function getNextFestivalDate(mmdd: string): Date {
  const [month, day] = mmdd.split('-').map(Number);
  const now = new Date();
  let year = now.getFullYear();
  const festDate = new Date(year, month - 1, day);
  if (festDate < now) {
    year += 1;
  }
  return new Date(year, month - 1, day);
}

export function getDaysUntil(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export const FESTIVALS: Festival[] = [
  {
    id: 'diwali',
    name: 'Diwali',
    nameHi: 'दीपावली',
    date: '10-20',
    region: 'national',
    relevantServices: ['facial', 'bridal_makeup', 'hair_spa', 'mehendi', 'nail_art'],
    offerTemplate: 'Diwali Glow Special: 25% off on all facial & makeup services! Book now and shine this Diwali. ✨🪔',
    offerTemplateHi: 'दिवाली ग्लो स्पेशल: सभी फेशियल और मेकअप सेवाओं पर 25% छूट! अभी बुक करें और इस दिवाली चमकें। ✨🪔',
    color: '#F59E0B',
    emoji: '🪔',
  },
  {
    id: 'navratri',
    name: 'Navratri',
    nameHi: 'नवरात्री',
    date: '10-03',
    region: 'national',
    relevantServices: ['mehendi', 'hair_styling', 'nail_art', 'bridal_makeup'],
    offerTemplate: 'Navratri Special: Get festival-ready with our exclusive mehendi & styling packages! 🎊',
    offerTemplateHi: 'नवरात्री स्पेशल: हमारे एक्सक्लूसिव मेहंदी और स्टाइलिंग पैकेज के साथ फेस्टिवल-रेडी हों! 🎊',
    color: '#EF4444',
    emoji: '🎊',
  },
  {
    id: 'karwa_chauth',
    name: 'Karwa Chauth',
    nameHi: 'करवा चौथ',
    date: '10-20',
    region: 'north',
    relevantServices: ['mehendi', 'bridal_makeup', 'hair_styling', 'facial'],
    offerTemplate: 'Karwa Chauth Special: Look your best for your husband! Full bridal package at ₹999 only. 💕',
    offerTemplateHi: 'करवा चौथ स्पेशल: अपने पति के लिए सबसे खूबसूरत दिखें! केवल ₹999 में पूरा ब्राइडल पैकेज। 💕',
    color: '#EC4899',
    emoji: '💕',
  },
  {
    id: 'raksha_bandhan',
    name: 'Raksha Bandhan',
    nameHi: 'रक्षा बंधन',
    date: '08-19',
    region: 'national',
    relevantServices: ['facial', 'manicure', 'pedicure', 'hair_spa'],
    offerTemplate: 'Rakhi Special: Bring your sister and get 50% off on the second service! 🎀',
    offerTemplateHi: 'राखी स्पेशल: अपनी बहन को लाओ और दूसरी सेवा पर 50% छूट पाओ! 🎀',
    color: '#F97316',
    emoji: '🎀',
  },
  {
    id: 'holi',
    name: 'Holi',
    nameHi: 'होली',
    date: '03-25',
    region: 'national',
    relevantServices: ['hair_spa', 'deep_conditioning', 'facial', 'skin_treatment'],
    offerTemplate: 'Post-Holi Rescue: Deep conditioning + facial combo at ₹799! Protect your hair & skin. 🌈',
    offerTemplateHi: 'होली के बाद रेस्क्यू: डीप कंडीशनिंग + फेशियल कॉम्बो केवल ₹799 में! अपने बाल और त्वचा की रक्षा करें। 🌈',
    color: '#8B5CF6',
    emoji: '🌈',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    nameHi: 'क्रिसमस',
    date: '12-25',
    region: 'national',
    relevantServices: ['bridal_makeup', 'hair_styling', 'manicure', 'facial'],
    offerTemplate: 'Christmas Glow Special: Book any 2 services and get a complimentary nail art! 🎄✨',
    offerTemplateHi: 'क्रिसमस ग्लो स्पेशल: कोई भी 2 सेवाएं बुक करें और मुफ्त नेल आर्ट पाएं! 🎄✨',
    color: '#22C55E',
    emoji: '🎄',
  },
  {
    id: 'new_year',
    name: 'New Year',
    nameHi: 'नया साल',
    date: '12-31',
    region: 'national',
    relevantServices: ['bridal_makeup', 'hair_styling', 'nail_art', 'facial'],
    offerTemplate: 'Ring in the New Year looking fabulous! Book your party look now — only 10 slots left! 🥂✨',
    offerTemplateHi: 'नए साल में शानदार दिखें! अभी अपना पार्टी लुक बुक करें — केवल 10 स्लॉट बचे हैं! 🥂✨',
    color: '#F59E0B',
    emoji: '🥂',
  },
  {
    id: 'eid',
    name: 'Eid ul-Fitr',
    nameHi: 'ईद',
    date: '04-10',
    region: 'national',
    relevantServices: ['mehendi', 'bridal_makeup', 'hair_styling', 'facial'],
    offerTemplate: 'Eid Mubarak! Get gorgeous with our Eid special package: Mehendi + Facial + Styling at ₹1499! 🌙',
    offerTemplateHi: 'ईद मुबारक! हमारे ईद स्पेशल पैकेज के साथ खूबसूरत बनें: मेहंदी + फेशियल + स्टाइलिंग केवल ₹1499 में! 🌙',
    color: '#10B981',
    emoji: '🌙',
  },
  {
    id: 'valentines_day',
    name: "Valentine's Day",
    nameHi: 'वेलेंटाइन डे',
    date: '02-14',
    region: 'national',
    relevantServices: ['couples_spa', 'facial', 'manicure', 'hair_styling'],
    offerTemplate: "Valentine's Special: Couple's spa package at ₹1999! Gift your loved one a day of pampering. 💝",
    offerTemplateHi: "वेलेंटाइन स्पेशल: कपल्स स्पा पैकेज केवल ₹1999 में! अपने प्रिय को पैम्पर करने का दिन गिफ्ट करें। 💝",
    color: '#EF4444',
    emoji: '💝',
  },
  {
    id: 'womens_day',
    name: "Women's Day",
    nameHi: 'महिला दिवस',
    date: '03-08',
    region: 'national',
    relevantServices: ['facial', 'hair_spa', 'manicure', 'pedicure', 'body_massage'],
    offerTemplate: 'Celebrate YOU this Women\'s Day! All services 30% off on 8th March. You deserve it! 💜',
    offerTemplateHi: 'महिला दिवस पर खुद का जश्न मनाएं! 8 मार्च को सभी सेवाएं 30% छूट पर। आप इसकी हकदार हैं! 💜',
    color: '#8B5CF6',
    emoji: '💜',
  },
  {
    id: 'onam',
    name: 'Onam',
    nameHi: 'ओणम',
    date: '09-15',
    region: 'south',
    relevantServices: ['facial', 'hair_spa', 'bridal_makeup', 'traditional_makeup'],
    offerTemplate: 'Onam Special: Traditional Kerala beauty rituals with modern touch. Book your festival look! 🌸',
    offerTemplateHi: 'ओणम स्पेशल: आधुनिक स्पर्श के साथ पारंपरिक केरला ब्यूटी रिचुअल्स। अपना फेस्टिवल लुक बुक करें! 🌸',
    color: '#F59E0B',
    emoji: '🌸',
  },
  {
    id: 'pongal',
    name: 'Pongal',
    nameHi: 'पोंगल',
    date: '01-14',
    region: 'south',
    relevantServices: ['facial', 'hair_spa', 'traditional_makeup'],
    offerTemplate: 'Happy Pongal! Celebrate with our special festival package. Glowing skin + silky hair! ☀️',
    offerTemplateHi: 'हैप्पी पोंगल! हमारे स्पेशल फेस्टिवल पैकेज के साथ सेलिब्रेट करें। चमकती त्वचा + रेशमी बाल! ☀️',
    color: '#F97316',
    emoji: '☀️',
  },
  {
    id: 'durga_puja',
    name: 'Durga Puja',
    nameHi: 'दुर्गा पूजा',
    date: '10-10',
    region: 'east',
    relevantServices: ['bridal_makeup', 'hair_styling', 'mehendi', 'saree_draping'],
    offerTemplate: 'Durga Puja Special: Get your pandal-ready look with our festive makeup + hair styling package! 🙏',
    offerTemplateHi: 'दुर्गा पूजा स्पेशल: हमारे फेस्टिव मेकअप + हेयर स्टाइलिंग पैकेज के साथ पंडाल-रेडी लुक पाएं! 🙏',
    color: '#EF4444',
    emoji: '🙏',
  },
  {
    id: 'ganesh_chaturthi',
    name: 'Ganesh Chaturthi',
    nameHi: 'गणेश चतुर्थी',
    date: '09-07',
    region: 'west',
    relevantServices: ['mehendi', 'bridal_makeup', 'hair_styling', 'nail_art'],
    offerTemplate: 'Ganpati Special: Celebrate Bappa\'s arrival with our festival beauty packages! Ganpati Bappa Morya! 🐘',
    offerTemplateHi: 'गणपति स्पेशल: हमारे फेस्टिवल ब्यूटी पैकेज के साथ बप्पा के आगमन का जश्न मनाएं! गणपति बप्पा मोरया! 🐘',
    color: '#F59E0B',
    emoji: '🐘',
  },
  {
    id: 'baisakhi',
    name: 'Baisakhi',
    nameHi: 'बैसाखी',
    date: '04-13',
    region: 'north',
    relevantServices: ['hair_spa', 'facial', 'traditional_makeup', 'mehendi'],
    offerTemplate: 'Baisakhi Bonanza! Celebrate harvest season with 20% off on all hair services. 🌾',
    offerTemplateHi: 'बैसाखी बोनांजा! सभी हेयर सेवाओं पर 20% छूट के साथ फसल सीजन मनाएं। 🌾',
    color: '#F59E0B',
    emoji: '🌾',
  },
  {
    id: 'teej',
    name: 'Teej',
    nameHi: 'तीज',
    date: '08-07',
    region: 'north',
    relevantServices: ['mehendi', 'bridal_makeup', 'hair_styling', 'saree_draping'],
    offerTemplate: 'Teej Special: Beautiful mehendi designs + hair styling just for ₹799! 💚',
    offerTemplateHi: 'तीज स्पेशल: सुंदर मेहंदी डिज़ाइन + हेयर स्टाइलिंग केवल ₹799 में! 💚',
    color: '#22C55E',
    emoji: '💚',
  },
  {
    id: 'mothers_day',
    name: "Mother's Day",
    nameHi: 'मातृ दिवस',
    date: '05-11',
    region: 'national',
    relevantServices: ['facial', 'hair_spa', 'manicure', 'pedicure', 'body_massage'],
    offerTemplate: "This Mother's Day, treat your mom! Gift a luxury spa session — she deserves the best! 👩‍❤️‍👩",
    offerTemplateHi: "इस मातृ दिवस पर अपनी मां को ट्रीट करें! एक लक्ज़री स्पा सेशन गिफ्ट करें — वे सबसे अच्छे की हकदार हैं! 👩‍❤️‍👩",
    color: '#EC4899',
    emoji: '👩‍❤️‍👩',
  },
  {
    id: 'janmashtami',
    name: 'Janmashtami',
    nameHi: 'जन्माष्टमी',
    date: '08-26',
    region: 'national',
    relevantServices: ['traditional_makeup', 'hair_styling', 'mehendi'],
    offerTemplate: 'Janmashtami Special: Divine looks for the blessed festival! Traditional makeup at special prices. 🦚',
    offerTemplateHi: 'जन्माष्टमी स्पेशल: इस पावन त्योहार के लिए दिव्य लुक! विशेष कीमतों पर पारंपरिक मेकअप। 🦚',
    color: '#3B82F6',
    emoji: '🦚',
  },
  {
    id: 'lohri',
    name: 'Lohri',
    nameHi: 'लोहड़ी',
    date: '01-13',
    region: 'north',
    relevantServices: ['bridal_makeup', 'mehendi', 'hair_styling'],
    offerTemplate: 'Lohri Special for Brides & New Moms! Special bridal packages this season. 🔥',
    offerTemplateHi: 'दुल्हनों और नई माताओं के लिए लोहड़ी स्पेशल! इस सीजन में विशेष ब्राइडल पैकेज। 🔥',
    color: '#F97316',
    emoji: '🔥',
  },
  {
    id: 'independence_day',
    name: 'Independence Day',
    nameHi: 'स्वतंत्रता दिवस',
    date: '08-15',
    region: 'national',
    relevantServices: ['facial', 'hair_spa', 'manicure'],
    offerTemplate: 'Celebrate Freedom Day with a special 15% discount on all services — Valid on 15 August! 🇮🇳',
    offerTemplateHi: 'स्वतंत्रता दिवस मनाएं सभी सेवाओं पर विशेष 15% छूट के साथ — 15 अगस्त को वैध! 🇮🇳',
    color: '#22C55E',
    emoji: '🇮🇳',
  },
];
