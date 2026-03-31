-- IPL 2026 Schedule Seed Data
-- 74 league matches + approximate schedule
-- Times in IST (UTC+5:30), stored as UTC

-- Week 1
INSERT INTO matches (match_number, team_home, team_away, venue, city, start_time, season) VALUES
(1, 'CSK', 'MI', 'MA Chidambaram Stadium', 'Chennai', '2026-03-22 14:00:00+00', 2026),
(2, 'RCB', 'KKR', 'M Chinnaswamy Stadium', 'Bengaluru', '2026-03-23 10:00:00+00', 2026),
(3, 'PBKS', 'DC', 'PCA Stadium', 'Mohali', '2026-03-23 14:00:00+00', 2026),
(4, 'GT', 'LSG', 'Narendra Modi Stadium', 'Ahmedabad', '2026-03-24 14:00:00+00', 2026),
(5, 'SRH', 'RR', 'Rajiv Gandhi Intl Stadium', 'Hyderabad', '2026-03-25 14:00:00+00', 2026),
(6, 'MI', 'RCB', 'Wankhede Stadium', 'Mumbai', '2026-03-26 14:00:00+00', 2026),
(7, 'KKR', 'PBKS', 'Eden Gardens', 'Kolkata', '2026-03-27 14:00:00+00', 2026),

-- Week 2
(8, 'DC', 'GT', 'Arun Jaitley Stadium', 'Delhi', '2026-03-28 10:00:00+00', 2026),
(9, 'LSG', 'SRH', 'BRSABV Ekana Stadium', 'Lucknow', '2026-03-28 14:00:00+00', 2026),
(10, 'RR', 'CSK', 'Sawai Mansingh Stadium', 'Jaipur', '2026-03-29 14:00:00+00', 2026),
(11, 'MI', 'KKR', 'Wankhede Stadium', 'Mumbai', '2026-03-30 14:00:00+00', 2026),
(12, 'RCB', 'PBKS', 'M Chinnaswamy Stadium', 'Bengaluru', '2026-03-31 14:00:00+00', 2026),
(13, 'GT', 'SRH', 'Narendra Modi Stadium', 'Ahmedabad', '2026-04-01 14:00:00+00', 2026),
(14, 'DC', 'RR', 'Arun Jaitley Stadium', 'Delhi', '2026-04-02 14:00:00+00', 2026),

-- Week 3
(15, 'LSG', 'CSK', 'BRSABV Ekana Stadium', 'Lucknow', '2026-04-03 14:00:00+00', 2026),
(16, 'KKR', 'GT', 'Eden Gardens', 'Kolkata', '2026-04-04 10:00:00+00', 2026),
(17, 'PBKS', 'MI', 'PCA Stadium', 'Mohali', '2026-04-04 14:00:00+00', 2026),
(18, 'SRH', 'DC', 'Rajiv Gandhi Intl Stadium', 'Hyderabad', '2026-04-05 14:00:00+00', 2026),
(19, 'RR', 'RCB', 'Sawai Mansingh Stadium', 'Jaipur', '2026-04-06 14:00:00+00', 2026),
(20, 'CSK', 'KKR', 'MA Chidambaram Stadium', 'Chennai', '2026-04-07 14:00:00+00', 2026),
(21, 'MI', 'LSG', 'Wankhede Stadium', 'Mumbai', '2026-04-08 14:00:00+00', 2026),

-- Week 4
(22, 'GT', 'PBKS', 'Narendra Modi Stadium', 'Ahmedabad', '2026-04-09 14:00:00+00', 2026),
(23, 'DC', 'RCB', 'Arun Jaitley Stadium', 'Delhi', '2026-04-10 14:00:00+00', 2026),
(24, 'SRH', 'CSK', 'Rajiv Gandhi Intl Stadium', 'Hyderabad', '2026-04-11 10:00:00+00', 2026),
(25, 'RR', 'MI', 'Sawai Mansingh Stadium', 'Jaipur', '2026-04-11 14:00:00+00', 2026),
(26, 'LSG', 'KKR', 'BRSABV Ekana Stadium', 'Lucknow', '2026-04-12 14:00:00+00', 2026),
(27, 'PBKS', 'SRH', 'PCA Stadium', 'Mohali', '2026-04-13 14:00:00+00', 2026),
(28, 'RCB', 'GT', 'M Chinnaswamy Stadium', 'Bengaluru', '2026-04-14 14:00:00+00', 2026),

