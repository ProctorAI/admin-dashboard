create extension if not exists "uuid-ossp";

create table subject_areas (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create table tests (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    subject_area_id uuid references subject_areas(id),
    duration_minutes integer not null,
    passing_score integer not null,
    is_pro boolean default false,
    total_questions integer not null,
    status text check (status in ('draft', 'published', 'archived')) default 'draft',
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create table questions (
    id uuid primary key default uuid_generate_v4(),
    test_id uuid references tests(id) on delete cascade,
    question_text text not null,
    question_type text check (question_type in ('multiple_choice', 'true_false')) default 'multiple_choice',
    correct_answer text not null,
    explanation text,
    marks integer default 1,
    order_number integer not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create table question_options (
    id uuid primary key default uuid_generate_v4(),
    question_id uuid references questions(id) on delete cascade,
    option_text text not null,
    is_correct boolean default false,
    order_number integer not null,
    created_at timestamp with time zone default now()
);

create table user_test_attempts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id),
    test_id uuid references tests(id),
    start_time timestamp with time zone default now(),
    end_time timestamp with time zone,
    score integer,
    status text check (status in ('in_progress', 'completed', 'abandoned')) default 'in_progress',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(user_id, test_id, start_time)
);

create table user_answers (
    id uuid primary key default uuid_generate_v4(),
    attempt_id uuid references user_test_attempts(id) on delete cascade,
    question_id uuid references questions(id),
    selected_answer text not null,
    is_correct boolean,
    marks_obtained integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

insert into subject_areas (name, description) values
('Operating Systems', 'Fundamentals of OS, Process Management, Memory Management, and more'),
('Data Structures', 'Arrays, Linked Lists, Trees, Graphs, and their implementations'),
('Design and Analysis of Algorithms', 'Algorithm complexity, sorting, searching, dynamic programming'),
('Computer Architecture', 'CPU architecture, memory hierarchy, pipelining, and organization'),
('Computer Networks', 'Network protocols, architecture, security, and applications'),
('Database Management Systems', 'RDBMS concepts, SQL, normalization, and transaction management');

create index idx_tests_subject_area on tests(subject_area_id);
create index idx_questions_test_id on questions(test_id);
create index idx_user_attempts_user_id on user_test_attempts(user_id);
create index idx_user_attempts_test_id on user_test_attempts(test_id);
create index idx_user_answers_attempt_id on user_answers(attempt_id);

create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_tests_updated_at
    before update on tests
    for each row
    execute function update_updated_at_column();

create trigger update_questions_updated_at
    before update on questions
    for each row
    execute function update_updated_at_column();

create trigger update_user_test_attempts_updated_at
    before update on user_test_attempts
    for each row
    execute function update_updated_at_column();
