export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    position: string;
    salary: number;
    dateOfJoining: string;
}

export const mockEmployees: Employee[] = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        department: "Engineering",
        position: "Senior Developer",
        salary: 95000,
        dateOfJoining: "2024-01-15"
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        department: "HR",
        position: "HR Manager",
        salary: 85000,
        dateOfJoining: "2024-02-01"
    },
    {
        id: 3,
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.j@example.com",
        department: "Sales",
        position: "Sales Executive",
        salary: 75000,
        dateOfJoining: "2024-03-10"
    },
    {
        id: 4,
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.w@example.com",
        department: "Marketing",
        position: "Marketing Lead",
        salary: 80000,
        dateOfJoining: "2024-02-15"
    }
];