-- Week 5
(29, 'CSK', 'DC', 'MA Chidambaram Stadium', 'Chennai', '2026-04-15 14:00:00+00', 2026),
(30, 'KKR', 'RR', 'Eden Gardens', 'Kolkata', '2026-04-16 14:00:00+00', 2026),
(31, 'MI', 'GT', 'Wankhede Stadium', 'Mumbai', '2026-04-17 14:00:00+00', 2026),
(32, 'LSG', 'PBKS', 'BRSABV Ekana Stadium', 'Lucknow', '2026-04-18 10:00:00+00', 2026),
(33, 'SRH', 'RCB', 'Rajiv Gandhi Intl Stadium', 'Hyderabad', '2026-04-18 14:00:00+00', 2026),
(34, 'DC', 'KKR', 'Arun Jaitley Stadium', 'Delhi', '2026-04-19 14:00:00+00', 2026),
(35, 'RR', 'LSG', 'Sawai Mansingh Stadium', 'Jaipur', '2026-04-20 14:00:00+00', 2026),

-- Week 6
(36, 'CSK', 'GT', 'MA Chidambaram Stadium', 'Chennai', '2026-04-21 14:00:00+00', 2026),
(37, 'PBKS', 'RR', 'PCA Stadium', 'Mohali', '2026-04-22 14:00:00+00', 2026),
(38, 'MI', 'SRH', 'Wankhede Stadium', 'Mumbai', '2026-04-23 14:00:00+00', 2026),
(39, 'RCB', 'LSG', 'M Chinnaswamy Stadium', 'Bengaluru', '2026-04-24 14:00:00+00', 2026),
(40, 'KKR', 'CSK', 'Eden Gardens', 'Kolkata', '2026-04-25 10:00:00+00', 2026),
(41, 'GT', 'DC', 'Narendra Modi Stadium', 'Ahmedabad', '2026-04-25 14:00:00+00', 2026),
(42, 'SRH', 'PBKS', 'Rajiv Gandhi Intl Stadium', 'Hyderabad', '2026-04-26 14:00:00+00', 2026),

-- Week 7
(43, 'RR', 'MI', 'Sawai Mansingh Stadium', 'Jaipur', '2026-04-27 14:00:00+00', 2026),
(44, 'DC', 'LSG', 'Arun Jaitley Stadium', 'Delhi', '2026-04-28 14:00:00+00', 2026),
(45, 'RCB', 'CSK', 'M Chinnaswamy Stadium', 'Bengaluru', '2026-04-29 14:00:00+00', 2026),
(46, 'KKR', 'SRH', 'Eden Gardens', 'Kolkata', '2026-04-30 14:00:00+00', 2026),
(47, 'GT', 'RR', 'Narendra Modi Stadium', 'Ahmedabad', '2026-05-01 10:00:00+00', 2026),
(48, 'PBKS', 'RCB', 'PCA Stadium', 'Mohali', '2026-05-01 14:00:00+00', 2026),
(49, 'MI', 'DC', 'Wankhede Stadium', 'Mumbai', '2026-05-02 14:00:00+00', 2026),

