export const locales = ["en", "vi", "id", "ne", "my", "fil", "bn", "ur", "zh", "ko", "pt", "es", "ru", "si", "mn"] as const;

export type Locale = (typeof locales)[number];

const en = {
  pathway: "Pathway",
  chats: "Chats",
  phrases: "Phrases",
  profile: "Profile",
  subscription: "Subscription",
  languageLearning: "Language & learning",
  suggestFeature: "Suggest a feature",
  logOut: "Log out",
  terms: "Terms",
  privacy: "Privacy",
  freePlan: "Free plan",
  individual: "Individual",
  premium: "Premium",
  yourAccount: "Your account",
  languageTitle: "Language",
  languageDescription: "Choose the language for menus and buttons. Lessons stay in Japanese.",
  searchLanguage: "Search language",
  detected: "Detected",
  saved: "Saved",
  noLanguage: "No language matches “{query}”",
  changePhoto: "Change photo",
  uploading: "Uploading…",
  name: "Name",
  email: "Email",
  saveChanges: "Save changes",
  saving: "Saving…",
  deleteAccount: "Delete account",
  cancel: "Cancel",
  phrasesTitle: "Phrases",
  searchPhrases: "Search phrases",
  all: "All",
  goToPathway: "Go to Pathway",
  upNext: "Up next",
  later: "Later",
  upgrade: "Upgrade",
  continue: "Continue",
  yourPath: "Your path",
  show: "Show",
  hide: "Hide",
  current: "Current",
} as const;

export type MessageKey = keyof typeof en;

const vi: Record<MessageKey, string> = {
  pathway: "Lộ trình", chats: "Trò chuyện", phrases: "Cụm từ", profile: "Hồ sơ", subscription: "Gói đăng ký", languageLearning: "Ngôn ngữ", suggestFeature: "Gợi ý tính năng", logOut: "Đăng xuất", terms: "Điều khoản", privacy: "Quyền riêng tư", freePlan: "Gói miễn phí", individual: "Cá nhân", premium: "Cao cấp", yourAccount: "Tài khoản của bạn", languageTitle: "Ngôn ngữ", languageDescription: "Chọn ngôn ngữ cho menu và nút. Bài học vẫn bằng tiếng Nhật.", searchLanguage: "Tìm ngôn ngữ", detected: "Đã nhận", saved: "Đã lưu", noLanguage: "Không có ngôn ngữ khớp với “{query}”", changePhoto: "Đổi ảnh", uploading: "Đang tải lên…", name: "Tên", email: "Email", saveChanges: "Lưu thay đổi", saving: "Đang lưu…", deleteAccount: "Xóa tài khoản", cancel: "Hủy", phrasesTitle: "Cụm từ", searchPhrases: "Tìm cụm từ", all: "Tất cả", goToPathway: "Về lộ trình", upNext: "Tiếp theo", later: "Để sau", upgrade: "Nâng cấp", continue: "Tiếp tục", yourPath: "Lộ trình của bạn", show: "Hiện", hide: "Ẩn", current: "Hiện tại",
};

const id: Record<MessageKey, string> = {
  pathway: "Jalur", chats: "Obrolan", phrases: "Frasa", profile: "Profil", subscription: "Langganan", languageLearning: "Bahasa", suggestFeature: "Usulkan fitur", logOut: "Keluar", terms: "Ketentuan", privacy: "Privasi", freePlan: "Paket gratis", individual: "Individual", premium: "Premium", yourAccount: "Akun Anda", languageTitle: "Bahasa", languageDescription: "Pilih bahasa untuk menu dan tombol. Pelajaran tetap dalam bahasa Jepang.", searchLanguage: "Cari bahasa", detected: "Terdeteksi", saved: "Tersimpan", noLanguage: "Tidak ada bahasa yang cocok dengan “{query}”", changePhoto: "Ganti foto", uploading: "Mengunggah…", name: "Nama", email: "Email", saveChanges: "Simpan perubahan", saving: "Menyimpan…", deleteAccount: "Hapus akun", cancel: "Batal", phrasesTitle: "Frasa", searchPhrases: "Cari frasa", all: "Semua", goToPathway: "Ke jalur", upNext: "Berikutnya", later: "Nanti", upgrade: "Tingkatkan", continue: "Lanjut", yourPath: "Jalur Anda", show: "Tampilkan", hide: "Sembunyikan", current: "Saat ini",
};

