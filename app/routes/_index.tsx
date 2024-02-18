import { Link } from "react-router-dom";

// export const meta: MetaFunction = () => {
//   return [
//     { title: "New Remix App" },
//     { name: "description", content: "Welcome to Remix!" },
//   ];
// };

export default function Index() {
  return (
    <div 
    style={{
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
      gap:"10px"
    }}
    >This is my todo app
      <Link to="mainpage">
        go to main page
      </Link>
    </div>
  );
}
