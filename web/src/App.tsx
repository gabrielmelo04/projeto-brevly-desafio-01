import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import { Redirection } from "./pages/redirection";
import { NotFound } from "./pages/404";

export function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />  
      <Route path="/:shortLink" element={<Redirection />} />
      <Route path="/url/not-found" element={<NotFound />} />
    </Routes>
  )
}