const ne: Record<MessageKey, string> = {
  pathway: "मार्ग", chats: "च्याट", phrases: "वाक्यांश", profile: "प्रोफाइल", subscription: "सदस्यता", languageLearning: "भाषा", suggestFeature: "सुझाव", logOut: "बाहिर निस्कनु", terms: "सर्तहरू", privacy: "गोपनीयता", freePlan: "निःशुल्क", individual: "व्यक्तिगत", premium: "प्रिमियम", yourAccount: "तपाईंको खाता", languageTitle: "भाषा", languageDescription: "मेनु र बटनको भाषा छान्नुहोस्। पाठ जापानीमै रहन्छ।", searchLanguage: "भाषा खोज्नुहोस्", detected: "पहिचान भयो", saved: "सुरक्षित भयो", noLanguage: "“{query}” सँग मिल्ने भाषा छैन", changePhoto: "फोटो बदल्नुहोस्", uploading: "अपलोड हुँदैछ…", name: "नाम", email: "इमेल", saveChanges: "परिवर्तन सुरक्षित गर्नुहोस्", saving: "सुरक्षित हुँदैछ…", deleteAccount: "खाता मेटाउनुहोस्", cancel: "रद्द", phrasesTitle: "वाक्यांश", searchPhrases: "वाक्यांश खोज्नुहोस्", all: "सबै", goToPathway: "मार्गमा जानुहोस्", upNext: "अर्को", later: "पछि", upgrade: "अपग्रेड", continue: "जारी राख्नुहोस्", yourPath: "तपाईंको मार्ग", show: "देखाउनुहोस्", hide: "लुकाउनुहोस्", current: "अहिले",
};

const my: Record<MessageKey, string> = {
  pathway: "လမ်းကြောင်း", chats: "စကားပြော", phrases: "စကားစု", profile: "ပရိုဖိုင်", subscription: "စာရင်းသွင်းမှု", languageLearning: "ဘာသာစကား", suggestFeature: "အကြံပြုရန်", logOut: "ထွက်ရန်", terms: "စည်းကမ်းများ", privacy: "ကိုယ်ရေးအချက်", freePlan: "အခမဲ့", individual: "တစ်ဦးချင်း", premium: "ပရီမီယံ", yourAccount: "သင့်အကောင့်", languageTitle: "ဘာသာစကား", languageDescription: "မီနူးနှင့် ခလုတ်များအတွက် ဘာသာစကား ရွေးပါ။ သင်ခန်းစာများ ဂျပန်ဘာသာဖြင့် ရှိနေမည်။", searchLanguage: "ဘာသာစကား ရှာရန်", detected: "တွေ့ရှိသည်", saved: "သိမ်းပြီး", noLanguage: "“{query}” နှင့် ကိုက်ညီသော ဘာသာစကား မရှိပါ", changePhoto: "ဓာတ်ပုံ ပြောင်းရန်", uploading: "တင်နေသည်…", name: "အမည်", email: "အီးမေးလ်", saveChanges: "သိမ်းရန်", saving: "သိမ်းနေသည်…", deleteAccount: "အကောင့် ဖျက်ရန်", cancel: "ပယ်ဖျက်", phrasesTitle: "စကားစု", searchPhrases: "စကားစု ရှာရန်", all: "အားလုံး", goToPathway: "လမ်းကြောင်းသို့", upNext: "နောက်တစ်ခု", later: "နောက်မှ", upgrade: "အဆင့်မြှင့်", continue: "ဆက်လုပ်ရန်", yourPath: "သင့်လမ်းကြောင်း", show: "ပြရန်", hide: "ဖျောက်ရန်", current: "လက်ရှိ",
};

const fil: Record<MessageKey, string> = {
  pathway: "Landas", chats: "Mga chat", phrases: "Mga parirala", profile: "Profile", subscription: "Subskripsyon", languageLearning: "Wika", suggestFeature: "Magmungkahi", logOut: "Mag-log out", terms: "Mga tuntunin", privacy: "Privacy", freePlan: "Libreng plan", individual: "Indibidwal", premium: "Premium", yourAccount: "Ang account mo", languageTitle: "Wika", languageDescription: "Piliin ang wika ng mga menu at button. Mananatili sa Japanese ang mga aralin.", searchLanguage: "Maghanap ng wika", detected: "Natukoy", saved: "Na-save", noLanguage: "Walang wikang tumutugma sa “{query}”", changePhoto: "Palitan ang larawan", uploading: "Ina-upload…", name: "Pangalan", email: "Email", saveChanges: "I-save", saving: "Sine-save…", deleteAccount: "Burahin ang account", cancel: "Kanselahin", phrasesTitle: "Mga parirala", searchPhrases: "Maghanap ng parirala", all: "Lahat", goToPathway: "Pumunta sa landas", upNext: "Susunod", later: "Mamaya", upgrade: "I-upgrade", continue: "Magpatuloy", yourPath: "Ang landas mo", show: "Ipakita", hide: "Itago", current: "Kasalukuyan",
};