-- Week 8
(50, 'LSG', 'GT', 'BRSABV Ekana Stadium', 'Lucknow', '2026-05-03 14:00:00+00', 2026),
(51, 'CSK', 'PBKS', 'MA Chidambaram Stadium', 'Chennai', '2026-05-04 14:00:00+00', 2026),
(52, 'SRH', 'MI', 'Rajiv Gandhi Intl Stadium', 'Hyderabad', '2026-05-05 14:00:00+00', 2026),
(53, 'RR', 'KKR', 'Sawai Mansingh Stadium', 'Jaipur', '2026-05-06 14:00:00+00', 2026),
(54, 'DC', 'PBKS', 'Arun Jaitley Stadium', 'Delhi', '2026-05-07 14:00:00+00', 2026),
(55, 'RCB', 'SRH', 'M Chinnaswamy Stadium', 'Bengaluru', '2026-05-08 10:00:00+00', 2026),
(56, 'LSG', 'RR', 'BRSABV Ekana Stadium', 'Lucknow', '2026-05-08 14:00:00+00', 2026),

-- Week 9
(57, 'CSK', 'RCB', 'MA Chidambaram Stadium', 'Chennai', '2026-05-09 14:00:00+00', 2026),
(58, 'GT', 'KKR', 'Narendra Modi Stadium', 'Ahmedabad', '2026-05-10 14:00:00+00', 2026),
(59, 'MI', 'PBKS', 'Wankhede Stadium', 'Mumbai', '2026-05-11 14:00:00+00', 2026),
(60, 'DC', 'SRH', 'Arun Jaitley Stadium', 'Delhi', '2026-05-12 14:00:00+00', 2026),
(61, 'RR', 'GT', 'Sawai Mansingh Stadium', 'Jaipur', '2026-05-13 14:00:00+00', 2026),
(62, 'KKR', 'LSG', 'Eden Gardens', 'Kolkata', '2026-05-14 14:00:00+00', 2026),
(63, 'PBKS', 'CSK', 'PCA Stadium', 'Mohali', '2026-05-15 10:00:00+00', 2026),

-- Week 10
(64, 'RCB', 'MI', 'M Chinnaswamy Stadium', 'Bengaluru', '2026-05-15 14:00:00+00', 2026),
(65, 'SRH', 'KKR', 'Rajiv Gandhi Intl Stadium', 'Hyderabad', '2026-05-16 14:00:00+00', 2026),
(66, 'GT', 'RCB', 'Narendra Modi Stadium', 'Ahmedabad', '2026-05-17 14:00:00+00', 2026),
(67, 'LSG', 'DC', 'BRSABV Ekana Stadium', 'Lucknow', '2026-05-18 14:00:00+00', 2026),
(68, 'CSK', 'RR', 'MA Chidambaram Stadium', 'Chennai', '2026-05-19 14:00:00+00', 2026),
(69, 'MI', 'SRH', 'Wankhede Stadium', 'Mumbai', '2026-05-20 14:00:00+00', 2026),
(70, 'PBKS', 'GT', 'PCA Stadium', 'Mohali', '2026-05-21 14:00:00+00', 2026),

-- Final league matches
(71, 'KKR', 'RCB', 'Eden Gardens', 'Kolkata', '2026-05-22 10:00:00+00', 2026),
(72, 'RR', 'DC', 'Sawai Mansingh Stadium', 'Jaipur', '2026-05-22 14:00:00+00', 2026),
(73, 'LSG', 'MI', 'BRSABV Ekana Stadium', 'Lucknow', '2026-05-23 14:00:00+00', 2026),
(74, 'CSK', 'SRH', 'MA Chidambaram Stadium', 'Chennai', '2026-05-24 14:00:00+00', 2026);

-- Playoffs (dates approximate)
INSERT INTO matches (match_number, team_home, team_away, venue, city, start_time, season) VALUES
(75, 'TBD', 'TBD', 'Narendra Modi Stadium', 'Ahmedabad', '2026-05-27 14:00:00+00', 2026),
(76, 'TBD', 'TBD', 'MA Chidambaram Stadium', 'Chennai', '2026-05-28 14:00:00+00', 2026),
(77, 'TBD', 'TBD', 'Eden Gardens', 'Kolkata', '2026-05-30 14:00:00+00', 2026),
(78, 'TBD', 'TBD', 'Narendra Modi Stadium', 'Ahmedabad', '2026-06-01 14:00:00+00', 2026);
