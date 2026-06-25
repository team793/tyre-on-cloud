export type Lang = 'th' | 'en';

const translations = {
  th: {
    nav: {
      shop: 'ค้นหายาง',
      dealers: 'ดีลเลอร์',
      contact: 'ติดต่อเรา',
      shopNow: 'ซื้อยางเลย',
      menu: 'เมนู',
      close: 'ปิด',
    },
    hero: {
      promo: '🔥 จัดส่งฟรีทั่วประเทศ เมื่อซื้อครบ 4 เส้น ถึงสิ้นเดือนนี้!',
      promoCta: 'ดูโปรโมชั่น',
      eyebrow: 'ยางรถยนต์คุณภาพสูง · 40+ แบรนด์ · จัดส่งทั่วประเทศไทย',
      h1a: 'ยางที่ใช่',
      h1b: 'สำหรับทุกการเดินทาง',
      sub: 'ค้นหายางตามขนาด รุ่นรถ หรือทะเบียน จาก 40+ แบรนด์ระดับโลก มีสินค้าพร้อมส่ง จัดส่งถึงมือคุณทั่วประเทศ',
      cta: 'ค้นหายาง',
      dealer: 'พอร์ทัลดีลเลอร์',
      line: 'สอบถามผ่าน LINE',
      imageAlt: 'ภาพโปรโมชั่น',
      imagePlaceholder: 'อัพเดทรูปโปรโมชั่น\nได้ที่นี่',
      stats: {
        tyres: 'เส้น จัดส่งแล้ว',
        dealers: 'ดีลเลอร์ทั่วไทย',
        rating: 'คะแนนความพึงพอใจ',
      },
      brands: 'แบรนด์ที่เราจำหน่าย',
    },
    social: {
      eyebrow: 'ได้รับความไว้วางใจจากลูกค้าทั่วประเทศ',
      title: 'จากผู้ใช้รถทั่วไป ถึงดีลเลอร์ระดับชาติ',
      tyres: 'เส้น จัดจำหน่ายแล้ว',
      tyreSub: 'ข้ามคลังสินค้า 2 แห่งทั่วประเทศ ทุก order ได้รับยางตรงสเปค',
      rating: '/ 5',
      ratingCount: 'จากรีวิวลูกค้าจริงกว่า 12,400 รายการ',
      wholesale: 'ราคาส่ง ตั้งแต่ 10 เส้น',
      tier: 'ราคาแบ่งตาม 1–9 · 10–39 · 40+ เส้น',
      review: '"สั่งยาง 225/45R17 วันจันทร์ รับของวันพุธ ใส่รถได้พอดีมาก คุ้มค่ามาก ประทับใจมากครับ"',
      reviewer: 'คุณสมชาย · กรุงเทพฯ · Honda Civic',
      dispatch: 'จัดส่งเฉลี่ย 2–3 วัน',
      dispatchSub: 'คลังสินค้า กรุงเทพฯ และปริมณฑล',
    },
    footer: {
      tagline: 'ยางรถยนต์คุณภาพสูง ราคาดี จัดส่งทั่วประเทศไทย',
      shop: 'ร้านค้า',
      browse: 'เลือกซื้อยาง',
      fitment: 'ค้นหาตามรุ่นรถ',
      dealer: 'ดีลเลอร์',
      portal: 'พอร์ทัลดีลเลอร์',
      contact: 'ติดต่อเรา',
      lineOA: 'LINE Official',
      phone: 'โทรศัพท์',
      rights: 'สงวนลิขสิทธิ์',
      payment: 'ช่องทางชำระเงิน',
      address: 'กรุงเทพมหานคร ประเทศไทย',
    },
    visualizer: {
      eyebrow: 'เลือกประเภทรถ เราจัดการสเปคยางให้',
      title: 'เลือกแพลตฟอร์มของคุณ',
      sedan: 'รถเก๋ง',
      suv: 'รถ SUV',
      sports: 'รถสปอร์ต',
      sedanRationale: 'ยางสมดุลทั้งความนุ่มและการยึดเกาะ เหมาะสำหรับการขับขี่ในเมืองและทางไกล',
      suvRationale: 'ไซด์วอลล์แข็งแรง หน้ายางกว้าง รองรับน้ำหนักตัวรถสูงและการขับขี่ออฟโรดเบา',
      sportsRationale: 'คอมปาวด์แข็ง หน้ายางกว้าง เพื่อความเสถียรในโค้งความเร็วสูงและการใช้งานบนสนาม',
      size: 'ขนาดยาง',
      speedRating: 'ค่าความเร็ว',
      loadIndex: 'ค่าน้ำหนัก',
      tyreType: 'ประเภทยาง',
      shopLink: 'ดูยางสำหรับ',
      summer: 'ซัมเมอร์',
      winter: 'ฤดูฝน',
      allSeason: 'ออลซีซั่น',
    },
    finder: {
      title: 'ค้นหายางรถยนต์',
      sub: 'ค้นหาจากขนาดยาง รุ่นรถ หรือเลขทะเบียน',
      bySize: 'ค้นหาตามขนาด',
      byVehicle: 'ค้นหาตามรุ่นรถ',
      byPlate: 'เลขทะเบียน',
      width: 'ความกว้าง',
      profile: 'โปรไฟล์',
      rimSize: 'ขนาดล้อ',
      selectWidth: 'เลือกความกว้าง',
      selectProfile: 'เลือกโปรไฟล์',
      selectWidthFirst: 'เลือกความกว้างก่อน',
      selectRim: 'เลือกขนาดล้อ',
      selectProfileFirst: 'เลือกโปรไฟล์ก่อน',
      year: 'ปี',
      make: 'ยี่ห้อ',
      model: 'รุ่น',
      option: 'ตัวเลือก',
      selectYear: 'เลือกปี',
      selectMake: 'เลือกยี่ห้อ',
      selectYearFirst: 'เลือกปีก่อน',
      selectModel: 'เลือกรุ่น',
      selectMakeFirst: 'เลือกยี่ห้อก่อน',
      selectOption: 'เลือกตัวเลือก',
      selectModelFirst: 'เลือกรุ่นก่อน',
      plateLabel: 'เลขทะเบียนรถ',
      platePlaceholder: 'เช่น กข 1234',
      lookUp: 'ค้นหา',
      searching: 'กำลังค้นหา…',
      notFound: 'ไม่พบข้อมูลทะเบียนนี้ ลอง',
      searchBySize: 'ค้นหาตามขนาด',
      instead: 'แทน',
      selectSize: 'เลือกขนาดยางก่อน',
      showTyres: 'แสดงยาง',
      matching: 'รายการที่ตรงกัน',
      tryAgain: 'โหลดไม่ได้ — ลองอีกครั้ง',
    },
  },
  en: {
    nav: {
      shop: 'Shop',
      dealers: 'Dealers',
      contact: 'Contact',
      shopNow: 'Shop Tyres',
      menu: 'Menu',
      close: 'Close',
    },
    hero: {
      promo: '🔥 Free nationwide delivery on 4 or more tyres — this month only!',
      promoCta: 'See Deals',
      eyebrow: 'Premium Tyres · 40+ Brands · Nationwide Delivery',
      h1a: 'The right tyre',
      h1b: 'for every journey.',
      sub: 'Search by size, vehicle, or plate number. 40+ global brands in stock. Fast delivery across Thailand.',
      cta: 'Shop Tyres',
      dealer: 'Dealer Portal',
      line: 'Chat on LINE',
      imageAlt: 'Promotion image',
      imagePlaceholder: 'Update promotion\nimage here',
      stats: {
        tyres: 'Tyres shipped',
        dealers: 'Dealer accounts',
        rating: 'Avg. rating',
      },
      brands: 'Brands we carry',
    },
    social: {
      eyebrow: 'Trusted across Thailand',
      title: 'From individual drivers to national dealerships.',
      tyres: 'Tyres distributed',
      tyreSub: 'Across 2 warehouses nationwide — exact fitment every order.',
      rating: ' / 5',
      ratingCount: '12,400+ verified customer reviews',
      wholesale: 'Wholesale from 10 units',
      tier: '1–9 · 10–39 · 40+ unit price tiers',
      review: '"Ordered 225/45R17 on Monday, received Wednesday. Perfect fit, great value — highly recommend."',
      reviewer: 'Somchai K. · Bangkok · Honda Civic',
      dispatch: '2–3 day average dispatch',
      dispatchSub: 'Warehouses in Bangkok and Greater Bangkok',
    },
    footer: {
      tagline: 'Premium tyres, great prices, delivered across Thailand.',
      shop: 'Shop',
      browse: 'Browse Tyres',
      fitment: 'Vehicle Fitment',
      dealer: 'Dealers',
      portal: 'Dealer Portal',
      contact: 'Contact',
      lineOA: 'LINE Official',
      phone: 'Phone',
      rights: 'All rights reserved',
      payment: 'Payment methods',
      address: 'Bangkok, Thailand',
    },
    visualizer: {
      eyebrow: "Pick your platform, we'll spec the rubber.",
      title: 'Fitment, not guesswork.',
      sedan: 'Sedan',
      suv: 'SUV',
      sports: 'Sports',
      sedanRationale: 'Balanced comfort and grip for daily commuting, light cargo, and year-round confidence.',
      suvRationale: 'Reinforced sidewalls and a wider footprint for higher curb weight and light off-road transitions.',
      sportsRationale: 'Stiffer compound and a wider contact patch for high-speed cornering stability and track-day confidence.',
      size: 'Size',
      speedRating: 'Speed rating',
      loadIndex: 'Load index',
      tyreType: 'Tyre type',
      shopLink: 'Shop',
      summer: 'Summer',
      winter: 'Rainy',
      allSeason: 'All Season',
    },
    finder: {
      title: 'Find your tyre',
      sub: 'Search by size, vehicle, or plate number',
      bySize: 'Search by Size',
      byVehicle: 'Search by Vehicle',
      byPlate: 'Number Plate',
      width: 'Width',
      profile: 'Profile',
      rimSize: 'Rim size',
      selectWidth: 'Select width',
      selectProfile: 'Select profile',
      selectWidthFirst: 'Select width first',
      selectRim: 'Select rim',
      selectProfileFirst: 'Select profile first',
      year: 'Year',
      make: 'Make',
      model: 'Model',
      option: 'Option',
      selectYear: 'Select year',
      selectMake: 'Select make',
      selectYearFirst: 'Select year first',
      selectModel: 'Select model',
      selectMakeFirst: 'Select make first',
      selectOption: 'Select option',
      selectModelFirst: 'Select model first',
      plateLabel: 'Registration number',
      platePlaceholder: 'e.g. กข 1234',
      lookUp: 'Look up',
      searching: 'Searching…',
      notFound: "Couldn't match that registration. Try",
      searchBySize: 'searching by size',
      instead: 'instead.',
      selectSize: 'Select a tyre size to search',
      showTyres: 'Show',
      matching: 'Matching',
      tryAgain: "Couldn't load matches — try again",
    },
  },
};

