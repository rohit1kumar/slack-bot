CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY,
      android_manufacturer TEXT,
      android_model TEXT,
      android_os_version TEXT,
      android_app_version TEXT,
      acquisition_campaign TEXT,
      acquisition_source TEXT,
      city TEXT,
      state TEXT,
      onboarding_time DATETIME,
      phone_carrier TEXT,
      phone_screen_dpi INTEGER,
      phone_screen_height INTEGER,
      phone_screen_width INTEGER,
      name TEXT,
      age INTEGER
    );
    
INSERT INTO user (id, android_manufacturer, android_model, android_os_version, android_app_version, acquisition_campaign, acquisition_source, city, state, onboarding_time, phone_carrier, phone_screen_dpi, phone_screen_height, phone_screen_width, name, age)
VALUES
  (1, 'Samsung', 'Galaxy S20', 'Android 11', 'v2.1.0', 'AdCampaign1', 'Google Ads', 'New York', 'NY', '2023-07-18 08:30:00', 'Verizon', 420, 2560, 1440, 'John Doe', 28),
  (2, 'Apple', 'iPhone 12', 'iOS 14', 'v1.5.2', 'AdCampaign2', 'Facebook Ads', 'San Francisco', 'CA', '2023-07-18 09:15:00', 'AT&T', 460, 2532, 1170, 'Jane Smith', 32),
  (3, 'Google', 'Pixel 5', 'Android 12', 'v3.0.1', 'AdCampaign3', 'Instagram Ads', 'Los Angeles', 'CA', '2023-07-18 10:00:00', 'T-Mobile', 400, 2340, 1080, 'Michael Johnson', 24),
  (4, 'OnePlus', '8T', 'Android 11', 'v2.2.5', 'AdCampaign4', 'Twitter Ads', 'Chicago', 'IL', '2023-07-18 11:45:00', 'Sprint', 410, 2400, 1080, 'Emily Williams', 35),
  (5, 'Xiaomi', 'Redmi Note 10', 'Android 10', 'v1.7.3', 'AdCampaign5', 'Snapchat Ads', 'Houston', 'TX', '2023-07-18 12:30:00', 'MetroPCS', 395, 2400, 1080, 'David Lee', 31);
