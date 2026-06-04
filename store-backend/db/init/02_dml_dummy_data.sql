-- マスタデータ投入
INSERT INTO m_area (area_code, area_name) VALUES ('A01', '関東エリア');
INSERT INTO m_area (area_code, area_name) VALUES ('A02', '関西エリア');

INSERT INTO m_branch (branch_code, branch_name, area_code) VALUES ('B001', '新宿本店', 'A01');
INSERT INTO m_branch (branch_code, branch_name, area_code) VALUES ('B002', '渋谷店',   'A01');
INSERT INTO m_branch (branch_code, branch_name, area_code) VALUES ('B003', '横浜店',   'A01');
INSERT INTO m_branch (branch_code, branch_name, area_code) VALUES ('B004', '梅田店',   'A02');
INSERT INTO m_branch (branch_code, branch_name, area_code) VALUES ('B005', 'なんば店', 'A02');
COMMIT;

-- 2026年1月分（31日間）売上データ自動生成
DECLARE
    v_date   DATE;
    v_budget NUMBER;
    v_actual NUMBER;
BEGIN
    FOR i IN 0..30 LOOP
        v_date := TO_DATE('2026-01-01', 'YYYY-MM-DD') + i;
        FOR cur_branch IN (SELECT branch_code FROM m_branch) LOOP
            v_budget := CASE cur_branch.branch_code
                WHEN 'B001' THEN 1000000
                WHEN 'B004' THEN  900000
                ELSE             500000
            END;
            -- 予算に対して -10% 〜 +20% のランダムなばらつき
            v_actual := v_budget * DBMS_RANDOM.VALUE(0.9, 1.2);
            INSERT INTO t_daily_sales (sales_date, branch_code, budget_amount, actual_amount)
            VALUES (v_date, cur_branch.branch_code, v_budget, ROUND(v_actual));
        END LOOP;
    END LOOP;
    COMMIT;
END;
/
