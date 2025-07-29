import Pages from "@/pages/index.jsx"
import "./App.css";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Pages />
      <Toaster />
      <Toaster />
    </>
  )
}

export default App