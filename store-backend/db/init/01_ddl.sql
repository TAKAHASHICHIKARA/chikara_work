-- エリアマスタ
CREATE TABLE m_area (
    area_code VARCHAR2(10) PRIMARY KEY,
    area_name VARCHAR2(50) NOT NULL
);

-- 拠点マスタ
CREATE TABLE m_branch (
    branch_code VARCHAR2(10) PRIMARY KEY,
    branch_name VARCHAR2(50) NOT NULL,
    area_code   VARCHAR2(10) NOT NULL,
    CONSTRAINT fk_branch_area FOREIGN KEY (area_code) REFERENCES m_area(area_code)
);

-- 日次売上トランザクション
CREATE TABLE t_daily_sales (
    sales_date    DATE           NOT NULL,
    branch_code   VARCHAR2(10)   NOT NULL,
    budget_amount NUMBER(12, 0)  DEFAULT 0 NOT NULL,
    actual_amount NUMBER(12, 0)  DEFAULT 0 NOT NULL,
    PRIMARY KEY (sales_date, branch_code),
    CONSTRAINT fk_sales_branch FOREIGN KEY (branch_code) REFERENCES m_branch(branch_code)
);
