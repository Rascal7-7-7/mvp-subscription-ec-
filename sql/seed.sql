-- Products
INSERT INTO products (name, description, image_url) VALUES
(
  'オーガニックコーヒー豆',
  '標高1,500m以上のシングルオリジン農園から直接仕入れた有機栽培コーヒー豆。フルーティな酸味と深いコクが特徴で、毎朝のコーヒータイムを豊かにします。100g入り。',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80'
),
(
  'コールドプレスプロテイン',
  '低温圧搾法で製造した植物性プロテインパウダー。大豆・えんどう豆・ヘンプを黄金比でブレンド。添加物不使用、タンパク質含有量20g/杯。バニラ風味。',
  'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80'
),
(
  '国産ハーブブレンドティー',
  '国内農園で無農薬栽培したハーブを独自ブレンド。カモミール・ラベンダー・レモンバームの組み合わせが、リラックスした夜の時間をサポートします。20袋入り。',
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80'
);

-- Plans for オーガニックコーヒー豆 (product_id = 1)
INSERT INTO subscription_plans (product_id, name, price, interval_label) VALUES
(1, '単品購入',       2980, NULL),
(1, '月1回定期便',    2680, '月1回'),
(1, '2週間ごと定期便', 2480, '2週間ごと');

-- Plans for コールドプレスプロテイン (product_id = 2)
INSERT INTO subscription_plans (product_id, name, price, interval_label) VALUES
(2, '単品購入',       4980, NULL),
(2, '月1回定期便',    4480, '月1回'),
(2, '2週間ごと定期便', 4180, '2週間ごと');

-- Plans for 国産ハーブブレンドティー (product_id = 3)
INSERT INTO subscription_plans (product_id, name, price, interval_label) VALUES
(3, '単品購入',       1980, NULL),
(3, '月1回定期便',    1780, '月1回'),
(3, '2週間ごと定期便', 1680, '2週間ごと');