const bn: Record<MessageKey, string> = {
  pathway: "পথ", chats: "চ্যাট", phrases: "বাক্যাংশ", profile: "প্রোফাইল", subscription: "সাবস্ক্রিপশন", languageLearning: "ভাষা", suggestFeature: "পরামর্শ দিন", logOut: "লগ আউট", terms: "শর্তাবলি", privacy: "গোপনীয়তা", freePlan: "ফ্রি প্ল্যান", individual: "ব্যক্তিগত", premium: "প্রিমিয়াম", yourAccount: "আপনার অ্যাকাউন্ট", languageTitle: "ভাষা", languageDescription: "মেনু ও বোতামের ভাষা বেছে নিন। পাঠ জাপানি ভাষাতেই থাকবে।", searchLanguage: "ভাষা খুঁজুন", detected: "শনাক্ত", saved: "সংরক্ষিত", noLanguage: "“{query}” এর সাথে কোনো ভাষা মেলেনি", changePhoto: "ছবি বদলান", uploading: "আপলোড হচ্ছে…", name: "নাম", email: "ইমেল", saveChanges: "সংরক্ষণ করুন", saving: "সংরক্ষণ হচ্ছে…", deleteAccount: "অ্যাকাউন্ট মুছুন", cancel: "বাতিল", phrasesTitle: "বাক্যাংশ", searchPhrases: "বাক্যাংশ খুঁজুন", all: "সব", goToPathway: "পথে যান", upNext: "পরেরটি", later: "পরে", upgrade: "আপগ্রেড", continue: "চালিয়ে যান", yourPath: "আপনার পথ", show: "দেখান", hide: "লুকান", current: "বর্তমান",
};

const ur: Record<MessageKey, string> = {
  pathway: "راستہ", chats: "چیٹس", phrases: "جملے", profile: "پروفائل", subscription: "سبسکرپشن", languageLearning: "زبان", suggestFeature: "تجویز", logOut: "لاگ آؤٹ", terms: "شرائط", privacy: "رازداری", freePlan: "مفت پلان", individual: "انفرادی", premium: "پریمیم", yourAccount: "آپ کا اکاؤنٹ", languageTitle: "زبان", languageDescription: "مینو اور بٹن کی زبان منتخب کریں۔ سبق جاپانی میں رہیں گے۔", searchLanguage: "زبان تلاش کریں", detected: "شناخت شدہ", saved: "محفوظ ہو گیا", noLanguage: "“{query}” سے کوئی زبان نہیں ملی", changePhoto: "تصویر بدلیں", uploading: "اپ لوڈ ہو رہی ہے…", name: "نام", email: "ای میل", saveChanges: "محفوظ کریں", saving: "محفوظ ہو رہا ہے…", deleteAccount: "اکاؤنٹ حذف کریں", cancel: "منسوخ", phrasesTitle: "جملے", searchPhrases: "جملے تلاش کریں", all: "سب", goToPathway: "راستے پر جائیں", upNext: "اگلا", later: "بعد میں", upgrade: "اپ گریڈ", continue: "جاری رکھیں", yourPath: "آپ کا راستہ", show: "دکھائیں", hide: "چھپائیں", current: "موجودہ",
};

const zh: Record<MessageKey, string> = {
  pathway: "路径", chats: "聊天", phrases: "短语", profile: "个人资料", subscription: "订阅", languageLearning: "语言", suggestFeature: "建议功能", logOut: "退出", terms: "条款", privacy: "隐私", freePlan: "免费计划", individual: "个人版", premium: "高级版", yourAccount: "你的账户", languageTitle: "语言", languageDescription: "选择菜单和按钮的语言。课程仍使用日语。", searchLanguage: "搜索语言", detected: "已检测", saved: "已保存", noLanguage: "没有与“{query}”匹配的语言", changePhoto: "更换照片", uploading: "正在上传…", name: "姓名", email: "邮箱", saveChanges: "保存更改", saving: "正在保存…", deleteAccount: "删除账户", cancel: "取消", phrasesTitle: "短语", searchPhrases: "搜索短语", all: "全部", goToPathway: "前往路径", upNext: "下一个", later: "稍后", upgrade: "升级", continue: "继续", yourPath: "你的路径", show: "显示", hide: "隐藏", current: "当前",
};

