-- システムマスタ
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('POS',       '店舗POS管理',     'Store POS',        '🖥️',  '#1a56db', '店舗',     1);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('INVENTORY', '在庫管理',        'Inventory',        '📊',  '#1a56db', '店舗',     2);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('SHIFT',     'シフト管理',      'Shift Mgmt',       '📅',  '#1a56db', '店舗',     3);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('SALES_RPT', '売上レポート',    'Sales Report',     '📈',  '#1a56db', '店舗',     4);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('CATALOG',   '商品カタログ',    'Product Catalog',  '🔍',  '#7e3af2', '本部_商品部', 5);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('ACCOUNT',   '経理・会計',      'Accounting',       '💰',  '#0694a2', '本部_会計', 6);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('INVOICE',   '請求管理',        'Invoice Mgmt',     '📑',  '#0694a2', '本部_会計', 7);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('BUDGET',    '予算管理',        'Budget',           '📉',  '#0694a2', '本部_会計', 8);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('TRADE',     '貿易管理',        'Trade Mgmt',       '🚢',  '#057a55', '本部_貿易', 9);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('CUSTOMS',   '通関書類',        'Customs Docs',     '📋',  '#057a55', '本部_貿易', 10);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('DELIVERY',  '配送管理',        'Delivery Mgmt',    '🚚',  '#e3a008', '配送センター', 11);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('ROUTE',     'ルート最適化',    'Route Optimizer',  '🗺️',  '#e3a008', '配送センター', 12);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('DC_INV',    'DC在庫',          'DC Inventory',     '🏭',  '#c81e1e', 'DC',        13);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('WAREHOUSE', '入出庫管理',      'Warehouse I/O',    '📦',  '#c81e1e', 'DC',        14);
INSERT INTO m_system (system_code, system_name, system_name_en, icon, color, category, sort_order)
VALUES ('EC',        'ECサイト管理',    'EC Site Mgmt',     '🛒',  '#5850ec', 'EC',        15);
COMMIT;

-- ユーザーシステム権限
-- EMP001: 店舗系 admin + 商品カタログ viewer
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP001', system_id, 'admin'  FROM m_system WHERE system_code = 'POS';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP001', system_id, 'admin'  FROM m_system WHERE system_code = 'INVENTORY';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP001', system_id, 'admin'  FROM m_system WHERE system_code = 'SHIFT';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP001', system_id, 'admin'  FROM m_system WHERE system_code = 'SALES_RPT';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP001', system_id, 'viewer' FROM m_system WHERE system_code = 'CATALOG';
-- EMP002: 会計系 admin + 貿易 user
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP002', system_id, 'admin'  FROM m_system WHERE system_code = 'ACCOUNT';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP002', system_id, 'admin'  FROM m_system WHERE system_code = 'INVOICE';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP002', system_id, 'admin'  FROM m_system WHERE system_code = 'BUDGET';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP002', system_id, 'user'   FROM m_system WHERE system_code = 'TRADE';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP002', system_id, 'user'   FROM m_system WHERE system_code = 'CUSTOMS';
-- EMP003: 配送・DC user + EC viewer
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP003', system_id, 'user'   FROM m_system WHERE system_code = 'DELIVERY';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP003', system_id, 'user'   FROM m_system WHERE system_code = 'ROUTE';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP003', system_id, 'user'   FROM m_system WHERE system_code = 'DC_INV';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP003', system_id, 'user'   FROM m_system WHERE system_code = 'WAREHOUSE';
INSERT INTO m_user_system (user_id, system_id, role) SELECT 'EMP003', system_id, 'viewer' FROM m_system WHERE system_code = 'EC';
COMMIT;

-- デモ通知データ
INSERT INTO t_notification (user_id, title, body, is_read, created_at)
VALUES ('EMP001', '月次売上レポートが公開されました', '2026年1月分の月次売上レポートが確定しました。売上レポートシステムよりご確認ください。', 0, CURRENT_TIMESTAMP - INTERVAL '2' HOUR);
INSERT INTO t_notification (user_id, title, body, is_read, created_at)
VALUES ('EMP001', 'シフト申請の承認依頼', '山田 次郎さんから2月のシフト変更申請が届いています。', 0, CURRENT_TIMESTAMP - INTERVAL '5' HOUR);
INSERT INTO t_notification (user_id, title, body, is_read, created_at)
VALUES ('EMP001', 'システムメンテナンスのお知らせ', '2026年6月10日(水) 02:00〜04:00 にシステムメンテナンスを実施します。', 1, CURRENT_TIMESTAMP - INTERVAL '1' DAY);
INSERT INTO t_notification (user_id, title, body, is_read, created_at)
VALUES ('EMP002', '予算超過アラート', '本部_会計部門の先月予算消化率が95%を超えました。詳細は予算管理システムをご確認ください。', 0, CURRENT_TIMESTAMP - INTERVAL '1' HOUR);
INSERT INTO t_notification (user_id, title, body, is_read, created_at)
VALUES ('EMP002', '請求書の承認待ち', '3件の請求書が承認待ちです。', 0, CURRENT_TIMESTAMP - INTERVAL '3' HOUR);
INSERT INTO t_notification (user_id, title, body, is_read, created_at)
VALUES ('EMP003', '配送ルート変更通知', '明日の配送ルートB03が道路工事のため変更されました。', 0, CURRENT_TIMESTAMP - INTERVAL '30' MINUTE);
COMMIT;
