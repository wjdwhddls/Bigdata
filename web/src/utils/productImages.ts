export interface ProductVisual {
  emoji: string
  bgColor: string
  image?: string
}

const productMap: Record<string, ProductVisual> = {
  // 수산
  갈치: { emoji: '🐟', bgColor: '#dbeafe', image: 'https://images.unsplash.com/photo-1510130113581-82d5e1eff4b6?w=400&q=80' },
  고등어: { emoji: '🐟', bgColor: '#bfdbfe', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&q=80' },
  생선: { emoji: '🐟', bgColor: '#bfdbfe', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80' },
  멸치: { emoji: '🐟', bgColor: '#e0f2fe', image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&q=80' },
  북어: { emoji: '🐟', bgColor: '#dbeafe', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80' },
  조기: { emoji: '🐟', bgColor: '#bfdbfe', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80' },
  낙지: { emoji: '🐙', bgColor: '#fecdd3', image: 'https://images.unsplash.com/photo-1565680018093-ebb6e41db76e?w=400&q=80' },
  오징어: { emoji: '🦑', bgColor: '#fecdd3', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  전복: { emoji: '🐚', bgColor: '#e0f2fe', image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&q=80' },

  // 축산
  계란: { emoji: '🥚', bgColor: '#fef3c7', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80' },
  닭고기: { emoji: '🍗', bgColor: '#fed7aa', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80' },
  돼지고기: { emoji: '🥩', bgColor: '#fecaca', image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&q=80' },
  쇠고기: { emoji: '🥩', bgColor: '#fecaca', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80' },

  // 채소
  고구마: { emoji: '🍠', bgColor: '#fde68a', image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&q=80' },
  김치: { emoji: '🥬', bgColor: '#fecaca', image: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=400&q=80' },
  깻잎: { emoji: '🌿', bgColor: '#d1fae5', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80' },
  나물: { emoji: '🥗', bgColor: '#d1fae5', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80' },
  도라지: { emoji: '🌱', bgColor: '#d1fae5', image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&q=80' },
  상추: { emoji: '🥬', bgColor: '#d1fae5', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80' },
  콩나물: { emoji: '🌱', bgColor: '#d1fae5', image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&q=80' },
  토마토: { emoji: '🍅', bgColor: '#fecaca', image: 'https://images.unsplash.com/photo-1546470427-0d4db154cdb8?w=400&q=80' },
  파: { emoji: '🧅', bgColor: '#d1fae5', image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&q=80' },
  파프리카: { emoji: '🫑', bgColor: '#bbf7d0', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80' },
  풋고추: { emoji: '🌶️', bgColor: '#d1fae5', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&q=80' },
  호박: { emoji: '🎃', bgColor: '#fed7aa', image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&q=80' },

  // 과일
  과일: { emoji: '🍇', bgColor: '#e9d5ff', image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=80' },
  딸기: { emoji: '🍓', bgColor: '#fecdd3', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80' },
  배: { emoji: '🍐', bgColor: '#fef9c3', image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=400&q=80' },
  블루베리: { emoji: '🫐', bgColor: '#e9d5ff', image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80' },
  사과: { emoji: '🍎', bgColor: '#fecaca', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80' },
  수박: { emoji: '🍉', bgColor: '#d1fae5', image: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&q=80' },
  참외: { emoji: '🍈', bgColor: '#fef9c3', image: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&q=80' },
  키위: { emoji: '🥝', bgColor: '#bbf7d0', image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400&q=80' },

  // 가공식품
  국수: { emoji: '🍜', bgColor: '#fed7aa', image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80' },
  김: { emoji: '🌿', bgColor: '#bbf7d0', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  냉동: { emoji: '🧊', bgColor: '#e0f2fe', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80' },
  당면: { emoji: '🍜', bgColor: '#fef9c3', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80' },
  드레싱: { emoji: '🫗', bgColor: '#fef3c7', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80' },
  라면: { emoji: '🍜', bgColor: '#fed7aa', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80' },
  마른안주: { emoji: '🍿', bgColor: '#fef9c3', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80' },
  맛김: { emoji: '🌿', bgColor: '#bbf7d0', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  미역: { emoji: '🌿', bgColor: '#bbf7d0', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  밤: { emoji: '🌰', bgColor: '#fde68a', image: 'https://images.unsplash.com/photo-1604450520564-e1041e8e2be2?w=400&q=80' },
  빵: { emoji: '🍞', bgColor: '#fed7aa', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  소시지: { emoji: '🌭', bgColor: '#fed7aa', image: 'https://images.unsplash.com/photo-1612871689353-ccd2e3a0e26b?w=400&q=80' },
  스낵: { emoji: '🍪', bgColor: '#fde68a', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80' },
  땅콩: { emoji: '🥜', bgColor: '#fde68a', image: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400&q=80' },
  아몬드: { emoji: '🥜', bgColor: '#fef3c7', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80' },
  잼: { emoji: '🍯', bgColor: '#fef3c7', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80' },
  조미료: { emoji: '🧂', bgColor: '#f3f4f6', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&q=80' },
  즉석: { emoji: '🍱', bgColor: '#fed7aa', image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400&q=80' },
  치즈: { emoji: '🧀', bgColor: '#fef3c7', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80' },
  카레: { emoji: '🍛', bgColor: '#fed7aa', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  파스타: { emoji: '🍝', bgColor: '#fed7aa', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80' },

  // 음료
  커피: { emoji: '☕', bgColor: '#fde68a', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
  탄산음료: { emoji: '🥤', bgColor: '#fecdd3', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80' },
  혼합및이온음료: { emoji: '🧃', bgColor: '#e0f2fe', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80' },

  // 생수
  생수: { emoji: '💧', bgColor: '#e0f2fe', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80' },
}

const fallback: ProductVisual = { emoji: '🛒', bgColor: '#f3f4f6' }

export function getProductVisual(name: string): ProductVisual {
  return productMap[name] || fallback
}
