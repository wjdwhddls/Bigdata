"""
CSV → JSON 변환 스크립트
웹 앱에서 사용할 JSON 데이터 파일 생성
"""
import pandas as pd
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'data')
os.makedirs(OUT_DIR, exist_ok=True)

# 1. 고객 데이터 (customer_final_integrated + df_users 병합)
print("1. 고객 데이터 변환 중...")
customers = pd.read_csv(os.path.join(BASE_DIR, 'customer_final_integrated.csv'))
users = pd.read_csv(os.path.join(BASE_DIR, 'df_users.csv'), encoding='cp949')
merged = customers.merge(users[['idUser', 'Gender', 'Age', 'FamilyCount', 'MemberYN', 'AgeGroup']], on='idUser', how='left')

# AgeGroup을 "20대" 형식으로 변환
merged['AgeGroup'] = merged['AgeGroup'].apply(lambda x: f'{int(x)}대')

customers_json = merged.to_dict(orient='records')
with open(os.path.join(OUT_DIR, 'customers.json'), 'w', encoding='utf-8') as f:
    json.dump(customers_json, f, ensure_ascii=False)
print(f"   → customers.json ({len(customers_json)}건)")

# 2. CF 추천 데이터
print("2. 추천 데이터 변환 중...")
recs = pd.read_csv(os.path.join(BASE_DIR, 'individual_cf_recommendations.csv'), encoding='utf-8-sig')
recs_json = []
for _, row in recs.iterrows():
    items = []
    for i in range(1, 6):
        name = row.get(f'추천{i}위', '-')
        score = row.get(f'추천{i}위_점수', 0)
        if pd.notna(name) and name != '-':
            items.append({'name': str(name), 'score': round(float(score), 4) if pd.notna(score) else 0})
    recs_json.append({
        'idUser': row['idUser'],
        'ageGroup': row['AgeGroup'],
        'purchaseCount': int(row['구매아이템수']),
        'recommendations': items
    })

with open(os.path.join(OUT_DIR, 'recommendations.json'), 'w', encoding='utf-8') as f:
    json.dump(recs_json, f, ensure_ascii=False)
print(f"   → recommendations.json ({len(recs_json)}건)")

# 3. 상품 카탈로그 (소분류 기준 유니크)
print("3. 상품 카탈로그 변환 중...")
items = pd.read_csv(os.path.join(BASE_DIR, 'clean_item.csv'))
products = items.groupby('ItemSmallName').agg({
    'ItemLargeName': 'first',
    'ItemMiddleName': 'first',
    'ItemSmallCode': 'first'
}).reset_index()
products_json = products.rename(columns={
    'ItemSmallName': 'name',
    'ItemLargeName': 'category',
    'ItemMiddleName': 'subCategory',
    'ItemSmallCode': 'code'
}).to_dict(orient='records')

with open(os.path.join(OUT_DIR, 'products.json'), 'w', encoding='utf-8') as f:
    json.dump(products_json, f, ensure_ascii=False)
print(f"   → products.json ({len(products_json)}건)")

# 4. 대시보드 통계 사전 계산
print("4. 대시보드 통계 계산 중...")
stats = {
    'totalCustomers': len(merged),
    'totalRevenue': int(merged['total_spend'].sum()),
    'avgOrderAmount': round(merged['avg_order_amount'].mean()),
    'avgOrderCount': round(merged['total_order_count'].mean(), 1),
    'avgDelayRate': round(merged['delay_rate'].mean(), 2),
    'ageDistribution': merged['AgeGroup'].value_counts().sort_index().to_dict(),
    'genderDistribution': merged['Gender'].value_counts().to_dict(),
    'spendDistribution': {
        'bins': list(range(0, 8000001, 500000)),
        'counts': pd.cut(merged['total_spend'], bins=range(0, 8000001, 500000)).value_counts().sort_index().values.tolist()
    },
    'delayRateDistribution': {
        'bins': list(range(0, 31, 3)),
        'counts': pd.cut(merged['delay_rate'], bins=range(0, 31, 3)).value_counts().sort_index().values.tolist()
    },
    'ageGroupStats': {}
}

for ag in sorted(merged['AgeGroup'].unique()):
    group = merged[merged['AgeGroup'] == ag]
    stats['ageGroupStats'][ag] = {
        'count': len(group),
        'avgSpend': round(group['total_spend'].mean()),
        'avgOrderCount': round(group['total_order_count'].mean(), 1),
        'avgOrderAmount': round(group['avg_order_amount'].mean()),
        'avgDelayRate': round(group['delay_rate'].mean(), 2),
        'avgItemCount': round(group['avg_order_item_count'].mean(), 2)
    }

with open(os.path.join(OUT_DIR, 'stats.json'), 'w', encoding='utf-8') as f:
    json.dump(stats, f, ensure_ascii=False)
print(f"   → stats.json")

print("\n✓ 모든 데이터 변환 완료!")
print(f"  출력 경로: {OUT_DIR}")
