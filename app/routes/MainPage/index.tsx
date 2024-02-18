import { json, redirect} from "@remix-run/node";
import { useLoaderData,Form } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node"; 
import { commitSession, getSession } from "~/session.server";

interface ToDo {
  id: number;
  text: string;
  completed: boolean; 
}

let todos: ToDo[] = [
  { id: 1, text: 'Learn Remix', completed: false },
  { id: 2, text: 'Build a ToDo List', completed: false },
  { id: 3, text: 'fix errors', completed: false },
];
export const loader = async ({
  request,
}: ActionFunctionArgs)=> {
  const session = await getSession(request.headers.get("Cookie"));
  const todos = session.get("todos") || [
    { id: 1, text: "Learn Remix", completed: false },
    { id: 2, text: "Build a ToDo List", completed: false },
    { id: 3, text: "Fix errors", completed: false },
  ];
  console.log("Session todos before commit:", session.get("todos"));

  return json({ todos });
};

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const action = formData.get("_action")
  switch (action) {
    case "add":
      const newText = formData.get("text") as string ?? ""; 
        const newTodo : ToDo= {
        id: Math.random(),
        text: newText,
        completed: false 
      };
      todos.push(newTodo);
      break;
      case "delete":
        const deleteId = formData.get("id");
        todos = todos.filter(todo => todo.id.toString() !== deleteId);
        break;
        case "markDone":
          const readId = formData.get("id");
          todos = todos.map(todo => 
            todo.id.toString() === readId ? { ...todo, completed: true } : todo
          );
          break;
 
  }
session.set("todos", todos);
const headers = new Headers({
  "Set-Cookie": await commitSession(session),
});
return redirect("/mainpage", { headers });

};

export default function MainPageRoute() {
  const {todos}: ToDo[] = useLoaderData<ToDo[]>();   
   return (
      <div
      style={{
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
      }}
      >
      <h1>To-Do List</h1>
      <ul>
        {todos.map(todo => (
          <li
          style={{ display: "flex", alignItems: "center" }}
          key={todo.id}>
            {todo.text}
            {todo.completed === true ? <span>🏆👏🏻</span> : ""}   
           <div
           style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            marginLeft:"20px",
            gap:"10px"
          }}
           >

           <Form method="post">
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit" name="_action" value="delete">Delete</button>
            </Form>
            <Form method="post" >
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit" name="_action" value="markDone">Mark as Done</button>
            </Form>
           </div>
          </li>
        
        ))}
  <div
  style={{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    marginTop:"20px"
  }}
  >
  <Form method="post">
        <input type="text" name="text" placeholder="New to-do" required />
        <button type="submit" name="_action" value="add">Add To-Do</button>
      </Form>
  </div>
      </ul>
    </div>

    );
  }