const ko: Record<MessageKey, string> = {
  pathway: "경로", chats: "채팅", phrases: "표현", profile: "프로필", subscription: "구독", languageLearning: "언어", suggestFeature: "기능 제안", logOut: "로그아웃", terms: "약관", privacy: "개인정보", freePlan: "무료 플랜", individual: "개인", premium: "프리미엄", yourAccount: "내 계정", languageTitle: "언어", languageDescription: "메뉴와 버튼의 언어를 고르세요. 수업은 일본어로 유지됩니다.", searchLanguage: "언어 검색", detected: "감지됨", saved: "저장됨", noLanguage: "“{query}”과 일치하는 언어가 없습니다", changePhoto: "사진 변경", uploading: "업로드 중…", name: "이름", email: "이메일", saveChanges: "변경 사항 저장", saving: "저장 중…", deleteAccount: "계정 삭제", cancel: "취소", phrasesTitle: "표현", searchPhrases: "표현 검색", all: "전체", goToPathway: "경로로 이동", upNext: "다음", later: "나중에", upgrade: "업그레이드", continue: "계속", yourPath: "내 경로", show: "보기", hide: "숨기기", current: "현재",
};

const pt: Record<MessageKey, string> = {
  pathway: "Percurso", chats: "Conversas", phrases: "Frases", profile: "Perfil", subscription: "Assinatura", languageLearning: "Idioma", suggestFeature: "Sugerir função", logOut: "Sair", terms: "Termos", privacy: "Privacidade", freePlan: "Plano grátis", individual: "Individual", premium: "Premium", yourAccount: "Sua conta", languageTitle: "Idioma", languageDescription: "Escolha o idioma dos menus e botões. As lições continuam em japonês.", searchLanguage: "Buscar idioma", detected: "Detectado", saved: "Salvo", noLanguage: "Nenhum idioma corresponde a “{query}”", changePhoto: "Trocar foto", uploading: "Enviando…", name: "Nome", email: "E-mail", saveChanges: "Salvar alterações", saving: "Salvando…", deleteAccount: "Excluir conta", cancel: "Cancelar", phrasesTitle: "Frases", searchPhrases: "Buscar frases", all: "Tudo", goToPathway: "Ir ao percurso", upNext: "A seguir", later: "Depois", upgrade: "Atualizar", continue: "Continuar", yourPath: "Seu percurso", show: "Mostrar", hide: "Ocultar", current: "Atual",
};

const es: Record<MessageKey, string> = {
  pathway: "Ruta", chats: "Chats", phrases: "Frases", profile: "Perfil", subscription: "Suscripción", languageLearning: "Idioma", suggestFeature: "Sugerir función", logOut: "Cerrar sesión", terms: "Términos", privacy: "Privacidad", freePlan: "Plan gratis", individual: "Individual", premium: "Premium", yourAccount: "Tu cuenta", languageTitle: "Idioma", languageDescription: "Elige el idioma de los menús y botones. Las lecciones siguen en japonés.", searchLanguage: "Buscar idioma", detected: "Detectado", saved: "Guardado", noLanguage: "Ningún idioma coincide con “{query}”", changePhoto: "Cambiar foto", uploading: "Subiendo…", name: "Nombre", email: "Correo", saveChanges: "Guardar cambios", saving: "Guardando…", deleteAccount: "Eliminar cuenta", cancel: "Cancelar", phrasesTitle: "Frases", searchPhrases: "Buscar frases", all: "Todo", goToPathway: "Ir a la ruta", upNext: "Siguiente", later: "Después", upgrade: "Mejorar", continue: "Continuar", yourPath: "Tu ruta", show: "Mostrar", hide: "Ocultar", current: "Actual",
};

