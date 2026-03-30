-- Mori Digital Atelier — Products
INSERT INTO products (name, description, image_url) VALUES
(
  '深森のローストブレンド',
  '標高1,800mのエチオピア・イルガチェフェ農園から直仕入れ。杉の香木を思わせる深みとベリー系の甘い余韻が特徴のシングルオリジン。中細挽き200g入りでお届けします。',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80'
),
(
  '宇治・特選玉露',
  '京都・宇治の老舗茶農家から直接届く最高品位の玉露。一番摘みの若芽だけを丁寧に手摘みし、鮮やかな翠緑と深い旨みを閉じ込めました。30g入り。',
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80'
),
(
  '植物の呼吸・化粧水',
  '国内農園で育てた有機ラベンダー・カモミール・ローズヒップを低温蒸留。天然成分100%、防腐剤不使用の敏感肌向けトナー。森の朝露のような使用感。100ml入り。',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80'
);

-- Plans for 深森のローストブレンド (product_id = 1)
INSERT INTO subscription_plans (product_id, name, price, interval_label) VALUES
(1, '単品購入',         3200, NULL),
(1, '月1回定期便',      2880, '月1回'),
(1, '2週間ごと定期便',  2680, '2週間ごと');

-- Plans for 宇治・特選玉露 (product_id = 2)
INSERT INTO subscription_plans (product_id, name, price, interval_label) VALUES
(2, '単品購入',         4800, NULL),
(2, '月1回定期便',      4320, '月1回'),
(2, '2週間ごと定期便',  4000, '2週間ごと');

-- Plans for 植物の呼吸・化粧水 (product_id = 3)
INSERT INTO subscription_plans (product_id, name, price, interval_label) VALUES
(3, '単品購入',         5800, NULL),
(3, '月1回定期便',      5220, '月1回'),
(3, '2週間ごと定期便',  4800, '2週間ごと');
