-- システムマスタ
CREATE TABLE m_system (
    system_id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    system_code    VARCHAR2(20)  NOT NULL UNIQUE,
    system_name    VARCHAR2(100) NOT NULL,
    system_name_en VARCHAR2(100) NOT NULL,
    icon           VARCHAR2(20),
    color          VARCHAR2(20),
    category       VARCHAR2(50),
    sort_order     NUMBER DEFAULT 0
);

-- ユーザーシステム権限
CREATE TABLE m_user_system (
    user_id   VARCHAR2(10) NOT NULL,
    system_id NUMBER       NOT NULL,
    role      VARCHAR2(20) NOT NULL,
    CONSTRAINT pk_user_system PRIMARY KEY (user_id, system_id),
    CONSTRAINT fk_us_system  FOREIGN KEY (system_id) REFERENCES m_system(system_id),
    CONSTRAINT ck_us_role    CHECK (role IN ('admin', 'user', 'viewer'))
);

-- 通知
CREATE TABLE t_notification (
    notification_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         VARCHAR2(10)   NOT NULL,
    title           VARCHAR2(200)  NOT NULL,
    body            VARCHAR2(1000),
    is_read         NUMBER(1)      DEFAULT 0 NOT NULL,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT ck_notif_read CHECK (is_read IN (0, 1))
);
CREATE INDEX idx_notif_user ON t_notification(user_id, is_read);
