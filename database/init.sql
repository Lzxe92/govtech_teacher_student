--teacher_student table
ALTER TABLE `teacher_student` ADD UNIQUE( `teacher_id`, `student_id`);
