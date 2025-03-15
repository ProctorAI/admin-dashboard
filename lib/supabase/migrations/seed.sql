DO $$ 
DECLARE
    os_id uuid;
    ds_id uuid;
    algo_id uuid;
    arch_id uuid;
    net_id uuid;
    db_id uuid;
    start_time timestamp;
BEGIN
    start_time := NOW();

    SELECT id INTO os_id FROM subject_areas WHERE name = 'Operating Systems';
    SELECT id INTO ds_id FROM subject_areas WHERE name = 'Data Structures';
    SELECT id INTO algo_id FROM subject_areas WHERE name = 'Design and Analysis of Algorithms';
    SELECT id INTO arch_id FROM subject_areas WHERE name = 'Computer Architecture';
    SELECT id INTO net_id FROM subject_areas WHERE name = 'Computer Networks';
    SELECT id INTO db_id FROM subject_areas WHERE name = 'Database Management Systems';

    WITH test_insert AS (
        INSERT INTO tests (title, description, subject_area_id, duration_minutes, passing_score, is_pro, total_questions, status, start_date, end_date)
        VALUES (
            'Operating Systems Fundamentals',
            'Test your knowledge of OS concepts, process management, and memory management',
            os_id,
            60,
            70,
            false,
            5,
            'published',
            start_time,
            start_time + INTERVAL '30 days'
        ) RETURNING id
    )
    INSERT INTO questions (test_id, question_text, question_type, correct_answer, explanation, marks, order_number)
    SELECT 
        (SELECT id FROM test_insert),
        q.question_text,
        'multiple_choice',
        q.correct_answer,
        q.explanation,
        1,
        q.order_number
    FROM (VALUES
        (1, 'What is a process in operating systems?', 'A program in execution', 'A process is an instance of a program in execution, with its own memory space and system resources'),
        (2, 'Which scheduling algorithm is most suitable for time-sharing systems?', 'Round Robin', 'Round Robin scheduling is ideal for time-sharing as it gives each process a fair time slice'),
        (3, 'What is thrashing in operating systems?', 'Excessive page faults', 'Thrashing occurs when a system spends more time paging than executing processes'),
        (4, 'What is the purpose of a semaphore?', 'Synchronization', 'Semaphores are used for process synchronization and managing access to shared resources'),
        (5, 'Which memory allocation strategy suffers from external fragmentation?', 'First Fit', 'First Fit can lead to external fragmentation as memory blocks become scattered')
    ) AS q(order_number, question_text, correct_answer, explanation);

    WITH test_insert AS (
        INSERT INTO tests (title, description, subject_area_id, duration_minutes, passing_score, is_pro, total_questions, status, start_date, end_date)
        VALUES (
            'Advanced Data Structures',
            'Challenge yourself with complex data structure problems and implementations',
            ds_id,
            90,
            75,
            true,
            5,
            'published',
            start_time + INTERVAL '1 day',
            start_time + INTERVAL '31 days'
        ) RETURNING id
    )
    INSERT INTO questions (test_id, question_text, question_type, correct_answer, explanation, marks, order_number)
    SELECT 
        (SELECT id FROM test_insert),
        q.question_text,
        'multiple_choice',
        q.correct_answer,
        q.explanation,
        1,
        q.order_number
    FROM (VALUES
        (1, 'What is the time complexity of AVL tree insertion?', 'O(log n)', 'AVL tree maintains balance during insertion, resulting in logarithmic time complexity'),
        (2, 'Which data structure is best for implementing a priority queue?', 'Heap', 'Heap provides efficient operations for priority queue implementation'),
        (3, 'What is the space complexity of a trie data structure?', 'O(ALPHABET_SIZE * key_length * N)', 'Trie stores characters of all keys, where N is number of keys'),
        (4, 'When would you use a Red-Black tree over an AVL tree?', 'Frequent insertions/deletions', 'Red-Black trees have less strict balancing, making modifications faster'),
        (5, 'What is the main advantage of a B-tree over a binary search tree?', 'Better for disk access', 'B-trees reduce disk I/O operations in database systems')
    ) AS q(order_number, question_text, correct_answer, explanation);

    WITH test_insert AS (
        INSERT INTO tests (title, description, subject_area_id, duration_minutes, passing_score, is_pro, total_questions, status, start_date, end_date)
        VALUES (
            'Algorithm Design Techniques',
            'Master different algorithm design paradigms and complexity analysis',
            algo_id,
            120,
            80,
            true,
            5,
            'published',
            start_time + INTERVAL '2 days',
            start_time + INTERVAL '32 days'
        ) RETURNING id
    )
    INSERT INTO questions (test_id, question_text, question_type, correct_answer, explanation, marks, order_number)
    SELECT 
        (SELECT id FROM test_insert),
        q.question_text,
        'multiple_choice',
        q.correct_answer,
        q.explanation,
        1,
        q.order_number
    FROM (VALUES
        (1, 'What is the time complexity of Quicksort in average case?', 'O(n log n)', 'Quicksort typically performs n log n comparisons for random input'),
        (2, 'Which algorithm design technique is used in Fibonacci sequence?', 'Dynamic Programming', 'Dynamic Programming avoids recalculating same subproblems'),
        (3, 'What is the main principle of greedy algorithms?', 'Local optimal choice', 'Greedy algorithms make locally optimal choices at each step'),
        (4, 'When is binary search applicable?', 'Sorted arrays', 'Binary search requires sorted input to work correctly'),
        (5, 'What is the time complexity of Dijkstra''s algorithm with min-heap?', 'O((V+E)log V)', 'Using min-heap improves performance for sparse graphs')
    ) AS q(order_number, question_text, correct_answer, explanation);

    WITH test_insert AS (
        INSERT INTO tests (title, description, subject_area_id, duration_minutes, passing_score, is_pro, total_questions, status, start_date, end_date)
        VALUES (
            'Computer Architecture Basics',
            'Learn about CPU design, memory hierarchy, and system organization',
            arch_id,
            45,
            60,
            false,
            5,
            'published',
            start_time + INTERVAL '3 days',
            start_time + INTERVAL '33 days'
        ) RETURNING id
    )
    INSERT INTO questions (test_id, question_text, question_type, correct_answer, explanation, marks, order_number)
    SELECT 
        (SELECT id FROM test_insert),
        q.question_text,
        'multiple_choice',
        q.correct_answer,
        q.explanation,
        1,
        q.order_number
    FROM (VALUES
        (1, 'What is the purpose of cache memory?', 'Reduce memory access time', 'Cache bridges the speed gap between CPU and main memory'),
        (2, 'What is pipelining in CPU design?', 'Parallel instruction processing', 'Pipelining allows multiple instructions to be processed simultaneously'),
        (3, 'What is the role of the ALU?', 'Arithmetic and logical operations', 'ALU performs all arithmetic and logical computations'),
        (4, 'What is virtual memory?', 'Extended RAM using disk', 'Virtual memory uses disk space to extend available RAM'),
        (5, 'What is the function of the control unit?', 'Coordinate CPU operations', 'Control unit manages the execution of instructions')
    ) AS q(order_number, question_text, correct_answer, explanation);

    WITH test_insert AS (
        INSERT INTO tests (title, description, subject_area_id, duration_minutes, passing_score, is_pro, total_questions, status, start_date, end_date)
        VALUES (
            'Computer Networks Fundamentals',
            'Explore networking concepts, protocols, and security',
            net_id,
            60,
            65,
            false,
            5,
            'published',
            start_time + INTERVAL '4 days',
            start_time + INTERVAL '34 days'
        ) RETURNING id
    )
    INSERT INTO questions (test_id, question_text, question_type, correct_answer, explanation, marks, order_number)
    SELECT 
        (SELECT id FROM test_insert),
        q.question_text,
        'multiple_choice',
        q.correct_answer,
        q.explanation,
        1,
        q.order_number
    FROM (VALUES
        (1, 'What is the purpose of DNS?', 'Domain name resolution', 'DNS converts domain names to IP addresses'),
        (2, 'Which layer handles routing in the OSI model?', 'Network Layer', 'Network layer determines the best path for data'),
        (3, 'What is the function of TCP?', 'Reliable data transfer', 'TCP ensures reliable, ordered data delivery'),
        (4, 'What is CSMA/CD?', 'Collision detection protocol', 'CSMA/CD manages network access and handles collisions'),
        (5, 'What is the purpose of a subnet mask?', 'Network address identification', 'Subnet mask identifies network and host portions of IP')
    ) AS q(order_number, question_text, correct_answer, explanation);

    WITH test_insert AS (
        INSERT INTO tests (title, description, subject_area_id, duration_minutes, passing_score, is_pro, total_questions, status, start_date, end_date)
        VALUES (
            'Database Management Systems',
            'Test your knowledge of DBMS concepts, SQL, and normalization',
            db_id,
            75,
            70,
            true,
            5,
            'published',
            start_time + INTERVAL '5 days',
            start_time + INTERVAL '35 days'
        ) RETURNING id
    )
    INSERT INTO questions (test_id, question_text, question_type, correct_answer, explanation, marks, order_number)
    SELECT 
        (SELECT id FROM test_insert),
        q.question_text,
        'multiple_choice',
        q.correct_answer,
        q.explanation,
        1,
        q.order_number
    FROM (VALUES
        (1, 'What is ACID in database transactions?', 'Atomicity, Consistency, Isolation, Durability', 'ACID properties ensure reliable transaction processing'),
        (2, 'What is the purpose of normalization?', 'Reduce data redundancy', 'Normalization organizes data to minimize redundancy'),
        (3, 'What is a foreign key?', 'Reference to another table''s primary key', 'Foreign keys establish relationships between tables'),
        (4, 'What is the difference between INNER and LEFT JOIN?', 'LEFT JOIN includes unmatched rows', 'LEFT JOIN returns all rows from left table'),
        (5, 'What is an index in DBMS?', 'Data structure for fast retrieval', 'Indexes improve query performance')
    ) AS q(order_number, question_text, correct_answer, explanation);

    INSERT INTO question_options (question_id, option_text, is_correct, order_number)
    SELECT 
        q.id,
        CASE o.order_number
            WHEN 1 THEN q.correct_answer
            WHEN 2 THEN 'Incorrect option 1'
            WHEN 3 THEN 'Incorrect option 2'
            WHEN 4 THEN 'Incorrect option 3'
        END,
        CASE o.order_number
            WHEN 1 THEN true
            ELSE false
        END,
        o.order_number
    FROM questions q
    CROSS JOIN (
        SELECT generate_series(1, 4) as order_number
    ) o;

END $$; 