export type Translations = {
  nav: { shop: string; dealers: string; contact: string; shopNow: string; menu: string; close: string };
  hero: {
    promo: string; promoCta: string; eyebrow: string; h1a: string; h1b: string;
    sub: string; cta: string; dealer: string; line: string; imageAlt: string;
    imagePlaceholder: string; stats: { tyres: string; dealers: string; rating: string }; brands: string;
  };
  social: {
    eyebrow: string; title: string; tyres: string; tyreSub: string; rating: string;
    ratingCount: string; wholesale: string; tier: string; review: string;
    reviewer: string; dispatch: string; dispatchSub: string;
  };
  footer: {
    tagline: string; shop: string; browse: string; fitment: string; dealer: string;
    portal: string; contact: string; lineOA: string; phone: string; rights: string;
    payment: string; address: string;
  };
  visualizer: {
    eyebrow: string; title: string; sedan: string; suv: string; sports: string;
    sedanRationale: string; suvRationale: string; sportsRationale: string;
    size: string; speedRating: string; loadIndex: string; tyreType: string;
    shopLink: string; summer: string; winter: string; allSeason: string;
  };
  finder: {
    title: string; sub: string; bySize: string; byVehicle: string; byPlate: string;
    width: string; profile: string; rimSize: string; selectWidth: string;
    selectProfile: string; selectWidthFirst: string; selectRim: string; selectProfileFirst: string;
    year: string; make: string; model: string; option: string; selectYear: string;
    selectMake: string; selectYearFirst: string; selectModel: string; selectMakeFirst: string;
    selectOption: string; selectModelFirst: string; plateLabel: string; platePlaceholder: string;
    lookUp: string; searching: string; notFound: string; searchBySize: string; instead: string;
    selectSize: string; showTyres: string; matching: string; tryAgain: string;
  };
};

export { translations };