const ru: Record<MessageKey, string> = {
  pathway: "Путь", chats: "Чаты", phrases: "Фразы", profile: "Профиль", subscription: "Подписка", languageLearning: "Язык", suggestFeature: "Предложить идею", logOut: "Выйти", terms: "Условия", privacy: "Конфиденциальность", freePlan: "Бесплатный", individual: "Индивидуальный", premium: "Премиум", yourAccount: "Ваш аккаунт", languageTitle: "Язык", languageDescription: "Выберите язык меню и кнопок. Уроки остаются на японском.", searchLanguage: "Поиск языка", detected: "Определён", saved: "Сохранено", noLanguage: "Нет языка по запросу «{query}»", changePhoto: "Сменить фото", uploading: "Загрузка…", name: "Имя", email: "Почта", saveChanges: "Сохранить", saving: "Сохранение…", deleteAccount: "Удалить аккаунт", cancel: "Отмена", phrasesTitle: "Фразы", searchPhrases: "Поиск фраз", all: "Все", goToPathway: "К пути", upNext: "Дальше", later: "Позже", upgrade: "Улучшить", continue: "Продолжить", yourPath: "Ваш путь", show: "Показать", hide: "Скрыть", current: "Сейчас",
};

const si: Record<MessageKey, string> = {
  pathway: "මාර්ගය", chats: "කතාබස්", phrases: "වාක්‍ය ඛණ්ඩ", profile: "පැතිකඩ", subscription: "දායකත්වය", languageLearning: "භාෂාව", suggestFeature: "යෝජනාව", logOut: "පිටවන්න", terms: "කොන්දේසි", privacy: "පෞද්ගලිකත්වය", freePlan: "නොමිලේ", individual: "තනි", premium: "ප්‍රිමියම්", yourAccount: "ඔබේ ගිණුම", languageTitle: "භාෂාව", languageDescription: "මෙනු සහ බොත්තම් සඳහා භාෂාව තෝරන්න. පාඩම් ජපන් භාෂාවෙන්ම පවතී.", searchLanguage: "භාෂාව සොයන්න", detected: "හඳුනාගත්", saved: "සුරකින ලදි", noLanguage: "“{query}” ට ගැළපෙන භාෂාවක් නැත", changePhoto: "ඡායාරූපය වෙනස් කරන්න", uploading: "උඩුගත වෙමින්…", name: "නම", email: "ඊමේල්", saveChanges: "සුරකින්න", saving: "සුරකිමින්…", deleteAccount: "ගිණුම මකන්න", cancel: "අවලංගු", phrasesTitle: "වාක්‍ය ඛණ්ඩ", searchPhrases: "වාක්‍ය ඛණ්ඩ සොයන්න", all: "සියල්ල", goToPathway: "මාර්ගයට යන්න", upNext: "ඊළඟ", later: "පසුව", upgrade: "උත්ශ්‍රේණි", continue: "ඉදිරියට", yourPath: "ඔබේ මාර්ගය", show: "පෙන්වන්න", hide: "සඟවන්න", current: "වත්මන්",
};

const mn: Record<MessageKey, string> = {
  pathway: "Зам", chats: "Чат", phrases: "Хэллэг", profile: "Профайл", subscription: "Захиалга", languageLearning: "Хэл", suggestFeature: "Санал", logOut: "Гарах", terms: "Нөхцөл", privacy: "Нууцлал", freePlan: "Үнэгүй", individual: "Хувийн", premium: "Премиум", yourAccount: "Таны бүртгэл", languageTitle: "Хэл", languageDescription: "Цэс ба товчны хэлийг сонгоно уу. Хичээлүүд япон хэл дээр үлдэнэ.", searchLanguage: "Хэл хайх", detected: "Танигдсан", saved: "Хадгалсан", noLanguage: "“{query}” гэсэн хэл олдсонгүй", changePhoto: "Зураг солих", uploading: "Байршуулж байна…", name: "Нэр", email: "Имэйл", saveChanges: "Хадгалах", saving: "Хадгалж байна…", deleteAccount: "Бүртгэл устгах", cancel: "Болих", phrasesTitle: "Хэллэг", searchPhrases: "Хэллэг хайх", all: "Бүгд", goToPathway: "Зам руу", upNext: "Дараах", later: "Дараа", upgrade: "Сайжруулах", continue: "Үргэлжлүүлэх", yourPath: "Таны зам", show: "Харуулах", hide: "Нуух", current: "Одоо",
};

export const messages: Record<Locale, Record<MessageKey, string>> = {
  en, vi, id, ne, my, fil, bn, ur, zh, ko, pt, es, ru, si, mn,
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function translate(locale: string, key: MessageKey, vars?: Record<string, string>) {
  const pack = isLocale(locale) ? messages[locale] : messages.en;
  let text = pack[key] ?? messages.en[key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, value);
  }
  return text;
}
