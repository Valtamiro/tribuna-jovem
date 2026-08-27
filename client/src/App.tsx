import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Editorial from "@/pages/Editorial";
import Editions from "@/pages/Editions";
import Gallery from "@/pages/Gallery";
import Home from "@/pages/Home";
import Interviews from "@/pages/Interviews";
import NotFound from "@/pages/NotFound";
import Support from "@/pages/Support";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/edicoes" component={Editions} /><Route path="/entrevistas" component={Interviews} /><Route path="/galeria" component={Gallery} /><Route path="/apoio" component={Support} /><Route path="/editorial" component={Editorial} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
export default App;
