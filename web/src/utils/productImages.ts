export interface ProductVisual {
  emoji: string
  bgColor: string
  image?: string
}

const productMap: Record<string, ProductVisual> = {
  // 수산
  갈치: { emoji: '🐟', bgColor: '#dbeafe', image: 'images/products/갈치.jpg' },
  고등어: { emoji: '🐟', bgColor: '#bfdbfe', image: 'images/products/고등어.webp' },
  생선: { emoji: '🐟', bgColor: '#bfdbfe', image: 'images/products/생선.jpg' },
  멸치: { emoji: '🐟', bgColor: '#e0f2fe', image: 'images/products/멸치.jpg' },
  북어: { emoji: '🐟', bgColor: '#dbeafe', image: 'images/products/북어.jpeg' },
  조기: { emoji: '🐟', bgColor: '#bfdbfe', image: 'images/products/조기.jpg' },
  낙지: { emoji: '🐙', bgColor: '#fecdd3', image: 'images/products/낙지.jpg' },
  오징어: { emoji: '🦑', bgColor: '#fecdd3', image: 'images/products/오징어.png' },
  전복: { emoji: '🐚', bgColor: '#e0f2fe', image: 'images/products/전복.jpeg' },

  // 축산
  계란: { emoji: '🥚', bgColor: '#fef3c7', image: 'images/products/계란.jpg' },
  닭고기: { emoji: '🍗', bgColor: '#fed7aa', image: 'images/products/닭고기.webp' },
  돼지고기: { emoji: '🥩', bgColor: '#fecaca', image: 'images/products/돼지고기.jpg' },
  쇠고기: { emoji: '🥩', bgColor: '#fecaca', image: 'images/products/쇠고기.webp' },

  // 채소
  고구마: { emoji: '🍠', bgColor: '#fde68a', image: 'images/products/고구마.jpg' },
  김치: { emoji: '🥬', bgColor: '#fecaca', image: 'images/products/김치.jpg' },
  깻잎: { emoji: '🌿', bgColor: '#d1fae5', image: 'images/products/깻잎.jpg' },
  나물: { emoji: '🥗', bgColor: '#d1fae5', image: 'images/products/나물.jpg' },
  도라지: { emoji: '🌱', bgColor: '#d1fae5', image: 'images/products/도라지.png' },
  상추: { emoji: '🥬', bgColor: '#d1fae5', image: 'images/products/상추.png' },
  콩나물: { emoji: '🌱', bgColor: '#d1fae5', image: 'images/products/콩나물.jpeg' },
  토마토: { emoji: '🍅', bgColor: '#fecaca', image: 'images/products/토마토.jpg' },
  파: { emoji: '🧅', bgColor: '#d1fae5', image: 'images/products/파.jpeg' },
  파프리카: { emoji: '🫑', bgColor: '#bbf7d0', image: 'images/products/파프리카.jpg' },
  풋고추: { emoji: '🌶️', bgColor: '#d1fae5', image: 'images/products/풋고추.jpg' },
  호박: { emoji: '🎃', bgColor: '#fed7aa', image: 'images/products/호박.jpeg' },

  // 과일
  과일: { emoji: '🍇', bgColor: '#e9d5ff', image: 'images/products/과일.jpeg' },
  딸기: { emoji: '🍓', bgColor: '#fecdd3', image: 'images/products/딸기.jpg' },
  배: { emoji: '🍐', bgColor: '#fef9c3', image: 'images/products/배.jpg' },
  블루베리: { emoji: '🫐', bgColor: '#e9d5ff', image: 'images/products/블루베리.jpg' },
  사과: { emoji: '🍎', bgColor: '#fecaca', image: 'images/products/사과.jpeg' },
  수박: { emoji: '🍉', bgColor: '#d1fae5', image: 'images/products/수박.jpg' },
  참외: { emoji: '🍈', bgColor: '#fef9c3', image: 'images/products/참외.jpg' },
  키위: { emoji: '🥝', bgColor: '#bbf7d0', image: 'images/products/키위.webp' },

  // 가공식품
  국수: { emoji: '🍜', bgColor: '#fed7aa', image: 'images/products/국수.webp' },
  김: { emoji: '🌿', bgColor: '#bbf7d0', image: 'images/products/김.jpg' },
  냉동: { emoji: '🧊', bgColor: '#e0f2fe', image: 'images/products/냉동.jpg' },
  당면: { emoji: '🍜', bgColor: '#fef9c3', image: 'images/products/당면.jpg' },
  드레싱: { emoji: '🫗', bgColor: '#fef3c7', image: 'images/products/드레싱.webp' },
  라면: { emoji: '🍜', bgColor: '#fed7aa', image: 'images/products/라면.jpeg' },
  마른안주: { emoji: '🍿', bgColor: '#fef9c3', image: 'images/products/마른안주.jpeg' },
  맛김: { emoji: '🌿', bgColor: '#bbf7d0', image: 'images/products/맛김.jpg' },
  미역: { emoji: '🌿', bgColor: '#bbf7d0', image: 'images/products/미역.webp' },
  밤: { emoji: '🌰', bgColor: '#fde68a', image: 'images/products/밤.jpg' },
  빵: { emoji: '🍞', bgColor: '#fed7aa', image: 'images/products/빵.webp' },
  소시지: { emoji: '🌭', bgColor: '#fed7aa', image: 'images/products/소시지.jpg' },
  스낵: { emoji: '🍪', bgColor: '#fde68a', image: 'images/products/스낵.avif' },
  땅콩: { emoji: '🥜', bgColor: '#fde68a', image: 'images/products/땅콩.jpg' },
  아몬드: { emoji: '🥜', bgColor: '#fef3c7', image: 'images/products/아몬드.jpg' },
  잼: { emoji: '🍯', bgColor: '#fef3c7', image: 'images/products/잼.jpg' },
  조미료: { emoji: '🧂', bgColor: '#f3f4f6', image: 'images/products/조미료.jpeg' },
  즉석: { emoji: '🍱', bgColor: '#fed7aa', image: 'images/products/즉석.jpg' },
  치즈: { emoji: '🧀', bgColor: '#fef3c7', image: 'images/products/치즈.jpg' },
  카레: { emoji: '🍛', bgColor: '#fed7aa', image: 'images/products/카레.jpg' },
  파스타: { emoji: '🍝', bgColor: '#fed7aa', image: 'images/products/파스타.jpg' },

  // 음료
  커피: { emoji: '☕', bgColor: '#fde68a', image: 'images/products/커피.webp' },
  탄산음료: { emoji: '🥤', bgColor: '#fecdd3', image: 'images/products/탄산음료.jpeg' },
  혼합및이온음료: { emoji: '🧃', bgColor: '#e0f2fe', image: 'images/products/혼합및이온음료.jpg' },

  // 생수
  생수: { emoji: '💧', bgColor: '#e0f2fe', image: 'images/products/생수.jpg' },

  // 건강기능식품
  종합비타민: { emoji: '💊', bgColor: '#fef3c7', image: 'images/products/종합비타민.jpg' },
  비타민C: { emoji: '🍊', bgColor: '#fed7aa', image: 'images/products/비타민C.jpg' },
  오메가3: { emoji: '🐟', bgColor: '#dbeafe', image: 'images/products/오메가3.avif' },
  유산균: { emoji: '🦠', bgColor: '#d1fae5', image: 'images/products/유산균.avif' },
  루테인: { emoji: '👁️', bgColor: '#e9d5ff', image: 'images/products/루테인.jpg' },
  홍삼: { emoji: '🫚', bgColor: '#fecaca', image: 'images/products/홍삼.jpg' },
  콜라겐: { emoji: '✨', bgColor: '#fecdd3', image: 'images/products/콜라겐.png' },
  '칼슘 마그네슘': { emoji: '🦴', bgColor: '#e0f2fe', image: 'images/products/칼슘 마그네슘.jpg' },
  밀크씨슬: { emoji: '🌿', bgColor: '#bbf7d0', image: 'images/products/밀크씨슬.jpg' },
  프로폴리스: { emoji: '🐝', bgColor: '#fef9c3', image: 'images/products/프로폴리스.jpg' },
}

const fallback: ProductVisual = { emoji: '🛒', bgColor: '#f3f4f6' }

export function getProductVisual(name: string): ProductVisual {
  const visual = productMap[name] || fallback
  if (visual.image) {
    return { ...visual, image: `${import.meta.env.BASE_URL}${visual.image}` }
  }
  return visual
}
