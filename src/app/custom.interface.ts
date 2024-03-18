export interface SubTodo {
    id: number,
    title: string,
    status: "In Progress" | "Complete"
}

export interface Todo {
    id: number,
    title: string,
    status: "In Progress" | "Complete",
    subTodos: SubTodo[]
}