-- IPL 2026 Player Seed Data
-- ~20 players per team, 10 teams = ~200 players
-- Credit values: 4.0-12.0 (based on typical fantasy value)

-- ============================================================
-- CSK - Chennai Super Kings
-- ============================================================
INSERT INTO players (name, slug, team, role, credit_value, is_overseas, batting_style, bowling_style) VALUES
('MS Dhoni', 'ms-dhoni', 'CSK', 'WK', 8.5, false, 'Right-hand bat', NULL),
('Ruturaj Gaikwad', 'ruturaj-gaikwad', 'CSK', 'BAT', 9.5, false, 'Right-hand bat', NULL),
('Devon Conway', 'devon-conway', 'CSK', 'BAT', 9.0, true, 'Left-hand bat', NULL),
('Shivam Dube', 'shivam-dube', 'CSK', 'AR', 8.5, false, 'Left-hand bat', 'Right-arm medium'),
('Ravindra Jadeja', 'ravindra-jadeja', 'CSK', 'AR', 9.0, false, 'Left-hand bat', 'Left-arm orthodox'),
('Moeen Ali', 'moeen-ali', 'CSK', 'AR', 8.5, true, 'Left-hand bat', 'Right-arm offbreak'),
('Deepak Chahar', 'deepak-chahar', 'CSK', 'BOWL', 8.0, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Tushar Deshpande', 'tushar-deshpande', 'CSK', 'BOWL', 7.0, false, 'Right-hand bat', 'Right-arm fast-medium'),
('Matheesha Pathirana', 'matheesha-pathirana', 'CSK', 'BOWL', 8.5, true, 'Right-hand bat', 'Right-arm fast'),
('Maheesh Theekshana', 'maheesh-theekshana', 'CSK', 'BOWL', 7.5, true, 'Right-hand bat', 'Right-arm offbreak'),
('Ajinkya Rahane', 'ajinkya-rahane', 'CSK', 'BAT', 7.5, false, 'Right-hand bat', NULL),
('Sameer Rizvi', 'sameer-rizvi', 'CSK', 'BAT', 6.0, false, 'Right-hand bat', NULL),
('Rachin Ravindra', 'rachin-ravindra', 'CSK', 'AR', 8.0, true, 'Left-hand bat', 'Left-arm orthodox'),
('Shardul Thakur', 'shardul-thakur', 'CSK', 'BOWL', 7.5, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Simarjeet Singh', 'simarjeet-singh', 'CSK', 'BOWL', 5.5, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Avanish Rao Aravelly', 'avanish-aravelly', 'CSK', 'WK', 5.0, false, 'Right-hand bat', NULL),
('Prashant Solanki', 'prashant-solanki', 'CSK', 'BOWL', 5.5, false, 'Right-hand bat', 'Right-arm legbreak'),
('Nishant Sindhu', 'nishant-sindhu', 'CSK', 'AR', 5.0, false, 'Left-hand bat', 'Left-arm orthodox'),
('Mukesh Choudhary', 'mukesh-choudhary', 'CSK', 'BOWL', 6.0, false, 'Left-hand bat', 'Left-arm medium-fast'),
('Rajvardhan Hangargekar', 'rajvardhan-hangargekar', 'CSK', 'AR', 5.5, false, 'Right-hand bat', 'Right-arm fast-medium');

-- ============================================================
-- MI - Mumbai Indians
-- ============================================================
INSERT INTO players (name, slug, team, role, credit_value, is_overseas, batting_style, bowling_style) VALUES
('Rohit Sharma', 'rohit-sharma', 'MI', 'BAT', 10.0, false, 'Right-hand bat', 'Right-arm offbreak'),
('Ishan Kishan', 'ishan-kishan', 'MI', 'WK', 9.0, false, 'Left-hand bat', NULL),
('Suryakumar Yadav', 'suryakumar-yadav', 'MI', 'BAT', 10.0, false, 'Right-hand bat', NULL),
('Tilak Varma', 'tilak-varma', 'MI', 'BAT', 8.5, false, 'Left-hand bat', NULL),
('Tim David', 'tim-david', 'MI', 'AR', 8.5, true, 'Right-hand bat', 'Right-arm medium'),
('Hardik Pandya', 'hardik-pandya', 'MI', 'AR', 10.0, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Jasprit Bumrah', 'jasprit-bumrah', 'MI', 'BOWL', 10.5, false, 'Right-hand bat', 'Right-arm fast'),
('Piyush Chawla', 'piyush-chawla', 'MI', 'BOWL', 6.5, false, 'Right-hand bat', 'Right-arm legbreak'),
('Gerald Coetzee', 'gerald-coetzee', 'MI', 'BOWL', 8.0, true, 'Right-hand bat', 'Right-arm fast'),
('Romario Shepherd', 'romario-shepherd', 'MI', 'AR', 7.0, true, 'Right-hand bat', 'Right-arm fast-medium'),
('Naman Dhir', 'naman-dhir', 'MI', 'BAT', 6.0, false, 'Right-hand bat', NULL),
('Dewald Brevis', 'dewald-brevis', 'MI', 'BAT', 7.5, true, 'Right-hand bat', 'Right-arm legbreak'),
('Kumar Kartikeya', 'kumar-kartikeya', 'MI', 'BOWL', 6.5, false, 'Right-hand bat', 'Left-arm chinaman'),
('Akash Madhwal', 'akash-madhwal', 'MI', 'BOWL', 6.5, false, 'Right-hand bat', 'Right-arm fast-medium'),
('Nehal Wadhera', 'nehal-wadhera', 'MI', 'BAT', 6.0, false, 'Right-hand bat', NULL),
('Shams Mulani', 'shams-mulani', 'MI', 'AR', 5.5, false, 'Left-hand bat', 'Left-arm orthodox'),
('Arjun Tendulkar', 'arjun-tendulkar', 'MI', 'BOWL', 5.0, false, 'Left-hand bat', 'Left-arm medium-fast'),
('Vishnu Vinod', 'vishnu-vinod', 'MI', 'WK', 5.0, false, 'Right-hand bat', NULL),
('Jason Behrendorff', 'jason-behrendorff', 'MI', 'BOWL', 7.0, true, 'Left-hand bat', 'Left-arm fast'),
('Nuwan Thushara', 'nuwan-thushara', 'MI', 'BOWL', 7.0, true, 'Right-hand bat', 'Right-arm fast');

-- ============================================================
-- RCB - Royal Challengers Bengaluru
-- ============================================================
INSERT INTO players (name, slug, team, role, credit_value, is_overseas, batting_style, bowling_style) VALUES
('Virat Kohli', 'virat-kohli', 'RCB', 'BAT', 11.0, false, 'Right-hand bat', 'Right-arm medium'),
('Faf du Plessis', 'faf-du-plessis', 'RCB', 'BAT', 9.0, true, 'Right-hand bat', NULL),
('Glenn Maxwell', 'glenn-maxwell', 'RCB', 'AR', 9.5, true, 'Right-hand bat', 'Right-arm offbreak'),
('Rajat Patidar', 'rajat-patidar', 'RCB', 'BAT', 8.0, false, 'Right-hand bat', NULL),
('Dinesh Karthik', 'dinesh-karthik', 'RCB', 'WK', 7.5, false, 'Right-hand bat', NULL),
('Anuj Rawat', 'anuj-rawat', 'RCB', 'WK', 6.0, false, 'Left-hand bat', NULL),
('Wanindu Hasaranga', 'wanindu-hasaranga', 'RCB', 'AR', 9.0, true, 'Right-hand bat', 'Right-arm legbreak'),
('Mohammed Siraj', 'mohammed-siraj', 'RCB', 'BOWL', 8.5, false, 'Right-hand bat', 'Right-arm fast'),
('Harshal Patel', 'harshal-patel', 'RCB', 'BOWL', 8.0, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Yash Dayal', 'yash-dayal', 'RCB', 'BOWL', 7.0, false, 'Left-hand bat', 'Left-arm medium-fast'),
('Karn Sharma', 'karn-sharma', 'RCB', 'BOWL', 6.0, false, 'Right-hand bat', 'Right-arm legbreak'),
('Reece Topley', 'reece-topley', 'RCB', 'BOWL', 7.5, true, 'Right-hand bat', 'Left-arm fast-medium'),
('Mahipal Lomror', 'mahipal-lomror', 'RCB', 'AR', 6.5, false, 'Left-hand bat', 'Left-arm orthodox'),
('Suyash Prabhudessai', 'suyash-prabhudessai', 'RCB', 'BAT', 6.0, false, 'Right-hand bat', NULL),
('Himanshu Sharma', 'himanshu-sharma', 'RCB', 'BOWL', 5.5, false, 'Right-hand bat', 'Right-arm legbreak'),
('Rajan Kumar', 'rajan-kumar', 'RCB', 'BOWL', 5.0, false, 'Right-hand bat', 'Right-arm medium'),
('Will Jacks', 'will-jacks', 'RCB', 'AR', 8.5, true, 'Right-hand bat', 'Right-arm offbreak'),
('Tom Curran', 'tom-curran', 'RCB', 'AR', 7.5, true, 'Right-hand bat', 'Right-arm medium-fast'),
('Swapnil Singh', 'swapnil-singh', 'RCB', 'AR', 5.5, false, 'Left-hand bat', 'Left-arm orthodox'),
('Akash Deep', 'akash-deep', 'RCB', 'BOWL', 7.0, false, 'Right-hand bat', 'Right-arm fast-medium');

-- ============================================================
-- KKR - Kolkata Knight Riders
-- ============================================================
INSERT INTO players (name, slug, team, role, credit_value, is_overseas, batting_style, bowling_style) VALUES
('Shreyas Iyer', 'shreyas-iyer', 'KKR', 'BAT', 9.5, false, 'Right-hand bat', NULL),
('Venkatesh Iyer', 'venkatesh-iyer', 'KKR', 'AR', 8.0, false, 'Left-hand bat', 'Right-arm medium'),
('Andre Russell', 'andre-russell', 'KKR', 'AR', 10.0, true, 'Right-hand bat', 'Right-arm fast'),
('Sunil Narine', 'sunil-narine', 'KKR', 'AR', 9.5, true, 'Left-hand bat', 'Right-arm offbreak'),
('Phil Salt', 'phil-salt', 'KKR', 'WK', 9.5, true, 'Right-hand bat', NULL),
('Nitish Rana', 'nitish-rana', 'KKR', 'BAT', 8.0, false, 'Left-hand bat', 'Right-arm offbreak'),
('Rinku Singh', 'rinku-singh', 'KKR', 'BAT', 8.5, false, 'Left-hand bat', NULL),
('Rahmanullah Gurbaz', 'rahmanullah-gurbaz', 'KKR', 'WK', 9.0, true, 'Right-hand bat', NULL),
('Mitchell Starc', 'mitchell-starc', 'KKR', 'BOWL', 10.0, true, 'Left-hand bat', 'Left-arm fast'),
('Varun Chakravarthy', 'varun-chakravarthy', 'KKR', 'BOWL', 8.5, false, 'Right-hand bat', 'Right-arm offbreak'),
('Harshit Rana', 'harshit-rana', 'KKR', 'BOWL', 7.5, false, 'Right-hand bat', 'Right-arm fast'),
('Ramandeep Singh', 'ramandeep-singh', 'KKR', 'AR', 6.5, false, 'Right-hand bat', 'Right-arm medium'),
('Anukul Roy', 'anukul-roy', 'KKR', 'AR', 5.5, false, 'Left-hand bat', 'Left-arm orthodox'),
('Suyash Sharma', 'suyash-sharma', 'KKR', 'BOWL', 5.5, false, 'Right-hand bat', 'Right-arm legbreak'),
('Manish Pandey', 'manish-pandey', 'KKR', 'BAT', 7.0, false, 'Right-hand bat', NULL),
('Vaibhav Arora', 'vaibhav-arora', 'KKR', 'BOWL', 6.5, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Dushmantha Chameera', 'dushmantha-chameera', 'KKR', 'BOWL', 7.0, true, 'Right-hand bat', 'Right-arm fast'),
('Angkrish Raghuvanshi', 'angkrish-raghuvanshi', 'KKR', 'BAT', 5.0, false, 'Right-hand bat', NULL),
('Sherfane Rutherford', 'sherfane-rutherford', 'KKR', 'BAT', 6.5, true, 'Left-hand bat', NULL),
('Kulwant Khejroliya', 'kulwant-khejroliya', 'KKR', 'BOWL', 5.0, false, 'Right-hand bat', 'Left-arm medium-fast');

-- ============================================================
-- DC - Delhi Capitals
-- ============================================================
INSERT INTO players (name, slug, team, role, credit_value, is_overseas, batting_style, bowling_style) VALUES
('Rishabh Pant', 'rishabh-pant', 'DC', 'WK', 10.0, false, 'Left-hand bat', NULL),
('David Warner', 'david-warner', 'DC', 'BAT', 9.5, true, 'Left-hand bat', 'Right-arm legbreak'),
('Prithvi Shaw', 'prithvi-shaw', 'DC', 'BAT', 7.5, false, 'Right-hand bat', NULL),
('Axar Patel', 'axar-patel', 'DC', 'AR', 8.5, false, 'Left-hand bat', 'Left-arm orthodox'),
('Kuldeep Yadav', 'kuldeep-yadav', 'DC', 'BOWL', 8.5, false, 'Left-hand bat', 'Left-arm chinaman'),
('Anrich Nortje', 'anrich-nortje', 'DC', 'BOWL', 8.5, true, 'Right-hand bat', 'Right-arm fast'),
('Mitchell Marsh', 'mitchell-marsh', 'DC', 'AR', 9.0, true, 'Right-hand bat', 'Right-arm medium-fast'),
('Jake Fraser-McGurk', 'jake-fraser-mcgurk', 'DC', 'BAT', 8.0, true, 'Right-hand bat', 'Right-arm legbreak'),
('Khaleel Ahmed', 'khaleel-ahmed', 'DC', 'BOWL', 7.5, false, 'Right-hand bat', 'Left-arm medium-fast'),
('Ishant Sharma', 'ishant-sharma', 'DC', 'BOWL', 6.5, false, 'Right-hand bat', 'Right-arm fast'),
('Abishek Porel', 'abishek-porel', 'DC', 'WK', 6.5, false, 'Left-hand bat', NULL),
('Lalit Yadav', 'lalit-yadav', 'DC', 'AR', 6.0, false, 'Right-hand bat', 'Right-arm offbreak'),
('Tristan Stubbs', 'tristan-stubbs', 'DC', 'BAT', 7.5, true, 'Right-hand bat', NULL),
('Mukesh Kumar', 'mukesh-kumar', 'DC', 'BOWL', 7.0, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Vicky Ostwal', 'vicky-ostwal', 'DC', 'BOWL', 5.5, false, 'Right-hand bat', 'Left-arm orthodox'),
('Sumit Kumar', 'sumit-kumar-dc', 'DC', 'BOWL', 5.0, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Kumar Kushagra', 'kumar-kushagra', 'DC', 'WK', 5.0, false, 'Right-hand bat', NULL),
('Shai Hope', 'shai-hope', 'DC', 'WK', 8.0, true, 'Right-hand bat', NULL),
('Rasikh Salam', 'rasikh-salam', 'DC', 'BOWL', 5.5, false, 'Right-hand bat', 'Right-arm fast'),
('Ricky Bhui', 'ricky-bhui', 'DC', 'BAT', 6.0, false, 'Right-hand bat', NULL);

-- ============================================================
-- PBKS - Punjab Kings
-- ============================================================
INSERT INTO players (name, slug, team, role, credit_value, is_overseas, batting_style, bowling_style) VALUES
('Shikhar Dhawan', 'shikhar-dhawan', 'PBKS', 'BAT', 8.5, false, 'Left-hand bat', NULL),
('Jonny Bairstow', 'jonny-bairstow', 'PBKS', 'WK', 9.0, true, 'Right-hand bat', NULL),
('Liam Livingstone', 'liam-livingstone', 'PBKS', 'AR', 9.0, true, 'Right-hand bat', 'Right-arm legbreak'),
('Sam Curran', 'sam-curran', 'PBKS', 'AR', 9.0, true, 'Left-hand bat', 'Left-arm medium-fast'),
('Jitesh Sharma', 'jitesh-sharma', 'PBKS', 'WK', 7.0, false, 'Right-hand bat', NULL),
('Arshdeep Singh', 'arshdeep-singh', 'PBKS', 'BOWL', 8.5, false, 'Left-hand bat', 'Left-arm fast-medium'),
('Kagiso Rabada', 'kagiso-rabada', 'PBKS', 'BOWL', 9.5, true, 'Right-hand bat', 'Right-arm fast'),
('Rahul Chahar', 'rahul-chahar', 'PBKS', 'BOWL', 7.0, false, 'Right-hand bat', 'Right-arm legbreak'),
('Harpreet Brar', 'harpreet-brar', 'PBKS', 'AR', 6.5, false, 'Left-hand bat', 'Left-arm orthodox'),
('Nathan Ellis', 'nathan-ellis', 'PBKS', 'BOWL', 7.5, true, 'Right-hand bat', 'Right-arm fast-medium'),
('Prabhsimran Singh', 'prabhsimran-singh', 'PBKS', 'WK', 6.5, false, 'Right-hand bat', NULL),
('Rishi Dhawan', 'rishi-dhawan', 'PBKS', 'AR', 6.0, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Atharva Taide', 'atharva-taide', 'PBKS', 'BAT', 5.5, false, 'Left-hand bat', NULL),
('Shashank Singh', 'shashank-singh', 'PBKS', 'AR', 6.5, false, 'Right-hand bat', 'Right-arm medium'),
('Vidwath Kaverappa', 'vidwath-kaverappa', 'PBKS', 'BOWL', 5.5, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Prince Choudhary', 'prince-choudhary', 'PBKS', 'BOWL', 5.0, false, 'Right-hand bat', 'Left-arm medium'),
('Chris Jordan', 'chris-jordan', 'PBKS', 'BOWL', 7.0, true, 'Right-hand bat', 'Right-arm fast-medium'),
('Sikandar Raza', 'sikandar-raza', 'PBKS', 'AR', 7.5, true, 'Right-hand bat', 'Right-arm offbreak'),
('Ashutosh Sharma', 'ashutosh-sharma', 'PBKS', 'AR', 5.5, false, 'Left-hand bat', 'Left-arm orthodox'),
('Tanay Thyagarajan', 'tanay-thyagarajan', 'PBKS', 'BOWL', 5.0, false, 'Left-hand bat', 'Left-arm orthodox');

-- ============================================================
-- RR - Rajasthan Royals
-- ============================================================
INSERT INTO players (name, slug, team, role, credit_value, is_overseas, batting_style, bowling_style) VALUES
('Sanju Samson', 'sanju-samson', 'RR', 'WK', 9.5, false, 'Right-hand bat', NULL),
('Yashasvi Jaiswal', 'yashasvi-jaiswal', 'RR', 'BAT', 10.0, false, 'Left-hand bat', NULL),
('Jos Buttler', 'jos-buttler', 'RR', 'WK', 10.0, true, 'Right-hand bat', NULL),
('Shimron Hetmyer', 'shimron-hetmyer', 'RR', 'BAT', 8.0, true, 'Left-hand bat', NULL),
('Devdutt Padikkal', 'devdutt-padikkal', 'RR', 'BAT', 7.5, false, 'Left-hand bat', NULL),
('Riyan Parag', 'riyan-parag', 'RR', 'AR', 7.5, false, 'Right-hand bat', 'Right-arm offbreak'),
('Ravichandran Ashwin', 'ravichandran-ashwin', 'RR', 'BOWL', 8.0, false, 'Right-hand bat', 'Right-arm offbreak'),
('Trent Boult', 'trent-boult', 'RR', 'BOWL', 9.0, true, 'Right-hand bat', 'Left-arm fast'),
('Yuzvendra Chahal', 'yuzvendra-chahal', 'RR', 'BOWL', 8.5, false, 'Right-hand bat', 'Right-arm legbreak'),
('Sandeep Sharma', 'sandeep-sharma', 'RR', 'BOWL', 6.5, false, 'Right-hand bat', 'Right-arm medium'),
('Dhruv Jurel', 'dhruv-jurel', 'RR', 'WK', 7.0, false, 'Right-hand bat', NULL),
('Navdeep Saini', 'navdeep-saini', 'RR', 'BOWL', 6.5, false, 'Right-hand bat', 'Right-arm fast'),
('Kuldip Sen', 'kuldip-sen', 'RR', 'BOWL', 5.5, false, 'Right-hand bat', 'Right-arm fast'),
('Nandre Burger', 'nandre-burger', 'RR', 'BOWL', 6.5, true, 'Right-hand bat', 'Left-arm fast-medium'),
('Kunal Rathore', 'kunal-rathore', 'RR', 'BAT', 5.0, false, 'Right-hand bat', NULL),
('Abdul Basith', 'abdul-basith', 'RR', 'AR', 5.0, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Donovan Ferreira', 'donovan-ferreira', 'RR', 'BAT', 6.0, true, 'Right-hand bat', NULL),
('Avesh Khan', 'avesh-khan', 'RR', 'BOWL', 7.5, false, 'Right-hand bat', 'Right-arm fast'),
('Tom Kohler-Cadmore', 'tom-kohler-cadmore', 'RR', 'BAT', 6.5, true, 'Right-hand bat', NULL),
('Rovman Powell', 'rovman-powell', 'RR', 'BAT', 7.5, true, 'Right-hand bat', 'Right-arm medium');

-- ============================================================
-- SRH - Sunrisers Hyderabad
-- ============================================================
INSERT INTO players (name, slug, team, role, credit_value, is_overseas, batting_style, bowling_style) VALUES
('Heinrich Klaasen', 'heinrich-klaasen', 'SRH', 'WK', 10.0, true, 'Right-hand bat', NULL),
('Travis Head', 'travis-head', 'SRH', 'BAT', 10.0, true, 'Left-hand bat', NULL),
('Abhishek Sharma', 'abhishek-sharma', 'SRH', 'AR', 8.5, false, 'Left-hand bat', 'Left-arm orthodox'),
('Aiden Markram', 'aiden-markram', 'SRH', 'BAT', 8.0, true, 'Right-hand bat', 'Right-arm offbreak'),
('Rahul Tripathi', 'rahul-tripathi', 'SRH', 'BAT', 7.5, false, 'Right-hand bat', NULL),
('Abdul Samad', 'abdul-samad', 'SRH', 'AR', 7.0, false, 'Right-hand bat', 'Right-arm legbreak'),
('Bhuvneshwar Kumar', 'bhuvneshwar-kumar', 'SRH', 'BOWL', 8.0, false, 'Right-hand bat', 'Right-arm medium'),
('Pat Cummins', 'pat-cummins', 'SRH', 'AR', 10.0, true, 'Right-hand bat', 'Right-arm fast'),
('T Natarajan', 'thangarasu-natarajan', 'SRH', 'BOWL', 7.5, false, 'Left-hand bat', 'Left-arm medium'),
('Umran Malik', 'umran-malik', 'SRH', 'BOWL', 7.5, false, 'Right-hand bat', 'Right-arm fast'),
('Jaydev Unadkat', 'jaydev-unadkat', 'SRH', 'BOWL', 6.5, false, 'Left-hand bat', 'Left-arm medium-fast'),
('Washington Sundar', 'washington-sundar', 'SRH', 'AR', 7.5, false, 'Left-hand bat', 'Right-arm offbreak'),
('Glenn Phillips', 'glenn-phillips', 'SRH', 'WK', 8.0, true, 'Right-hand bat', 'Right-arm offbreak'),
('Mayank Agarwal', 'mayank-agarwal', 'SRH', 'BAT', 7.0, false, 'Right-hand bat', NULL),
('Upendra Yadav', 'upendra-yadav', 'SRH', 'WK', 5.5, false, 'Right-hand bat', NULL),
('Nitish Reddy', 'nitish-reddy', 'SRH', 'AR', 7.0, false, 'Right-hand bat', 'Right-arm medium'),
('Sanvir Singh', 'sanvir-singh', 'SRH', 'BAT', 5.0, false, 'Right-hand bat', NULL),
('Anmolpreet Singh', 'anmolpreet-singh', 'SRH', 'BAT', 5.5, false, 'Right-hand bat', NULL),
('Fazalhaq Farooqi', 'fazalhaq-farooqi', 'SRH', 'BOWL', 8.0, true, 'Right-hand bat', 'Left-arm fast'),
('Marco Jansen', 'marco-jansen', 'SRH', 'AR', 8.5, true, 'Left-hand bat', 'Left-arm fast');

-- ============================================================
-- GT - Gujarat Titans
-- ============================================================
INSERT INTO players (name, slug, team, role, credit_value, is_overseas, batting_style, bowling_style) VALUES
('Shubman Gill', 'shubman-gill', 'GT', 'BAT', 10.0, false, 'Right-hand bat', NULL),
('Wriddhiman Saha', 'wriddhiman-saha', 'GT', 'WK', 7.0, false, 'Right-hand bat', NULL),
('David Miller', 'david-miller', 'GT', 'BAT', 8.5, true, 'Left-hand bat', NULL),
('Kane Williamson', 'kane-williamson', 'GT', 'BAT', 8.0, true, 'Right-hand bat', 'Right-arm offbreak'),
('Rashid Khan', 'rashid-khan', 'GT', 'AR', 10.0, true, 'Right-hand bat', 'Right-arm legbreak'),
('Mohammed Shami', 'mohammed-shami', 'GT', 'BOWL', 9.0, false, 'Right-hand bat', 'Right-arm fast'),
('Noor Ahmad', 'noor-ahmad', 'GT', 'BOWL', 7.0, true, 'Left-hand bat', 'Left-arm chinaman'),
('Sai Sudharsan', 'sai-sudharsan', 'GT', 'BAT', 8.0, false, 'Left-hand bat', NULL),
('Vijay Shankar', 'vijay-shankar', 'GT', 'AR', 6.5, false, 'Right-hand bat', 'Right-arm medium'),
('Darshan Nalkande', 'darshan-nalkande', 'GT', 'AR', 5.5, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Rahul Tewatia', 'rahul-tewatia', 'GT', 'AR', 7.5, false, 'Left-hand bat', 'Right-arm legbreak'),
('Matthew Wade', 'matthew-wade', 'GT', 'WK', 7.0, true, 'Left-hand bat', NULL),
('Mohit Sharma', 'mohit-sharma', 'GT', 'BOWL', 7.0, false, 'Right-hand bat', 'Right-arm medium-fast'),
('Umesh Yadav', 'umesh-yadav', 'GT', 'BOWL', 7.0, false, 'Right-hand bat', 'Right-arm fast'),
('Josh Little', 'josh-little', 'GT', 'BOWL', 7.5, true, 'Left-hand bat', 'Left-arm fast'),
('Abhinav Manohar', 'abhinav-manohar', 'GT', 'BAT', 6.0, false, 'Right-hand bat', NULL),
('Shahrukh Khan', 'shahrukh-khan', 'GT', 'BAT', 7.0, false, 'Right-hand bat', 'Right-arm offbreak'),
('Azmatullah Omarzai', 'azmatullah-omarzai', 'GT', 'AR', 7.5, true, 'Right-hand bat', 'Right-arm medium-fast'),
('Sushant Mishra', 'sushant-mishra', 'GT', 'BOWL', 5.0, false, 'Left-hand bat', 'Left-arm medium'),
('Spencer Johnson', 'spencer-johnson', 'GT', 'BOWL', 7.5, true, 'Left-hand bat', 'Left-arm fast');

-- ============================================================
-- LSG - Lucknow Super Giants
-- ============================================================
INSERT INTO players (name, slug, team, role, credit_value, is_overseas, batting_style, bowling_style) VALUES
('KL Rahul', 'kl-rahul', 'LSG', 'WK', 10.0, false, 'Right-hand bat', NULL),
('Quinton de Kock', 'quinton-de-kock', 'LSG', 'WK', 9.5, true, 'Left-hand bat', NULL),
('Nicholas Pooran', 'nicholas-pooran', 'LSG', 'WK', 9.0, true, 'Left-hand bat', NULL),
('Marcus Stoinis', 'marcus-stoinis', 'LSG', 'AR', 9.0, true, 'Right-hand bat', 'Right-arm medium'),
('Krunal Pandya', 'krunal-pandya', 'LSG', 'AR', 8.0, false, 'Left-hand bat', 'Left-arm orthodox'),
('Deepak Hooda', 'deepak-hooda', 'LSG', 'AR', 7.5, false, 'Right-hand bat', 'Right-arm offbreak'),
('Mark Wood', 'mark-wood', 'LSG', 'BOWL', 9.0, true, 'Right-hand bat', 'Right-arm fast'),
('Ravi Bishnoi', 'ravi-bishnoi', 'LSG', 'BOWL', 8.0, false, 'Right-hand bat', 'Right-arm legbreak'),
('Avesh Khan', 'avesh-khan-lsg', 'LSG', 'BOWL', 7.5, false, 'Right-hand bat', 'Right-arm fast'),
('Mohsin Khan', 'mohsin-khan', 'LSG', 'BOWL', 7.0, false, 'Left-hand bat', 'Left-arm medium-fast'),
('Ayush Badoni', 'ayush-badoni', 'LSG', 'BAT', 7.5, false, 'Right-hand bat', 'Right-arm legbreak'),
('Devdutt Padikkal', 'devdutt-padikkal-lsg', 'LSG', 'BAT', 7.5, false, 'Left-hand bat', NULL),
('Prerak Mankad', 'prerak-mankad', 'LSG', 'AR', 5.5, false, 'Left-hand bat', 'Left-arm orthodox'),
('Yash Thakur', 'yash-thakur', 'LSG', 'BOWL', 6.0, false, 'Right-hand bat', 'Right-arm fast-medium'),
('Naveen ul Haq', 'naveen-ul-haq', 'LSG', 'BOWL', 8.0, true, 'Right-hand bat', 'Right-arm fast'),
('Mayank Yadav', 'mayank-yadav', 'LSG', 'BOWL', 7.5, false, 'Right-hand bat', 'Right-arm fast'),
('Matt Henry', 'matt-henry', 'LSG', 'BOWL', 7.0, true, 'Right-hand bat', 'Right-arm fast-medium'),
('Arshin Kulkarni', 'arshin-kulkarni', 'LSG', 'BAT', 5.5, false, 'Right-hand bat', NULL),
('Manan Vohra', 'manan-vohra', 'LSG', 'BAT', 5.5, false, 'Right-hand bat', NULL),
('Kyle Mayers', 'kyle-mayers', 'LSG', 'AR', 7.5, true, 'Left-hand bat', 'Right-arm medium-fast');

-- Verify count
-- SELECT team, COUNT(*) FROM players GROUP BY team ORDER BY team;
