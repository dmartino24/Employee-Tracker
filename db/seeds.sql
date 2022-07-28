INSERT INTO department (name)
VALUES
('General Management'),
('Finance'),
('Sales'),
('Human Resource');

INSERT INTO role (title, salary, department_id)
VALUES
("Admin Manager", 110000, 1),
("Project Accountant", 90000, 2),
("Staff Accountant", 60000, 2),
("Sales Lead", 90000, 3),
("Sales JR", 50000, 3),
("Human Resource Manager", 90000, 4),
("Human Resource Assistant", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Felx', 'Brown', 1, null),
('Allison', 'Stevens', 2, 1),
('Carl', 'Shoemaker', 3, 2),
('Neil', 'Moore', 4, 1),
('Sam', 'Fields', 5, 4),
('Bob', 'Jefferson', 6, 1),
('Billy', 'Jones', 7, 6);

